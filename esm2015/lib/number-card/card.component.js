import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { trimLabel } from '../common/trim-label.helper';
import { roundedRect } from '../common/shape.helper';
import { escapeLabel } from '../common/label.helper';
import { decimalChecker, count } from '../common/count/count.helper';
export class CardComponent {
    constructor(element, cd, zone) {
        this.cd = cd;
        this.zone = zone;
        this.animations = true;
        this.select = new EventEmitter();
        this.value = '';
        this.textFontSize = 12;
        this.textTransform = '';
        this.initialized = false;
        this.bandHeight = 10;
        this.textPadding = [10, 20, 5, 20];
        this.labelFontSize = 15;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
    }
    ngOnDestroy() {
        cancelAnimationFrame(this.animationReq);
    }
    update() {
        this.zone.run(() => {
            const hasValue = this.data && typeof this.data.value !== 'undefined';
            const valueFormatting = this.valueFormatting || (card => card.value.toLocaleString());
            const labelFormatting = this.labelFormatting || (card => escapeLabel(trimLabel(card.label, 55)));
            this.transform = `translate(${this.x} , ${this.y})`;
            this.textWidth = Math.max(0, this.width) - this.textPadding[1] - this.textPadding[3];
            this.cardWidth = Math.max(0, this.width);
            this.cardHeight = Math.max(0, this.height);
            this.label = this.label ? this.label : this.data.name;
            const cardData = {
                label: this.label,
                data: this.data,
                value: this.data.value
            };
            this.formattedLabel = labelFormatting(cardData);
            this.transformBand = `translate(0 , ${this.cardHeight - this.bandHeight})`;
            const value = hasValue ? valueFormatting(cardData) : '';
            this.value = this.paddedValue(value);
            this.setPadding();
            this.bandPath = roundedRect(0, 0, this.cardWidth, this.bandHeight, 3, [false, false, true, true]);
            setTimeout(() => {
                this.scaleText();
                this.value = value;
                if (hasValue && !this.initialized) {
                    setTimeout(() => this.startCount(), 20);
                }
            }, 8);
        });
    }
    paddedValue(value) {
        if (this.medianSize && this.medianSize > value.length) {
            value += '\u2007'.repeat(this.medianSize - value.length);
        }
        return value;
    }
    startCount() {
        if (!this.initialized && this.animations) {
            cancelAnimationFrame(this.animationReq);
            const val = this.data.value;
            const decs = decimalChecker(val);
            const valueFormatting = this.valueFormatting || (card => card.value.toLocaleString());
            const callback = ({ value, finished }) => {
                this.zone.run(() => {
                    value = finished ? val : value;
                    this.value = valueFormatting({ label: this.label, data: this.data, value });
                    if (!finished) {
                        this.value = this.paddedValue(this.value);
                    }
                    this.cd.markForCheck();
                });
            };
            this.animationReq = count(0, val, decs, 1, callback);
            this.initialized = true;
        }
    }
    scaleText() {
        this.zone.run(() => {
            const { width, height } = this.textEl.nativeElement.getBoundingClientRect();
            if (width === 0 || height === 0) {
                return;
            }
            const textPadding = (this.textPadding[1] = this.textPadding[3] = this.cardWidth / 8);
            const availableWidth = this.cardWidth - 2 * textPadding;
            const availableHeight = this.cardHeight / 3;
            const resizeScale = Math.min(availableWidth / width, availableHeight / height);
            this.textFontSize = Math.floor(this.textFontSize * resizeScale);
            this.labelFontSize = Math.min(this.textFontSize, 15);
            this.setPadding();
            this.cd.markForCheck();
        });
    }
    setPadding() {
        this.textPadding[1] = this.textPadding[3] = this.cardWidth / 8;
        const padding = this.cardHeight / 2;
        this.textPadding[0] = padding - this.textFontSize - this.labelFontSize / 2;
        this.textPadding[2] = padding - this.labelFontSize;
    }
    onClick() {
        this.select.emit(this.data);
    }
}
CardComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-card]',
                template: `
    <svg:g [attr.transform]="transform" class="cell" (click)="onClick()">
      <svg:rect class="card" [style.fill]="color" [attr.width]="cardWidth" [attr.height]="cardHeight" rx="3" ry="3" />
      <svg:path
        *ngIf="bandColor && bandColor !== color"
        class="card-band"
        [attr.fill]="bandColor"
        [attr.transform]="transformBand"
        stroke="none"
        [attr.d]="bandPath"
      />
      <title>{{ label }}</title>
      <svg:foreignObject
        class="trimmed-label"
        x="5"
        [attr.x]="textPadding[3]"
        [attr.y]="cardHeight - textPadding[2]"
        [attr.width]="textWidth"
        [attr.height]="labelFontSize + textPadding[2]"
        alignment-baseline="hanging"
      >
        <xhtml:p
          [style.color]="textColor"
          [style.fontSize.px]="labelFontSize"
          [style.lineHeight.px]="labelFontSize"
          [innerHTML]="formattedLabel"
        >
        </xhtml:p>
      </svg:foreignObject>
      <svg:text
        #textEl
        class="value-text"
        [attr.x]="textPadding[3]"
        [attr.y]="textPadding[0]"
        [style.fill]="textColor"
        text-anchor="start"
        alignment-baseline="hanging"
        [style.font-size.pt]="textFontSize"
      >
        {{ value }}
      </svg:text>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
CardComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: NgZone }
];
CardComponent.propDecorators = {
    color: [{ type: Input }],
    bandColor: [{ type: Input }],
    textColor: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    label: [{ type: Input }],
    data: [{ type: Input }],
    medianSize: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }],
    textEl: [{ type: ViewChild, args: ['textEl', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbnVtYmVyLWNhcmQvY2FyZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBR1YsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsTUFBTSxFQUVQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFpRHJFLE1BQU0sT0FBTyxhQUFhO0lBdUN4QixZQUFZLE9BQW1CLEVBQVUsRUFBcUIsRUFBVSxJQUFZO1FBQTNDLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQXpCM0UsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUxQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUt0QyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBTW5CLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQzNCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRzdCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFFeEIsZ0JBQVcsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBS2pCLElBQUks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TCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSztnQkFFTCxLQUFLO2dCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7bUJBQ0wsS0FBSzt5QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU07cUJBRU4sU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBPbkNoYW5nZXMsXHJcbiAgVmlld0NoaWxkLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIE5nWm9uZSxcclxuICBPbkRlc3Ryb3lcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL3RyaW0tbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgcm91bmRlZFJlY3QgfSBmcm9tICcuLi9jb21tb24vc2hhcGUuaGVscGVyJztcclxuaW1wb3J0IHsgZXNjYXBlTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgZGVjaW1hbENoZWNrZXIsIGNvdW50IH0gZnJvbSAnLi4vY29tbW9uL2NvdW50L2NvdW50LmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1jYXJkXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCIgY2xhc3M9XCJjZWxsXCIgKGNsaWNrKT1cIm9uQ2xpY2soKVwiPlxyXG4gICAgICA8c3ZnOnJlY3QgY2xhc3M9XCJjYXJkXCIgW3N0eWxlLmZpbGxdPVwiY29sb3JcIiBbYXR0ci53aWR0aF09XCJjYXJkV2lkdGhcIiBbYXR0ci5oZWlnaHRdPVwiY2FyZEhlaWdodFwiIHJ4PVwiM1wiIHJ5PVwiM1wiIC8+XHJcbiAgICAgIDxzdmc6cGF0aFxyXG4gICAgICAgICpuZ0lmPVwiYmFuZENvbG9yICYmIGJhbmRDb2xvciAhPT0gY29sb3JcIlxyXG4gICAgICAgIGNsYXNzPVwiY2FyZC1iYW5kXCJcclxuICAgICAgICBbYXR0ci5maWxsXT1cImJhbmRDb2xvclwiXHJcbiAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybUJhbmRcIlxyXG4gICAgICAgIHN0cm9rZT1cIm5vbmVcIlxyXG4gICAgICAgIFthdHRyLmRdPVwiYmFuZFBhdGhcIlxyXG4gICAgICAvPlxyXG4gICAgICA8dGl0bGU+e3sgbGFiZWwgfX08L3RpdGxlPlxyXG4gICAgICA8c3ZnOmZvcmVpZ25PYmplY3RcclxuICAgICAgICBjbGFzcz1cInRyaW1tZWQtbGFiZWxcIlxyXG4gICAgICAgIHg9XCI1XCJcclxuICAgICAgICBbYXR0ci54XT1cInRleHRQYWRkaW5nWzNdXCJcclxuICAgICAgICBbYXR0ci55XT1cImNhcmRIZWlnaHQgLSB0ZXh0UGFkZGluZ1syXVwiXHJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwidGV4dFdpZHRoXCJcclxuICAgICAgICBbYXR0ci5oZWlnaHRdPVwibGFiZWxGb250U2l6ZSArIHRleHRQYWRkaW5nWzJdXCJcclxuICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJoYW5naW5nXCJcclxuICAgICAgPlxyXG4gICAgICAgIDx4aHRtbDpwXHJcbiAgICAgICAgICBbc3R5bGUuY29sb3JdPVwidGV4dENvbG9yXCJcclxuICAgICAgICAgIFtzdHlsZS5mb250U2l6ZS5weF09XCJsYWJlbEZvbnRTaXplXCJcclxuICAgICAgICAgIFtzdHlsZS5saW5lSGVpZ2h0LnB4XT1cImxhYmVsRm9udFNpemVcIlxyXG4gICAgICAgICAgW2lubmVySFRNTF09XCJmb3JtYXR0ZWRMYWJlbFwiXHJcbiAgICAgICAgPlxyXG4gICAgICAgIDwveGh0bWw6cD5cclxuICAgICAgPC9zdmc6Zm9yZWlnbk9iamVjdD5cclxuICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgI3RleHRFbFxyXG4gICAgICAgIGNsYXNzPVwidmFsdWUtdGV4dFwiXHJcbiAgICAgICAgW2F0dHIueF09XCJ0ZXh0UGFkZGluZ1szXVwiXHJcbiAgICAgICAgW2F0dHIueV09XCJ0ZXh0UGFkZGluZ1swXVwiXHJcbiAgICAgICAgW3N0eWxlLmZpbGxdPVwidGV4dENvbG9yXCJcclxuICAgICAgICB0ZXh0LWFuY2hvcj1cInN0YXJ0XCJcclxuICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJoYW5naW5nXCJcclxuICAgICAgICBbc3R5bGUuZm9udC1zaXplLnB0XT1cInRleHRGb250U2l6ZVwiXHJcbiAgICAgID5cclxuICAgICAgICB7eyB2YWx1ZSB9fVxyXG4gICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpIGNvbG9yO1xyXG4gIEBJbnB1dCgpIGJhbmRDb2xvcjtcclxuICBASW5wdXQoKSB0ZXh0Q29sb3I7XHJcblxyXG4gIEBJbnB1dCgpIHg7XHJcbiAgQElucHV0KCkgeTtcclxuICBASW5wdXQoKSB3aWR0aDtcclxuICBASW5wdXQoKSBoZWlnaHQ7XHJcbiAgQElucHV0KCkgbGFiZWw7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSBtZWRpYW5TaXplOiBudW1iZXI7XHJcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgbGFiZWxGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3RleHRFbCcsIHsgc3RhdGljOiBmYWxzZSB9KSB0ZXh0RWw6IEVsZW1lbnRSZWY7XHJcblxyXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gIHZhbHVlOiBzdHJpbmcgPSAnJztcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBmb3JtYXR0ZWRMYWJlbDogc3RyaW5nO1xyXG4gIGNhcmRXaWR0aDogbnVtYmVyO1xyXG4gIGNhcmRIZWlnaHQ6IG51bWJlcjtcclxuICB0ZXh0V2lkdGg6IG51bWJlcjtcclxuICB0ZXh0Rm9udFNpemU6IG51bWJlciA9IDEyO1xyXG4gIHRleHRUcmFuc2Zvcm06IHN0cmluZyA9ICcnO1xyXG4gIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgYW5pbWF0aW9uUmVxOiBhbnk7XHJcblxyXG4gIGJhbmRIZWlnaHQ6IG51bWJlciA9IDEwO1xyXG4gIHRyYW5zZm9ybUJhbmQ6IHN0cmluZztcclxuICB0ZXh0UGFkZGluZyA9IFsxMCwgMjAsIDUsIDIwXTtcclxuICBsYWJlbEZvbnRTaXplID0gMTU7XHJcblxyXG4gIGJhbmRQYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25SZXEpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGhhc1ZhbHVlID0gdGhpcy5kYXRhICYmIHR5cGVvZiB0aGlzLmRhdGEudmFsdWUgIT09ICd1bmRlZmluZWQnO1xyXG4gICAgICBjb25zdCB2YWx1ZUZvcm1hdHRpbmcgPSB0aGlzLnZhbHVlRm9ybWF0dGluZyB8fCAoY2FyZCA9PiBjYXJkLnZhbHVlLnRvTG9jYWxlU3RyaW5nKCkpO1xyXG4gICAgICBjb25zdCBsYWJlbEZvcm1hdHRpbmcgPSB0aGlzLmxhYmVsRm9ybWF0dGluZyB8fCAoY2FyZCA9PiBlc2NhcGVMYWJlbCh0cmltTGFiZWwoY2FyZC5sYWJlbCwgNTUpKSk7XHJcblxyXG4gICAgICB0aGlzLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt0aGlzLnh9ICwgJHt0aGlzLnl9KWA7XHJcblxyXG4gICAgICB0aGlzLnRleHRXaWR0aCA9IE1hdGgubWF4KDAsIHRoaXMud2lkdGgpIC0gdGhpcy50ZXh0UGFkZGluZ1sxXSAtIHRoaXMudGV4dFBhZGRpbmdbM107XHJcbiAgICAgIHRoaXMuY2FyZFdpZHRoID0gTWF0aC5tYXgoMCwgdGhpcy53aWR0aCk7XHJcbiAgICAgIHRoaXMuY2FyZEhlaWdodCA9IE1hdGgubWF4KDAsIHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgIHRoaXMubGFiZWwgPSB0aGlzLmxhYmVsID8gdGhpcy5sYWJlbCA6IHRoaXMuZGF0YS5uYW1lO1xyXG5cclxuICAgICAgY29uc3QgY2FyZERhdGEgPSB7XHJcbiAgICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXHJcbiAgICAgICAgZGF0YTogdGhpcy5kYXRhLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmRhdGEudmFsdWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuZm9ybWF0dGVkTGFiZWwgPSBsYWJlbEZvcm1hdHRpbmcoY2FyZERhdGEpO1xyXG4gICAgICB0aGlzLnRyYW5zZm9ybUJhbmQgPSBgdHJhbnNsYXRlKDAgLCAke3RoaXMuY2FyZEhlaWdodCAtIHRoaXMuYmFuZEhlaWdodH0pYDtcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlID0gaGFzVmFsdWUgPyB2YWx1ZUZvcm1hdHRpbmcoY2FyZERhdGEpIDogJyc7XHJcblxyXG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5wYWRkZWRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgIHRoaXMuc2V0UGFkZGluZygpO1xyXG5cclxuICAgICAgdGhpcy5iYW5kUGF0aCA9IHJvdW5kZWRSZWN0KDAsIDAsIHRoaXMuY2FyZFdpZHRoLCB0aGlzLmJhbmRIZWlnaHQsIDMsIFtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWVdKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2NhbGVUZXh0KCk7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChoYXNWYWx1ZSAmJiAhdGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnN0YXJ0Q291bnQoKSwgMjApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgOCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHBhZGRlZFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLm1lZGlhblNpemUgJiYgdGhpcy5tZWRpYW5TaXplID4gdmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgIHZhbHVlICs9ICdcXHUyMDA3Jy5yZXBlYXQodGhpcy5tZWRpYW5TaXplIC0gdmFsdWUubGVuZ3RoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHN0YXJ0Q291bnQoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy5hbmltYXRpb25zKSB7XHJcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uUmVxKTtcclxuXHJcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZGF0YS52YWx1ZTtcclxuICAgICAgY29uc3QgZGVjcyA9IGRlY2ltYWxDaGVja2VyKHZhbCk7XHJcbiAgICAgIGNvbnN0IHZhbHVlRm9ybWF0dGluZyA9IHRoaXMudmFsdWVGb3JtYXR0aW5nIHx8IChjYXJkID0+IGNhcmQudmFsdWUudG9Mb2NhbGVTdHJpbmcoKSk7XHJcblxyXG4gICAgICBjb25zdCBjYWxsYmFjayA9ICh7IHZhbHVlLCBmaW5pc2hlZCB9KSA9PiB7XHJcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgICAgICB2YWx1ZSA9IGZpbmlzaGVkID8gdmFsIDogdmFsdWU7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWVGb3JtYXR0aW5nKHsgbGFiZWw6IHRoaXMubGFiZWwsIGRhdGE6IHRoaXMuZGF0YSwgdmFsdWUgfSk7XHJcbiAgICAgICAgICBpZiAoIWZpbmlzaGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnBhZGRlZFZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uUmVxID0gY291bnQoMCwgdmFsLCBkZWNzLCAxLCBjYWxsYmFjayk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2NhbGVUZXh0KCk6IHZvaWQge1xyXG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy50ZXh0RWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgaWYgKHdpZHRoID09PSAwIHx8IGhlaWdodCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdGV4dFBhZGRpbmcgPSAodGhpcy50ZXh0UGFkZGluZ1sxXSA9IHRoaXMudGV4dFBhZGRpbmdbM10gPSB0aGlzLmNhcmRXaWR0aCAvIDgpO1xyXG4gICAgICBjb25zdCBhdmFpbGFibGVXaWR0aCA9IHRoaXMuY2FyZFdpZHRoIC0gMiAqIHRleHRQYWRkaW5nO1xyXG4gICAgICBjb25zdCBhdmFpbGFibGVIZWlnaHQgPSB0aGlzLmNhcmRIZWlnaHQgLyAzO1xyXG5cclxuICAgICAgY29uc3QgcmVzaXplU2NhbGUgPSBNYXRoLm1pbihhdmFpbGFibGVXaWR0aCAvIHdpZHRoLCBhdmFpbGFibGVIZWlnaHQgLyBoZWlnaHQpO1xyXG4gICAgICB0aGlzLnRleHRGb250U2l6ZSA9IE1hdGguZmxvb3IodGhpcy50ZXh0Rm9udFNpemUgKiByZXNpemVTY2FsZSk7XHJcbiAgICAgIHRoaXMubGFiZWxGb250U2l6ZSA9IE1hdGgubWluKHRoaXMudGV4dEZvbnRTaXplLCAxNSk7XHJcblxyXG4gICAgICB0aGlzLnNldFBhZGRpbmcoKTtcclxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0UGFkZGluZygpIHtcclxuICAgIHRoaXMudGV4dFBhZGRpbmdbMV0gPSB0aGlzLnRleHRQYWRkaW5nWzNdID0gdGhpcy5jYXJkV2lkdGggLyA4O1xyXG4gICAgY29uc3QgcGFkZGluZyA9IHRoaXMuY2FyZEhlaWdodCAvIDI7XHJcbiAgICB0aGlzLnRleHRQYWRkaW5nWzBdID0gcGFkZGluZyAtIHRoaXMudGV4dEZvbnRTaXplIC0gdGhpcy5sYWJlbEZvbnRTaXplIC8gMjtcclxuICAgIHRoaXMudGV4dFBhZGRpbmdbMl0gPSBwYWRkaW5nIC0gdGhpcy5sYWJlbEZvbnRTaXplO1xyXG4gIH1cclxuXHJcbiAgb25DbGljaygpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQodGhpcy5kYXRhKTtcclxuICB9XHJcbn1cclxuIl19