import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { formatLabel } from '../label.helper';
export class AdvancedLegendComponent {
    constructor() {
        this.label = 'Total';
        this.animations = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.legendItems = [];
        this.labelFormatting = label => label;
        this.percentageFormatting = percentage => percentage;
        this.defaultValueFormatting = value => value.toLocaleString();
    }
    ngOnChanges(changes) {
        this.update();
    }
    getTotal() {
        return this.data.map(d => d.value).reduce((sum, d) => sum + d, 0);
    }
    update() {
        this.total = this.getTotal();
        this.roundedTotal = this.total;
        this.legendItems = this.getLegendItems();
    }
    getLegendItems() {
        return this.data.map(d => {
            const label = formatLabel(d.name);
            const value = d.value;
            const color = this.colors.getColor(label);
            const percentage = this.total > 0 ? (value / this.total) * 100 : 0;
            const formattedLabel = typeof this.labelFormatting === 'function' ? this.labelFormatting(label) : label;
            return {
                _value: value,
                data: d,
                value,
                color,
                label: formattedLabel,
                displayLabel: trimLabel(formattedLabel, 20),
                origialLabel: d.name,
                percentage: this.percentageFormatting ? this.percentageFormatting(percentage) : percentage.toLocaleString()
            };
        });
    }
    trackBy(item) {
        return item.formattedLabel;
    }
}
AdvancedLegendComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-advanced-legend',
                template: `
    <div class="advanced-pie-legend" [style.width.px]="width">
      <div
        *ngIf="animations"
        class="total-value"
        ngx-charts-count-up
        [countTo]="roundedTotal"
        [valueFormatting]="valueFormatting"
      ></div>
      <div class="total-value" *ngIf="!animations">
        {{ valueFormatting ? valueFormatting(roundedTotal) : defaultValueFormatting(roundedTotal) }}
      </div>
      <div class="total-label">
        {{ label }}
      </div>
      <div class="legend-items-container">
        <div class="legend-items">
          <div
            *ngFor="let legendItem of legendItems; trackBy: trackBy"
            tabindex="-1"
            class="legend-item"
            (mouseenter)="activate.emit(legendItem.data)"
            (mouseleave)="deactivate.emit(legendItem.data)"
            (click)="select.emit(legendItem.data)"
          >
            <div class="item-color" [style.border-left-color]="legendItem.color"></div>
            <div
              *ngIf="animations"
              class="item-value"
              ngx-charts-count-up
              [countTo]="legendItem._value"
              [valueFormatting]="valueFormatting"
            ></div>
            <div *ngIf="!animations" class="item-value">
              {{ valueFormatting ? valueFormatting(legendItem.value) : defaultValueFormatting(legendItem.value) }}
            </div>
            <div class="item-label">{{ legendItem.displayLabel }}</div>
            <div
              *ngIf="animations"
              class="item-percent"
              ngx-charts-count-up
              [countTo]="legendItem.percentage"
              [countSuffix]="'%'"
            ></div>
            <div *ngIf="!animations" class="item-percent">{{ legendItem.percentage.toLocaleString() }}%</div>
          </div>
        </div>
      </div>
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".advanced-pie-legend{float:left;position:relative;top:50%;transform:translateY(-50%)}.advanced-pie-legend .total-value{font-size:36px}.advanced-pie-legend .total-label{font-size:24px;margin-bottom:19px}.advanced-pie-legend .legend-items-container{width:100%}.advanced-pie-legend .legend-items-container .legend-items{overflow:auto;white-space:nowrap}.advanced-pie-legend .legend-items-container .legend-items .legend-item{cursor:pointer;display:inline-block;margin-right:20px}.advanced-pie-legend .legend-items-container .legend-items .legend-item:focus{outline:none}.advanced-pie-legend .legend-items-container .legend-items .legend-item:hover{color:#000;transition:.2s}.advanced-pie-legend .legend-items-container .legend-items .legend-item .item-value{font-size:24px;margin-left:11px;margin-top:-6px}.advanced-pie-legend .legend-items-container .legend-items .legend-item .item-label{font-size:14px;margin-left:11px;margin-top:-6px;opacity:.7}.advanced-pie-legend .legend-items-container .legend-items .legend-item .item-percent{font-size:24px;margin-left:11px;opacity:.7}.advanced-pie-legend .legend-items-container .legend-items .legend-item .item-color{border-left:4px solid;float:left;height:42px;margin-right:7px;width:4px}"]
            },] }
];
AdvancedLegendComponent.propDecorators = {
    width: [{ type: Input }],
    data: [{ type: Input }],
    colors: [{ type: Input }],
    label: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    valueFormatting: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    percentageFormatting: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWR2YW5jZWQtbGVnZW5kLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vbGVnZW5kL2FkdmFuY2VkLWxlZ2VuZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFFTCxNQUFNLEVBRU4saUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUEwRDlDLE1BQU0sT0FBTyx1QkFBdUI7SUF4RHBDO1FBNERXLFVBQUssR0FBVyxPQUFPLENBQUM7UUFDeEIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUxQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU3RCxnQkFBVyxHQUFVLEVBQUUsQ0FBQztRQUtmLG9CQUFlLEdBQTJCLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3pELHlCQUFvQixHQUEyQixVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQztRQUVqRiwyQkFBc0IsR0FBMkIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUF5Q25GLENBQUM7SUF2Q0MsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUUvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsTUFBTSxjQUFjLEdBQUcsT0FBTyxJQUFJLENBQUMsZUFBZSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRXhHLE9BQU87Z0JBQ0wsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUssRUFBRSxjQUFjO2dCQUNyQixZQUFZLEVBQUUsU0FBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7Z0JBQzNDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSTtnQkFDcEIsVUFBVSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO2FBQzVHLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBSTtRQUNWLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDOzs7WUFuSEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlEVDtnQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7b0JBRUUsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7b0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNOzhCQU1OLEtBQUs7OEJBQ0wsS0FBSzttQ0FDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBWaWV3RW5jYXBzdWxhdGlvblxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmltTGFiZWwgfSBmcm9tICcuLi90cmltLWxhYmVsLmhlbHBlcic7XHJcbmltcG9ydCB7IGZvcm1hdExhYmVsIH0gZnJvbSAnLi4vbGFiZWwuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1hZHZhbmNlZC1sZWdlbmQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwiYWR2YW5jZWQtcGllLWxlZ2VuZFwiIFtzdHlsZS53aWR0aC5weF09XCJ3aWR0aFwiPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgKm5nSWY9XCJhbmltYXRpb25zXCJcclxuICAgICAgICBjbGFzcz1cInRvdGFsLXZhbHVlXCJcclxuICAgICAgICBuZ3gtY2hhcnRzLWNvdW50LXVwXHJcbiAgICAgICAgW2NvdW50VG9dPVwicm91bmRlZFRvdGFsXCJcclxuICAgICAgICBbdmFsdWVGb3JtYXR0aW5nXT1cInZhbHVlRm9ybWF0dGluZ1wiXHJcbiAgICAgID48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInRvdGFsLXZhbHVlXCIgKm5nSWY9XCIhYW5pbWF0aW9uc1wiPlxyXG4gICAgICAgIHt7IHZhbHVlRm9ybWF0dGluZyA/IHZhbHVlRm9ybWF0dGluZyhyb3VuZGVkVG90YWwpIDogZGVmYXVsdFZhbHVlRm9ybWF0dGluZyhyb3VuZGVkVG90YWwpIH19XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidG90YWwtbGFiZWxcIj5cclxuICAgICAgICB7eyBsYWJlbCB9fVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImxlZ2VuZC1pdGVtcy1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibGVnZW5kLWl0ZW1zXCI+XHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBsZWdlbmRJdGVtIG9mIGxlZ2VuZEl0ZW1zOyB0cmFja0J5OiB0cmFja0J5XCJcclxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwibGVnZW5kLWl0ZW1cIlxyXG4gICAgICAgICAgICAobW91c2VlbnRlcik9XCJhY3RpdmF0ZS5lbWl0KGxlZ2VuZEl0ZW0uZGF0YSlcIlxyXG4gICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJkZWFjdGl2YXRlLmVtaXQobGVnZW5kSXRlbS5kYXRhKVwiXHJcbiAgICAgICAgICAgIChjbGljayk9XCJzZWxlY3QuZW1pdChsZWdlbmRJdGVtLmRhdGEpXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml0ZW0tY29sb3JcIiBbc3R5bGUuYm9yZGVyLWxlZnQtY29sb3JdPVwibGVnZW5kSXRlbS5jb2xvclwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgKm5nSWY9XCJhbmltYXRpb25zXCJcclxuICAgICAgICAgICAgICBjbGFzcz1cIml0ZW0tdmFsdWVcIlxyXG4gICAgICAgICAgICAgIG5neC1jaGFydHMtY291bnQtdXBcclxuICAgICAgICAgICAgICBbY291bnRUb109XCJsZWdlbmRJdGVtLl92YWx1ZVwiXHJcbiAgICAgICAgICAgICAgW3ZhbHVlRm9ybWF0dGluZ109XCJ2YWx1ZUZvcm1hdHRpbmdcIlxyXG4gICAgICAgICAgICA+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhYW5pbWF0aW9uc1wiIGNsYXNzPVwiaXRlbS12YWx1ZVwiPlxyXG4gICAgICAgICAgICAgIHt7IHZhbHVlRm9ybWF0dGluZyA/IHZhbHVlRm9ybWF0dGluZyhsZWdlbmRJdGVtLnZhbHVlKSA6IGRlZmF1bHRWYWx1ZUZvcm1hdHRpbmcobGVnZW5kSXRlbS52YWx1ZSkgfX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdGVtLWxhYmVsXCI+e3sgbGVnZW5kSXRlbS5kaXNwbGF5TGFiZWwgfX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICpuZ0lmPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgICAgICAgICAgY2xhc3M9XCJpdGVtLXBlcmNlbnRcIlxyXG4gICAgICAgICAgICAgIG5neC1jaGFydHMtY291bnQtdXBcclxuICAgICAgICAgICAgICBbY291bnRUb109XCJsZWdlbmRJdGVtLnBlcmNlbnRhZ2VcIlxyXG4gICAgICAgICAgICAgIFtjb3VudFN1ZmZpeF09XCInJSdcIlxyXG4gICAgICAgICAgICA+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhYW5pbWF0aW9uc1wiIGNsYXNzPVwiaXRlbS1wZXJjZW50XCI+e3sgbGVnZW5kSXRlbS5wZXJjZW50YWdlLnRvTG9jYWxlU3RyaW5nKCkgfX0lPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWycuL2FkdmFuY2VkLWxlZ2VuZC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIEFkdmFuY2VkTGVnZW5kQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSB3aWR0aDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgY29sb3JzO1xyXG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmcgPSAnVG90YWwnO1xyXG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbGVnZW5kSXRlbXM6IGFueVtdID0gW107XHJcbiAgdG90YWw6IG51bWJlcjtcclxuICByb3VuZGVkVG90YWw6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KCkgdmFsdWVGb3JtYXR0aW5nOiAodmFsdWU6IG51bWJlcikgPT4gYW55O1xyXG4gIEBJbnB1dCgpIGxhYmVsRm9ybWF0dGluZzogKHZhbHVlOiBzdHJpbmcpID0+IGFueSA9IGxhYmVsID0+IGxhYmVsO1xyXG4gIEBJbnB1dCgpIHBlcmNlbnRhZ2VGb3JtYXR0aW5nOiAodmFsdWU6IG51bWJlcikgPT4gYW55ID0gcGVyY2VudGFnZSA9PiBwZXJjZW50YWdlO1xyXG5cclxuICBkZWZhdWx0VmFsdWVGb3JtYXR0aW5nOiAodmFsdWU6IG51bWJlcikgPT4gYW55ID0gdmFsdWUgPT4gdmFsdWUudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIGdldFRvdGFsKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhLm1hcChkID0+IGQudmFsdWUpLnJlZHVjZSgoc3VtLCBkKSA9PiBzdW0gKyBkLCAwKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMudG90YWwgPSB0aGlzLmdldFRvdGFsKCk7XHJcbiAgICB0aGlzLnJvdW5kZWRUb3RhbCA9IHRoaXMudG90YWw7XHJcblxyXG4gICAgdGhpcy5sZWdlbmRJdGVtcyA9IHRoaXMuZ2V0TGVnZW5kSXRlbXMoKTtcclxuICB9XHJcblxyXG4gIGdldExlZ2VuZEl0ZW1zKCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhLm1hcChkID0+IHtcclxuICAgICAgY29uc3QgbGFiZWwgPSBmb3JtYXRMYWJlbChkLm5hbWUpO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IGQudmFsdWU7XHJcbiAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IobGFiZWwpO1xyXG4gICAgICBjb25zdCBwZXJjZW50YWdlID0gdGhpcy50b3RhbCA+IDAgPyAodmFsdWUgLyB0aGlzLnRvdGFsKSAqIDEwMCA6IDA7XHJcbiAgICAgIGNvbnN0IGZvcm1hdHRlZExhYmVsID0gdHlwZW9mIHRoaXMubGFiZWxGb3JtYXR0aW5nID09PSAnZnVuY3Rpb24nID8gdGhpcy5sYWJlbEZvcm1hdHRpbmcobGFiZWwpIDogbGFiZWw7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIF92YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgZGF0YTogZCxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICBsYWJlbDogZm9ybWF0dGVkTGFiZWwsXHJcbiAgICAgICAgZGlzcGxheUxhYmVsOiB0cmltTGFiZWwoZm9ybWF0dGVkTGFiZWwsIDIwKSxcclxuICAgICAgICBvcmlnaWFsTGFiZWw6IGQubmFtZSxcclxuICAgICAgICBwZXJjZW50YWdlOiB0aGlzLnBlcmNlbnRhZ2VGb3JtYXR0aW5nID8gdGhpcy5wZXJjZW50YWdlRm9ybWF0dGluZyhwZXJjZW50YWdlKSA6IHBlcmNlbnRhZ2UudG9Mb2NhbGVTdHJpbmcoKVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0cmFja0J5KGl0ZW0pIHtcclxuICAgIHJldHVybiBpdGVtLmZvcm1hdHRlZExhYmVsO1xyXG4gIH1cclxufVxyXG4iXX0=