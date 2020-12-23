import { __decorate } from "tslib";
import { Input, Component, ElementRef, ViewEncapsulation, HostListener, ViewChild, HostBinding, Renderer2 } from '@angular/core';
import { throttleable } from '../../utils/throttle';
import { PositionHelper } from './position';
export class TooltipContentComponent {
    constructor(element, renderer) {
        this.element = element;
        this.renderer = renderer;
    }
    get cssClasses() {
        let clz = 'ngx-charts-tooltip-content';
        clz += ` position-${this.placement}`;
        clz += ` type-${this.type}`;
        clz += ` ${this.cssClass}`;
        return clz;
    }
    ngAfterViewInit() {
        setTimeout(this.position.bind(this));
    }
    position() {
        const nativeElm = this.element.nativeElement;
        const hostDim = this.host.nativeElement.getBoundingClientRect();
        // if no dims were found, never show
        if (!hostDim.height && !hostDim.width)
            return;
        const elmDim = nativeElm.getBoundingClientRect();
        this.checkFlip(hostDim, elmDim);
        this.positionContent(nativeElm, hostDim, elmDim);
        if (this.showCaret) {
            this.positionCaret(hostDim, elmDim);
        }
        // animate its entry
        setTimeout(() => this.renderer.addClass(nativeElm, 'animate'), 1);
    }
    positionContent(nativeElm, hostDim, elmDim) {
        const { top, left } = PositionHelper.positionContent(this.placement, elmDim, hostDim, this.spacing, this.alignment);
        this.renderer.setStyle(nativeElm, 'top', `${top}px`);
        this.renderer.setStyle(nativeElm, 'left', `${left}px`);
    }
    positionCaret(hostDim, elmDim) {
        const caretElm = this.caretElm.nativeElement;
        const caretDimensions = caretElm.getBoundingClientRect();
        const { top, left } = PositionHelper.positionCaret(this.placement, elmDim, hostDim, caretDimensions, this.alignment);
        this.renderer.setStyle(caretElm, 'top', `${top}px`);
        this.renderer.setStyle(caretElm, 'left', `${left}px`);
    }
    checkFlip(hostDim, elmDim) {
        this.placement = PositionHelper.determinePlacement(this.placement, elmDim, hostDim, this.spacing);
    }
    onWindowResize() {
        this.position();
    }
}
TooltipContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-tooltip-content',
                template: `
    <div>
      <span #caretElm [hidden]="!showCaret" class="tooltip-caret position-{{ this.placement }}"> </span>
      <div class="tooltip-content">
        <span *ngIf="!title">
          <ng-template [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ model: context }"> </ng-template>
        </span>
        <span *ngIf="title" [innerHTML]="title"> </span>
      </div>
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
                styles: [".ngx-charts-tooltip-content{border-radius:3px;display:block;font-weight:400;opacity:0;pointer-events:none!important;position:fixed;z-index:5000}.ngx-charts-tooltip-content.type-popover{background:#fff;border:1px solid #72809b;box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);color:#060709;font-size:13px;padding:4px}.ngx-charts-tooltip-content.type-popover .tooltip-caret{height:0;position:absolute;width:0;z-index:5001}.ngx-charts-tooltip-content.type-popover .tooltip-caret.position-left{border-bottom:7px solid transparent;border-left:7px solid #fff;border-top:7px solid transparent}.ngx-charts-tooltip-content.type-popover .tooltip-caret.position-top{border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid #fff}.ngx-charts-tooltip-content.type-popover .tooltip-caret.position-right{border-bottom:7px solid transparent;border-right:7px solid #fff;border-top:7px solid transparent}.ngx-charts-tooltip-content.type-popover .tooltip-caret.position-bottom{border-bottom:7px solid #fff;border-left:7px solid transparent;border-right:7px solid transparent}.ngx-charts-tooltip-content.type-tooltip{background:rgba(0,0,0,.75);color:#fff;font-size:12px;padding:0 10px;pointer-events:auto;text-align:center}.ngx-charts-tooltip-content.type-tooltip .tooltip-caret.position-left{border-bottom:7px solid transparent;border-left:7px solid rgba(0,0,0,.75);border-top:7px solid transparent}.ngx-charts-tooltip-content.type-tooltip .tooltip-caret.position-top{border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid rgba(0,0,0,.75)}.ngx-charts-tooltip-content.type-tooltip .tooltip-caret.position-right{border-bottom:7px solid transparent;border-right:7px solid rgba(0,0,0,.75);border-top:7px solid transparent}.ngx-charts-tooltip-content.type-tooltip .tooltip-caret.position-bottom{border-bottom:7px solid rgba(0,0,0,.75);border-left:7px solid transparent;border-right:7px solid transparent}.ngx-charts-tooltip-content .tooltip-label{display:block;font-size:1em;line-height:1em;padding:8px 5px 5px}.ngx-charts-tooltip-content .tooltip-val{display:block;font-size:1.3em;line-height:1em;padding:0 5px 8px}.ngx-charts-tooltip-content .tooltip-caret{height:0;position:absolute;width:0;z-index:5001}.ngx-charts-tooltip-content.position-right{transform:translate3d(10px,0,0)}.ngx-charts-tooltip-content.position-left{transform:translate3d(-10px,0,0)}.ngx-charts-tooltip-content.position-top{transform:translate3d(0,-10px,0)}.ngx-charts-tooltip-content.position-bottom{transform:translate3d(0,10px,0)}.ngx-charts-tooltip-content.animate{opacity:1;pointer-events:auto;transform:translateZ(0);transition:opacity .3s,transform .3s}.area-tooltip-container{padding:5px 0;pointer-events:none}.tooltip-item{line-height:1.2em;padding:5px 0;text-align:left}.tooltip-item .tooltip-item-color{border-radius:3px;color:#5b646b;display:inline-block;height:12px;margin-right:5px;width:12px}"]
            },] }
];
TooltipContentComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
TooltipContentComponent.propDecorators = {
    host: [{ type: Input }],
    showCaret: [{ type: Input }],
    type: [{ type: Input }],
    placement: [{ type: Input }],
    alignment: [{ type: Input }],
    spacing: [{ type: Input }],
    cssClass: [{ type: Input }],
    title: [{ type: Input }],
    template: [{ type: Input }],
    context: [{ type: Input }],
    caretElm: [{ type: ViewChild, args: ['caretElm',] }],
    cssClasses: [{ type: HostBinding, args: ['class',] }],
    onWindowResize: [{ type: HostListener, args: ['window:resize',] }]
};
__decorate([
    throttleable(100)
], TooltipContentComponent.prototype, "onWindowResize", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL3Rvb2x0aXAvdG9vbHRpcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxLQUFLLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFFVixpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFrQixNQUFNLFlBQVksQ0FBQztBQXFCNUQsTUFBTSxPQUFPLHVCQUF1QjtJQXVCbEMsWUFBbUIsT0FBbUIsRUFBVSxRQUFtQjtRQUFoRCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUFHLENBQUM7SUFUdkUsSUFDSSxVQUFVO1FBQ1osSUFBSSxHQUFHLEdBQUcsNEJBQTRCLENBQUM7UUFDdkMsR0FBRyxJQUFJLGFBQWEsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JDLEdBQUcsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QixHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBSUQsZUFBZTtRQUNiLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElB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ZTs7QUFFN0I7SUFEQyxZQUFZLENBQUMsR0FBRyxDQUFDOzZEQUdqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgSW5wdXQsXHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEhvc3RCaW5kaW5nLFxyXG4gIFJlbmRlcmVyMlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgdGhyb3R0bGVhYmxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdGhyb3R0bGUnO1xyXG5pbXBvcnQgeyBQb3NpdGlvbkhlbHBlciwgUGxhY2VtZW50VHlwZXMgfSBmcm9tICcuL3Bvc2l0aW9uJztcclxuXHJcbmltcG9ydCB7IFN0eWxlVHlwZXMgfSBmcm9tICcuL3N0eWxlLnR5cGUnO1xyXG5pbXBvcnQgeyBBbGlnbm1lbnRUeXBlcyB9IGZyb20gJy4vYWxpZ25tZW50LnR5cGUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtdG9vbHRpcC1jb250ZW50JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdj5cclxuICAgICAgPHNwYW4gI2NhcmV0RWxtIFtoaWRkZW5dPVwiIXNob3dDYXJldFwiIGNsYXNzPVwidG9vbHRpcC1jYXJldCBwb3NpdGlvbi17eyB0aGlzLnBsYWNlbWVudCB9fVwiPiA8L3NwYW4+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWNvbnRlbnRcIj5cclxuICAgICAgICA8c3BhbiAqbmdJZj1cIiF0aXRsZVwiPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgbW9kZWw6IGNvbnRleHQgfVwiPiA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8c3BhbiAqbmdJZj1cInRpdGxlXCIgW2lubmVySFRNTF09XCJ0aXRsZVwiPiA8L3NwYW4+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIHN0eWxlVXJsczogWycuL3Rvb2x0aXAuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBob3N0OiBhbnk7XHJcbiAgQElucHV0KCkgc2hvd0NhcmV0OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHR5cGU6IFN0eWxlVHlwZXM7XHJcbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRUeXBlcztcclxuICBASW5wdXQoKSBhbGlnbm1lbnQ6IEFsaWdubWVudFR5cGVzO1xyXG4gIEBJbnB1dCgpIHNwYWNpbmc6IG51bWJlcjtcclxuICBASW5wdXQoKSBjc3NDbGFzczogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgdGVtcGxhdGU6IGFueTtcclxuICBASW5wdXQoKSBjb250ZXh0OiBhbnk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2NhcmV0RWxtJykgY2FyZXRFbG07XHJcblxyXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxyXG4gIGdldCBjc3NDbGFzc2VzKCk6IHN0cmluZyB7XHJcbiAgICBsZXQgY2x6ID0gJ25neC1jaGFydHMtdG9vbHRpcC1jb250ZW50JztcclxuICAgIGNseiArPSBgIHBvc2l0aW9uLSR7dGhpcy5wbGFjZW1lbnR9YDtcclxuICAgIGNseiArPSBgIHR5cGUtJHt0aGlzLnR5cGV9YDtcclxuICAgIGNseiArPSBgICR7dGhpcy5jc3NDbGFzc31gO1xyXG4gICAgcmV0dXJuIGNsejtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHNldFRpbWVvdXQodGhpcy5wb3NpdGlvbi5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIHBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgY29uc3QgbmF0aXZlRWxtID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBob3N0RGltID0gdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgLy8gaWYgbm8gZGltcyB3ZXJlIGZvdW5kLCBuZXZlciBzaG93XHJcbiAgICBpZiAoIWhvc3REaW0uaGVpZ2h0ICYmICFob3N0RGltLndpZHRoKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZWxtRGltID0gbmF0aXZlRWxtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5jaGVja0ZsaXAoaG9zdERpbSwgZWxtRGltKTtcclxuICAgIHRoaXMucG9zaXRpb25Db250ZW50KG5hdGl2ZUVsbSwgaG9zdERpbSwgZWxtRGltKTtcclxuXHJcbiAgICBpZiAodGhpcy5zaG93Q2FyZXQpIHtcclxuICAgICAgdGhpcy5wb3NpdGlvbkNhcmV0KGhvc3REaW0sIGVsbURpbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYW5pbWF0ZSBpdHMgZW50cnlcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbG0sICdhbmltYXRlJyksIDEpO1xyXG4gIH1cclxuXHJcbiAgcG9zaXRpb25Db250ZW50KG5hdGl2ZUVsbSwgaG9zdERpbSwgZWxtRGltKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gUG9zaXRpb25IZWxwZXIucG9zaXRpb25Db250ZW50KHRoaXMucGxhY2VtZW50LCBlbG1EaW0sIGhvc3REaW0sIHRoaXMuc3BhY2luZywgdGhpcy5hbGlnbm1lbnQpO1xyXG5cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUobmF0aXZlRWxtLCAndG9wJywgYCR7dG9wfXB4YCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKG5hdGl2ZUVsbSwgJ2xlZnQnLCBgJHtsZWZ0fXB4YCk7XHJcbiAgfVxyXG5cclxuICBwb3NpdGlvbkNhcmV0KGhvc3REaW0sIGVsbURpbSk6IHZvaWQge1xyXG4gICAgY29uc3QgY2FyZXRFbG0gPSB0aGlzLmNhcmV0RWxtLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJldERpbWVuc2lvbnMgPSBjYXJldEVsbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBQb3NpdGlvbkhlbHBlci5wb3NpdGlvbkNhcmV0KFxyXG4gICAgICB0aGlzLnBsYWNlbWVudCxcclxuICAgICAgZWxtRGltLFxyXG4gICAgICBob3N0RGltLFxyXG4gICAgICBjYXJldERpbWVuc2lvbnMsXHJcbiAgICAgIHRoaXMuYWxpZ25tZW50XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2FyZXRFbG0sICd0b3AnLCBgJHt0b3B9cHhgKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY2FyZXRFbG0sICdsZWZ0JywgYCR7bGVmdH1weGApO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tGbGlwKGhvc3REaW0sIGVsbURpbSk6IHZvaWQge1xyXG4gICAgdGhpcy5wbGFjZW1lbnQgPSBQb3NpdGlvbkhlbHBlci5kZXRlcm1pbmVQbGFjZW1lbnQodGhpcy5wbGFjZW1lbnQsIGVsbURpbSwgaG9zdERpbSwgdGhpcy5zcGFjaW5nKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxyXG4gIEB0aHJvdHRsZWFibGUoMTAwKVxyXG4gIG9uV2luZG93UmVzaXplKCk6IHZvaWQge1xyXG4gICAgdGhpcy5wb3NpdGlvbigpO1xyXG4gIH1cclxufVxyXG4iXX0=