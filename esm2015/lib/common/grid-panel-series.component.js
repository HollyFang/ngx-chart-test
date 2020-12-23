import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
export class GridPanelSeriesComponent {
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.gridPanels = this.getGridPanels();
    }
    getGridPanels() {
        return this.data.map(d => {
            let offset;
            let width;
            let height;
            let x;
            let y;
            let className = 'odd';
            if (this.orient === 'vertical') {
                const position = this.xScale(d.name);
                const positionIndex = Number.parseInt((position / this.xScale.step()).toString(), 10);
                if (positionIndex % 2 === 1) {
                    className = 'even';
                }
                offset = this.xScale.bandwidth() * this.xScale.paddingInner();
                width = this.xScale.bandwidth() + offset;
                height = this.dims.height;
                x = this.xScale(d.name) - offset / 2;
                y = 0;
            }
            else if (this.orient === 'horizontal') {
                const position = this.yScale(d.name);
                const positionIndex = Number.parseInt((position / this.yScale.step()).toString(), 10);
                if (positionIndex % 2 === 1) {
                    className = 'even';
                }
                offset = this.yScale.bandwidth() * this.yScale.paddingInner();
                width = this.dims.width;
                height = this.yScale.bandwidth() + offset;
                x = 0;
                y = this.yScale(d.name) - offset / 2;
            }
            return {
                name: d.name,
                class: className,
                height,
                width,
                x,
                y
            };
        });
    }
}
GridPanelSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-grid-panel-series]',
                template: `
    <svg:g
      ngx-charts-grid-panel
      *ngFor="let gridPanel of gridPanels"
      [height]="gridPanel.height"
      [width]="gridPanel.width"
      [x]="gridPanel.x"
      [y]="gridPanel.y"
      [class.grid-panel]="true"
      [class.odd]="gridPanel.class === 'odd'"
      [class.even]="gridPanel.class === 'even'"
    ></svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
GridPanelSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    dims: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    orient: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1wYW5lbC1zZXJpZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi9ncmlkLXBhbmVsLXNlcmllcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsS0FBSyxFQUFhLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBbUJwRyxNQUFNLE9BQU8sd0JBQXdCO0lBa0JuQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLElBQUksTUFBTSxDQUFDO1lBQ1gsSUFBSSxLQUFLLENBQUM7WUFDVixJQUFJLE1BQU0sQ0FBQztZQUNYLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFFdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDOUIsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdDLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUV0RixJQUFJLGFBQWEsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMzQixTQUFTLEdBQUcsTUFBTSxDQUFDO2lCQUNwQjtnQkFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUM5RCxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxNQUFNLENBQUM7Z0JBQ3pDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDMUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ3JDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDUDtpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssWUFBWSxFQUFFO2dCQUN2QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRXRGLElBQUksYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQzNCLFNBQVMsR0FBRyxNQUFNLENBQUM7aUJBQ3BCO2dCQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRTlELEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDeEIsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsTUFBTSxDQUFDO2dCQUMxQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNOLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsT0FBTztnQkFDTCxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7Z0JBQ1osS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLE1BQU07Z0JBQ04sS0FBSztnQkFDTCxDQUFDO2dCQUNELENBQUM7YUFDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUF4RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQ0FBaUM7Z0JBQzNDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7O0dBWVQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OzttQkFJRSxLQUFLO21CQUdMLEtBQUs7cUJBR0wsS0FBSztxQkFHTCxLQUFLO3FCQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFNpbXBsZUNoYW5nZXMsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1ncmlkLXBhbmVsLXNlcmllc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmdcclxuICAgICAgbmd4LWNoYXJ0cy1ncmlkLXBhbmVsXHJcbiAgICAgICpuZ0Zvcj1cImxldCBncmlkUGFuZWwgb2YgZ3JpZFBhbmVsc1wiXHJcbiAgICAgIFtoZWlnaHRdPVwiZ3JpZFBhbmVsLmhlaWdodFwiXHJcbiAgICAgIFt3aWR0aF09XCJncmlkUGFuZWwud2lkdGhcIlxyXG4gICAgICBbeF09XCJncmlkUGFuZWwueFwiXHJcbiAgICAgIFt5XT1cImdyaWRQYW5lbC55XCJcclxuICAgICAgW2NsYXNzLmdyaWQtcGFuZWxdPVwidHJ1ZVwiXHJcbiAgICAgIFtjbGFzcy5vZGRdPVwiZ3JpZFBhbmVsLmNsYXNzID09PSAnb2RkJ1wiXHJcbiAgICAgIFtjbGFzcy5ldmVuXT1cImdyaWRQYW5lbC5jbGFzcyA9PT0gJ2V2ZW4nXCJcclxuICAgID48L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIEdyaWRQYW5lbFNlcmllc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgZ3JpZFBhbmVsczogYW55W107XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgZGF0YTtcclxuXHJcbiAgQElucHV0KClcclxuICBkaW1zO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHhTY2FsZTtcclxuXHJcbiAgQElucHV0KClcclxuICB5U2NhbGU7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgb3JpZW50O1xyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5ncmlkUGFuZWxzID0gdGhpcy5nZXRHcmlkUGFuZWxzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRHcmlkUGFuZWxzKCk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGEubWFwKGQgPT4ge1xyXG4gICAgICBsZXQgb2Zmc2V0O1xyXG4gICAgICBsZXQgd2lkdGg7XHJcbiAgICAgIGxldCBoZWlnaHQ7XHJcbiAgICAgIGxldCB4O1xyXG4gICAgICBsZXQgeTtcclxuICAgICAgbGV0IGNsYXNzTmFtZSA9ICdvZGQnO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3JpZW50ID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb246IG51bWJlciA9IHRoaXMueFNjYWxlKGQubmFtZSk7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25JbmRleCA9IE51bWJlci5wYXJzZUludCgocG9zaXRpb24gLyB0aGlzLnhTY2FsZS5zdGVwKCkpLnRvU3RyaW5nKCksIDEwKTtcclxuXHJcbiAgICAgICAgaWYgKHBvc2l0aW9uSW5kZXggJSAyID09PSAxKSB7XHJcbiAgICAgICAgICBjbGFzc05hbWUgPSAnZXZlbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9mZnNldCA9IHRoaXMueFNjYWxlLmJhbmR3aWR0aCgpICogdGhpcy54U2NhbGUucGFkZGluZ0lubmVyKCk7XHJcbiAgICAgICAgd2lkdGggPSB0aGlzLnhTY2FsZS5iYW5kd2lkdGgoKSArIG9mZnNldDtcclxuICAgICAgICBoZWlnaHQgPSB0aGlzLmRpbXMuaGVpZ2h0O1xyXG4gICAgICAgIHggPSB0aGlzLnhTY2FsZShkLm5hbWUpIC0gb2Zmc2V0IC8gMjtcclxuICAgICAgICB5ID0gMDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWVudCA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnlTY2FsZShkLm5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXggPSBOdW1iZXIucGFyc2VJbnQoKHBvc2l0aW9uIC8gdGhpcy55U2NhbGUuc3RlcCgpKS50b1N0cmluZygpLCAxMCk7XHJcblxyXG4gICAgICAgIGlmIChwb3NpdGlvbkluZGV4ICUgMiA9PT0gMSkge1xyXG4gICAgICAgICAgY2xhc3NOYW1lID0gJ2V2ZW4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvZmZzZXQgPSB0aGlzLnlTY2FsZS5iYW5kd2lkdGgoKSAqIHRoaXMueVNjYWxlLnBhZGRpbmdJbm5lcigpO1xyXG5cclxuICAgICAgICB3aWR0aCA9IHRoaXMuZGltcy53aWR0aDtcclxuICAgICAgICBoZWlnaHQgPSB0aGlzLnlTY2FsZS5iYW5kd2lkdGgoKSArIG9mZnNldDtcclxuICAgICAgICB4ID0gMDtcclxuICAgICAgICB5ID0gdGhpcy55U2NhbGUoZC5uYW1lKSAtIG9mZnNldCAvIDI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogZC5uYW1lLFxyXG4gICAgICAgIGNsYXNzOiBjbGFzc05hbWUsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIHdpZHRoLFxyXG4gICAgICAgIHgsXHJcbiAgICAgICAgeVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==