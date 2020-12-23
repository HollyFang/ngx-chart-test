import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { arc } from 'd3-shape';
import { trimLabel } from '../common/trim-label.helper';
export class PieLabelComponent {
    constructor() {
        this.animations = true;
        this.labelTrim = true;
        this.labelTrimSize = 10;
        this.isIE = /(edge|msie|trident)/i.test(navigator.userAgent);
        this.trimLabel = trimLabel;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        let startRadius = this.radius;
        if (this.explodeSlices) {
            startRadius = (this.radius * this.value) / this.max;
        }
        const innerArc = arc().innerRadius(startRadius).outerRadius(startRadius);
        // Calculate innerPos then scale outer position to match label position
        const innerPos = innerArc.centroid(this.data);
        let scale = this.data.pos[1] / innerPos[1];
        if (this.data.pos[1] === 0 || innerPos[1] === 0) {
            scale = 1;
        }
        const outerPos = [scale * innerPos[0], scale * innerPos[1]];
        this.line = `M${innerPos}L${outerPos}L${this.data.pos}`;
    }
    get textX() {
        return this.data.pos[0];
    }
    get textY() {
        return this.data.pos[1];
    }
    get styleTransform() {
        return this.isIE ? null : `translate3d(${this.textX}px,${this.textY}px, 0)`;
    }
    get attrTransform() {
        return !this.isIE ? null : `translate(${this.textX},${this.textY})`;
    }
    get textTransition() {
        return this.isIE || !this.animations ? null : 'transform 0.75s';
    }
    textAnchor() {
        return this.midAngle(this.data) < Math.PI ? 'start' : 'end';
    }
    midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
}
PieLabelComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-pie-label]',
                template: `
    <title>{{ label }}</title>
    <svg:g [attr.transform]="attrTransform" [style.transform]="styleTransform" [style.transition]="textTransition">
      <svg:text
        class="pie-label"
        [class.animation]="animations"
        dy=".35em"
        [style.textAnchor]="textAnchor()"
        [style.shapeRendering]="'crispEdges'"
      >
        {{ labelTrim ? trimLabel(label, labelTrimSize) : label }}
      </svg:text>
    </svg:g>
    <svg:path
      [attr.d]="line"
      [attr.stroke]="color"
      fill="none"
      class="pie-label-line line"
      [class.animation]="animations"
    ></svg:path>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PieLabelComponent.ctorParameters = () => [];
PieLabelComponent.propDecorators = {
    data: [{ type: Input }],
    radius: [{ type: Input }],
    label: [{ type: Input }],
    color: [{ type: Input }],
    max: [{ type: Input }],
    value: [{ type: Input }],
    explodeSlices: [{ type: Input }],
    animations: [{ type: Input }],
    labelTrim: [{ type: Input }],
    labelTrimSize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWxhYmVsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9waWUtY2hhcnQvcGllLWxhYmVsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBNEIsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUUvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUEyQnhELE1BQU0sT0FBTyxpQkFBaUI7SUFpQjVCO1FBVFMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixjQUFTLEdBQVksSUFBSSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBS25CLFNBQUksR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBR3ZFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNyRDtRQUVELE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFekUsdUVBQXVFO1FBQ3ZFLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9DLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDWDtRQUNELE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxlQUFlLElBQUksQ0FBQyxLQUFLLE1BQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDO0lBQzlFLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFDZixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztJQUNsRSxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDOUQsQ0FBQztJQUVELFFBQVEsQ0FBQyxDQUFDO1FBQ1IsT0FBTyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7OztZQWhHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7OzttQkFFRSxLQUFLO3FCQUNMLEtBQUs7b0JBQ0wsS0FBSztvQkFDTCxLQUFLO2tCQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBhcmMgfSBmcm9tICdkMy1zaGFwZSc7XHJcblxyXG5pbXBvcnQgeyB0cmltTGFiZWwgfSBmcm9tICcuLi9jb21tb24vdHJpbS1sYWJlbC5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtcGllLWxhYmVsXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDx0aXRsZT57eyBsYWJlbCB9fTwvdGl0bGU+XHJcbiAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cImF0dHJUcmFuc2Zvcm1cIiBbc3R5bGUudHJhbnNmb3JtXT1cInN0eWxlVHJhbnNmb3JtXCIgW3N0eWxlLnRyYW5zaXRpb25dPVwidGV4dFRyYW5zaXRpb25cIj5cclxuICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgY2xhc3M9XCJwaWUtbGFiZWxcIlxyXG4gICAgICAgIFtjbGFzcy5hbmltYXRpb25dPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgICAgZHk9XCIuMzVlbVwiXHJcbiAgICAgICAgW3N0eWxlLnRleHRBbmNob3JdPVwidGV4dEFuY2hvcigpXCJcclxuICAgICAgICBbc3R5bGUuc2hhcGVSZW5kZXJpbmddPVwiJ2NyaXNwRWRnZXMnXCJcclxuICAgICAgPlxyXG4gICAgICAgIHt7IGxhYmVsVHJpbSA/IHRyaW1MYWJlbChsYWJlbCwgbGFiZWxUcmltU2l6ZSkgOiBsYWJlbCB9fVxyXG4gICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgPC9zdmc6Zz5cclxuICAgIDxzdmc6cGF0aFxyXG4gICAgICBbYXR0ci5kXT1cImxpbmVcIlxyXG4gICAgICBbYXR0ci5zdHJva2VdPVwiY29sb3JcIlxyXG4gICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgIGNsYXNzPVwicGllLWxhYmVsLWxpbmUgbGluZVwiXHJcbiAgICAgIFtjbGFzcy5hbmltYXRpb25dPVwiYW5pbWF0aW9uc1wiXHJcbiAgICA+PC9zdmc6cGF0aD5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQaWVMYWJlbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZGF0YTtcclxuICBASW5wdXQoKSByYWRpdXM7XHJcbiAgQElucHV0KCkgbGFiZWw7XHJcbiAgQElucHV0KCkgY29sb3I7XHJcbiAgQElucHV0KCkgbWF4O1xyXG4gIEBJbnB1dCgpIHZhbHVlO1xyXG4gIEBJbnB1dCgpIGV4cGxvZGVTbGljZXM7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgbGFiZWxUcmltOiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBsYWJlbFRyaW1TaXplOiBudW1iZXIgPSAxMDtcclxuXHJcbiAgdHJpbUxhYmVsOiAobGFiZWw6IHN0cmluZywgbWF4PzogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbiAgbGluZTogc3RyaW5nO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGlzSUUgPSAvKGVkZ2V8bXNpZXx0cmlkZW50KS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50cmltTGFiZWwgPSB0cmltTGFiZWw7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgbGV0IHN0YXJ0UmFkaXVzID0gdGhpcy5yYWRpdXM7XHJcbiAgICBpZiAodGhpcy5leHBsb2RlU2xpY2VzKSB7XHJcbiAgICAgIHN0YXJ0UmFkaXVzID0gKHRoaXMucmFkaXVzICogdGhpcy52YWx1ZSkgLyB0aGlzLm1heDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbm5lckFyYyA9IGFyYygpLmlubmVyUmFkaXVzKHN0YXJ0UmFkaXVzKS5vdXRlclJhZGl1cyhzdGFydFJhZGl1cyk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGlubmVyUG9zIHRoZW4gc2NhbGUgb3V0ZXIgcG9zaXRpb24gdG8gbWF0Y2ggbGFiZWwgcG9zaXRpb25cclxuICAgIGNvbnN0IGlubmVyUG9zID0gaW5uZXJBcmMuY2VudHJvaWQodGhpcy5kYXRhKTtcclxuXHJcbiAgICBsZXQgc2NhbGUgPSB0aGlzLmRhdGEucG9zWzFdIC8gaW5uZXJQb3NbMV07XHJcbiAgICBpZiAodGhpcy5kYXRhLnBvc1sxXSA9PT0gMCB8fCBpbm5lclBvc1sxXSA9PT0gMCkge1xyXG4gICAgICBzY2FsZSA9IDE7XHJcbiAgICB9XHJcbiAgICBjb25zdCBvdXRlclBvcyA9IFtzY2FsZSAqIGlubmVyUG9zWzBdLCBzY2FsZSAqIGlubmVyUG9zWzFdXTtcclxuXHJcbiAgICB0aGlzLmxpbmUgPSBgTSR7aW5uZXJQb3N9TCR7b3V0ZXJQb3N9TCR7dGhpcy5kYXRhLnBvc31gO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRleHRYKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhLnBvc1swXTtcclxuICB9XHJcblxyXG4gIGdldCB0ZXh0WSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5wb3NbMV07XHJcbiAgfVxyXG5cclxuICBnZXQgc3R5bGVUcmFuc2Zvcm0oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmlzSUUgPyBudWxsIDogYHRyYW5zbGF0ZTNkKCR7dGhpcy50ZXh0WH1weCwke3RoaXMudGV4dFl9cHgsIDApYDtcclxuICB9XHJcblxyXG4gIGdldCBhdHRyVHJhbnNmb3JtKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gIXRoaXMuaXNJRSA/IG51bGwgOiBgdHJhbnNsYXRlKCR7dGhpcy50ZXh0WH0sJHt0aGlzLnRleHRZfSlgO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRleHRUcmFuc2l0aW9uKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0lFIHx8ICF0aGlzLmFuaW1hdGlvbnMgPyBudWxsIDogJ3RyYW5zZm9ybSAwLjc1cyc7XHJcbiAgfVxyXG5cclxuICB0ZXh0QW5jaG9yKCk6IGFueSB7XHJcbiAgICByZXR1cm4gdGhpcy5taWRBbmdsZSh0aGlzLmRhdGEpIDwgTWF0aC5QSSA/ICdzdGFydCcgOiAnZW5kJztcclxuICB9XHJcblxyXG4gIG1pZEFuZ2xlKGQpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIGQuc3RhcnRBbmdsZSArIChkLmVuZEFuZ2xlIC0gZC5zdGFydEFuZ2xlKSAvIDI7XHJcbiAgfVxyXG59XHJcbiJdfQ==