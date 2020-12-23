import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
export class CircleComponent {
    constructor() {
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
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
    ngOnChanges(changes) {
        this.classNames = Array.isArray(this.classNames) ? this.classNames.join(' ') : '';
        this.classNames += 'circle';
    }
}
CircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-circle]',
                template: `
    <svg:circle
      [attr.cx]="cx"
      [attr.cy]="cy"
      [attr.r]="r"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      [attr.opacity]="circleOpacity"
      [attr.class]="classNames"
      [attr.pointer-events]="pointerEvents"
    />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
CircleComponent.propDecorators = {
    cx: [{ type: Input }],
    cy: [{ type: Input }],
    r: [{ type: Input }],
    fill: [{ type: Input }],
    stroke: [{ type: Input }],
    data: [{ type: Input }],
    classNames: [{ type: Input }],
    circleOpacity: [{ type: Input }],
    pointerEvents: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click',] }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vY2lyY2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxNQUFNLEVBQ04sWUFBWSxFQUVaLHVCQUF1QixFQUN2QixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFrQnZCLE1BQU0sT0FBTyxlQUFlO0lBaEI1QjtRQTJCWSxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQXFCNUMsQ0FBQztJQWxCQyxPQUFPO1FBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRixJQUFJLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztJQUM5QixDQUFDOzs7WUFqREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O2lCQUVFLEtBQUs7aUJBQ0wsS0FBSztnQkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSzttQkFDTCxLQUFLO3lCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNO3NCQUVOLFlBQVksU0FBQyxPQUFPOzJCQUtwQixZQUFZLFNBQUMsWUFBWTsyQkFLekIsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIEhvc3RMaXN0ZW5lclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtY2lyY2xlXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6Y2lyY2xlXHJcbiAgICAgIFthdHRyLmN4XT1cImN4XCJcclxuICAgICAgW2F0dHIuY3ldPVwiY3lcIlxyXG4gICAgICBbYXR0ci5yXT1cInJcIlxyXG4gICAgICBbYXR0ci5maWxsXT1cImZpbGxcIlxyXG4gICAgICBbYXR0ci5zdHJva2VdPVwic3Ryb2tlXCJcclxuICAgICAgW2F0dHIub3BhY2l0eV09XCJjaXJjbGVPcGFjaXR5XCJcclxuICAgICAgW2F0dHIuY2xhc3NdPVwiY2xhc3NOYW1lc1wiXHJcbiAgICAgIFthdHRyLnBvaW50ZXItZXZlbnRzXT1cInBvaW50ZXJFdmVudHNcIlxyXG4gICAgLz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDaXJjbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIGN4O1xyXG4gIEBJbnB1dCgpIGN5O1xyXG4gIEBJbnB1dCgpIHI7XHJcbiAgQElucHV0KCkgZmlsbDtcclxuICBASW5wdXQoKSBzdHJva2U7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSBjbGFzc05hbWVzO1xyXG4gIEBJbnB1dCgpIGNpcmNsZU9wYWNpdHk7XHJcbiAgQElucHV0KCkgcG9pbnRlckV2ZW50cztcclxuXHJcbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcclxuICBvbkNsaWNrKCkge1xyXG4gICAgdGhpcy5zZWxlY3QuZW1pdCh0aGlzLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXHJcbiAgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xyXG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcclxuICBvbk1vdXNlTGVhdmUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh0aGlzLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy5jbGFzc05hbWVzID0gQXJyYXkuaXNBcnJheSh0aGlzLmNsYXNzTmFtZXMpID8gdGhpcy5jbGFzc05hbWVzLmpvaW4oJyAnKSA6ICcnO1xyXG4gICAgdGhpcy5jbGFzc05hbWVzICs9ICdjaXJjbGUnO1xyXG4gIH1cclxufVxyXG4iXX0=