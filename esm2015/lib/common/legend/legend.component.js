import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { formatLabel } from '../label.helper';
export class LegendComponent {
    constructor(cd) {
        this.cd = cd;
        this.horizontal = false;
        this.labelClick = new EventEmitter();
        this.labelActivate = new EventEmitter();
        this.labelDeactivate = new EventEmitter();
        this.legendEntries = [];
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.cd.markForCheck();
        this.legendEntries = this.getLegendEntries();
    }
    getLegendEntries() {
        const items = [];
        for (const label of this.data) {
            const formattedLabel = formatLabel(label);
            const idx = items.findIndex(i => {
                return i.label === formattedLabel;
            });
            if (idx === -1) {
                items.push({
                    label,
                    formattedLabel,
                    color: this.colors.getColor(label)
                });
            }
        }
        return items;
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.label === d.name;
        });
        return item !== undefined;
    }
    activate(item) {
        this.labelActivate.emit(item);
    }
    deactivate(item) {
        this.labelDeactivate.emit(item);
    }
    trackBy(index, item) {
        return item.label;
    }
}
LegendComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-legend',
                template: `
    <div [style.width.px]="width">
      <header class="legend-title" *ngIf="title?.length > 0">
        <span class="legend-title-text">{{ title }}</span>
      </header>
      <div class="legend-wrap">
        <ul class="legend-labels" [class.horizontal-legend]="horizontal" [style.max-height.px]="height - 45">
          <li *ngFor="let entry of legendEntries; trackBy: trackBy" class="legend-label">
            <ngx-charts-legend-entry
              [label]="entry.label"
              [formattedLabel]="entry.formattedLabel"
              [color]="entry.color"
              [isActive]="isActive(entry)"
              (select)="labelClick.emit($event)"
              (activate)="activate($event)"
              (deactivate)="deactivate($event)"
            >
            </ngx-charts-legend-entry>
          </li>
        </ul>
      </div>
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".chart-legend{display:inline-block;padding:0;width:auto!important}.chart-legend .legend-title{font-size:14px;font-weight:700;margin-bottom:5px;margin-left:10px;overflow:hidden;white-space:nowrap}.chart-legend li,.chart-legend ul{list-style:none;margin:0;padding:0}.chart-legend .horizontal-legend li{display:inline-block}.chart-legend .legend-wrap{width:calc(100% - 10px)}.chart-legend .legend-labels{background:rgba(0,0,0,.05);border-radius:3px;float:left;line-height:85%;list-style:none;overflow-x:hidden;overflow-y:auto;text-align:left;white-space:nowrap;width:100%}.chart-legend .legend-label{color:#afb7c8;cursor:pointer;font-size:90%;margin:8px}.chart-legend .legend-label:hover{color:#000;transition:.2s}.chart-legend .legend-label .active .legend-label-text{color:#000}.chart-legend .legend-label-color{border-radius:3px;color:#5b646b;display:inline-block;height:15px;margin-right:5px;width:15px}.chart-legend .legend-label-text{font-size:12px;line-height:15px;vertical-align:top;width:calc(100% - 20px)}.chart-legend .legend-label-text,.chart-legend .legend-title-text{display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chart-legend .legend-title-text{line-height:16px;vertical-align:bottom}"]
            },] }
];
LegendComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
LegendComponent.propDecorators = {
    data: [{ type: Input }],
    title: [{ type: Input }],
    colors: [{ type: Input }],
    height: [{ type: Input }],
    width: [{ type: Input }],
    activeEntries: [{ type: Input }],
    horizontal: [{ type: Input }],
    labelClick: [{ type: Output }],
    labelActivate: [{ type: Output }],
    labelDeactivate: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVnZW5kLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vbGVnZW5kL2xlZ2VuZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBR1osaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUErQjlDLE1BQU0sT0FBTyxlQUFlO0lBZTFCLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBUmhDLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFbEIsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ25ELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsb0JBQWUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVsRSxrQkFBYSxHQUFVLEVBQUUsQ0FBQztJQUVrQixDQUFDO0lBRTdDLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVqQixLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDN0IsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxjQUFjLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDZCxLQUFLLENBQUMsSUFBSSxDQUFDO29CQUNULEtBQUs7b0JBQ0wsY0FBYztvQkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2lCQUNuQyxDQUFDLENBQUM7YUFDSjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUs7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQztJQUM1QixDQUFDO0lBRUQsUUFBUSxDQUFDLElBQUk7UUFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVSxDQUFDLElBQUk7UUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDOzs7WUEvRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCVDtnQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUFqQ0MsaUJBQWlCOzs7bUJBbUNoQixLQUFLO29CQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUVMLE1BQU07NEJBQ04sTUFBTTs4QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBWaWV3RW5jYXBzdWxhdGlvblxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmb3JtYXRMYWJlbCB9IGZyb20gJy4uL2xhYmVsLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1jaGFydHMtbGVnZW5kJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBbc3R5bGUud2lkdGgucHhdPVwid2lkdGhcIj5cclxuICAgICAgPGhlYWRlciBjbGFzcz1cImxlZ2VuZC10aXRsZVwiICpuZ0lmPVwidGl0bGU/Lmxlbmd0aCA+IDBcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImxlZ2VuZC10aXRsZS10ZXh0XCI+e3sgdGl0bGUgfX08L3NwYW4+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibGVnZW5kLXdyYXBcIj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJsZWdlbmQtbGFiZWxzXCIgW2NsYXNzLmhvcml6b250YWwtbGVnZW5kXT1cImhvcml6b250YWxcIiBbc3R5bGUubWF4LWhlaWdodC5weF09XCJoZWlnaHQgLSA0NVwiPlxyXG4gICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBlbnRyeSBvZiBsZWdlbmRFbnRyaWVzOyB0cmFja0J5OiB0cmFja0J5XCIgY2xhc3M9XCJsZWdlbmQtbGFiZWxcIj5cclxuICAgICAgICAgICAgPG5neC1jaGFydHMtbGVnZW5kLWVudHJ5XHJcbiAgICAgICAgICAgICAgW2xhYmVsXT1cImVudHJ5LmxhYmVsXCJcclxuICAgICAgICAgICAgICBbZm9ybWF0dGVkTGFiZWxdPVwiZW50cnkuZm9ybWF0dGVkTGFiZWxcIlxyXG4gICAgICAgICAgICAgIFtjb2xvcl09XCJlbnRyeS5jb2xvclwiXHJcbiAgICAgICAgICAgICAgW2lzQWN0aXZlXT1cImlzQWN0aXZlKGVudHJ5KVwiXHJcbiAgICAgICAgICAgICAgKHNlbGVjdCk9XCJsYWJlbENsaWNrLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlKCRldmVudClcIlxyXG4gICAgICAgICAgICAgIChkZWFjdGl2YXRlKT1cImRlYWN0aXZhdGUoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgPC9uZ3gtY2hhcnRzLWxlZ2VuZC1lbnRyeT5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWycuL2xlZ2VuZC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIExlZ2VuZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSB0aXRsZTtcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgaGVpZ2h0O1xyXG4gIEBJbnB1dCgpIHdpZHRoO1xyXG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM7XHJcbiAgQElucHV0KCkgaG9yaXpvbnRhbCA9IGZhbHNlO1xyXG5cclxuICBAT3V0cHV0KCkgbGFiZWxDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGxhYmVsQWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBsYWJlbERlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBsZWdlbmRFbnRyaWVzOiBhbnlbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICB0aGlzLmxlZ2VuZEVudHJpZXMgPSB0aGlzLmdldExlZ2VuZEVudHJpZXMoKTtcclxuICB9XHJcblxyXG4gIGdldExlZ2VuZEVudHJpZXMoKTogYW55W10ge1xyXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGxhYmVsIG9mIHRoaXMuZGF0YSkge1xyXG4gICAgICBjb25zdCBmb3JtYXR0ZWRMYWJlbCA9IGZvcm1hdExhYmVsKGxhYmVsKTtcclxuXHJcbiAgICAgIGNvbnN0IGlkeCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IHtcclxuICAgICAgICByZXR1cm4gaS5sYWJlbCA9PT0gZm9ybWF0dGVkTGFiZWw7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcclxuICAgICAgICBpdGVtcy5wdXNoKHtcclxuICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgZm9ybWF0dGVkTGFiZWwsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcnMuZ2V0Q29sb3IobGFiZWwpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaXRlbXM7XHJcbiAgfVxyXG5cclxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5LmxhYmVsID09PSBkLm5hbWU7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBpdGVtICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZShpdGVtKSB7XHJcbiAgICB0aGlzLmxhYmVsQWN0aXZhdGUuZW1pdChpdGVtKTtcclxuICB9XHJcblxyXG4gIGRlYWN0aXZhdGUoaXRlbSkge1xyXG4gICAgdGhpcy5sYWJlbERlYWN0aXZhdGUuZW1pdChpdGVtKTtcclxuICB9XHJcblxyXG4gIHRyYWNrQnkoaW5kZXgsIGl0ZW0pOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGl0ZW0ubGFiZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==