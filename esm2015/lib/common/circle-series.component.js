import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { formatLabel, escapeLabel } from '../common/label.helper';
import { id } from '../utils/id';
export class CircleSeriesComponent {
    constructor() {
        this.type = 'standard';
        this.tooltipDisabled = false;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.barVisible = false;
    }
    ngOnInit() {
        this.gradientId = 'grad' + id().toString();
        this.gradientFill = `url(#${this.gradientId})`;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.circle = this.getActiveCircle();
    }
    getActiveCircle() {
        const indexActiveDataPoint = this.data.series.findIndex(d => {
            const label = d.name;
            return label && this.visibleValue && label.toString() === this.visibleValue.toString() && d.value !== undefined;
        });
        if (indexActiveDataPoint === -1) {
            // No valid point is 'active/hovered over' at this moment.
            return undefined;
        }
        return this.mapDataPointToCircle(this.data.series[indexActiveDataPoint], indexActiveDataPoint);
    }
    mapDataPointToCircle(d, i) {
        const seriesName = this.data.name;
        const value = d.value;
        const label = d.name;
        const tooltipLabel = formatLabel(label);
        let cx;
        if (this.scaleType === 'time') {
            cx = this.xScale(label);
        }
        else if (this.scaleType === 'linear') {
            cx = this.xScale(Number(label));
        }
        else {
            cx = this.xScale(label);
        }
        const cy = this.yScale(this.type === 'standard' ? value : d.d1);
        const radius = 5;
        const height = this.yScale.range()[0] - cy;
        const opacity = 1;
        let color;
        if (this.colors.scaleType === 'linear') {
            if (this.type === 'standard') {
                color = this.colors.getColor(value);
            }
            else {
                color = this.colors.getColor(d.d1);
            }
        }
        else {
            color = this.colors.getColor(seriesName);
        }
        const data = Object.assign({}, d, {
            series: seriesName,
            value,
            name: label
        });
        return {
            classNames: [`circle-data-${i}`],
            value,
            label,
            data,
            cx,
            cy,
            radius,
            height,
            tooltipLabel,
            color,
            opacity,
            seriesName,
            gradientStops: this.getGradientStops(color),
            min: d.min,
            max: d.max
        };
    }
    getTooltipText({ tooltipLabel, value, seriesName, min, max }) {
        return `
      <span class="tooltip-label">${escapeLabel(seriesName)} • ${escapeLabel(tooltipLabel)}</span>
      <span class="tooltip-val">${value.toLocaleString()}${this.getTooltipMinMaxText(min, max)}</span>
    `;
    }
    getTooltipMinMaxText(min, max) {
        if (min !== undefined || max !== undefined) {
            let result = ' (';
            if (min !== undefined) {
                if (max === undefined) {
                    result += '≥';
                }
                result += min.toLocaleString();
                if (max !== undefined) {
                    result += ' - ';
                }
            }
            else if (max !== undefined) {
                result += '≤';
            }
            if (max !== undefined) {
                result += max.toLocaleString();
            }
            result += ')';
            return result;
        }
        else {
            return '';
        }
    }
    getGradientStops(color) {
        return [
            {
                offset: 0,
                color,
                opacity: 0.2
            },
            {
                offset: 100,
                color,
                opacity: 1
            }
        ];
    }
    onClick(data) {
        this.select.emit(data);
    }
    isActive(entry) {
        if (!this.activeEntries)
            return false;
        const item = this.activeEntries.find(d => {
            return entry.name === d.name;
        });
        return item !== undefined;
    }
    activateCircle() {
        this.barVisible = true;
        this.activate.emit({ name: this.data.name });
    }
    deactivateCircle() {
        this.barVisible = false;
        this.circle.opacity = 0;
        this.deactivate.emit({ name: this.data.name });
    }
}
CircleSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-circle-series]',
                template: `
    <svg:g *ngIf="circle">
      <defs>
        <svg:g
          ngx-charts-svg-linear-gradient
          orientation="vertical"
          [name]="gradientId"
          [stops]="circle.gradientStops"
        />
      </defs>
      <svg:rect
        *ngIf="barVisible && type === 'standard'"
        [@animationState]="'active'"
        [attr.x]="circle.cx - circle.radius"
        [attr.y]="circle.cy"
        [attr.width]="circle.radius * 2"
        [attr.height]="circle.height"
        [attr.fill]="gradientFill"
        class="tooltip-bar"
      />
      <svg:g
        ngx-charts-circle
        class="circle"
        [cx]="circle.cx"
        [cy]="circle.cy"
        [r]="circle.radius"
        [fill]="circle.color"
        [class.active]="isActive({ name: circle.seriesName })"
        [pointerEvents]="circle.value === 0 ? 'none' : 'all'"
        [data]="circle.value"
        [classNames]="circle.classNames"
        (select)="onClick(circle.data)"
        (activate)="activateCircle()"
        (deactivate)="deactivateCircle()"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'top'"
        [tooltipType]="'tooltip'"
        [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(circle)"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipContext]="circle.data"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition(':enter', [
                            style({
                                opacity: 0
                            }),
                            animate(250, style({ opacity: 1 }))
                        ])
                    ])
                ]
            },] }
];
CircleSeriesComponent.propDecorators = {
    data: [{ type: Input }],
    type: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    colors: [{ type: Input }],
    scaleType: [{ type: Input }],
    visibleValue: [{ type: Input }],
    activeEntries: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLXNlcmllcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL2NpcmNsZS1zZXJpZXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBR1osdUJBQXVCLEVBRXhCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUE2RGpDLE1BQU0sT0FBTyxxQkFBcUI7SUExRGxDO1FBNERXLFNBQUksR0FBRyxVQUFVLENBQUM7UUFPbEIsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFHaEMsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFJMUMsZUFBVSxHQUFZLEtBQUssQ0FBQztJQTRKOUIsQ0FBQztJQXhKQyxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FB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QUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7OztZQXZPRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtnQkFDdkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxVQUFVLEVBQUU7b0JBQ1YsT0FBTyxDQUFDLGdCQUFnQixFQUFFO3dCQUN4QixVQUFVLENBQUMsUUFBUSxFQUFFOzRCQUNuQixLQUFLLENBQUM7Z0NBQ0osT0FBTyxFQUFFLENBQUM7NkJBQ1gsQ0FBQzs0QkFDRixPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUNwQyxDQUFDO3FCQUNILENBQUM7aUJBQ0g7YUFDRjs7O21CQUVFLEtBQUs7bUJBQ0wsS0FBSztxQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFDTCxLQUFLOzhCQUNMLEtBQUs7cUJBRUwsTUFBTTt1QkFDTixNQUFNO3lCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uSW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBUZW1wbGF0ZVJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgYW5pbWF0ZSwgdHJhbnNpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xyXG5pbXBvcnQgeyBmb3JtYXRMYWJlbCwgZXNjYXBlTGFiZWwgfSBmcm9tICcuLi9jb21tb24vbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcbmltcG9ydCB7IENvbG9ySGVscGVyIH0gZnJvbSAnLi4vY29tbW9uL2NvbG9yLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy1jaXJjbGUtc2VyaWVzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6ZyAqbmdJZj1cImNpcmNsZVwiPlxyXG4gICAgICA8ZGVmcz5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMtc3ZnLWxpbmVhci1ncmFkaWVudFxyXG4gICAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXHJcbiAgICAgICAgICBbbmFtZV09XCJncmFkaWVudElkXCJcclxuICAgICAgICAgIFtzdG9wc109XCJjaXJjbGUuZ3JhZGllbnRTdG9wc1wiXHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kZWZzPlxyXG4gICAgICA8c3ZnOnJlY3RcclxuICAgICAgICAqbmdJZj1cImJhclZpc2libGUgJiYgdHlwZSA9PT0gJ3N0YW5kYXJkJ1wiXHJcbiAgICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCInYWN0aXZlJ1wiXHJcbiAgICAgICAgW2F0dHIueF09XCJjaXJjbGUuY3ggLSBjaXJjbGUucmFkaXVzXCJcclxuICAgICAgICBbYXR0ci55XT1cImNpcmNsZS5jeVwiXHJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwiY2lyY2xlLnJhZGl1cyAqIDJcIlxyXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJjaXJjbGUuaGVpZ2h0XCJcclxuICAgICAgICBbYXR0ci5maWxsXT1cImdyYWRpZW50RmlsbFwiXHJcbiAgICAgICAgY2xhc3M9XCJ0b29sdGlwLWJhclwiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtY2lyY2xlXHJcbiAgICAgICAgY2xhc3M9XCJjaXJjbGVcIlxyXG4gICAgICAgIFtjeF09XCJjaXJjbGUuY3hcIlxyXG4gICAgICAgIFtjeV09XCJjaXJjbGUuY3lcIlxyXG4gICAgICAgIFtyXT1cImNpcmNsZS5yYWRpdXNcIlxyXG4gICAgICAgIFtmaWxsXT1cImNpcmNsZS5jb2xvclwiXHJcbiAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpc0FjdGl2ZSh7IG5hbWU6IGNpcmNsZS5zZXJpZXNOYW1lIH0pXCJcclxuICAgICAgICBbcG9pbnRlckV2ZW50c109XCJjaXJjbGUudmFsdWUgPT09IDAgPyAnbm9uZScgOiAnYWxsJ1wiXHJcbiAgICAgICAgW2RhdGFdPVwiY2lyY2xlLnZhbHVlXCJcclxuICAgICAgICBbY2xhc3NOYW1lc109XCJjaXJjbGUuY2xhc3NOYW1lc1wiXHJcbiAgICAgICAgKHNlbGVjdCk9XCJvbkNsaWNrKGNpcmNsZS5kYXRhKVwiXHJcbiAgICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlQ2lyY2xlKClcIlxyXG4gICAgICAgIChkZWFjdGl2YXRlKT1cImRlYWN0aXZhdGVDaXJjbGUoKVwiXHJcbiAgICAgICAgbmd4LXRvb2x0aXBcclxuICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwiJ3RvcCdcIlxyXG4gICAgICAgIFt0b29sdGlwVHlwZV09XCIndG9vbHRpcCdcIlxyXG4gICAgICAgIFt0b29sdGlwVGl0bGVdPVwidG9vbHRpcFRlbXBsYXRlID8gdW5kZWZpbmVkIDogZ2V0VG9vbHRpcFRleHQoY2lyY2xlKVwiXHJcbiAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgIFt0b29sdGlwQ29udGV4dF09XCJjaXJjbGUuZGF0YVwiXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgYW5pbWF0aW9uczogW1xyXG4gICAgdHJpZ2dlcignYW5pbWF0aW9uU3RhdGUnLCBbXHJcbiAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtcclxuICAgICAgICBzdHlsZSh7XHJcbiAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYW5pbWF0ZSgyNTAsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSlcclxuICAgICAgXSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ2lyY2xlU2VyaWVzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgdHlwZSA9ICdzdGFuZGFyZCc7XHJcbiAgQElucHV0KCkgeFNjYWxlO1xyXG4gIEBJbnB1dCgpIHlTY2FsZTtcclxuICBASW5wdXQoKSBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIEBJbnB1dCgpIHNjYWxlVHlwZTtcclxuICBASW5wdXQoKSB2aXNpYmxlVmFsdWU7XHJcbiAgQElucHV0KCkgYWN0aXZlRW50cmllczogYW55W107XHJcbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgYXJlYVBhdGg6IGFueTtcclxuICBjaXJjbGU6IGFueTsgLy8gYWN0aXZlIGNpcmNsZVxyXG4gIGJhclZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBncmFkaWVudElkOiBzdHJpbmc7XHJcbiAgZ3JhZGllbnRGaWxsOiBzdHJpbmc7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ncmFkaWVudElkID0gJ2dyYWQnICsgaWQoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5ncmFkaWVudEZpbGwgPSBgdXJsKCMke3RoaXMuZ3JhZGllbnRJZH0pYDtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNpcmNsZSA9IHRoaXMuZ2V0QWN0aXZlQ2lyY2xlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRBY3RpdmVDaXJjbGUoKToge30ge1xyXG4gICAgY29uc3QgaW5kZXhBY3RpdmVEYXRhUG9pbnQgPSB0aGlzLmRhdGEuc2VyaWVzLmZpbmRJbmRleChkID0+IHtcclxuICAgICAgY29uc3QgbGFiZWwgPSBkLm5hbWU7XHJcbiAgICAgIHJldHVybiBsYWJlbCAmJiB0aGlzLnZpc2libGVWYWx1ZSAmJiBsYWJlbC50b1N0cmluZygpID09PSB0aGlzLnZpc2libGVWYWx1ZS50b1N0cmluZygpICYmIGQudmFsdWUgIT09IHVuZGVmaW5lZDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChpbmRleEFjdGl2ZURhdGFQb2ludCA9PT0gLTEpIHtcclxuICAgICAgLy8gTm8gdmFsaWQgcG9pbnQgaXMgJ2FjdGl2ZS9ob3ZlcmVkIG92ZXInIGF0IHRoaXMgbW9tZW50LlxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm1hcERhdGFQb2ludFRvQ2lyY2xlKHRoaXMuZGF0YS5zZXJpZXNbaW5kZXhBY3RpdmVEYXRhUG9pbnRdLCBpbmRleEFjdGl2ZURhdGFQb2ludCk7XHJcbiAgfVxyXG5cclxuICBtYXBEYXRhUG9pbnRUb0NpcmNsZShkOiBhbnksIGk6IG51bWJlcik6IGFueSB7XHJcbiAgICBjb25zdCBzZXJpZXNOYW1lID0gdGhpcy5kYXRhLm5hbWU7XHJcblxyXG4gICAgY29uc3QgdmFsdWUgPSBkLnZhbHVlO1xyXG4gICAgY29uc3QgbGFiZWwgPSBkLm5hbWU7XHJcbiAgICBjb25zdCB0b29sdGlwTGFiZWwgPSBmb3JtYXRMYWJlbChsYWJlbCk7XHJcblxyXG4gICAgbGV0IGN4O1xyXG4gICAgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAndGltZScpIHtcclxuICAgICAgY3ggPSB0aGlzLnhTY2FsZShsYWJlbCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGVUeXBlID09PSAnbGluZWFyJykge1xyXG4gICAgICBjeCA9IHRoaXMueFNjYWxlKE51bWJlcihsYWJlbCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3ggPSB0aGlzLnhTY2FsZShsYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3kgPSB0aGlzLnlTY2FsZSh0aGlzLnR5cGUgPT09ICdzdGFuZGFyZCcgPyB2YWx1ZSA6IGQuZDEpO1xyXG4gICAgY29uc3QgcmFkaXVzID0gNTtcclxuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMueVNjYWxlLnJhbmdlKClbMF0gLSBjeTtcclxuICAgIGNvbnN0IG9wYWNpdHkgPSAxO1xyXG5cclxuICAgIGxldCBjb2xvcjtcclxuICAgIGlmICh0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICBjb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKGQuZDEpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb2xvciA9IHRoaXMuY29sb3JzLmdldENvbG9yKHNlcmllc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBkLCB7XHJcbiAgICAgIHNlcmllczogc2VyaWVzTmFtZSxcclxuICAgICAgdmFsdWUsXHJcbiAgICAgIG5hbWU6IGxhYmVsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjbGFzc05hbWVzOiBbYGNpcmNsZS1kYXRhLSR7aX1gXSxcclxuICAgICAgdmFsdWUsXHJcbiAgICAgIGxhYmVsLFxyXG4gICAgICBkYXRhLFxyXG4gICAgICBjeCxcclxuICAgICAgY3ksXHJcbiAgICAgIHJhZGl1cyxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICB0b29sdGlwTGFiZWwsXHJcbiAgICAgIGNvbG9yLFxyXG4gICAgICBvcGFjaXR5LFxyXG4gICAgICBzZXJpZXNOYW1lLFxyXG4gICAgICBncmFkaWVudFN0b3BzOiB0aGlzLmdldEdyYWRpZW50U3RvcHMoY29sb3IpLFxyXG4gICAgICBtaW46IGQubWluLFxyXG4gICAgICBtYXg6IGQubWF4XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0VG9vbHRpcFRleHQoeyB0b29sdGlwTGFiZWwsIHZhbHVlLCBzZXJpZXNOYW1lLCBtaW4sIG1heCB9KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgIDxzcGFuIGNsYXNzPVwidG9vbHRpcC1sYWJlbFwiPiR7ZXNjYXBlTGFiZWwoc2VyaWVzTmFtZSl9IOKAoiAke2VzY2FwZUxhYmVsKHRvb2x0aXBMYWJlbCl9PC9zcGFuPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXAtdmFsXCI+JHt2YWx1ZS50b0xvY2FsZVN0cmluZygpfSR7dGhpcy5nZXRUb29sdGlwTWluTWF4VGV4dChtaW4sIG1heCl9PC9zcGFuPlxyXG4gICAgYDtcclxuICB9XHJcblxyXG4gIGdldFRvb2x0aXBNaW5NYXhUZXh0KG1pbjogYW55LCBtYXg6IGFueSkge1xyXG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkIHx8IG1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGxldCByZXN1bHQgPSAnICgnO1xyXG4gICAgICBpZiAobWluICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHJlc3VsdCArPSAn4omlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0ICs9IG1pbi50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmVzdWx0ICs9ICcgLSAnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChtYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlc3VsdCArPSAn4omkJztcclxuICAgICAgfVxyXG4gICAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXN1bHQgKz0gbWF4LnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ICs9ICcpJztcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEdyYWRpZW50U3RvcHMoY29sb3IpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHtcclxuICAgICAgICBvZmZzZXQ6IDAsXHJcbiAgICAgICAgY29sb3IsXHJcbiAgICAgICAgb3BhY2l0eTogMC4yXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBvZmZzZXQ6IDEwMCxcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgIH1cclxuICAgIF07XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGRhdGEpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF0YSk7XHJcbiAgfVxyXG5cclxuICBpc0FjdGl2ZShlbnRyeSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLmFjdGl2ZUVudHJpZXMpIHJldHVybiBmYWxzZTtcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmFjdGl2ZUVudHJpZXMuZmluZChkID0+IHtcclxuICAgICAgcmV0dXJuIGVudHJ5Lm5hbWUgPT09IGQubmFtZTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGl0ZW0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlQ2lyY2xlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5iYXJWaXNpYmxlID0gdHJ1ZTtcclxuICAgIHRoaXMuYWN0aXZhdGUuZW1pdCh7IG5hbWU6IHRoaXMuZGF0YS5uYW1lIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVhY3RpdmF0ZUNpcmNsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuYmFyVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5jaXJjbGUub3BhY2l0eSA9IDA7XHJcbiAgICB0aGlzLmRlYWN0aXZhdGUuZW1pdCh7IG5hbWU6IHRoaXMuZGF0YS5uYW1lIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=