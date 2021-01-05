import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { XAxisTicksComponent } from './x-axis-ticks.component';
export class XAxisComponent {
    constructor() {
        this.rotateTicks = true;
        this.showGridLines = false;
        this.xOrient = 'bottom';
        this.xAxisOffset = 0;
        this.dimensionsChanged = new EventEmitter();
        this.xClick = new EventEmitter();
        this.xAxisClassName = 'x axis';
        this.labelOffset = 0;
        this.fill = 'none';
        this.stroke = 'stroke';
        this.tickStroke = '#ccc';
        this.strokeWidth = 'none';
        this.padding = 5;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.transform = `translate(0,${this.xAxisOffset + this.padding + this.dims.height})`;
        if (typeof this.xAxisTickCount !== 'undefined') {
            this.tickArguments = [this.xAxisTickCount];
        }
    }
    emitTicksHeight({ height }) {
        const newLabelOffset = height + 25 + 5;
        if (newLabelOffset !== this.labelOffset) {
            this.labelOffset = newLabelOffset;
            setTimeout(() => {
                this.dimensionsChanged.emit({ height });
            }, 0);
        }
    }
}
XAxisComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-x-axis]',
                template: `
    <svg:g [attr.class]="xAxisClassName" [attr.transform]="transform">
      <svg:g
        ngx-charts-x-axis-ticks
        *ngIf="xScale"
        [trimTicks]="trimTicks"
        [rotateTicks]="rotateTicks"
        [maxTickLength]="maxTickLength"
        [tickFormatting]="tickFormatting"
        [tickArguments]="tickArguments"
        [tickStroke]="tickStroke"
        [scale]="xScale"
        [orient]="xOrient"
        [showGridLines]="showGridLines"
        [gridLineHeight]="dims.height"
        [width]="dims.width"
        [tickValues]="ticks"
        [activeTime]="activeTime"
        (dimensionsChanged)="emitTicksHeight($event)"
      />
      <svg:g
        ngx-charts-axis-label
        *ngIf="showLabel"
        [label]="labelText"
        [offset]="labelOffset"
        [orient]="'bottom'"
        [height]="dims.height"
        [width]="dims.width"
      ></svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
XAxisComponent.propDecorators = {
    xScale: [{ type: Input }],
    dims: [{ type: Input }],
    trimTicks: [{ type: Input }],
    rotateTicks: [{ type: Input }],
    maxTickLength: [{ type: Input }],
    tickFormatting: [{ type: Input }],
    showGridLines: [{ type: Input }],
    showLabel: [{ type: Input }],
    labelText: [{ type: Input }],
    ticks: [{ type: Input }],
    xAxisTickInterval: [{ type: Input }],
    xAxisTickCount: [{ type: Input }],
    xOrient: [{ type: Input }],
    xAxisOffset: [{ type: Input }],
    activeTime: [{ type: Input }],
    dimensionsChanged: [{ type: Output }],
    xClick: [{ type: Output }],
    ticksComponent: [{ type: ViewChild, args: [XAxisTicksComponent,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy94LWF4aXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLE1BQU0sRUFDTixZQUFZLEVBRVosU0FBUyxFQUNULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQXFDL0QsTUFBTSxPQUFPLGNBQWM7SUFuQzNCO1FBdUNXLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRzVCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBTXRCLFlBQU8sR0FBVyxRQUFRLENBQUM7UUFDM0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFHdkIsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN2QyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0QyxtQkFBYyxHQUFXLFFBQVEsQ0FBQztRQUlsQyxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixTQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxRQUFRLENBQUM7UUFDMUIsZUFBVSxHQUFXLE1BQU0sQ0FBQztRQUM1QixnQkFBVyxHQUFXLE1BQU0sQ0FBQztRQUM3QixZQUFPLEdBQVcsQ0FBQyxDQUFDO0lBeUJ0QixDQUFDO0lBckJDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7UUFFdEYsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO1lBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBRUQsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFO1FBQ3hCLE1BQU0sY0FBYyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksY0FBYyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7WUFDbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMxQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNILENBQUM7OztZQXhGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4QlQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztxQkFFRSxLQUFLO21CQUNMLEtBQUs7d0JBQ0wsS0FBSzswQkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO2dDQUNMLEtBQUs7NkJBQ0wsS0FBSztzQkFDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSztnQ0FFTCxNQUFNO3FCQUNOLE1BQU07NkJBYU4sU0FBUyxTQUFDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBPbkNoYW5nZXMsXHJcbiAgVmlld0NoaWxkLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBYQXhpc1RpY2tzQ29tcG9uZW50IH0gZnJvbSAnLi94LWF4aXMtdGlja3MuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXgtYXhpc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgW2F0dHIuY2xhc3NdPVwieEF4aXNDbGFzc05hbWVcIiBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCI+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMteC1heGlzLXRpY2tzXHJcbiAgICAgICAgKm5nSWY9XCJ4U2NhbGVcIlxyXG4gICAgICAgIFt0cmltVGlja3NdPVwidHJpbVRpY2tzXCJcclxuICAgICAgICBbcm90YXRlVGlja3NdPVwicm90YXRlVGlja3NcIlxyXG4gICAgICAgIFttYXhUaWNrTGVuZ3RoXT1cIm1heFRpY2tMZW5ndGhcIlxyXG4gICAgICAgIFt0aWNrRm9ybWF0dGluZ109XCJ0aWNrRm9ybWF0dGluZ1wiXHJcbiAgICAgICAgW3RpY2tBcmd1bWVudHNdPVwidGlja0FyZ3VtZW50c1wiXHJcbiAgICAgICAgW3RpY2tTdHJva2VdPVwidGlja1N0cm9rZVwiXHJcbiAgICAgICAgW3NjYWxlXT1cInhTY2FsZVwiXHJcbiAgICAgICAgW29yaWVudF09XCJ4T3JpZW50XCJcclxuICAgICAgICBbc2hvd0dyaWRMaW5lc109XCJzaG93R3JpZExpbmVzXCJcclxuICAgICAgICBbZ3JpZExpbmVIZWlnaHRdPVwiZGltcy5oZWlnaHRcIlxyXG4gICAgICAgIFt3aWR0aF09XCJkaW1zLndpZHRoXCJcclxuICAgICAgICBbdGlja1ZhbHVlc109XCJ0aWNrc1wiXHJcbiAgICAgICAgW2FjdGl2ZVRpbWVdPVwiYWN0aXZlVGltZVwiXHJcbiAgICAgICAgKGRpbWVuc2lvbnNDaGFuZ2VkKT1cImVtaXRUaWNrc0hlaWdodCgkZXZlbnQpXCJcclxuICAgICAgLz5cclxuICAgICAgPHN2ZzpnXHJcbiAgICAgICAgbmd4LWNoYXJ0cy1heGlzLWxhYmVsXHJcbiAgICAgICAgKm5nSWY9XCJzaG93TGFiZWxcIlxyXG4gICAgICAgIFtsYWJlbF09XCJsYWJlbFRleHRcIlxyXG4gICAgICAgIFtvZmZzZXRdPVwibGFiZWxPZmZzZXRcIlxyXG4gICAgICAgIFtvcmllbnRdPVwiJ2JvdHRvbSdcIlxyXG4gICAgICAgIFtoZWlnaHRdPVwiZGltcy5oZWlnaHRcIlxyXG4gICAgICAgIFt3aWR0aF09XCJkaW1zLndpZHRoXCJcclxuICAgICAgPjwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFhBeGlzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSB4U2NhbGU7XHJcbiAgQElucHV0KCkgZGltcztcclxuICBASW5wdXQoKSB0cmltVGlja3M6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcm90YXRlVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1heFRpY2tMZW5ndGg6IG51bWJlcjtcclxuICBASW5wdXQoKSB0aWNrRm9ybWF0dGluZztcclxuICBASW5wdXQoKSBzaG93R3JpZExpbmVzID0gZmFsc2U7XHJcbiAgQElucHV0KCkgc2hvd0xhYmVsO1xyXG4gIEBJbnB1dCgpIGxhYmVsVGV4dDtcclxuICBASW5wdXQoKSB0aWNrczogYW55W107XHJcbiAgQElucHV0KCkgeEF4aXNUaWNrSW50ZXJ2YWw7XHJcbiAgQElucHV0KCkgeEF4aXNUaWNrQ291bnQ6IGFueTtcclxuICBASW5wdXQoKSB4T3JpZW50OiBzdHJpbmcgPSAnYm90dG9tJztcclxuICBASW5wdXQoKSB4QXhpc09mZnNldDogbnVtYmVyID0gMDtcclxuICBASW5wdXQoKSBhY3RpdmVUaW1lO1xyXG5cclxuICBAT3V0cHV0KCkgZGltZW5zaW9uc0NoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIHhDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgeEF4aXNDbGFzc05hbWU6IHN0cmluZyA9ICd4IGF4aXMnO1xyXG5cclxuICB0aWNrQXJndW1lbnRzOiBhbnk7XHJcbiAgdHJhbnNmb3JtOiBhbnk7XHJcbiAgbGFiZWxPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgZmlsbDogc3RyaW5nID0gJ25vbmUnO1xyXG4gIHN0cm9rZTogc3RyaW5nID0gJ3N0cm9rZSc7XHJcbiAgdGlja1N0cm9rZTogc3RyaW5nID0gJyNjY2MnO1xyXG4gIHN0cm9rZVdpZHRoOiBzdHJpbmcgPSAnbm9uZSc7XHJcbiAgcGFkZGluZzogbnVtYmVyID0gNTtcclxuXHJcbiAgQFZpZXdDaGlsZChYQXhpc1RpY2tzQ29tcG9uZW50KSB0aWNrc0NvbXBvbmVudDogWEF4aXNUaWNrc0NvbXBvbmVudDtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwLCR7dGhpcy54QXhpc09mZnNldCArIHRoaXMucGFkZGluZyArIHRoaXMuZGltcy5oZWlnaHR9KWA7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnhBeGlzVGlja0NvdW50ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzLnRpY2tBcmd1bWVudHMgPSBbdGhpcy54QXhpc1RpY2tDb3VudF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbWl0VGlja3NIZWlnaHQoeyBoZWlnaHQgfSk6IHZvaWQge1xyXG4gICAgY29uc3QgbmV3TGFiZWxPZmZzZXQgPSBoZWlnaHQgKyAyNSArIDU7XHJcbiAgICBpZiAobmV3TGFiZWxPZmZzZXQgIT09IHRoaXMubGFiZWxPZmZzZXQpIHtcclxuICAgICAgdGhpcy5sYWJlbE9mZnNldCA9IG5ld0xhYmVsT2Zmc2V0O1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2VkLmVtaXQoeyBoZWlnaHQgfSk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=