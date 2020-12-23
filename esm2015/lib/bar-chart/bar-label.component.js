import { Component, Input, ChangeDetectionStrategy, ElementRef, Output, EventEmitter } from '@angular/core';
import { formatLabel } from '../common/label.helper';
export class BarLabelComponent {
    constructor(element) {
        this.dimensionsChanged = new EventEmitter();
        this.horizontalPadding = 2;
        this.verticalPadding = 5;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
    }
    getSize() {
        const h = this.element.getBoundingClientRect().height;
        const w = this.element.getBoundingClientRect().width;
        return { height: h, width: w, negative: this.value < 0 };
    }
    ngAfterViewInit() {
        this.dimensionsChanged.emit(this.getSize());
    }
    update() {
        if (this.valueFormatting) {
            this.formatedValue = this.valueFormatting(this.value);
        }
        else {
            this.formatedValue = formatLabel(this.value);
        }
        if (this.orientation === 'horizontal') {
            this.x = this.barX + this.barWidth;
            // if the value is negative then it's on the left of the x0.
            // we need to put the data label in front of the bar
            if (this.value < 0) {
                this.x = this.x - this.horizontalPadding;
                this.textAnchor = 'end';
            }
            else {
                this.x = this.x + this.horizontalPadding;
                this.textAnchor = 'start';
            }
            this.y = this.barY + this.barHeight / 2;
        }
        else {
            // orientation must be "vertical"
            this.x = this.barX + this.barWidth / 2;
            this.y = this.barY + this.barHeight;
            if (this.value < 0) {
                this.y = this.y + this.verticalPadding;
                this.textAnchor = 'end';
            }
            else {
                this.y = this.y - this.verticalPadding;
                this.textAnchor = 'start';
            }
            this.transform = `rotate(-45, ${this.x} , ${this.y})`;
        }
    }
}
BarLabelComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-bar-label]',
                template: `
    <svg:text
      class="textDataLabel"
      alignment-baseline="middle"
      [attr.text-anchor]="textAnchor"
      [attr.transform]="transform"
      [attr.x]="x"
      [attr.y]="y"
    >
      {{ formatedValue }}
    </svg:text>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".textDataLabel{font-size:11px}"]
            },] }
];
BarLabelComponent.ctorParameters = () => [
    { type: ElementRef }
];
BarLabelComponent.propDecorators = {
    value: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    barX: [{ type: Input }],
    barY: [{ type: Input }],
    barWidth: [{ type: Input }],
    barHeight: [{ type: Input }],
    orientation: [{ type: Input }],
    dimensionsChanged: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWxhYmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9iYXItY2hhcnQvYmFyLWxhYmVsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFHTCx1QkFBdUIsRUFDdkIsVUFBVSxFQUNWLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBbUJyRCxNQUFNLE9BQU8saUJBQWlCO0lBb0I1QixZQUFZLE9BQW1CO1FBWHJCLHNCQUFpQixHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBS3BFLHNCQUFpQixHQUFXLENBQUMsQ0FBQztRQUM5QixvQkFBZSxHQUFXLENBQUMsQ0FBQztRQU0xQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2RDthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlDO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFlBQVksRUFBRTtZQUNyQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNuQyw0REFBNEQ7WUFDNUQsb0RBQW9EO1lBQ3BELElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO2FBQzNCO1lBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO2FBQU07WUFDTCxpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBRXBDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUN2QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzthQUN6QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7YUFDM0I7WUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FDdkQ7SUFDSCxDQUFDOzs7WUF4RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDtnQkFFRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztZQXRCQyxVQUFVOzs7b0JBd0JULEtBQUs7OEJBQ0wsS0FBSzttQkFDTCxLQUFLO21CQUNMLEtBQUs7dUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzBCQUNMLEtBQUs7Z0NBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmb3JtYXRMYWJlbCB9IGZyb20gJy4uL2NvbW1vbi9sYWJlbC5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtYmFyLWxhYmVsXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6dGV4dFxyXG4gICAgICBjbGFzcz1cInRleHREYXRhTGFiZWxcIlxyXG4gICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJtaWRkbGVcIlxyXG4gICAgICBbYXR0ci50ZXh0LWFuY2hvcl09XCJ0ZXh0QW5jaG9yXCJcclxuICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybVwiXHJcbiAgICAgIFthdHRyLnhdPVwieFwiXHJcbiAgICAgIFthdHRyLnldPVwieVwiXHJcbiAgICA+XHJcbiAgICAgIHt7IGZvcm1hdGVkVmFsdWUgfX1cclxuICAgIDwvc3ZnOnRleHQ+XHJcbiAgYCxcclxuICBzdHlsZVVybHM6IFsnLi9iYXItbGFiZWwuY29tcG9uZW50LnNjc3MnXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmFyTGFiZWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIHZhbHVlO1xyXG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xyXG4gIEBJbnB1dCgpIGJhclg7XHJcbiAgQElucHV0KCkgYmFyWTtcclxuICBASW5wdXQoKSBiYXJXaWR0aDtcclxuICBASW5wdXQoKSBiYXJIZWlnaHQ7XHJcbiAgQElucHV0KCkgb3JpZW50YXRpb247XHJcblxyXG4gIEBPdXRwdXQoKSBkaW1lbnNpb25zQ2hhbmdlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGVsZW1lbnQ6IGFueTtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG4gIGhvcml6b250YWxQYWRkaW5nOiBudW1iZXIgPSAyO1xyXG4gIHZlcnRpY2FsUGFkZGluZzogbnVtYmVyID0gNTtcclxuICBmb3JtYXRlZFZhbHVlOiBzdHJpbmc7XHJcbiAgdHJhbnNmb3JtOiBzdHJpbmc7XHJcbiAgdGV4dEFuY2hvcjogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpOiBhbnkge1xyXG4gICAgY29uc3QgaCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcbiAgICBjb25zdCB3ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgcmV0dXJuIHsgaGVpZ2h0OiBoLCB3aWR0aDogdywgbmVnYXRpdmU6IHRoaXMudmFsdWUgPCAwIH07XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2VkLmVtaXQodGhpcy5nZXRTaXplKCkpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudmFsdWVGb3JtYXR0aW5nKSB7XHJcbiAgICAgIHRoaXMuZm9ybWF0ZWRWYWx1ZSA9IHRoaXMudmFsdWVGb3JtYXR0aW5nKHRoaXMudmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5mb3JtYXRlZFZhbHVlID0gZm9ybWF0TGFiZWwodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICB0aGlzLnggPSB0aGlzLmJhclggKyB0aGlzLmJhcldpZHRoO1xyXG4gICAgICAvLyBpZiB0aGUgdmFsdWUgaXMgbmVnYXRpdmUgdGhlbiBpdCdzIG9uIHRoZSBsZWZ0IG9mIHRoZSB4MC5cclxuICAgICAgLy8gd2UgbmVlZCB0byBwdXQgdGhlIGRhdGEgbGFiZWwgaW4gZnJvbnQgb2YgdGhlIGJhclxyXG4gICAgICBpZiAodGhpcy52YWx1ZSA8IDApIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSB0aGlzLmhvcml6b250YWxQYWRkaW5nO1xyXG4gICAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdlbmQnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCArIHRoaXMuaG9yaXpvbnRhbFBhZGRpbmc7XHJcbiAgICAgICAgdGhpcy50ZXh0QW5jaG9yID0gJ3N0YXJ0JztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnkgPSB0aGlzLmJhclkgKyB0aGlzLmJhckhlaWdodCAvIDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBvcmllbnRhdGlvbiBtdXN0IGJlIFwidmVydGljYWxcIlxyXG4gICAgICB0aGlzLnggPSB0aGlzLmJhclggKyB0aGlzLmJhcldpZHRoIC8gMjtcclxuICAgICAgdGhpcy55ID0gdGhpcy5iYXJZICsgdGhpcy5iYXJIZWlnaHQ7XHJcblxyXG4gICAgICBpZiAodGhpcy52YWx1ZSA8IDApIHtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKyB0aGlzLnZlcnRpY2FsUGFkZGluZztcclxuICAgICAgICB0aGlzLnRleHRBbmNob3IgPSAnZW5kJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLSB0aGlzLnZlcnRpY2FsUGFkZGluZztcclxuICAgICAgICB0aGlzLnRleHRBbmNob3IgPSAnc3RhcnQnO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudHJhbnNmb3JtID0gYHJvdGF0ZSgtNDUsICR7dGhpcy54fSAsICR7dGhpcy55fSlgO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=