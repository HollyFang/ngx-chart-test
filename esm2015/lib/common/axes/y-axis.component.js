import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { YAxisTicksComponent } from './y-axis-ticks.component';
export class YAxisComponent {
    constructor() {
        this.showGridLines = false;
        this.yOrient = 'left';
        this.yAxisOffset = 0;
        this.dimensionsChanged = new EventEmitter();
        this.yAxisClassName = 'y axis';
        this.labelOffset = 15;
        this.fill = 'none';
        this.stroke = '#CCC';
        this.tickStroke = '#CCC';
        this.strokeWidth = 1;
        this.padding = 5;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.offset = -(this.yAxisOffset + this.padding);
        if (this.yOrient === 'right') {
            this.labelOffset = 65;
            this.transform = `translate(${this.offset + this.dims.width} , 0)`;
        }
        else {
            this.offset = this.offset;
            this.transform = `translate(${this.offset} , 0)`;
        }
        if (this.yAxisTickCount !== undefined) {
            this.tickArguments = [this.yAxisTickCount];
        }
    }
    emitTicksWidth({ width }) {
        if (width !== this.labelOffset && this.yOrient === 'right') {
            this.labelOffset = width + this.labelOffset;
            setTimeout(() => {
                this.dimensionsChanged.emit({ width });
            }, 0);
        }
        else if (width !== this.labelOffset) {
            this.labelOffset = width;
            setTimeout(() => {
                this.dimensionsChanged.emit({ width });
            }, 0);
        }
    }
}
YAxisComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-y-axis]',
                template: `
    <svg:g [attr.class]="yAxisClassName" [attr.transform]="transform">
      <svg:g
        ngx-charts-y-axis-ticks
        *ngIf="yScale"
        [trimTicks]="trimTicks"
        [maxTickLength]="maxTickLength"
        [tickFormatting]="tickFormatting"
        [tickArguments]="tickArguments"
        [tickValues]="ticks"
        [tickStroke]="tickStroke"
        [scale]="yScale"
        [orient]="yOrient"
        [showGridLines]="showGridLines"
        [gridLineWidth]="dims.width"
        [referenceLines]="referenceLines"
        [showRefLines]="showRefLines"
        [showRefLabels]="showRefLabels"
        [height]="dims.height"
        (dimensionsChanged)="emitTicksWidth($event)"
      />

      <svg:g
        ngx-charts-axis-label
        *ngIf="showLabel"
        [label]="labelText"
        [offset]="labelOffset"
        [orient]="yOrient"
        [height]="dims.height"
        [width]="dims.width"
      ></svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
YAxisComponent.propDecorators = {
    yScale: [{ type: Input }],
    dims: [{ type: Input }],
    trimTicks: [{ type: Input }],
    maxTickLength: [{ type: Input }],
    tickFormatting: [{ type: Input }],
    ticks: [{ type: Input }],
    showGridLines: [{ type: Input }],
    showLabel: [{ type: Input }],
    labelText: [{ type: Input }],
    yAxisTickInterval: [{ type: Input }],
    yAxisTickCount: [{ type: Input }],
    yOrient: [{ type: Input }],
    referenceLines: [{ type: Input }],
    showRefLines: [{ type: Input }],
    showRefLabels: [{ type: Input }],
    yAxisOffset: [{ type: Input }],
    dimensionsChanged: [{ type: Output }],
    ticksComponent: [{ type: ViewChild, args: [YAxisTicksComponent,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieS1heGlzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy95LWF4aXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBRVosU0FBUyxFQUVULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQXVDL0QsTUFBTSxPQUFPLGNBQWM7SUFyQzNCO1FBNENXLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBS3RCLFlBQU8sR0FBVyxNQUFNLENBQUM7UUFJekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDdkIsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVqRCxtQkFBYyxHQUFXLFFBQVEsQ0FBQztRQUlsQyxnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixTQUFJLEdBQVcsTUFBTSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxNQUFNLENBQUM7UUFDeEIsZUFBVSxHQUFXLE1BQU0sQ0FBQztRQUM1QixnQkFBVyxHQUFXLENBQUMsQ0FBQztRQUN4QixZQUFPLEdBQVcsQ0FBQyxDQUFDO0lBb0N0QixDQUFDO0lBaENDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLENBQUM7U0FDcEU7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFDO1NBQ2xEO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtZQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRTtRQUN0QixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1lBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDNUMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDUDthQUFNLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN6QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNILENBQUM7OztZQXBHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O3FCQUVFLEtBQUs7bUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSztvQkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO2dDQUNMLEtBQUs7NkJBQ0wsS0FBSztzQkFDTCxLQUFLOzZCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzBCQUNMLEtBQUs7Z0NBQ0wsTUFBTTs2QkFhTixTQUFTLFNBQUMsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBPbkNoYW5nZXMsXHJcbiAgVmlld0NoaWxkLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgWUF4aXNUaWNrc0NvbXBvbmVudCB9IGZyb20gJy4veS1heGlzLXRpY2tzLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy15LWF4aXNdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnIFthdHRyLmNsYXNzXT1cInlBeGlzQ2xhc3NOYW1lXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLXktYXhpcy10aWNrc1xyXG4gICAgICAgICpuZ0lmPVwieVNjYWxlXCJcclxuICAgICAgICBbdHJpbVRpY2tzXT1cInRyaW1UaWNrc1wiXHJcbiAgICAgICAgW21heFRpY2tMZW5ndGhdPVwibWF4VGlja0xlbmd0aFwiXHJcbiAgICAgICAgW3RpY2tGb3JtYXR0aW5nXT1cInRpY2tGb3JtYXR0aW5nXCJcclxuICAgICAgICBbdGlja0FyZ3VtZW50c109XCJ0aWNrQXJndW1lbnRzXCJcclxuICAgICAgICBbdGlja1ZhbHVlc109XCJ0aWNrc1wiXHJcbiAgICAgICAgW3RpY2tTdHJva2VdPVwidGlja1N0cm9rZVwiXHJcbiAgICAgICAgW3NjYWxlXT1cInlTY2FsZVwiXHJcbiAgICAgICAgW29yaWVudF09XCJ5T3JpZW50XCJcclxuICAgICAgICBbc2hvd0dyaWRMaW5lc109XCJzaG93R3JpZExpbmVzXCJcclxuICAgICAgICBbZ3JpZExpbmVXaWR0aF09XCJkaW1zLndpZHRoXCJcclxuICAgICAgICBbcmVmZXJlbmNlTGluZXNdPVwicmVmZXJlbmNlTGluZXNcIlxyXG4gICAgICAgIFtzaG93UmVmTGluZXNdPVwic2hvd1JlZkxpbmVzXCJcclxuICAgICAgICBbc2hvd1JlZkxhYmVsc109XCJzaG93UmVmTGFiZWxzXCJcclxuICAgICAgICBbaGVpZ2h0XT1cImRpbXMuaGVpZ2h0XCJcclxuICAgICAgICAoZGltZW5zaW9uc0NoYW5nZWQpPVwiZW1pdFRpY2tzV2lkdGgoJGV2ZW50KVwiXHJcbiAgICAgIC8+XHJcblxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLWF4aXMtbGFiZWxcclxuICAgICAgICAqbmdJZj1cInNob3dMYWJlbFwiXHJcbiAgICAgICAgW2xhYmVsXT1cImxhYmVsVGV4dFwiXHJcbiAgICAgICAgW29mZnNldF09XCJsYWJlbE9mZnNldFwiXHJcbiAgICAgICAgW29yaWVudF09XCJ5T3JpZW50XCJcclxuICAgICAgICBbaGVpZ2h0XT1cImRpbXMuaGVpZ2h0XCJcclxuICAgICAgICBbd2lkdGhdPVwiZGltcy53aWR0aFwiXHJcbiAgICAgID48L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBZQXhpc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgeVNjYWxlO1xyXG4gIEBJbnB1dCgpIGRpbXM7XHJcbiAgQElucHV0KCkgdHJpbVRpY2tzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIG1heFRpY2tMZW5ndGg6IG51bWJlcjtcclxuICBASW5wdXQoKSB0aWNrRm9ybWF0dGluZztcclxuICBASW5wdXQoKSB0aWNrczogYW55W107XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lcyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHNob3dMYWJlbDtcclxuICBASW5wdXQoKSBsYWJlbFRleHQ7XHJcbiAgQElucHV0KCkgeUF4aXNUaWNrSW50ZXJ2YWw7XHJcbiAgQElucHV0KCkgeUF4aXNUaWNrQ291bnQ6IGFueTtcclxuICBASW5wdXQoKSB5T3JpZW50OiBzdHJpbmcgPSAnbGVmdCc7XHJcbiAgQElucHV0KCkgcmVmZXJlbmNlTGluZXM7XHJcbiAgQElucHV0KCkgc2hvd1JlZkxpbmVzO1xyXG4gIEBJbnB1dCgpIHNob3dSZWZMYWJlbHM7XHJcbiAgQElucHV0KCkgeUF4aXNPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB5QXhpc0NsYXNzTmFtZTogc3RyaW5nID0gJ3kgYXhpcyc7XHJcbiAgdGlja0FyZ3VtZW50czogYW55O1xyXG4gIG9mZnNldDogYW55O1xyXG4gIHRyYW5zZm9ybTogYW55O1xyXG4gIGxhYmVsT2Zmc2V0OiBudW1iZXIgPSAxNTtcclxuICBmaWxsOiBzdHJpbmcgPSAnbm9uZSc7XHJcbiAgc3Ryb2tlOiBzdHJpbmcgPSAnI0NDQyc7XHJcbiAgdGlja1N0cm9rZTogc3RyaW5nID0gJyNDQ0MnO1xyXG4gIHN0cm9rZVdpZHRoOiBudW1iZXIgPSAxO1xyXG4gIHBhZGRpbmc6IG51bWJlciA9IDU7XHJcblxyXG4gIEBWaWV3Q2hpbGQoWUF4aXNUaWNrc0NvbXBvbmVudCkgdGlja3NDb21wb25lbnQ6IFlBeGlzVGlja3NDb21wb25lbnQ7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLm9mZnNldCA9IC0odGhpcy55QXhpc09mZnNldCArIHRoaXMucGFkZGluZyk7XHJcbiAgICBpZiAodGhpcy55T3JpZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICAgIHRoaXMubGFiZWxPZmZzZXQgPSA2NTtcclxuICAgICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5vZmZzZXQgKyB0aGlzLmRpbXMud2lkdGh9ICwgMClgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLm9mZnNldDtcclxuICAgICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5vZmZzZXR9ICwgMClgO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnlBeGlzVGlja0NvdW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy50aWNrQXJndW1lbnRzID0gW3RoaXMueUF4aXNUaWNrQ291bnRdO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW1pdFRpY2tzV2lkdGgoeyB3aWR0aCB9KTogdm9pZCB7XHJcbiAgICBpZiAod2lkdGggIT09IHRoaXMubGFiZWxPZmZzZXQgJiYgdGhpcy55T3JpZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICAgIHRoaXMubGFiZWxPZmZzZXQgPSB3aWR0aCArIHRoaXMubGFiZWxPZmZzZXQ7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9uc0NoYW5nZWQuZW1pdCh7IHdpZHRoIH0pO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0gZWxzZSBpZiAod2lkdGggIT09IHRoaXMubGFiZWxPZmZzZXQpIHtcclxuICAgICAgdGhpcy5sYWJlbE9mZnNldCA9IHdpZHRoO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2VkLmVtaXQoeyB3aWR0aCB9KTtcclxuICAgICAgfSwgMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==