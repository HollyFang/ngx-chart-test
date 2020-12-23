import { Component, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { curveCardinalClosed } from 'd3-shape';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { getScaleType } from '../common/domain.helper';
import { isDate } from '../utils/types';
const twoPI = 2 * Math.PI;
export class PolarChartComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.showGridLines = true;
        this.curve = curveCardinalClosed;
        this.activeEntries = [];
        this.rangeFillOpacity = 0.15;
        this.trimYAxisTicks = true;
        this.maxYAxisTickLength = 16;
        this.roundDomains = false;
        this.tooltipDisabled = false;
        this.showSeriesOnHover = true;
        this.gradient = false;
        this.yAxisMinScale = 0;
        this.labelTrim = true;
        this.labelTrimSize = 10;
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.margin = [10, 20, 10, 20];
        this.xAxisHeight = 0;
        this.yAxisWidth = 0;
    }
    update() {
        super.update();
        this.setDims();
        this.setScales();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.setTicks();
    }
    setDims() {
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType,
            legendPosition: this.legendPosition
        });
        const halfWidth = Math.floor(this.dims.width / 2);
        const halfHeight = Math.floor(this.dims.height / 2);
        const outerRadius = (this.outerRadius = Math.min(halfHeight / 1.5, halfWidth / 1.5));
        const yOffset = Math.max(0, halfHeight - outerRadius);
        this.yAxisDims = Object.assign(Object.assign({}, this.dims), { width: halfWidth });
        this.transform = `translate(${this.dims.xOffset}, ${this.margin[0]})`;
        this.transformYAxis = `translate(0, ${yOffset})`;
        this.labelOffset = this.dims.height + 40;
        this.transformPlot = `translate(${halfWidth}, ${halfHeight})`;
    }
    setScales() {
        const xValues = this.getXValues();
        this.scaleType = getScaleType(xValues);
        this.xDomain = this.filteredDomain || this.getXDomain(xValues);
        this.yDomain = this.getYDomain();
        this.seriesDomain = this.getSeriesDomain();
        this.xScale = this.getXScale(this.xDomain, twoPI);
        this.yScale = this.getYScale(this.yDomain, this.outerRadius);
        this.yAxisScale = this.getYScale(this.yDomain.reverse(), this.outerRadius);
    }
    setTicks() {
        let tickFormat;
        if (this.xAxisTickFormatting) {
            tickFormat = this.xAxisTickFormatting;
        }
        else if (this.xScale.tickFormat) {
            tickFormat = this.xScale.tickFormat.apply(this.xScale, [5]);
        }
        else {
            tickFormat = d => {
                if (isDate(d)) {
                    return d.toLocaleDateString();
                }
                return d.toLocaleString();
            };
        }
        const outerRadius = this.outerRadius;
        const s = 1.1;
        this.thetaTicks = this.xDomain.map(d => {
            const startAngle = this.xScale(d);
            const dd = s * outerRadius * (startAngle > Math.PI ? -1 : 1);
            const label = tickFormat(d);
            const startPos = [outerRadius * Math.sin(startAngle), -outerRadius * Math.cos(startAngle)];
            const pos = [dd, s * startPos[1]];
            return {
                innerRadius: 0,
                outerRadius,
                startAngle,
                endAngle: startAngle,
                value: outerRadius,
                label,
                startPos,
                pos
            };
        });
        const minDistance = 10;
        /* from pie chart, abstract out -*/
        for (let i = 0; i < this.thetaTicks.length - 1; i++) {
            const a = this.thetaTicks[i];
            for (let j = i + 1; j < this.thetaTicks.length; j++) {
                const b = this.thetaTicks[j];
                // if they're on the same side
                if (b.pos[0] * a.pos[0] > 0) {
                    // if they're overlapping
                    const o = minDistance - Math.abs(b.pos[1] - a.pos[1]);
                    if (o > 0) {
                        // push the second up or down
                        b.pos[1] += Math.sign(b.pos[0]) * o;
                    }
                }
            }
        }
        this.radiusTicks = this.yAxisScale.ticks(Math.floor(this.dims.height / 50)).map(d => this.yScale(d));
    }
    getXValues() {
        const values = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.name)) {
                    values.push(d.name);
                }
            }
        }
        return values;
    }
    getXDomain(values = this.getXValues()) {
        if (this.scaleType === 'time') {
            const min = Math.min(...values);
            const max = Math.max(...values);
            return [min, max];
        }
        else if (this.scaleType === 'linear') {
            values = values.map(v => Number(v));
            const min = Math.min(...values);
            const max = Math.max(...values);
            return [min, max];
        }
        return values;
    }
    getYValues() {
        const domain = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (domain.indexOf(d.value) < 0) {
                    domain.push(d.value);
                }
                if (d.min !== undefined) {
                    if (domain.indexOf(d.min) < 0) {
                        domain.push(d.min);
                    }
                }
                if (d.max !== undefined) {
                    if (domain.indexOf(d.max) < 0) {
                        domain.push(d.max);
                    }
                }
            }
        }
        return domain;
    }
    getYDomain(domain = this.getYValues()) {
        let min = Math.min(...domain);
        const max = Math.max(this.yAxisMinScale, ...domain);
        min = Math.max(0, min);
        if (!this.autoScale) {
            min = Math.min(0, min);
        }
        return [min, max];
    }
    getSeriesDomain() {
        return this.results.map(d => d.name);
    }
    getXScale(domain, width) {
        switch (this.scaleType) {
            case 'time':
                return scaleTime().range([0, width]).domain(domain);
            case 'linear':
                const scale = scaleLinear().range([0, width]).domain(domain);
                return this.roundDomains ? scale.nice() : scale;
            default:
                return scalePoint()
                    .range([0, width - twoPI / domain.length])
                    .padding(0)
                    .domain(domain);
        }
    }
    getYScale(domain, height) {
        const scale = scaleLinear().range([0, height]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    }
    onClick(data, series) {
        if (series) {
            data.series = series.name;
        }
        this.select.emit(data);
    }
    setColors() {
        const domain = this.schemeType === 'ordinal' ? this.seriesDomain : this.yDomain.reverse();
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    }
    getLegendOptions() {
        if (this.schemeType === 'ordinal') {
            return {
                scaleType: this.schemeType,
                colors: this.colors,
                domain: this.seriesDomain,
                title: this.legendTitle,
                position: this.legendPosition
            };
        }
        return {
            scaleType: this.schemeType,
            colors: this.colors.scale,
            domain: this.yDomain,
            title: undefined,
            position: this.legendPosition
        };
    }
    updateYAxisWidth({ width }) {
        this.yAxisWidth = width;
        this.update();
    }
    updateXAxisHeight({ height }) {
        this.xAxisHeight = height;
        this.update();
    }
    onActivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = this.showSeriesOnHover ? [item, ...this.activeEntries] : this.activeEntries;
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
    deactivateAll() {
        this.activeEntries = [...this.activeEntries];
        for (const entry of this.activeEntries) {
            this.deactivate.emit({ value: entry, entries: [] });
        }
        this.activeEntries = [];
    }
    trackBy(index, item) {
        return item.name;
    }
}
PolarChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-polar-chart',
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
      <svg:g class="polar-chart chart" [attr.transform]="transform">
        <svg:g [attr.transform]="transformPlot">
          <svg:circle class="polar-chart-background" cx="0" cy="0" [attr.r]="this.outerRadius" />
          <svg:g *ngIf="showGridLines">
            <svg:circle
              *ngFor="let r of radiusTicks"
              class="gridline-path radial-gridline-path"
              cx="0"
              cy="0"
              [attr.r]="r"
            />
          </svg:g>
          <svg:g *ngIf="xAxis">
            <svg:g
              ngx-charts-pie-label
              *ngFor="let tick of thetaTicks"
              [data]="tick"
              [radius]="outerRadius"
              [label]="tick.label"
              [max]="outerRadius"
              [value]="showGridLines ? 1 : outerRadius"
              [explodeSlices]="true"
              [animations]="animations"
              [labelTrim]="labelTrim"
              [labelTrimSize]="labelTrimSize"
            ></svg:g>
          </svg:g>
        </svg:g>
        <svg:g
          ngx-charts-y-axis
          [attr.transform]="transformYAxis"
          *ngIf="yAxis"
          [yScale]="yAxisScale"
          [dims]="yAxisDims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g
          ngx-charts-axis-label
          *ngIf="xAxis && showXAxisLabel"
          [label]="xAxisLabel"
          [offset]="labelOffset"
          [orient]="'bottom'"
          [height]="dims.height"
          [width]="dims.width"
        ></svg:g>
        <svg:g [attr.transform]="transformPlot">
          <svg:g *ngFor="let series of results; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ngx-charts-polar-series
              [gradient]="gradient"
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="scaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [animations]="animations"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="tooltipTemplate"
              (select)="onClick($event)"
              (activate)="onActivate($event)"
              (deactivate)="onDeactivate($event)"
            />
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':leave', [
                            style({
                                opacity: 1
                            }),
                            animate(500, style({
                                opacity: 0
                            }))
                        ])
                    ])
                ],
                styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".pie-label{font-size:11px}.pie-label.animation{-webkit-animation:fadeIn .75s ease-in;animation:fadeIn .75s ease-in}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.pie-label-line{stroke-dasharray:100%}.pie-label-line.animation{-webkit-animation:drawOut 3s linear;animation:drawOut 3s linear;transition:d .75s}@-webkit-keyframes drawOut{0%{stroke-dashoffset:100%}to{stroke-dashoffset:0}}@keyframes drawOut{0%{stroke-dashoffset:100%}to{stroke-dashoffset:0}}", ".polar-chart .polar-chart-background{fill:none}.polar-chart .radial-gridline-path{fill:none;stroke-dasharray:10 10}.polar-chart .pie-label-line{stroke:#2f3646}.polar-charts-series .polar-series-area,.polar-series-path{pointer-events:none}"]
            },] }
];
PolarChartComponent.propDecorators = {
    legend: [{ type: Input }],
    legendTitle: [{ type: Input }],
    legendPosition: [{ type: Input }],
    xAxis: [{ type: Input }],
    yAxis: [{ type: Input }],
    showXAxisLabel: [{ type: Input }],
    showYAxisLabel: [{ type: Input }],
    xAxisLabel: [{ type: Input }],
    yAxisLabel: [{ type: Input }],
    autoScale: [{ type: Input }],
    showGridLines: [{ type: Input }],
    curve: [{ type: Input }],
    activeEntries: [{ type: Input }],
    schemeType: [{ type: Input }],
    rangeFillOpacity: [{ type: Input }],
    trimYAxisTicks: [{ type: Input }],
    maxYAxisTickLength: [{ type: Input }],
    xAxisTickFormatting: [{ type: Input }],
    yAxisTickFormatting: [{ type: Input }],
    roundDomains: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    showSeriesOnHover: [{ type: Input }],
    gradient: [{ type: Input }],
    yAxisMinScale: [{ type: Input }],
    labelTrim: [{ type: Input }],
    labelTrimSize: [{ type: Input }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    tooltipTemplate: [{ type: ContentChild, args: ['tooltipTemplate',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sYXItY2hhcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL3BvbGFyLWNoYXJ0L3BvbGFyLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsWUFBWSxFQUViLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRS9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBa0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQWtIMUIsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGtCQUFrQjtJQWhIM0Q7O1FBa0hXLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsT0FBTyxDQUFDO1FBUWpDLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLFVBQUssR0FBUSxtQkFBbUIsQ0FBQztR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QkFNRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFVBQVUsRUFBRTtvQkFDVixPQUFPLENBQUMsZ0JBQWdCLEVBQUU7d0JBQ3hCLFVBQVUsQ0FBQyxRQUFRLEVBQUU7NEJBQ25CLEtBQUssQ0FBQztnQ0FDSixPQUFPLEVBQUUsQ0FBQzs2QkFDWCxDQUFDOzRCQUNGLE9BQU8sQ0FDTCxHQUFHLEVBQ0gsS0FBSyxDQUFDO2dDQUNKLE9BQU8sRUFBRSxDQUFDOzZCQUNYLENBQUMsQ0FDSDt5QkFDRixDQUFDO3FCQUNILENBQUM7aUJBQ0g7O2FBQ0Y7OztxQkFFRSxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7NkJBQ0wsS0FBSzs2QkFDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzRCQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7K0JBQ0wsS0FBSzs2QkFDTCxLQUFLO2lDQUNMLEtBQUs7a0NBQ0wsS0FBSztrQ0FDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsS0FBSztnQ0FDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLOzRCQUNMLEtBQUs7dUJBRUwsTUFBTTt5QkFDTixNQUFNOzhCQUVOLFlBQVksU0FBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBUZW1wbGF0ZVJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgYW5pbWF0ZSwgdHJhbnNpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBzY2FsZUxpbmVhciwgc2NhbGVUaW1lLCBzY2FsZVBvaW50IH0gZnJvbSAnZDMtc2NhbGUnO1xyXG5pbXBvcnQgeyBjdXJ2ZUNhcmRpbmFsQ2xvc2VkIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5cclxuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xyXG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jb2xvci5oZWxwZXInO1xyXG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBnZXRTY2FsZVR5cGUgfSBmcm9tICcuLi9jb21tb24vZG9tYWluLmhlbHBlcic7XHJcbmltcG9ydCB7IGlzRGF0ZSB9IGZyb20gJy4uL3V0aWxzL3R5cGVzJztcclxuXHJcbmNvbnN0IHR3b1BJID0gMiAqIE1hdGguUEk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1jaGFydHMtcG9sYXItY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8bmd4LWNoYXJ0cy1jaGFydFxyXG4gICAgICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxyXG4gICAgICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxyXG4gICAgICBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCJcclxuICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXHJcbiAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudClcIlxyXG4gICAgICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcclxuICAgID5cclxuICAgICAgPHN2ZzpnIGNsYXNzPVwicG9sYXItY2hhcnQgY2hhcnRcIiBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCI+XHJcbiAgICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1QbG90XCI+XHJcbiAgICAgICAgICA8c3ZnOmNpcmNsZSBjbGFzcz1cInBvbGFyLWNoYXJ0LWJhY2tncm91bmRcIiBjeD1cIjBcIiBjeT1cIjBcIiBbYXR0ci5yXT1cInRoaXMub3V0ZXJSYWRpdXNcIiAvPlxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwic2hvd0dyaWRMaW5lc1wiPlxyXG4gICAgICAgICAgICA8c3ZnOmNpcmNsZVxyXG4gICAgICAgICAgICAgICpuZ0Zvcj1cImxldCByIG9mIHJhZGl1c1RpY2tzXCJcclxuICAgICAgICAgICAgICBjbGFzcz1cImdyaWRsaW5lLXBhdGggcmFkaWFsLWdyaWRsaW5lLXBhdGhcIlxyXG4gICAgICAgICAgICAgIGN4PVwiMFwiXHJcbiAgICAgICAgICAgICAgY3k9XCIwXCJcclxuICAgICAgICAgICAgICBbYXR0ci5yXT1cInJcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICAgIDxzdmc6ZyAqbmdJZj1cInhBeGlzXCI+XHJcbiAgICAgICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgICAgIG5neC1jaGFydHMtcGllLWxhYmVsXHJcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHRpY2sgb2YgdGhldGFUaWNrc1wiXHJcbiAgICAgICAgICAgICAgW2RhdGFdPVwidGlja1wiXHJcbiAgICAgICAgICAgICAgW3JhZGl1c109XCJvdXRlclJhZGl1c1wiXHJcbiAgICAgICAgICAgICAgW2xhYmVsXT1cInRpY2subGFiZWxcIlxyXG4gICAgICAgICAgICAgIFttYXhdPVwib3V0ZXJSYWRpdXNcIlxyXG4gICAgICAgICAgICAgIFt2YWx1ZV09XCJzaG93R3JpZExpbmVzID8gMSA6IG91dGVyUmFkaXVzXCJcclxuICAgICAgICAgICAgICBbZXhwbG9kZVNsaWNlc109XCJ0cnVlXCJcclxuICAgICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgICAgICAgICBbbGFiZWxUcmltXT1cImxhYmVsVHJpbVwiXHJcbiAgICAgICAgICAgICAgW2xhYmVsVHJpbVNpemVdPVwibGFiZWxUcmltU2l6ZVwiXHJcbiAgICAgICAgICAgID48L3N2ZzpnPlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgbmd4LWNoYXJ0cy15LWF4aXNcclxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1ZQXhpc1wiXHJcbiAgICAgICAgICAqbmdJZj1cInlBeGlzXCJcclxuICAgICAgICAgIFt5U2NhbGVdPVwieUF4aXNTY2FsZVwiXHJcbiAgICAgICAgICBbZGltc109XCJ5QXhpc0RpbXNcIlxyXG4gICAgICAgICAgW3Nob3dHcmlkTGluZXNdPVwic2hvd0dyaWRMaW5lc1wiXHJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dZQXhpc0xhYmVsXCJcclxuICAgICAgICAgIFtsYWJlbFRleHRdPVwieUF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1ZQXhpc1RpY2tzXCJcclxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFlBeGlzVGlja0xlbmd0aFwiXHJcbiAgICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwieUF4aXNUaWNrRm9ybWF0dGluZ1wiXHJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWUF4aXNXaWR0aCgkZXZlbnQpXCJcclxuICAgICAgICA+PC9zdmc6Zz5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMtYXhpcy1sYWJlbFxyXG4gICAgICAgICAgKm5nSWY9XCJ4QXhpcyAmJiBzaG93WEF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbbGFiZWxdPVwieEF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbb2Zmc2V0XT1cImxhYmVsT2Zmc2V0XCJcclxuICAgICAgICAgIFtvcmllbnRdPVwiJ2JvdHRvbSdcIlxyXG4gICAgICAgICAgW2hlaWdodF09XCJkaW1zLmhlaWdodFwiXHJcbiAgICAgICAgICBbd2lkdGhdPVwiZGltcy53aWR0aFwiXHJcbiAgICAgICAgPjwvc3ZnOmc+XHJcbiAgICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1QbG90XCI+XHJcbiAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzOyB0cmFja0J5OiB0cmFja0J5XCIgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiPlxyXG4gICAgICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgICAgICBuZ3gtY2hhcnRzLXBvbGFyLXNlcmllc1xyXG4gICAgICAgICAgICAgIFtncmFkaWVudF09XCJncmFkaWVudFwiXHJcbiAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxyXG4gICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcclxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXHJcbiAgICAgICAgICAgICAgW2RhdGFdPVwic2VyaWVzXCJcclxuICAgICAgICAgICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcclxuICAgICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXHJcbiAgICAgICAgICAgICAgW2N1cnZlXT1cImN1cnZlXCJcclxuICAgICAgICAgICAgICBbcmFuZ2VGaWxsT3BhY2l0eV09XCJyYW5nZUZpbGxPcGFjaXR5XCJcclxuICAgICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAoYWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFtcclxuICAgICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQuc2NzcycsXHJcbiAgICAnLi4vcGllLWNoYXJ0L3BpZS1jaGFydC5jb21wb25lbnQuc2NzcycsXHJcbiAgICAnLi9wb2xhci1jaGFydC5jb21wb25lbnQuc2NzcydcclxuICBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW1xyXG4gICAgdHJpZ2dlcignYW5pbWF0aW9uU3RhdGUnLCBbXHJcbiAgICAgIHRyYW5zaXRpb24oJzpsZWF2ZScsIFtcclxuICAgICAgICBzdHlsZSh7XHJcbiAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYW5pbWF0ZShcclxuICAgICAgICAgIDUwMCxcclxuICAgICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICApXHJcbiAgICAgIF0pXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFBvbGFyQ2hhcnRDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGxlZ2VuZDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBsZWdlbmRUaXRsZTogc3RyaW5nID0gJ0xlZ2VuZCc7XHJcbiAgQElucHV0KCkgbGVnZW5kUG9zaXRpb246IHN0cmluZyA9ICdyaWdodCc7XHJcbiAgQElucHV0KCkgeEF4aXM6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgeUF4aXM6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc2hvd1hBeGlzTGFiZWw6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc2hvd1lBeGlzTGFiZWw6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgeEF4aXNMYWJlbDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHlBeGlzTGFiZWw6IHN0cmluZztcclxuICBASW5wdXQoKSBhdXRvU2NhbGU6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgY3VydmU6IGFueSA9IGN1cnZlQ2FyZGluYWxDbG9zZWQ7XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcclxuICBASW5wdXQoKSBzY2hlbWVUeXBlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcmFuZ2VGaWxsT3BhY2l0eTogbnVtYmVyID0gMC4xNTtcclxuICBASW5wdXQoKSB0cmltWUF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgbWF4WUF4aXNUaWNrTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBASW5wdXQoKSB4QXhpc1RpY2tGb3JtYXR0aW5nOiAobzogYW55KSA9PiBhbnk7XHJcbiAgQElucHV0KCkgeUF4aXNUaWNrRm9ybWF0dGluZzogKG86IGFueSkgPT4gYW55O1xyXG4gIEBJbnB1dCgpIHJvdW5kRG9tYWluczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHNob3dTZXJpZXNPbkhvdmVyOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHlBeGlzTWluU2NhbGU6IG51bWJlciA9IDA7XHJcbiAgQElucHV0KCkgbGFiZWxUcmltOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBsYWJlbFRyaW1TaXplOiBudW1iZXIgPSAxMDtcclxuXHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgZGltczogVmlld0RpbWVuc2lvbnM7XHJcbiAgeUF4aXNEaW1zOiBWaWV3RGltZW5zaW9ucztcclxuICBsYWJlbE9mZnNldDogbnVtYmVyO1xyXG4gIHhEb21haW46IGFueTtcclxuICB5RG9tYWluOiBhbnk7XHJcbiAgc2VyaWVzRG9tYWluOiBhbnk7XHJcbiAgeVNjYWxlOiBhbnk7IC8vIC0+IHJTY2FsZVxyXG4gIHhTY2FsZTogYW55OyAvLyAtPiB0U2NhbGVcclxuICB5QXhpc1NjYWxlOiBhbnk7IC8vIC0+IHlTY2FsZVxyXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XHJcbiAgc2NhbGVUeXBlOiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtUGxvdDogc3RyaW5nO1xyXG4gIHRyYW5zZm9ybVlBeGlzOiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtWEF4aXM6IHN0cmluZztcclxuICBzZXJpZXM6IGFueTsgLy8gPz8/XHJcbiAgbWFyZ2luID0gWzEwLCAyMCwgMTAsIDIwXTtcclxuICB4QXhpc0hlaWdodDogbnVtYmVyID0gMDtcclxuICB5QXhpc1dpZHRoOiBudW1iZXIgPSAwO1xyXG4gIGZpbHRlcmVkRG9tYWluOiBhbnk7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIHRoZXRhVGlja3M6IGFueVtdO1xyXG4gIHJhZGl1c1RpY2tzOiBudW1iZXJbXTtcclxuICBvdXRlclJhZGl1czogbnVtYmVyO1xyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICB0aGlzLnNldERpbXMoKTtcclxuXHJcbiAgICB0aGlzLnNldFNjYWxlcygpO1xyXG4gICAgdGhpcy5zZXRDb2xvcnMoKTtcclxuICAgIHRoaXMubGVnZW5kT3B0aW9ucyA9IHRoaXMuZ2V0TGVnZW5kT3B0aW9ucygpO1xyXG5cclxuICAgIHRoaXMuc2V0VGlja3MoKTtcclxuICB9XHJcblxyXG4gIHNldERpbXMoKSB7XHJcbiAgICB0aGlzLmRpbXMgPSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucyh7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICBtYXJnaW5zOiB0aGlzLm1hcmdpbixcclxuICAgICAgc2hvd1hBeGlzOiB0aGlzLnhBeGlzLFxyXG4gICAgICBzaG93WUF4aXM6IHRoaXMueUF4aXMsXHJcbiAgICAgIHhBeGlzSGVpZ2h0OiB0aGlzLnhBeGlzSGVpZ2h0LFxyXG4gICAgICB5QXhpc1dpZHRoOiB0aGlzLnlBeGlzV2lkdGgsXHJcbiAgICAgIHNob3dYTGFiZWw6IHRoaXMuc2hvd1hBeGlzTGFiZWwsXHJcbiAgICAgIHNob3dZTGFiZWw6IHRoaXMuc2hvd1lBeGlzTGFiZWwsXHJcbiAgICAgIHNob3dMZWdlbmQ6IHRoaXMubGVnZW5kLFxyXG4gICAgICBsZWdlbmRUeXBlOiB0aGlzLnNjaGVtZVR5cGUsXHJcbiAgICAgIGxlZ2VuZFBvc2l0aW9uOiB0aGlzLmxlZ2VuZFBvc2l0aW9uXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBoYWxmV2lkdGggPSBNYXRoLmZsb29yKHRoaXMuZGltcy53aWR0aCAvIDIpO1xyXG4gICAgY29uc3QgaGFsZkhlaWdodCA9IE1hdGguZmxvb3IodGhpcy5kaW1zLmhlaWdodCAvIDIpO1xyXG5cclxuICAgIGNvbnN0IG91dGVyUmFkaXVzID0gKHRoaXMub3V0ZXJSYWRpdXMgPSBNYXRoLm1pbihoYWxmSGVpZ2h0IC8gMS41LCBoYWxmV2lkdGggLyAxLjUpKTtcclxuXHJcbiAgICBjb25zdCB5T2Zmc2V0ID0gTWF0aC5tYXgoMCwgaGFsZkhlaWdodCAtIG91dGVyUmFkaXVzKTtcclxuXHJcbiAgICB0aGlzLnlBeGlzRGltcyA9IHtcclxuICAgICAgLi4udGhpcy5kaW1zLFxyXG4gICAgICB3aWR0aDogaGFsZldpZHRoXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuZGltcy54T2Zmc2V0fSwgJHt0aGlzLm1hcmdpblswXX0pYDtcclxuICAgIHRoaXMudHJhbnNmb3JtWUF4aXMgPSBgdHJhbnNsYXRlKDAsICR7eU9mZnNldH0pYDtcclxuICAgIHRoaXMubGFiZWxPZmZzZXQgPSB0aGlzLmRpbXMuaGVpZ2h0ICsgNDA7XHJcbiAgICB0aGlzLnRyYW5zZm9ybVBsb3QgPSBgdHJhbnNsYXRlKCR7aGFsZldpZHRofSwgJHtoYWxmSGVpZ2h0fSlgO1xyXG4gIH1cclxuXHJcbiAgc2V0U2NhbGVzKCkge1xyXG4gICAgY29uc3QgeFZhbHVlcyA9IHRoaXMuZ2V0WFZhbHVlcygpO1xyXG4gICAgdGhpcy5zY2FsZVR5cGUgPSBnZXRTY2FsZVR5cGUoeFZhbHVlcyk7XHJcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluIHx8IHRoaXMuZ2V0WERvbWFpbih4VmFsdWVzKTtcclxuXHJcbiAgICB0aGlzLnlEb21haW4gPSB0aGlzLmdldFlEb21haW4oKTtcclxuICAgIHRoaXMuc2VyaWVzRG9tYWluID0gdGhpcy5nZXRTZXJpZXNEb21haW4oKTtcclxuXHJcbiAgICB0aGlzLnhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMueERvbWFpbiwgdHdvUEkpO1xyXG4gICAgdGhpcy55U2NhbGUgPSB0aGlzLmdldFlTY2FsZSh0aGlzLnlEb21haW4sIHRoaXMub3V0ZXJSYWRpdXMpO1xyXG4gICAgdGhpcy55QXhpc1NjYWxlID0gdGhpcy5nZXRZU2NhbGUodGhpcy55RG9tYWluLnJldmVyc2UoKSwgdGhpcy5vdXRlclJhZGl1cyk7XHJcbiAgfVxyXG5cclxuICBzZXRUaWNrcygpIHtcclxuICAgIGxldCB0aWNrRm9ybWF0O1xyXG4gICAgaWYgKHRoaXMueEF4aXNUaWNrRm9ybWF0dGluZykge1xyXG4gICAgICB0aWNrRm9ybWF0ID0gdGhpcy54QXhpc1RpY2tGb3JtYXR0aW5nO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnhTY2FsZS50aWNrRm9ybWF0KSB7XHJcbiAgICAgIHRpY2tGb3JtYXQgPSB0aGlzLnhTY2FsZS50aWNrRm9ybWF0LmFwcGx5KHRoaXMueFNjYWxlLCBbNV0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGlja0Zvcm1hdCA9IGQgPT4ge1xyXG4gICAgICAgIGlmIChpc0RhdGUoZCkpIHtcclxuICAgICAgICAgIHJldHVybiBkLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZC50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG91dGVyUmFkaXVzID0gdGhpcy5vdXRlclJhZGl1cztcclxuICAgIGNvbnN0IHMgPSAxLjE7XHJcblxyXG4gICAgdGhpcy50aGV0YVRpY2tzID0gdGhpcy54RG9tYWluLm1hcChkID0+IHtcclxuICAgICAgY29uc3Qgc3RhcnRBbmdsZSA9IHRoaXMueFNjYWxlKGQpO1xyXG4gICAgICBjb25zdCBkZCA9IHMgKiBvdXRlclJhZGl1cyAqIChzdGFydEFuZ2xlID4gTWF0aC5QSSA/IC0xIDogMSk7XHJcbiAgICAgIGNvbnN0IGxhYmVsID0gdGlja0Zvcm1hdChkKTtcclxuXHJcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gW291dGVyUmFkaXVzICogTWF0aC5zaW4oc3RhcnRBbmdsZSksIC1vdXRlclJhZGl1cyAqIE1hdGguY29zKHN0YXJ0QW5nbGUpXTtcclxuICAgICAgY29uc3QgcG9zID0gW2RkLCBzICogc3RhcnRQb3NbMV1dO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlubmVyUmFkaXVzOiAwLFxyXG4gICAgICAgIG91dGVyUmFkaXVzLFxyXG4gICAgICAgIHN0YXJ0QW5nbGUsXHJcbiAgICAgICAgZW5kQW5nbGU6IHN0YXJ0QW5nbGUsXHJcbiAgICAgICAgdmFsdWU6IG91dGVyUmFkaXVzLFxyXG4gICAgICAgIGxhYmVsLFxyXG4gICAgICAgIHN0YXJ0UG9zLFxyXG4gICAgICAgIHBvc1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbWluRGlzdGFuY2UgPSAxMDtcclxuXHJcbiAgICAvKiBmcm9tIHBpZSBjaGFydCwgYWJzdHJhY3Qgb3V0IC0qL1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRoZXRhVGlja3MubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGEgPSB0aGlzLnRoZXRhVGlja3NbaV07XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCB0aGlzLnRoZXRhVGlja3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBjb25zdCBiID0gdGhpcy50aGV0YVRpY2tzW2pdO1xyXG4gICAgICAgIC8vIGlmIHRoZXkncmUgb24gdGhlIHNhbWUgc2lkZVxyXG4gICAgICAgIGlmIChiLnBvc1swXSAqIGEucG9zWzBdID4gMCkge1xyXG4gICAgICAgICAgLy8gaWYgdGhleSdyZSBvdmVybGFwcGluZ1xyXG4gICAgICAgICAgY29uc3QgbyA9IG1pbkRpc3RhbmNlIC0gTWF0aC5hYnMoYi5wb3NbMV0gLSBhLnBvc1sxXSk7XHJcbiAgICAgICAgICBpZiAobyA+IDApIHtcclxuICAgICAgICAgICAgLy8gcHVzaCB0aGUgc2Vjb25kIHVwIG9yIGRvd25cclxuICAgICAgICAgICAgYi5wb3NbMV0gKz0gTWF0aC5zaWduKGIucG9zWzBdKSAqIG87XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yYWRpdXNUaWNrcyA9IHRoaXMueUF4aXNTY2FsZS50aWNrcyhNYXRoLmZsb29yKHRoaXMuZGltcy5oZWlnaHQgLyA1MCkpLm1hcChkID0+IHRoaXMueVNjYWxlKGQpKTtcclxuICB9XHJcblxyXG4gIGdldFhWYWx1ZXMoKTogYW55W10ge1xyXG4gICAgY29uc3QgdmFsdWVzID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHJlc3VsdHMgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZCBvZiByZXN1bHRzLnNlcmllcykge1xyXG4gICAgICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKGQubmFtZSkpIHtcclxuICAgICAgICAgIHZhbHVlcy5wdXNoKGQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0WERvbWFpbih2YWx1ZXMgPSB0aGlzLmdldFhWYWx1ZXMoKSk6IGFueVtdIHtcclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XHJcbiAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnZhbHVlcyk7XHJcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcbiAgICAgIHJldHVybiBbbWluLCBtYXhdO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcclxuICAgICAgdmFsdWVzID0gdmFsdWVzLm1hcCh2ID0+IE51bWJlcih2KSk7XHJcbiAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnZhbHVlcyk7XHJcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcbiAgICAgIHJldHVybiBbbWluLCBtYXhdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9XHJcblxyXG4gIGdldFlWYWx1ZXMoKTogYW55W10ge1xyXG4gICAgY29uc3QgZG9tYWluID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCByZXN1bHRzIG9mIHRoaXMucmVzdWx0cykge1xyXG4gICAgICBmb3IgKGNvbnN0IGQgb2YgcmVzdWx0cy5zZXJpZXMpIHtcclxuICAgICAgICBpZiAoZG9tYWluLmluZGV4T2YoZC52YWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICBkb21haW4ucHVzaChkLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGQubWluICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmIChkb21haW4uaW5kZXhPZihkLm1pbikgPCAwKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbi5wdXNoKGQubWluKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGQubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmIChkb21haW4uaW5kZXhPZihkLm1heCkgPCAwKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbi5wdXNoKGQubWF4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkb21haW47XHJcbiAgfVxyXG5cclxuICBnZXRZRG9tYWluKGRvbWFpbiA9IHRoaXMuZ2V0WVZhbHVlcygpKTogYW55W10ge1xyXG4gICAgbGV0IG1pbiA9IE1hdGgubWluKC4uLmRvbWFpbik7XHJcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCh0aGlzLnlBeGlzTWluU2NhbGUsIC4uLmRvbWFpbik7XHJcblxyXG4gICAgbWluID0gTWF0aC5tYXgoMCwgbWluKTtcclxuICAgIGlmICghdGhpcy5hdXRvU2NhbGUpIHtcclxuICAgICAgbWluID0gTWF0aC5taW4oMCwgbWluKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gW21pbiwgbWF4XTtcclxuICB9XHJcblxyXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXN1bHRzLm1hcChkID0+IGQubmFtZSk7XHJcbiAgfVxyXG5cclxuICBnZXRYU2NhbGUoZG9tYWluLCB3aWR0aCk6IGFueSB7XHJcbiAgICBzd2l0Y2ggKHRoaXMuc2NhbGVUeXBlKSB7XHJcbiAgICAgIGNhc2UgJ3RpbWUnOlxyXG4gICAgICAgIHJldHVybiBzY2FsZVRpbWUoKS5yYW5nZShbMCwgd2lkdGhdKS5kb21haW4oZG9tYWluKTtcclxuICAgICAgY2FzZSAnbGluZWFyJzpcclxuICAgICAgICBjb25zdCBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHdpZHRoXSkuZG9tYWluKGRvbWFpbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIHNjYWxlUG9pbnQoKVxyXG4gICAgICAgICAgLnJhbmdlKFswLCB3aWR0aCAtIHR3b1BJIC8gZG9tYWluLmxlbmd0aF0pXHJcbiAgICAgICAgICAucGFkZGluZygwKVxyXG4gICAgICAgICAgLmRvbWFpbihkb21haW4pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0WVNjYWxlKGRvbWFpbiwgaGVpZ2h0KTogYW55IHtcclxuICAgIGNvbnN0IHNjYWxlID0gc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgaGVpZ2h0XSkuZG9tYWluKGRvbWFpbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucm91bmREb21haW5zID8gc2NhbGUubmljZSgpIDogc2NhbGU7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGRhdGEsIHNlcmllcz8pOiB2b2lkIHtcclxuICAgIGlmIChzZXJpZXMpIHtcclxuICAgICAgZGF0YS5zZXJpZXMgPSBzZXJpZXMubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgZG9tYWluID0gdGhpcy5zY2hlbWVUeXBlID09PSAnb3JkaW5hbCcgPyB0aGlzLnNlcmllc0RvbWFpbiA6IHRoaXMueURvbWFpbi5yZXZlcnNlKCk7XHJcbiAgICB0aGlzLmNvbG9ycyA9IG5ldyBDb2xvckhlbHBlcih0aGlzLnNjaGVtZSwgdGhpcy5zY2hlbWVUeXBlLCBkb21haW4sIHRoaXMuY3VzdG9tQ29sb3JzKTtcclxuICB9XHJcblxyXG4gIGdldExlZ2VuZE9wdGlvbnMoKSB7XHJcbiAgICBpZiAodGhpcy5zY2hlbWVUeXBlID09PSAnb3JkaW5hbCcpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzY2FsZVR5cGU6IHRoaXMuc2NoZW1lVHlwZSxcclxuICAgICAgICBjb2xvcnM6IHRoaXMuY29sb3JzLFxyXG4gICAgICAgIGRvbWFpbjogdGhpcy5zZXJpZXNEb21haW4sXHJcbiAgICAgICAgdGl0bGU6IHRoaXMubGVnZW5kVGl0bGUsXHJcbiAgICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxyXG4gICAgICBjb2xvcnM6IHRoaXMuY29sb3JzLnNjYWxlLFxyXG4gICAgICBkb21haW46IHRoaXMueURvbWFpbixcclxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcclxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICB1cGRhdGVZQXhpc1dpZHRoKHsgd2lkdGggfSk6IHZvaWQge1xyXG4gICAgdGhpcy55QXhpc1dpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlWEF4aXNIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xyXG4gICAgdGhpcy54QXhpc0hlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlKGl0ZW0pIHtcclxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XHJcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaWR4ID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gdGhpcy5zaG93U2VyaWVzT25Ib3ZlciA/IFtpdGVtLCAuLi50aGlzLmFjdGl2ZUVudHJpZXNdIDogdGhpcy5hY3RpdmVFbnRyaWVzO1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIG9uRGVhY3RpdmF0ZShpdGVtKSB7XHJcbiAgICBjb25zdCBpZHggPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZEluZGV4KGQgPT4ge1xyXG4gICAgICByZXR1cm4gZC5uYW1lID09PSBpdGVtLm5hbWUgJiYgZC52YWx1ZSA9PT0gaXRlbS52YWx1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcy5zcGxpY2UoaWR4LCAxKTtcclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFsuLi50aGlzLmFjdGl2ZUVudHJpZXNdO1xyXG5cclxuICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGl0ZW0sIGVudHJpZXM6IHRoaXMuYWN0aXZlRW50cmllcyB9KTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGVBbGwoKSB7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5hY3RpdmVFbnRyaWVzKSB7XHJcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZS5lbWl0KHsgdmFsdWU6IGVudHJ5LCBlbnRyaWVzOiBbXSB9KTtcclxuICAgIH1cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgdHJhY2tCeShpbmRleCwgaXRlbSkge1xyXG4gICAgcmV0dXJuIGl0ZW0ubmFtZTtcclxuICB9XHJcbn1cclxuIl19