import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { brushX } from 'd3-brush';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';
import { select, event as d3event } from 'd3-selection';
import { id } from '../..//utils/id';
export class Timeline {
    constructor(element, cd) {
        this.cd = cd;
        this.height = 50;
        this.select = new EventEmitter();
        this.onDomainChange = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
        if (!this.initialized) {
            this.addBrush();
            this.initialized = true;
        }
    }
    update() {
        this.dims = this.getDims();
        this.height = this.dims.height;
        const offsetY = this.view[1] - this.height;
        this.xDomain = this.getXDomain();
        this.xScale = this.getXScale();
        if (this.brush) {
            this.updateBrush();
        }
        this.transform = `translate(0 , ${offsetY})`;
        this.filterId = 'filter' + id().toString();
        this.filter = `url(#${this.filterId})`;
        this.cd.markForCheck();
    }
    getXDomain() {
        let values = [];
        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.name)) {
                    values.push(d.name);
                }
            }
        }
        let domain = [];
        if (this.scaleType === 'time') {
            const min = Math.min(...values);
            const max = Math.max(...values);
            domain = [min, max];
        }
        else if (this.scaleType === 'linear') {
            values = values.map(v => Number(v));
            const min = Math.min(...values);
            const max = Math.max(...values);
            domain = [min, max];
        }
        else {
            domain = values;
        }
        return domain;
    }
    getXScale() {
        let scale;
        if (this.scaleType === 'time') {
            scale = scaleTime().range([0, this.dims.width]).domain(this.xDomain);
        }
        else if (this.scaleType === 'linear') {
            scale = scaleLinear().range([0, this.dims.width]).domain(this.xDomain);
        }
        else if (this.scaleType === 'ordinal') {
            scale = scalePoint().range([0, this.dims.width]).padding(0.1).domain(this.xDomain);
        }
        return scale;
    }
    addBrush() {
        if (this.brush)
            return;
        const height = this.height;
        const width = this.view[0];
        this.brush = brushX()
            .extent([
            [0, 0],
            [width, height]
        ])
            .on('brush end', () => {
            const selection = d3event.selection || this.xScale.range();
            const newDomain = selection.map(this.xScale.invert);
            this.onDomainChange.emit(newDomain);
            this.cd.markForCheck();
        });
        select(this.element).select('.brush').call(this.brush);
    }
    updateBrush() {
        if (!this.brush)
            return;
        const height = this.height;
        const width = this.view[0];
        this.brush.extent([
            [0, 0],
            [width, height]
        ]);
        select(this.element).select('.brush').call(this.brush);
        // clear hardcoded properties so they can be defined by CSS
        select(this.element)
            .select('.selection')
            .attr('fill', undefined)
            .attr('stroke', undefined)
            .attr('fill-opacity', undefined);
        this.cd.markForCheck();
    }
    getDims() {
        const width = this.view[0];
        const dims = {
            width,
            height: this.height
        };
        return dims;
    }
}
Timeline.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-timeline]',
                template: `
    <svg:g class="timeline" [attr.transform]="transform">
      <svg:filter [attr.id]="filterId">
        <svg:feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
        />
      </svg:filter>
      <svg:g class="embedded-chart">
        <ng-content></ng-content>
      </svg:g>
      <svg:rect x="0" [attr.width]="view[0]" y="0" [attr.height]="height" class="brush-background" />
      <svg:g class="brush"></svg:g>
    </svg:g>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".timeline .brush-background{fill:rgba(0,0,0,.05)}.timeline .brush .selection{fill:rgba(0,0,0,.1);stroke:#888;stroke-width:1px}.timeline .brush .handle{fill-opacity:0}.timeline .embedded-chart{opacity:.6}"]
            },] }
];
Timeline.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
Timeline.propDecorators = {
    view: [{ type: Input }],
    state: [{ type: Input }],
    results: [{ type: Input }],
    scheme: [{ type: Input }],
    customColors: [{ type: Input }],
    legend: [{ type: Input }],
    miniChart: [{ type: Input }],
    autoScale: [{ type: Input }],
    scaleType: [{ type: Input }],
    height: [{ type: Input }],
    select: [{ type: Output }],
    onDomainChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi90aW1lbGluZS90aW1lbGluZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBRVYsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUVqQixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNsQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDOUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLElBQUksT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQXdCckMsTUFBTSxPQUFPLFFBQVE7SUF5Qm5CLFlBQVksT0FBbUIsRUFBVSxFQUFxQjtRQUFyQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQWZyRCxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBRW5CLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzVCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVE5QyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUszQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFD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QkFBd0I7Z0JBQ2xDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0dBZVQ7Z0JBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7O1lBakNDLFVBQVU7WUFHVixpQkFBaUI7OzttQkFnQ2hCLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7MkJBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBRUwsTUFBTTs2QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIFZpZXdFbmNhcHN1bGF0aW9uXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGJydXNoWCB9IGZyb20gJ2QzLWJydXNoJztcclxuaW1wb3J0IHsgc2NhbGVMaW5lYXIsIHNjYWxlVGltZSwgc2NhbGVQb2ludCB9IGZyb20gJ2QzLXNjYWxlJztcclxuaW1wb3J0IHsgc2VsZWN0LCBldmVudCBhcyBkM2V2ZW50IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi8uLi8vdXRpbHMvaWQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtdGltZWxpbmVdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnIGNsYXNzPVwidGltZWxpbmVcIiBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCI+XHJcbiAgICAgIDxzdmc6ZmlsdGVyIFthdHRyLmlkXT1cImZpbHRlcklkXCI+XHJcbiAgICAgICAgPHN2ZzpmZUNvbG9yTWF0cml4XHJcbiAgICAgICAgICBpbj1cIlNvdXJjZUdyYXBoaWNcIlxyXG4gICAgICAgICAgdHlwZT1cIm1hdHJpeFwiXHJcbiAgICAgICAgICB2YWx1ZXM9XCIwLjMzMzMgMC4zMzMzIDAuMzMzMyAwIDAgMC4zMzMzIDAuMzMzMyAwLjMzMzMgMCAwIDAuMzMzMyAwLjMzMzMgMC4zMzMzIDAgMCAwIDAgMCAxIDBcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvc3ZnOmZpbHRlcj5cclxuICAgICAgPHN2ZzpnIGNsYXNzPVwiZW1iZWRkZWQtY2hhcnRcIj5cclxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6cmVjdCB4PVwiMFwiIFthdHRyLndpZHRoXT1cInZpZXdbMF1cIiB5PVwiMFwiIFthdHRyLmhlaWdodF09XCJoZWlnaHRcIiBjbGFzcz1cImJydXNoLWJhY2tncm91bmRcIiAvPlxyXG4gICAgICA8c3ZnOmcgY2xhc3M9XCJicnVzaFwiPjwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGltZWxpbmUuY29tcG9uZW50LnNjc3MnXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUaW1lbGluZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgdmlldztcclxuICBASW5wdXQoKSBzdGF0ZTtcclxuICBASW5wdXQoKSByZXN1bHRzO1xyXG4gIEBJbnB1dCgpIHNjaGVtZTtcclxuICBASW5wdXQoKSBjdXN0b21Db2xvcnM7XHJcbiAgQElucHV0KCkgbGVnZW5kO1xyXG4gIEBJbnB1dCgpIG1pbmlDaGFydDtcclxuICBASW5wdXQoKSBhdXRvU2NhbGU7XHJcbiAgQElucHV0KCkgc2NhbGVUeXBlO1xyXG4gIEBJbnB1dCgpIGhlaWdodDogbnVtYmVyID0gNTA7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIG9uRG9tYWluQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICBkaW1zOiBhbnk7XHJcbiAgeERvbWFpbjogYW55W107XHJcbiAgeFNjYWxlOiBhbnk7XHJcbiAgYnJ1c2g6IGFueTtcclxuICB0cmFuc2Zvcm06IHN0cmluZztcclxuICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGZpbHRlcklkOiBhbnk7XHJcbiAgZmlsdGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xyXG4gICAgICB0aGlzLmFkZEJydXNoKCk7XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5kaW1zID0gdGhpcy5nZXREaW1zKCk7XHJcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuZGltcy5oZWlnaHQ7XHJcbiAgICBjb25zdCBvZmZzZXRZID0gdGhpcy52aWV3WzFdIC0gdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy54RG9tYWluID0gdGhpcy5nZXRYRG9tYWluKCk7XHJcbiAgICB0aGlzLnhTY2FsZSA9IHRoaXMuZ2V0WFNjYWxlKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuYnJ1c2gpIHtcclxuICAgICAgdGhpcy51cGRhdGVCcnVzaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwICwgJHtvZmZzZXRZfSlgO1xyXG5cclxuICAgIHRoaXMuZmlsdGVySWQgPSAnZmlsdGVyJyArIGlkKCkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMuZmlsdGVyID0gYHVybCgjJHt0aGlzLmZpbHRlcklkfSlgO1xyXG5cclxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgfVxyXG5cclxuICBnZXRYRG9tYWluKCk6IGFueVtdIHtcclxuICAgIGxldCB2YWx1ZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHJlc3VsdHMgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZCBvZiByZXN1bHRzLnNlcmllcykge1xyXG4gICAgICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKGQubmFtZSkpIHtcclxuICAgICAgICAgIHZhbHVlcy5wdXNoKGQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRvbWFpbiA9IFtdO1xyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcclxuICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcclxuICAgICAgZG9tYWluID0gW21pbiwgbWF4XTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIHZhbHVlcyA9IHZhbHVlcy5tYXAodiA9PiBOdW1iZXIodikpO1xyXG4gICAgICBjb25zdCBtaW4gPSBNYXRoLm1pbiguLi52YWx1ZXMpO1xyXG4gICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi52YWx1ZXMpO1xyXG4gICAgICBkb21haW4gPSBbbWluLCBtYXhdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9tYWluID0gdmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkb21haW47XHJcbiAgfVxyXG5cclxuICBnZXRYU2NhbGUoKSB7XHJcbiAgICBsZXQgc2NhbGU7XHJcblxyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgc2NhbGUgPSBzY2FsZVRpbWUoKS5yYW5nZShbMCwgdGhpcy5kaW1zLndpZHRoXSkuZG9tYWluKHRoaXMueERvbWFpbik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICBzY2FsZSA9IHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuZGltcy53aWR0aF0pLmRvbWFpbih0aGlzLnhEb21haW4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ29yZGluYWwnKSB7XHJcbiAgICAgIHNjYWxlID0gc2NhbGVQb2ludCgpLnJhbmdlKFswLCB0aGlzLmRpbXMud2lkdGhdKS5wYWRkaW5nKDAuMSkuZG9tYWluKHRoaXMueERvbWFpbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNjYWxlO1xyXG4gIH1cclxuXHJcbiAgYWRkQnJ1c2goKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5icnVzaCkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnZpZXdbMF07XHJcblxyXG4gICAgdGhpcy5icnVzaCA9IGJydXNoWCgpXHJcbiAgICAgIC5leHRlbnQoW1xyXG4gICAgICAgIFswLCAwXSxcclxuICAgICAgICBbd2lkdGgsIGhlaWdodF1cclxuICAgICAgXSlcclxuICAgICAgLm9uKCdicnVzaCBlbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gZDNldmVudC5zZWxlY3Rpb24gfHwgdGhpcy54U2NhbGUucmFuZ2UoKTtcclxuICAgICAgICBjb25zdCBuZXdEb21haW4gPSBzZWxlY3Rpb24ubWFwKHRoaXMueFNjYWxlLmludmVydCk7XHJcblxyXG4gICAgICAgIHRoaXMub25Eb21haW5DaGFuZ2UuZW1pdChuZXdEb21haW4pO1xyXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmJydXNoJykuY2FsbCh0aGlzLmJydXNoKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUJydXNoKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmJydXNoKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMudmlld1swXTtcclxuXHJcbiAgICB0aGlzLmJydXNoLmV4dGVudChbXHJcbiAgICAgIFswLCAwXSxcclxuICAgICAgW3dpZHRoLCBoZWlnaHRdXHJcbiAgICBdKTtcclxuICAgIHNlbGVjdCh0aGlzLmVsZW1lbnQpLnNlbGVjdCgnLmJydXNoJykuY2FsbCh0aGlzLmJydXNoKTtcclxuXHJcbiAgICAvLyBjbGVhciBoYXJkY29kZWQgcHJvcGVydGllcyBzbyB0aGV5IGNhbiBiZSBkZWZpbmVkIGJ5IENTU1xyXG4gICAgc2VsZWN0KHRoaXMuZWxlbWVudClcclxuICAgICAgLnNlbGVjdCgnLnNlbGVjdGlvbicpXHJcbiAgICAgIC5hdHRyKCdmaWxsJywgdW5kZWZpbmVkKVxyXG4gICAgICAuYXR0cignc3Ryb2tlJywgdW5kZWZpbmVkKVxyXG4gICAgICAuYXR0cignZmlsbC1vcGFjaXR5JywgdW5kZWZpbmVkKTtcclxuXHJcbiAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RGltcygpOiBhbnkge1xyXG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnZpZXdbMF07XHJcblxyXG4gICAgY29uc3QgZGltcyA9IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHRcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGRpbXM7XHJcbiAgfVxyXG59XHJcbiJdfQ==