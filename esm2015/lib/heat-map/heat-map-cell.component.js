import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { select } from 'd3-selection';
import { id } from '../utils/id';
export class HeatMapCellComponent {
    constructor(element) {
        this.gradient = false;
        this.animations = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.transform = `translate(${this.x} , ${this.y})`;
        this.startOpacity = 0.3;
        this.gradientId = 'grad' + id().toString();
        this.gradientUrl = `url(#${this.gradientId})`;
        this.gradientStops = this.getGradientStops();
        if (this.animations) {
            this.loadAnimation();
        }
    }
    getGradientStops() {
        return [
            {
                offset: 0,
                color: this.fill,
                opacity: this.startOpacity
            },
            {
                offset: 100,
                color: this.fill,
                opacity: 1
            }
        ];
    }
    loadAnimation() {
        const node = select(this.element).select('.cell');
        node.attr('opacity', 0);
        this.animateToCurrentForm();
    }
    animateToCurrentForm() {
        const node = select(this.element).select('.cell');
        node.transition().duration(750).attr('opacity', 1);
    }
    onClick() {
        this.select.emit(this.data);
    }
    onMouseEnter() {
        this.activate.emit(this.data);
    }
    onMouseLeave() {
        this.deactivate.emit(this.data);
    }
}
HeatMapCellComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-heat-map-cell]',
                template: `
    <svg:g [attr.transform]="transform" class="cell">
      <defs *ngIf="gradient">
        <svg:g ngx-charts-svg-linear-gradient orientation="vertical" [name]="gradientId" [stops]="gradientStops" />
      </defs>
      <svg:rect
        [attr.fill]="gradient ? gradientUrl : fill"
        rx="3"
        [attr.width]="width"
        [attr.height]="height"
        class="cell"
        style="cursor: pointer"
        (click)="onClick()"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
HeatMapCellComponent.ctorParameters = () => [
    { type: ElementRef }
];
HeatMapCellComponent.propDecorators = {
    fill: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    data: [{ type: Input }],
    label: [{ type: Input }],
    gradient: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhdC1tYXAtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvaGVhdC1tYXAvaGVhdC1tYXAtY2VsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixVQUFVLEVBRVYsdUJBQXVCLEVBQ3ZCLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXRDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFzQmpDLE1BQU0sT0FBTyxvQkFBb0I7SUF1Qi9CLFlBQVksT0FBbUI7UUFmdEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzVCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBV3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUVwRCxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxFQUFFLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFN0MsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxPQUFPO1lBQ0w7Z0JBQ0UsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDM0I7WUFDRDtnQkFDRSxNQUFNLEVBQUUsR0FBRztnQkFDWCxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsb0JBQW9CO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBR0QsWUFBWTtRQUNWLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFuR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0dBZVQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQTVCQyxVQUFVOzs7bUJBOEJULEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSzttQkFDTCxLQUFLO29CQUNMLEtBQUs7dUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNOzJCQTBETixZQUFZLFNBQUMsWUFBWTsyQkFLekIsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgRWxlbWVudFJlZixcclxuICBPbkNoYW5nZXMsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgSG9zdExpc3RlbmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XHJcblxyXG5pbXBvcnQgeyBpZCB9IGZyb20gJy4uL3V0aWxzL2lkJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWhlYXQtbWFwLWNlbGxdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm1cIiBjbGFzcz1cImNlbGxcIj5cclxuICAgICAgPGRlZnMgKm5nSWY9XCJncmFkaWVudFwiPlxyXG4gICAgICAgIDxzdmc6ZyBuZ3gtY2hhcnRzLXN2Zy1saW5lYXItZ3JhZGllbnQgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiIFtuYW1lXT1cImdyYWRpZW50SWRcIiBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiIC8+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPHN2ZzpyZWN0XHJcbiAgICAgICAgW2F0dHIuZmlsbF09XCJncmFkaWVudCA/IGdyYWRpZW50VXJsIDogZmlsbFwiXHJcbiAgICAgICAgcng9XCIzXCJcclxuICAgICAgICBbYXR0ci53aWR0aF09XCJ3aWR0aFwiXHJcbiAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImhlaWdodFwiXHJcbiAgICAgICAgY2xhc3M9XCJjZWxsXCJcclxuICAgICAgICBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiXHJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2soKVwiXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIEhlYXRNYXBDZWxsQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBmaWxsO1xyXG4gIEBJbnB1dCgpIHg7XHJcbiAgQElucHV0KCkgeTtcclxuICBASW5wdXQoKSB3aWR0aDtcclxuICBASW5wdXQoKSBoZWlnaHQ7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSBsYWJlbDtcclxuICBASW5wdXQoKSBncmFkaWVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgYWN0aXZlUmFuZ2U6IGFueVtdO1xyXG4gIHN0YXJ0T3BhY2l0eTogbnVtYmVyO1xyXG4gIGdyYWRpZW50SWQ6IHN0cmluZztcclxuICBncmFkaWVudFVybDogc3RyaW5nO1xyXG4gIGdyYWRpZW50U3RvcHM6IGFueVtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLnh9ICwgJHt0aGlzLnl9KWA7XHJcblxyXG4gICAgdGhpcy5zdGFydE9wYWNpdHkgPSAwLjM7XHJcbiAgICB0aGlzLmdyYWRpZW50SWQgPSAnZ3JhZCcgKyBpZCgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLmdyYWRpZW50VXJsID0gYHVybCgjJHt0aGlzLmdyYWRpZW50SWR9KWA7XHJcbiAgICB0aGlzLmdyYWRpZW50U3RvcHMgPSB0aGlzLmdldEdyYWRpZW50U3RvcHMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5hbmltYXRpb25zKSB7XHJcbiAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0R3JhZGllbnRTdG9wcygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBvZmZzZXQ6IDAsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuZmlsbCxcclxuICAgICAgICBvcGFjaXR5OiB0aGlzLnN0YXJ0T3BhY2l0eVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb2Zmc2V0OiAxMDAsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuZmlsbCxcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgIH1cclxuICAgIF07XHJcbiAgfVxyXG5cclxuICBsb2FkQW5pbWF0aW9uKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmNlbGwnKTtcclxuICAgIG5vZGUuYXR0cignb3BhY2l0eScsIDApO1xyXG4gICAgdGhpcy5hbmltYXRlVG9DdXJyZW50Rm9ybSgpO1xyXG4gIH1cclxuXHJcbiAgYW5pbWF0ZVRvQ3VycmVudEZvcm0oKTogdm9pZCB7XHJcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuY2VsbCcpO1xyXG5cclxuICAgIG5vZGUudHJhbnNpdGlvbigpLmR1cmF0aW9uKDc1MCkuYXR0cignb3BhY2l0eScsIDEpO1xyXG4gIH1cclxuXHJcbiAgb25DbGljaygpIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQodGhpcy5kYXRhKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxyXG4gIG9uTW91c2VFbnRlcigpOiB2b2lkIHtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh0aGlzLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpXHJcbiAgb25Nb3VzZUxlYXZlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5kZWFjdGl2YXRlLmVtaXQodGhpcy5kYXRhKTtcclxuICB9XHJcbn1cclxuIl19