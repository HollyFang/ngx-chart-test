import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { escapeLabel } from '../common/label.helper';
export class TreeMapCellSeriesComponent {
    constructor() {
        this.gradient = false;
        this.tooltipDisabled = false;
        this.animations = true;
        this.select = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.cells = this.getCells();
    }
    getCells() {
        return this.data.children
            .filter(d => {
            return d.depth === 1;
        })
            .map((d, index) => {
            const label = d.id;
            return {
                data: d.data,
                x: d.x0,
                y: d.y0,
                width: d.x1 - d.x0,
                height: d.y1 - d.y0,
                fill: this.colors.getColor(label),
                label,
                value: d.value,
                valueType: d.valueType
            };
        });
    }
    getTooltipText({ label, value }) {
        return `
      <span class="tooltip-label">${escapeLabel(label)}</span>
      <span class="tooltip-val">${value.toLocaleString()}</span>
    `;
    }
    onClick(data) {
        this.select.emit(data);
    }
    trackBy(index, item) {
        return item.label;
    }
}
TreeMapCellSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-tree-map-cell-series]',
                template: `
    <svg:g
      ngx-charts-tree-map-cell
      *ngFor="let c of cells; trackBy: trackBy"
      [data]="c.data"
      [x]="c.x"
      [y]="c.y"
      [width]="c.width"
      [height]="c.height"
      [fill]="c.fill"
      [label]="c.label"
      [value]="c.value"
      [valueType]="c.valueType"
      [valueFormatting]="valueFormatting"
      [labelFormatting]="labelFormatting"
      [gradient]="gradient"
      [animations]="animations"
      (select)="onClick($event)"
      ngx-tooltip
      [tooltipDisabled]="tooltipDisabled"
      [tooltipPlacement]="'top'"
      [tooltipType]="'tooltip'"
      [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(c)"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipContext]="c.data"
    ></svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
TreeMapCellSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    dims: [{ type: Input }],
    colors: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    gradient: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tYXAtY2VsbC1zZXJpZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL3RyZWUtbWFwL3RyZWUtbWFwLWNlbGwtc2VyaWVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFDTCxNQUFNLEVBRU4sWUFBWSxFQUNaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFpQ3JELE1BQU0sT0FBTywwQkFBMEI7SUEvQnZDO1FBcUNXLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFFakMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUxQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQTRDeEMsQ0FBQztJQXhDQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTthQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDVixPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQzthQUNELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNoQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBRW5CLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO2dCQUNaLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtnQkFDUCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUNqQyxLQUFLO2dCQUNMLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztnQkFDZCxTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVM7YUFDdkIsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7UUFDN0IsT0FBTztvQ0FDeUIsV0FBVyxDQUFDLEtBQUssQ0FBQztrQ0FDcEIsS0FBSyxDQUFDLGNBQWMsRUFBRTtLQUNuRCxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJO1FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSTtRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQzs7O1lBckZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2dCQUM5QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7bUJBRUUsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7OEJBQ0wsS0FBSzs4QkFDTCxLQUFLO3VCQUNMLEtBQUs7OEJBQ0wsS0FBSzs4QkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgVGVtcGxhdGVSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZXNjYXBlTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXRyZWUtbWFwLWNlbGwtc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6Z1xyXG4gICAgICBuZ3gtY2hhcnRzLXRyZWUtbWFwLWNlbGxcclxuICAgICAgKm5nRm9yPVwibGV0IGMgb2YgY2VsbHM7IHRyYWNrQnk6IHRyYWNrQnlcIlxyXG4gICAgICBbZGF0YV09XCJjLmRhdGFcIlxyXG4gICAgICBbeF09XCJjLnhcIlxyXG4gICAgICBbeV09XCJjLnlcIlxyXG4gICAgICBbd2lkdGhdPVwiYy53aWR0aFwiXHJcbiAgICAgIFtoZWlnaHRdPVwiYy5oZWlnaHRcIlxyXG4gICAgICBbZmlsbF09XCJjLmZpbGxcIlxyXG4gICAgICBbbGFiZWxdPVwiYy5sYWJlbFwiXHJcbiAgICAgIFt2YWx1ZV09XCJjLnZhbHVlXCJcclxuICAgICAgW3ZhbHVlVHlwZV09XCJjLnZhbHVlVHlwZVwiXHJcbiAgICAgIFt2YWx1ZUZvcm1hdHRpbmddPVwidmFsdWVGb3JtYXR0aW5nXCJcclxuICAgICAgW2xhYmVsRm9ybWF0dGluZ109XCJsYWJlbEZvcm1hdHRpbmdcIlxyXG4gICAgICBbZ3JhZGllbnRdPVwiZ3JhZGllbnRcIlxyXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKCRldmVudClcIlxyXG4gICAgICBuZ3gtdG9vbHRpcFxyXG4gICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cIid0b3AnXCJcclxuICAgICAgW3Rvb2x0aXBUeXBlXT1cIid0b29sdGlwJ1wiXHJcbiAgICAgIFt0b29sdGlwVGl0bGVdPVwidG9vbHRpcFRlbXBsYXRlID8gdW5kZWZpbmVkIDogZ2V0VG9vbHRpcFRleHQoYylcIlxyXG4gICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXHJcbiAgICAgIFt0b29sdGlwQ29udGV4dF09XCJjLmRhdGFcIlxyXG4gICAgPjwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJlZU1hcENlbGxTZXJpZXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgZGltcztcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgbGFiZWxGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgZ3JhZGllbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0b29sdGlwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNlbGxzOiBhbnlbXTtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy5jZWxscyA9IHRoaXMuZ2V0Q2VsbHMoKTtcclxuICB9XHJcblxyXG4gIGdldENlbGxzKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGEuY2hpbGRyZW5cclxuICAgICAgLmZpbHRlcihkID0+IHtcclxuICAgICAgICByZXR1cm4gZC5kZXB0aCA9PT0gMTtcclxuICAgICAgfSlcclxuICAgICAgLm1hcCgoZCwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbCA9IGQuaWQ7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBkYXRhOiBkLmRhdGEsXHJcbiAgICAgICAgICB4OiBkLngwLFxyXG4gICAgICAgICAgeTogZC55MCxcclxuICAgICAgICAgIHdpZHRoOiBkLngxIC0gZC54MCxcclxuICAgICAgICAgIGhlaWdodDogZC55MSAtIGQueTAsXHJcbiAgICAgICAgICBmaWxsOiB0aGlzLmNvbG9ycy5nZXRDb2xvcihsYWJlbCksXHJcbiAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgIHZhbHVlOiBkLnZhbHVlLFxyXG4gICAgICAgICAgdmFsdWVUeXBlOiBkLnZhbHVlVHlwZVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9vbHRpcFRleHQoeyBsYWJlbCwgdmFsdWUgfSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXAtbGFiZWxcIj4ke2VzY2FwZUxhYmVsKGxhYmVsKX08L3NwYW4+XHJcbiAgICAgIDxzcGFuIGNsYXNzPVwidG9vbHRpcC12YWxcIj4ke3ZhbHVlLnRvTG9jYWxlU3RyaW5nKCl9PC9zcGFuPlxyXG4gICAgYDtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZGF0YSk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdChkYXRhKTtcclxuICB9XHJcblxyXG4gIHRyYWNrQnkoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGl0ZW0ubGFiZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==