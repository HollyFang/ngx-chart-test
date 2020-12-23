import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { lineRadial } from 'd3-shape';
import { id } from '../utils/id';
import { sortLinear, sortByTime, sortByDomain } from '../utils/sort';
import { escapeLabel } from '../common/label.helper';
export class PolarSeriesComponent {
    constructor() {
        this.tooltipDisabled = false;
        this.gradient = false;
        this.animations = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.circleRadius = 3;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.updateGradients();
        const line = this.getLineGenerator();
        const data = this.sortData(this.data.series);
        const seriesName = this.data.name;
        const linearScaleType = this.colors.scaleType === 'linear';
        const min = this.yScale.domain()[0];
        this.seriesColor = this.colors.getColor(linearScaleType ? min : seriesName);
        this.path = line(data) || '';
        this.circles = data.map(d => {
            const a = this.getAngle(d);
            const r = this.getRadius(d);
            const value = d.value;
            const color = this.colors.getColor(linearScaleType ? Math.abs(value) : seriesName);
            const cData = Object.assign({}, d, {
                series: seriesName,
                value,
                name: d.name
            });
            return {
                data: cData,
                cx: r * Math.sin(a),
                cy: -r * Math.cos(a),
                value,
                color,
                label: d.name
            };
        });
        this.active = this.isActive(this.data);
        this.inactive = this.isInactive(this.data);
        this.tooltipText = this.tooltipText || (c => this.defaultTooltipText(c));
    }
    getAngle(d) {
        const label = d.name;
        if (this.scaleType === 'time') {
            return this.xScale(label);
        }
        else if (this.scaleType === 'linear') {
            return this.xScale(Number(label));
        }
        return this.xScale(label);
    }
    getRadius(d) {
        return this.yScale(d.value);
    }
    getLineGenerator() {
        return lineRadial()
            .angle(d => this.getAngle(d))
            .radius(d => this.getRadius(d))
            .curve(this.curve);
    }
    sortData(data) {
        if (this.scaleType === 'linear') {
            return sortLinear(data, 'name');
        }
        else if (this.scaleType === 'time') {
            return sortByTime(data, 'name');
        }
        return sortByDomain(data, 'name', 'asc', this.xScale.domain());
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
    defaultTooltipText({ label, value }) {
        return `
      <span class="tooltip-label">${escapeLabel(this.data.name)} • ${escapeLabel(label)}</span>
      <span class="tooltip-val">${value.toLocaleString()}</span>
    `;
    }
    updateGradients() {
        this.hasGradient = this.gradient || this.colors.scaleType === 'linear';
        if (!this.hasGradient) {
            return;
        }
        this.gradientId = 'grad' + id().toString();
        this.gradientUrl = `url(#${this.gradientId})`;
        if (this.colors.scaleType === 'linear') {
            const values = this.data.series.map(d => d.value);
            const max = Math.max(...values);
            const min = Math.min(...values);
            this.gradientStops = this.colors.getLinearGradientStops(max, min);
        }
        else {
            this.gradientStops = undefined;
        }
    }
}
PolarSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-polar-series]',
                template: `
    <svg:g class="polar-charts-series">
      <defs>
        <svg:g
          ngx-charts-svg-radial-gradient
          *ngIf="hasGradient"
          orientation="vertical"
          [color]="seriesColor"
          [name]="gradientId"
          [startOpacity]="0.25"
          [endOpacity]="1"
          [stops]="gradientStops"
        />
      </defs>
      <svg:g
        ngx-charts-line
        class="polar-series-path"
        [path]="path"
        [stroke]="hasGradient ? gradientUrl : seriesColor"
        [class.active]="active"
        [class.inactive]="inactive"
        [attr.fill-opacity]="rangeFillOpacity"
        [fill]="hasGradient ? gradientUrl : seriesColor"
        [animations]="animations"
      />
      <svg:g
        ngx-charts-circle
        *ngFor="let circle of circles"
        class="circle"
        [cx]="circle.cx"
        [cy]="circle.cy"
        [r]="circleRadius"
        [fill]="circle.color"
        [style.opacity]="inactive ? 0.2 : 1"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'top'"
        tooltipType="tooltip"
        [tooltipTitle]="tooltipTemplate ? undefined : tooltipText(circle)"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipContext]="circle.data"
        (select)="select.emit(circle.data)"
        (activate)="activate.emit({ name: circle.data.series })"
        (deactivate)="deactivate.emit({ name: circle.data.series })"
      ></svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PolarSeriesComponent.propDecorators = {
    name: [{ type: Input }],
    data: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    colors: [{ type: Input }],
    scaleType: [{ type: Input }],
    curve: [{ type: Input }],
    activeEntries: [{ type: Input }],
    rangeFillOpacity: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipText: [{ type: Input }],
    gradient: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sYXItc2VyaWVzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9wb2xhci1jaGFydC9wb2xhci1zZXJpZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUdMLHVCQUF1QixFQUV2QixNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBcURyRCxNQUFNLE9BQU8sb0JBQW9CO0lBbkRqQztRQTZEVyxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUVqQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTFCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFMUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFJMUMsaUJBQVksR0FBVyxDQUFDLENBQUM7SUFvSTNCLENBQUM7SUF0SEMsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUVyQyxNQUFNLElBQUksR0FBRyxJQUFJLENB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QUFHLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25FO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztTQUNoQztJQUNILENBQUM7OztZQTVNRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7bUJBRUUsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLOytCQUNMLEtBQUs7OEJBQ0wsS0FBSzswQkFDTCxLQUFLO3VCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgVGVtcGxhdGVSZWYsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBsaW5lUmFkaWFsIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5cclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcbmltcG9ydCB7IHNvcnRMaW5lYXIsIHNvcnRCeVRpbWUsIHNvcnRCeURvbWFpbiB9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xyXG5pbXBvcnQgeyBlc2NhcGVMYWJlbCB9IGZyb20gJy4uL2NvbW1vbi9sYWJlbC5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtcG9sYXItc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6ZyBjbGFzcz1cInBvbGFyLWNoYXJ0cy1zZXJpZXNcIj5cclxuICAgICAgPGRlZnM+XHJcbiAgICAgICAgPHN2ZzpnXHJcbiAgICAgICAgICBuZ3gtY2hhcnRzLXN2Zy1yYWRpYWwtZ3JhZGllbnRcclxuICAgICAgICAgICpuZ0lmPVwiaGFzR3JhZGllbnRcIlxyXG4gICAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXHJcbiAgICAgICAgICBbY29sb3JdPVwic2VyaWVzQ29sb3JcIlxyXG4gICAgICAgICAgW25hbWVdPVwiZ3JhZGllbnRJZFwiXHJcbiAgICAgICAgICBbc3RhcnRPcGFjaXR5XT1cIjAuMjVcIlxyXG4gICAgICAgICAgW2VuZE9wYWNpdHldPVwiMVwiXHJcbiAgICAgICAgICBbc3RvcHNdPVwiZ3JhZGllbnRTdG9wc1wiXHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kZWZzPlxyXG4gICAgICA8c3ZnOmdcclxuICAgICAgICBuZ3gtY2hhcnRzLWxpbmVcclxuICAgICAgICBjbGFzcz1cInBvbGFyLXNlcmllcy1wYXRoXCJcclxuICAgICAgICBbcGF0aF09XCJwYXRoXCJcclxuICAgICAgICBbc3Ryb2tlXT1cImhhc0dyYWRpZW50ID8gZ3JhZGllbnRVcmwgOiBzZXJpZXNDb2xvclwiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVcIlxyXG4gICAgICAgIFtjbGFzcy5pbmFjdGl2ZV09XCJpbmFjdGl2ZVwiXHJcbiAgICAgICAgW2F0dHIuZmlsbC1vcGFjaXR5XT1cInJhbmdlRmlsbE9wYWNpdHlcIlxyXG4gICAgICAgIFtmaWxsXT1cImhhc0dyYWRpZW50ID8gZ3JhZGllbnRVcmwgOiBzZXJpZXNDb2xvclwiXHJcbiAgICAgICAgW2FuaW1hdGlvbnNdPVwiYW5pbWF0aW9uc1wiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtY2lyY2xlXHJcbiAgICAgICAgKm5nRm9yPVwibGV0IGNpcmNsZSBvZiBjaXJjbGVzXCJcclxuICAgICAgICBjbGFzcz1cImNpcmNsZVwiXHJcbiAgICAgICAgW2N4XT1cImNpcmNsZS5jeFwiXHJcbiAgICAgICAgW2N5XT1cImNpcmNsZS5jeVwiXHJcbiAgICAgICAgW3JdPVwiY2lyY2xlUmFkaXVzXCJcclxuICAgICAgICBbZmlsbF09XCJjaXJjbGUuY29sb3JcIlxyXG4gICAgICAgIFtzdHlsZS5vcGFjaXR5XT1cImluYWN0aXZlID8gMC4yIDogMVwiXHJcbiAgICAgICAgbmd4LXRvb2x0aXBcclxuICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwiJ3RvcCdcIlxyXG4gICAgICAgIHRvb2x0aXBUeXBlPVwidG9vbHRpcFwiXHJcbiAgICAgICAgW3Rvb2x0aXBUaXRsZV09XCJ0b29sdGlwVGVtcGxhdGUgPyB1bmRlZmluZWQgOiB0b29sdGlwVGV4dChjaXJjbGUpXCJcclxuICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiXHJcbiAgICAgICAgW3Rvb2x0aXBDb250ZXh0XT1cImNpcmNsZS5kYXRhXCJcclxuICAgICAgICAoc2VsZWN0KT1cInNlbGVjdC5lbWl0KGNpcmNsZS5kYXRhKVwiXHJcbiAgICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlLmVtaXQoeyBuYW1lOiBjaXJjbGUuZGF0YS5zZXJpZXMgfSlcIlxyXG4gICAgICAgIChkZWFjdGl2YXRlKT1cImRlYWN0aXZhdGUuZW1pdCh7IG5hbWU6IGNpcmNsZS5kYXRhLnNlcmllcyB9KVwiXHJcbiAgICAgID48L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQb2xhclNlcmllc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgbmFtZTtcclxuICBASW5wdXQoKSBkYXRhO1xyXG4gIEBJbnB1dCgpIHhTY2FsZTsgLy8gVGhldGFcclxuICBASW5wdXQoKSB5U2NhbGU7IC8vIFJcclxuICBASW5wdXQoKSBjb2xvcnM7XHJcbiAgQElucHV0KCkgc2NhbGVUeXBlO1xyXG4gIEBJbnB1dCgpIGN1cnZlOiBhbnk7XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W107XHJcbiAgQElucHV0KCkgcmFuZ2VGaWxsT3BhY2l0eTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBUZXh0OiAobzogYW55KSA9PiBzdHJpbmc7XHJcbiAgQElucHV0KCkgZ3JhZGllbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBkZWFjdGl2YXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgY2lyY2xlczogYW55W107XHJcbiAgY2lyY2xlUmFkaXVzOiBudW1iZXIgPSAzO1xyXG5cclxuICBvdXRlclBhdGg6IHN0cmluZztcclxuICBhcmVhUGF0aDogc3RyaW5nO1xyXG4gIGdyYWRpZW50SWQ6IHN0cmluZztcclxuICBncmFkaWVudFVybDogc3RyaW5nO1xyXG4gIGhhc0dyYWRpZW50OiBib29sZWFuO1xyXG4gIGdyYWRpZW50U3RvcHM6IGFueVtdO1xyXG4gIGFyZWFHcmFkaWVudFN0b3BzOiBhbnlbXTtcclxuICBzZXJpZXNDb2xvcjogc3RyaW5nO1xyXG5cclxuICBhY3RpdmU6IGJvb2xlYW47XHJcbiAgaW5hY3RpdmU6IGJvb2xlYW47XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUdyYWRpZW50cygpO1xyXG5cclxuICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdldExpbmVHZW5lcmF0b3IoKTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0gdGhpcy5zb3J0RGF0YSh0aGlzLmRhdGEuc2VyaWVzKTtcclxuXHJcbiAgICBjb25zdCBzZXJpZXNOYW1lID0gdGhpcy5kYXRhLm5hbWU7XHJcbiAgICBjb25zdCBsaW5lYXJTY2FsZVR5cGUgPSB0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInO1xyXG4gICAgY29uc3QgbWluID0gdGhpcy55U2NhbGUuZG9tYWluKClbMF07XHJcbiAgICB0aGlzLnNlcmllc0NvbG9yID0gdGhpcy5jb2xvcnMuZ2V0Q29sb3IobGluZWFyU2NhbGVUeXBlID8gbWluIDogc2VyaWVzTmFtZSk7XHJcblxyXG4gICAgdGhpcy5wYXRoID0gbGluZShkYXRhKSB8fCAnJztcclxuXHJcbiAgICB0aGlzLmNpcmNsZXMgPSBkYXRhLm1hcChkID0+IHtcclxuICAgICAgY29uc3QgYSA9IHRoaXMuZ2V0QW5nbGUoZCk7XHJcbiAgICAgIGNvbnN0IHIgPSB0aGlzLmdldFJhZGl1cyhkKTtcclxuICAgICAgY29uc3QgdmFsdWUgPSBkLnZhbHVlO1xyXG5cclxuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcihsaW5lYXJTY2FsZVR5cGUgPyBNYXRoLmFicyh2YWx1ZSkgOiBzZXJpZXNOYW1lKTtcclxuXHJcbiAgICAgIGNvbnN0IGNEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgZCwge1xyXG4gICAgICAgIHNlcmllczogc2VyaWVzTmFtZSxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBuYW1lOiBkLm5hbWVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGNEYXRhLFxyXG4gICAgICAgIGN4OiByICogTWF0aC5zaW4oYSksXHJcbiAgICAgICAgY3k6IC1yICogTWF0aC5jb3MoYSksXHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgbGFiZWw6IGQubmFtZVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hY3RpdmUgPSB0aGlzLmlzQWN0aXZlKHRoaXMuZGF0YSk7XHJcbiAgICB0aGlzLmluYWN0aXZlID0gdGhpcy5pc0luYWN0aXZlKHRoaXMuZGF0YSk7XHJcbiAgICB0aGlzLnRvb2x0aXBUZXh0ID0gdGhpcy50b29sdGlwVGV4dCB8fCAoYyA9PiB0aGlzLmRlZmF1bHRUb29sdGlwVGV4dChjKSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbmdsZShkKSB7XHJcbiAgICBjb25zdCBsYWJlbCA9IGQubmFtZTtcclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ3RpbWUnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnhTY2FsZShsYWJlbCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICByZXR1cm4gdGhpcy54U2NhbGUoTnVtYmVyKGxhYmVsKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy54U2NhbGUobGFiZWwpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmFkaXVzKGQpIHtcclxuICAgIHJldHVybiB0aGlzLnlTY2FsZShkLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldExpbmVHZW5lcmF0b3IoKTogYW55IHtcclxuICAgIHJldHVybiBsaW5lUmFkaWFsPGFueT4oKVxyXG4gICAgICAuYW5nbGUoZCA9PiB0aGlzLmdldEFuZ2xlKGQpKVxyXG4gICAgICAucmFkaXVzKGQgPT4gdGhpcy5nZXRSYWRpdXMoZCkpXHJcbiAgICAgIC5jdXJ2ZSh0aGlzLmN1cnZlKTtcclxuICB9XHJcblxyXG4gIHNvcnREYXRhKGRhdGEpIHtcclxuICAgIGlmICh0aGlzLnNjYWxlVHlwZSA9PT0gJ2xpbmVhcicpIHtcclxuICAgICAgcmV0dXJuIHNvcnRMaW5lYXIoZGF0YSwgJ25hbWUnKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZVR5cGUgPT09ICd0aW1lJykge1xyXG4gICAgICByZXR1cm4gc29ydEJ5VGltZShkYXRhLCAnbmFtZScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNvcnRCeURvbWFpbihkYXRhLCAnbmFtZScsICdhc2MnLCB0aGlzLnhTY2FsZS5kb21haW4oKSk7XHJcbiAgfVxyXG5cclxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGlzSW5hY3RpdmUoZW50cnkpOiBib29sZWFuIHtcclxuICAgIGlmICghdGhpcy5hY3RpdmVFbnRyaWVzIHx8IHRoaXMuYWN0aXZlRW50cmllcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gPT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGRlZmF1bHRUb29sdGlwVGV4dCh7IGxhYmVsLCB2YWx1ZSB9KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgIDxzcGFuIGNsYXNzPVwidG9vbHRpcC1sYWJlbFwiPiR7ZXNjYXBlTGFiZWwodGhpcy5kYXRhLm5hbWUpfSDigKIgJHtlc2NhcGVMYWJlbChsYWJlbCl9PC9zcGFuPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXAtdmFsXCI+JHt2YWx1ZS50b0xvY2FsZVN0cmluZygpfTwvc3Bhbj5cclxuICAgIGA7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVHcmFkaWVudHMoKSB7XHJcbiAgICB0aGlzLmhhc0dyYWRpZW50ID0gdGhpcy5ncmFkaWVudCB8fCB0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInO1xyXG5cclxuICAgIGlmICghdGhpcy5oYXNHcmFkaWVudCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ncmFkaWVudElkID0gJ2dyYWQnICsgaWQoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5ncmFkaWVudFVybCA9IGB1cmwoIyR7dGhpcy5ncmFkaWVudElkfSlgO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZGF0YS5zZXJpZXMubWFwKGQgPT4gZC52YWx1ZSk7XHJcbiAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KC4uLnZhbHVlcyk7XHJcbiAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKC4uLnZhbHVlcyk7XHJcbiAgICAgIHRoaXMuZ3JhZGllbnRTdG9wcyA9IHRoaXMuY29sb3JzLmdldExpbmVhckdyYWRpZW50U3RvcHMobWF4LCBtaW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ncmFkaWVudFN0b3BzID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=