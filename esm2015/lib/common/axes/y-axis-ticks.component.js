import { Component, Input, Output, ViewChild, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
import { roundedRect } from '../../common/shape.helper';
export class YAxisTicksComponent {
    constructor() {
        this.tickArguments = [5];
        this.tickStroke = '#ccc';
        this.trimTicks = true;
        this.maxTickLength = 16;
        this.showGridLines = false;
        this.showRefLabels = false;
        this.showRefLines = false;
        this.dimensionsChanged = new EventEmitter();
        this.innerTickSize = 6;
        this.tickPadding = 3;
        this.verticalSpacing = 20;
        this.textAnchor = 'middle';
        this.width = 0;
        this.outerTickSize = 6;
        this.rotateLabels = false;
        this.referenceLineLength = 0;
    }
    ngOnChanges(changes) {
        this.update();
    }
    ngAfterViewInit() {
        setTimeout(() => this.updateDims());
    }
    updateDims() {
        const width = parseInt(this.ticksElement.nativeElement.getBoundingClientRect().width, 10);
        if (width !== this.width) {
            this.width = width;
            this.dimensionsChanged.emit({ width });
            setTimeout(() => this.updateDims());
        }
    }
    update() {
        let scale;
        const sign = this.orient === 'top' || this.orient === 'right' ? -1 : 1;
        this.tickSpacing = Math.max(this.innerTickSize, 0) + this.tickPadding;
        scale = this.scale;
        this.ticks = this.getTicks();
        if (this.tickFormatting) {
            this.tickFormat = this.tickFormatting;
        }
        else if (scale.tickFormat) {
            this.tickFormat = scale.tickFormat.apply(scale, this.tickArguments);
        }
        else {
            this.tickFormat = function (d) {
                if (d.constructor.name === 'Date') {
                    return d.toLocaleDateString();
                }
                return d.toLocaleString();
            };
        }
        this.adjustedScale = scale.bandwidth
            ? function (d) {
                return scale(d) + scale.bandwidth() * 0.5;
            }
            : scale;
        if (this.showRefLines && this.referenceLines) {
            this.setReferencelines();
        }
        switch (this.orient) {
            case 'top':
                this.transform = function (tick) {
                    return 'translate(' + this.adjustedScale(tick) + ',0)';
                };
                this.textAnchor = 'middle';
                this.y2 = this.innerTickSize * sign;
                this.y1 = this.tickSpacing * sign;
                this.dy = sign < 0 ? '0em' : '.71em';
                break;
            case 'bottom':
                this.transform = function (tick) {
                    return 'translate(' + this.adjustedScale(tick) + ',0)';
                };
                this.textAnchor = 'middle';
                this.y2 = this.innerTickSize * sign;
                this.y1 = this.tickSpacing * sign;
                this.dy = sign < 0 ? '0em' : '.71em';
                break;
            case 'left':
                this.transform = function (tick) {
                    return 'translate(0,' + this.adjustedScale(tick) + ')';
                };
                this.textAnchor = 'end';
                this.x2 = this.innerTickSize * -sign;
                this.x1 = this.tickSpacing * -sign;
                this.dy = '.32em';
                break;
            case 'right':
                this.transform = function (tick) {
                    return 'translate(0,' + this.adjustedScale(tick) + ')';
                };
                this.textAnchor = 'start';
                this.x2 = this.innerTickSize * -sign;
                this.x1 = this.tickSpacing * -sign;
                this.dy = '.32em';
                break;
            default:
        }
        setTimeout(() => this.updateDims());
    }
    setReferencelines() {
        this.refMin = this.adjustedScale(Math.min.apply(null, this.referenceLines.map(item => item.value)));
        this.refMax = this.adjustedScale(Math.max.apply(null, this.referenceLines.map(item => item.value)));
        this.referenceLineLength = this.referenceLines.length;
        this.referenceAreaPath = roundedRect(0, this.refMax, this.gridLineWidth, this.refMin - this.refMax, 0, [
            false,
            false,
            false,
            false
        ]);
    }
    getTicks() {
        let ticks;
        const maxTicks = this.getMaxTicks(20);
        const maxScaleTicks = this.getMaxTicks(50);
        if (this.tickValues) {
            ticks = this.tickValues;
        }
        else if (this.scale.ticks) {
            ticks = this.scale.ticks.apply(this.scale, [maxScaleTicks]);
        }
        else {
            ticks = this.scale.domain();
            ticks = reduceTicks(ticks, maxTicks);
        }
        return ticks;
    }
    getMaxTicks(tickHeight) {
        return Math.floor(this.height / tickHeight);
    }
    tickTransform(tick) {
        return `translate(${this.adjustedScale(tick)},${this.verticalSpacing})`;
    }
    gridLineTransform() {
        return `translate(5,0)`;
    }
    tickTrim(label) {
        return this.trimTicks ? trimLabel(label, this.maxTickLength) : label;
    }
}
YAxisTicksComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-y-axis-ticks]',
                template: `
    <svg:g #ticksel>
      <svg:g *ngFor="let tick of ticks" class="tick" [attr.transform]="transform(tick)">
        <title>{{ tickFormat(tick) }}</title>
        <svg:text
          stroke-width="0.01"
          [attr.dy]="dy"
          [attr.x]="x1"
          [attr.y]="y1"
          [attr.text-anchor]="textAnchor"
          [style.font-size]="'12px'"
        >
          {{ tickTrim(tickFormat(tick)) }}
        </svg:text>
      </svg:g>
    </svg:g>

    <svg:path
      *ngIf="referenceLineLength > 1 && refMax && refMin && showRefLines"
      class="reference-area"
      [attr.d]="referenceAreaPath"
      [attr.transform]="gridLineTransform()"
    />
    <svg:g *ngFor="let tick of ticks" [attr.transform]="transform(tick)">
      <svg:g *ngIf="showGridLines" [attr.transform]="gridLineTransform()">
        <svg:line
          *ngIf="orient === 'left'"
          class="gridline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="gridLineWidth"
        />
        <svg:line
          *ngIf="orient === 'right'"
          class="gridline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="-gridLineWidth"
        />
      </svg:g>
    </svg:g>

    <svg:g *ngFor="let refLine of referenceLines">
      <svg:g *ngIf="showRefLines" [attr.transform]="transform(refLine.value)">
        <svg:line
          class="refline-path gridline-path-horizontal"
          x1="0"
          [attr.x2]="gridLineWidth"
          [attr.transform]="gridLineTransform()"
        />
        <svg:g *ngIf="showRefLabels">
          <title>{{ tickTrim(tickFormat(refLine.value)) }}</title>
          <svg:text
            class="refline-label"
            [attr.dy]="dy"
            [attr.y]="-6"
            [attr.x]="gridLineWidth"
            [attr.text-anchor]="textAnchor"
          >
            {{ refLine.name }}
          </svg:text>
        </svg:g>
      </svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
YAxisTicksComponent.propDecorators = {
    scale: [{ type: Input }],
    orient: [{ type: Input }],
    tickArguments: [{ type: Input }],
    tickValues: [{ type: Input }],
    tickStroke: [{ type: Input }],
    trimTicks: [{ type: Input }],
    maxTickLength: [{ type: Input }],
    tickFormatting: [{ type: Input }],
    showGridLines: [{ type: Input }],
    gridLineWidth: [{ type: Input }],
    height: [{ type: Input }],
    referenceLines: [{ type: Input }],
    showRefLabels: [{ type: Input }],
    showRefLines: [{ type: Input }],
    dimensionsChanged: [{ type: Output }],
    ticksElement: [{ type: ViewChild, args: ['ticksel',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieS1heGlzLXRpY2tzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy95LWF4aXMtdGlja3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFHTixTQUFTLEVBQ1QsWUFBWSxFQUVaLHVCQUF1QixFQUV4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQXFFeEQsTUFBTSxPQUFPLG1CQUFtQjtJQW5FaEM7UUFzRVcsa0JBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLGVBQVUsR0FBRyxNQUFNLENBQUM7UUFDcEIsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUl0QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUU3QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGtCQUFhLEdBQVEsQ0FBQyxDQUFDO1FBQ3ZCLGdCQUFXLEdBQVEsQ0FBQyxDQUFDO1FBRXJCLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGVBQVUsR0FBUSxRQUFRLENBQUM7UUFVM0IsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixrQkFBYSxHQUFXLENBQUMsQ0FBQztRQUMxQixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUc5Qix3QkFBbUIsR0FBVyxDQUFDLENBQUM7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U0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN2RSxDQUFDOzs7WUE3UEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4RFQ7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztvQkFFRSxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLOzZCQUNMLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUNMLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzJCQUNMLEtBQUs7Z0NBRUwsTUFBTTsyQkF3Qk4sU0FBUyxTQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vdHJpbS1sYWJlbC5oZWxwZXInO1xyXG5pbXBvcnQgeyByZWR1Y2VUaWNrcyB9IGZyb20gJy4vdGlja3MuaGVscGVyJztcclxuaW1wb3J0IHsgcm91bmRlZFJlY3QgfSBmcm9tICcuLi8uLi9jb21tb24vc2hhcGUuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXktYXhpcy10aWNrc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgI3RpY2tzZWw+XHJcbiAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgdGljayBvZiB0aWNrc1wiIGNsYXNzPVwidGlja1wiIFthdHRyLnRyYW5zZm9ybV09XCJ0cmFuc2Zvcm0odGljaylcIj5cclxuICAgICAgICA8dGl0bGU+e3sgdGlja0Zvcm1hdCh0aWNrKSB9fTwvdGl0bGU+XHJcbiAgICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIwLjAxXCJcclxuICAgICAgICAgIFthdHRyLmR5XT1cImR5XCJcclxuICAgICAgICAgIFthdHRyLnhdPVwieDFcIlxyXG4gICAgICAgICAgW2F0dHIueV09XCJ5MVwiXHJcbiAgICAgICAgICBbYXR0ci50ZXh0LWFuY2hvcl09XCJ0ZXh0QW5jaG9yXCJcclxuICAgICAgICAgIFtzdHlsZS5mb250LXNpemVdPVwiJzEycHgnXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICB7eyB0aWNrVHJpbSh0aWNrRm9ybWF0KHRpY2spKSB9fVxyXG4gICAgICAgIDwvc3ZnOnRleHQ+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG5cclxuICAgIDxzdmc6cGF0aFxyXG4gICAgICAqbmdJZj1cInJlZmVyZW5jZUxpbmVMZW5ndGggPiAxICYmIHJlZk1heCAmJiByZWZNaW4gJiYgc2hvd1JlZkxpbmVzXCJcclxuICAgICAgY2xhc3M9XCJyZWZlcmVuY2UtYXJlYVwiXHJcbiAgICAgIFthdHRyLmRdPVwicmVmZXJlbmNlQXJlYVBhdGhcIlxyXG4gICAgICBbYXR0ci50cmFuc2Zvcm1dPVwiZ3JpZExpbmVUcmFuc2Zvcm0oKVwiXHJcbiAgICAvPlxyXG4gICAgPHN2ZzpnICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybSh0aWNrKVwiPlxyXG4gICAgICA8c3ZnOmcgKm5nSWY9XCJzaG93R3JpZExpbmVzXCIgW2F0dHIudHJhbnNmb3JtXT1cImdyaWRMaW5lVHJhbnNmb3JtKClcIj5cclxuICAgICAgICA8c3ZnOmxpbmVcclxuICAgICAgICAgICpuZ0lmPVwib3JpZW50ID09PSAnbGVmdCdcIlxyXG4gICAgICAgICAgY2xhc3M9XCJncmlkbGluZS1wYXRoIGdyaWRsaW5lLXBhdGgtaG9yaXpvbnRhbFwiXHJcbiAgICAgICAgICB4MT1cIjBcIlxyXG4gICAgICAgICAgW2F0dHIueDJdPVwiZ3JpZExpbmVXaWR0aFwiXHJcbiAgICAgICAgLz5cclxuICAgICAgICA8c3ZnOmxpbmVcclxuICAgICAgICAgICpuZ0lmPVwib3JpZW50ID09PSAncmlnaHQnXCJcclxuICAgICAgICAgIGNsYXNzPVwiZ3JpZGxpbmUtcGF0aCBncmlkbGluZS1wYXRoLWhvcml6b250YWxcIlxyXG4gICAgICAgICAgeDE9XCIwXCJcclxuICAgICAgICAgIFthdHRyLngyXT1cIi1ncmlkTGluZVdpZHRoXCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuXHJcbiAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHJlZkxpbmUgb2YgcmVmZXJlbmNlTGluZXNcIj5cclxuICAgICAgPHN2ZzpnICpuZ0lmPVwic2hvd1JlZkxpbmVzXCIgW2F0dHIudHJhbnNmb3JtXT1cInRyYW5zZm9ybShyZWZMaW5lLnZhbHVlKVwiPlxyXG4gICAgICAgIDxzdmc6bGluZVxyXG4gICAgICAgICAgY2xhc3M9XCJyZWZsaW5lLXBhdGggZ3JpZGxpbmUtcGF0aC1ob3Jpem9udGFsXCJcclxuICAgICAgICAgIHgxPVwiMFwiXHJcbiAgICAgICAgICBbYXR0ci54Ml09XCJncmlkTGluZVdpZHRoXCJcclxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJncmlkTGluZVRyYW5zZm9ybSgpXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxzdmc6ZyAqbmdJZj1cInNob3dSZWZMYWJlbHNcIj5cclxuICAgICAgICAgIDx0aXRsZT57eyB0aWNrVHJpbSh0aWNrRm9ybWF0KHJlZkxpbmUudmFsdWUpKSB9fTwvdGl0bGU+XHJcbiAgICAgICAgICA8c3ZnOnRleHRcclxuICAgICAgICAgICAgY2xhc3M9XCJyZWZsaW5lLWxhYmVsXCJcclxuICAgICAgICAgICAgW2F0dHIuZHldPVwiZHlcIlxyXG4gICAgICAgICAgICBbYXR0ci55XT1cIi02XCJcclxuICAgICAgICAgICAgW2F0dHIueF09XCJncmlkTGluZVdpZHRoXCJcclxuICAgICAgICAgICAgW2F0dHIudGV4dC1hbmNob3JdPVwidGV4dEFuY2hvclwiXHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHt7IHJlZkxpbmUubmFtZSB9fVxyXG4gICAgICAgICAgPC9zdmc6dGV4dD5cclxuICAgICAgICA8L3N2ZzpnPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuICBgLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBZQXhpc1RpY2tzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBzY2FsZTtcclxuICBASW5wdXQoKSBvcmllbnQ7XHJcbiAgQElucHV0KCkgdGlja0FyZ3VtZW50cyA9IFs1XTtcclxuICBASW5wdXQoKSB0aWNrVmFsdWVzOiBhbnlbXTtcclxuICBASW5wdXQoKSB0aWNrU3Ryb2tlID0gJyNjY2MnO1xyXG4gIEBJbnB1dCgpIHRyaW1UaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgbWF4VGlja0xlbmd0aDogbnVtYmVyID0gMTY7XHJcbiAgQElucHV0KCkgdGlja0Zvcm1hdHRpbmc7XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lcyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGdyaWRMaW5lV2lkdGg7XHJcbiAgQElucHV0KCkgaGVpZ2h0O1xyXG4gIEBJbnB1dCgpIHJlZmVyZW5jZUxpbmVzO1xyXG4gIEBJbnB1dCgpIHNob3dSZWZMYWJlbHM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASW5wdXQoKSBzaG93UmVmTGluZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBpbm5lclRpY2tTaXplOiBhbnkgPSA2O1xyXG4gIHRpY2tQYWRkaW5nOiBhbnkgPSAzO1xyXG4gIHRpY2tTcGFjaW5nOiBhbnk7XHJcbiAgdmVydGljYWxTcGFjaW5nOiBudW1iZXIgPSAyMDtcclxuICB0ZXh0QW5jaG9yOiBhbnkgPSAnbWlkZGxlJztcclxuICBkeTogYW55O1xyXG4gIHgxOiBhbnk7XHJcbiAgeDI6IGFueTtcclxuICB5MTogYW55O1xyXG4gIHkyOiBhbnk7XHJcbiAgYWRqdXN0ZWRTY2FsZTogYW55O1xyXG4gIHRyYW5zZm9ybTogKG86IGFueSkgPT4gc3RyaW5nO1xyXG4gIHRpY2tGb3JtYXQ6IChvOiBhbnkpID0+IHN0cmluZztcclxuICB0aWNrczogYW55O1xyXG4gIHdpZHRoOiBudW1iZXIgPSAwO1xyXG4gIG91dGVyVGlja1NpemU6IG51bWJlciA9IDY7XHJcbiAgcm90YXRlTGFiZWxzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcmVmTWF4OiBudW1iZXI7XHJcbiAgcmVmTWluOiBudW1iZXI7XHJcbiAgcmVmZXJlbmNlTGluZUxlbmd0aDogbnVtYmVyID0gMDtcclxuICByZWZlcmVuY2VBcmVhUGF0aDogc3RyaW5nO1xyXG5cclxuICBAVmlld0NoaWxkKCd0aWNrc2VsJykgdGlja3NFbGVtZW50OiBFbGVtZW50UmVmO1xyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZURpbXMoKSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEaW1zKCk6IHZvaWQge1xyXG4gICAgY29uc3Qgd2lkdGggPSBwYXJzZUludCh0aGlzLnRpY2tzRWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLCAxMCk7XHJcbiAgICBpZiAod2lkdGggIT09IHRoaXMud2lkdGgpIHtcclxuICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICB0aGlzLmRpbWVuc2lvbnNDaGFuZ2VkLmVtaXQoeyB3aWR0aCB9KTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZURpbXMoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBsZXQgc2NhbGU7XHJcbiAgICBjb25zdCBzaWduID0gdGhpcy5vcmllbnQgPT09ICd0b3AnIHx8IHRoaXMub3JpZW50ID09PSAncmlnaHQnID8gLTEgOiAxO1xyXG4gICAgdGhpcy50aWNrU3BhY2luZyA9IE1hdGgubWF4KHRoaXMuaW5uZXJUaWNrU2l6ZSwgMCkgKyB0aGlzLnRpY2tQYWRkaW5nO1xyXG5cclxuICAgIHNjYWxlID0gdGhpcy5zY2FsZTtcclxuICAgIHRoaXMudGlja3MgPSB0aGlzLmdldFRpY2tzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMudGlja0Zvcm1hdHRpbmcpIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gdGhpcy50aWNrRm9ybWF0dGluZztcclxuICAgIH0gZWxzZSBpZiAoc2NhbGUudGlja0Zvcm1hdCkge1xyXG4gICAgICB0aGlzLnRpY2tGb3JtYXQgPSBzY2FsZS50aWNrRm9ybWF0LmFwcGx5KHNjYWxlLCB0aGlzLnRpY2tBcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICBpZiAoZC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRGF0ZScpIHtcclxuICAgICAgICAgIHJldHVybiBkLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZC50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWRqdXN0ZWRTY2FsZSA9IHNjYWxlLmJhbmR3aWR0aFxyXG4gICAgICA/IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICByZXR1cm4gc2NhbGUoZCkgKyBzY2FsZS5iYW5kd2lkdGgoKSAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgIDogc2NhbGU7XHJcblxyXG4gICAgaWYgKHRoaXMuc2hvd1JlZkxpbmVzICYmIHRoaXMucmVmZXJlbmNlTGluZXMpIHtcclxuICAgICAgdGhpcy5zZXRSZWZlcmVuY2VsaW5lcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAodGhpcy5vcmllbnQpIHtcclxuICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICh0aWNrKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdGhpcy5hZGp1c3RlZFNjYWxlKHRpY2spICsgJywwKSc7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRleHRBbmNob3IgPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLnkyID0gdGhpcy5pbm5lclRpY2tTaXplICogc2lnbjtcclxuICAgICAgICB0aGlzLnkxID0gdGhpcy50aWNrU3BhY2luZyAqIHNpZ247XHJcbiAgICAgICAgdGhpcy5keSA9IHNpZ24gPCAwID8gJzBlbScgOiAnLjcxZW0nO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gZnVuY3Rpb24gKHRpY2spIHtcclxuICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyB0aGlzLmFkanVzdGVkU2NhbGUodGljaykgKyAnLDApJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMueTIgPSB0aGlzLmlubmVyVGlja1NpemUgKiBzaWduO1xyXG4gICAgICAgIHRoaXMueTEgPSB0aGlzLnRpY2tTcGFjaW5nICogc2lnbjtcclxuICAgICAgICB0aGlzLmR5ID0gc2lnbiA8IDAgPyAnMGVtJyA6ICcuNzFlbSc7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gZnVuY3Rpb24gKHRpY2spIHtcclxuICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKDAsJyArIHRoaXMuYWRqdXN0ZWRTY2FsZSh0aWNrKSArICcpJztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdlbmQnO1xyXG4gICAgICAgIHRoaXMueDIgPSB0aGlzLmlubmVyVGlja1NpemUgKiAtc2lnbjtcclxuICAgICAgICB0aGlzLngxID0gdGhpcy50aWNrU3BhY2luZyAqIC1zaWduO1xyXG4gICAgICAgIHRoaXMuZHkgPSAnLjMyZW0nO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBmdW5jdGlvbiAodGljaykge1xyXG4gICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoMCwnICsgdGhpcy5hZGp1c3RlZFNjYWxlKHRpY2spICsgJyknO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50ZXh0QW5jaG9yID0gJ3N0YXJ0JztcclxuICAgICAgICB0aGlzLngyID0gdGhpcy5pbm5lclRpY2tTaXplICogLXNpZ247XHJcbiAgICAgICAgdGhpcy54MSA9IHRoaXMudGlja1NwYWNpbmcgKiAtc2lnbjtcclxuICAgICAgICB0aGlzLmR5ID0gJy4zMmVtJztcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVEaW1zKCkpO1xyXG4gIH1cclxuXHJcbiAgc2V0UmVmZXJlbmNlbGluZXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlZk1pbiA9IHRoaXMuYWRqdXN0ZWRTY2FsZShcclxuICAgICAgTWF0aC5taW4uYXBwbHkoXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICB0aGlzLnJlZmVyZW5jZUxpbmVzLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgICB0aGlzLnJlZk1heCA9IHRoaXMuYWRqdXN0ZWRTY2FsZShcclxuICAgICAgTWF0aC5tYXguYXBwbHkoXHJcbiAgICAgICAgbnVsbCxcclxuICAgICAgICB0aGlzLnJlZmVyZW5jZUxpbmVzLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgICB0aGlzLnJlZmVyZW5jZUxpbmVMZW5ndGggPSB0aGlzLnJlZmVyZW5jZUxpbmVzLmxlbmd0aDtcclxuXHJcbiAgICB0aGlzLnJlZmVyZW5jZUFyZWFQYXRoID0gcm91bmRlZFJlY3QoMCwgdGhpcy5yZWZNYXgsIHRoaXMuZ3JpZExpbmVXaWR0aCwgdGhpcy5yZWZNaW4gLSB0aGlzLnJlZk1heCwgMCwgW1xyXG4gICAgICBmYWxzZSxcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIGZhbHNlLFxyXG4gICAgICBmYWxzZVxyXG4gICAgXSk7XHJcbiAgfVxyXG5cclxuICBnZXRUaWNrcygpOiBhbnkge1xyXG4gICAgbGV0IHRpY2tzO1xyXG4gICAgY29uc3QgbWF4VGlja3MgPSB0aGlzLmdldE1heFRpY2tzKDIwKTtcclxuICAgIGNvbnN0IG1heFNjYWxlVGlja3MgPSB0aGlzLmdldE1heFRpY2tzKDUwKTtcclxuXHJcbiAgICBpZiAodGhpcy50aWNrVmFsdWVzKSB7XHJcbiAgICAgIHRpY2tzID0gdGhpcy50aWNrVmFsdWVzO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlLnRpY2tzKSB7XHJcbiAgICAgIHRpY2tzID0gdGhpcy5zY2FsZS50aWNrcy5hcHBseSh0aGlzLnNjYWxlLCBbbWF4U2NhbGVUaWNrc10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGlja3MgPSB0aGlzLnNjYWxlLmRvbWFpbigpO1xyXG4gICAgICB0aWNrcyA9IHJlZHVjZVRpY2tzKHRpY2tzLCBtYXhUaWNrcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRpY2tzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWF4VGlja3ModGlja0hlaWdodDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0IC8gdGlja0hlaWdodCk7XHJcbiAgfVxyXG5cclxuICB0aWNrVHJhbnNmb3JtKHRpY2spOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoJHt0aGlzLmFkanVzdGVkU2NhbGUodGljayl9LCR7dGhpcy52ZXJ0aWNhbFNwYWNpbmd9KWA7XHJcbiAgfVxyXG5cclxuICBncmlkTGluZVRyYW5zZm9ybSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoNSwwKWA7XHJcbiAgfVxyXG5cclxuICB0aWNrVHJpbShsYWJlbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnRyaW1UaWNrcyA/IHRyaW1MYWJlbChsYWJlbCwgdGhpcy5tYXhUaWNrTGVuZ3RoKSA6IGxhYmVsO1xyXG4gIH1cclxufVxyXG4iXX0=