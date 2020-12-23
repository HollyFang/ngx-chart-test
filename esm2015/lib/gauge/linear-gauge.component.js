import { Component, Input, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { BaseChartComponent } from '../common/base-chart.component';
import { calculateViewDimensions } from '../common/view-dimensions.helper';
import { ColorHelper } from '../common/color.helper';
export class LinearGaugeComponent extends BaseChartComponent {
    constructor() {
        super(...arguments);
        this.min = 0;
        this.max = 100;
        this.value = 0;
        this.margin = [10, 20, 10, 20];
        this.valueResizeScale = 1;
        this.unitsResizeScale = 1;
        this.valueTextTransform = '';
        this.valueTranslate = '';
        this.unitsTextTransform = '';
        this.unitsTranslate = '';
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        setTimeout(() => {
            this.scaleText('value');
            this.scaleText('units');
        });
    }
    update() {
        super.update();
        this.hasPreviousValue = this.previousValue !== undefined;
        this.max = Math.max(this.max, this.value);
        this.min = Math.min(this.min, this.value);
        if (this.hasPreviousValue) {
            this.max = Math.max(this.max, this.previousValue);
            this.min = Math.min(this.min, this.previousValue);
        }
        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin
        });
        this.valueDomain = this.getValueDomain();
        this.valueScale = this.getValueScale();
        this.displayValue = this.getDisplayValue();
        this.setColors();
        const xOffset = this.margin[3] + this.dims.width / 2;
        const yOffset = this.margin[0] + this.dims.height / 2;
        this.transform = `translate(${xOffset}, ${yOffset})`;
        this.transformLine = `translate(${this.margin[3] + this.valueScale(this.previousValue)}, ${yOffset})`;
        this.valueTranslate = `translate(0, -15)`;
        this.unitsTranslate = `translate(0, 15)`;
        setTimeout(() => this.scaleText('value'), 50);
        setTimeout(() => this.scaleText('units'), 50);
    }
    getValueDomain() {
        return [this.min, this.max];
    }
    getValueScale() {
        return scaleLinear().range([0, this.dims.width]).domain(this.valueDomain);
    }
    getDisplayValue() {
        if (this.valueFormatting) {
            return this.valueFormatting(this.value);
        }
        return this.value.toLocaleString();
    }
    scaleText(element, repeat = true) {
        let el;
        let resizeScale;
        if (element === 'value') {
            el = this.valueTextEl;
            resizeScale = this.valueResizeScale;
        }
        else {
            el = this.unitsTextEl;
            resizeScale = this.unitsResizeScale;
        }
        const { width, height } = el.nativeElement.getBoundingClientRect();
        if (width === 0 || height === 0)
            return;
        const oldScale = resizeScale;
        const availableWidth = this.dims.width;
        const availableHeight = Math.max(this.dims.height / 2 - 15, 0);
        const resizeScaleWidth = Math.floor((availableWidth / (width / resizeScale)) * 100) / 100;
        const resizeScaleHeight = Math.floor((availableHeight / (height / resizeScale)) * 100) / 100;
        resizeScale = Math.min(resizeScaleHeight, resizeScaleWidth);
        if (resizeScale !== oldScale) {
            if (element === 'value') {
                this.valueResizeScale = resizeScale;
                this.valueTextTransform = `scale(${resizeScale}, ${resizeScale})`;
            }
            else {
                this.unitsResizeScale = resizeScale;
                this.unitsTextTransform = `scale(${resizeScale}, ${resizeScale})`;
            }
            this.cd.markForCheck();
            if (repeat) {
                setTimeout(() => {
                    this.scaleText(element, false);
                }, 50);
            }
        }
    }
    onClick() {
        this.select.emit({
            name: 'Value',
            value: this.value
        });
    }
    setColors() {
        this.colors = new ColorHelper(this.scheme, 'ordinal', [this.value], this.customColors);
    }
}
LinearGaugeComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-charts-linear-gauge',
                template: `
    <ngx-charts-chart [view]="[width, height]" [showLegend]="false" [animations]="animations" (click)="onClick()">
      <svg:g class="linear-gauge chart">
        <svg:g
          ngx-charts-bar
          class="background-bar"
          [width]="dims.width"
          [height]="3"
          [x]="margin[3]"
          [y]="dims.height / 2 + margin[0] - 2"
          [data]="{}"
          [orientation]="'horizontal'"
          [roundEdges]="true"
          [animations]="animations"
        ></svg:g>
        <svg:g
          ngx-charts-bar
          [width]="valueScale(value)"
          [height]="3"
          [x]="margin[3]"
          [y]="dims.height / 2 + margin[0] - 2"
          [fill]="colors.getColor(units)"
          [data]="{}"
          [orientation]="'horizontal'"
          [roundEdges]="true"
          [animations]="animations"
        ></svg:g>

        <svg:line
          *ngIf="hasPreviousValue"
          [attr.transform]="transformLine"
          x1="0"
          y1="5"
          x2="0"
          y2="15"
          [attr.stroke]="colors.getColor(units)"
        />

        <svg:line
          *ngIf="hasPreviousValue"
          [attr.transform]="transformLine"
          x1="0"
          y1="-5"
          x2="0"
          y2="-15"
          [attr.stroke]="colors.getColor(units)"
        />

        <svg:g [attr.transform]="transform">
          <svg:g [attr.transform]="valueTranslate">
            <svg:text
              #valueTextEl
              class="value"
              [style.textAnchor]="'middle'"
              [attr.transform]="valueTextTransform"
              alignment-baseline="after-edge"
            >
              {{ displayValue }}
            </svg:text>
          </svg:g>

          <svg:g [attr.transform]="unitsTranslate">
            <svg:text
              #unitsTextEl
              class="units"
              [style.textAnchor]="'middle'"
              [attr.transform]="unitsTextTransform"
              alignment-baseline="before-edge"
            >
              {{ units }}
            </svg:text>
          </svg:g>
        </svg:g>
      </svg:g>
    </ngx-charts-chart>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".ngx-charts{float:left;overflow:visible}.ngx-charts .arc,.ngx-charts .bar,.ngx-charts .circle{cursor:pointer}.ngx-charts .arc.active,.ngx-charts .arc:hover,.ngx-charts .bar.active,.ngx-charts .bar:hover,.ngx-charts .card.active,.ngx-charts .card:hover,.ngx-charts .cell.active,.ngx-charts .cell:hover{opacity:.8;transition:opacity .1s ease-in-out}.ngx-charts .arc:focus,.ngx-charts .bar:focus,.ngx-charts .card:focus,.ngx-charts .cell:focus{outline:none}.ngx-charts .arc.hidden,.ngx-charts .bar.hidden,.ngx-charts .card.hidden,.ngx-charts .cell.hidden{display:none}.ngx-charts g:focus{outline:none}.ngx-charts .area-series.inactive,.ngx-charts .line-series-range.inactive,.ngx-charts .line-series.inactive,.ngx-charts .polar-series-area.inactive,.ngx-charts .polar-series-path.inactive{opacity:.2;transition:opacity .1s ease-in-out}.ngx-charts .line-highlight{display:none}.ngx-charts .line-highlight.active{display:block}.ngx-charts .area{opacity:.6}.ngx-charts .circle:hover{cursor:pointer}.ngx-charts .label{font-size:12px;font-weight:400}.ngx-charts .tooltip-anchor{fill:#000}.ngx-charts .gridline-path{fill:none;stroke:#ddd;stroke-width:1}.ngx-charts .refline-path{stroke:#a8b2c7;stroke-dasharray:5;stroke-dashoffset:5;stroke-width:1}.ngx-charts .refline-label{font-size:9px}.ngx-charts .reference-area{fill:#000;fill-opacity:.05}.ngx-charts .gridline-path-dotted{fill:none;stroke:#ddd;stroke-dasharray:1,20;stroke-dashoffset:3;stroke-width:1}.ngx-charts .grid-panel rect{fill:none}.ngx-charts .grid-panel.odd rect{fill:rgba(0,0,0,.05)}", ".linear-gauge{cursor:pointer}.linear-gauge .background-bar path{fill:rgba(0,0,0,.05)}.linear-gauge .units{fill:#666}"]
            },] }
];
LinearGaugeComponent.propDecorators = {
    min: [{ type: Input }],
    max: [{ type: Input }],
    value: [{ type: Input }],
    units: [{ type: Input }],
    previousValue: [{ type: Input }],
    valueFormatting: [{ type: Input }],
    valueTextEl: [{ type: ViewChild, args: ['valueTextEl',] }],
    unitsTextEl: [{ type: ViewChild, args: ['unitsTextEl',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZWFyLWdhdWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9nYXVnZS9saW5lYXItZ2F1Z2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLFNBQVMsRUFFVCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFdkMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFrQixNQUFNLGtDQUFrQyxDQUFDO0FBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQW9GckQsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGtCQUFrQjtJQWxGNUQ7O1FBbUZXLFFBQUcsR0FBVyxDQUFDLENBQUM7UUFDaEIsUUFBRyxHQUFXLEdBQUcsQ0FBQztRQUNsQixVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBYzNCLFdBQU0sR0FBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR2pDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0IsdUJBQWtCLEdBQVcsRUFBRSxDQUFDO1FBQ2hDLG1CQUFjLEdBQVcsRUFBRSxDQUFDO1FBQzVCLHVCQUFrQixHQUFXLEVBQUUsQ0FBQztRQUNoQyxtQkFBYyxHQUFXLEVBQUUsQ0FBQztJQTRHOUIsQ0FBQztJQXhHQyxlQUFlO1FBQ2IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FB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QUNuQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJFVDtnQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7a0JBRUUsS0FBSztrQkFDTCxLQUFLO29CQUNMLEtBQUs7b0JBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBRUwsU0FBUyxTQUFDLGFBQWE7MEJBQ3ZCLFNBQVMsU0FBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgRWxlbWVudFJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBWaWV3RW5jYXBzdWxhdGlvbixcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBzY2FsZUxpbmVhciB9IGZyb20gJ2QzLXNjYWxlJztcclxuXHJcbmltcG9ydCB7IEJhc2VDaGFydENvbXBvbmVudCB9IGZyb20gJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zLCBWaWV3RGltZW5zaW9ucyB9IGZyb20gJy4uL2NvbW1vbi92aWV3LWRpbWVuc2lvbnMuaGVscGVyJztcclxuaW1wb3J0IHsgQ29sb3JIZWxwZXIgfSBmcm9tICcuLi9jb21tb24vY29sb3IuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWNoYXJ0cy1saW5lYXItZ2F1Z2UnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8bmd4LWNoYXJ0cy1jaGFydCBbdmlld109XCJbd2lkdGgsIGhlaWdodF1cIiBbc2hvd0xlZ2VuZF09XCJmYWxzZVwiIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIiAoY2xpY2spPVwib25DbGljaygpXCI+XHJcbiAgICAgIDxzdmc6ZyBjbGFzcz1cImxpbmVhci1nYXVnZSBjaGFydFwiPlxyXG4gICAgICAgIDxzdmc6Z1xyXG4gICAgICAgICAgbmd4LWNoYXJ0cy1iYXJcclxuICAgICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1iYXJcIlxyXG4gICAgICAgICAgW3dpZHRoXT1cImRpbXMud2lkdGhcIlxyXG4gICAgICAgICAgW2hlaWdodF09XCIzXCJcclxuICAgICAgICAgIFt4XT1cIm1hcmdpblszXVwiXHJcbiAgICAgICAgICBbeV09XCJkaW1zLmhlaWdodCAvIDIgKyBtYXJnaW5bMF0gLSAyXCJcclxuICAgICAgICAgIFtkYXRhXT1cInt9XCJcclxuICAgICAgICAgIFtvcmllbnRhdGlvbl09XCInaG9yaXpvbnRhbCdcIlxyXG4gICAgICAgICAgW3JvdW5kRWRnZXNdPVwidHJ1ZVwiXHJcbiAgICAgICAgICBbYW5pbWF0aW9uc109XCJhbmltYXRpb25zXCJcclxuICAgICAgICA+PC9zdmc6Zz5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMtYmFyXHJcbiAgICAgICAgICBbd2lkdGhdPVwidmFsdWVTY2FsZSh2YWx1ZSlcIlxyXG4gICAgICAgICAgW2hlaWdodF09XCIzXCJcclxuICAgICAgICAgIFt4XT1cIm1hcmdpblszXVwiXHJcbiAgICAgICAgICBbeV09XCJkaW1zLmhlaWdodCAvIDIgKyBtYXJnaW5bMF0gLSAyXCJcclxuICAgICAgICAgIFtmaWxsXT1cImNvbG9ycy5nZXRDb2xvcih1bml0cylcIlxyXG4gICAgICAgICAgW2RhdGFdPVwie31cIlxyXG4gICAgICAgICAgW29yaWVudGF0aW9uXT1cIidob3Jpem9udGFsJ1wiXHJcbiAgICAgICAgICBbcm91bmRFZGdlc109XCJ0cnVlXCJcclxuICAgICAgICAgIFthbmltYXRpb25zXT1cImFuaW1hdGlvbnNcIlxyXG4gICAgICAgID48L3N2ZzpnPlxyXG5cclxuICAgICAgICA8c3ZnOmxpbmVcclxuICAgICAgICAgICpuZ0lmPVwiaGFzUHJldmlvdXNWYWx1ZVwiXHJcbiAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtTGluZVwiXHJcbiAgICAgICAgICB4MT1cIjBcIlxyXG4gICAgICAgICAgeTE9XCI1XCJcclxuICAgICAgICAgIHgyPVwiMFwiXHJcbiAgICAgICAgICB5Mj1cIjE1XCJcclxuICAgICAgICAgIFthdHRyLnN0cm9rZV09XCJjb2xvcnMuZ2V0Q29sb3IodW5pdHMpXCJcclxuICAgICAgICAvPlxyXG5cclxuICAgICAgICA8c3ZnOmxpbmVcclxuICAgICAgICAgICpuZ0lmPVwiaGFzUHJldmlvdXNWYWx1ZVwiXHJcbiAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtTGluZVwiXHJcbiAgICAgICAgICB4MT1cIjBcIlxyXG4gICAgICAgICAgeTE9XCItNVwiXHJcbiAgICAgICAgICB4Mj1cIjBcIlxyXG4gICAgICAgICAgeTI9XCItMTVcIlxyXG4gICAgICAgICAgW2F0dHIuc3Ryb2tlXT1cImNvbG9ycy5nZXRDb2xvcih1bml0cylcIlxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCI+XHJcbiAgICAgICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInZhbHVlVHJhbnNsYXRlXCI+XHJcbiAgICAgICAgICAgIDxzdmc6dGV4dFxyXG4gICAgICAgICAgICAgICN2YWx1ZVRleHRFbFxyXG4gICAgICAgICAgICAgIGNsYXNzPVwidmFsdWVcIlxyXG4gICAgICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cIidtaWRkbGUnXCJcclxuICAgICAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidmFsdWVUZXh0VHJhbnNmb3JtXCJcclxuICAgICAgICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJhZnRlci1lZGdlXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHt7IGRpc3BsYXlWYWx1ZSB9fVxyXG4gICAgICAgICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuXHJcbiAgICAgICAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInVuaXRzVHJhbnNsYXRlXCI+XHJcbiAgICAgICAgICAgIDxzdmc6dGV4dFxyXG4gICAgICAgICAgICAgICN1bml0c1RleHRFbFxyXG4gICAgICAgICAgICAgIGNsYXNzPVwidW5pdHNcIlxyXG4gICAgICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cIidtaWRkbGUnXCJcclxuICAgICAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidW5pdHNUZXh0VHJhbnNmb3JtXCJcclxuICAgICAgICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9XCJiZWZvcmUtZWRnZVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7eyB1bml0cyB9fVxyXG4gICAgICAgICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgICAgICAgPC9zdmc6Zz5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9uZ3gtY2hhcnRzLWNoYXJ0PlxyXG4gIGAsXHJcbiAgc3R5bGVVcmxzOiBbJy4uL2NvbW1vbi9iYXNlLWNoYXJ0LmNvbXBvbmVudC5zY3NzJywgJy4vbGluZWFyLWdhdWdlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTGluZWFyR2F1Z2VDb21wb25lbnQgZXh0ZW5kcyBCYXNlQ2hhcnRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBtaW46IG51bWJlciA9IDA7XHJcbiAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxMDA7XHJcbiAgQElucHV0KCkgdmFsdWU6IG51bWJlciA9IDA7XHJcbiAgQElucHV0KCkgdW5pdHM6IHN0cmluZztcclxuICBASW5wdXQoKSBwcmV2aW91c1ZhbHVlO1xyXG4gIEBJbnB1dCgpIHZhbHVlRm9ybWF0dGluZzogYW55O1xyXG5cclxuICBAVmlld0NoaWxkKCd2YWx1ZVRleHRFbCcpIHZhbHVlVGV4dEVsOiBFbGVtZW50UmVmO1xyXG4gIEBWaWV3Q2hpbGQoJ3VuaXRzVGV4dEVsJykgdW5pdHNUZXh0RWw6IEVsZW1lbnRSZWY7XHJcblxyXG4gIGRpbXM6IFZpZXdEaW1lbnNpb25zO1xyXG4gIHZhbHVlRG9tYWluOiBhbnk7XHJcbiAgdmFsdWVTY2FsZTogYW55O1xyXG5cclxuICBjb2xvcnM6IENvbG9ySGVscGVyO1xyXG4gIHRyYW5zZm9ybTogc3RyaW5nO1xyXG4gIG1hcmdpbjogYW55W10gPSBbMTAsIDIwLCAxMCwgMjBdO1xyXG4gIHRyYW5zZm9ybUxpbmU6IHN0cmluZztcclxuXHJcbiAgdmFsdWVSZXNpemVTY2FsZTogbnVtYmVyID0gMTtcclxuICB1bml0c1Jlc2l6ZVNjYWxlOiBudW1iZXIgPSAxO1xyXG4gIHZhbHVlVGV4dFRyYW5zZm9ybTogc3RyaW5nID0gJyc7XHJcbiAgdmFsdWVUcmFuc2xhdGU6IHN0cmluZyA9ICcnO1xyXG4gIHVuaXRzVGV4dFRyYW5zZm9ybTogc3RyaW5nID0gJyc7XHJcbiAgdW5pdHNUcmFuc2xhdGU6IHN0cmluZyA9ICcnO1xyXG4gIGRpc3BsYXlWYWx1ZTogc3RyaW5nO1xyXG4gIGhhc1ByZXZpb3VzVmFsdWU6IGJvb2xlYW47XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuc2NhbGVUZXh0KCd2YWx1ZScpO1xyXG4gICAgICB0aGlzLnNjYWxlVGV4dCgndW5pdHMnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgdGhpcy5oYXNQcmV2aW91c1ZhbHVlID0gdGhpcy5wcmV2aW91c1ZhbHVlICE9PSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLm1heCA9IE1hdGgubWF4KHRoaXMubWF4LCB0aGlzLnZhbHVlKTtcclxuICAgIHRoaXMubWluID0gTWF0aC5taW4odGhpcy5taW4sIHRoaXMudmFsdWUpO1xyXG4gICAgaWYgKHRoaXMuaGFzUHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICB0aGlzLm1heCA9IE1hdGgubWF4KHRoaXMubWF4LCB0aGlzLnByZXZpb3VzVmFsdWUpO1xyXG4gICAgICB0aGlzLm1pbiA9IE1hdGgubWluKHRoaXMubWluLCB0aGlzLnByZXZpb3VzVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGltcyA9IGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKHtcclxuICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXHJcbiAgICAgIG1hcmdpbnM6IHRoaXMubWFyZ2luXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZhbHVlRG9tYWluID0gdGhpcy5nZXRWYWx1ZURvbWFpbigpO1xyXG4gICAgdGhpcy52YWx1ZVNjYWxlID0gdGhpcy5nZXRWYWx1ZVNjYWxlKCk7XHJcbiAgICB0aGlzLmRpc3BsYXlWYWx1ZSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKCk7XHJcblxyXG4gICAgdGhpcy5zZXRDb2xvcnMoKTtcclxuXHJcbiAgICBjb25zdCB4T2Zmc2V0ID0gdGhpcy5tYXJnaW5bM10gKyB0aGlzLmRpbXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeU9mZnNldCA9IHRoaXMubWFyZ2luWzBdICsgdGhpcy5kaW1zLmhlaWdodCAvIDI7XHJcblxyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eE9mZnNldH0sICR7eU9mZnNldH0pYDtcclxuICAgIHRoaXMudHJhbnNmb3JtTGluZSA9IGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpblszXSArIHRoaXMudmFsdWVTY2FsZSh0aGlzLnByZXZpb3VzVmFsdWUpfSwgJHt5T2Zmc2V0fSlgO1xyXG4gICAgdGhpcy52YWx1ZVRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoMCwgLTE1KWA7XHJcbiAgICB0aGlzLnVuaXRzVHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgwLCAxNSlgO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgndmFsdWUnKSwgNTApO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNjYWxlVGV4dCgndW5pdHMnKSwgNTApO1xyXG4gIH1cclxuXHJcbiAgZ2V0VmFsdWVEb21haW4oKTogYW55W10ge1xyXG4gICAgcmV0dXJuIFt0aGlzLm1pbiwgdGhpcy5tYXhdO1xyXG4gIH1cclxuXHJcbiAgZ2V0VmFsdWVTY2FsZSgpOiBhbnkge1xyXG4gICAgcmV0dXJuIHNjYWxlTGluZWFyKCkucmFuZ2UoWzAsIHRoaXMuZGltcy53aWR0aF0pLmRvbWFpbih0aGlzLnZhbHVlRG9tYWluKTtcclxuICB9XHJcblxyXG4gIGdldERpc3BsYXlWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMudmFsdWVGb3JtYXR0aW5nKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlRm9ybWF0dGluZyh0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnZhbHVlLnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgfVxyXG5cclxuICBzY2FsZVRleHQoZWxlbWVudCwgcmVwZWF0OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgbGV0IGVsO1xyXG4gICAgbGV0IHJlc2l6ZVNjYWxlO1xyXG4gICAgaWYgKGVsZW1lbnQgPT09ICd2YWx1ZScpIHtcclxuICAgICAgZWwgPSB0aGlzLnZhbHVlVGV4dEVsO1xyXG4gICAgICByZXNpemVTY2FsZSA9IHRoaXMudmFsdWVSZXNpemVTY2FsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsID0gdGhpcy51bml0c1RleHRFbDtcclxuICAgICAgcmVzaXplU2NhbGUgPSB0aGlzLnVuaXRzUmVzaXplU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBlbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgaWYgKHdpZHRoID09PSAwIHx8IGhlaWdodCA9PT0gMCkgcmV0dXJuO1xyXG4gICAgY29uc3Qgb2xkU2NhbGUgPSByZXNpemVTY2FsZTtcclxuICAgIGNvbnN0IGF2YWlsYWJsZVdpZHRoID0gdGhpcy5kaW1zLndpZHRoO1xyXG4gICAgY29uc3QgYXZhaWxhYmxlSGVpZ2h0ID0gTWF0aC5tYXgodGhpcy5kaW1zLmhlaWdodCAvIDIgLSAxNSwgMCk7XHJcbiAgICBjb25zdCByZXNpemVTY2FsZVdpZHRoID0gTWF0aC5mbG9vcigoYXZhaWxhYmxlV2lkdGggLyAod2lkdGggLyByZXNpemVTY2FsZSkpICogMTAwKSAvIDEwMDtcclxuICAgIGNvbnN0IHJlc2l6ZVNjYWxlSGVpZ2h0ID0gTWF0aC5mbG9vcigoYXZhaWxhYmxlSGVpZ2h0IC8gKGhlaWdodCAvIHJlc2l6ZVNjYWxlKSkgKiAxMDApIC8gMTAwO1xyXG4gICAgcmVzaXplU2NhbGUgPSBNYXRoLm1pbihyZXNpemVTY2FsZUhlaWdodCwgcmVzaXplU2NhbGVXaWR0aCk7XHJcblxyXG4gICAgaWYgKHJlc2l6ZVNjYWxlICE9PSBvbGRTY2FsZSkge1xyXG4gICAgICBpZiAoZWxlbWVudCA9PT0gJ3ZhbHVlJykge1xyXG4gICAgICAgIHRoaXMudmFsdWVSZXNpemVTY2FsZSA9IHJlc2l6ZVNjYWxlO1xyXG4gICAgICAgIHRoaXMudmFsdWVUZXh0VHJhbnNmb3JtID0gYHNjYWxlKCR7cmVzaXplU2NhbGV9LCAke3Jlc2l6ZVNjYWxlfSlgO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudW5pdHNSZXNpemVTY2FsZSA9IHJlc2l6ZVNjYWxlO1xyXG4gICAgICAgIHRoaXMudW5pdHNUZXh0VHJhbnNmb3JtID0gYHNjYWxlKCR7cmVzaXplU2NhbGV9LCAke3Jlc2l6ZVNjYWxlfSlgO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIGlmIChyZXBlYXQpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2NhbGVUZXh0KGVsZW1lbnQsIGZhbHNlKTtcclxuICAgICAgICB9LCA1MCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdC5lbWl0KHtcclxuICAgICAgbmFtZTogJ1ZhbHVlJyxcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2V0Q29sb3JzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jb2xvcnMgPSBuZXcgQ29sb3JIZWxwZXIodGhpcy5zY2hlbWUsICdvcmRpbmFsJywgW3RoaXMudmFsdWVdLCB0aGlzLmN1c3RvbUNvbG9ycyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==