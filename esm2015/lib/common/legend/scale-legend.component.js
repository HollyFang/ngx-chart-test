import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export class ScaleLegendComponent {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.horizontal = false;
    }
    ngOnChanges(changes) {
        const gradientValues = this.gradientString(this.colors.range(), this.colors.domain());
        const direction = this.horizontal ? 'right' : 'bottom';
        this.gradient = this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(to ${direction}, ${gradientValues})`);
    }
    /**
     * Generates the string used in the gradient stylesheet properties
     * @param colors array of colors
     * @param splits array of splits on a scale of (0, 1)
     */
    gradientString(colors, splits) {
        // add the 100%
        splits.push(1);
        const pairs = [];
        colors.reverse().forEach((c, i) => {
            pairs.push(`${c} ${Math.round(splits[i] * 100)}%`);
        });
        return pairs.join(', ');
    }
}
ScaleLegendComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-scale-legend',
                template: `
    <div
      class="scale-legend"
      [class.horizontal-legend]="horizontal"
      [style.height.px]="horizontal ? undefined : height"
      [style.width.px]="width"
    >
      <div class="scale-legend-label">
        <span>{{ valueRange[1].toLocaleString() }}</span>
      </div>
      <div class="scale-legend-wrap" [style.background]="gradient"></div>
      <div class="scale-legend-label">
        <span>{{ valueRange[0].toLocaleString() }}</span>
      </div>
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".chart-legend{display:inline-block;padding:0;width:auto!important}.chart-legend .scale-legend{display:flex;flex-direction:column;text-align:center}.chart-legend .scale-legend-wrap{border-radius:5px;display:inline-block;flex:1;margin:0 auto;width:30px}.chart-legend .scale-legend-label{font-size:12px}.chart-legend .horizontal-legend.scale-legend{flex-direction:row}.chart-legend .horizontal-legend .scale-legend-wrap{height:30px;margin:0 16px;width:auto}"]
            },] }
];
ScaleLegendComponent.ctorParameters = () => [
    { type: DomSanitizer }
];
ScaleLegendComponent.propDecorators = {
    valueRange: [{ type: Input }],
    colors: [{ type: Input }],
    height: [{ type: Input }],
    width: [{ type: Input }],
    horizontal: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUtbGVnZW5kLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vbGVnZW5kL3NjYWxlLWxlZ2VuZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQWEsdUJBQXVCLEVBQWlCLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQXdCekQsTUFBTSxPQUFPLG9CQUFvQjtJQVMvQixZQUFvQixTQUF1QjtRQUF2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBSmxDLGVBQVUsR0FBRyxLQUFLLENBQUM7SUFJa0IsQ0FBQztJQUUvQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0RixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsc0JBQXNCLFNBQVMsS0FBSyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ2pILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNO1FBQzNCLGVBQWU7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQzs7O1lBckRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7OztHQWVUO2dCQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztZQXZCUSxZQUFZOzs7eUJBeUJsQixLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1zY2FsZS1sZWdlbmQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwic2NhbGUtbGVnZW5kXCJcclxuICAgICAgW2NsYXNzLmhvcml6b250YWwtbGVnZW5kXT1cImhvcml6b250YWxcIlxyXG4gICAgICBbc3R5bGUuaGVpZ2h0LnB4XT1cImhvcml6b250YWwgPyB1bmRlZmluZWQgOiBoZWlnaHRcIlxyXG4gICAgICBbc3R5bGUud2lkdGgucHhdPVwid2lkdGhcIlxyXG4gICAgPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwic2NhbGUtbGVnZW5kLWxhYmVsXCI+XHJcbiAgICAgICAgPHNwYW4+e3sgdmFsdWVSYW5nZVsxXS50b0xvY2FsZVN0cmluZygpIH19PC9zcGFuPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInNjYWxlLWxlZ2VuZC13cmFwXCIgW3N0eWxlLmJhY2tncm91bmRdPVwiZ3JhZGllbnRcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInNjYWxlLWxlZ2VuZC1sYWJlbFwiPlxyXG4gICAgICAgIDxzcGFuPnt7IHZhbHVlUmFuZ2VbMF0udG9Mb2NhbGVTdHJpbmcoKSB9fTwvc3Bhbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWycuL3NjYWxlLWxlZ2VuZC5jb21wb25lbnQuc2NzcyddLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFNjYWxlTGVnZW5kQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSB2YWx1ZVJhbmdlO1xyXG4gIEBJbnB1dCgpIGNvbG9ycztcclxuICBASW5wdXQoKSBoZWlnaHQ7XHJcbiAgQElucHV0KCkgd2lkdGg7XHJcbiAgQElucHV0KCkgaG9yaXpvbnRhbCA9IGZhbHNlO1xyXG5cclxuICBncmFkaWVudDogYW55O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7fVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zdCBncmFkaWVudFZhbHVlcyA9IHRoaXMuZ3JhZGllbnRTdHJpbmcodGhpcy5jb2xvcnMucmFuZ2UoKSwgdGhpcy5jb2xvcnMuZG9tYWluKCkpO1xyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5ob3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nO1xyXG4gICAgdGhpcy5ncmFkaWVudCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZShgbGluZWFyLWdyYWRpZW50KHRvICR7ZGlyZWN0aW9ufSwgJHtncmFkaWVudFZhbHVlc30pYCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZXMgdGhlIHN0cmluZyB1c2VkIGluIHRoZSBncmFkaWVudCBzdHlsZXNoZWV0IHByb3BlcnRpZXNcclxuICAgKiBAcGFyYW0gY29sb3JzIGFycmF5IG9mIGNvbG9yc1xyXG4gICAqIEBwYXJhbSBzcGxpdHMgYXJyYXkgb2Ygc3BsaXRzIG9uIGEgc2NhbGUgb2YgKDAsIDEpXHJcbiAgICovXHJcbiAgZ3JhZGllbnRTdHJpbmcoY29sb3JzLCBzcGxpdHMpOiBzdHJpbmcge1xyXG4gICAgLy8gYWRkIHRoZSAxMDAlXHJcbiAgICBzcGxpdHMucHVzaCgxKTtcclxuICAgIGNvbnN0IHBhaXJzID0gW107XHJcbiAgICBjb2xvcnMucmV2ZXJzZSgpLmZvckVhY2goKGMsIGkpID0+IHtcclxuICAgICAgcGFpcnMucHVzaChgJHtjfSAke01hdGgucm91bmQoc3BsaXRzW2ldICogMTAwKX0lYCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcGFpcnMuam9pbignLCAnKTtcclxuICB9XHJcbn1cclxuIl19