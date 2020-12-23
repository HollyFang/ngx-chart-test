import { Component, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, ContentChild } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
export class GaugeComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.legend = false;
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.min = 0;
        this.max = 100;
        this.bigSegments = 10;
        this.smallSegments = 5;
        this.showAxis = true;
        this.startAngle = -120;
        this.angleSpan = 240;
        this.activeEntries = [];
        this.tooltipDisabled = false;
        this.showText = true;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.resizeScale = 1;
        this.rotation = '';
        this.textTransform = 'scale(1, 1)';
        this.cornerRadius = 10;
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => this.scaleText());
    }
    update() {
        super.update();
        if (!this.showAxis) {
            if (!this.margin) {
                this.margin = [10, 20, 10, 20];
            }
        }
        else {
            if (!this.margin) {
                this.margin = [60, 100, 60, 100];
            }
        }
        // make the starting angle positive
        if (this.startAngle < 0) {
            this.startAngle = (this.startAngle % 360) + 360;
        }
        this.angleSpan = Math.min(this.angleSpan, 360);
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showLegend: this.legend,
            legendPosition: this.legendPosition
        });
        this.domain = this.getDomain();
        this.valueDomain = this.getValueDomain();
        this.valueScale = this.getValueScale();
        this.displayValue = this.getDisplayValue();
        this.outerRadius = Math.min(this.dims.width, this.dims.height) / 2;
        this.arcs = this.getArcs();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        const xOffset = this.margin[3] + this.dims.width / 2;
        const yOffset = this.margin[0] + this.dims.height / 2;
        this.transform = `translate(${xOffset}, ${yOffset})`;
        this.rotation = `rotate(${this.startAngle})`;
        setTimeout(() => this.scaleText(), 50);
    }
    getArcs() {
        const arcs = [];
        const availableRadius = this.outerRadius * 0.7;
        const radiusPerArc = Math.min(availableRadius / this.results.length, 10);
        const arcWidth = radiusPerArc * 0.7;
        this.textRadius = this.outerRadius - this.results.length * radiusPerArc;
        this.cornerRadius = Math.floor(arcWidth / 2);
        let i = 0;
        for (const d of this.results) {
            const outerRadius = this.outerRadius - i * radiusPerArc;
            const innerRadius = outerRadius - arcWidth;
            const backgroundArc = {
                endAngle: (this.angleSpan * Math.PI) / 180,
                innerRadius,
                outerRadius,
                data: {
                    value: this.max,
                    name: d.name
                }
            };
            const valueArc = {
                endAngle: (Math.min(this.valueScale(d.value), this.angleSpan) * Math.PI) / 180,
                innerRadius,
                outerRadius,
                data: {
                    value: d.value,
                    name: d.name
                }
            };
            const arc = {
                backgroundArc,
                valueArc
            };
            arcs.push(arc);
            i++;
        }
        return arcs;
    }
    getDomain() {
        return this.results.map(d => d.name);
    }
    getValueDomain() {
        const values = this.results.map(d => d.value);
        const dataMin = Math.min(...values);
        const dataMax = Math.max(...values);
        if (this.min !== undefined) {
            this.min = Math.min(this.min, dataMin);
        }
        else {
            this.min = dataMin;
        }
        if (this.max !== undefined) {
            this.max = Math.max(this.max, dataMax);
        }
        else {
            this.max = dataMax;
        }
        return [this.min, this.max];
    }
    getValueScale() {
        return scaleLinear().range([0, this.angleSpan]).nice().domain(this.valueDomain);
    }
    getDisplayValue() {
        const value = this.results.map(d => d.value).reduce((a, b) => a + b, 0);
        if (this.textValue && 0 !== this.textValue.length) {
            return this.textValue.toLocaleString();
        }
        if (this.valueFormatting) {
            return this.valueFormatting(value);
        }
        return value.toLocaleString();
    }
    scaleText(repeat = true) {
        if (!this.showText) {
            return;
        }
        const { width } = this.textEl.nativeElement.getBoundingClientRect();
        const oldScale = this.resizeScale;
        if (width === 0) {
            this.resizeScale = 1;
        }
        else {
            const availableSpace = this.textRadius;
            this.resizeScale = Math.floor((availableSpace / (width / this.resizeScale)) * 100) / 100;
        }
        if (this.resizeScale !== oldScale) {
            this.textTransform = `scale(${this.resizeScale}, ${this.resizeScale})`;
            this.cd.markForCheck();
            if (repeat) {
                setTimeout(() => this.scaleText(false), 50);
            }
        }
    }
    onClick(data) {
        this.select.emit(data);
    }
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            colors: this.colors,
            domain: this.domain,
            title: this.legendTitle,
            position: this.legendPosition
        };
    }
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
    }
    onActivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item, ...this.activeEntries];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }
    onDeactivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name && entry.series === d.series;
        });
        return item !== undefined;
    }
    trackBy(index, item) {
        return item.valueArc.data.name;
    }
}
GaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-gauge',
                template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelClick)="onClick($event)"
      (legendLabelActivate)="onActivate($event)"
      (legendLabelDeactivate)="onDeactivate($event)"
    >
      <svg:g [attr.transform]="transform" class="gauge chart">
        <svg:g *ngFor="let arc of arcs; trackBy: trackBy" [attr.transform]="rotation">
          <svg:g
            ngx-charts-gauge-arc
            [backgroundArc]="arc.backgroundArc"
            [valueArc]="arc.valueArc"
            [cornerRadius]="cornerRadius"
            [colors]="colors"
            [isActive]="isActive(arc.valueArc.data)"
            [tooltipDisabled]="tooltipDisabled"
            [tooltipTemplate]="tooltipTemplate"
            [valueFormatting]="valueFormatting"
            [animations]="animations"
            (select)="onClick($event)"
            (activate)="onActivate($event)"
            (deactivate)="onDeactivate($event)"
          ></svg:g>
        </svg:g>

        <svg:g
          ngx-charts-gauge-axis
          *ngIf="showAxis"
          [bigSegments]="bigSegments"
          [smallSegments]="smallSegments"
          [min]="min"
          [max]="max"
          [radius]="outerRadius"
          [angleSpan]="angleSpan"
          [valueScale]="valueScale"
          [startAngle]="startAngle"
          [tickFormatting]="axisTickFormatting"
        ></svg:g>

        <svg:text
          #textEl
          *ngIf="showText"
          [style.textAnchor]="'middle'"
          [attr.transform]="textTransform"
          alignment-baseline="central"
        >
          <tspan x="0" dy="0">{{ displayValue }}</tspan>
          <tspan x="0" dy="1.2em">{{ units }}</tspan>
        </svg:text>
      </svg:g>
    </ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".gauge .background-arc path{fill:rgba(0,0,0,.05)}.gauge .gauge-tick path{stroke:#666}.gauge .gauge-tick text{fill:#666;font-size:12px;font-weight:700}.gauge .gauge-tick-large path{stroke-width:2px}.gauge .gauge-tick-small path{stroke-width:1px}"]
            },] }
];
GaugeComponent.propDecorators = {
    legend: [{ type: Input }],
    legendTitle: [{ type: Input }],
    legendPosition: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    textValue: [{ type: Input }],
    units: [{ type: Input }],
    bigSegments: [{ type: Input }],
    smallSegments: [{ type: Input }],
    results: [{ type: Input }],
    showAxis: [{ type: Input }],
    startAngle: [{ type: Input }],
    angleSpan: [{ type: Input }],
    activeEntries: [{ type: Input }],
    axisTickFormatting: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    showText: [{ type: Input }],
    margin: [{ type: Input }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    tooltipTemplate: [{ type: ContentChild, args: ['tooltipTemplate',] }],
    textEl: [{ type: ViewChild, args: ['textEl',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2dhdWdlL2dhdWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxTQUFTLEVBRVQsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXZDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSx1QkFBdUIsRUFBa0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFpRXJELE1BQU0sT0FBTyxjQUFlLFNBQVEsa0JBQWtCO0lBL0R0RDs7UUFnRVcsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsT0FBTyxDQUFDO1FBQ2pDLFFBQUcsR0FBVyxDQUFDLENBQUM7UUFDaEIsUUFBRyxHQUFXLEdBQUcsQ0FBQztRQUdsQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUUxQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLGVBQVUsR0FBVyxDQUFDLEdBQUcsQ0FBQztRQUMxQixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBQ3hCLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1FBRTFCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBRWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFLeEIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGVB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WUFBWSxTQUFDLGlCQUFpQjtxQkFFOUIsU0FBUyxTQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBFbGVtZW50UmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgQ29udGVudENoaWxkLFxyXG4gIFRlbXBsYXRlUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHNjYWxlTGluZWFyIH0gZnJvbSAnZDMtc2NhbGUnO1xyXG5cclxuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xyXG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jb2xvci5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtY2hhcnRzLWdhdWdlJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPG5neC1jaGFydHMtY2hhcnRcclxuICAgICAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcclxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcclxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXHJcbiAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxyXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcclxuICAgICAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcclxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICA+XHJcbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCIgY2xhc3M9XCJnYXVnZSBjaGFydFwiPlxyXG4gICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgYXJjIG9mIGFyY3M7IHRyYWNrQnk6IHRyYWNrQnlcIiBbYXR0ci50cmFuc2Zvcm1dPVwicm90YXRpb25cIj5cclxuICAgICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgICBuZ3gtY2hhcnRzLWdhdWdlLWFyY1xyXG4gICAgICAgICAgICBbYmFja2dyb3VuZEFyY109XCJhcmMuYmFja2dyb3VuZEFyY1wiXHJcbiAgICAgICAgICAgIFt2YWx1ZUFyY109XCJhcmMudmFsdWVBcmNcIlxyXG4gICAgICAgICAgICBbY29ybmVyUmFkaXVzXT1cImNvcm5lclJhZGl1c1wiXHJcbiAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcclxuICAgICAgICAgICAgW2lzQWN0aXZlXT1cImlzQWN0aXZlKGFyYy52YWx1ZUFyYy5kYXRhKVwiXHJcbiAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbdmFsdWVGb3JtYXR0aW5nXT1cInZhbHVlRm9ybWF0dGluZ1wiXHJcbiAgICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAgICAgICAoc2VsZWN0KT1cIm9uQ2xpY2soJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICA+PC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMtZ2F1Z2UtYXhpc1xyXG4gICAgICAgICAgKm5nSWY9XCJzaG93QXhpc1wiXHJcbiAgICAgICAgICBbYmlnU2VnbWVudHNdPVwiYmlnU2VnbWVudHNcIlxyXG4gICAgICAgICAgW3NtYWxsU2VnbWVudHNdPVwic21hbGxTZWdtZW50c1wiXHJcbiAgICAgICAgICBbbWluXT1cIm1pblwiXHJcbiAgICAgICAgICBbbWF4XT1cIm1heFwiXHJcbiAgICAgICAgICBbcmFkaXVzXT1cIm91dGVyUmFkaXVzXCJcclxuICAgICAgICAgIFthbmdsZVNwYW5dPVwiYW5nbGVTcGFuXCJcclxuICAgICAgICAgIFt2YWx1ZVNjYWxlXT1cInZhbHVlU2NhbGVcIlxyXG4gICAgICAgICAgW3N0YXJ0QW5nbGVdPVwic3RhcnRBbmdsZVwiXHJcbiAgICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwiYXhpc1RpY2tGb3JtYXR0aW5nXCJcclxuICAgICAgICA+PC9zdmc6Zz5cclxuXHJcbiAgICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgICAjdGV4dEVsXHJcbiAgICAgICAgICAqbmdJZj1cInNob3dUZXh0XCJcclxuICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cIidtaWRkbGUnXCJcclxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0ZXh0VHJhbnNmb3JtXCJcclxuICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIDx0c3BhbiB4PVwiMFwiIGR5PVwiMFwiPnt7IGRpc3BsYXlWYWx1ZSB9fTwvdHNwYW4+XHJcbiAgICAgICAgICA8dHNwYW4geD1cIjBcIiBkeT1cIjEuMmVtXCI+e3sgdW5pdHMgfX08L3RzcGFuPlxyXG4gICAgICAgIDwvc3ZnOnRleHQ+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnLCAnLi9nYXVnZS5jb21wb25lbnQuc2NzcyddLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIEdhdWdlQ29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgbGVnZW5kID0gZmFsc2U7XHJcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xyXG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xyXG4gIEBJbnB1dCgpIG1pbjogbnVtYmVyID0gMDtcclxuICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDEwMDtcclxuICBASW5wdXQoKSB0ZXh0VmFsdWU6IHN0cmluZztcclxuICBASW5wdXQoKSB1bml0czogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGJpZ1NlZ21lbnRzOiBudW1iZXIgPSAxMDtcclxuICBASW5wdXQoKSBzbWFsbFNlZ21lbnRzOiBudW1iZXIgPSA1O1xyXG4gIEBJbnB1dCgpIHJlc3VsdHM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIHNob3dBeGlzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXIgPSAtMTIwO1xyXG4gIEBJbnB1dCgpIGFuZ2xlU3BhbjogbnVtYmVyID0gMjQwO1xyXG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcbiAgQElucHV0KCkgYXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiAodmFsdWU6IGFueSkgPT4gc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHNob3dUZXh0OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLy8gU3BlY2lmeSBtYXJnaW5zXHJcbiAgQElucHV0KCkgbWFyZ2luOiBhbnlbXTtcclxuXHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQFZpZXdDaGlsZCgndGV4dEVsJykgdGV4dEVsOiBFbGVtZW50UmVmO1xyXG5cclxuICBkaW1zOiBWaWV3RGltZW5zaW9ucztcclxuICBkb21haW46IGFueVtdO1xyXG4gIHZhbHVlRG9tYWluOiBhbnk7XHJcbiAgdmFsdWVTY2FsZTogYW55O1xyXG5cclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIHRyYW5zZm9ybTogc3RyaW5nO1xyXG5cclxuICBvdXRlclJhZGl1czogbnVtYmVyO1xyXG4gIHRleHRSYWRpdXM6IG51bWJlcjsgLy8gbWF4IGF2YWlsYWJsZSByYWRpdXMgZm9yIHRoZSB0ZXh0XHJcbiAgcmVzaXplU2NhbGU6IG51bWJlciA9IDE7XHJcbiAgcm90YXRpb246IHN0cmluZyA9ICcnO1xyXG4gIHRleHRUcmFuc2Zvcm06IHN0cmluZyA9ICdzY2FsZSgxLCAxKSc7XHJcbiAgY29ybmVyUmFkaXVzOiBudW1iZXIgPSAxMDtcclxuICBhcmNzOiBhbnlbXTtcclxuICBkaXNwbGF5VmFsdWU6IHN0cmluZztcclxuICBsZWdlbmRPcHRpb25zOiBhbnk7XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgpKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5zaG93QXhpcykge1xyXG4gICAgICBpZiAoIXRoaXMubWFyZ2luKSB7XHJcbiAgICAgICAgdGhpcy5tYXJnaW4gPSBbMTAsIDIwLCAxMCwgMjBdO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMubWFyZ2luKSB7XHJcbiAgICAgICAgdGhpcy5tYXJnaW4gPSBbNjAsIDEwMCwgNjAsIDEwMF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBtYWtlIHRoZSBzdGFydGluZyBhbmdsZSBwb3NpdGl2ZVxyXG4gICAgaWYgKHRoaXMuc3RhcnRBbmdsZSA8IDApIHtcclxuICAgICAgdGhpcy5zdGFydEFuZ2xlID0gKHRoaXMuc3RhcnRBbmdsZSAlIDM2MCkgKyAzNjA7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hbmdsZVNwYW4gPSBNYXRoLm1pbih0aGlzLmFuZ2xlU3BhbiwgMzYwKTtcclxuXHJcbiAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcclxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXHJcbiAgICAgIGxlZ2VuZFBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmRvbWFpbiA9IHRoaXMuZ2V0RG9tYWluKCk7XHJcbiAgICB0aGlzLnZhbHVlRG9tYWluID0gdGhpcy5nZXRWYWx1ZURvbWFpbigpO1xyXG4gICAgdGhpcy52YWx1ZVNjYWxlID0gdGhpcy5nZXRWYWx1ZVNjYWxlKCk7XHJcbiAgICB0aGlzLmRpc3BsYXlWYWx1ZSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKCk7XHJcblxyXG4gICAgdGhpcy5vdXRlclJhZGl1cyA9IE1hdGgubWluKHRoaXMuZGltcy53aWR0aCwgdGhpcy5kaW1zLmhlaWdodCkgLyAyO1xyXG5cclxuICAgIHRoaXMuYXJjcyA9IHRoaXMuZ2V0QXJjcygpO1xyXG5cclxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XHJcbiAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcclxuXHJcbiAgICBjb25zdCB4T2Zmc2V0ID0gdGhpcy5tYXJnaW5bM10gKyB0aGlzLmRpbXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeU9mZnNldCA9IHRoaXMubWFyZ2luWzBdICsgdGhpcy5kaW1zLmhlaWdodCAvIDI7XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eE9mZnNldH0sICR7eU9mZnNldH0pYDtcclxuICAgIHRoaXMucm90YXRpb24gPSBgcm90YXRlKCR7dGhpcy5zdGFydEFuZ2xlfSlgO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgpLCA1MCk7XHJcbiAgfVxyXG5cclxuICBnZXRBcmNzKCk6IGFueVtdIHtcclxuICAgIGNvbnN0IGFyY3MgPSBbXTtcclxuXHJcbiAgICBjb25zdCBhdmFpbGFibGVSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzICogMC43O1xyXG5cclxuICAgIGNvbnN0IHJhZGl1c1BlckFyYyA9IE1hdGgubWluKGF2YWlsYWJsZVJhZGl1cyAvIHRoaXMucmVzdWx0cy5sZW5ndGgsIDEwKTtcclxuICAgIGNvbnN0IGFyY1dpZHRoID0gcmFkaXVzUGVyQXJjICogMC43O1xyXG4gICAgdGhpcy50ZXh0UmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cyAtIHRoaXMucmVzdWx0cy5sZW5ndGggKiByYWRpdXNQZXJBcmM7XHJcbiAgICB0aGlzLmNvcm5lclJhZGl1cyA9IE1hdGguZmxvb3IoYXJjV2lkdGggLyAyKTtcclxuXHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICBmb3IgKGNvbnN0IGQgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGNvbnN0IG91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cyAtIGkgKiByYWRpdXNQZXJBcmM7XHJcbiAgICAgIGNvbnN0IGlubmVyUmFkaXVzID0gb3V0ZXJSYWRpdXMgLSBhcmNXaWR0aDtcclxuXHJcbiAgICAgIGNvbnN0IGJhY2tncm91bmRBcmMgPSB7XHJcbiAgICAgICAgZW5kQW5nbGU6ICh0aGlzLmFuZ2xlU3BhbiAqIE1hdGguUEkpIC8gMTgwLFxyXG4gICAgICAgIGlubmVyUmFkaXVzLFxyXG4gICAgICAgIG91dGVyUmFkaXVzLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLm1heCxcclxuICAgICAgICAgIG5hbWU6IGQubmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlQXJjID0ge1xyXG4gICAgICAgIGVuZEFuZ2xlOiAoTWF0aC5taW4odGhpcy52YWx1ZVNjYWxlKGQudmFsdWUpLCB0aGlzLmFuZ2xlU3BhbikgKiBNYXRoLlBJKSAvIDE4MCxcclxuICAgICAgICBpbm5lclJhZGl1cyxcclxuICAgICAgICBvdXRlclJhZGl1cyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZC52YWx1ZSxcclxuICAgICAgICAgIG5hbWU6IGQubmFtZVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGFyYyA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kQXJjLFxyXG4gICAgICAgIHZhbHVlQXJjXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBhcmNzLnB1c2goYXJjKTtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcmNzO1xyXG4gIH1cclxuXHJcbiAgZ2V0RG9tYWluKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC5uYW1lKTtcclxuICB9XHJcblxyXG4gIGdldFZhbHVlRG9tYWluKCk6IGFueVtdIHtcclxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLnZhbHVlKTtcclxuICAgIGNvbnN0IGRhdGFNaW4gPSBNYXRoLm1pbiguLi52YWx1ZXMpO1xyXG4gICAgY29uc3QgZGF0YU1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcblxyXG4gICAgaWYgKHRoaXMubWluICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5taW4gPSBNYXRoLm1pbih0aGlzLm1pbiwgZGF0YU1pbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1pbiA9IGRhdGFNaW47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5tYXggPSBNYXRoLm1heCh0aGlzLm1heCwgZGF0YU1heCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1heCA9IGRhdGFNYXg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFt0aGlzLm1pbiwgdGhpcy5tYXhdO1xyXG4gIH1cclxuXHJcbiAgZ2V0VmFsdWVTY2FsZSgpOiBhbnkge1xyXG4gICAgcmV0dXJuIHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuYW5nbGVTcGFuXSkubmljZSgpLmRvbWFpbih0aGlzLnZhbHVlRG9tYWluKTtcclxuICB9XHJcblxyXG4gIGdldERpc3BsYXlWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlc3VsdHMubWFwKGQgPT4gZC52YWx1ZSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcblxyXG4gICAgaWYgKHRoaXMudGV4dFZhbHVlICYmIDAgIT09IHRoaXMudGV4dFZhbHVlLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50ZXh0VmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52YWx1ZUZvcm1hdHRpbmcpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWVGb3JtYXR0aW5nKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHNjYWxlVGV4dChyZXBlYXQ6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuc2hvd1RleHQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyB3aWR0aCB9ID0gdGhpcy50ZXh0RWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IG9sZFNjYWxlID0gdGhpcy5yZXNpemVTY2FsZTtcclxuXHJcbiAgICBpZiAod2lkdGggPT09IDApIHtcclxuICAgICAgdGhpcy5yZXNpemVTY2FsZSA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBhdmFpbGFibGVTcGFjZSA9IHRoaXMudGV4dFJhZGl1cztcclxuICAgICAgdGhpcy5yZXNpemVTY2FsZSA9IE1hdGguZmxvb3IoKGF2YWlsYWJsZVNwYWNlIC8gKHdpZHRoIC8gdGhpcy5yZXNpemVTY2FsZSkpICogMTAwKSAvIDEwMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXNpemVTY2FsZSAhPT0gb2xkU2NhbGUpIHtcclxuICAgICAgdGhpcy50ZXh0VHJhbnNmb3JtID0gYHNjYWxlKCR7dGhpcy5yZXNpemVTY2FsZX0sICR7dGhpcy5yZXNpemVTY2FsZX0pYDtcclxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgICAgaWYgKHJlcGVhdCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zY2FsZVRleHQoZmFsc2UpLCA1MCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZGF0YSk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChkYXRhKTtcclxuICB9XHJcblxyXG4gIGdldExlZ2VuZE9wdGlvbnMoKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxyXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzLFxyXG4gICAgICBkb21haW46IHRoaXMuZG9tYWluLFxyXG4gICAgICB0aXRsZTogdGhpcy5sZWdlbmRUaXRsZSxcclxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLmRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgb25BY3RpdmF0ZShpdGVtKTogdm9pZCB7XHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xyXG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGlkeCA+IC0xKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbaXRlbSwgLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBvbkRlYWN0aXZhdGUoaXRlbSk6IHZvaWQge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcclxuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZSAmJiBlbnRyeS5zZXJpZXMgPT09IGQuc2VyaWVzO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gaXRlbSAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgdHJhY2tCeShpbmRleCwgaXRlbSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaXRlbS52YWx1ZUFyYy5kYXRhLm5hbWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==