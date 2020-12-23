import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { D0Types } from './series-vertical.component';
export class SeriesHorizontal {
    constructor() {
        this.barsForDataLabels = [];
        this.type = 'standard';
        this.tooltipDisabled = false;
        this.animations = true;
        this.showDataLabel = false;
        this.noBarWhenZero = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.dataLabelWidthChanged = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.updateTooltipSettings();
        const d0 = {
            [D0Types.positive]: 0,
            [D0Types.negative]: 0
        };
        let d0Type;
        d0Type = D0Types.positive;
        let total;
        if (this.type === 'normalized') {
            total = this.series.map(d => d.value).reduce((sum, d) => sum + d, 0);
        }
        const xScaleMin = Math.max(this.xScale.domain()[0], 0);
        this.bars = this.series.map((d, index) => {
            let value = d.value;
            const label = this.getLabel(d);
            const formattedLabel = formatLabel(label);
            const roundEdges = this.roundEdges;
            d0Type = value > 0 ? D0Types.positive : D0Types.negative;
            const bar = {
                value,
                label,
                roundEdges,
                data: d,
                formattedLabel
            };
            bar.height = this.yScale.bandwidth();
            if (this.type === 'standard') {
                bar.width = Math.abs(this.xScale(value) - this.xScale(xScaleMin));
                if (value < 0) {
                    bar.x = this.xScale(value);
                }
                else {
                    bar.x = this.xScale(xScaleMin);
                }
                bar.y = this.yScale(label);
            }
            else if (this.type === 'stacked') {
                const offset0 = d0[d0Type];
                const offset1 = offset0 + value;
                d0[d0Type] += value;
                bar.width = this.xScale(offset1) - this.xScale(offset0);
                bar.x = this.xScale(offset0);
                bar.y = 0;
                bar.offset0 = offset0;
                bar.offset1 = offset1;
            }
            else if (this.type === 'normalized') {
                let offset0 = d0[d0Type];
                let offset1 = offset0 + value;
                d0[d0Type] += value;
                if (total > 0) {
                    offset0 = (offset0 * 100) / total;
                    offset1 = (offset1 * 100) / total;
                }
                else {
                    offset0 = 0;
                    offset1 = 0;
                }
                bar.width = this.xScale(offset1) - this.xScale(offset0);
                bar.x = this.xScale(offset0);
                bar.y = 0;
                bar.offset0 = offset0;
                bar.offset1 = offset1;
                value = (offset1 - offset0).toFixed(2) + '%';
            }
            if (this.colors.scaleType === 'ordinal') {
                bar.color = this.colors.getColor(label);
            }
            else {
                if (this.type === 'standard') {
                    bar.color = this.colors.getColor(value);
                    bar.gradientStops = this.colors.getLinearGradientStops(value);
                }
                else {
                    bar.color = this.colors.getColor(bar.offset1);
                    bar.gradientStops = this.colors.getLinearGradientStops(bar.offset1, bar.offset0);
                }
            }
            let tooltipLabel = formattedLabel;
            bar.ariaLabel = formattedLabel + ' ' + value.toLocaleString();
            if (this.seriesName) {
                tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
                bar.data.series = this.seriesName;
                bar.ariaLabel = this.seriesName + ' ' + bar.ariaLabel;
            }
            bar.tooltipText = this.tooltipDisabled
                ? undefined
                : `
        <span class="tooltip-label">${escapeLabel(tooltipLabel)}</span>
        <span class="tooltip-val">${this.dataLabelFormatting ? this.dataLabelFormatting(value) : value.toLocaleString()}</span>
      `;
            return bar;
        });
        this.updateDataLabels();
    }
    updateDataLabels() {
        if (this.type === 'stacked') {
            this.barsForDataLabels = [];
            const section = {};
            section.series = this.seriesName;
            const totalPositive = this.series.map(d => d.value).reduce((sum, d) => (d > 0 ? sum + d : sum), 0);
            const totalNegative = this.series.map(d => d.value).reduce((sum, d) => (d < 0 ? sum + d : sum), 0);
            section.total = totalPositive + totalNegative;
            section.x = 0;
            section.y = 0;
            // if total is positive then we show it on the right, otherwise on the left
            if (section.total > 0) {
                section.width = this.xScale(totalPositive);
            }
            else {
                section.width = this.xScale(totalNegative);
            }
            section.height = this.yScale.bandwidth();
            this.barsForDataLabels.push(section);
        }
        else {
            this.barsForDataLabels = this.series.map(d => {
                const section = {};
                section.series = this.seriesName ? this.seriesName : d.label;
                section.total = d.value;
                section.x = this.xScale(0);
                section.y = this.yScale(d.label);
                section.width = this.xScale(section.total) - this.xScale(0);
                section.height = this.yScale.bandwidth();
                return section;
            });
        }
    }
    updateTooltipSettings() {
        this.tooltipPlacement = this.tooltipDisabled ? undefined : 'top';
        this.tooltipType = this.tooltipDisabled ? undefined : 'tooltip';
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name && entry.series === d.series;
        });
        return item !== undefined;
    }
    getLabel(dataItem) {
        if (dataItem.label) {
            return dataItem.label;
        }
        return dataItem.name;
    }
    trackBy(index, bar) {
        return bar.label;
    }
    trackDataLabelBy(index, barLabel) {
        return index + '#' + barLabel.series + '#' + barLabel.total;
    }
    click(data) {
        this.select.emit(data);
    }
}
SeriesHorizontal.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-series-horizontal]',
                template: `
    <svg:g
      ngx-charts-bar
      *ngFor="let bar of bars; trackBy: trackBy"
      [@animationState]="'active'"
      [width]="bar.width"
      [height]="bar.height"
      [x]="bar.x"
      [y]="bar.y"
      [fill]="bar.color"
      [stops]="bar.gradientStops"
      [data]="bar.data"
      [orientation]="'horizontal'"
      [roundEdges]="bar.roundEdges"
      (select)="click($event)"
      [gradient]="gradient"
      [isActive]="isActive(bar.data)"
      [ariaLabel]="bar.ariaLabel"
      [animations]="animations"
      (activate)="activate.emit($event)"
      (deactivate)="deactivate.emit($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipType]="tooltipType"
      [tooltipTitle]="tooltipTemplate ? undefined : bar.tooltipText"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="bar.data"
      [noBarWhenZero]="noBarWhenZero"
    ></svg:g>
    <svg:g *ngIf="showDataLabel">
      <svg:g
        ngx-charts-bar-label
        *ngFor="let b of barsForDataLabels; let i = index; trackBy: trackDataLabelBy"
        [barX]="b.x"
        [barY]="b.y"
        [barWidth]="b.width"
        [barHeight]="b.height"
        [value]="b.total"
        [valueFormatting]="dataLabelFormatting"
        [orientation]="'horizontal'"
        (dimensionsChanged)="dataLabelWidthChanged.emit({ size: $event, index: i })"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':leave', [
                            style({
                                opacity: 1
                            }),
                            animate(500, style({ opacity: 0 }))
                        ])
                    ])
                ]
            },] }
];
SeriesHorizontal.propDecorators = {
    dims: [{ type: Input }],
    type: [{ type: Input }],
    series: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    colors: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    gradient: [{ type: Input }],
    activeEntries: [{ type: Input }],
    seriesName: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    roundEdges: [{ type: Input }],
    animations: [{ type: Input }],
    showDataLabel: [{ type: Input }],
    dataLabelFormatting: [{ type: Input }],
    noBarWhenZero: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    dataLabelWidthChanged: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWVzLWhvcml6b250YWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2Jhci1jaGFydC9zZXJpZXMtaG9yaXpvbnRhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFHWix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBOER0RCxNQUFNLE9BQU8sZ0JBQWdCO0lBM0Q3QjtRQStERSxzQkFBaUIsR0FBa0csRUFBRSxDQUFDO1FBRzdHLFNBQUksR0FBRyxVQUFVLENBQUM7UUFLbEIsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFNakMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUUvQixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUU3QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQywwQkFBcUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBaUx2RCxDQUFDO0lBNUtDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMscUJBQXFC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OUQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFjO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLENBQUM7OztZQXJRRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlDQUFpQztnQkFDM0MsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsVUFBVSxFQUFFO29CQUNWLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDeEIsVUFBVSxDQUFDLFFBQVEsRUFBRTs0QkFDbkIsS0FBSyxDQUFDO2dDQUNKLE9BQU8sRUFBRSxDQUFDOzZCQUNYLENBQUM7NEJBQ0YsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt5QkFDcEMsQ0FBQztxQkFDSCxDQUFDO2lCQUNIO2FBQ0Y7OzttQkFPRSxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzs4QkFDTCxLQUFLO3VCQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLEtBQUs7a0NBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNO29DQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIFRlbXBsYXRlUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHRyaWdnZXIsIHN0eWxlLCBhbmltYXRlLCB0cmFuc2l0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XHJcbmltcG9ydCB7IGZvcm1hdExhYmVsLCBlc2NhcGVMYWJlbCB9IGZyb20gJy4uL2NvbW1vbi9sYWJlbC5oZWxwZXInO1xyXG5pbXBvcnQgeyBEMFR5cGVzIH0gZnJvbSAnLi9zZXJpZXMtdmVydGljYWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGF0YUl0ZW0gfSBmcm9tICcuLi9tb2RlbHMvY2hhcnQtZGF0YS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1zZXJpZXMtaG9yaXpvbnRhbF0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmdcclxuICAgICAgbmd4LWNoYXJ0cy1iYXJcclxuICAgICAgKm5nRm9yPVwibGV0IGJhciBvZiBiYXJzOyB0cmFja0J5OiB0cmFja0J5XCJcclxuICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiXHJcbiAgICAgIFt3aWR0aF09XCJiYXIud2lkdGhcIlxyXG4gICAgICBbaGVpZ2h0XT1cImJhci5oZWlnaHRcIlxyXG4gICAgICBbeF09XCJiYXIueFwiXHJcbiAgICAgIFt5XT1cImJhci55XCJcclxuICAgICAgW2ZpbGxdPVwiYmFyLmNvbG9yXCJcclxuICAgICAgW3N0b3BzXT1cImJhci5ncmFkaWVudFN0b3BzXCJcclxuICAgICAgW2RhdGFdPVwiYmFyLmRhdGFcIlxyXG4gICAgICBbb3JpZW50YXRpb25dPVwiJ2hvcml6b250YWwnXCJcclxuICAgICAgW3JvdW5kRWRnZXNdPVwiYmFyLnJvdW5kRWRnZXNcIlxyXG4gICAgICAoc2VsZWN0KT1cImNsaWNrKCRldmVudClcIlxyXG4gICAgICBbZ3JhZGllbnRdPVwiZ3JhZGllbnRcIlxyXG4gICAgICBbaXNBY3RpdmVdPVwiaXNBY3RpdmUoYmFyLmRhdGEpXCJcclxuICAgICAgW2FyaWFMYWJlbF09XCJiYXIuYXJpYUxhYmVsXCJcclxuICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgIChhY3RpdmF0ZSk9XCJhY3RpdmF0ZS5lbWl0KCRldmVudClcIlxyXG4gICAgICAoZGVhY3RpdmF0ZSk9XCJkZWFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgIG5neC10b29sdGlwXHJcbiAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXHJcbiAgICAgIFt0b29sdGlwVHlwZV09XCJ0b29sdGlwVHlwZVwiXHJcbiAgICAgIFt0b29sdGlwVGl0bGVdPVwidG9vbHRpcFRlbXBsYXRlID8gdW5kZWZpbmVkIDogYmFyLnRvb2x0aXBUZXh0XCJcclxuICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICBbdG9vbHRpcENvbnRleHRdPVwiYmFyLmRhdGFcIlxyXG4gICAgICBbbm9CYXJXaGVuWmVyb109XCJub0JhcldoZW5aZXJvXCJcclxuICAgID48L3N2ZzpnPlxyXG4gICAgPHN2ZzpnICpuZ0lmPVwic2hvd0RhdGFMYWJlbFwiPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLWJhci1sYWJlbFxyXG4gICAgICAgICpuZ0Zvcj1cImxldCBiIG9mIGJhcnNGb3JEYXRhTGFiZWxzOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiB0cmFja0RhdGFMYWJlbEJ5XCJcclxuICAgICAgICBbYmFyWF09XCJiLnhcIlxyXG4gICAgICAgIFtiYXJZXT1cImIueVwiXHJcbiAgICAgICAgW2JhcldpZHRoXT1cImIud2lkdGhcIlxyXG4gICAgICAgIFtiYXJIZWlnaHRdPVwiYi5oZWlnaHRcIlxyXG4gICAgICAgIFt2YWx1ZV09XCJiLnRvdGFsXCJcclxuICAgICAgICBbdmFsdWVGb3JtYXR0aW5nXT1cImRhdGFMYWJlbEZvcm1hdHRpbmdcIlxyXG4gICAgICAgIFtvcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIlxyXG4gICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJkYXRhTGFiZWxXaWR0aENoYW5nZWQuZW1pdCh7IHNpemU6ICRldmVudCwgaW5kZXg6IGkgfSlcIlxyXG4gICAgICAvPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFtcclxuICAgIHRyaWdnZXIoJ2FuaW1hdGlvblN0YXRlJywgW1xyXG4gICAgICB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbXHJcbiAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGFuaW1hdGUoNTAwLCBzdHlsZSh7IG9wYWNpdHk6IDAgfSkpXHJcbiAgICAgIF0pXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNlcmllc0hvcml6b250YWwgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIGJhcnM6IGFueTtcclxuICB4OiBhbnk7XHJcbiAgeTogYW55O1xyXG4gIGJhcnNGb3JEYXRhTGFiZWxzOiBBcnJheTx7IHg6IG51bWJlcjsgeTogbnVtYmVyOyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgdG90YWw6IG51bWJlcjsgc2VyaWVzOiBzdHJpbmcgfT4gPSBbXTtcclxuXHJcbiAgQElucHV0KCkgZGltcztcclxuICBASW5wdXQoKSB0eXBlID0gJ3N0YW5kYXJkJztcclxuICBASW5wdXQoKSBzZXJpZXM7XHJcbiAgQElucHV0KCkgeFNjYWxlO1xyXG4gIEBJbnB1dCgpIHlTY2FsZTtcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgZ3JhZGllbnQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W107XHJcbiAgQElucHV0KCkgc2VyaWVzTmFtZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSByb3VuZEVkZ2VzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIHNob3dEYXRhTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBkYXRhTGFiZWxGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgbm9CYXJXaGVuWmVybzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkYXRhTGFiZWxXaWR0aENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZztcclxuICB0b29sdGlwVHlwZTogc3RyaW5nO1xyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGVUb29sdGlwU2V0dGluZ3MoKTtcclxuICAgIGNvbnN0IGQwID0ge1xyXG4gICAgICBbRDBUeXBlcy5wb3NpdGl2ZV06IDAsXHJcbiAgICAgIFtEMFR5cGVzLm5lZ2F0aXZlXTogMFxyXG4gICAgfTtcclxuICAgIGxldCBkMFR5cGU6IEQwVHlwZXM7XHJcbiAgICBkMFR5cGUgPSBEMFR5cGVzLnBvc2l0aXZlO1xyXG4gICAgbGV0IHRvdGFsO1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ25vcm1hbGl6ZWQnKSB7XHJcbiAgICAgIHRvdGFsID0gdGhpcy5zZXJpZXMubWFwKGQgPT4gZC52YWx1ZSkucmVkdWNlKChzdW0sIGQpID0+IHN1bSArIGQsIDApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeFNjYWxlTWluID0gTWF0aC5tYXgodGhpcy54U2NhbGUuZG9tYWluKClbMF0sIDApO1xyXG5cclxuICAgIHRoaXMuYmFycyA9IHRoaXMuc2VyaWVzLm1hcCgoZCwgaW5kZXgpID0+IHtcclxuICAgICAgbGV0IHZhbHVlID0gZC52YWx1ZTtcclxuICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmdldExhYmVsKGQpO1xyXG4gICAgICBjb25zdCBmb3JtYXR0ZWRMYWJlbCA9IGZvcm1hdExhYmVsKGxhYmVsKTtcclxuICAgICAgY29uc3Qgcm91bmRFZGdlcyA9IHRoaXMucm91bmRFZGdlcztcclxuICAgICAgZDBUeXBlID0gdmFsdWUgPiAwID8gRDBUeXBlcy5wb3NpdGl2ZSA6IEQwVHlwZXMubmVnYXRpdmU7XHJcblxyXG4gICAgICBjb25zdCBiYXI6IGFueSA9IHtcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBsYWJlbCxcclxuICAgICAgICByb3VuZEVkZ2VzLFxyXG4gICAgICAgIGRhdGE6IGQsXHJcbiAgICAgICAgZm9ybWF0dGVkTGFiZWxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGJhci5oZWlnaHQgPSB0aGlzLnlTY2FsZS5iYW5kd2lkdGgoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICBiYXIud2lkdGggPSBNYXRoLmFicyh0aGlzLnhTY2FsZSh2YWx1ZSkgLSB0aGlzLnhTY2FsZSh4U2NhbGVNaW4pKTtcclxuICAgICAgICBpZiAodmFsdWUgPCAwKSB7XHJcbiAgICAgICAgICBiYXIueCA9IHRoaXMueFNjYWxlKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYmFyLnggPSB0aGlzLnhTY2FsZSh4U2NhbGVNaW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBiYXIueSA9IHRoaXMueVNjYWxlKGxhYmVsKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdzdGFja2VkJykge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldDAgPSBkMFtkMFR5cGVdO1xyXG4gICAgICAgIGNvbnN0IG9mZnNldDEgPSBvZmZzZXQwICsgdmFsdWU7XHJcbiAgICAgICAgZDBbZDBUeXBlXSArPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgYmFyLndpZHRoID0gdGhpcy54U2NhbGUob2Zmc2V0MSkgLSB0aGlzLnhTY2FsZShvZmZzZXQwKTtcclxuICAgICAgICBiYXIueCA9IHRoaXMueFNjYWxlKG9mZnNldDApO1xyXG4gICAgICAgIGJhci55ID0gMDtcclxuICAgICAgICBiYXIub2Zmc2V0MCA9IG9mZnNldDA7XHJcbiAgICAgICAgYmFyLm9mZnNldDEgPSBvZmZzZXQxO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ25vcm1hbGl6ZWQnKSB7XHJcbiAgICAgICAgbGV0IG9mZnNldDAgPSBkMFtkMFR5cGVdO1xyXG4gICAgICAgIGxldCBvZmZzZXQxID0gb2Zmc2V0MCArIHZhbHVlO1xyXG4gICAgICAgIGQwW2QwVHlwZV0gKz0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0b3RhbCA+IDApIHtcclxuICAgICAgICAgIG9mZnNldDAgPSAob2Zmc2V0MCAqIDEwMCkgLyB0b3RhbDtcclxuICAgICAgICAgIG9mZnNldDEgPSAob2Zmc2V0MSAqIDEwMCkgLyB0b3RhbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb2Zmc2V0MCA9IDA7XHJcbiAgICAgICAgICBvZmZzZXQxID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJhci53aWR0aCA9IHRoaXMueFNjYWxlKG9mZnNldDEpIC0gdGhpcy54U2NhbGUob2Zmc2V0MCk7XHJcbiAgICAgICAgYmFyLnggPSB0aGlzLnhTY2FsZShvZmZzZXQwKTtcclxuICAgICAgICBiYXIueSA9IDA7XHJcbiAgICAgICAgYmFyLm9mZnNldDAgPSBvZmZzZXQwO1xyXG4gICAgICAgIGJhci5vZmZzZXQxID0gb2Zmc2V0MTtcclxuICAgICAgICB2YWx1ZSA9IChvZmZzZXQxIC0gb2Zmc2V0MCkudG9GaXhlZCgyKSArICclJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuY29sb3JzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICAgICAgYmFyLmNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IobGFiZWwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICAgIGJhci5jb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHZhbHVlKTtcclxuICAgICAgICAgIGJhci5ncmFkaWVudFN0b3BzID0gdGhpcy5jb2xvcnMuZ2V0TGluZWFyR3JhZGllbnRTdG9wcyh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGJhci5jb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKGJhci5vZmZzZXQxKTtcclxuICAgICAgICAgIGJhci5ncmFkaWVudFN0b3BzID0gdGhpcy5jb2xvcnMuZ2V0TGluZWFyR3JhZGllbnRTdG9wcyhiYXIub2Zmc2V0MSwgYmFyLm9mZnNldDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHRvb2x0aXBMYWJlbCA9IGZvcm1hdHRlZExhYmVsO1xyXG4gICAgICBiYXIuYXJpYUxhYmVsID0gZm9ybWF0dGVkTGFiZWwgKyAnICcgKyB2YWx1ZS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICBpZiAodGhpcy5zZXJpZXNOYW1lKSB7XHJcbiAgICAgICAgdG9vbHRpcExhYmVsID0gYCR7dGhpcy5zZXJpZXNOYW1lfSDigKIgJHtmb3JtYXR0ZWRMYWJlbH1gO1xyXG4gICAgICAgIGJhci5kYXRhLnNlcmllcyA9IHRoaXMuc2VyaWVzTmFtZTtcclxuICAgICAgICBiYXIuYXJpYUxhYmVsID0gdGhpcy5zZXJpZXNOYW1lICsgJyAnICsgYmFyLmFyaWFMYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgYmFyLnRvb2x0aXBUZXh0ID0gdGhpcy50b29sdGlwRGlzYWJsZWRcclxuICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgIDogYFxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidG9vbHRpcC1sYWJlbFwiPiR7ZXNjYXBlTGFiZWwodG9vbHRpcExhYmVsKX08L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b29sdGlwLXZhbFwiPiR7XHJcbiAgICAgICAgICB0aGlzLmRhdGFMYWJlbEZvcm1hdHRpbmcgPyB0aGlzLmRhdGFMYWJlbEZvcm1hdHRpbmcodmFsdWUpIDogdmFsdWUudG9Mb2NhbGVTdHJpbmcoKVxyXG4gICAgICAgIH08L3NwYW4+XHJcbiAgICAgIGA7XHJcblxyXG4gICAgICByZXR1cm4gYmFyO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy51cGRhdGVEYXRhTGFiZWxzKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEYXRhTGFiZWxzKCkge1xyXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3N0YWNrZWQnKSB7XHJcbiAgICAgIHRoaXMuYmFyc0ZvckRhdGFMYWJlbHMgPSBbXTtcclxuICAgICAgY29uc3Qgc2VjdGlvbjogYW55ID0ge307XHJcbiAgICAgIHNlY3Rpb24uc2VyaWVzID0gdGhpcy5zZXJpZXNOYW1lO1xyXG4gICAgICBjb25zdCB0b3RhbFBvc2l0aXZlID0gdGhpcy5zZXJpZXMubWFwKGQgPT4gZC52YWx1ZSkucmVkdWNlKChzdW0sIGQpID0+IChkID4gMCA/IHN1bSArIGQgOiBzdW0pLCAwKTtcclxuICAgICAgY29uc3QgdG90YWxOZWdhdGl2ZSA9IHRoaXMuc2VyaWVzLm1hcChkID0+IGQudmFsdWUpLnJlZHVjZSgoc3VtLCBkKSA9PiAoZCA8IDAgPyBzdW0gKyBkIDogc3VtKSwgMCk7XHJcbiAgICAgIHNlY3Rpb24udG90YWwgPSB0b3RhbFBvc2l0aXZlICsgdG90YWxOZWdhdGl2ZTtcclxuICAgICAgc2VjdGlvbi54ID0gMDtcclxuICAgICAgc2VjdGlvbi55ID0gMDtcclxuICAgICAgLy8gaWYgdG90YWwgaXMgcG9zaXRpdmUgdGhlbiB3ZSBzaG93IGl0IG9uIHRoZSByaWdodCwgb3RoZXJ3aXNlIG9uIHRoZSBsZWZ0XHJcbiAgICAgIGlmIChzZWN0aW9uLnRvdGFsID4gMCkge1xyXG4gICAgICAgIHNlY3Rpb24ud2lkdGggPSB0aGlzLnhTY2FsZSh0b3RhbFBvc2l0aXZlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWN0aW9uLndpZHRoID0gdGhpcy54U2NhbGUodG90YWxOZWdhdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgc2VjdGlvbi5oZWlnaHQgPSB0aGlzLnlTY2FsZS5iYW5kd2lkdGgoKTtcclxuICAgICAgdGhpcy5iYXJzRm9yRGF0YUxhYmVscy5wdXNoKHNlY3Rpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5iYXJzRm9yRGF0YUxhYmVscyA9IHRoaXMuc2VyaWVzLm1hcChkID0+IHtcclxuICAgICAgICBjb25zdCBzZWN0aW9uOiBhbnkgPSB7fTtcclxuICAgICAgICBzZWN0aW9uLnNlcmllcyA9IHRoaXMuc2VyaWVzTmFtZSA/IHRoaXMuc2VyaWVzTmFtZSA6IGQubGFiZWw7XHJcbiAgICAgICAgc2VjdGlvbi50b3RhbCA9IGQudmFsdWU7XHJcbiAgICAgICAgc2VjdGlvbi54ID0gdGhpcy54U2NhbGUoMCk7XHJcbiAgICAgICAgc2VjdGlvbi55ID0gdGhpcy55U2NhbGUoZC5sYWJlbCk7XHJcbiAgICAgICAgc2VjdGlvbi53aWR0aCA9IHRoaXMueFNjYWxlKHNlY3Rpb24udG90YWwpIC0gdGhpcy54U2NhbGUoMCk7XHJcbiAgICAgICAgc2VjdGlvbi5oZWlnaHQgPSB0aGlzLnlTY2FsZS5iYW5kd2lkdGgoKTtcclxuICAgICAgICByZXR1cm4gc2VjdGlvbjtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUb29sdGlwU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnRvb2x0aXBQbGFjZW1lbnQgPSB0aGlzLnRvb2x0aXBEaXNhYmxlZCA/IHVuZGVmaW5lZCA6ICd0b3AnO1xyXG4gICAgdGhpcy50b29sdGlwVHlwZSA9IHRoaXMudG9vbHRpcERpc2FibGVkID8gdW5kZWZpbmVkIDogJ3Rvb2x0aXAnO1xyXG4gIH1cclxuXHJcbiAgaXNBY3RpdmUoZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzKSByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmQoZCA9PiB7XHJcbiAgICAgIHJldHVybiBlbnRyeS5uYW1lID09PSBkLm5hbWUgJiYgZW50cnkuc2VyaWVzID09PSBkLnNlcmllcztcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGdldExhYmVsKGRhdGFJdGVtKTogc3RyaW5nIHtcclxuICAgIGlmIChkYXRhSXRlbS5sYWJlbCkge1xyXG4gICAgICByZXR1cm4gZGF0YUl0ZW0ubGFiZWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YUl0ZW0ubmFtZTtcclxuICB9XHJcblxyXG4gIHRyYWNrQnkoaW5kZXgsIGJhcikge1xyXG4gICAgcmV0dXJuIGJhci5sYWJlbDtcclxuICB9XHJcblxyXG4gIHRyYWNrRGF0YUxhYmVsQnkoaW5kZXgsIGJhckxhYmVsKSB7XHJcbiAgICByZXR1cm4gaW5kZXggKyAnIycgKyBiYXJMYWJlbC5zZXJpZXMgKyAnIycgKyBiYXJMYWJlbC50b3RhbDtcclxuICB9XHJcblxyXG4gIGNsaWNrKGRhdGE6IERhdGFJdGVtKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xyXG4gIH1cclxufVxyXG4iXX0=