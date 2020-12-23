import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { select } from 'd3-selection';
export class LineComponent {
    constructor(element) {
        this.element = element;
        this.fill = 'none';
        this.animations = true;
        this.select = new EventEmitter();
        this.initialized = false;
    }
    ngOnChanges(changes) {
        if (!this.initialized) {
            this.initialized = true;
            this.initialPath = this.path;
        }
        else {
            this.updatePathEl();
        }
    }
    updatePathEl() {
        const node = select(this.element.nativeElement).select('.line');
        if (this.animations) {
            node.transition().duration(750).attr('d', this.path);
        }
        else {
            node.attr('d', this.path);
        }
    }
}
LineComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-line]',
                template: `
    <svg:path
      [@animationState]="'active'"
      class="line"
      [attr.d]="initialPath"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      stroke-width="1.5px"
    />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':enter', [
                            style({
                                strokeDasharray: 2000,
                                strokeDashoffset: 2000
                            }),
                            animate(1000, style({
                                strokeDashoffset: 0
                            }))
                        ])
                    ])
                ]
            },] }
];
LineComponent.ctorParameters = () => [
    { type: ElementRef }
];
LineComponent.propDecorators = {
    path: [{ type: Input }],
    stroke: [{ type: Input }],
    data: [{ type: Input }],
    fill: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbGluZS1jaGFydC9saW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUVaLFVBQVUsRUFDVix1QkFBdUIsRUFFeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFnQ3RDLE1BQU0sT0FBTyxhQUFhO0lBWXhCLFlBQW9CLE9BQW1CO1FBQW5CLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFSOUIsU0FBSSxHQUFXLE1BQU0sQ0FBQztRQUN0QixlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXRDLGdCQUFXLEdBQVksS0FBSyxDQUFDO0lBR2EsQ0FBQztJQUUzQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzlCO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsWUFBWTtRQUNWLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVoRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0RDthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7O1lBN0RGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUU7Ozs7Ozs7OztHQVNUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxVQUFVLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLGdCQUFnQixFQUFFO3dCQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFOzRCQUNuQixLQUFLLENBQUM7Z0NBQ0osZUFBZSxFQUFFLElBQUk7Z0NBQ3JCLGdCQUFnQixFQUFFLElBQUk7NkJBQ3ZCLENBQUM7NEJBQ0YsT0FBTyxDQUNMLElBQUksRUFDSixLQUFLLENBQUM7Z0NBQ0osZ0JBQWdCLEVBQUUsQ0FBQzs2QkFDcEIsQ0FBQyxDQUNIO3lCQUNGLENBQUM7cUJBQ0gsQ0FBQztpQkFDSDthQUNGOzs7WUFwQ0MsVUFBVTs7O21CQXNDVCxLQUFLO3FCQUNMLEtBQUs7bUJBQ0wsS0FBSzttQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgYW5pbWF0ZSwgdHJhbnNpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMy1zZWxlY3Rpb24nO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtbGluZV0nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOnBhdGhcclxuICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiXHJcbiAgICAgIGNsYXNzPVwibGluZVwiXHJcbiAgICAgIFthdHRyLmRdPVwiaW5pdGlhbFBhdGhcIlxyXG4gICAgICBbYXR0ci5maWxsXT1cImZpbGxcIlxyXG4gICAgICBbYXR0ci5zdHJva2VdPVwic3Ryb2tlXCJcclxuICAgICAgc3Ryb2tlLXdpZHRoPVwiMS41cHhcIlxyXG4gICAgLz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIGFuaW1hdGlvbnM6IFtcclxuICAgIHRyaWdnZXIoJ2FuaW1hdGlvblN0YXRlJywgW1xyXG4gICAgICB0cmFuc2l0aW9uKCc6ZW50ZXInLCBbXHJcbiAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgc3Ryb2tlRGFzaGFycmF5OiAyMDAwLFxyXG4gICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldDogMjAwMFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGFuaW1hdGUoXHJcbiAgICAgICAgICAxMDAwLFxyXG4gICAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgICBzdHJva2VEYXNob2Zmc2V0OiAwXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIClcclxuICAgICAgXSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgcGF0aDtcclxuICBASW5wdXQoKSBzdHJva2U7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSBmaWxsOiBzdHJpbmcgPSAnbm9uZSc7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgaW5pdGlhbFBhdGg6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmKSB7fVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuaW5pdGlhbFBhdGggPSB0aGlzLnBhdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZVBhdGhFbCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGF0aEVsKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkuc2VsZWN0KCcubGluZScpO1xyXG5cclxuICAgIGlmICh0aGlzLmFuaW1hdGlvbnMpIHtcclxuICAgICAgbm9kZS50cmFuc2l0aW9uKCkuZHVyYXRpb24oNzUwKS5hdHRyKCdkJywgdGhpcy5wYXRoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5vZGUuYXR0cignZCcsIHRoaXMucGF0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==