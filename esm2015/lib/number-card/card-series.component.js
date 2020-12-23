import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { invertColor } from '../utils/color-utils';
export class CardSeriesComponent {
    constructor() {
        this.innerPadding = 15;
        this.emptyColor = 'rgba(0, 0, 0, 0)';
        this.animations = true;
        this.select = new EventEmitter();
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        if (this.data.length > 2) {
            const valueFormatting = this.valueFormatting || (card => card.value.toLocaleString());
            const sortedLengths = this.data
                .map(d => {
                const hasValue = d && d.data && typeof d.data.value !== 'undefined' && d.data.value !== null;
                return hasValue
                    ? valueFormatting({
                        data: d.data,
                        label: d ? d.data.name : '',
                        value: d && d.data ? d.data.value : ''
                    }).length
                    : 0;
            })
                .sort((a, b) => b - a);
            const idx = Math.ceil(this.data.length / 2);
            this.medianSize = sortedLengths[idx];
        }
        const cards = this.getCards();
        this.cards = cards.filter(d => d.data.value !== null);
        this.emptySlots = cards.filter(d => d.data.value === null);
    }
    getCards() {
        const yPadding = typeof this.innerPadding === 'number' ? this.innerPadding : this.innerPadding[0] + this.innerPadding[2];
        const xPadding = typeof this.innerPadding === 'number' ? this.innerPadding : this.innerPadding[1] + this.innerPadding[3];
        return this.data.map((d, index) => {
            let label = d.data.name;
            if (label && label.constructor.name === 'Date') {
                label = label.toLocaleDateString();
            }
            else {
                label = label ? label.toLocaleString() : label;
            }
            const value = d.data.value;
            const valueColor = label ? this.colors.getColor(label) : this.emptyColor;
            const color = this.cardColor || valueColor || '#000';
            return {
                x: d.x,
                y: d.y,
                width: d.width - xPadding,
                height: d.height - yPadding,
                color,
                bandColor: this.bandColor || valueColor,
                textColor: this.textColor || invertColor(color),
                label,
                data: d.data,
                tooltipText: `${label}: ${value}`
            };
        });
    }
    trackBy(index, card) {
        return card.label;
    }
    onClick(data) {
        this.select.emit(data);
    }
}
CardSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-card-series]',
                template: `
    <svg:rect
      *ngFor="let c of emptySlots; trackBy: trackBy"
      class="card-empty"
      [attr.x]="c.x"
      [attr.y]="c.y"
      [style.fill]="emptyColor"
      [attr.width]="c.width"
      [attr.height]="c.height"
      rx="3"
      ry="3"
    />
    <svg:g
      ngx-charts-card
      *ngFor="let c of cards; trackBy: trackBy"
      [x]="c.x"
      [y]="c.y"
      [width]="c.width"
      [height]="c.height"
      [color]="c.color"
      [bandColor]="c.bandColor"
      [textColor]="c.textColor"
      [data]="c.data"
      [label]="c.label"
      [medianSize]="medianSize"
      [valueFormatting]="valueFormatting"
      [labelFormatting]="labelFormatting"
      [animations]="animations"
      (select)="onClick($event)"
    />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
CardSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    slots: [{ type: Input }],
    dims: [{ type: Input }],
    colors: [{ type: Input }],
    innerPadding: [{ type: Input }],
    cardColor: [{ type: Input }],
    bandColor: [{ type: Input }],
    emptyColor: [{ type: Input }],
    textColor: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1zZXJpZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL251bWJlci1jYXJkL2NhcmQtc2VyaWVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFnRG5ELE1BQU0sT0FBTyxtQkFBbUI7SUFuQ2hDO1FBd0NXLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBSWxCLGVBQVUsR0FBRyxrQkFBa0IsQ0FBQztRQUloQyxlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTFCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBMEV4QyxDQUFDO0lBcEVDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFFdEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUk7aUJBQzVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDUCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FB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TixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxRQUFRO2dCQUN6QixNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxRQUFRO2dCQUMzQixLQUFLO2dCQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLFVBQVU7Z0JBQ3ZDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLEtBQUs7Z0JBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO2dCQUNaLFdBQVcsRUFBRSxHQUFHLEtBQUssS0FBSyxLQUFLLEVBQUU7YUFDbEMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSTtRQUNqQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJO1FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQzs7O1lBM0hGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O21CQUVFLEtBQUs7b0JBQ0wsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7MkJBQ0wsS0FBSzt3QkFFTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGludmVydENvbG9yIH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItdXRpbHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDYXJkTW9kZWwge1xyXG4gIHg7XHJcbiAgeTtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG4gIGNvbG9yOiBzdHJpbmc7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBkYXRhO1xyXG4gIHRvb2x0aXBUZXh0OiBzdHJpbmc7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWNhcmQtc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6cmVjdFxyXG4gICAgICAqbmdGb3I9XCJsZXQgYyBvZiBlbXB0eVNsb3RzOyB0cmFja0J5OiB0cmFja0J5XCJcclxuICAgICAgY2xhc3M9XCJjYXJkLWVtcHR5XCJcclxuICAgICAgW2F0dHIueF09XCJjLnhcIlxyXG4gICAgICBbYXR0ci55XT1cImMueVwiXHJcbiAgICAgIFtzdHlsZS5maWxsXT1cImVtcHR5Q29sb3JcIlxyXG4gICAgICBbYXR0ci53aWR0aF09XCJjLndpZHRoXCJcclxuICAgICAgW2F0dHIuaGVpZ2h0XT1cImMuaGVpZ2h0XCJcclxuICAgICAgcng9XCIzXCJcclxuICAgICAgcnk9XCIzXCJcclxuICAgIC8+XHJcbiAgICA8c3ZnOmdcclxuICAgICAgbmd4LWNoYXJ0cy1jYXJkXHJcbiAgICAgICpuZ0Zvcj1cImxldCBjIG9mIGNhcmRzOyB0cmFja0J5OiB0cmFja0J5XCJcclxuICAgICAgW3hdPVwiYy54XCJcclxuICAgICAgW3ldPVwiYy55XCJcclxuICAgICAgW3dpZHRoXT1cImMud2lkdGhcIlxyXG4gICAgICBbaGVpZ2h0XT1cImMuaGVpZ2h0XCJcclxuICAgICAgW2NvbG9yXT1cImMuY29sb3JcIlxyXG4gICAgICBbYmFuZENvbG9yXT1cImMuYmFuZENvbG9yXCJcclxuICAgICAgW3RleHRDb2xvcl09XCJjLnRleHRDb2xvclwiXHJcbiAgICAgIFtkYXRhXT1cImMuZGF0YVwiXHJcbiAgICAgIFtsYWJlbF09XCJjLmxhYmVsXCJcclxuICAgICAgW21lZGlhblNpemVdPVwibWVkaWFuU2l6ZVwiXHJcbiAgICAgIFt2YWx1ZUZvcm1hdHRpbmddPVwidmFsdWVGb3JtYXR0aW5nXCJcclxuICAgICAgW2xhYmVsRm9ybWF0dGluZ109XCJsYWJlbEZvcm1hdHRpbmdcIlxyXG4gICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKCRldmVudClcIlxyXG4gICAgLz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYXJkU2VyaWVzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBkYXRhOiBhbnlbXTtcclxuICBASW5wdXQoKSBzbG90czogYW55W107XHJcbiAgQElucHV0KCkgZGltcztcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgaW5uZXJQYWRkaW5nID0gMTU7XHJcblxyXG4gIEBJbnB1dCgpIGNhcmRDb2xvcjtcclxuICBASW5wdXQoKSBiYW5kQ29sb3I7XHJcbiAgQElucHV0KCkgZW1wdHlDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDApJztcclxuICBASW5wdXQoKSB0ZXh0Q29sb3I7XHJcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgbGFiZWxGb3JtYXR0aW5nOiBhbnk7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNhcmRzOiBDYXJkTW9kZWxbXTtcclxuICBlbXB0eVNsb3RzOiBhbnlbXTtcclxuICBtZWRpYW5TaXplOiBudW1iZXI7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA+IDIpIHtcclxuICAgICAgY29uc3QgdmFsdWVGb3JtYXR0aW5nID0gdGhpcy52YWx1ZUZvcm1hdHRpbmcgfHwgKGNhcmQgPT4gY2FyZC52YWx1ZS50b0xvY2FsZVN0cmluZygpKTtcclxuXHJcbiAgICAgIGNvbnN0IHNvcnRlZExlbmd0aHMgPSB0aGlzLmRhdGFcclxuICAgICAgICAubWFwKGQgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaGFzVmFsdWUgPSBkICYmIGQuZGF0YSAmJiB0eXBlb2YgZC5kYXRhLnZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiBkLmRhdGEudmFsdWUgIT09IG51bGw7XHJcbiAgICAgICAgICByZXR1cm4gaGFzVmFsdWVcclxuICAgICAgICAgICAgPyB2YWx1ZUZvcm1hdHRpbmcoe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogZC5kYXRhLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IGQgPyBkLmRhdGEubmFtZSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGQgJiYgZC5kYXRhID8gZC5kYXRhLnZhbHVlIDogJydcclxuICAgICAgICAgICAgICB9KS5sZW5ndGhcclxuICAgICAgICAgICAgOiAwO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIgLSBhKTtcclxuICAgICAgY29uc3QgaWR4ID0gTWF0aC5jZWlsKHRoaXMuZGF0YS5sZW5ndGggLyAyKTtcclxuICAgICAgdGhpcy5tZWRpYW5TaXplID0gc29ydGVkTGVuZ3Roc1tpZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhcmRzID0gdGhpcy5nZXRDYXJkcygpO1xyXG4gICAgdGhpcy5jYXJkcyA9IGNhcmRzLmZpbHRlcihkID0+IGQuZGF0YS52YWx1ZSAhPT0gbnVsbCk7XHJcbiAgICB0aGlzLmVtcHR5U2xvdHMgPSBjYXJkcy5maWx0ZXIoZCA9PiBkLmRhdGEudmFsdWUgPT09IG51bGwpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2FyZHMoKTogYW55W10ge1xyXG4gICAgY29uc3QgeVBhZGRpbmcgPVxyXG4gICAgICB0eXBlb2YgdGhpcy5pbm5lclBhZGRpbmcgPT09ICdudW1iZXInID8gdGhpcy5pbm5lclBhZGRpbmcgOiB0aGlzLmlubmVyUGFkZGluZ1swXSArIHRoaXMuaW5uZXJQYWRkaW5nWzJdO1xyXG4gICAgY29uc3QgeFBhZGRpbmcgPVxyXG4gICAgICB0eXBlb2YgdGhpcy5pbm5lclBhZGRpbmcgPT09ICdudW1iZXInID8gdGhpcy5pbm5lclBhZGRpbmcgOiB0aGlzLmlubmVyUGFkZGluZ1sxXSArIHRoaXMuaW5uZXJQYWRkaW5nWzNdO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmRhdGEubWFwKChkLCBpbmRleCkgPT4ge1xyXG4gICAgICBsZXQgbGFiZWwgPSBkLmRhdGEubmFtZTtcclxuICAgICAgaWYgKGxhYmVsICYmIGxhYmVsLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdEYXRlJykge1xyXG4gICAgICAgIGxhYmVsID0gbGFiZWwudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGFiZWwgPSBsYWJlbCA/IGxhYmVsLnRvTG9jYWxlU3RyaW5nKCkgOiBsYWJlbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdmFsdWUgPSBkLmRhdGEudmFsdWU7XHJcbiAgICAgIGNvbnN0IHZhbHVlQ29sb3IgPSBsYWJlbCA/IHRoaXMuY29sb3JzLmdldENvbG9yKGxhYmVsKSA6IHRoaXMuZW1wdHlDb2xvcjtcclxuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNhcmRDb2xvciB8fCB2YWx1ZUNvbG9yIHx8ICcjMDAwJztcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBkLngsXHJcbiAgICAgICAgeTogZC55LFxyXG4gICAgICAgIHdpZHRoOiBkLndpZHRoIC0geFBhZGRpbmcsXHJcbiAgICAgICAgaGVpZ2h0OiBkLmhlaWdodCAtIHlQYWRkaW5nLFxyXG4gICAgICAgIGNvbG9yLFxyXG4gICAgICAgIGJhbmRDb2xvcjogdGhpcy5iYW5kQ29sb3IgfHwgdmFsdWVDb2xvcixcclxuICAgICAgICB0ZXh0Q29sb3I6IHRoaXMudGV4dENvbG9yIHx8IGludmVydENvbG9yKGNvbG9yKSxcclxuICAgICAgICBsYWJlbCxcclxuICAgICAgICBkYXRhOiBkLmRhdGEsXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGAke2xhYmVsfTogJHt2YWx1ZX1gXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHRyYWNrQnkoaW5kZXgsIGNhcmQpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGNhcmQubGFiZWw7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGRhdGEpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==