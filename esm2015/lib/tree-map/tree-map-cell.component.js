import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { select } from 'd3-selection';
import { invertColor } from '../utils/color-utils';
import { trimLabel } from '../common/trim-label.helper';
import { escapeLabel } from '../common/label.helper';
import { id } from '../utils/id';
export class TreeMapCellComponent {
    constructor(element) {
        this.gradient = false;
        this.animations = true;
        this.select = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    ngOnChanges() {
        this.update();
        this.valueFormatting = this.valueFormatting || (value => value.toLocaleString());
        const labelFormatting = this.labelFormatting || (cell => escapeLabel(trimLabel(cell.label, 55)));
        const cellData = {
            data: this.data,
            label: this.label,
            value: this.value
        };
        this.formattedValue = this.valueFormatting(cellData.value);
        this.formattedLabel = labelFormatting(cellData);
        this.gradientId = 'grad' + id().toString();
        this.gradientUrl = `url(#${this.gradientId})`;
        this.gradientStops = this.getGradientStops();
    }
    update() {
        if (this.initialized) {
            this.animateToCurrentForm();
        }
        else {
            if (this.animations) {
                this.loadAnimation();
            }
            this.initialized = true;
        }
    }
    loadAnimation() {
        const node = select(this.element).select('.cell');
        node.attr('opacity', 0).attr('x', this.x).attr('y', this.y);
        this.animateToCurrentForm();
    }
    getTextColor() {
        return invertColor(this.fill);
    }
    animateToCurrentForm() {
        const node = select(this.element).select('.cell');
        if (this.animations) {
            node
                .transition()
                .duration(750)
                .attr('opacity', 1)
                .attr('x', this.x)
                .attr('y', this.y)
                .attr('width', this.width)
                .attr('height', this.height);
        }
        else {
            node.attr('opacity', 1).attr('x', this.x).attr('y', this.y).attr('width', this.width).attr('height', this.height);
        }
    }
    onClick() {
        this.select.emit(this.data);
    }
    getGradientStops() {
        return [
            {
                offset: 0,
                color: this.fill,
                opacity: 0.3
            },
            {
                offset: 100,
                color: this.fill,
                opacity: 1
            }
        ];
    }
}
TreeMapCellComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-tree-map-cell]',
                template: `
    <svg:g>
      <defs *ngIf="gradient">
        <svg:g ngx-charts-svg-linear-gradient orientation="vertical" [name]="gradientId" [stops]="gradientStops" />
      </defs>
      <svg:rect
        [attr.fill]="gradient ? gradientUrl : fill"
        [attr.width]="width"
        [attr.height]="height"
        [attr.x]="x"
        [attr.y]="y"
        [style.cursor]="'pointer'"
        class="cell"
        (click)="onClick()"
      />
      <svg:foreignObject
        *ngIf="width >= 70 && height >= 35"
        [attr.x]="x"
        [attr.y]="y"
        [attr.width]="width"
        [attr.height]="height"
        class="treemap-label"
        [style.pointer-events]="'none'"
      >
        <xhtml:p [style.color]="getTextColor()" [style.height]="height + 'px'" [style.width]="width + 'px'">
          <xhtml:span class="treemap-label" [innerHTML]="formattedLabel"> </xhtml:span>
          <xhtml:br />
          <xhtml:span
            *ngIf="animations"
            class="treemap-val"
            ngx-charts-count-up
            [countTo]="value"
            [valueFormatting]="valueFormatting"
          >
          </xhtml:span>
          <xhtml:span *ngIf="!animations" class="treemap-val">
            {{ formattedValue }}
          </xhtml:span>
        </xhtml:p>
      </svg:foreignObject>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
TreeMapCellComponent.ctorParameters = () => [
    { type: ElementRef }
];
TreeMapCellComponent.propDecorators = {
    data: [{ type: Input }],
    fill: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    label: [{ type: Input }],
    value: [{ type: Input }],
    valueType: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    labelFormatting: [{ type: Input }],
    gradient: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tYXAtY2VsbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvdHJlZS1tYXAvdHJlZS1tYXAtY2VsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQWEsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkgsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV0QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBZ0RqQyxNQUFNLE9BQU8sb0JBQW9CO0lBMkIvQixZQUFZLE9BQW1CO1FBZnRCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUxQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVV0QyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUczQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxJQUFJ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QUVELGdCQUFnQjtRQUNkLE9BQU87WUFDTDtnQkFDRSxNQUFNLEVBQUUsQ0FBQztnQkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxHQUFHO2FBQ2I7WUFDRDtnQkFDRSxNQUFNLEVBQUUsR0FBRztnQkFDWCxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBMUpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2dCQUN2QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUFyRGdELFVBQVU7OzttQkF1RHhELEtBQUs7bUJBQ0wsS0FBSztnQkFDTCxLQUFLO2dCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7b0JBQ0wsS0FBSzt3QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSzt1QkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzLXNlbGVjdGlvbic7XHJcblxyXG5pbXBvcnQgeyBpbnZlcnRDb2xvciB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXV0aWxzJztcclxuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vY29tbW9uL3RyaW0tbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgZXNjYXBlTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy10cmVlLW1hcC1jZWxsXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6Zz5cclxuICAgICAgPGRlZnMgKm5nSWY9XCJncmFkaWVudFwiPlxyXG4gICAgICAgIDxzdmc6ZyBuZ3gtY2hhcnRzLXN2Zy1saW5lYXItZ3JhZGllbnQgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiIFtuYW1lXT1cImdyYWRpZW50SWRcIiBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiIC8+XHJcbiAgICAgIDwvZGVmcz5cclxuICAgICAgPHN2ZzpyZWN0XHJcbiAgICAgICAgW2F0dHIuZmlsbF09XCJncmFkaWVudCA/IGdyYWRpZW50VXJsIDogZmlsbFwiXHJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwid2lkdGhcIlxyXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJoZWlnaHRcIlxyXG4gICAgICAgIFthdHRyLnhdPVwieFwiXHJcbiAgICAgICAgW2F0dHIueV09XCJ5XCJcclxuICAgICAgICBbc3R5bGUuY3Vyc29yXT1cIidwb2ludGVyJ1wiXHJcbiAgICAgICAgY2xhc3M9XCJjZWxsXCJcclxuICAgICAgICAoY2xpY2spPVwib25DbGljaygpXCJcclxuICAgICAgLz5cclxuICAgICAgPHN2Zzpmb3JlaWduT2JqZWN0XHJcbiAgICAgICAgKm5nSWY9XCJ3aWR0aCA+PSA3MCAmJiBoZWlnaHQgPj0gMzVcIlxyXG4gICAgICAgIFthdHRyLnhdPVwieFwiXHJcbiAgICAgICAgW2F0dHIueV09XCJ5XCJcclxuICAgICAgICBbYXR0ci53aWR0aF09XCJ3aWR0aFwiXHJcbiAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImhlaWdodFwiXHJcbiAgICAgICAgY2xhc3M9XCJ0cmVlbWFwLWxhYmVsXCJcclxuICAgICAgICBbc3R5bGUucG9pbnRlci1ldmVudHNdPVwiJ25vbmUnXCJcclxuICAgICAgPlxyXG4gICAgICAgIDx4aHRtbDpwIFtzdHlsZS5jb2xvcl09XCJnZXRUZXh0Q29sb3IoKVwiIFtzdHlsZS5oZWlnaHRdPVwiaGVpZ2h0ICsgJ3B4J1wiIFtzdHlsZS53aWR0aF09XCJ3aWR0aCArICdweCdcIj5cclxuICAgICAgICAgIDx4aHRtbDpzcGFuIGNsYXNzPVwidHJlZW1hcC1sYWJlbFwiIFtpbm5lckhUTUxdPVwiZm9ybWF0dGVkTGFiZWxcIj4gPC94aHRtbDpzcGFuPlxyXG4gICAgICAgICAgPHhodG1sOmJyIC8+XHJcbiAgICAgICAgICA8eGh0bWw6c3BhblxyXG4gICAgICAgICAgICAqbmdJZj1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAgICAgICBjbGFzcz1cInRyZWVtYXAtdmFsXCJcclxuICAgICAgICAgICAgbmd4LWNoYXJ0cy1jb3VudC11cFxyXG4gICAgICAgICAgICBbY291bnRUb109XCJ2YWx1ZVwiXHJcbiAgICAgICAgICAgIFt2YWx1ZUZvcm1hdHRpbmddPVwidmFsdWVGb3JtYXR0aW5nXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgIDwveGh0bWw6c3Bhbj5cclxuICAgICAgICAgIDx4aHRtbDpzcGFuICpuZ0lmPVwiIWFuaW1hdGlvbnNcIiBjbGFzcz1cInRyZWVtYXAtdmFsXCI+XHJcbiAgICAgICAgICAgIHt7IGZvcm1hdHRlZFZhbHVlIH19XHJcbiAgICAgICAgICA8L3hodG1sOnNwYW4+XHJcbiAgICAgICAgPC94aHRtbDpwPlxyXG4gICAgICA8L3N2Zzpmb3JlaWduT2JqZWN0PlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlTWFwQ2VsbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSBmaWxsO1xyXG4gIEBJbnB1dCgpIHg7XHJcbiAgQElucHV0KCkgeTtcclxuICBASW5wdXQoKSB3aWR0aDtcclxuICBASW5wdXQoKSBoZWlnaHQ7XHJcbiAgQElucHV0KCkgbGFiZWw7XHJcbiAgQElucHV0KCkgdmFsdWU7XHJcbiAgQElucHV0KCkgdmFsdWVUeXBlO1xyXG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xyXG4gIEBJbnB1dCgpIGxhYmVsRm9ybWF0dGluZzogYW55O1xyXG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGdyYWRpZW50U3RvcHM6IGFueVtdO1xyXG4gIGdyYWRpZW50SWQ6IHN0cmluZztcclxuICBncmFkaWVudFVybDogc3RyaW5nO1xyXG5cclxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBmb3JtYXR0ZWRMYWJlbDogc3RyaW5nO1xyXG4gIGZvcm1hdHRlZFZhbHVlOiBzdHJpbmc7XHJcbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZikge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIHRoaXMudmFsdWVGb3JtYXR0aW5nID0gdGhpcy52YWx1ZUZvcm1hdHRpbmcgfHwgKHZhbHVlID0+IHZhbHVlLnRvTG9jYWxlU3RyaW5nKCkpO1xyXG4gICAgY29uc3QgbGFiZWxGb3JtYXR0aW5nID0gdGhpcy5sYWJlbEZvcm1hdHRpbmcgfHwgKGNlbGwgPT4gZXNjYXBlTGFiZWwodHJpbUxhYmVsKGNlbGwubGFiZWwsIDU1KSkpO1xyXG5cclxuICAgIGNvbnN0IGNlbGxEYXRhID0ge1xyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmZvcm1hdHRlZFZhbHVlID0gdGhpcy52YWx1ZUZvcm1hdHRpbmcoY2VsbERhdGEudmFsdWUpO1xyXG4gICAgdGhpcy5mb3JtYXR0ZWRMYWJlbCA9IGxhYmVsRm9ybWF0dGluZyhjZWxsRGF0YSk7XHJcblxyXG4gICAgdGhpcy5ncmFkaWVudElkID0gJ2dyYWQnICsgaWQoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5ncmFkaWVudFVybCA9IGB1cmwoIyR7dGhpcy5ncmFkaWVudElkfSlgO1xyXG4gICAgdGhpcy5ncmFkaWVudFN0b3BzID0gdGhpcy5nZXRHcmFkaWVudFN0b3BzKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLmFuaW1hdGVUb0N1cnJlbnRGb3JtKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5hbmltYXRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkQW5pbWF0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkQW5pbWF0aW9uKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgbm9kZSA9IHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmNlbGwnKTtcclxuXHJcbiAgICBub2RlLmF0dHIoJ29wYWNpdHknLCAwKS5hdHRyKCd4JywgdGhpcy54KS5hdHRyKCd5JywgdGhpcy55KTtcclxuXHJcbiAgICB0aGlzLmFuaW1hdGVUb0N1cnJlbnRGb3JtKCk7XHJcbiAgfVxyXG5cclxuICBnZXRUZXh0Q29sb3IoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBpbnZlcnRDb2xvcih0aGlzLmZpbGwpO1xyXG4gIH1cclxuXHJcbiAgYW5pbWF0ZVRvQ3VycmVudEZvcm0oKTogdm9pZCB7XHJcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudCkuc2VsZWN0KCcuY2VsbCcpO1xyXG5cclxuICAgIGlmICh0aGlzLmFuaW1hdGlvbnMpIHtcclxuICAgICAgbm9kZVxyXG4gICAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgICAuZHVyYXRpb24oNzUwKVxyXG4gICAgICAgIC5hdHRyKCdvcGFjaXR5JywgMSlcclxuICAgICAgICAuYXR0cigneCcsIHRoaXMueClcclxuICAgICAgICAuYXR0cigneScsIHRoaXMueSlcclxuICAgICAgICAuYXR0cignd2lkdGgnLCB0aGlzLndpZHRoKVxyXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub2RlLmF0dHIoJ29wYWNpdHknLCAxKS5hdHRyKCd4JywgdGhpcy54KS5hdHRyKCd5JywgdGhpcy55KS5hdHRyKCd3aWR0aCcsIHRoaXMud2lkdGgpLmF0dHIoJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KHRoaXMuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBnZXRHcmFkaWVudFN0b3BzKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAge1xyXG4gICAgICAgIG9mZnNldDogMCxcclxuICAgICAgICBjb2xvcjogdGhpcy5maWxsLFxyXG4gICAgICAgIG9wYWNpdHk6IDAuM1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgb2Zmc2V0OiAxMDAsXHJcbiAgICAgICAgY29sb3I6IHRoaXMuZmlsbCxcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgIH1cclxuICAgIF07XHJcbiAgfVxyXG59XHJcbiJdfQ==