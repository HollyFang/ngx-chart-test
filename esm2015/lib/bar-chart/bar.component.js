import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { select } from 'd3-selection';
import { roundedRect } from '../common/shape.helper';
import { id } from '../utils/id';
export class BarComponent {
    constructor(element) {
        this.roundEdges = true;
        this.gradient = false;
        this.offset = 0;
        this.isActive = false;
        this.animations = true;
        this.noBarWhenZero = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.hasGradient = false;
        this.hideBar = false;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        if (changes.roundEdges) {
            this.loadAnimation();
        }
        this.update();
    }
    update() {
        this.gradientId = 'grad' + id().toString();
        this.gradientFill = `url(#${this.gradientId})`;
        if (this.gradient || this.stops) {
            this.gradientStops = this.getGradient();
            this.hasGradient = true;
        }
        else {
            this.hasGradient = false;
        }
        this.updatePathEl();
        this.checkToHideBar();
    }
    loadAnimation() {
        this.path = this.getStartingPath();
        setTimeout(this.update.bind(this), 100);
    }
    updatePathEl() {
        const node = select(this.element).select('.bar');
        const path = this.getPath();
        if (this.animations) {
            node.transition().duration(500).attr('d', path);
        }
        else {
            node.attr('d', path);
        }
    }
    getGradient() {
        if (this.stops) {
            return this.stops;
        }
        return [
            {
                offset: 0,
                color: this.fill,
                opacity: this.getStartOpacity()
            },
            {
                offset: 100,
                color: this.fill,
                opacity: 1
            }
        ];
    }
    getStartingPath() {
        if (!this.animations) {
            return this.getPath();
        }
        let radius = this.getRadius();
        let path;
        if (this.roundEdges) {
            if (this.orientation === 'vertical') {
                radius = Math.min(this.height, radius);
                path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
            }
            else if (this.orientation === 'horizontal') {
                radius = Math.min(this.width, radius);
                path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
            }
        }
        else {
            if (this.orientation === 'vertical') {
                path = roundedRect(this.x, this.y + this.height, this.width, 1, 0, this.edges);
            }
            else if (this.orientation === 'horizontal') {
                path = roundedRect(this.x, this.y, 1, this.height, 0, this.edges);
            }
        }
        return path;
    }
    getPath() {
        let radius = this.getRadius();
        let path;
        if (this.roundEdges) {
            if (this.orientation === 'vertical') {
                radius = Math.min(this.height, radius);
                path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
            }
            else if (this.orientation === 'horizontal') {
                radius = Math.min(this.width, radius);
                path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
            }
        }
        else {
            path = roundedRect(this.x, this.y, this.width, this.height, radius, this.edges);
        }
        return path;
    }
    getRadius() {
        let radius = 0;
        if (this.roundEdges && this.height > 5 && this.width > 5) {
            radius = Math.floor(Math.min(5, this.height / 2, this.width / 2));
        }
        return radius;
    }
    getStartOpacity() {
        if (this.roundEdges) {
            return 0.2;
        }
        else {
            return 0.5;
        }
    }
    get edges() {
        let edges = [false, false, false, false];
        if (this.roundEdges) {
            if (this.orientation === 'vertical') {
                if (this.data.value > 0) {
                    edges = [true, true, false, false];
                }
                else {
                    edges = [false, false, true, true];
                }
            }
            else if (this.orientation === 'horizontal') {
                if (this.data.value > 0) {
                    edges = [false, true, false, true];
                }
                else {
                    edges = [true, false, true, false];
                }
            }
        }
        return edges;
    }
    onMouseEnter() {
        this.activate.emit(this.data);
    }
    onMouseLeave() {
        this.deactivate.emit(this.data);
    }
    checkToHideBar() {
        this.hideBar =
            this.noBarWhenZero &&
                ((this.orientation === 'vertical' && this.height === 0) ||
                    (this.orientation === 'horizontal' && this.width === 0));
    }
}
BarComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-bar]',
                template: `
    <svg:defs *ngIf="hasGradient">
      <svg:g ngx-charts-svg-linear-gradient [orientation]="orientation" [name]="gradientId" [stops]="gradientStops" />
    </svg:defs>
    <svg:path
      class="bar"
      stroke="none"
      role="img"
      tabIndex="-1"
      [class.active]="isActive"
      [class.hidden]="hideBar"
      [attr.d]="path"
      [attr.aria-label]="ariaLabel"
      [attr.fill]="hasGradient ? gradientFill : fill"
      (click)="select.emit(data)"
    />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
BarComponent.ctorParameters = () => [
    { type: ElementRef }
];
BarComponent.propDecorators = {
    fill: [{ type: Input }],
    data: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    orientation: [{ type: Input }],
    roundEdges: [{ type: Input }],
    gradient: [{ type: Input }],
    offset: [{ type: Input }],
    isActive: [{ type: Input }],
    stops: [{ type: Input }],
    animations: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    noBarWhenZero: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9iYXItY2hhcnQvYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFlBQVksRUFDWixVQUFVLEVBR1YsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUEwQmpDLE1BQU0sT0FBTyxZQUFZO0lBOEJ2QixZQUFZLE9BQW1CO1FBdEJ0QixlQUFVLEdBQVksSUFBSSxDQUFDO1FBQzNCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFFMUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUU3QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVExQyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7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Q0FBQztvQkFDckQsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7O1lBbE5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQlQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQWhDQyxVQUFVOzs7bUJBa0NULEtBQUs7bUJBQ0wsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLOzBCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7dUJBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNOzJCQTJKTixZQUFZLFNBQUMsWUFBWTsyQkFLekIsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBFbGVtZW50UmVmLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XHJcbmltcG9ydCB7IHJvdW5kZWRSZWN0IH0gZnJvbSAnLi4vY29tbW9uL3NoYXBlLmhlbHBlcic7XHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vdXRpbHMvaWQnO1xyXG5cclxuLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lICovXHJcbmltcG9ydCB7IHRyYW5zaXRpb24gfSBmcm9tICdkMy10cmFuc2l0aW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWJhcl0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmRlZnMgKm5nSWY9XCJoYXNHcmFkaWVudFwiPlxyXG4gICAgICA8c3ZnOmcgbmd4LWNoYXJ0cy1zdmctbGluZWFyLWdyYWRpZW50IFtvcmllbnRhdGlvbl09XCJvcmllbnRhdGlvblwiIFtuYW1lXT1cImdyYWRpZW50SWRcIiBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiIC8+XHJcbiAgICA8L3N2ZzpkZWZzPlxyXG4gICAgPHN2ZzpwYXRoXHJcbiAgICAgIGNsYXNzPVwiYmFyXCJcclxuICAgICAgc3Ryb2tlPVwibm9uZVwiXHJcbiAgICAgIHJvbGU9XCJpbWdcIlxyXG4gICAgICB0YWJJbmRleD1cIi0xXCJcclxuICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZVwiXHJcbiAgICAgIFtjbGFzcy5oaWRkZW5dPVwiaGlkZUJhclwiXHJcbiAgICAgIFthdHRyLmRdPVwicGF0aFwiXHJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcclxuICAgICAgW2F0dHIuZmlsbF09XCJoYXNHcmFkaWVudCA/IGdyYWRpZW50RmlsbCA6IGZpbGxcIlxyXG4gICAgICAoY2xpY2spPVwic2VsZWN0LmVtaXQoZGF0YSlcIlxyXG4gICAgLz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIGZpbGw7XHJcbiAgQElucHV0KCkgZGF0YTogYW55O1xyXG4gIEBJbnB1dCgpIHdpZHRoOiBudW1iZXI7XHJcbiAgQElucHV0KCkgaGVpZ2h0OiBudW1iZXI7XHJcbiAgQElucHV0KCkgeDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHk6IG51bWJlcjtcclxuICBASW5wdXQoKSBvcmllbnRhdGlvbjtcclxuICBASW5wdXQoKSByb3VuZEVkZ2VzOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIG9mZnNldCA9IDA7XHJcbiAgQElucHV0KCkgaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBzdG9wczogYW55W107XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgYXJpYUxhYmVsOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgbm9CYXJXaGVuWmVybzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBlbGVtZW50OiBhbnk7XHJcbiAgcGF0aDogYW55O1xyXG4gIGdyYWRpZW50SWQ6IGFueTtcclxuICBncmFkaWVudEZpbGw6IGFueTtcclxuICBzdGFydE9wYWNpdHk6IGFueTtcclxuICBncmFkaWVudFN0b3BzOiBhbnlbXTtcclxuICBoYXNHcmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGhpZGVCYXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYgKGNoYW5nZXMucm91bmRFZGdlcykge1xyXG4gICAgICB0aGlzLmxvYWRBbmltYXRpb24oKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdyYWRpZW50SWQgPSAnZ3JhZCcgKyBpZCgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLmdyYWRpZW50RmlsbCA9IGB1cmwoIyR7dGhpcy5ncmFkaWVudElkfSlgO1xyXG5cclxuICAgIGlmICh0aGlzLmdyYWRpZW50IHx8IHRoaXMuc3RvcHMpIHtcclxuICAgICAgdGhpcy5ncmFkaWVudFN0b3BzID0gdGhpcy5nZXRHcmFkaWVudCgpO1xyXG4gICAgICB0aGlzLmhhc0dyYWRpZW50ID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaGFzR3JhZGllbnQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVBhdGhFbCgpO1xyXG4gICAgdGhpcy5jaGVja1RvSGlkZUJhcigpO1xyXG4gIH1cclxuXHJcbiAgbG9hZEFuaW1hdGlvbigpOiB2b2lkIHtcclxuICAgIHRoaXMucGF0aCA9IHRoaXMuZ2V0U3RhcnRpbmdQYXRoKCk7XHJcbiAgICBzZXRUaW1lb3V0KHRoaXMudXBkYXRlLmJpbmQodGhpcyksIDEwMCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVQYXRoRWwoKTogdm9pZCB7XHJcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuYmFyJyk7XHJcbiAgICBjb25zdCBwYXRoID0gdGhpcy5nZXRQYXRoKCk7XHJcbiAgICBpZiAodGhpcy5hbmltYXRpb25zKSB7XHJcbiAgICAgIG5vZGUudHJhbnNpdGlvbigpLmR1cmF0aW9uKDUwMCkuYXR0cignZCcsIHBhdGgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm9kZS5hdHRyKCdkJywgcGF0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRHcmFkaWVudCgpIHtcclxuICAgIGlmICh0aGlzLnN0b3BzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN0b3BzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBvZmZzZXQ6IDAsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuZmlsbCxcclxuICAgICAgICBvcGFjaXR5OiB0aGlzLmdldFN0YXJ0T3BhY2l0eSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvZmZzZXQ6IDEwMCxcclxuICAgICAgICBjb2xvcjogdGhpcy5maWxsLFxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgfVxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIGdldFN0YXJ0aW5nUGF0aCgpIHtcclxuICAgIGlmICghdGhpcy5hbmltYXRpb25zKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFBhdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmFkaXVzID0gdGhpcy5nZXRSYWRpdXMoKTtcclxuICAgIGxldCBwYXRoO1xyXG5cclxuICAgIGlmICh0aGlzLnJvdW5kRWRnZXMpIHtcclxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICByYWRpdXMgPSBNYXRoLm1pbih0aGlzLmhlaWdodCwgcmFkaXVzKTtcclxuICAgICAgICBwYXRoID0gcm91bmRlZFJlY3QodGhpcy54LCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgMSwgMCwgdGhpcy5lZGdlcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgcmFkaXVzID0gTWF0aC5taW4odGhpcy53aWR0aCwgcmFkaXVzKTtcclxuICAgICAgICBwYXRoID0gcm91bmRlZFJlY3QodGhpcy54LCB0aGlzLnksIDEsIHRoaXMuaGVpZ2h0LCAwLCB0aGlzLmVkZ2VzKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICBwYXRoID0gcm91bmRlZFJlY3QodGhpcy54LCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgdGhpcy53aWR0aCwgMSwgMCwgdGhpcy5lZGdlcyk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XHJcbiAgICAgICAgcGF0aCA9IHJvdW5kZWRSZWN0KHRoaXMueCwgdGhpcy55LCAxLCB0aGlzLmhlaWdodCwgMCwgdGhpcy5lZGdlcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIGdldFBhdGgoKSB7XHJcbiAgICBsZXQgcmFkaXVzID0gdGhpcy5nZXRSYWRpdXMoKTtcclxuICAgIGxldCBwYXRoO1xyXG5cclxuICAgIGlmICh0aGlzLnJvdW5kRWRnZXMpIHtcclxuICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICByYWRpdXMgPSBNYXRoLm1pbih0aGlzLmhlaWdodCwgcmFkaXVzKTtcclxuICAgICAgICBwYXRoID0gcm91bmRlZFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCByYWRpdXMsIHRoaXMuZWRnZXMpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgIHJhZGl1cyA9IE1hdGgubWluKHRoaXMud2lkdGgsIHJhZGl1cyk7XHJcbiAgICAgICAgcGF0aCA9IHJvdW5kZWRSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgcmFkaXVzLCB0aGlzLmVkZ2VzKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGF0aCA9IHJvdW5kZWRSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgcmFkaXVzLCB0aGlzLmVkZ2VzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGF0aDtcclxuICB9XHJcblxyXG4gIGdldFJhZGl1cygpOiBudW1iZXIge1xyXG4gICAgbGV0IHJhZGl1cyA9IDA7XHJcblxyXG4gICAgaWYgKHRoaXMucm91bmRFZGdlcyAmJiB0aGlzLmhlaWdodCA+IDUgJiYgdGhpcy53aWR0aCA+IDUpIHtcclxuICAgICAgcmFkaXVzID0gTWF0aC5mbG9vcihNYXRoLm1pbig1LCB0aGlzLmhlaWdodCAvIDIsIHRoaXMud2lkdGggLyAyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJhZGl1cztcclxuICB9XHJcblxyXG4gIGdldFN0YXJ0T3BhY2l0eSgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMucm91bmRFZGdlcykge1xyXG4gICAgICByZXR1cm4gMC4yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDAuNTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldCBlZGdlcygpIHtcclxuICAgIGxldCBlZGdlcyA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV07XHJcbiAgICBpZiAodGhpcy5yb3VuZEVkZ2VzKSB7XHJcbiAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS52YWx1ZSA+IDApIHtcclxuICAgICAgICAgIGVkZ2VzID0gW3RydWUsIHRydWUsIGZhbHNlLCBmYWxzZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVkZ2VzID0gW2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICBlZGdlcyA9IFtmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlZGdlcyA9IFt0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVkZ2VzO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXHJcbiAgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcclxuICBvbk1vdXNlTGVhdmUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh0aGlzLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja1RvSGlkZUJhcigpIHtcclxuICAgIHRoaXMuaGlkZUJhciA9XHJcbiAgICAgIHRoaXMubm9CYXJXaGVuWmVybyAmJlxyXG4gICAgICAoKHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgJiYgdGhpcy5oZWlnaHQgPT09IDApIHx8XHJcbiAgICAgICAgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyAmJiB0aGlzLndpZHRoID09PSAwKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==