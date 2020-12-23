import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
export class SvgRadialGradientComponent {
    constructor() {
        this.endOpacity = 1;
        this.cx = 0;
        this.cy = 0;
    }
    get stops() {
        return this.stopsInput || this.stopsDefault;
    }
    set stops(value) {
        this.stopsInput = value;
    }
    ngOnChanges(changes) {
        this.r = '30%';
        if ('color' in changes || 'startOpacity' in changes || 'endOpacity' in changes) {
            this.stopsDefault = [
                {
                    offset: 0,
                    color: this.color,
                    opacity: this.startOpacity
                },
                {
                    offset: 100,
                    color: this.color,
                    opacity: this.endOpacity
                }
            ];
        }
    }
}
SvgRadialGradientComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-svg-radial-gradient]',
                template: `
    <svg:radialGradient [id]="name" [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r" gradientUnits="userSpaceOnUse">
      <svg:stop
        *ngFor="let stop of stops"
        [attr.offset]="stop.offset + '%'"
        [style.stop-color]="stop.color"
        [style.stop-opacity]="stop.opacity"
      />
    </svg:radialGradient>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
SvgRadialGradientComponent.propDecorators = {
    color: [{ type: Input }],
    name: [{ type: Input }],
    startOpacity: [{ type: Input }],
    endOpacity: [{ type: Input }],
    cx: [{ type: Input }],
    cy: [{ type: Input }],
    stops: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ZnLXJhZGlhbC1ncmFkaWVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL3N2Zy1yYWRpYWwtZ3JhZGllbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFhLHVCQUF1QixFQUFpQixNQUFNLGVBQWUsQ0FBQztBQWdCcEcsTUFBTSxPQUFPLDBCQUEwQjtJQWR2QztRQWtCVyxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsT0FBRSxHQUFXLENBQUMsQ0FBQztRQUNmLE9BQUUsR0FBVyxDQUFDLENBQUM7SUFpQzFCLENBQUM7SUEvQkMsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQVk7UUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQU9ELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNmLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxjQUFjLElBQUksT0FBTyxJQUFJLFlBQVksSUFBSSxPQUFPLEVBQUU7WUFDOUUsSUFBSSxDQUFDLFlBQVksR0FBRztnQkFDbEI7b0JBQ0UsTUFBTSxFQUFFLENBQUM7b0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7aUJBQzNCO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxHQUFHO29CQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUN6QjthQUNGLENBQUM7U0FDSDtJQUNILENBQUM7OztZQXBERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1DQUFtQztnQkFDN0MsUUFBUSxFQUFFOzs7Ozs7Ozs7R0FTVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O29CQUVFLEtBQUs7bUJBQ0wsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7aUJBQ0wsS0FBSztpQkFDTCxLQUFLO29CQUVMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1zdmctcmFkaWFsLWdyYWRpZW50XScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6cmFkaWFsR3JhZGllbnQgW2lkXT1cIm5hbWVcIiBbYXR0ci5jeF09XCJjeFwiIFthdHRyLmN5XT1cImN5XCIgW2F0dHIucl09XCJyXCIgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCI+XHJcbiAgICAgIDxzdmc6c3RvcFxyXG4gICAgICAgICpuZ0Zvcj1cImxldCBzdG9wIG9mIHN0b3BzXCJcclxuICAgICAgICBbYXR0ci5vZmZzZXRdPVwic3RvcC5vZmZzZXQgKyAnJSdcIlxyXG4gICAgICAgIFtzdHlsZS5zdG9wLWNvbG9yXT1cInN0b3AuY29sb3JcIlxyXG4gICAgICAgIFtzdHlsZS5zdG9wLW9wYWNpdHldPVwic3RvcC5vcGFjaXR5XCJcclxuICAgICAgLz5cclxuICAgIDwvc3ZnOnJhZGlhbEdyYWRpZW50PlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFN2Z1JhZGlhbEdyYWRpZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBjb2xvcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcclxuICBASW5wdXQoKSBzdGFydE9wYWNpdHk6IG51bWJlcjtcclxuICBASW5wdXQoKSBlbmRPcGFjaXR5ID0gMTtcclxuICBASW5wdXQoKSBjeDogbnVtYmVyID0gMDtcclxuICBASW5wdXQoKSBjeTogbnVtYmVyID0gMDtcclxuXHJcbiAgQElucHV0KClcclxuICBnZXQgc3RvcHMoKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcHNJbnB1dCB8fCB0aGlzLnN0b3BzRGVmYXVsdDtcclxuICB9XHJcblxyXG4gIHNldCBzdG9wcyh2YWx1ZTogYW55W10pIHtcclxuICAgIHRoaXMuc3RvcHNJbnB1dCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcjogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHN0b3BzSW5wdXQ6IGFueVtdO1xyXG4gIHByaXZhdGUgc3RvcHNEZWZhdWx0OiBhbnlbXTtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy5yID0gJzMwJSc7XHJcbiAgICBpZiAoJ2NvbG9yJyBpbiBjaGFuZ2VzIHx8ICdzdGFydE9wYWNpdHknIGluIGNoYW5nZXMgfHwgJ2VuZE9wYWNpdHknIGluIGNoYW5nZXMpIHtcclxuICAgICAgdGhpcy5zdG9wc0RlZmF1bHQgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBvcGFjaXR5OiB0aGlzLnN0YXJ0T3BhY2l0eVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgb2Zmc2V0OiAxMDAsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIG9wYWNpdHk6IHRoaXMuZW5kT3BhY2l0eVxyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19