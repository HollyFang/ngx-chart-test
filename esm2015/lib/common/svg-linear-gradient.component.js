import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
export class SvgLinearGradientComponent {
    constructor() {
        this.orientation = 'vertical';
    }
    ngOnChanges(changes) {
        this.x1 = '0%';
        this.x2 = '0%';
        this.y1 = '0%';
        this.y2 = '0%';
        if (this.orientation === 'horizontal') {
            this.x2 = '100%';
        }
        else if (this.orientation === 'vertical') {
            this.y1 = '100%';
        }
    }
}
SvgLinearGradientComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-svg-linear-gradient]',
                template: `
    <svg:linearGradient [id]="name" [attr.x1]="x1" [attr.y1]="y1" [attr.x2]="x2" [attr.y2]="y2">
      <svg:stop
        *ngFor="let stop of stops"
        [attr.offset]="stop.offset + '%'"
        [style.stop-color]="stop.color"
        [style.stop-opacity]="stop.opacity"
      />
    </svg:linearGradient>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
SvgLinearGradientComponent.propDecorators = {
    orientation: [{ type: Input }],
    name: [{ type: Input }],
    stops: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLWxpbmVhci1ncmFkaWVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL3N2Zy1saW5lYXItZ3JhZGllbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0Qix1QkFBdUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWdCcEcsTUFBTSxPQUFPLDBCQUEwQjtJQWR2QztRQWVXLGdCQUFXLEdBQUcsVUFBVSxDQUFDO0lBcUJwQyxDQUFDO0lBWkMsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDZixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNmLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRWYsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFlBQVksRUFBRTtZQUNyQyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNsQjthQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7WUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDbEI7SUFDSCxDQUFDOzs7WUFuQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQ0FBbUM7Z0JBQzdDLFFBQVEsRUFBRTs7Ozs7Ozs7O0dBU1Q7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OzswQkFFRSxLQUFLO21CQUNMLEtBQUs7b0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXN2Zy1saW5lYXItZ3JhZGllbnRdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpsaW5lYXJHcmFkaWVudCBbaWRdPVwibmFtZVwiIFthdHRyLngxXT1cIngxXCIgW2F0dHIueTFdPVwieTFcIiBbYXR0ci54Ml09XCJ4MlwiIFthdHRyLnkyXT1cInkyXCI+XHJcbiAgICAgIDxzdmc6c3RvcFxyXG4gICAgICAgICpuZ0Zvcj1cImxldCBzdG9wIG9mIHN0b3BzXCJcclxuICAgICAgICBbYXR0ci5vZmZzZXRdPVwic3RvcC5vZmZzZXQgKyAnJSdcIlxyXG4gICAgICAgIFtzdHlsZS5zdG9wLWNvbG9yXT1cInN0b3AuY29sb3JcIlxyXG4gICAgICAgIFtzdHlsZS5zdG9wLW9wYWNpdHldPVwic3RvcC5vcGFjaXR5XCJcclxuICAgICAgLz5cclxuICAgIDwvc3ZnOmxpbmVhckdyYWRpZW50PlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFN2Z0xpbmVhckdyYWRpZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBvcmllbnRhdGlvbiA9ICd2ZXJ0aWNhbCc7XHJcbiAgQElucHV0KCkgbmFtZTtcclxuICBASW5wdXQoKSBzdG9wczogYW55W107XHJcblxyXG4gIHgxOiBhbnk7XHJcbiAgeDI6IGFueTtcclxuICB5MTogYW55O1xyXG4gIHkyOiBhbnk7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMueDEgPSAnMCUnO1xyXG4gICAgdGhpcy54MiA9ICcwJSc7XHJcbiAgICB0aGlzLnkxID0gJzAlJztcclxuICAgIHRoaXMueTIgPSAnMCUnO1xyXG5cclxuICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcclxuICAgICAgdGhpcy54MiA9ICcxMDAlJztcclxuICAgIH0gZWxzZSBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICB0aGlzLnkxID0gJzEwMCUnO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=