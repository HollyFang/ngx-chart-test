import { Component, Input, Output, ViewEncapsulation, EventEmitter, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
export class PieChartComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.labels = false;
        this.legend = false;
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.explodeSlices = false;
        this.doughnut = false;
        this.arcWidth = 0.25;
        this.activeEntries = [];
        this.tooltipDisabled = false;
        this.trimLabels = true;
        this.maxLabelLength = 10;
        this.dblclick = new EventEmitter();
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
    }
    update() {
        super.update();
        if (this.labels && this.hasNoOptionalMarginsSet()) {
            this.margins = [30, 80, 30, 80];
        }
        else if (!this.labels && this.hasNoOptionalMarginsSet()) {
            // default value for margins
            this.margins = [20, 20, 20, 20];
        }
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margins,
            showLegend: this.legend,
            legendPosition: this.legendPosition
        });
        this.formatDates();
        const xOffset = this.margins[3] + this.dims.width / 2;
        const yOffset = this.margins[0] + this.dims.height / 2;
        this.translation = `translate(${xOffset}, ${yOffset})`;
        this.outerRadius = Math.min(this.dims.width, this.dims.height);
        if (this.labels) {
            // make room for labels
            this.outerRadius /= 3;
        }
        else {
            this.outerRadius /= 2;
        }
        this.innerRadius = 0;
        if (this.doughnut) {
            this.innerRadius = this.outerRadius * (1 - this.arcWidth);
        }
        this.domain = this.getDomain();
        // sort data according to domain
        this.data = this.results.sort((a, b) => {
            return this.domain.indexOf(a.name) - this.domain.indexOf(b.name);
        });
        this.setColors();
        this.legendOptions = this.getLegendOptions();
    }
    getDomain() {
        return this.results.map(d => d.label);
    }
    onClick(data) {
        this.select.emit(data);
    }
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
    }
    getLegendOptions() {
        return {
            scaleType: 'ordinal',
            domain: this.domain,
            colors: this.colors,
            title: this.legendTitle,
            position: this.legendPosition
        };
    }
    onActivate(item, fromLegend = false) {
        item = this.results.find(d => {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item, ...this.activeEntries];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }
    onDeactivate(item, fromLegend = false) {
        item = this.results.find(d => {
            if (fromLegend) {
                return d.label === item.name;
            }
            else {
                return d.name === item.name;
            }
        });
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value && d.series === item.series;
        });
        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];
        this.deactivate.emit({ value: item, entries: this.activeEntries });
    }
    hasNoOptionalMarginsSet() {
        return !this.margins || this.margins.length <= 0;
    }
}
PieChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-pie-chart',
                template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="legend"
      [legendOptions]="legendOptions"
      [activeEntries]="activeEntries"
      [animations]="animations"
      (legendLabelActivate)="onActivate($event, true)"
      (legendLabelDeactivate)="onDeactivate($event, true)"
      (legendLabelClick)="onClick($event)"
    >
      <svg:g [attr.transform]="translation" class="pie-chart chart">
        <svg:g
          ngx-charts-pie-series
          [colors]="colors"
          [series]="data"
          [showLabels]="labels"
          [labelFormatting]="labelFormatting"
          [trimLabels]="trimLabels"
          [maxLabelLength]="maxLabelLength"
          [activeEntries]="activeEntries"
          [innerRadius]="innerRadius"
          [outerRadius]="outerRadius"
          [explodeSlices]="explodeSlices"
          [gradient]="gradient"
          [animations]="animations"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipText]="tooltipText"
          (dblclick)="dblclick.emit($event)"
          (select)="onClick($event)"
          (activate)="onActivate($event)"
          (deactivate)="onDeactivate($event)"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".pie-label{font-size:11px}.pie-label.animation{-webkit-animation:fadeIn .75s ease-in;animation:fadeIn .75s ease-in}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.pie-label-line{stroke-dasharray:100%}.pie-label-line.animation{-webkit-animation:drawOut 3s linear;animation:drawOut 3s linear;transition:d .75s}@-webkit-keyframes drawOut{0%{stroke-dashoffset:100%}to{stroke-dashoffset:0}}@keyframes drawOut{0%{stroke-dashoffset:100%}to{stroke-dashoffset:0}}"]
            },] }
];
PieChartComponent.propDecorators = {
    labels: [{ type: Input }],
    legend: [{ type: Input }],
    legendTitle: [{ type: Input }],
    legendPosition: [{ type: Input }],
    explodeSlices: [{ type: Input }],
    doughnut: [{ type: Input }],
    arcWidth: [{ type: Input }],
    gradient: [{ type: Input }],
    activeEntries: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    trimLabels: [{ type: Input }],
    maxLabelLength: [{ type: Input }],
    tooltipText: [{ type: Input }],
    dblclick: [{ type: Output }],
    margins: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    tooltipTemplate: [{ type: ContentChild, args: ['tooltipTemplate',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9waWUtY2hhcnQvcGllLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFlBQVksRUFDWix1QkFBdUIsRUFDdkIsWUFBWSxFQUViLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQThDcEUsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGtCQUFrQjtJQTNDekQ7O1FBNENXLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsZ0JBQVcsR0FBVyxRQUFRLENBQUM7UUFDL0IsbUJBQWMsR0FBVyxPQUFPLENBQUM7UUFDakMsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFDdEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWhCLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1FBQzFCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBRWpDLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFFM0IsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHOUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUs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TyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7WUF6TEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0NUO2dCQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztxQkFFRSxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFDTCxLQUFLOzhCQUNMLEtBQUs7eUJBQ0wsS0FBSzs2QkFDTCxLQUFLOzBCQUNMLEtBQUs7dUJBQ0wsTUFBTTtzQkFFTixLQUFLO3FCQUNMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNOzhCQUVOLFlBQVksU0FBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBUZW1wbGF0ZVJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyB9IGZyb20gJy4uL2NvbW1vbi92aWV3LWRpbWVuc2lvbnMuaGVscGVyJztcclxuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcclxuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGF0YUl0ZW0gfSBmcm9tICcuLi9tb2RlbHMvY2hhcnQtZGF0YS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1jaGFydHMtcGllLWNoYXJ0JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPG5neC1jaGFydHMtY2hhcnRcclxuICAgICAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcclxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcclxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXHJcbiAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxyXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQsIHRydWUpXCJcclxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50LCB0cnVlKVwiXHJcbiAgICAgIChsZWdlbmRMYWJlbENsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXHJcbiAgICA+XHJcbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNsYXRpb25cIiBjbGFzcz1cInBpZS1jaGFydCBjaGFydFwiPlxyXG4gICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgbmd4LWNoYXJ0cy1waWUtc2VyaWVzXHJcbiAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXHJcbiAgICAgICAgICBbc2VyaWVzXT1cImRhdGFcIlxyXG4gICAgICAgICAgW3Nob3dMYWJlbHNdPVwibGFiZWxzXCJcclxuICAgICAgICAgIFtsYWJlbEZvcm1hdHRpbmddPVwibGFiZWxGb3JtYXR0aW5nXCJcclxuICAgICAgICAgIFt0cmltTGFiZWxzXT1cInRyaW1MYWJlbHNcIlxyXG4gICAgICAgICAgW21heExhYmVsTGVuZ3RoXT1cIm1heExhYmVsTGVuZ3RoXCJcclxuICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxyXG4gICAgICAgICAgW2lubmVyUmFkaXVzXT1cImlubmVyUmFkaXVzXCJcclxuICAgICAgICAgIFtvdXRlclJhZGl1c109XCJvdXRlclJhZGl1c1wiXHJcbiAgICAgICAgICBbZXhwbG9kZVNsaWNlc109XCJleHBsb2RlU2xpY2VzXCJcclxuICAgICAgICAgIFtncmFkaWVudF09XCJncmFkaWVudFwiXHJcbiAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcclxuICAgICAgICAgIFt0b29sdGlwVGV4dF09XCJ0b29sdGlwVGV4dFwiXHJcbiAgICAgICAgICAoZGJsY2xpY2spPVwiZGJsY2xpY2suZW1pdCgkZXZlbnQpXCJcclxuICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQpXCJcclxuICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgKGRlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnLCAnLi9waWUtY2hhcnQuY29tcG9uZW50LnNjc3MnXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQaWVDaGFydENvbXBvbmVudCBleHRlbmRzIEJhc2VDaGFydENvbXBvbmVudCB7XHJcbiAgQElucHV0KCkgbGFiZWxzID0gZmFsc2U7XHJcbiAgQElucHV0KCkgbGVnZW5kID0gZmFsc2U7XHJcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xyXG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xyXG4gIEBJbnB1dCgpIGV4cGxvZGVTbGljZXMgPSBmYWxzZTtcclxuICBASW5wdXQoKSBkb3VnaG51dCA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGFyY1dpZHRoID0gMC4yNTtcclxuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhY3RpdmVFbnRyaWVzOiBhbnlbXSA9IFtdO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGxhYmVsRm9ybWF0dGluZzogYW55O1xyXG4gIEBJbnB1dCgpIHRyaW1MYWJlbHM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1heExhYmVsTGVuZ3RoOiBudW1iZXIgPSAxMDtcclxuICBASW5wdXQoKSB0b29sdGlwVGV4dDogYW55O1xyXG4gIEBPdXRwdXQoKSBkYmxjbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvLyBvcHRpb25hbCBtYXJnaW5zXHJcbiAgQElucHV0KCkgbWFyZ2luczogbnVtYmVyW107XHJcbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJykgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICB0cmFuc2xhdGlvbjogc3RyaW5nO1xyXG4gIG91dGVyUmFkaXVzOiBudW1iZXI7XHJcbiAgaW5uZXJSYWRpdXM6IG51bWJlcjtcclxuICBkYXRhOiBhbnk7XHJcbiAgY29sb3JzOiBDb2xvckhlbHBlcjtcclxuICBkb21haW46IGFueTtcclxuICBkaW1zOiBhbnk7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5sYWJlbHMgJiYgdGhpcy5oYXNOb09wdGlvbmFsTWFyZ2luc1NldCgpKSB7XHJcbiAgICAgIHRoaXMubWFyZ2lucyA9IFszMCwgODAsIDMwLCA4MF07XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmxhYmVscyAmJiB0aGlzLmhhc05vT3B0aW9uYWxNYXJnaW5zU2V0KCkpIHtcclxuICAgICAgLy8gZGVmYXVsdCB2YWx1ZSBmb3IgbWFyZ2luc1xyXG4gICAgICB0aGlzLm1hcmdpbnMgPSBbMjAsIDIwLCAyMCwgMjBdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2lucyxcclxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXHJcbiAgICAgIGxlZ2VuZFBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZvcm1hdERhdGVzKCk7XHJcblxyXG4gICAgY29uc3QgeE9mZnNldCA9IHRoaXMubWFyZ2luc1szXSArIHRoaXMuZGltcy53aWR0aCAvIDI7XHJcbiAgICBjb25zdCB5T2Zmc2V0ID0gdGhpcy5tYXJnaW5zWzBdICsgdGhpcy5kaW1zLmhlaWdodCAvIDI7XHJcbiAgICB0aGlzLnRyYW5zbGF0aW9uID0gYHRyYW5zbGF0ZSgke3hPZmZzZXR9LCAke3lPZmZzZXR9KWA7XHJcbiAgICB0aGlzLm91dGVyUmFkaXVzID0gTWF0aC5taW4odGhpcy5kaW1zLndpZHRoLCB0aGlzLmRpbXMuaGVpZ2h0KTtcclxuICAgIGlmICh0aGlzLmxhYmVscykge1xyXG4gICAgICAvLyBtYWtlIHJvb20gZm9yIGxhYmVsc1xyXG4gICAgICB0aGlzLm91dGVyUmFkaXVzIC89IDM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm91dGVyUmFkaXVzIC89IDI7XHJcbiAgICB9XHJcbiAgICB0aGlzLmlubmVyUmFkaXVzID0gMDtcclxuICAgIGlmICh0aGlzLmRvdWdobnV0KSB7XHJcbiAgICAgIHRoaXMuaW5uZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzICogKDEgLSB0aGlzLmFyY1dpZHRoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRvbWFpbiA9IHRoaXMuZ2V0RG9tYWluKCk7XHJcblxyXG4gICAgLy8gc29ydCBkYXRhIGFjY29yZGluZyB0byBkb21haW5cclxuICAgIHRoaXMuZGF0YSA9IHRoaXMucmVzdWx0cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRvbWFpbi5pbmRleE9mKGEubmFtZSkgLSB0aGlzLmRvbWFpbi5pbmRleE9mKGIubmFtZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNldENvbG9ycygpO1xyXG4gICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XHJcbiAgfVxyXG5cclxuICBnZXREb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLmxhYmVsKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZGF0YTogRGF0YUl0ZW0pOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgJ29yZGluYWwnLCB0aGlzLmRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjYWxlVHlwZTogJ29yZGluYWwnLFxyXG4gICAgICBkb21haW46IHRoaXMuZG9tYWluLFxyXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzLFxyXG4gICAgICB0aXRsZTogdGhpcy5sZWdlbmRUaXRsZSxcclxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlKGl0ZW0sIGZyb21MZWdlbmQgPSBmYWxzZSkge1xyXG4gICAgaXRlbSA9IHRoaXMucmVzdWx0cy5maW5kKGQgPT4ge1xyXG4gICAgICBpZiAoZnJvbUxlZ2VuZCkge1xyXG4gICAgICAgIHJldHVybiBkLmxhYmVsID09PSBpdGVtLm5hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xyXG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZSAmJiBkLnNlcmllcyA9PT0gaXRlbS5zZXJpZXM7XHJcbiAgICB9KTtcclxuICAgIGlmIChpZHggPiAtMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gW2l0ZW0sIC4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICB0aGlzLmFjdGl2YXRlLmVtaXQoeyB2YWx1ZTogaXRlbSwgZW50cmllczogdGhpcy5hY3RpdmVFbnRyaWVzIH0pO1xyXG4gIH1cclxuXHJcbiAgb25EZWFjdGl2YXRlKGl0ZW0sIGZyb21MZWdlbmQgPSBmYWxzZSkge1xyXG4gICAgaXRlbSA9IHRoaXMucmVzdWx0cy5maW5kKGQgPT4ge1xyXG4gICAgICBpZiAoZnJvbUxlZ2VuZCkge1xyXG4gICAgICAgIHJldHVybiBkLmxhYmVsID09PSBpdGVtLm5hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xyXG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZSAmJiBkLnNlcmllcyA9PT0gaXRlbS5zZXJpZXM7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhc05vT3B0aW9uYWxNYXJnaW5zU2V0KCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICF0aGlzLm1hcmdpbnMgfHwgdGhpcy5tYXJnaW5zLmxlbmd0aCA8PSAwO1xyXG4gIH1cclxufVxyXG4iXX0=