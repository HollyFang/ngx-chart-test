import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { XAxisTicksComponent } from './x-axis-ticks.component';
export class XAxisComponent {
    constructor() {
        this.rotateTicks = true;
        this.showGridLines = false;
        this.xOrient = 'bottom';
        this.xAxisOffset = 0;
        this.dimensionsChanged = new EventEmitter();
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
    ticksComponent: [{ type: ViewChild, args: [XAxisTicksComponent,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy94LWF4aXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLE1BQU0sRUFDTixZQUFZLEVBRVosU0FBUyxFQUNULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQXFDL0QsTUFBTSxPQUFPLGNBQWM7SUFuQzNCO1FBdUNXLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRzVCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBTXRCLFlBQU8sR0FBVyxRQUFRLENBQUM7UUFDM0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFHdkIsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVqRCxtQkFBYyxHQUFXLFFBQVEsQ0FBQztRQUlsQyxnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixTQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxRQUFRLENBQUM7UUFDMUIsZUFBVSxHQUFXLE1BQU0sQ0FBQztRQUM1QixnQkFBVyxHQUFXLE1BQU0sQ0FBQztRQUM3QixZQUFPLEdBQVcsQ0FBQyxDQUFDO0lBeUJ0QixDQUFDO0lBckJDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7UUFFdEYsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO1lBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDNUM7SUFDSCxDQUFDO0lBRUQsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFO1FBQ3hCLE1BQU0sY0FBYyxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksY0FBYyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7WUFDbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMxQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNILENBQUM7OztZQXZGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4QlQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztxQkFFRSxLQUFLO21CQUNMLEtBQUs7d0JBQ0wsS0FBSzswQkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztvQkFDTCxLQUFLO2dDQUNMLEtBQUs7NkJBQ0wsS0FBSztzQkFDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSztnQ0FFTCxNQUFNOzZCQWFOLFNBQVMsU0FBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIFZpZXdDaGlsZCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgWEF4aXNUaWNrc0NvbXBvbmVudCB9IGZyb20gJy4veC1heGlzLXRpY2tzLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy14LWF4aXNdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnIFthdHRyLmNsYXNzXT1cInhBeGlzQ2xhc3NOYW1lXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLXgtYXhpcy10aWNrc1xyXG4gICAgICAgICpuZ0lmPVwieFNjYWxlXCJcclxuICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1UaWNrc1wiXHJcbiAgICAgICAgW3JvdGF0ZVRpY2tzXT1cInJvdGF0ZVRpY2tzXCJcclxuICAgICAgICBbbWF4VGlja0xlbmd0aF09XCJtYXhUaWNrTGVuZ3RoXCJcclxuICAgICAgICBbdGlja0Zvcm1hdHRpbmddPVwidGlja0Zvcm1hdHRpbmdcIlxyXG4gICAgICAgIFt0aWNrQXJndW1lbnRzXT1cInRpY2tBcmd1bWVudHNcIlxyXG4gICAgICAgIFt0aWNrU3Ryb2tlXT1cInRpY2tTdHJva2VcIlxyXG4gICAgICAgIFtzY2FsZV09XCJ4U2NhbGVcIlxyXG4gICAgICAgIFtvcmllbnRdPVwieE9yaWVudFwiXHJcbiAgICAgICAgW3Nob3dHcmlkTGluZXNdPVwic2hvd0dyaWRMaW5lc1wiXHJcbiAgICAgICAgW2dyaWRMaW5lSGVpZ2h0XT1cImRpbXMuaGVpZ2h0XCJcclxuICAgICAgICBbd2lkdGhdPVwiZGltcy53aWR0aFwiXHJcbiAgICAgICAgW3RpY2tWYWx1ZXNdPVwidGlja3NcIlxyXG4gICAgICAgIFthY3RpdmVUaW1lXT1cImFjdGl2ZVRpbWVcIlxyXG4gICAgICAgIChkaW1lbnNpb25zQ2hhbmdlZCk9XCJlbWl0VGlja3NIZWlnaHQoJGV2ZW50KVwiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtYXhpcy1sYWJlbFxyXG4gICAgICAgICpuZ0lmPVwic2hvd0xhYmVsXCJcclxuICAgICAgICBbbGFiZWxdPVwibGFiZWxUZXh0XCJcclxuICAgICAgICBbb2Zmc2V0XT1cImxhYmVsT2Zmc2V0XCJcclxuICAgICAgICBbb3JpZW50XT1cIidib3R0b20nXCJcclxuICAgICAgICBbaGVpZ2h0XT1cImRpbXMuaGVpZ2h0XCJcclxuICAgICAgICBbd2lkdGhdPVwiZGltcy53aWR0aFwiXHJcbiAgICAgID48L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBYQXhpc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgeFNjYWxlO1xyXG4gIEBJbnB1dCgpIGRpbXM7XHJcbiAgQElucHV0KCkgdHJpbVRpY2tzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVRpY2tzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBtYXhUaWNrTGVuZ3RoOiBudW1iZXI7XHJcbiAgQElucHV0KCkgdGlja0Zvcm1hdHRpbmc7XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lcyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHNob3dMYWJlbDtcclxuICBASW5wdXQoKSBsYWJlbFRleHQ7XHJcbiAgQElucHV0KCkgdGlja3M6IGFueVtdO1xyXG4gIEBJbnB1dCgpIHhBeGlzVGlja0ludGVydmFsO1xyXG4gIEBJbnB1dCgpIHhBeGlzVGlja0NvdW50OiBhbnk7XHJcbiAgQElucHV0KCkgeE9yaWVudDogc3RyaW5nID0gJ2JvdHRvbSc7XHJcbiAgQElucHV0KCkgeEF4aXNPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgQElucHV0KCkgYWN0aXZlVGltZTtcclxuXHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB4QXhpc0NsYXNzTmFtZTogc3RyaW5nID0gJ3ggYXhpcyc7XHJcblxyXG4gIHRpY2tBcmd1bWVudHM6IGFueTtcclxuICB0cmFuc2Zvcm06IGFueTtcclxuICBsYWJlbE9mZnNldDogbnVtYmVyID0gMDtcclxuICBmaWxsOiBzdHJpbmcgPSAnbm9uZSc7XHJcbiAgc3Ryb2tlOiBzdHJpbmcgPSAnc3Ryb2tlJztcclxuICB0aWNrU3Ryb2tlOiBzdHJpbmcgPSAnI2NjYyc7XHJcbiAgc3Ryb2tlV2lkdGg6IHN0cmluZyA9ICdub25lJztcclxuICBwYWRkaW5nOiBudW1iZXIgPSA1O1xyXG5cclxuICBAVmlld0NoaWxkKFhBeGlzVGlja3NDb21wb25lbnQpIHRpY2tzQ29tcG9uZW50OiBYQXhpc1RpY2tzQ29tcG9uZW50O1xyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAsJHt0aGlzLnhBeGlzT2Zmc2V0ICsgdGhpcy5wYWRkaW5nICsgdGhpcy5kaW1zLmhlaWdodH0pYDtcclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMueEF4aXNUaWNrQ291bnQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMudGlja0FyZ3VtZW50cyA9IFt0aGlzLnhBeGlzVGlja0NvdW50XTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVtaXRUaWNrc0hlaWdodCh7IGhlaWdodCB9KTogdm9pZCB7XHJcbiAgICBjb25zdCBuZXdMYWJlbE9mZnNldCA9IGhlaWdodCArIDI1ICsgNTtcclxuICAgIGlmIChuZXdMYWJlbE9mZnNldCAhPT0gdGhpcy5sYWJlbE9mZnNldCkge1xyXG4gICAgICB0aGlzLmxhYmVsT2Zmc2V0ID0gbmV3TGFiZWxPZmZzZXQ7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9uc0NoYW5nZWQuZW1pdCh7IGhlaWdodCB9KTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==