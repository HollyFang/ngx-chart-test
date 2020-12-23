import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { count, decimalChecker } from './count.helper';
/**
 * Count up component
 *
 * Loosely inspired by:
 *  - https://github.com/izupet/angular2-counto
 *  - https://inorganik.github.io/countUp.js/
 *
 * @export
 */
export class CountUpDirective {
    constructor(cd, element) {
        this.cd = cd;
        this.countDuration = 1;
        this.countPrefix = '';
        this.countSuffix = '';
        this.countChange = new EventEmitter();
        this.countFinish = new EventEmitter();
        this.value = '';
        this._countDecimals = 0;
        this._countTo = 0;
        this._countFrom = 0;
        this.nativeElement = element.nativeElement;
    }
    set countDecimals(val) {
        this._countDecimals = val;
    }
    get countDecimals() {
        if (this._countDecimals)
            return this._countDecimals;
        return decimalChecker(this.countTo);
    }
    set countTo(val) {
        this._countTo = parseFloat(val);
        this.start();
    }
    get countTo() {
        return this._countTo;
    }
    set countFrom(val) {
        this._countFrom = parseFloat(val);
        this.start();
    }
    get countFrom() {
        return this._countFrom;
    }
    ngOnDestroy() {
        cancelAnimationFrame(this.animationReq);
    }
    start() {
        cancelAnimationFrame(this.animationReq);
        const valueFormatting = this.valueFormatting || (value => `${this.countPrefix}${value.toLocaleString()}${this.countSuffix}`);
        const callback = ({ value, progress, finished }) => {
            this.value = valueFormatting(value);
            this.cd.markForCheck();
            if (!finished)
                this.countChange.emit({ value: this.value, progress });
            if (finished)
                this.countFinish.emit({ value: this.value, progress });
        };
        this.animationReq = count(this.countFrom, this.countTo, this.countDecimals, this.countDuration, callback);
    }
}
CountUpDirective.decorators = [
    { type: Component, args: [{
                selector: '[ngx-charts-count-up]',
                template: ` {{ value }} `
            },] }
];
CountUpDirective.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef }
];
CountUpDirective.propDecorators = {
    countDuration: [{ type: Input }],
    countPrefix: [{ type: Input }],
    countSuffix: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    countDecimals: [{ type: Input }],
    countTo: [{ type: Input }],
    countFrom: [{ type: Input }],
    countChange: [{ type: Output }],
    countFinish: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi9jb3VudC9jb3VudC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBYSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakgsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RDs7Ozs7Ozs7R0FRRztBQUtILE1BQU0sT0FBTyxnQkFBZ0I7SUFrRDNCLFlBQW9CLEVBQXFCLEVBQUUsT0FBbUI7UUFBMUMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFqRGhDLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBaUN4QixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBSTNDLFVBQUssR0FBUSxFQUFFLENBQUM7UUFLUixtQkFBYyxHQUFXLENBQUMsQ0FBQztRQUMzQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFHN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQzdDLENBQUM7SUE5Q0QsSUFDSSxhQUFhLENBQUMsR0FBVztRQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsSUFBSSxJQUFJLENBQUMsY0FBYztZQUFFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNwRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELElBQ0ksT0FBTyxDQUFDLEdBQUc7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUNJLFNBQVMsQ0FBQyxHQUFHO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBb0JELFdBQVc7UUFDVCxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELEtBQUs7UUFDSCxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFeEMsTUFBTSxlQUFlLEdBQ25CLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFdkcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtZQUNqRCxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxRQUFRO2dCQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0RSxJQUFJLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUcsQ0FBQzs7O1lBNUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUUsZUFBZTthQUMxQjs7O1lBZmdELGlCQUFpQjtZQUFhLFVBQVU7Ozs0QkFpQnRGLEtBQUs7MEJBQ0wsS0FBSzswQkFDTCxLQUFLOzhCQUNMLEtBQUs7NEJBRUwsS0FBSztzQkFVTCxLQUFLO3dCQVVMLEtBQUs7MEJBVUwsTUFBTTswQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdG9yUmVmLCBPbkRlc3Ryb3ksIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgY291bnQsIGRlY2ltYWxDaGVja2VyIH0gZnJvbSAnLi9jb3VudC5oZWxwZXInO1xyXG5cclxuLyoqXHJcbiAqIENvdW50IHVwIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBMb29zZWx5IGluc3BpcmVkIGJ5OlxyXG4gKiAgLSBodHRwczovL2dpdGh1Yi5jb20vaXp1cGV0L2FuZ3VsYXIyLWNvdW50b1xyXG4gKiAgLSBodHRwczovL2lub3JnYW5pay5naXRodWIuaW8vY291bnRVcC5qcy9cclxuICpcclxuICogQGV4cG9ydFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdbbmd4LWNoYXJ0cy1jb3VudC11cF0nLFxyXG4gIHRlbXBsYXRlOiBgIHt7IHZhbHVlIH19IGBcclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50VXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpIGNvdW50RHVyYXRpb246IG51bWJlciA9IDE7XHJcbiAgQElucHV0KCkgY291bnRQcmVmaXg6IHN0cmluZyA9ICcnO1xyXG4gIEBJbnB1dCgpIGNvdW50U3VmZml4OiBzdHJpbmcgPSAnJztcclxuICBASW5wdXQoKSB2YWx1ZUZvcm1hdHRpbmc6IGFueTtcclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgY291bnREZWNpbWFscyh2YWw6IG51bWJlcikge1xyXG4gICAgdGhpcy5fY291bnREZWNpbWFscyA9IHZhbDtcclxuICB9XHJcblxyXG4gIGdldCBjb3VudERlY2ltYWxzKCk6IG51bWJlciB7XHJcbiAgICBpZiAodGhpcy5fY291bnREZWNpbWFscykgcmV0dXJuIHRoaXMuX2NvdW50RGVjaW1hbHM7XHJcbiAgICByZXR1cm4gZGVjaW1hbENoZWNrZXIodGhpcy5jb3VudFRvKTtcclxuICB9XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgc2V0IGNvdW50VG8odmFsKSB7XHJcbiAgICB0aGlzLl9jb3VudFRvID0gcGFyc2VGbG9hdCh2YWwpO1xyXG4gICAgdGhpcy5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvdW50VG8oKTogYW55IHtcclxuICAgIHJldHVybiB0aGlzLl9jb3VudFRvO1xyXG4gIH1cclxuXHJcbiAgQElucHV0KClcclxuICBzZXQgY291bnRGcm9tKHZhbCkge1xyXG4gICAgdGhpcy5fY291bnRGcm9tID0gcGFyc2VGbG9hdCh2YWwpO1xyXG4gICAgdGhpcy5zdGFydCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvdW50RnJvbSgpOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvdW50RnJvbTtcclxuICB9XHJcblxyXG4gIEBPdXRwdXQoKSBjb3VudENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY291bnRGaW5pc2ggPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5hdGl2ZUVsZW1lbnQ6IGFueTtcclxuXHJcbiAgdmFsdWU6IGFueSA9ICcnO1xyXG4gIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmc7XHJcblxyXG4gIHByaXZhdGUgYW5pbWF0aW9uUmVxOiBhbnk7XHJcblxyXG4gIHByaXZhdGUgX2NvdW50RGVjaW1hbHM6IG51bWJlciA9IDA7XHJcbiAgcHJpdmF0ZSBfY291bnRUbzogbnVtYmVyID0gMDtcclxuICBwcml2YXRlIF9jb3VudEZyb206IG51bWJlciA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBlbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uUmVxKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25SZXEpO1xyXG5cclxuICAgIGNvbnN0IHZhbHVlRm9ybWF0dGluZyA9XHJcbiAgICAgIHRoaXMudmFsdWVGb3JtYXR0aW5nIHx8ICh2YWx1ZSA9PiBgJHt0aGlzLmNvdW50UHJlZml4fSR7dmFsdWUudG9Mb2NhbGVTdHJpbmcoKX0ke3RoaXMuY291bnRTdWZmaXh9YCk7XHJcblxyXG4gICAgY29uc3QgY2FsbGJhY2sgPSAoeyB2YWx1ZSwgcHJvZ3Jlc3MsIGZpbmlzaGVkIH0pID0+IHtcclxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlRm9ybWF0dGluZyh2YWx1ZSk7XHJcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIGlmICghZmluaXNoZWQpIHRoaXMuY291bnRDaGFuZ2UuZW1pdCh7IHZhbHVlOiB0aGlzLnZhbHVlLCBwcm9ncmVzcyB9KTtcclxuICAgICAgaWYgKGZpbmlzaGVkKSB0aGlzLmNvdW50RmluaXNoLmVtaXQoeyB2YWx1ZTogdGhpcy52YWx1ZSwgcHJvZ3Jlc3MgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYW5pbWF0aW9uUmVxID0gY291bnQodGhpcy5jb3VudEZyb20sIHRoaXMuY291bnRUbywgdGhpcy5jb3VudERlY2ltYWxzLCB0aGlzLmNvdW50RHVyYXRpb24sIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuIl19