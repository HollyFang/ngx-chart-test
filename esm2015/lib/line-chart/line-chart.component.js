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
        if (this.activeTime.getTime()) {
            this.setActiveTime();
        }
        this.updateTimeline();
        this.setColors();
        this.legendOptions = this.getLegendOptions();
        this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;
    }
    setActiveTime() {
        let adjustedScale = this.xScale.bandwidth
            ? function (d) {
                return this.xScale(d) + this.xScale.bandwidth() * 0.5;
            }
            : this.xScale;
        this.activeVal = adjustedScale(this.activeTime);
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
        if (this.clickCallback.observers.length) {
            let _domain = this.getXDomain();
            let _time = new Date((_domain[1].getTime() - _domain[0].getTime()) / this.dims.width * (data.offsetX - this.dims.xOffset) + _domain[0].getTime());
            this.activeTime = _time;
            this.clickCallback.emit(_time);
        }
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
      <svg:g [attr.transform]="transform" class="line-chart chart" (click)="onXClick($event)">
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
      <svg:g *ngIf="activeTime" [attr.transform]="transform">
        <svg:line
          class="refline-path gridline-path-horizontal"
          [attr.x1]="activeVal"
          y1="0"
          style="stroke: #000;stroke-dasharray:none;"
          [attr.x2]="activeVal"
          [attr.y2]="dims.height+6"
        />
        <svg:text
          class="refline-label"
          [attr.y]="-3"
          [attr.x]="activeVal"
          [attr.text-anchor]="(activeVal>dims.width-70)?'end':'middle'"
        >
          {{ activeTime.toLocaleString() }}
        </svg:text>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbGluZS1jaGFydC9saW5lLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGlCQUFpQixFQUNqQixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLHVCQUF1QixFQUFrQixNQUFNLGtDQUFrQyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQThLL0UsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGtCQUFrQjtJQTVLMUQ7O1FBOEtXLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLG1CQUFjLEdBQVcsT0FBTyxDQUFDO1FBVWpDLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBQzlCLFVBQUssR0FBUSxXQUFXLENBQUM7UUFDekIsa0JBQWEsR0FBVSxFQUFFLENBQUM7UUFHMUIsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFDL0IsbUJBQWMsR0FBWSxJQUFJLENBQUM7UUFDL0IscUJBQWdCLEdBQVksSUFBSSxDQUFDO1FBQ2pDLHVCQUFrQixHQUFXLEVBQUUsQ0FBQztRQUNoQyx1QkFBa0IsR0FBVyxFQUFFLENBQUM7UUFLaEMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFFOUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFNN0Isa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0RCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBbUI3RCxXQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUxQixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBS3ZCLG1CQUFjLEdBQVcsRUFBRSxDQUFDO1FBSzVCLG9CQUFlLEdBQVcsRUFBRSxDQUFDO0lBb1IvQixDQUFDO0lBalJDLE1BQU07UUFDSixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsSUFBSSxHQUFHLHVCQUF1QixDQUFDO1lBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ3BCLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSztZQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDckIsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDL0IsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjO1lBQy9CLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTTtZQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUNqRjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDcEM7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUUzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0QsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFDO1lBQzNCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUU3QyxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBRXZFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUM7SUFDN0MsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDdkMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUM7WUFDeEQsQ0FBQztZQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksTUFBTSxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUMvQixNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDNUQsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUU1RCxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1NBQzdEO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtZQUM3QixNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFB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SCxDQUFDO2lCQUNIOzthQUNGOzs7cUJBRUUsS0FBSzswQkFDTCxLQUFLOzZCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLOzZCQUNMLEtBQUs7NkJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSztvQkFDTCxLQUFLOzRCQUNMLEtBQUs7eUJBQ0wsS0FBSzsrQkFDTCxLQUFLOzZCQUNMLEtBQUs7NkJBQ0wsS0FBSzsrQkFDTCxLQUFLO2lDQUNMLEtBQUs7aUNBQ0wsS0FBSztrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzZCQUNMLEtBQUs7NEJBQ0wsS0FBSzt3QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7NEJBQ0wsTUFBTTt1QkFFTixNQUFNO3lCQUNOLE1BQU07OEJBRU4sWUFBWSxTQUFDLGlCQUFpQjtvQ0FDOUIsWUFBWSxTQUFDLHVCQUF1QjswQkFrTnBDLFlBQVksU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ29udGVudENoaWxkLFxyXG4gIFRlbXBsYXRlUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHRyaWdnZXIsIHN0eWxlLCBhbmltYXRlLCB0cmFuc2l0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IHNjYWxlTGluZWFyLCBzY2FsZVRpbWUsIHNjYWxlUG9pbnQgfSBmcm9tICdkMy1zY2FsZSc7XHJcbmltcG9ydCB7IGN1cnZlTGluZWFyIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5cclxuaW1wb3J0IHsgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMsIFZpZXdEaW1lbnNpb25zIH0gZnJvbSAnLi4vY29tbW9uL3ZpZXctZGltZW5zaW9ucy5oZWxwZXInO1xyXG5pbXBvcnQgeyBDb2xvckhlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jb2xvci5oZWxwZXInO1xyXG5pbXBvcnQgeyBCYXNlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21tb24vYmFzZS1jaGFydC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcclxuaW1wb3J0IHsgZ2V0VW5pcXVlWERvbWFpblZhbHVlcywgZ2V0U2NhbGVUeXBlIH0gZnJvbSAnLi4vY29tbW9uL2RvbWFpbi5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtY2hhcnRzLWxpbmUtY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8bmd4LWNoYXJ0cy1jaGFydFxyXG4gICAgICBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIlxyXG4gICAgICBbc2hvd0xlZ2VuZF09XCJsZWdlbmRcIlxyXG4gICAgICBbbGVnZW5kT3B0aW9uc109XCJsZWdlbmRPcHRpb25zXCJcclxuICAgICAgW2FjdGl2ZUVudHJpZXNdPVwiYWN0aXZlRW50cmllc1wiXHJcbiAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAobGVnZW5kTGFiZWxDbGljayk9XCJvbkNsaWNrKCRldmVudClcIlxyXG4gICAgICAobGVnZW5kTGFiZWxBY3RpdmF0ZSk9XCJvbkFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAobGVnZW5kTGFiZWxEZWFjdGl2YXRlKT1cIm9uRGVhY3RpdmF0ZSgkZXZlbnQpXCJcclxuICAgID5cclxuICAgICAgPHN2ZzpkZWZzPlxyXG4gICAgICAgIDxzdmc6Y2xpcFBhdGggW2F0dHIuaWRdPVwiY2xpcFBhdGhJZFwiPlxyXG4gICAgICAgICAgPHN2ZzpyZWN0XHJcbiAgICAgICAgICAgIFthdHRyLndpZHRoXT1cImRpbXMud2lkdGggKyAxMFwiXHJcbiAgICAgICAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodCArIDEwXCJcclxuICAgICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cIid0cmFuc2xhdGUoLTUsIC01KSdcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L3N2ZzpjbGlwUGF0aD5cclxuICAgICAgPC9zdmc6ZGVmcz5cclxuICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiBjbGFzcz1cImxpbmUtY2hhcnQgY2hhcnRcIiAoY2xpY2spPVwib25YQ2xpY2soJGV2ZW50KVwiPlxyXG4gICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgbmd4LWNoYXJ0cy14LWF4aXNcclxuICAgICAgICAgICpuZ0lmPVwieEF4aXNcIlxyXG4gICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxyXG4gICAgICAgICAgW2RpbXNdPVwiZGltc1wiXHJcbiAgICAgICAgICBbc2hvd0dyaWRMaW5lc109XCJzaG93R3JpZExpbmVzXCJcclxuICAgICAgICAgIFtzaG93TGFiZWxdPVwic2hvd1hBeGlzTGFiZWxcIlxyXG4gICAgICAgICAgW2xhYmVsVGV4dF09XCJ4QXhpc0xhYmVsXCJcclxuICAgICAgICAgIFt0cmltVGlja3NdPVwidHJpbVhBeGlzVGlja3NcIlxyXG4gICAgICAgICAgW3JvdGF0ZVRpY2tzXT1cInJvdGF0ZVhBeGlzVGlja3NcIlxyXG4gICAgICAgICAgW21heFRpY2tMZW5ndGhdPVwibWF4WEF4aXNUaWNrTGVuZ3RoXCJcclxuICAgICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJ4QXhpc1RpY2tGb3JtYXR0aW5nXCJcclxuICAgICAgICAgIFt0aWNrc109XCJ4QXhpc1RpY2tzXCJcclxuICAgICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJ1cGRhdGVYQXhpc0hlaWdodCgkZXZlbnQpXCJcclxuICAgICAgICA+PC9zdmc6Zz5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMteS1heGlzXHJcbiAgICAgICAgICAqbmdJZj1cInlBeGlzXCJcclxuICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcclxuICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxyXG4gICAgICAgICAgW3Nob3dHcmlkTGluZXNdPVwic2hvd0dyaWRMaW5lc1wiXHJcbiAgICAgICAgICBbc2hvd0xhYmVsXT1cInNob3dZQXhpc0xhYmVsXCJcclxuICAgICAgICAgIFtsYWJlbFRleHRdPVwieUF4aXNMYWJlbFwiXHJcbiAgICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1ZQXhpc1RpY2tzXCJcclxuICAgICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFlBeGlzVGlja0xlbmd0aFwiXHJcbiAgICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwieUF4aXNUaWNrRm9ybWF0dGluZ1wiXHJcbiAgICAgICAgICBbdGlja3NdPVwieUF4aXNUaWNrc1wiXHJcbiAgICAgICAgICBbcmVmZXJlbmNlTGluZXNdPVwicmVmZXJlbmNlTGluZXNcIlxyXG4gICAgICAgICAgW3Nob3dSZWZMaW5lc109XCJzaG93UmVmTGluZXNcIlxyXG4gICAgICAgICAgW3Nob3dSZWZMYWJlbHNdPVwic2hvd1JlZkxhYmVsc1wiXHJcbiAgICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwidXBkYXRlWUF4aXNXaWR0aCgkZXZlbnQpXCJcclxuICAgICAgICA+PC9zdmc6Zz5cclxuICAgICAgICA8c3ZnOmcgW2F0dHIuY2xpcC1wYXRoXT1cImNsaXBQYXRoXCI+XHJcbiAgICAgICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHNlcmllcyBvZiByZXN1bHRzOyB0cmFja0J5OiB0cmFja0J5XCIgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiPlxyXG4gICAgICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgICAgICBuZ3gtY2hhcnRzLWxpbmUtc2VyaWVzXHJcbiAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxyXG4gICAgICAgICAgICAgIFt5U2NhbGVdPVwieVNjYWxlXCJcclxuICAgICAgICAgICAgICBbY29sb3JzXT1cImNvbG9yc1wiXHJcbiAgICAgICAgICAgICAgW2RhdGFdPVwic2VyaWVzXCJcclxuICAgICAgICAgICAgICBbYWN0aXZlRW50cmllc109XCJhY3RpdmVFbnRyaWVzXCJcclxuICAgICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXHJcbiAgICAgICAgICAgICAgW2N1cnZlXT1cImN1cnZlXCJcclxuICAgICAgICAgICAgICBbcmFuZ2VGaWxsT3BhY2l0eV09XCJyYW5nZUZpbGxPcGFjaXR5XCJcclxuICAgICAgICAgICAgICBbaGFzUmFuZ2VdPVwiaGFzUmFuZ2VcIlxyXG4gICAgICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuXHJcbiAgICAgICAgICA8c3ZnOmcgKm5nSWY9XCIhdG9vbHRpcERpc2FibGVkXCIgKG1vdXNlbGVhdmUpPVwiaGlkZUNpcmNsZXMoKVwiPlxyXG4gICAgICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgICAgICBuZ3gtY2hhcnRzLXRvb2x0aXAtYXJlYVxyXG4gICAgICAgICAgICAgIFtkaW1zXT1cImRpbXNcIlxyXG4gICAgICAgICAgICAgIFt4U2V0XT1cInhTZXRcIlxyXG4gICAgICAgICAgICAgIFt4U2NhbGVdPVwieFNjYWxlXCJcclxuICAgICAgICAgICAgICBbeVNjYWxlXT1cInlTY2FsZVwiXHJcbiAgICAgICAgICAgICAgW3Jlc3VsdHNdPVwicmVzdWx0c1wiXHJcbiAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxyXG4gICAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInNlcmllc1Rvb2x0aXBUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgKGhvdmVyKT1cInVwZGF0ZUhvdmVyZWRWZXJ0aWNhbCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIHJlc3VsdHNcIj5cclxuICAgICAgICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgICAgICAgIG5neC1jaGFydHMtY2lyY2xlLXNlcmllc1xyXG4gICAgICAgICAgICAgICAgW3hTY2FsZV09XCJ4U2NhbGVcIlxyXG4gICAgICAgICAgICAgICAgW3lTY2FsZV09XCJ5U2NhbGVcIlxyXG4gICAgICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxyXG4gICAgICAgICAgICAgICAgW2RhdGFdPVwic2VyaWVzXCJcclxuICAgICAgICAgICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcclxuICAgICAgICAgICAgICAgIFt2aXNpYmxlVmFsdWVdPVwiaG92ZXJlZFZlcnRpY2FsXCJcclxuICAgICAgICAgICAgICAgIFthY3RpdmVFbnRyaWVzXT1cImFjdGl2ZUVudHJpZXNcIlxyXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBEaXNhYmxlZF09XCJ0b29sdGlwRGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgKGFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJvbkRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICAgIDwvc3ZnOmc+XHJcbiAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgICAgPHN2ZzpnICpuZ0lmPVwiYWN0aXZlVGltZVwiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIj5cclxuICAgICAgICA8c3ZnOmxpbmVcclxuICAgICAgICAgIGNsYXNzPVwicmVmbGluZS1wYXRoIGdyaWRsaW5lLXBhdGgtaG9yaXpvbnRhbFwiXHJcbiAgICAgICAgICBbYXR0ci54MV09XCJhY3RpdmVWYWxcIlxyXG4gICAgICAgICAgeTE9XCIwXCJcclxuICAgICAgICAgIHN0eWxlPVwic3Ryb2tlOiAjMDAwO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtcIlxyXG4gICAgICAgICAgW2F0dHIueDJdPVwiYWN0aXZlVmFsXCJcclxuICAgICAgICAgIFthdHRyLnkyXT1cImRpbXMuaGVpZ2h0KzZcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgICBjbGFzcz1cInJlZmxpbmUtbGFiZWxcIlxyXG4gICAgICAgICAgW2F0dHIueV09XCItM1wiXHJcbiAgICAgICAgICBbYXR0ci54XT1cImFjdGl2ZVZhbFwiXHJcbiAgICAgICAgICBbYXR0ci50ZXh0LWFuY2hvcl09XCIoYWN0aXZlVmFsPmRpbXMud2lkdGgtNzApPydlbmQnOidtaWRkbGUnXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICB7eyBhY3RpdmVUaW1lLnRvTG9jYWxlU3RyaW5nKCkgfX1cclxuICAgICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLXRpbWVsaW5lXHJcbiAgICAgICAgKm5nSWY9XCJ0aW1lbGluZSAmJiBzY2FsZVR5cGUgIT0gJ29yZGluYWwnXCJcclxuICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidGltZWxpbmVUcmFuc2Zvcm1cIlxyXG4gICAgICAgIFtyZXN1bHRzXT1cInJlc3VsdHNcIlxyXG4gICAgICAgIFt2aWV3XT1cIlt0aW1lbGluZVdpZHRoLCBoZWlnaHRdXCJcclxuICAgICAgICBbaGVpZ2h0XT1cInRpbWVsaW5lSGVpZ2h0XCJcclxuICAgICAgICBbc2NoZW1lXT1cInNjaGVtZVwiXHJcbiAgICAgICAgW2N1c3RvbUNvbG9yc109XCJjdXN0b21Db2xvcnNcIlxyXG4gICAgICAgIFtzY2FsZVR5cGVdPVwic2NhbGVUeXBlXCJcclxuICAgICAgICBbbGVnZW5kXT1cImxlZ2VuZFwiXHJcbiAgICAgICAgKG9uRG9tYWluQ2hhbmdlKT1cInVwZGF0ZURvbWFpbigkZXZlbnQpXCJcclxuICAgICAgPlxyXG4gICAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgc2VyaWVzIG9mIHJlc3VsdHM7IHRyYWNrQnk6IHRyYWNrQnlcIj5cclxuICAgICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgICBuZ3gtY2hhcnRzLWxpbmUtc2VyaWVzXHJcbiAgICAgICAgICAgIFt4U2NhbGVdPVwidGltZWxpbmVYU2NhbGVcIlxyXG4gICAgICAgICAgICBbeVNjYWxlXT1cInRpbWVsaW5lWVNjYWxlXCJcclxuICAgICAgICAgICAgW2NvbG9yc109XCJjb2xvcnNcIlxyXG4gICAgICAgICAgICBbZGF0YV09XCJzZXJpZXNcIlxyXG4gICAgICAgICAgICBbc2NhbGVUeXBlXT1cInNjYWxlVHlwZVwiXHJcbiAgICAgICAgICAgIFtjdXJ2ZV09XCJjdXJ2ZVwiXHJcbiAgICAgICAgICAgIFtoYXNSYW5nZV09XCJoYXNSYW5nZVwiXHJcbiAgICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9uZ3gtY2hhcnRzLWNoYXJ0PlxyXG4gIGAsXHJcbiAgc3R5bGVVcmxzOiBbJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBhbmltYXRpb25zOiBbXHJcbiAgICB0cmlnZ2VyKCdhbmltYXRpb25TdGF0ZScsIFtcclxuICAgICAgdHJhbnNpdGlvbignOmxlYXZlJywgW1xyXG4gICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICB9KSxcclxuICAgICAgICBhbmltYXRlKFxyXG4gICAgICAgICAgNTAwLFxyXG4gICAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgICAgXSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGluZUNoYXJ0Q29tcG9uZW50IGV4dGVuZHMgQmFzZUNoYXJ0Q29tcG9uZW50IHtcclxuICBASW5wdXQoKSBsZWdlbmQ7XHJcbiAgQElucHV0KCkgbGVnZW5kVGl0bGU6IHN0cmluZyA9ICdMZWdlbmQnO1xyXG4gIEBJbnB1dCgpIGxlZ2VuZFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xyXG4gIEBJbnB1dCgpIHhBeGlzO1xyXG4gIEBJbnB1dCgpIHlBeGlzO1xyXG4gIEBJbnB1dCgpIHNob3dYQXhpc0xhYmVsO1xyXG4gIEBJbnB1dCgpIHNob3dZQXhpc0xhYmVsO1xyXG4gIEBJbnB1dCgpIHhBeGlzTGFiZWw7XHJcbiAgQElucHV0KCkgeUF4aXNMYWJlbDtcclxuICBASW5wdXQoKSBhdXRvU2NhbGU7XHJcbiAgQElucHV0KCkgdGltZWxpbmU7XHJcbiAgQElucHV0KCkgZ3JhZGllbnQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgY3VydmU6IGFueSA9IGN1cnZlTGluZWFyO1xyXG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdID0gW107XHJcbiAgQElucHV0KCkgc2NoZW1lVHlwZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJhbmdlRmlsbE9wYWNpdHk6IG51bWJlcjtcclxuICBASW5wdXQoKSB0cmltWEF4aXNUaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgdHJpbVlBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVhBeGlzVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1heFhBeGlzVGlja0xlbmd0aDogbnVtYmVyID0gMTY7XHJcbiAgQElucHV0KCkgbWF4WUF4aXNUaWNrTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBASW5wdXQoKSB4QXhpc1RpY2tGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgeUF4aXNUaWNrRm9ybWF0dGluZzogYW55O1xyXG4gIEBJbnB1dCgpIHhBeGlzVGlja3M6IGFueVtdO1xyXG4gIEBJbnB1dCgpIHlBeGlzVGlja3M6IGFueVtdO1xyXG4gIEBJbnB1dCgpIHJvdW5kRG9tYWluczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHNob3dSZWZMaW5lczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHJlZmVyZW5jZUxpbmVzOiBhbnk7XHJcbiAgQElucHV0KCkgc2hvd1JlZkxhYmVsczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgeFNjYWxlTWluOiBhbnk7XHJcbiAgQElucHV0KCkgeFNjYWxlTWF4OiBhbnk7XHJcbiAgQElucHV0KCkgeVNjYWxlTWluOiBudW1iZXI7XHJcbiAgQElucHV0KCkgeVNjYWxlTWF4OiBudW1iZXI7XHJcbiAgQElucHV0KCkgYWN0aXZlVGltZTtcclxuICBAT3V0cHV0KCkgY2xpY2tDYWxsYmFjazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAQ29udGVudENoaWxkKCd0b29sdGlwVGVtcGxhdGUnKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQENvbnRlbnRDaGlsZCgnc2VyaWVzVG9vbHRpcFRlbXBsYXRlJykgc2VyaWVzVG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBkaW1zOiBWaWV3RGltZW5zaW9ucztcclxuICB4U2V0OiBhbnk7XHJcbiAgeERvbWFpbjogYW55O1xyXG4gIHlEb21haW46IGFueTtcclxuICBzZXJpZXNEb21haW46IGFueTtcclxuICB5U2NhbGU6IGFueTtcclxuICB4U2NhbGU6IGFueTtcclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIHNjYWxlVHlwZTogc3RyaW5nO1xyXG4gIHRyYW5zZm9ybTogc3RyaW5nO1xyXG4gIGNsaXBQYXRoOiBzdHJpbmc7XHJcbiAgY2xpcFBhdGhJZDogc3RyaW5nO1xyXG4gIHNlcmllczogYW55O1xyXG4gIGFyZWFQYXRoOiBhbnk7XHJcbiAgbWFyZ2luID0gWzEwLCAyMCwgMTAsIDIwXTtcclxuICBob3ZlcmVkVmVydGljYWw6IGFueTsgLy8gdGhlIHZhbHVlIG9mIHRoZSB4IGF4aXMgdGhhdCBpcyBob3ZlcmVkIG92ZXJcclxuICB4QXhpc0hlaWdodDogbnVtYmVyID0gMDtcclxuICB5QXhpc1dpZHRoOiBudW1iZXIgPSAwO1xyXG4gIGZpbHRlcmVkRG9tYWluOiBhbnk7XHJcbiAgbGVnZW5kT3B0aW9uczogYW55O1xyXG4gIGhhc1JhbmdlOiBib29sZWFuOyAvLyB3aGV0aGVyIHRoZSBsaW5lIGhhcyBhIG1pbi1tYXggcmFuZ2UgYXJvdW5kIGl0XHJcbiAgdGltZWxpbmVXaWR0aDogYW55O1xyXG4gIHRpbWVsaW5lSGVpZ2h0OiBudW1iZXIgPSA1MDtcclxuICB0aW1lbGluZVhTY2FsZTogYW55O1xyXG4gIHRpbWVsaW5lWVNjYWxlOiBhbnk7XHJcbiAgdGltZWxpbmVYRG9tYWluOiBhbnk7XHJcbiAgdGltZWxpbmVUcmFuc2Zvcm06IGFueTtcclxuICB0aW1lbGluZVBhZGRpbmc6IG51bWJlciA9IDEwO1xyXG4gIGFjdGl2ZVZhbDtcclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgdGhpcy5kaW1zID0gY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoe1xyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgbWFyZ2luczogdGhpcy5tYXJnaW4sXHJcbiAgICAgIHNob3dYQXhpczogdGhpcy54QXhpcyxcclxuICAgICAgc2hvd1lBeGlzOiB0aGlzLnlBeGlzLFxyXG4gICAgICB4QXhpc0hlaWdodDogdGhpcy54QXhpc0hlaWdodCxcclxuICAgICAgeUF4aXNXaWR0aDogdGhpcy55QXhpc1dpZHRoLFxyXG4gICAgICBzaG93WExhYmVsOiB0aGlzLnNob3dYQXhpc0xhYmVsLFxyXG4gICAgICBzaG93WUxhYmVsOiB0aGlzLnNob3dZQXhpc0xhYmVsLFxyXG4gICAgICBzaG93TGVnZW5kOiB0aGlzLmxlZ2VuZCxcclxuICAgICAgbGVnZW5kVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxyXG4gICAgICBsZWdlbmRQb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvblxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMudGltZWxpbmUpIHtcclxuICAgICAgdGhpcy5kaW1zLmhlaWdodCAtPSB0aGlzLnRpbWVsaW5lSGVpZ2h0ICsgdGhpcy5tYXJnaW5bMl0gKyB0aGlzLnRpbWVsaW5lUGFkZGluZztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnhEb21haW4gPSB0aGlzLmdldFhEb21haW4oKTtcclxuICAgIGlmICh0aGlzLmZpbHRlcmVkRG9tYWluKSB7XHJcbiAgICAgIHRoaXMueERvbWFpbiA9IHRoaXMuZmlsdGVyZWREb21haW47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy55RG9tYWluID0gdGhpcy5nZXRZRG9tYWluKCk7XHJcbiAgICB0aGlzLnNlcmllc0RvbWFpbiA9IHRoaXMuZ2V0U2VyaWVzRG9tYWluKCk7XHJcblxyXG4gICAgdGhpcy54U2NhbGUgPSB0aGlzLmdldFhTY2FsZSh0aGlzLnhEb21haW4sIHRoaXMuZGltcy53aWR0aCk7XHJcbiAgICB0aGlzLnlTY2FsZSA9IHRoaXMuZ2V0WVNjYWxlKHRoaXMueURvbWFpbiwgdGhpcy5kaW1zLmhlaWdodCk7XHJcblxyXG4gICAgaWYodGhpcy5hY3RpdmVUaW1lLmdldFRpbWUoKSl7XHJcbiAgICAgIHRoaXMuc2V0QWN0aXZlVGltZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVUaW1lbGluZSgpO1xyXG5cclxuICAgIHRoaXMuc2V0Q29sb3JzKCk7XHJcbiAgICB0aGlzLmxlZ2VuZE9wdGlvbnMgPSB0aGlzLmdldExlZ2VuZE9wdGlvbnMoKTtcclxuXHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLmRpbXMueE9mZnNldH0gLCAke3RoaXMubWFyZ2luWzBdfSlgO1xyXG5cclxuICAgIHRoaXMuY2xpcFBhdGhJZCA9ICdjbGlwJyArIGlkKCkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMuY2xpcFBhdGggPSBgdXJsKCMke3RoaXMuY2xpcFBhdGhJZH0pYDtcclxuICB9XHJcblxyXG4gIHNldEFjdGl2ZVRpbWUoKTogdm9pZCB7XHJcbiAgICBsZXQgYWRqdXN0ZWRTY2FsZSA9IHRoaXMueFNjYWxlLmJhbmR3aWR0aFxyXG4gICAgICA/IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy54U2NhbGUoZCkgKyB0aGlzLnhTY2FsZS5iYW5kd2lkdGgoKSAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgIDogdGhpcy54U2NhbGU7XHJcbiAgICB0aGlzLmFjdGl2ZVZhbCA9IGFkanVzdGVkU2NhbGUodGhpcy5hY3RpdmVUaW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRpbWVsaW5lKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudGltZWxpbmUpIHtcclxuICAgICAgdGhpcy50aW1lbGluZVdpZHRoID0gdGhpcy5kaW1zLndpZHRoO1xyXG4gICAgICB0aGlzLnRpbWVsaW5lWERvbWFpbiA9IHRoaXMuZ2V0WERvbWFpbigpO1xyXG4gICAgICB0aGlzLnRpbWVsaW5lWFNjYWxlID0gdGhpcy5nZXRYU2NhbGUodGhpcy50aW1lbGluZVhEb21haW4sIHRoaXMudGltZWxpbmVXaWR0aCk7XHJcbiAgICAgIHRoaXMudGltZWxpbmVZU2NhbGUgPSB0aGlzLmdldFlTY2FsZSh0aGlzLnlEb21haW4sIHRoaXMudGltZWxpbmVIZWlnaHQpO1xyXG4gICAgICB0aGlzLnRpbWVsaW5lVHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuZGltcy54T2Zmc2V0fSwgJHstdGhpcy5tYXJnaW5bMl19KWA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRYRG9tYWluKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXMgPSBnZXRVbmlxdWVYRG9tYWluVmFsdWVzKHRoaXMucmVzdWx0cyk7XHJcblxyXG4gICAgdGhpcy5zY2FsZVR5cGUgPSBnZXRTY2FsZVR5cGUodmFsdWVzKTtcclxuICAgIGxldCBkb21haW4gPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIHZhbHVlcyA9IHZhbHVlcy5tYXAodiA9PiBOdW1iZXIodikpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtaW47XHJcbiAgICBsZXQgbWF4O1xyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScgfHwgdGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIG1pbiA9IHRoaXMueFNjYWxlTWluID8gdGhpcy54U2NhbGVNaW4gOiBNYXRoLm1pbiguLi52YWx1ZXMpO1xyXG5cclxuICAgICAgbWF4ID0gdGhpcy54U2NhbGVNYXggPyB0aGlzLnhTY2FsZU1heCA6IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgZG9tYWluID0gW25ldyBEYXRlKG1pbiksIG5ldyBEYXRlKG1heCldO1xyXG4gICAgICB0aGlzLnhTZXQgPSBbLi4udmFsdWVzXS5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYURhdGUgPSBhLmdldFRpbWUoKTtcclxuICAgICAgICBjb25zdCBiRGF0ZSA9IGIuZ2V0VGltZSgpO1xyXG4gICAgICAgIGlmIChhRGF0ZSA+IGJEYXRlKSByZXR1cm4gMTtcclxuICAgICAgICBpZiAoYkRhdGUgPiBhRGF0ZSkgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIGRvbWFpbiA9IFttaW4sIG1heF07XHJcbiAgICAgIC8vIFVzZSBjb21wYXJlIGZ1bmN0aW9uIHRvIHNvcnQgbnVtYmVycyBudW1lcmljYWxseVxyXG4gICAgICB0aGlzLnhTZXQgPSBbLi4udmFsdWVzXS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb21haW4gPSB2YWx1ZXM7XHJcbiAgICAgIHRoaXMueFNldCA9IHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZG9tYWluO1xyXG4gIH1cclxuXHJcbiAgZ2V0WURvbWFpbigpOiBhbnlbXSB7XHJcbiAgICBjb25zdCBkb21haW4gPSBbXTtcclxuICAgIGZvciAoY29uc3QgcmVzdWx0cyBvZiB0aGlzLnJlc3VsdHMpIHtcclxuICAgICAgZm9yIChjb25zdCBkIG9mIHJlc3VsdHMuc2VyaWVzKSB7XHJcbiAgICAgICAgaWYgKGRvbWFpbi5pbmRleE9mKGQudmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgZG9tYWluLnB1c2goZC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkLm1pbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc1JhbmdlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChkb21haW4uaW5kZXhPZihkLm1pbikgPCAwKSB7XHJcbiAgICAgICAgICAgIGRvbWFpbi5wdXNoKGQubWluKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGQubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHRoaXMuaGFzUmFuZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKGRvbWFpbi5pbmRleE9mKGQubWF4KSA8IDApIHtcclxuICAgICAgICAgICAgZG9tYWluLnB1c2goZC5tYXgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZhbHVlcyA9IFsuLi5kb21haW5dO1xyXG4gICAgaWYgKCF0aGlzLmF1dG9TY2FsZSkge1xyXG4gICAgICB2YWx1ZXMucHVzaCgwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtaW4gPSB0aGlzLnlTY2FsZU1pbiA/IHRoaXMueVNjYWxlTWluIDogTWF0aC5taW4oLi4udmFsdWVzKTtcclxuXHJcbiAgICBjb25zdCBtYXggPSB0aGlzLnlTY2FsZU1heCA/IHRoaXMueVNjYWxlTWF4IDogTWF0aC5tYXgoLi4udmFsdWVzKTtcclxuXHJcbiAgICByZXR1cm4gW21pbiwgbWF4XTtcclxuICB9XHJcblxyXG4gIGdldFNlcmllc0RvbWFpbigpOiBhbnlbXSB7XHJcbiAgICByZXR1cm4gdGhpcy5yZXN1bHRzLm1hcChkID0+IGQubmFtZSk7XHJcbiAgfVxyXG5cclxuICBnZXRYU2NhbGUoZG9tYWluLCB3aWR0aCk6IGFueSB7XHJcbiAgICBsZXQgc2NhbGU7XHJcblxyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgc2NhbGUgPSBzY2FsZVRpbWUoKS5yYW5nZShbMCwgd2lkdGhdKS5kb21haW4oZG9tYWluKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIHNjYWxlID0gc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgd2lkdGhdKS5kb21haW4oZG9tYWluKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnJvdW5kRG9tYWlucykge1xyXG4gICAgICAgIHNjYWxlID0gc2NhbGUubmljZSgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnb3JkaW5hbCcpIHtcclxuICAgICAgc2NhbGUgPSBzY2FsZVBvaW50KCkucmFuZ2UoWzAsIHdpZHRoXSkucGFkZGluZygwLjEpLmRvbWFpbihkb21haW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzY2FsZTtcclxuICB9XHJcblxyXG4gIGdldFlTY2FsZShkb21haW4sIGhlaWdodCk6IGFueSB7XHJcbiAgICBjb25zdCBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoW2hlaWdodCwgMF0pLmRvbWFpbihkb21haW4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnJvdW5kRG9tYWlucyA/IHNjYWxlLm5pY2UoKSA6IHNjYWxlO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRG9tYWluKGRvbWFpbik6IHZvaWQge1xyXG4gICAgdGhpcy5maWx0ZXJlZERvbWFpbiA9IGRvbWFpbjtcclxuICAgIHRoaXMueERvbWFpbiA9IHRoaXMuZmlsdGVyZWREb21haW47XHJcbiAgICB0aGlzLnhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKHRoaXMueERvbWFpbiwgdGhpcy5kaW1zLndpZHRoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUhvdmVyZWRWZXJ0aWNhbChpdGVtKTogdm9pZCB7XHJcbiAgICB0aGlzLmhvdmVyZWRWZXJ0aWNhbCA9IGl0ZW0udmFsdWU7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGVBbGwoKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnKVxyXG4gIGhpZGVDaXJjbGVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ob3ZlcmVkVmVydGljYWwgPSBudWxsO1xyXG4gICAgdGhpcy5kZWFjdGl2YXRlQWxsKCk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGRhdGEpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBvblhDbGljayhkYXRhKTp2b2lke1xyXG4gICAgaWYodGhpcy5jbGlja0NhbGxiYWNrLm9ic2VydmVycy5sZW5ndGgpe1xyXG4gICAgICBsZXQgX2RvbWFpbiA9IHRoaXMuZ2V0WERvbWFpbigpXHJcbiAgICAgIGxldCBfdGltZT1uZXcgRGF0ZSgoX2RvbWFpblsxXS5nZXRUaW1lKCktX2RvbWFpblswXS5nZXRUaW1lKCkpL3RoaXMuZGltcy53aWR0aCooZGF0YS5vZmZzZXRYIC0gdGhpcy5kaW1zLnhPZmZzZXQpK19kb21haW5bMF0uZ2V0VGltZSgpKTtcclxuICAgICAgdGhpcy5hY3RpdmVUaW1lPV90aW1lO1xyXG4gICAgICB0aGlzLmNsaWNrQ2FsbGJhY2suZW1pdChfdGltZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0cmFja0J5KGluZGV4LCBpdGVtKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBpdGVtLm5hbWU7XHJcbiAgfVxyXG5cclxuICBzZXRDb2xvcnMoKTogdm9pZCB7XHJcbiAgICBsZXQgZG9tYWluO1xyXG4gICAgaWYgKHRoaXMuc2NoZW1lVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICAgIGRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9tYWluID0gdGhpcy55RG9tYWluO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29sb3JzID0gbmV3IENvbG9ySGVscGVyKHRoaXMuc2NoZW1lLCB0aGlzLnNjaGVtZVR5cGUsIGRvbWFpbiwgdGhpcy5jdXN0b21Db2xvcnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0TGVnZW5kT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgIHNjYWxlVHlwZTogdGhpcy5zY2hlbWVUeXBlLFxyXG4gICAgICBjb2xvcnM6IHVuZGVmaW5lZCxcclxuICAgICAgZG9tYWluOiBbXSxcclxuICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcclxuICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb25cclxuICAgIH07XHJcbiAgICBpZiAob3B0cy5zY2FsZVR5cGUgPT09ICdvcmRpbmFsJykge1xyXG4gICAgICBvcHRzLmRvbWFpbiA9IHRoaXMuc2VyaWVzRG9tYWluO1xyXG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzO1xyXG4gICAgICBvcHRzLnRpdGxlID0gdGhpcy5sZWdlbmRUaXRsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9wdHMuZG9tYWluID0gdGhpcy55RG9tYWluO1xyXG4gICAgICBvcHRzLmNvbG9ycyA9IHRoaXMuY29sb3JzLnNjYWxlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9wdHM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVZQXhpc1dpZHRoKHsgd2lkdGggfSk6IHZvaWQge1xyXG4gICAgdGhpcy55QXhpc1dpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlWEF4aXNIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xyXG4gICAgdGhpcy54QXhpc0hlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2YXRlKGl0ZW0pIHtcclxuICAgIHRoaXMuZGVhY3RpdmF0ZUFsbCgpO1xyXG5cclxuICAgIGNvbnN0IGlkeCA9IHRoaXMuYWN0aXZlRW50cmllcy5maW5kSW5kZXgoZCA9PiB7XHJcbiAgICAgIHJldHVybiBkLm5hbWUgPT09IGl0ZW0ubmFtZSAmJiBkLnZhbHVlID09PSBpdGVtLnZhbHVlO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaWR4ID4gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aXZlRW50cmllcyA9IFtpdGVtXTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBvbkRlYWN0aXZhdGUoaXRlbSkge1xyXG4gICAgY29uc3QgaWR4ID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmRJbmRleChkID0+IHtcclxuICAgICAgcmV0dXJuIGQubmFtZSA9PT0gaXRlbS5uYW1lICYmIGQudmFsdWUgPT09IGl0ZW0udmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbLi4udGhpcy5hY3RpdmVFbnRyaWVzXTtcclxuXHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBpdGVtLCBlbnRyaWVzOiB0aGlzLmFjdGl2ZUVudHJpZXMgfSk7XHJcbiAgfVxyXG5cclxuICBkZWFjdGl2YXRlQWxsKCkge1xyXG4gICAgdGhpcy5hY3RpdmVFbnRyaWVzID0gWy4uLnRoaXMuYWN0aXZlRW50cmllc107XHJcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuYWN0aXZlRW50cmllcykge1xyXG4gICAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IHZhbHVlOiBlbnRyeSwgZW50cmllczogW10gfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFjdGl2ZUVudHJpZXMgPSBbXTtcclxuICB9XHJcbn1cclxuIl19