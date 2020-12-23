import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { area, line } from 'd3-shape';
import { id } from '../utils/id';
import { sortLinear, sortByTime, sortByDomain } from '../utils/sort';
export class LineSeriesComponent {
    constructor() {
        this.animations = true;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.updateGradients();
        const data = this.sortData(this.data.series);
        const lineGen = this.getLineGenerator();
        this.path = lineGen(data) || '';
        const areaGen = this.getAreaGenerator();
        this.areaPath = areaGen(data) || '';
        if (this.hasRange) {
            const range = this.getRangeGenerator();
            this.outerPath = range(data) || '';
        }
        if (this.hasGradient) {
            this.stroke = this.gradientUrl;
            const values = this.data.series.map(d => d.value);
            const max = Math.max(...values);
            const min = Math.min(...values);
            if (max === min) {
                this.stroke = this.colors.getColor(max);
            }
        }
        else {
            this.stroke = this.colors.getColor(this.data.name);
        }
    }
    getLineGenerator() {
        return line()
            .x(d => {
            const label = d.name;
            let value;
            if (this.scaleType === 'time') {
                value = this.xScale(label);
            }
            else if (this.scaleType === 'linear') {
                value = this.xScale(Number(label));
            }
            else {
                value = this.xScale(label);
            }
            return value;
        })
            .y(d => this.yScale(d.value))
            .curve(this.curve);
    }
    getRangeGenerator() {
        return area()
            .x(d => {
            const label = d.name;
            let value;
            if (this.scaleType === 'time') {
                value = this.xScale(label);
            }
            else if (this.scaleType === 'linear') {
                value = this.xScale(Number(label));
            }
            else {
                value = this.xScale(label);
            }
            return value;
        })
            .y0(d => this.yScale(typeof d.min === 'number' ? d.min : d.value))
            .y1(d => this.yScale(typeof d.max === 'number' ? d.max : d.value))
            .curve(this.curve);
    }
    getAreaGenerator() {
        const xProperty = d => {
            const label = d.name;
            return this.xScale(label);
        };
        return area()
            .x(xProperty)
            .y0(() => this.yScale.range()[0])
            .y1(d => this.yScale(d.value))
            .curve(this.curve);
    }
    sortData(data) {
        if (this.scaleType === 'linear') {
            data = sortLinear(data, 'name');
        }
        else if (this.scaleType === 'time') {
            data = sortByTime(data, 'name');
        }
        else {
            data = sortByDomain(data, 'name', 'asc', this.xScale.domain());
        }
        return data;
    }
    updateGradients() {
        if (this.colors.scaleType === 'linear') {
            this.hasGradient = true;
            this.gradientId = 'grad' + id().toString();
            this.gradientUrl = `url(#${this.gradientId})`;
            const values = this.data.series.map(d => d.value);
            const max = Math.max(...values);
            const min = Math.min(...values);
            this.gradientStops = this.colors.getLinearGradientStops(max, min);
            this.areaGradientStops = this.colors.getLinearGradientStops(max);
        }
        else {
            this.hasGradient = false;
            this.gradientStops = undefined;
            this.areaGradientStops = undefined;
        }
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name;
        });
        return item !== undefined;
    }
    isInactive(entry) {
        if (!this.activeEntries || this.activeEntries.length === 0)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name;
        });
        return item === undefined;
    }
}
LineSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-line-series]',
                template: `
    <svg:g>
      <defs>
        <svg:g
          ngx-charts-svg-linear-gradient
          *ngIf="hasGradient"
          orientation="vertical"
          [name]="gradientId"
          [stops]="gradientStops"
        />
      </defs>
      <svg:g
        ngx-charts-area
        class="line-highlight"
        [data]="data"
        [path]="areaPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [opacity]="0.25"
        [startOpacity]="0"
        [gradient]="true"
        [stops]="areaGradientStops"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [animations]="animations"
      />
      <svg:g
        ngx-charts-line
        class="line-series"
        [data]="data"
        [path]="path"
        [stroke]="stroke"
        [animations]="animations"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
      />
      <svg:g
        ngx-charts-area
        *ngIf="hasRange"
        class="line-series-range"
        [data]="data"
        [path]="outerPath"
        [fill]="hasGradient ? gradientUrl : colors.getColor(data.name)"
        [class.active]="isActive(data)"
        [class.inactive]="isInactive(data)"
        [opacity]="rangeFillOpacity"
        [animations]="animations"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
LineSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    colors: [{ type: Input }],
    scaleType: [{ type: Input }],
    curve: [{ type: Input }],
    activeEntries: [{ type: Input }],
    rangeFillOpacity: [{ type: Input }],
    hasRange: [{ type: Input }],
    animations: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1zZXJpZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2xpbmUtY2hhcnQvbGluZS1zZXJpZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0Qix1QkFBdUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUV0QyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQXVEckUsTUFBTSxPQUFPLG1CQUFtQjtJQXJEaEM7UUErRFcsZUFBVSxHQUFZLElBQUksQ0FBQztJQTJJdEMsQ0FBQztJQS9IQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBDLElBQUksSUFBSSxDQUFDLFFBQVEs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QUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLEtBQUssU0FBUyxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUN6RSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxLQUFLLFNBQVMsQ0FBQztJQUM1QixDQUFDOzs7WUF6TUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7bUJBRUUsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFDTCxLQUFLO29CQUNMLEtBQUs7NEJBQ0wsS0FBSzsrQkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgYXJlYSwgbGluZSB9IGZyb20gJ2QzLXNoYXBlJztcclxuXHJcbmltcG9ydCB7IGlkIH0gZnJvbSAnLi4vdXRpbHMvaWQnO1xyXG5pbXBvcnQgeyBzb3J0TGluZWFyLCBzb3J0QnlUaW1lLCBzb3J0QnlEb21haW4gfSBmcm9tICcuLi91dGlscy9zb3J0JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWxpbmUtc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6Zz5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICBuZ3gtY2hhcnRzLXN2Zy1saW5lYXItZ3JhZGllbnRcclxuICAgICAgICAgICpuZ0lmPVwiaGFzR3JhZGllbnRcIlxyXG4gICAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXHJcbiAgICAgICAgICBbbmFtZV09XCJncmFkaWVudElkXCJcclxuICAgICAgICAgIFtzdG9wc109XCJncmFkaWVudFN0b3BzXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L2RlZnM+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtYXJlYVxyXG4gICAgICAgIGNsYXNzPVwibGluZS1oaWdobGlnaHRcIlxyXG4gICAgICAgIFtkYXRhXT1cImRhdGFcIlxyXG4gICAgICAgIFtwYXRoXT1cImFyZWFQYXRoXCJcclxuICAgICAgICBbZmlsbF09XCJoYXNHcmFkaWVudCA/IGdyYWRpZW50VXJsIDogY29sb3JzLmdldENvbG9yKGRhdGEubmFtZSlcIlxyXG4gICAgICAgIFtvcGFjaXR5XT1cIjAuMjVcIlxyXG4gICAgICAgIFtzdGFydE9wYWNpdHldPVwiMFwiXHJcbiAgICAgICAgW2dyYWRpZW50XT1cInRydWVcIlxyXG4gICAgICAgIFtzdG9wc109XCJhcmVhR3JhZGllbnRTdG9wc1wiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZShkYXRhKVwiXHJcbiAgICAgICAgW2NsYXNzLmluYWN0aXZlXT1cImlzSW5hY3RpdmUoZGF0YSlcIlxyXG4gICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAvPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLWxpbmVcclxuICAgICAgICBjbGFzcz1cImxpbmUtc2VyaWVzXCJcclxuICAgICAgICBbZGF0YV09XCJkYXRhXCJcclxuICAgICAgICBbcGF0aF09XCJwYXRoXCJcclxuICAgICAgICBbc3Ryb2tlXT1cInN0cm9rZVwiXHJcbiAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZShkYXRhKVwiXHJcbiAgICAgICAgW2NsYXNzLmluYWN0aXZlXT1cImlzSW5hY3RpdmUoZGF0YSlcIlxyXG4gICAgICAvPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLWFyZWFcclxuICAgICAgICAqbmdJZj1cImhhc1JhbmdlXCJcclxuICAgICAgICBjbGFzcz1cImxpbmUtc2VyaWVzLXJhbmdlXCJcclxuICAgICAgICBbZGF0YV09XCJkYXRhXCJcclxuICAgICAgICBbcGF0aF09XCJvdXRlclBhdGhcIlxyXG4gICAgICAgIFtmaWxsXT1cImhhc0dyYWRpZW50ID8gZ3JhZGllbnRVcmwgOiBjb2xvcnMuZ2V0Q29sb3IoZGF0YS5uYW1lKVwiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZShkYXRhKVwiXHJcbiAgICAgICAgW2NsYXNzLmluYWN0aXZlXT1cImlzSW5hY3RpdmUoZGF0YSlcIlxyXG4gICAgICAgIFtvcGFjaXR5XT1cInJhbmdlRmlsbE9wYWNpdHlcIlxyXG4gICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAvPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMaW5lU2VyaWVzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBkYXRhO1xyXG4gIEBJbnB1dCgpIHhTY2FsZTtcclxuICBASW5wdXQoKSB5U2NhbGU7XHJcbiAgQElucHV0KCkgY29sb3JzO1xyXG4gIEBJbnB1dCgpIHNjYWxlVHlwZTtcclxuICBASW5wdXQoKSBjdXJ2ZTogYW55O1xyXG4gIEBJbnB1dCgpIGFjdGl2ZUVudHJpZXM6IGFueVtdO1xyXG4gIEBJbnB1dCgpIHJhbmdlRmlsbE9wYWNpdHk6IG51bWJlcjtcclxuICBASW5wdXQoKSBoYXNSYW5nZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhbmltYXRpb25zOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgcGF0aDogc3RyaW5nO1xyXG4gIG91dGVyUGF0aDogc3RyaW5nO1xyXG4gIGFyZWFQYXRoOiBzdHJpbmc7XHJcbiAgZ3JhZGllbnRJZDogc3RyaW5nO1xyXG4gIGdyYWRpZW50VXJsOiBzdHJpbmc7XHJcbiAgaGFzR3JhZGllbnQ6IGJvb2xlYW47XHJcbiAgZ3JhZGllbnRTdG9wczogYW55W107XHJcbiAgYXJlYUdyYWRpZW50U3RvcHM6IGFueVtdO1xyXG4gIHN0cm9rZTogYW55O1xyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGVHcmFkaWVudHMoKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5zb3J0RGF0YSh0aGlzLmRhdGEuc2VyaWVzKTtcclxuXHJcbiAgICBjb25zdCBsaW5lR2VuID0gdGhpcy5nZXRMaW5lR2VuZXJhdG9yKCk7XHJcbiAgICB0aGlzLnBhdGggPSBsaW5lR2VuKGRhdGEpIHx8ICcnO1xyXG5cclxuICAgIGNvbnN0IGFyZWFHZW4gPSB0aGlzLmdldEFyZWFHZW5lcmF0b3IoKTtcclxuICAgIHRoaXMuYXJlYVBhdGggPSBhcmVhR2VuKGRhdGEpIHx8ICcnO1xyXG5cclxuICAgIGlmICh0aGlzLmhhc1JhbmdlKSB7XHJcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5nZXRSYW5nZUdlbmVyYXRvcigpO1xyXG4gICAgICB0aGlzLm91dGVyUGF0aCA9IHJhbmdlKGRhdGEpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmhhc0dyYWRpZW50KSB7XHJcbiAgICAgIHRoaXMuc3Ryb2tlID0gdGhpcy5ncmFkaWVudFVybDtcclxuICAgICAgY29uc3QgdmFsdWVzID0gdGhpcy5kYXRhLnNlcmllcy5tYXAoZCA9PiBkLnZhbHVlKTtcclxuICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4udmFsdWVzKTtcclxuICAgICAgY29uc3QgbWluID0gTWF0aC5taW4oLi4udmFsdWVzKTtcclxuICAgICAgaWYgKG1heCA9PT0gbWluKSB7XHJcbiAgICAgICAgdGhpcy5zdHJva2UgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcihtYXgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY29sb3JzLmdldENvbG9yKHRoaXMuZGF0YS5uYW1lKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldExpbmVHZW5lcmF0b3IoKTogYW55IHtcclxuICAgIHJldHVybiBsaW5lPGFueT4oKVxyXG4gICAgICAueChkID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbCA9IGQubmFtZTtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy54U2NhbGUobGFiZWwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMueFNjYWxlKE51bWJlcihsYWJlbCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMueFNjYWxlKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICB9KVxyXG4gICAgICAueShkID0+IHRoaXMueVNjYWxlKGQudmFsdWUpKVxyXG4gICAgICAuY3VydmUodGhpcy5jdXJ2ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRSYW5nZUdlbmVyYXRvcigpOiBhbnkge1xyXG4gICAgcmV0dXJuIGFyZWE8YW55PigpXHJcbiAgICAgIC54KGQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhYmVsID0gZC5uYW1lO1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnhTY2FsZShsYWJlbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy54U2NhbGUoTnVtYmVyKGxhYmVsKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhbHVlID0gdGhpcy54U2NhbGUobGFiZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgIH0pXHJcbiAgICAgIC55MChkID0+IHRoaXMueVNjYWxlKHR5cGVvZiBkLm1pbiA9PT0gJ251bWJlcicgPyBkLm1pbiA6IGQudmFsdWUpKVxyXG4gICAgICAueTEoZCA9PiB0aGlzLnlTY2FsZSh0eXBlb2YgZC5tYXggPT09ICdudW1iZXInID8gZC5tYXggOiBkLnZhbHVlKSlcclxuICAgICAgLmN1cnZlKHRoaXMuY3VydmUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXJlYUdlbmVyYXRvcigpOiBhbnkge1xyXG4gICAgY29uc3QgeFByb3BlcnR5ID0gZCA9PiB7XHJcbiAgICAgIGNvbnN0IGxhYmVsID0gZC5uYW1lO1xyXG4gICAgICByZXR1cm4gdGhpcy54U2NhbGUobGFiZWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYXJlYTxhbnk+KClcclxuICAgICAgLngoeFByb3BlcnR5KVxyXG4gICAgICAueTAoKCkgPT4gdGhpcy55U2NhbGUucmFuZ2UoKVswXSlcclxuICAgICAgLnkxKGQgPT4gdGhpcy55U2NhbGUoZC52YWx1ZSkpXHJcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcclxuICB9XHJcblxyXG4gIHNvcnREYXRhKGRhdGEpIHtcclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcclxuICAgICAgZGF0YSA9IHNvcnRMaW5lYXIoZGF0YSwgJ25hbWUnKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xyXG4gICAgICBkYXRhID0gc29ydEJ5VGltZShkYXRhLCAnbmFtZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YSA9IHNvcnRCeURvbWFpbihkYXRhLCAnbmFtZScsICdhc2MnLCB0aGlzLnhTY2FsZS5kb21haW4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVHcmFkaWVudHMoKSB7XHJcbiAgICBpZiAodGhpcy5jb2xvcnMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICB0aGlzLmhhc0dyYWRpZW50ID0gdHJ1ZTtcclxuICAgICAgdGhpcy5ncmFkaWVudElkID0gJ2dyYWQnICsgaWQoKS50b1N0cmluZygpO1xyXG4gICAgICB0aGlzLmdyYWRpZW50VXJsID0gYHVybCgjJHt0aGlzLmdyYWRpZW50SWR9KWA7XHJcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZGF0YS5zZXJpZXMubWFwKGQgPT4gZC52YWx1ZSk7XHJcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcbiAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnZhbHVlcyk7XHJcbiAgICAgIHRoaXMuZ3JhZGllbnRTdG9wcyA9IHRoaXMuY29sb3JzLmdldExpbmVhckdyYWRpZW50U3RvcHMobWF4LCBtaW4pO1xyXG4gICAgICB0aGlzLmFyZWFHcmFkaWVudFN0b3BzID0gdGhpcy5jb2xvcnMuZ2V0TGluZWFyR3JhZGllbnRTdG9wcyhtYXgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oYXNHcmFkaWVudCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmdyYWRpZW50U3RvcHMgPSB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuYXJlYUdyYWRpZW50U3RvcHMgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGlzSW5hY3RpdmUoZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzIHx8IHRoaXMuYWN0aXZlRW50cmllcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gPT09IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIl19