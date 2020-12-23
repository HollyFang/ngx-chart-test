import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
export class BubbleSeriesComponent {
    constructor() {
        this.tooltipDisabled = false;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.circles = this.getCircles();
    }
    getCircles() {
        const seriesName = this.data.name;
        return this.data.series
            .map((d, i) => {
            if (typeof d.y !== 'undefined' && typeof d.x !== 'undefined') {
                const y = d.y;
                const x = d.x;
                const r = d.r;
                const radius = this.rScale(r || 1);
                const tooltipLabel = formatLabel(d.name);
                const cx = this.xScaleType === 'linear' ? this.xScale(Number(x)) : this.xScale(x);
                const cy = this.yScaleType === 'linear' ? this.yScale(Number(y)) : this.yScale(y);
                const color = this.colors.scaleType === 'linear' ? this.colors.getColor(r) : this.colors.getColor(seriesName);
                const isActive = !this.activeEntries.length ? true : this.isActive({ name: seriesName });
                const opacity = isActive ? 1 : 0.3;
                const data = Object.assign({}, d, {
                    series: seriesName,
                    name: d.name,
                    value: d.y,
                    x: d.x,
                    radius: d.r
                });
                return {
                    data,
                    x,
                    y,
                    r,
                    classNames: [`circle-data-${i}`],
                    value: y,
                    label: x,
                    cx,
                    cy,
                    radius,
                    tooltipLabel,
                    color,
                    opacity,
                    seriesName,
                    isActive,
                    transform: `translate(${cx},${cy})`
                };
            }
        })
            .filter(circle => circle !== undefined);
    }
    getTooltipText(circle) {
        const hasRadius = typeof circle.r !== 'undefined';
        const hasTooltipLabel = circle.tooltipLabel && circle.tooltipLabel.length;
        const hasSeriesName = circle.seriesName && circle.seriesName.length;
        const radiusValue = hasRadius ? formatLabel(circle.r) : '';
        const xAxisLabel = this.xAxisLabel && this.xAxisLabel !== '' ? `${this.xAxisLabel}:` : '';
        const yAxisLabel = this.yAxisLabel && this.yAxisLabel !== '' ? `${this.yAxisLabel}:` : '';
        const x = formatLabel(circle.x);
        const y = formatLabel(circle.y);
        const name = hasSeriesName && hasTooltipLabel
            ? `${circle.seriesName} • ${circle.tooltipLabel}`
            : circle.seriesName + circle.tooltipLabel;
        const tooltipTitle = hasSeriesName || hasTooltipLabel ? `<span class="tooltip-label">${escapeLabel(name)}</span>` : '';
        return `
      ${tooltipTitle}
      <span class="tooltip-label">
        <label>${escapeLabel(xAxisLabel)}</label> ${escapeLabel(x)}<br />
        <label>${escapeLabel(yAxisLabel)}</label> ${escapeLabel(y)}
      </span>
      <span class="tooltip-val">
        ${escapeLabel(radiusValue)}
      </span>
    `;
    }
    onClick(data) {
        this.select.emit(data);
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name;
        });
        return item !== undefined;
    }
    isVisible(circle) {
        if (this.activeEntries.length > 0) {
            return this.isActive({ name: circle.seriesName });
        }
        return circle.opacity !== 0;
    }
    activateCircle(circle) {
        circle.barVisible = true;
        this.activate.emit({ name: this.data.name });
    }
    deactivateCircle(circle) {
        circle.barVisible = false;
        this.deactivate.emit({ name: this.data.name });
    }
    trackBy(index, circle) {
        return `${circle.data.series} ${circle.data.name}`;
    }
}
BubbleSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-bubble-series]',
                template: `
    <svg:g *ngFor="let circle of circles; trackBy: trackBy">
      <svg:g [attr.transform]="circle.transform">
        <svg:g
          ngx-charts-circle
          [@animationState]="'active'"
          class="circle"
          [cx]="0"
          [cy]="0"
          [r]="circle.radius"
          [fill]="circle.color"
          [style.opacity]="circle.opacity"
          [class.active]="circle.isActive"
          [pointerEvents]="'all'"
          [data]="circle.value"
          [classNames]="circle.classNames"
          (select)="onClick(circle.data)"
          (activate)="activateCircle(circle)"
          (deactivate)="deactivateCircle(circle)"
          ngx-tooltip
          [tooltipDisabled]="tooltipDisabled"
          [tooltipPlacement]="'top'"
          [tooltipType]="'tooltip'"
          [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(circle)"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipContext]="circle.data"
        />
      </svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':enter', [
                            style({
                                opacity: 0,
                                transform: 'scale(0)'
                            }),
                            animate(250, style({ opacity: 1, transform: 'scale(1)' }))
                        ])
                    ])
                ]
            },] }
];
BubbleSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    rScale: [{ type: Input }],
    xScaleType: [{ type: Input }],
    yScaleType: [{ type: Input }],
    colors: [{ type: Input }],
    visibleValue: [{ type: Input }],
    activeEntries: [{ type: Input }],
    xAxisLabel: [{ type: Input }],
    yAxisLabel: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnViYmxlLXNlcmllcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvYnViYmxlLWNoYXJ0L2J1YmJsZS1zZXJpZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBRVosdUJBQXVCLEVBRXhCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBK0NsRSxNQUFNLE9BQU8scUJBQXFCO0lBN0NsQztRQXlEVyxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUdoQyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQStINUMsQ0FBQztJQTFIQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVsQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTthQUNwQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDWixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFX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LEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyRCxDQUFDOzs7WUE1TEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFVBQVUsRUFBRTtvQkFDVixPQUFPLENBQUMsZ0JBQWdCLEVBQUU7d0JBQ3hCLFVBQVUsQ0FBQyxRQUFRLEVBQUU7NEJBQ25CLEtBQUssQ0FBQztnQ0FDSixPQUFPLEVBQUUsQ0FBQztnQ0FDVixTQUFTLEVBQUUsVUFBVTs2QkFDdEIsQ0FBQzs0QkFDRixPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7eUJBQzNELENBQUM7cUJBQ0gsQ0FBQztpQkFDSDthQUNGOzs7bUJBRUUsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSztxQkFFTCxNQUFNO3VCQUNOLE1BQU07eUJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBPbkNoYW5nZXMsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgVGVtcGxhdGVSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpZ2dlciwgc3R5bGUsIGFuaW1hdGUsIHRyYW5zaXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgZm9ybWF0TGFiZWwsIGVzY2FwZUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL2xhYmVsLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1idWJibGUtc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgY2lyY2xlIG9mIGNpcmNsZXM7IHRyYWNrQnk6IHRyYWNrQnlcIj5cclxuICAgICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJjaXJjbGUudHJhbnNmb3JtXCI+XHJcbiAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICBuZ3gtY2hhcnRzLWNpcmNsZVxyXG4gICAgICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiXHJcbiAgICAgICAgICBjbGFzcz1cImNpcmNsZVwiXHJcbiAgICAgICAgICBbY3hdPVwiMFwiXHJcbiAgICAgICAgICBbY3ldPVwiMFwiXHJcbiAgICAgICAgICBbcl09XCJjaXJjbGUucmFkaXVzXCJcclxuICAgICAgICAgIFtmaWxsXT1cImNpcmNsZS5jb2xvclwiXHJcbiAgICAgICAgICBbc3R5bGUub3BhY2l0eV09XCJjaXJjbGUub3BhY2l0eVwiXHJcbiAgICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImNpcmNsZS5pc0FjdGl2ZVwiXHJcbiAgICAgICAgICBbcG9pbnRlckV2ZW50c109XCInYWxsJ1wiXHJcbiAgICAgICAgICBbZGF0YV09XCJjaXJjbGUudmFsdWVcIlxyXG4gICAgICAgICAgW2NsYXNzTmFtZXNdPVwiY2lyY2xlLmNsYXNzTmFtZXNcIlxyXG4gICAgICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKGNpcmNsZS5kYXRhKVwiXHJcbiAgICAgICAgICAoYWN0aXZhdGUpPVwiYWN0aXZhdGVDaXJjbGUoY2lyY2xlKVwiXHJcbiAgICAgICAgICAoZGVhY3RpdmF0ZSk9XCJkZWFjdGl2YXRlQ2lyY2xlKGNpcmNsZSlcIlxyXG4gICAgICAgICAgbmd4LXRvb2x0aXBcclxuICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwidG9vbHRpcERpc2FibGVkXCJcclxuICAgICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cIid0b3AnXCJcclxuICAgICAgICAgIFt0b29sdGlwVHlwZV09XCIndG9vbHRpcCdcIlxyXG4gICAgICAgICAgW3Rvb2x0aXBUaXRsZV09XCJ0b29sdGlwVGVtcGxhdGUgPyB1bmRlZmluZWQgOiBnZXRUb29sdGlwVGV4dChjaXJjbGUpXCJcclxuICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcclxuICAgICAgICAgIFt0b29sdGlwQ29udGV4dF09XCJjaXJjbGUuZGF0YVwiXHJcbiAgICAgICAgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBhbmltYXRpb25zOiBbXHJcbiAgICB0cmlnZ2VyKCdhbmltYXRpb25TdGF0ZScsIFtcclxuICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgW1xyXG4gICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwKSdcclxuICAgICAgICB9KSxcclxuICAgICAgICBhbmltYXRlKDI1MCwgc3R5bGUoeyBvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxKScgfSkpXHJcbiAgICAgIF0pXHJcbiAgICBdKVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEJ1YmJsZVNlcmllc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSB4U2NhbGU7XHJcbiAgQElucHV0KCkgeVNjYWxlO1xyXG4gIEBJbnB1dCgpIHJTY2FsZTtcclxuICBASW5wdXQoKSB4U2NhbGVUeXBlO1xyXG4gIEBJbnB1dCgpIHlTY2FsZVR5cGU7XHJcbiAgQElucHV0KCkgY29sb3JzO1xyXG4gIEBJbnB1dCgpIHZpc2libGVWYWx1ZTtcclxuICBASW5wdXQoKSBhY3RpdmVFbnRyaWVzOiBhbnlbXTtcclxuICBASW5wdXQoKSB4QXhpc0xhYmVsOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgeUF4aXNMYWJlbDogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGFyZWFQYXRoOiBhbnk7XHJcbiAgY2lyY2xlczogYW55W107XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNpcmNsZXMgPSB0aGlzLmdldENpcmNsZXMoKTtcclxuICB9XHJcblxyXG4gIGdldENpcmNsZXMoKTogYW55W10ge1xyXG4gICAgY29uc3Qgc2VyaWVzTmFtZSA9IHRoaXMuZGF0YS5uYW1lO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmRhdGEuc2VyaWVzXHJcbiAgICAgIC5tYXAoKGQsIGkpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIGQueSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGQueCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnN0IHkgPSBkLnk7XHJcbiAgICAgICAgICBjb25zdCB4ID0gZC54O1xyXG4gICAgICAgICAgY29uc3QgciA9IGQucjtcclxuXHJcbiAgICAgICAgICBjb25zdCByYWRpdXMgPSB0aGlzLnJTY2FsZShyIHx8IDEpO1xyXG4gICAgICAgICAgY29uc3QgdG9vbHRpcExhYmVsID0gZm9ybWF0TGFiZWwoZC5uYW1lKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBjeCA9IHRoaXMueFNjYWxlVHlwZSA9PT0gJ2xpbmVhcicgPyB0aGlzLnhTY2FsZShOdW1iZXIoeCkpIDogdGhpcy54U2NhbGUoeCk7XHJcbiAgICAgICAgICBjb25zdCBjeSA9IHRoaXMueVNjYWxlVHlwZSA9PT0gJ2xpbmVhcicgPyB0aGlzLnlTY2FsZShOdW1iZXIoeSkpIDogdGhpcy55U2NhbGUoeSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInID8gdGhpcy5jb2xvcnMuZ2V0Q29sb3IocikgOiB0aGlzLmNvbG9ycy5nZXRDb2xvcihzZXJpZXNOYW1lKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9ICF0aGlzLmFjdGl2ZUVudHJpZXMubGVuZ3RoID8gdHJ1ZSA6IHRoaXMuaXNBY3RpdmUoeyBuYW1lOiBzZXJpZXNOYW1lIH0pO1xyXG4gICAgICAgICAgY29uc3Qgb3BhY2l0eSA9IGlzQWN0aXZlID8gMSA6IDAuMztcclxuXHJcbiAgICAgICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZCwge1xyXG4gICAgICAgICAgICBzZXJpZXM6IHNlcmllc05hbWUsXHJcbiAgICAgICAgICAgIG5hbWU6IGQubmFtZSxcclxuICAgICAgICAgICAgdmFsdWU6IGQueSxcclxuICAgICAgICAgICAgeDogZC54LFxyXG4gICAgICAgICAgICByYWRpdXM6IGQuclxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGF0YSxcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSxcclxuICAgICAgICAgICAgcixcclxuICAgICAgICAgICAgY2xhc3NOYW1lczogW2BjaXJjbGUtZGF0YS0ke2l9YF0sXHJcbiAgICAgICAgICAgIHZhbHVlOiB5LFxyXG4gICAgICAgICAgICBsYWJlbDogeCxcclxuICAgICAgICAgICAgY3gsXHJcbiAgICAgICAgICAgIGN5LFxyXG4gICAgICAgICAgICByYWRpdXMsXHJcbiAgICAgICAgICAgIHRvb2x0aXBMYWJlbCxcclxuICAgICAgICAgICAgY29sb3IsXHJcbiAgICAgICAgICAgIG9wYWNpdHksXHJcbiAgICAgICAgICAgIHNlcmllc05hbWUsXHJcbiAgICAgICAgICAgIGlzQWN0aXZlLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtjeH0sJHtjeX0pYFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIC5maWx0ZXIoY2lyY2xlID0+IGNpcmNsZSAhPT0gdW5kZWZpbmVkKTtcclxuICB9XHJcblxyXG4gIGdldFRvb2x0aXBUZXh0KGNpcmNsZSk6IHN0cmluZyB7XHJcbiAgICBjb25zdCBoYXNSYWRpdXMgPSB0eXBlb2YgY2lyY2xlLnIgIT09ICd1bmRlZmluZWQnO1xyXG4gICAgY29uc3QgaGFzVG9vbHRpcExhYmVsID0gY2lyY2xlLnRvb2x0aXBMYWJlbCAmJiBjaXJjbGUudG9vbHRpcExhYmVsLmxlbmd0aDtcclxuICAgIGNvbnN0IGhhc1Nlcmllc05hbWUgPSBjaXJjbGUuc2VyaWVzTmFtZSAmJiBjaXJjbGUuc2VyaWVzTmFtZS5sZW5ndGg7XHJcblxyXG4gICAgY29uc3QgcmFkaXVzVmFsdWUgPSBoYXNSYWRpdXMgPyBmb3JtYXRMYWJlbChjaXJjbGUucikgOiAnJztcclxuICAgIGNvbnN0IHhBeGlzTGFiZWwgPSB0aGlzLnhBeGlzTGFiZWwgJiYgdGhpcy54QXhpc0xhYmVsICE9PSAnJyA/IGAke3RoaXMueEF4aXNMYWJlbH06YCA6ICcnO1xyXG4gICAgY29uc3QgeUF4aXNMYWJlbCA9IHRoaXMueUF4aXNMYWJlbCAmJiB0aGlzLnlBeGlzTGFiZWwgIT09ICcnID8gYCR7dGhpcy55QXhpc0xhYmVsfTpgIDogJyc7XHJcbiAgICBjb25zdCB4ID0gZm9ybWF0TGFiZWwoY2lyY2xlLngpO1xyXG4gICAgY29uc3QgeSA9IGZvcm1hdExhYmVsKGNpcmNsZS55KTtcclxuICAgIGNvbnN0IG5hbWUgPVxyXG4gICAgICBoYXNTZXJpZXNOYW1lICYmIGhhc1Rvb2x0aXBMYWJlbFxyXG4gICAgICAgID8gYCR7Y2lyY2xlLnNlcmllc05hbWV9IOKAoiAke2NpcmNsZS50b29sdGlwTGFiZWx9YFxyXG4gICAgICAgIDogY2lyY2xlLnNlcmllc05hbWUgKyBjaXJjbGUudG9vbHRpcExhYmVsO1xyXG4gICAgY29uc3QgdG9vbHRpcFRpdGxlID1cclxuICAgICAgaGFzU2VyaWVzTmFtZSB8fCBoYXNUb29sdGlwTGFiZWwgPyBgPHNwYW4gY2xhc3M9XCJ0b29sdGlwLWxhYmVsXCI+JHtlc2NhcGVMYWJlbChuYW1lKX08L3NwYW4+YCA6ICcnO1xyXG5cclxuICAgIHJldHVybiBgXHJcbiAgICAgICR7dG9vbHRpcFRpdGxlfVxyXG4gICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXAtbGFiZWxcIj5cclxuICAgICAgICA8bGFiZWw+JHtlc2NhcGVMYWJlbCh4QXhpc0xhYmVsKX08L2xhYmVsPiAke2VzY2FwZUxhYmVsKHgpfTxiciAvPlxyXG4gICAgICAgIDxsYWJlbD4ke2VzY2FwZUxhYmVsKHlBeGlzTGFiZWwpfTwvbGFiZWw+ICR7ZXNjYXBlTGFiZWwoeSl9XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJ0b29sdGlwLXZhbFwiPlxyXG4gICAgICAgICR7ZXNjYXBlTGFiZWwocmFkaXVzVmFsdWUpfVxyXG4gICAgICA8L3NwYW4+XHJcbiAgICBgO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhkYXRhKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgaXNBY3RpdmUoZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzKSByZXR1cm4gZmFsc2U7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5hY3RpdmVFbnRyaWVzLmZpbmQoZCA9PiB7XHJcbiAgICAgIHJldHVybiBlbnRyeS5uYW1lID09PSBkLm5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpdGVtICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBpc1Zpc2libGUoY2lyY2xlKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5hY3RpdmVFbnRyaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmUoeyBuYW1lOiBjaXJjbGUuc2VyaWVzTmFtZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2lyY2xlLm9wYWNpdHkgIT09IDA7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZUNpcmNsZShjaXJjbGUpOiB2b2lkIHtcclxuICAgIGNpcmNsZS5iYXJWaXNpYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IG5hbWU6IHRoaXMuZGF0YS5uYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZUNpcmNsZShjaXJjbGUpOiB2b2lkIHtcclxuICAgIGNpcmNsZS5iYXJWaXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IG5hbWU6IHRoaXMuZGF0YS5uYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJhY2tCeShpbmRleCwgY2lyY2xlKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgJHtjaXJjbGUuZGF0YS5zZXJpZXN9ICR7Y2lyY2xlLmRhdGEubmFtZX1gO1xyXG4gIH1cclxufVxyXG4iXX0=