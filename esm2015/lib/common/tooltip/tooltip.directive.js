import { Directive, Input, Output, EventEmitter, HostListener, ViewContainerRef, Renderer2 } from '@angular/core';
import { PlacementTypes } from './position';
import { StyleTypes } from './style.type';
import { AlignmentTypes } from './alignment.type';
import { ShowTypes } from './show.type';
import { TooltipService } from './tooltip.service';
export class TooltipDirective {
    constructor(tooltipService, viewContainerRef, renderer) {
        this.tooltipService = tooltipService;
        this.viewContainerRef = viewContainerRef;
        this.renderer = renderer;
        this.tooltipCssClass = '';
        this.tooltipTitle = '';
        this.tooltipAppendToBody = true;
        this.tooltipSpacing = 10;
        this.tooltipDisabled = false;
        this.tooltipShowCaret = true;
        this.tooltipPlacement = PlacementTypes.top;
        this.tooltipAlignment = AlignmentTypes.center;
        this.tooltipType = StyleTypes.popover;
        this.tooltipCloseOnClickOutside = true;
        this.tooltipCloseOnMouseLeave = true;
        this.tooltipHideTimeout = 300;
        this.tooltipShowTimeout = 100;
        this.tooltipShowEvent = ShowTypes.all;
        this.tooltipImmediateExit = false;
        this.show = new EventEmitter();
        this.hide = new EventEmitter();
    }
    get listensForFocus() {
        return this.tooltipShowEvent === ShowTypes.all || this.tooltipShowEvent === ShowTypes.focus;
    }
    get listensForHover() {
        return this.tooltipShowEvent === ShowTypes.all || this.tooltipShowEvent === ShowTypes.mouseover;
    }
    ngOnDestroy() {
        this.hideTooltip(true);
    }
    onFocus() {
        if (this.listensForFocus) {
            this.showTooltip();
        }
    }
    onBlur() {
        if (this.listensForFocus) {
            this.hideTooltip(true);
        }
    }
    onMouseEnter() {
        if (this.listensForHover) {
            this.showTooltip();
        }
    }
    onMouseLeave(target) {
        if (this.listensForHover && this.tooltipCloseOnMouseLeave) {
            clearTimeout(this.timeout);
            if (this.component) {
                const contentDom = this.component.instance.element.nativeElement;
                const contains = contentDom.contains(target);
                if (contains)
                    return;
            }
            this.hideTooltip(this.tooltipImmediateExit);
        }
    }
    onMouseClick() {
        if (this.listensForHover) {
            this.hideTooltip(true);
        }
    }
    showTooltip(immediate) {
        if (this.component || this.tooltipDisabled)
            return;
        const time = immediate
            ? 0
            : this.tooltipShowTimeout + (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 300 : 0);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.tooltipService.destroyAll();
            const options = this.createBoundOptions();
            this.component = this.tooltipService.create(options);
            // add a tiny timeout to avoid event re-triggers
            setTimeout(() => {
                if (this.component) {
                    this.addHideListeners(this.component.instance.element.nativeElement);
                }
            }, 10);
            this.show.emit(true);
        }, time);
    }
    addHideListeners(tooltip) {
        // on mouse enter, cancel the hide triggered by the leave
        this.mouseEnterContentEvent = this.renderer.listen(tooltip, 'mouseenter', () => {
            clearTimeout(this.timeout);
        });
        // content mouse leave listener
        if (this.tooltipCloseOnMouseLeave) {
            this.mouseLeaveContentEvent = this.renderer.listen(tooltip, 'mouseleave', () => {
                this.hideTooltip(this.tooltipImmediateExit);
            });
        }
        // content close on click outside
        if (this.tooltipCloseOnClickOutside) {
            this.documentClickEvent = this.renderer.listen(document, 'click', event => {
                const contains = tooltip.contains(event.target);
                if (!contains)
                    this.hideTooltip();
            });
        }
    }
    hideTooltip(immediate = false) {
        if (!this.component)
            return;
        const destroyFn = () => {
            // remove events
            if (this.mouseLeaveContentEvent)
                this.mouseLeaveContentEvent();
            if (this.mouseEnterContentEvent)
                this.mouseEnterContentEvent();
            if (this.documentClickEvent)
                this.documentClickEvent();
            // emit events
            this.hide.emit(true);
            // destroy component
            this.tooltipService.destroy(this.component);
            this.component = undefined;
        };
        clearTimeout(this.timeout);
        if (!immediate) {
            this.timeout = setTimeout(destroyFn, this.tooltipHideTimeout);
        }
        else {
            destroyFn();
        }
    }
    createBoundOptions() {
        return {
            title: this.tooltipTitle,
            template: this.tooltipTemplate,
            host: this.viewContainerRef.element,
            placement: this.tooltipPlacement,
            alignment: this.tooltipAlignment,
            type: this.tooltipType,
            showCaret: this.tooltipShowCaret,
            cssClass: this.tooltipCssClass,
            spacing: this.tooltipSpacing,
            context: this.tooltipContext
        };
    }
}
TooltipDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngx-tooltip]' },] }
];
TooltipDirective.ctorParameters = () => [
    { type: TooltipService },
    { type: ViewContainerRef },
    { type: Renderer2 }
];
TooltipDirective.propDecorators = {
    tooltipCssClass: [{ type: Input }],
    tooltipTitle: [{ type: Input }],
    tooltipAppendToBody: [{ type: Input }],
    tooltipSpacing: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipShowCaret: [{ type: Input }],
    tooltipPlacement: [{ type: Input }],
    tooltipAlignment: [{ type: Input }],
    tooltipType: [{ type: Input }],
    tooltipCloseOnClickOutside: [{ type: Input }],
    tooltipCloseOnMouseLeave: [{ type: Input }],
    tooltipHideTimeout: [{ type: Input }],
    tooltipShowTimeout: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    tooltipShowEvent: [{ type: Input }],
    tooltipContext: [{ type: Input }],
    tooltipImmediateExit: [{ type: Input }],
    show: [{ type: Output }],
    hide: [{ type: Output }],
    onFocus: [{ type: HostListener, args: ['focusin',] }],
    onBlur: [{ type: HostListener, args: ['blur',] }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onMouseLeave: [{ type: HostListener, args: ['mouseleave', ['$event.target'],] }],
    onMouseClick: [{ type: HostListener, args: ['click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL3Rvb2x0aXAvdG9vbHRpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE1BQU0sT0FBTyxnQkFBZ0I7SUFvQzNCLFlBQ1UsY0FBOEIsRUFDOUIsZ0JBQWtDLEVBQ2xDLFFBQW1CO1FBRm5CLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQVc7UUF0Q3BCLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLHdCQUFtQixHQUFZLElBQUksQ0FBQztRQUNwQyxtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUM1QixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUNqQyxxQkFBZ0IsR0FBWSxJQUFJLENBQUM7UUFDakMscUJBQWdCLEdBQW1CLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFDdEQscUJBQWdCLEdBQW1CLGNBQWMsQ0FBQyxNQUFNLENBQUM7UUFD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QUFnQixDQUFDLE9BQU87WUFDbkMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQ3RCLFNBQVMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ2hDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZTtZQUM5QixPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDNUIsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjO1NBQzdCLENBQUM7SUFDSixDQUFDOzs7WUEvS0YsU0FBUyxTQUFDLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRTs7O1lBRi9CLGNBQWM7WUFWckIsZ0JBQWdCO1lBQ2hCLFNBQVM7Ozs4QkFhUixLQUFLOzJCQUNMLEtBQUs7a0NBQ0wsS0FBSzs2QkFDTCxLQUFLOzhCQUNMLEtBQUs7K0JBQ0wsS0FBSzsrQkFDTCxLQUFLOytCQUNMLEtBQUs7MEJBQ0wsS0FBSzt5Q0FDTCxLQUFLO3VDQUNMLEtBQUs7aUNBQ0wsS0FBSztpQ0FDTCxLQUFLOzhCQUNMLEtBQUs7K0JBQ0wsS0FBSzs2QkFDTCxLQUFLO21DQUNMLEtBQUs7bUJBRUwsTUFBTTttQkFDTixNQUFNO3NCQTBCTixZQUFZLFNBQUMsU0FBUztxQkFPdEIsWUFBWSxTQUFDLE1BQU07MkJBT25CLFlBQVksU0FBQyxZQUFZOzJCQU96QixZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDOzJCQWU1QyxZQUFZLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgRGlyZWN0aXZlLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIFZpZXdDb250YWluZXJSZWYsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIE9uRGVzdHJveVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgUGxhY2VtZW50VHlwZXMgfSBmcm9tICcuL3Bvc2l0aW9uJztcclxuaW1wb3J0IHsgU3R5bGVUeXBlcyB9IGZyb20gJy4vc3R5bGUudHlwZSc7XHJcbmltcG9ydCB7IEFsaWdubWVudFR5cGVzIH0gZnJvbSAnLi9hbGlnbm1lbnQudHlwZSc7XHJcbmltcG9ydCB7IFNob3dUeXBlcyB9IGZyb20gJy4vc2hvdy50eXBlJztcclxuXHJcbmltcG9ydCB7IFRvb2x0aXBTZXJ2aWNlIH0gZnJvbSAnLi90b29sdGlwLnNlcnZpY2UnO1xyXG5cclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25neC10b29sdGlwXScgfSlcclxuZXhwb3J0IGNsYXNzIFRvb2x0aXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBDc3NDbGFzczogc3RyaW5nID0gJyc7XHJcbiAgQElucHV0KCkgdG9vbHRpcFRpdGxlOiBzdHJpbmcgPSAnJztcclxuICBASW5wdXQoKSB0b29sdGlwQXBwZW5kVG9Cb2R5OiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSB0b29sdGlwU3BhY2luZzogbnVtYmVyID0gMTA7XHJcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdG9vbHRpcFNob3dDYXJldDogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50VHlwZXMgPSBQbGFjZW1lbnRUeXBlcy50b3A7XHJcbiAgQElucHV0KCkgdG9vbHRpcEFsaWdubWVudDogQWxpZ25tZW50VHlwZXMgPSBBbGlnbm1lbnRUeXBlcy5jZW50ZXI7XHJcbiAgQElucHV0KCkgdG9vbHRpcFR5cGU6IFN0eWxlVHlwZXMgPSBTdHlsZVR5cGVzLnBvcG92ZXI7XHJcbiAgQElucHV0KCkgdG9vbHRpcENsb3NlT25DbGlja091dHNpZGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBDbG9zZU9uTW91c2VMZWF2ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgdG9vbHRpcEhpZGVUaW1lb3V0OiBudW1iZXIgPSAzMDA7XHJcbiAgQElucHV0KCkgdG9vbHRpcFNob3dUaW1lb3V0OiBudW1iZXIgPSAxMDA7XHJcbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBhbnk7XHJcbiAgQElucHV0KCkgdG9vbHRpcFNob3dFdmVudDogU2hvd1R5cGVzID0gU2hvd1R5cGVzLmFsbDtcclxuICBASW5wdXQoKSB0b29sdGlwQ29udGV4dDogYW55O1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBJbW1lZGlhdGVFeGl0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKSBzaG93ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBoaWRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwcml2YXRlIGdldCBsaXN0ZW5zRm9yRm9jdXMoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy50b29sdGlwU2hvd0V2ZW50ID09PSBTaG93VHlwZXMuYWxsIHx8IHRoaXMudG9vbHRpcFNob3dFdmVudCA9PT0gU2hvd1R5cGVzLmZvY3VzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXQgbGlzdGVuc0ZvckhvdmVyKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudG9vbHRpcFNob3dFdmVudCA9PT0gU2hvd1R5cGVzLmFsbCB8fCB0aGlzLnRvb2x0aXBTaG93RXZlbnQgPT09IFNob3dUeXBlcy5tb3VzZW92ZXI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXBvbmVudDogYW55O1xyXG4gIHByaXZhdGUgdGltZW91dDogYW55O1xyXG4gIHByaXZhdGUgbW91c2VMZWF2ZUNvbnRlbnRFdmVudDogYW55O1xyXG4gIHByaXZhdGUgbW91c2VFbnRlckNvbnRlbnRFdmVudDogYW55O1xyXG4gIHByaXZhdGUgZG9jdW1lbnRDbGlja0V2ZW50OiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSB0b29sdGlwU2VydmljZTogVG9vbHRpcFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcclxuICApIHt9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5oaWRlVG9vbHRpcCh0cnVlKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzaW4nKVxyXG4gIG9uRm9jdXMoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5saXN0ZW5zRm9yRm9jdXMpIHtcclxuICAgICAgdGhpcy5zaG93VG9vbHRpcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpXHJcbiAgb25CbHVyKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubGlzdGVuc0ZvckZvY3VzKSB7XHJcbiAgICAgIHRoaXMuaGlkZVRvb2x0aXAodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcclxuICBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5saXN0ZW5zRm9ySG92ZXIpIHtcclxuICAgICAgdGhpcy5zaG93VG9vbHRpcCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScsIFsnJGV2ZW50LnRhcmdldCddKVxyXG4gIG9uTW91c2VMZWF2ZSh0YXJnZXQpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmxpc3RlbnNGb3JIb3ZlciAmJiB0aGlzLnRvb2x0aXBDbG9zZU9uTW91c2VMZWF2ZSkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnREb20gPSB0aGlzLmNvbXBvbmVudC5pbnN0YW5jZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgY29udGFpbnMgPSBjb250ZW50RG9tLmNvbnRhaW5zKHRhcmdldCk7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5zKSByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaGlkZVRvb2x0aXAodGhpcy50b29sdGlwSW1tZWRpYXRlRXhpdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXHJcbiAgb25Nb3VzZUNsaWNrKCkge1xyXG4gICAgaWYgKHRoaXMubGlzdGVuc0ZvckhvdmVyKSB7XHJcbiAgICAgIHRoaXMuaGlkZVRvb2x0aXAodHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93VG9vbHRpcChpbW1lZGlhdGU/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5jb21wb25lbnQgfHwgdGhpcy50b29sdGlwRGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB0aW1lID0gaW1tZWRpYXRlXHJcbiAgICAgID8gMFxyXG4gICAgICA6IHRoaXMudG9vbHRpcFNob3dUaW1lb3V0ICsgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1xcKGlbXjtdKzsoIFU7KT8gQ1BVLitNYWMgT1MgWC8pID8gMzAwIDogMCk7XHJcblxyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy50b29sdGlwU2VydmljZS5kZXN0cm95QWxsKCk7XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jcmVhdGVCb3VuZE9wdGlvbnMoKTtcclxuICAgICAgdGhpcy5jb21wb25lbnQgPSB0aGlzLnRvb2x0aXBTZXJ2aWNlLmNyZWF0ZShvcHRpb25zKTtcclxuXHJcbiAgICAgIC8vIGFkZCBhIHRpbnkgdGltZW91dCB0byBhdm9pZCBldmVudCByZS10cmlnZ2Vyc1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgIHRoaXMuYWRkSGlkZUxpc3RlbmVycyh0aGlzLmNvbXBvbmVudC5pbnN0YW5jZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTApO1xyXG5cclxuICAgICAgdGhpcy5zaG93LmVtaXQodHJ1ZSk7XHJcbiAgICB9LCB0aW1lKTtcclxuICB9XHJcblxyXG4gIGFkZEhpZGVMaXN0ZW5lcnModG9vbHRpcCk6IHZvaWQge1xyXG4gICAgLy8gb24gbW91c2UgZW50ZXIsIGNhbmNlbCB0aGUgaGlkZSB0cmlnZ2VyZWQgYnkgdGhlIGxlYXZlXHJcbiAgICB0aGlzLm1vdXNlRW50ZXJDb250ZW50RXZlbnQgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0b29sdGlwLCAnbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjb250ZW50IG1vdXNlIGxlYXZlIGxpc3RlbmVyXHJcbiAgICBpZiAodGhpcy50b29sdGlwQ2xvc2VPbk1vdXNlTGVhdmUpIHtcclxuICAgICAgdGhpcy5tb3VzZUxlYXZlQ29udGVudEV2ZW50ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odG9vbHRpcCwgJ21vdXNlbGVhdmUnLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oaWRlVG9vbHRpcCh0aGlzLnRvb2x0aXBJbW1lZGlhdGVFeGl0KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29udGVudCBjbG9zZSBvbiBjbGljayBvdXRzaWRlXHJcbiAgICBpZiAodGhpcy50b29sdGlwQ2xvc2VPbkNsaWNrT3V0c2lkZSkge1xyXG4gICAgICB0aGlzLmRvY3VtZW50Q2xpY2tFdmVudCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCAnY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbnMgPSB0b29sdGlwLmNvbnRhaW5zKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgaWYgKCFjb250YWlucykgdGhpcy5oaWRlVG9vbHRpcCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGVUb29sdGlwKGltbWVkaWF0ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuY29tcG9uZW50KSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZGVzdHJveUZuID0gKCkgPT4ge1xyXG4gICAgICAvLyByZW1vdmUgZXZlbnRzXHJcbiAgICAgIGlmICh0aGlzLm1vdXNlTGVhdmVDb250ZW50RXZlbnQpIHRoaXMubW91c2VMZWF2ZUNvbnRlbnRFdmVudCgpO1xyXG4gICAgICBpZiAodGhpcy5tb3VzZUVudGVyQ29udGVudEV2ZW50KSB0aGlzLm1vdXNlRW50ZXJDb250ZW50RXZlbnQoKTtcclxuICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0V2ZW50KSB0aGlzLmRvY3VtZW50Q2xpY2tFdmVudCgpO1xyXG5cclxuICAgICAgLy8gZW1pdCBldmVudHNcclxuICAgICAgdGhpcy5oaWRlLmVtaXQodHJ1ZSk7XHJcblxyXG4gICAgICAvLyBkZXN0cm95IGNvbXBvbmVudFxyXG4gICAgICB0aGlzLnRvb2x0aXBTZXJ2aWNlLmRlc3Ryb3kodGhpcy5jb21wb25lbnQpO1xyXG4gICAgICB0aGlzLmNvbXBvbmVudCA9IHVuZGVmaW5lZDtcclxuICAgIH07XHJcblxyXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcbiAgICBpZiAoIWltbWVkaWF0ZSkge1xyXG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlc3Ryb3lGbiwgdGhpcy50b29sdGlwSGlkZVRpbWVvdXQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVzdHJveUZuKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZUJvdW5kT3B0aW9ucygpOiBhbnkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGl0bGU6IHRoaXMudG9vbHRpcFRpdGxlLFxyXG4gICAgICB0ZW1wbGF0ZTogdGhpcy50b29sdGlwVGVtcGxhdGUsXHJcbiAgICAgIGhvc3Q6IHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50LFxyXG4gICAgICBwbGFjZW1lbnQ6IHRoaXMudG9vbHRpcFBsYWNlbWVudCxcclxuICAgICAgYWxpZ25tZW50OiB0aGlzLnRvb2x0aXBBbGlnbm1lbnQsXHJcbiAgICAgIHR5cGU6IHRoaXMudG9vbHRpcFR5cGUsXHJcbiAgICAgIHNob3dDYXJldDogdGhpcy50b29sdGlwU2hvd0NhcmV0LFxyXG4gICAgICBjc3NDbGFzczogdGhpcy50b29sdGlwQ3NzQ2xhc3MsXHJcbiAgICAgIHNwYWNpbmc6IHRoaXMudG9vbHRpcFNwYWNpbmcsXHJcbiAgICAgIGNvbnRleHQ6IHRoaXMudG9vbHRpcENvbnRleHRcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==