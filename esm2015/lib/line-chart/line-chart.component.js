import { Component, Input, Output, EventEmitter, ViewEncapsulation, HostListener, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { curveLinear } from 'd3-shape';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { id } from '../utils/id';
import { getUniqueXDomainValues, getScaleType } from '../common/domain.helper';
export class LineChartComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.legendTitle = 'Legend';
        this.legendPosition = 'right';
        this.showGridLines = true;
        this.curve = curveLinear;
        this.activeEntries = [];
        this.trimXAxisTicks = true;
        this.trimYAxisTicks = true;
        this.rotateXAxisTicks = true;
        this.maxXAxisTickLength = 16;
        this.maxYAxisTickLength = 16;
        this.roundDomains = false;
        this.tooltipDisabled = false;
        this.showRefLines = false;
        this.showRefLabels = true;
        this.clickCallback = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.margin = [10, 20, 10, 20];
        this.xAxisHeight = 0;
        this.yAxisWidth = 0;
        this.timelineHeight = 50;
        this.timelinePadding = 10;
    }
    update() {
        super.update();
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
        if (this.timeline) {
            this.dims.height -= this.timelineHeight + this.margin[2] + this.timelinePadding;
        }
        this.xDomain = this.getXDomain();
        if (this.filteredDomain) {
            this.xDomain = this.filteredDomain;
        }
        this.yDomain = this.getYDomain();
        this.seriesDomain = this.getSeriesDomain();
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
        this.yScale = this.getYScale(this.yDomain, this.dims.height);
        this.updateTimeline();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;
    }
    updateTimeline() {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
        }
    }
    getXDomain() {
        let values = getUniqueXDomainValues(this.results);
        this.scaleType = getScaleType(values);
        let domain = [];
        if (this.scaleType === 'linear') {
            values = values.map(v => Number(v));
        }
        let min;
        let max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
            min = this.xScaleMin ? this.xScaleMin : Math.min(...values);
            max = this.xScaleMax ? this.xScaleMax : Math.max(...values);
        }
        if (this.scaleType === 'time') {
            domain = [new Date(min), new Date(max)];
            this.xSet = [...values].sort((a, b) => {
                const aDate = a.getTime();
                const bDate = b.getTime();
                if (aDate > bDate)
                    return 1;
                if (bDate > aDate)
                    return -1;
                return 0;
            });
        }
        else if (this.scaleType === 'linear') {
            domain = [min, max];
            // Use compare function to sort numbers numerically
            this.xSet = [...values].sort((a, b) => a - b);
        }
        else {
            domain = values;
            this.xSet = values;
        }
        return domain;
    }
    getYDomain() {
        const domain = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (domain.indexOf(d.value) < 0) {
                    domain.push(d.value);
                }
                if (d.min !== undefined) {
                    this.hasRange = true;
                    if (domain.indexOf(d.min) < 0) {
                        domain.push(d.min);
                    }
                }
                if (d.max !== undefined) {
                    this.hasRange = true;
                    if (domain.indexOf(d.max) < 0) {
                        domain.push(d.max);
                    }
                }
            }
        }
        const values = [...domain];
        if (!this.autoScale) {
            values.push(0);
        }
        const min = this.yScaleMin ? this.yScaleMin : Math.min(...values);
        const max = this.yScaleMax ? this.yScaleMax : Math.max(...values);
        return [min, max];
    }
    getSeriesDomain() {
        return this.results.map(d => d.name);
    }
    getXScale(domain, width) {
        let scale;
        if (this.scaleType === 'time') {
            scale = scaleTime().range([0, width]).domain(domain);
        }
        else if (this.scaleType === 'linear') {
            scale = scaleLinear().range([0, width]).domain(domain);
            if (this.roundDomains) {
                scale = scale.nice();
            }
        }
        else if (this.scaleType === 'ordinal') {
            scale = scalePoint().range([0, width]).padding(0.1).domain(domain);
        }
        return scale;
    }
    getYScale(domain, height) {
        const scale = scaleLinear().range([height, 0]).domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    }
    updateDomain(domain) {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    }
    updateHoveredVertical(item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    }
    hideCircles() {
        this.hoveredVertical = null;
        this.deactivateAll();
    }
    onClick(data) {
        this.select.emit(data);
    }
    onXClick(data) {
        this.clickCallback.emit(data);
        this.activeTime = data;
    }
    trackBy(index, item) {
        return item.name;
    }
    setColors() {
        let domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        }
        else {
            domain = this.yDomain;
        }
        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    }
    getLegendOptions() {
        const opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined,
            position: this.legendPosition
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.seriesDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        }
        else {
            opts.domain = this.yDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
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
        this.deactivateAll();
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }
        this.activeEntries = [item];
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
}
LineChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-line-chart',
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
      <svg:defs>
        <svg:clipPath [attr.id]="clipPathId">
          <svg:rect
            [attr.width]="dims.width + 10"
            [attr.height]="dims.height + 10"
            [attr.transform]="'translate(-5, -5)'"
          />
        </svg:clipPath>
      </svg:defs>
      <svg:g [attr.transform]="transform" class="line-chart chart">
        <svg:g
          ngx-charts-x-axis
          *ngIf="xAxis"
          [xScale]="xScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showXAxisLabel"
          [labelText]="xAxisLabel"
          [trimTicks]="trimXAxisTicks"
          [rotateTicks]="rotateXAxisTicks"
          [maxTickLength]="maxXAxisTickLength"
          [tickFormatting]="xAxisTickFormatting"
          [activeTime]="activeTime"
          (click)="onXClick($event)"
          [ticks]="xAxisTicks"
          (dimensionsChanged)="updateXAxisHeight($event)"
        ></svg:g>
        <svg:g
          ngx-charts-y-axis
          *ngIf="yAxis"
          [yScale]="yScale"
          [dims]="dims"
          [showGridLines]="showGridLines"
          [showLabel]="showYAxisLabel"
          [labelText]="yAxisLabel"
          [trimTicks]="trimYAxisTicks"
          [maxTickLength]="maxYAxisTickLength"
          [tickFormatting]="yAxisTickFormatting"
          [ticks]="yAxisTicks"
          [referenceLines]="referenceLines"
          [showRefLines]="showRefLines"
          [showRefLabels]="showRefLabels"
          (dimensionsChanged)="updateYAxisWidth($event)"
        ></svg:g>
        <svg:g [attr.clip-path]="clipPath">
          <svg:g *ngFor="let series of results; trackBy: trackBy" [@animationState]="'active'">
            <svg:g
              ngx-charts-line-series
              [xScale]="xScale"
              [yScale]="yScale"
              [colors]="colors"
              [data]="series"
              [activeEntries]="activeEntries"
              [scaleType]="scaleType"
              [curve]="curve"
              [rangeFillOpacity]="rangeFillOpacity"
              [hasRange]="hasRange"
              [animations]="animations"
            />
          </svg:g>

          <svg:g *ngIf="!tooltipDisabled" (mouseleave)="hideCircles()">
            <svg:g
              ngx-charts-tooltip-area
              [dims]="dims"
              [xSet]="xSet"
              [xScale]="xScale"
              [yScale]="yScale"
              [results]="results"
              [colors]="colors"
              [tooltipDisabled]="tooltipDisabled"
              [tooltipTemplate]="seriesTooltipTemplate"
              (hover)="updateHoveredVertical($event)"
            />

            <svg:g *ngFor="let series of results">
              <svg:g
                ngx-charts-circle-series
                [xScale]="xScale"
                [yScale]="yScale"
                [colors]="colors"
                [data]="series"
                [scaleType]="scaleType"
                [visibleValue]="hoveredVertical"
                [activeEntries]="activeEntries"
                [tooltipDisabled]="tooltipDisabled"
                [tooltipTemplate]="tooltipTemplate"
                (select)="onClick($event)"
                (activate)="onActivate($event)"
                (deactivate)="onDeactivate($event)"
              />
            </svg:g>
          </svg:g>
        </svg:g>
      </svg:g>
      <svg:g
        ngx-charts-timeline
        *ngIf="timeline && scaleType != 'ordinal'"
        [attr.transform]="timelineTransform"
        [results]="results"
        [view]="[timelineWidth, height]"
        [height]="timelineHeight"
        [scheme]="scheme"
        [customColors]="customColors"
        [scaleType]="scaleType"
        [legend]="legend"
        (onDomainChange)="updateDomain($event)"
      >
        <svg:g *ngFor="let series of results; trackBy: trackBy">
          <svg:g
            ngx-charts-line-series
            [xScale]="timelineXScale"
            [yScale]="timelineYScale"
            [colors]="colors"
            [data]="series"
            [scaleType]="scaleType"
            [curve]="curve"
            [hasRange]="hasRange"
            [animations]="animations"
          />
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
                styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}"]
            },] }
];
LineChartComponent.propDecorators = {
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
    timeline: [{ type: Input }],
    gradient: [{ type: Input }],
    showGridLines: [{ type: Input }],
    curve: [{ type: Input }],
    activeEntries: [{ type: Input }],
    schemeType: [{ type: Input }],
    rangeFillOpacity: [{ type: Input }],
    trimXAxisTicks: [{ type: Input }],
    trimYAxisTicks: [{ type: Input }],
    rotateXAxisTicks: [{ type: Input }],
    maxXAxisTickLength: [{ type: Input }],
    maxYAxisTickLength: [{ type: Input }],
    xAxisTickFormatting: [{ type: Input }],
    yAxisTickFormatting: [{ type: Input }],
    xAxisTicks: [{ type: Input }],
    yAxisTicks: [{ type: Input }],
    roundDomains: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    showRefLines: [{ type: Input }],
    referenceLines: [{ type: Input }],
    showRefLabels: [{ type: Input }],
    xScaleMin: [{ type: Input }],
    xScaleMax: [{ type: Input }],
    yScaleMin: [{ type: Input }],
    yScaleMax: [{ type: Input }],
    activeTime: [{ type: Input }],
    clickCallback: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    tooltipTemplate: [{ type: ContentChild, args: ['tooltipTemplate',] }],
    seriesTooltipTemplate: [{ type: ContentChild, args: ['seriesTooltipTemplate',] }],
    hideCircles: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbGluZS1jaGFydC9saW5lLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLHVCQUF1QixFQUFrQixNQUFNLGtDQUFrQyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQThKL0UsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGtCQUFrQjtJQTVKMUQ7O1FBOEpXLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsT0FBTyxDQUFDO1FBVWpDLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLFVBQUssR0FBUSxXQUFXLENBQUM7UUFDekIsa0JBQWEsR0FBVSxFQUFFLENBQUM7UUFHMUIsbUJBQWMs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LFFBQVEsRUFBRTs0QkFDbkIsS0FBSyxDQUFDO2dDQUNKLE9BQU8sRUFBRSxDQUFDOzZCQUNYLENBQUM7NEJBQ0YsT0FBTyxDQUNMLEdBQUcsRUFDSCxLQUFLLENBQUM7Z0NBQ0osT0FBTyxFQUFFLENBQUM7NkJBQ1gsQ0FBQyxDQUNIO3lCQUNGLENBQUM7cUJBQ0gsQ0FBQztpQkFDSDs7YUFDRjs7O3FCQUVFLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLO29CQUNMLEtBQUs7b0JBQ0wsS0FBSzs2QkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzRCQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7K0JBQ0wsS0FBSzs2QkFDTCxLQUFLOzZCQUNMLEtBQUs7K0JBQ0wsS0FBSztpQ0FDTCxLQUFLO2lDQUNMLEtBQUs7a0NBQ0wsS0FBSztrQ0FDTCxLQUFLO3lCQUNMLEtBQUs7eUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzhCQUNMLEtBQUs7MkJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLE1BQU07dUJBRU4sTUFBTTt5QkFDTixNQUFNOzhCQUVOLFlBQVksU0FBQyxpQkFBaUI7b0NBQzlCLFlBQVksU0FBQyx1QkFBdUI7MEJBcU1wQyxZQUFZLFNBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENvbnRlbnRDaGlsZCxcclxuICBUZW1wbGF0ZVJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgYW5pbWF0ZSwgdHJhbnNpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBzY2FsZUxpbmVhciwgc2NhbGVUaW1lLCBzY2FsZVBvaW50IH0gZnJvbSAnZDMtc2NhbGUnO1xyXG5pbXBvcnQgeyBjdXJ2ZUxpbmVhciB9IGZyb20gJ2QzLXNoYXBlJztcclxuXHJcbmltcG9ydCB7IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zLCBWaWV3RGltZW5zaW9ucyB9IGZyb20gJy4uL2NvbW1vbi92aWV3LWRpbWVuc2lvbnMuaGVscGVyJztcclxuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcclxuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcbmltcG9ydCB7IGdldFVuaXF1ZVhEb21haW5WYWx1ZXMsIGdldFNjYWxlVHlwZSB9IGZyb20gJy4uL2NvbW1vbi9kb21haW4uaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1saW5lLWNoYXJ0JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPG5neC1jaGFydHMtY2hhcnRcclxuICAgICAgW3ZpZXddPVwiW3dpZHRoLCBoZWlnaHRdXCJcclxuICAgICAgW3Nob3dMZWdlbmRdPVwibGVnZW5kXCJcclxuICAgICAgW2xlZ2VuZE9wdGlvbnNdPVwibGVnZW5kT3B0aW9uc1wiXHJcbiAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxyXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgKGxlZ2VuZExhYmVsQ2xpY2spPVwib25DbGljaygkZXZlbnQpXCJcclxuICAgICAgKGxlZ2VuZExhYmVsQWN0aXZhdGUpPVwib25BY3RpdmF0ZSgkZXZlbnQpXCJcclxuICAgICAgKGxlZ2VuZExhYmVsRGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICA+XHJcbiAgICAgIDxzdmc6ZGVmcz5cclxuICAgICAgICA8c3ZnOmNsaXBQYXRoIFthdHRyLmlkXT1cImNsaXBQYXRoSWRcIj5cclxuICAgICAgICAgIDxzdmc6cmVjdFxyXG4gICAgICAgICAgICBbYXR0ci53aWR0aF09XCJkaW1zLndpZHRoICsgMTBcIlxyXG4gICAgICAgICAgICBbYXR0ci5oZWlnaHRdPVwiZGltcy5oZWlnaHQgKyAxMFwiXHJcbiAgICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCIndHJhbnNsYXRlKC01LCAtNSknXCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9zdmc6Y2xpcFBhdGg+XHJcbiAgICAgIDwvc3ZnOmRlZnM+XHJcbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCIgY2xhc3M9XCJsaW5lLWNoYXJ0IGNoYXJ0XCI+XHJcbiAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICBuZ3gtY2hhcnRzLXgtYXhpc1xyXG4gICAgICAgICAgKm5nSWY9XCJ4QXhpc1wiXHJcbiAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXHJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcclxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxyXG4gICAgICAgICAgW3Nob3dMYWJlbF09XCJzaG93WEF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInhBeGlzTGFiZWxcIlxyXG4gICAgICAgICAgW3RyaW1UaWNrc109XCJ0cmltWEF4aXNUaWNrc1wiXHJcbiAgICAgICAgICBbcm90YXRlVGlja3NdPVwicm90YXRlWEF4aXNUaWNrc1wiXHJcbiAgICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhYQXhpc1RpY2tMZW5ndGhcIlxyXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInhBeGlzVGlja0Zvcm1hdHRpbmdcIlxyXG4gICAgICAgICAgW2FjdGl2ZVRpbWVdPVwiYWN0aXZlVGltZVwiXHJcbiAgICAgICAgICAoY2xpY2spPVwib25YQ2xpY2soJGV2ZW50KVwiXHJcbiAgICAgICAgICBbdGlja3NdPVwieEF4aXNUaWNrc1wiXHJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWEF4aXNIZWlnaHQoJGV2ZW50KVwiXHJcbiAgICAgICAgPjwvc3ZnOmc+XHJcbiAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICBuZ3gtY2hhcnRzLXktYXhpc1xyXG4gICAgICAgICAgKm5nSWY9XCJ5QXhpc1wiXHJcbiAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXHJcbiAgICAgICAgICBbZGltc109XCJkaW1zXCJcclxuICAgICAgICAgIFtzaG93R3JpZExpbmVzXT1cInNob3dHcmlkTGluZXNcIlxyXG4gICAgICAgICAgW3Nob3dMYWJlbF09XCJzaG93WUF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbbGFiZWxUZXh0XT1cInlBeGlzTGFiZWxcIlxyXG4gICAgICAgICAgW3RyaW1UaWNrc109XCJ0cmltWUF4aXNUaWNrc1wiXHJcbiAgICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhZQXhpc1RpY2tMZW5ndGhcIlxyXG4gICAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInlBeGlzVGlja0Zvcm1hdHRpbmdcIlxyXG4gICAgICAgICAgW3RpY2tzXT1cInlBeGlzVGlja3NcIlxyXG4gICAgICAgICAgW3JlZmVyZW5jZUxpbmVzXT1cInJlZmVyZW5jZUxpbmVzXCJcclxuICAgICAgICAgIFtzaG93UmVmTGluZXNdPVwic2hvd1JlZkxpbmVzXCJcclxuICAgICAgICAgIFtzaG93UmVmTGFiZWxzXT1cInNob3dSZWZMYWJlbHNcIlxyXG4gICAgICAgICAgKGRpbWVuc2lvbnNDaGFuZ2VkKT1cInVwZGF0ZVlBeGlzV2lkdGgoJGV2ZW50KVwiXHJcbiAgICAgICAgPjwvc3ZnOmc+XHJcbiAgICAgICAgPHN2ZzpnIFthdHRyLmNsaXAtcGF0aF09XCJjbGlwUGF0aFwiPlxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCBzZXJpZXMgb2YgcmVzdWx0czsgdHJhY2tCeTogdHJhY2tCeVwiIFtAYW5pbWF0aW9uU3RhdGVdPVwiJ2FjdGl2ZSdcIj5cclxuICAgICAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICAgICAgbmd4LWNoYXJ0cy1saW5lLXNlcmllc1xyXG4gICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcclxuICAgICAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXHJcbiAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxyXG4gICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXHJcbiAgICAgICAgICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXHJcbiAgICAgICAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxyXG4gICAgICAgICAgICAgIFtjdXJ2ZV09XCJjdXJ2ZVwiXHJcbiAgICAgICAgICAgICAgW3JhbmdlRmlsbE9wYWNpdHldPVwicmFuZ2VGaWxsT3BhY2l0eVwiXHJcbiAgICAgICAgICAgICAgW2hhc1JhbmdlXT1cImhhc1JhbmdlXCJcclxuICAgICAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvc3ZnOmc+XHJcblxyXG4gICAgICAgICAgPHN2ZzpnICpuZ0lmPVwiIXRvb2x0aXBEaXNhYmxlZFwiIChtb3VzZWxlYXZlKT1cImhpZGVDaXJjbGVzKClcIj5cclxuICAgICAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICAgICAgbmd4LWNoYXJ0cy10b29sdGlwLWFyZWFcclxuICAgICAgICAgICAgICBbZGltc109XCJkaW1zXCJcclxuICAgICAgICAgICAgICBbeFNldF09XCJ4U2V0XCJcclxuICAgICAgICAgICAgICBbeFNjYWxlXT1cInhTY2FsZVwiXHJcbiAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxyXG4gICAgICAgICAgICAgIFtyZXN1bHRzXT1cInJlc3VsdHNcIlxyXG4gICAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcclxuICAgICAgICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJzZXJpZXNUb29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgIChob3Zlcik9XCJ1cGRhdGVIb3ZlcmVkVmVydGljYWwoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzXCI+XHJcbiAgICAgICAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICAgICAgICBuZ3gtY2hhcnRzLWNpcmNsZS1zZXJpZXNcclxuICAgICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcclxuICAgICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcclxuICAgICAgICAgICAgICAgIFtjb2xvcnNdPVwiY29sb3JzXCJcclxuICAgICAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXHJcbiAgICAgICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXHJcbiAgICAgICAgICAgICAgICBbdmlzaWJsZVZhbHVlXT1cImhvdmVyZWRWZXJ0aWNhbFwiXHJcbiAgICAgICAgICAgICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcclxuICAgICAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgIChzZWxlY3QpPVwib25DbGljaygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgKGRlYWN0aXZhdGUpPVwib25EZWFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtdGltZWxpbmVcclxuICAgICAgICAqbmdJZj1cInRpbWVsaW5lICYmIHNjYWxlVHlwZSAhPSAnb3JkaW5hbCdcIlxyXG4gICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0aW1lbGluZVRyYW5zZm9ybVwiXHJcbiAgICAgICAgW3Jlc3VsdHNdPVwicmVzdWx0c1wiXHJcbiAgICAgICAgW3ZpZXddPVwiW3RpbWVsaW5lV2lkdGgsIGhlaWdodF1cIlxyXG4gICAgICAgIFtoZWlnaHRdPVwidGltZWxpbmVIZWlnaHRcIlxyXG4gICAgICAgIFtzY2hlbWVdPVwic2NoZW1lXCJcclxuICAgICAgICBbY3VzdG9tQ29sb3JzXT1cImN1c3RvbUNvbG9yc1wiXHJcbiAgICAgICAgW3NjYWxlVHlwZV09XCJzY2FsZVR5cGVcIlxyXG4gICAgICAgIFtsZWdlbmRdPVwibGVnZW5kXCJcclxuICAgICAgICAob25Eb21haW5DaGFuZ2UpPVwidXBkYXRlRG9tYWluKCRldmVudClcIlxyXG4gICAgICA+XHJcbiAgICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCBzZXJpZXMgb2YgcmVzdWx0czsgdHJhY2tCeTogdHJhY2tCeVwiPlxyXG4gICAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICAgIG5neC1jaGFydHMtbGluZS1zZXJpZXNcclxuICAgICAgICAgICAgW3hTY2FsZV09XCJ0aW1lbGluZVhTY2FsZVwiXHJcbiAgICAgICAgICAgIFt5U2NhbGVdPVwidGltZWxpbmVZU2NhbGVcIlxyXG4gICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXHJcbiAgICAgICAgICAgIFtkYXRhXT1cInNlcmllc1wiXHJcbiAgICAgICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcclxuICAgICAgICAgICAgW2N1cnZlXT1cImN1cnZlXCJcclxuICAgICAgICAgICAgW2hhc1JhbmdlXT1cImhhc1JhbmdlXCJcclxuICAgICAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L25neC1jaGFydHMtY2hhcnQ+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFsnLi4vY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnNjc3MnXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFtcclxuICAgIHRyaWdnZXIoJ2FuaW1hdGlvblN0YXRlJywgW1xyXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXHJcbiAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGFuaW1hdGUoXHJcbiAgICAgICAgICA1MDAsXHJcbiAgICAgICAgICBzdHlsZSh7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgKVxyXG4gICAgICBdKVxyXG4gICAgXSlcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaW5lQ2hhcnRDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGxlZ2VuZDtcclxuICBASW5wdXQoKSBsZWdlbmRUaXRsZTogc3RyaW5nID0gJ0xlZ2VuZCc7XHJcbiAgQElucHV0KCkgbGVnZW5kUG9zaXRpb246IHN0cmluZyA9ICdyaWdodCc7XHJcbiAgQElucHV0KCkgeEF4aXM7XHJcbiAgQElucHV0KCkgeUF4aXM7XHJcbiAgQElucHV0KCkgc2hvd1hBeGlzTGFiZWw7XHJcbiAgQElucHV0KCkgc2hvd1lBeGlzTGFiZWw7XHJcbiAgQElucHV0KCkgeEF4aXNMYWJlbDtcclxuICBASW5wdXQoKSB5QXhpc0xhYmVsO1xyXG4gIEBJbnB1dCgpIGF1dG9TY2FsZTtcclxuICBASW5wdXQoKSB0aW1lbGluZTtcclxuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzaG93R3JpZExpbmVzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBjdXJ2ZTogYW55ID0gY3VydmVMaW5lYXI7XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W10gPSBbXTtcclxuICBASW5wdXQoKSBzY2hlbWVUeXBlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgcmFuZ2VGaWxsT3BhY2l0eTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHRyaW1YQXhpc1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSB0cmltWUF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgcm90YXRlWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgbWF4WEF4aXNUaWNrTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBASW5wdXQoKSBtYXhZQXhpc1RpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xyXG4gIEBJbnB1dCgpIHhBeGlzVGlja0Zvcm1hdHRpbmc6IGFueTtcclxuICBASW5wdXQoKSB5QXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgeEF4aXNUaWNrczogYW55W107XHJcbiAgQElucHV0KCkgeUF4aXNUaWNrczogYW55W107XHJcbiAgQElucHV0KCkgcm91bmREb21haW5zOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgc2hvd1JlZkxpbmVzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgcmVmZXJlbmNlTGluZXM6IGFueTtcclxuICBASW5wdXQoKSBzaG93UmVmTGFiZWxzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSB4U2NhbGVNaW46IGFueTtcclxuICBASW5wdXQoKSB4U2NhbGVNYXg6IGFueTtcclxuICBASW5wdXQoKSB5U2NhbGVNaW46IG51bWJlcjtcclxuICBASW5wdXQoKSB5U2NhbGVNYXg6IG51bWJlcjtcclxuICBASW5wdXQoKSBhY3RpdmVUaW1lO1xyXG4gIEBPdXRwdXQoKSBjbGlja0NhbGxiYWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBAQ29udGVudENoaWxkKCdzZXJpZXNUb29sdGlwVGVtcGxhdGUnKSBzZXJpZXNUb29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIHhTZXQ6IGFueTtcclxuICB4RG9tYWluOiBhbnk7XHJcbiAgeURvbWFpbjogYW55O1xyXG4gIHNlcmllc0RvbWFpbjogYW55O1xyXG4gIHlTY2FsZTogYW55O1xyXG4gIHhTY2FsZTogYW55O1xyXG4gIGNvbG9yczogQ29sb3JIZWxwZXI7XHJcbiAgc2NhbGVUeXBlOiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgY2xpcFBhdGg6IHN0cmluZztcclxuICBjbGlwUGF0aElkOiBzdHJpbmc7XHJcbiAgc2VyaWVzOiBhbnk7XHJcbiAgYXJlYVBhdGg6IGFueTtcclxuICBtYXJnaW4gPSBbMTAsIDIwLCAxMCwgMjBdO1xyXG4gIGhvdmVyZWRWZXJ0aWNhbDogYW55OyAvLyB0aGUgdmFsdWUgb2YgdGhlIHggYXhpcyB0aGF0IGlzIGhvdmVyZWQgb3ZlclxyXG4gIHhBeGlzSGVpZ2h0OiBudW1iZXIgPSAwO1xyXG4gIHlBeGlzV2lkdGg6IG51bWJlciA9IDA7XHJcbiAgZmlsdGVyZWREb21haW46IGFueTtcclxuICBsZWdlbmRPcHRpb25zOiBhbnk7XHJcbiAgaGFzUmFuZ2U6IGJvb2xlYW47IC8vIHdoZXRoZXIgdGhlIGxpbmUgaGFzIGEgbWluLW1heCByYW5nZSBhcm91bmQgaXRcclxuICB0aW1lbGluZVdpZHRoOiBhbnk7XHJcbiAgdGltZWxpbmVIZWlnaHQ6IG51bWJlciA9IDUwO1xyXG4gIHRpbWVsaW5lWFNjYWxlOiBhbnk7XHJcbiAgdGltZWxpbmVZU2NhbGU6IGFueTtcclxuICB0aW1lbGluZVhEb21haW46IGFueTtcclxuICB0aW1lbGluZVRyYW5zZm9ybTogYW55O1xyXG4gIHRpbWVsaW5lUGFkZGluZzogbnVtYmVyID0gMTA7XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHN1cGVyLnVwZGF0ZSgpO1xyXG5cclxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luLFxyXG4gICAgICBzaG93WEF4aXM6IHRoaXMueEF4aXMsXHJcbiAgICAgIHNob3dZQXhpczogdGhpcy55QXhpcyxcclxuICAgICAgeEF4aXNIZWlnaHQ6IHRoaXMueEF4aXNIZWlnaHQsXHJcbiAgICAgIHlBeGlzV2lkdGg6IHRoaXMueUF4aXNXaWR0aCxcclxuICAgICAgc2hvd1hMYWJlbDogdGhpcy5zaG93WEF4aXNMYWJlbCxcclxuICAgICAgc2hvd1lMYWJlbDogdGhpcy5zaG93WUF4aXNMYWJlbCxcclxuICAgICAgc2hvd0xlZ2VuZDogdGhpcy5sZWdlbmQsXHJcbiAgICAgIGxlZ2VuZFR5cGU6IHRoaXMuc2NoZW1lVHlwZSxcclxuICAgICAgbGVnZW5kUG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLnRpbWVsaW5lKSB7XHJcbiAgICAgIHRoaXMuZGltcy5oZWlnaHQgLT0gdGhpcy50aW1lbGluZUhlaWdodCArIHRoaXMubWFyZ2luWzJdICsgdGhpcy50aW1lbGluZVBhZGRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy54RG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XHJcbiAgICBpZiAodGhpcy5maWx0ZXJlZERvbWFpbikge1xyXG4gICAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMueURvbWFpbiA9IHRoaXMuZ2V0WURvbWFpbigpO1xyXG4gICAgdGhpcy5zZXJpZXNEb21haW4gPSB0aGlzLmdldFNlcmllc0RvbWFpbigpO1xyXG5cclxuICAgIHRoaXMueFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy54RG9tYWluLCB0aGlzLmRpbXMud2lkdGgpO1xyXG4gICAgdGhpcy55U2NhbGUgPSB0aGlzLmdldFlTY2FsZSh0aGlzLnlEb21haW4sIHRoaXMuZGltcy5oZWlnaHQpO1xyXG5cclxuICAgIHRoaXMudXBkYXRlVGltZWxpbmUoKTtcclxuXHJcbiAgICB0aGlzLnNldENvbG9ycygpO1xyXG4gICAgdGhpcy5sZWdlbmRPcHRpb25zID0gdGhpcy5nZXRMZWdlbmRPcHRpb25zKCk7XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5kaW1zLnhPZmZzZXR9ICwgJHt0aGlzLm1hcmdpblswXX0pYDtcclxuXHJcbiAgICB0aGlzLmNsaXBQYXRoSWQgPSAnY2xpcCcgKyBpZCgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLmNsaXBQYXRoID0gYHVybCgjJHt0aGlzLmNsaXBQYXRoSWR9KWA7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaW1lbGluZSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLnRpbWVsaW5lKSB7XHJcbiAgICAgIHRoaXMudGltZWxpbmVXaWR0aCA9IHRoaXMuZGltcy53aWR0aDtcclxuICAgICAgdGhpcy50aW1lbGluZVhEb21haW4gPSB0aGlzLmdldFhEb21haW4oKTtcclxuICAgICAgdGhpcy50aW1lbGluZVhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMudGltZWxpbmVYRG9tYWluLCB0aGlzLnRpbWVsaW5lV2lkdGgpO1xyXG4gICAgICB0aGlzLnRpbWVsaW5lWVNjYWxlID0gdGhpcy5nZXRZU2NhbGUodGhpcy55RG9tYWluLCB0aGlzLnRpbWVsaW5lSGVpZ2h0KTtcclxuICAgICAgdGhpcy50aW1lbGluZVRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLmRpbXMueE9mZnNldH0sICR7LXRoaXMubWFyZ2luWzJdfSlgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0WERvbWFpbigpOiBhbnlbXSB7XHJcbiAgICBsZXQgdmFsdWVzID0gZ2V0VW5pcXVlWERvbWFpblZhbHVlcyh0aGlzLnJlc3VsdHMpO1xyXG5cclxuICAgIHRoaXMuc2NhbGVUeXBlID0gZ2V0U2NhbGVUeXBlKHZhbHVlcyk7XHJcbiAgICBsZXQgZG9tYWluID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICB2YWx1ZXMgPSB2YWx1ZXMubWFwKHYgPT4gTnVtYmVyKHYpKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWluO1xyXG4gICAgbGV0IG1heDtcclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnIHx8IHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICBtaW4gPSB0aGlzLnhTY2FsZU1pbiA/IHRoaXMueFNjYWxlTWluIDogTWF0aC5taW4oLi4udmFsdWVzKTtcclxuXHJcbiAgICAgIG1heCA9IHRoaXMueFNjYWxlTWF4ID8gdGhpcy54U2NhbGVNYXggOiBNYXRoLm1heCguLi52YWx1ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XHJcbiAgICAgIGRvbWFpbiA9IFtuZXcgRGF0ZShtaW4pLCBuZXcgRGF0ZShtYXgpXTtcclxuICAgICAgdGhpcy54U2V0ID0gWy4uLnZhbHVlc10uc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFEYXRlID0gYS5nZXRUaW1lKCk7XHJcbiAgICAgICAgY29uc3QgYkRhdGUgPSBiLmdldFRpbWUoKTtcclxuICAgICAgICBpZiAoYURhdGUgPiBiRGF0ZSkgcmV0dXJuIDE7XHJcbiAgICAgICAgaWYgKGJEYXRlID4gYURhdGUpIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICBkb21haW4gPSBbbWluLCBtYXhdO1xyXG4gICAgICAvLyBVc2UgY29tcGFyZSBmdW5jdGlvbiB0byBzb3J0IG51bWJlcnMgbnVtZXJpY2FsbHlcclxuICAgICAgdGhpcy54U2V0ID0gWy4uLnZhbHVlc10uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9tYWluID0gdmFsdWVzO1xyXG4gICAgICB0aGlzLnhTZXQgPSB2YWx1ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRvbWFpbjtcclxuICB9XHJcblxyXG4gIGdldFlEb21haW4oKTogYW55W10ge1xyXG4gICAgY29uc3QgZG9tYWluID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHJlc3VsdHMgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZCBvZiByZXN1bHRzLnNlcmllcykge1xyXG4gICAgICAgIGlmIChkb21haW4uaW5kZXhPZihkLnZhbHVlKSA8IDApIHtcclxuICAgICAgICAgIGRvbWFpbi5wdXNoKGQudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZC5taW4gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhpcy5oYXNSYW5nZSA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoZG9tYWluLmluZGV4T2YoZC5taW4pIDwgMCkge1xyXG4gICAgICAgICAgICBkb21haW4ucHVzaChkLm1pbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkLm1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc1JhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChkb21haW4uaW5kZXhPZihkLm1heCkgPCAwKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbi5wdXNoKGQubWF4KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSBbLi4uZG9tYWluXTtcclxuICAgIGlmICghdGhpcy5hdXRvU2NhbGUpIHtcclxuICAgICAgdmFsdWVzLnB1c2goMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWluID0gdGhpcy55U2NhbGVNaW4gPyB0aGlzLnlTY2FsZU1pbiA6IE1hdGgubWluKC4uLnZhbHVlcyk7XHJcblxyXG4gICAgY29uc3QgbWF4ID0gdGhpcy55U2NhbGVNYXggPyB0aGlzLnlTY2FsZU1heCA6IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcblxyXG4gICAgcmV0dXJuIFttaW4sIG1heF07XHJcbiAgfVxyXG5cclxuICBnZXRTZXJpZXNEb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoZCA9PiBkLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0WFNjYWxlKGRvbWFpbiwgd2lkdGgpOiBhbnkge1xyXG4gICAgbGV0IHNjYWxlO1xyXG5cclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XHJcbiAgICAgIHNjYWxlID0gc2NhbGVUaW1lKCkucmFuZ2UoWzAsIHdpZHRoXSkuZG9tYWluKGRvbWFpbik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHdpZHRoXSkuZG9tYWluKGRvbWFpbik7XHJcblxyXG4gICAgICBpZiAodGhpcy5yb3VuZERvbWFpbnMpIHtcclxuICAgICAgICBzY2FsZSA9IHNjYWxlLm5pY2UoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICAgIHNjYWxlID0gc2NhbGVQb2ludCgpLnJhbmdlKFswLCB3aWR0aF0pLnBhZGRpbmcoMC4xKS5kb21haW4oZG9tYWluKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2NhbGU7XHJcbiAgfVxyXG5cclxuICBnZXRZU2NhbGUoZG9tYWluLCBoZWlnaHQpOiBhbnkge1xyXG4gICAgY29uc3Qgc2NhbGUgPSBzY2FsZUxpbmVhcigpLnJhbmdlKFtoZWlnaHQsIDBdKS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5yb3VuZERvbWFpbnMgPyBzY2FsZS5uaWNlKCkgOiBzY2FsZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURvbWFpbihkb21haW4pOiB2b2lkIHtcclxuICAgIHRoaXMuZmlsdGVyZWREb21haW4gPSBkb21haW47XHJcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmZpbHRlcmVkRG9tYWluO1xyXG4gICAgdGhpcy54U2NhbGUgPSB0aGlzLmdldFhTY2FsZSh0aGlzLnhEb21haW4sIHRoaXMuZGltcy53aWR0aCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVIb3ZlcmVkVmVydGljYWwoaXRlbSk6IHZvaWQge1xyXG4gICAgdGhpcy5ob3ZlcmVkVmVydGljYWwgPSBpdGVtLnZhbHVlO1xyXG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcclxuICBoaWRlQ2lyY2xlcygpOiB2b2lkIHtcclxuICAgIHRoaXMuaG92ZXJlZFZlcnRpY2FsID0gbnVsbDtcclxuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhkYXRhKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgb25YQ2xpY2soZGF0YSk6dm9pZHtcclxuICAgIHRoaXMuY2xpY2tDYWxsYmFjay5lbWl0KGRhdGEpO1xyXG4gICAgdGhpcy5hY3RpdmVUaW1lPWRhdGE7XHJcbiAgfVxyXG5cclxuICB0cmFja0J5KGluZGV4LCBpdGVtKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBpdGVtLm5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICBsZXQgZG9tYWluO1xyXG4gICAgaWYgKHRoaXMuc2NoZW1lVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICAgIGRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9tYWluID0gdGhpcy55RG9tYWluO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCB0aGlzLnNjaGVtZVR5cGUsIGRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxyXG4gICAgICBjb2xvcnM6IHVuZGVmaW5lZCxcclxuICAgICAgZG9tYWluOiBbXSxcclxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcclxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH07XHJcbiAgICBpZiAob3B0cy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xyXG4gICAgICBvcHRzLmRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xyXG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzO1xyXG4gICAgICBvcHRzLnRpdGxlID0gdGhpcy5sZWdlbmRUaXRsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9wdHMuZG9tYWluID0gdGhpcy55RG9tYWluO1xyXG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzLnNjYWxlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdHM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVZQXhpc1dpZHRoKHsgd2lkdGggfSk6IHZvaWQge1xyXG4gICAgdGhpcy55QXhpc1dpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlWEF4aXNIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xyXG4gICAgdGhpcy54QXhpc0hlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlKGl0ZW0pIHtcclxuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xyXG5cclxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XHJcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaWR4ID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtpdGVtXTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBvbkRlYWN0aXZhdGUoaXRlbSkge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcclxuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlQWxsKCkge1xyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuYWN0aXZlRW50cmllcykge1xyXG4gICAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBlbnRyeSwgZW50cmllczogW10gfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbXTtcclxuICB9XHJcbn1cclxuIl19