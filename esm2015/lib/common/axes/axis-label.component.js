import { Component, Input, ElementRef, ChangeDetectionStrategy } from '@angular/core';
export class AxisLabelComponent {
    constructor(element) {
        this.textHeight = 25;
        this.margin = 5;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.strokeWidth = '0.01';
        this.textAnchor = 'middle';
        this.transform = '';
        switch (this.orient) {
            case 'top':
                this.y = this.offset;
                this.x = this.width / 2;
                break;
            case 'bottom':
                this.y = this.offset;
                this.x = this.width / 2;
                break;
            case 'left':
                this.y = -(this.offset + this.textHeight + this.margin);
                this.x = -this.height / 2;
                this.transform = 'rotate(270)';
                break;
            case 'right':
                this.y = this.offset + this.margin;
                this.x = -this.height / 2;
                this.transform = 'rotate(270)';
                break;
            default:
        }
    }
}
AxisLabelComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-axis-label]',
                template: `
    <svg:text
      [attr.stroke-width]="strokeWidth"
      [attr.x]="x"
      [attr.y]="y"
      [attr.text-anchor]="textAnchor"
      [attr.transform]="transform"
    >
      {{ label }}
    </svg:text>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
AxisLabelComponent.ctorParameters = () => [
    { type: ElementRef }
];
AxisLabelComponent.propDecorators = {
    orient: [{ type: Input }],
    label: [{ type: Input }],
    offset: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpcy1sYWJlbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL2F4ZXMvYXhpcy1sYWJlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUE0Qix1QkFBdUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWlCaEgsTUFBTSxPQUFPLGtCQUFrQjtJQWdCN0IsWUFBWSxPQUFtQjtRQUgvQixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHVCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVwQixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbkIsS0FBSyxLQUFLO2dCQUNSLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU07WUFDUixLQUFLLE1BQU07Z0JBQ1QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztnQkFDL0IsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDbkMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztnQkFDL0IsTUFBTTtZQUNSLFFBQVE7U0FDVDtJQUNILENBQUM7OztZQWpFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsUUFBUSxFQUFFOzs7Ozs7Ozs7O0dBVVQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQWhCMEIsVUFBVTs7O3FCQWtCbEMsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgRWxlbWVudFJlZiwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtYXhpcy1sYWJlbF0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOnRleHRcclxuICAgICAgW2F0dHIuc3Ryb2tlLXdpZHRoXT1cInN0cm9rZVdpZHRoXCJcclxuICAgICAgW2F0dHIueF09XCJ4XCJcclxuICAgICAgW2F0dHIueV09XCJ5XCJcclxuICAgICAgW2F0dHIudGV4dC1hbmNob3JdPVwidGV4dEFuY2hvclwiXHJcbiAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIlxyXG4gICAgPlxyXG4gICAgICB7eyBsYWJlbCB9fVxyXG4gICAgPC9zdmc6dGV4dD5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBeGlzTGFiZWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIG9yaWVudDtcclxuICBASW5wdXQoKSBsYWJlbDtcclxuICBASW5wdXQoKSBvZmZzZXQ7XHJcbiAgQElucHV0KCkgd2lkdGg7XHJcbiAgQElucHV0KCkgaGVpZ2h0O1xyXG5cclxuICB4OiBhbnk7XHJcbiAgeTogYW55O1xyXG4gIHRyYW5zZm9ybTogYW55O1xyXG4gIHN0cm9rZVdpZHRoOiBhbnk7XHJcbiAgdGV4dEFuY2hvcjogYW55O1xyXG4gIGVsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcbiAgdGV4dEhlaWdodCA9IDI1O1xyXG4gIG1hcmdpbiA9IDU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0cm9rZVdpZHRoID0gJzAuMDEnO1xyXG4gICAgdGhpcy50ZXh0QW5jaG9yID0gJ21pZGRsZSc7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9ICcnO1xyXG5cclxuICAgIHN3aXRjaCAodGhpcy5vcmllbnQpIHtcclxuICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLm9mZnNldDtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLm9mZnNldDtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLndpZHRoIC8gMjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgdGhpcy55ID0gLSh0aGlzLm9mZnNldCArIHRoaXMudGV4dEhlaWdodCArIHRoaXMubWFyZ2luKTtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gJ3JvdGF0ZSgyNzApJztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgIHRoaXMueSA9IHRoaXMub2Zmc2V0ICsgdGhpcy5tYXJnaW47XHJcbiAgICAgICAgdGhpcy54ID0gLXRoaXMuaGVpZ2h0IC8gMjtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9ICdyb3RhdGUoMjcwKSc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==