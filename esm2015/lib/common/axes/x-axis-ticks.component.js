import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
export class XAxisTicksComponent {
    constructor() {
        this.tickArguments = [5];
        this.tickStroke = '#ccc';
        this.trimTicks = true;
        this.maxTickLength = 16;
        this.showGridLines = false;
        this.rotateTicks = true;
        this.dimensionsChanged = new EventEmitter();
        this.verticalSpacing = 20;
        this.rotateLabels = false;
        this.innerTickSize = 6;
        this.outerTickSize = 6;
        this.tickPadding = 3;
        this.textAnchor = 'middle';
        this.maxTicksLength = 0;
        this.maxAllowedLength = 16;
        this.height = 0;
    }
    ngOnChanges(changes) {
        this.update();
    }
    ngAfterViewInit() {
        setTimeout(() => this.updateDims());
    }
    updateDims() {
        const height = parseInt(this.ticksElement.nativeElement.getBoundingClientRect().height, 10);
        if (height !== this.height) {
            this.height = height;
            this.dimensionsChanged.emit({ height });
            setTimeout(() => this.updateDims());
        }
    }
    update() {
        const scale = this.scale;
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
        const angle = this.rotateTicks ? this.getRotationAngle(this.ticks) : null;
        this.adjustedScale = this.scale.bandwidth
            ? function (d) {
                return this.scale(d) + this.scale.bandwidth() * 0.5;
            }
            : this.scale;
        this.textTransform = '';
        if (angle && angle !== 0) {
            this.textTransform = `rotate(${angle})`;
            this.textAnchor = 'end';
            this.verticalSpacing = 10;
        }
        else {
            this.textAnchor = 'middle';
        }
        if (this.activeTime) {
            this.setActiveTime();
        }
        setTimeout(() => this.updateDims());
    }
    setActiveTime() {
        this.activeVal = this.adjustedScale(this.activeTime);
        /*this.activeTimePath = roundedRect(activeVal, this.height+6, 1, 0, 0, [
          false,
          false,
          false,
          false
        ]);*/
    }
    getRotationAngle(ticks) {
        let angle = 0;
        this.maxTicksLength = 0;
        for (let i = 0; i < ticks.length; i++) {
            const tick = this.tickFormat(ticks[i]).toString();
            let tickLength = tick.length;
            if (this.trimTicks) {
                tickLength = this.tickTrim(tick).length;
            }
            if (tickLength > this.maxTicksLength) {
                this.maxTicksLength = tickLength;
            }
        }
        const len = Math.min(this.maxTicksLength, this.maxAllowedLength);
        const charWidth = 8; // need to measure this
        const wordWidth = len * charWidth;
        let baseWidth = wordWidth;
        const maxBaseWidth = Math.floor(this.width / ticks.length);
        // calculate optimal angle
        while (baseWidth > maxBaseWidth && angle > -90) {
            angle -= 30;
            baseWidth = Math.cos(angle * (Math.PI / 180)) * wordWidth;
        }
        return angle;
    }
    getTicks() {
        let ticks;
        const maxTicks = this.getMaxTicks(20);
        const maxScaleTicks = this.getMaxTicks(100);
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
    getMaxTicks(tickWidth) {
        return Math.floor(this.width / tickWidth);
    }
    tickTransform(tick) {
        return 'translate(' + this.adjustedScale(tick) + ',' + this.verticalSpacing + ')';
    }
    gridLineTransform() {
        return `translate(0,${-this.verticalSpacing - 5})`;
    }
    tickTrim(label) {
        return this.trimTicks ? trimLabel(label, this.maxTickLength) : label;
    }
}
XAxisTicksComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-x-axis-ticks]',
                template: `
    <svg:g #ticksel>
      <svg:g *ngFor="let tick of ticks" class="tick" [attr.transform]="tickTransform(tick)">
        <title>{{ tickFormat(tick) }}</title>
        <svg:text
          stroke-width="0.01"
          [attr.text-anchor]="textAnchor"
          [attr.transform]="textTransform"
          [style.font-size]="'12px'"
        >
          {{ tickTrim(tickFormat(tick)) }}
        </svg:text>
      </svg:g>
    </svg:g>


    <svg:g *ngIf="activeTime">
      <svg:line
        class="refline-path gridline-path-horizontal"
        [attr.x1]="activeVal"
        y1="0"
        style="stroke: #000;stroke-dasharray:none;"
        [attr.x2]="activeVal"
        [attr.y2]="gridLineHeight+6"
        [attr.transform]="gridLineTransform()"
      />
      <svg:text
        class="refline-label"
        [attr.y]="-gridLineHeight-8"
        [attr.x]="activeVal"
        text-anchor={{this.activeVal>(width-70):'end':'middle'}}
      >
        {{ activeTime.toLocaleString() }}
      </svg:text>
    </svg:g>


    <svg:g *ngFor="let tick of ticks" [attr.transform]="tickTransform(tick)">
      <svg:g *ngIf="showGridLines" [attr.transform]="gridLineTransform()">
        <svg:line class="gridline-path gridline-path-vertical" [attr.y1]="-gridLineHeight" y2="0" />
      </svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
XAxisTicksComponent.propDecorators = {
    scale: [{ type: Input }],
    orient: [{ type: Input }],
    tickArguments: [{ type: Input }],
    tickValues: [{ type: Input }],
    tickStroke: [{ type: Input }],
    trimTicks: [{ type: Input }],
    maxTickLength: [{ type: Input }],
    tickFormatting: [{ type: Input }],
    showGridLines: [{ type: Input }],
    gridLineHeight: [{ type: Input }],
    width: [{ type: Input }],
    activeTime: [{ type: Input }],
    rotateTicks: [{ type: Input }],
    dimensionsChanged: [{ type: Output }],
    ticksElement: [{ type: ViewChild, args: ['ticksel',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLXRpY2tzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy94LWF4aXMtdGlja3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR1osU0FBUyxFQUdULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBaUQ3QyxNQUFNLE9BQU8sbUJBQW1CO0lBL0NoQztRQWtEVyxrQkFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEIsZUFBVSxHQUFHLE1BQU0sQ0FBQztRQUNwQixjQUFTLEdBQVksSUFBSSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSXRCLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTNCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFDN0IsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsZUFBVSxHQUFXLFFBQVEsQ0FBQztRQUM5QixtQkFBYyxHQUFXLENBQUMsQ0FBQztRQUMzQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFLOUIsV0FBTSxHQUFXLENBQUMsQ0FBQztJQXNJckIsQ0FBQztJQWpJQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFB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cEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3ZFLENBQUM7OztZQWpORixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ1Q7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztvQkFFRSxLQUFLO3FCQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7d0JBQ0wsS0FBSzs0QkFDTCxLQUFLOzZCQUNMLEtBQUs7NEJBQ0wsS0FBSzs2QkFDTCxLQUFLO29CQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLO2dDQUVMLE1BQU07MkJBaUJOLFNBQVMsU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBPbkNoYW5nZXMsXHJcbiAgRWxlbWVudFJlZixcclxuICBWaWV3Q2hpbGQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHRyaW1MYWJlbCB9IGZyb20gJy4uL3RyaW0tbGFiZWwuaGVscGVyJztcclxuaW1wb3J0IHsgcmVkdWNlVGlja3MgfSBmcm9tICcuL3RpY2tzLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy14LWF4aXMtdGlja3NdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnICN0aWNrc2VsPlxyXG4gICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHRpY2sgb2YgdGlja3NcIiBjbGFzcz1cInRpY2tcIiBbYXR0ci50cmFuc2Zvcm1dPVwidGlja1RyYW5zZm9ybSh0aWNrKVwiPlxyXG4gICAgICAgIDx0aXRsZT57eyB0aWNrRm9ybWF0KHRpY2spIH19PC90aXRsZT5cclxuICAgICAgICA8c3ZnOnRleHRcclxuICAgICAgICAgIHN0cm9rZS13aWR0aD1cIjAuMDFcIlxyXG4gICAgICAgICAgW2F0dHIudGV4dC1hbmNob3JdPVwidGV4dEFuY2hvclwiXHJcbiAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidGV4dFRyYW5zZm9ybVwiXHJcbiAgICAgICAgICBbc3R5bGUuZm9udC1zaXplXT1cIicxMnB4J1wiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge3sgdGlja1RyaW0odGlja0Zvcm1hdCh0aWNrKSkgfX1cclxuICAgICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgPC9zdmc6Zz5cclxuXHJcblxyXG4gICAgPHN2ZzpnICpuZ0lmPVwiYWN0aXZlVGltZVwiPlxyXG4gICAgICA8c3ZnOmxpbmVcclxuICAgICAgICBjbGFzcz1cInJlZmxpbmUtcGF0aCBncmlkbGluZS1wYXRoLWhvcml6b250YWxcIlxyXG4gICAgICAgIFthdHRyLngxXT1cImFjdGl2ZVZhbFwiXHJcbiAgICAgICAgeTE9XCIwXCJcclxuICAgICAgICBzdHlsZT1cInN0cm9rZTogIzAwMDtzdHJva2UtZGFzaGFycmF5Om5vbmU7XCJcclxuICAgICAgICBbYXR0ci54Ml09XCJhY3RpdmVWYWxcIlxyXG4gICAgICAgIFthdHRyLnkyXT1cImdyaWRMaW5lSGVpZ2h0KzZcIlxyXG4gICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJncmlkTGluZVRyYW5zZm9ybSgpXCJcclxuICAgICAgLz5cclxuICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgY2xhc3M9XCJyZWZsaW5lLWxhYmVsXCJcclxuICAgICAgICBbYXR0ci55XT1cIi1ncmlkTGluZUhlaWdodC04XCJcclxuICAgICAgICBbYXR0ci54XT1cImFjdGl2ZVZhbFwiXHJcbiAgICAgICAgdGV4dC1hbmNob3I9e3t0aGlzLmFjdGl2ZVZhbD4od2lkdGgtNzApOidlbmQnOidtaWRkbGUnfX1cclxuICAgICAgPlxyXG4gICAgICAgIHt7IGFjdGl2ZVRpbWUudG9Mb2NhbGVTdHJpbmcoKSB9fVxyXG4gICAgICA8L3N2Zzp0ZXh0PlxyXG4gICAgPC9zdmc6Zz5cclxuXHJcblxyXG4gICAgPHN2ZzpnICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzXCIgW2F0dHIudHJhbnNmb3JtXT1cInRpY2tUcmFuc2Zvcm0odGljaylcIj5cclxuICAgICAgPHN2ZzpnICpuZ0lmPVwic2hvd0dyaWRMaW5lc1wiIFthdHRyLnRyYW5zZm9ybV09XCJncmlkTGluZVRyYW5zZm9ybSgpXCI+XHJcbiAgICAgICAgPHN2ZzpsaW5lIGNsYXNzPVwiZ3JpZGxpbmUtcGF0aCBncmlkbGluZS1wYXRoLXZlcnRpY2FsXCIgW2F0dHIueTFdPVwiLWdyaWRMaW5lSGVpZ2h0XCIgeTI9XCIwXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWEF4aXNUaWNrc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgc2NhbGU7XHJcbiAgQElucHV0KCkgb3JpZW50O1xyXG4gIEBJbnB1dCgpIHRpY2tBcmd1bWVudHMgPSBbNV07XHJcbiAgQElucHV0KCkgdGlja1ZhbHVlczogYW55W107XHJcbiAgQElucHV0KCkgdGlja1N0cm9rZSA9ICcjY2NjJztcclxuICBASW5wdXQoKSB0cmltVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1heFRpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xyXG4gIEBJbnB1dCgpIHRpY2tGb3JtYXR0aW5nO1xyXG4gIEBJbnB1dCgpIHNob3dHcmlkTGluZXMgPSBmYWxzZTtcclxuICBASW5wdXQoKSBncmlkTGluZUhlaWdodDtcclxuICBASW5wdXQoKSB3aWR0aDtcclxuICBASW5wdXQoKSBhY3RpdmVUaW1lO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVRpY2tzOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2ZXJ0aWNhbFNwYWNpbmc6IG51bWJlciA9IDIwO1xyXG4gIHJvdGF0ZUxhYmVsczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGlubmVyVGlja1NpemU6IG51bWJlciA9IDY7XHJcbiAgb3V0ZXJUaWNrU2l6ZTogbnVtYmVyID0gNjtcclxuICB0aWNrUGFkZGluZzogbnVtYmVyID0gMztcclxuICB0ZXh0QW5jaG9yOiBzdHJpbmcgPSAnbWlkZGxlJztcclxuICBtYXhUaWNrc0xlbmd0aDogbnVtYmVyID0gMDtcclxuICBtYXhBbGxvd2VkTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBhZGp1c3RlZFNjYWxlOiBhbnk7XHJcbiAgdGV4dFRyYW5zZm9ybTogYW55O1xyXG4gIHRpY2tzOiBhbnk7XHJcbiAgdGlja0Zvcm1hdDogKG86IGFueSkgPT4gYW55O1xyXG4gIGhlaWdodDogbnVtYmVyID0gMDtcclxuICBhY3RpdmVWYWw7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3RpY2tzZWwnKSB0aWNrc0VsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURpbXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUludCh0aGlzLnRpY2tzRWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCwgMTApO1xyXG4gICAgaWYgKGhlaWdodCAhPT0gdGhpcy5oZWlnaHQpIHtcclxuICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgIHRoaXMuZGltZW5zaW9uc0NoYW5nZWQuZW1pdCh7IGhlaWdodCB9KTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZURpbXMoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMuc2NhbGU7XHJcbiAgICB0aGlzLnRpY2tzID0gdGhpcy5nZXRUaWNrcygpO1xyXG5cclxuICAgIGlmICh0aGlzLnRpY2tGb3JtYXR0aW5nKSB7XHJcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IHRoaXMudGlja0Zvcm1hdHRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKHNjYWxlLnRpY2tGb3JtYXQpIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gc2NhbGUudGlja0Zvcm1hdC5hcHBseShzY2FsZSwgdGhpcy50aWNrQXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgaWYgKGQuY29uc3RydWN0b3IubmFtZSA9PT0gJ0RhdGUnKSB7XHJcbiAgICAgICAgICByZXR1cm4gZC50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGQudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMucm90YXRlVGlja3MgPyB0aGlzLmdldFJvdGF0aW9uQW5nbGUodGhpcy50aWNrcykgOiBudWxsO1xyXG5cclxuICAgIHRoaXMuYWRqdXN0ZWRTY2FsZSA9IHRoaXMuc2NhbGUuYmFuZHdpZHRoXHJcbiAgICAgID8gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnNjYWxlKGQpICsgdGhpcy5zY2FsZS5iYW5kd2lkdGgoKSAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgIDogdGhpcy5zY2FsZTtcclxuXHJcbiAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSAnJztcclxuICAgIGlmIChhbmdsZSAmJiBhbmdsZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9KWA7XHJcbiAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdlbmQnO1xyXG4gICAgICB0aGlzLnZlcnRpY2FsU3BhY2luZyA9IDEwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZXh0QW5jaG9yID0gJ21pZGRsZSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodGhpcy5hY3RpdmVUaW1lKXtcclxuICAgICAgdGhpcy5zZXRBY3RpdmVUaW1lKCk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICB9XHJcblxyXG4gIHNldEFjdGl2ZVRpbWUoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFjdGl2ZVZhbCA9IHRoaXMuYWRqdXN0ZWRTY2FsZSh0aGlzLmFjdGl2ZVRpbWUpO1xyXG4gICAgLyp0aGlzLmFjdGl2ZVRpbWVQYXRoID0gcm91bmRlZFJlY3QoYWN0aXZlVmFsLCB0aGlzLmhlaWdodCs2LCAxLCAwLCAwLCBbXHJcbiAgICAgIGZhbHNlLFxyXG4gICAgICBmYWxzZSxcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIGZhbHNlXHJcbiAgICBdKTsqL1xyXG4gIH1cclxuICBnZXRSb3RhdGlvbkFuZ2xlKHRpY2tzKTogbnVtYmVyIHtcclxuICAgIGxldCBhbmdsZSA9IDA7XHJcbiAgICB0aGlzLm1heFRpY2tzTGVuZ3RoID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdGljayA9IHRoaXMudGlja0Zvcm1hdCh0aWNrc1tpXSkudG9TdHJpbmcoKTtcclxuICAgICAgbGV0IHRpY2tMZW5ndGggPSB0aWNrLmxlbmd0aDtcclxuICAgICAgaWYgKHRoaXMudHJpbVRpY2tzKSB7XHJcbiAgICAgICAgdGlja0xlbmd0aCA9IHRoaXMudGlja1RyaW0odGljaykubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGlja0xlbmd0aCA+IHRoaXMubWF4VGlja3NMZW5ndGgpIHtcclxuICAgICAgICB0aGlzLm1heFRpY2tzTGVuZ3RoID0gdGlja0xlbmd0aDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxlbiA9IE1hdGgubWluKHRoaXMubWF4VGlja3NMZW5ndGgsIHRoaXMubWF4QWxsb3dlZExlbmd0aCk7XHJcbiAgICBjb25zdCBjaGFyV2lkdGggPSA4OyAvLyBuZWVkIHRvIG1lYXN1cmUgdGhpc1xyXG4gICAgY29uc3Qgd29yZFdpZHRoID0gbGVuICogY2hhcldpZHRoO1xyXG5cclxuICAgIGxldCBiYXNlV2lkdGggPSB3b3JkV2lkdGg7XHJcbiAgICBjb25zdCBtYXhCYXNlV2lkdGggPSBNYXRoLmZsb29yKHRoaXMud2lkdGggLyB0aWNrcy5sZW5ndGgpO1xyXG5cclxuICAgIC8vIGNhbGN1bGF0ZSBvcHRpbWFsIGFuZ2xlXHJcbiAgICB3aGlsZSAoYmFzZVdpZHRoID4gbWF4QmFzZVdpZHRoICYmIGFuZ2xlID4gLTkwKSB7XHJcbiAgICAgIGFuZ2xlIC09IDMwO1xyXG4gICAgICBiYXNlV2lkdGggPSBNYXRoLmNvcyhhbmdsZSAqIChNYXRoLlBJIC8gMTgwKSkgKiB3b3JkV2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFuZ2xlO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGlja3MoKSB7XHJcbiAgICBsZXQgdGlja3M7XHJcbiAgICBjb25zdCBtYXhUaWNrcyA9IHRoaXMuZ2V0TWF4VGlja3MoMjApO1xyXG4gICAgY29uc3QgbWF4U2NhbGVUaWNrcyA9IHRoaXMuZ2V0TWF4VGlja3MoMTAwKTtcclxuXHJcbiAgICBpZiAodGhpcy50aWNrVmFsdWVzKSB7XHJcbiAgICAgIHRpY2tzID0gdGhpcy50aWNrVmFsdWVzO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNjYWxlLnRpY2tzKSB7XHJcbiAgICAgIHRpY2tzID0gdGhpcy5zY2FsZS50aWNrcy5hcHBseSh0aGlzLnNjYWxlLCBbbWF4U2NhbGVUaWNrc10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGlja3MgPSB0aGlzLnNjYWxlLmRvbWFpbigpO1xyXG4gICAgICB0aWNrcyA9IHJlZHVjZVRpY2tzKHRpY2tzLCBtYXhUaWNrcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRpY2tzO1xyXG4gIH1cclxuXHJcbiAgZ2V0TWF4VGlja3ModGlja1dpZHRoOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy53aWR0aCAvIHRpY2tXaWR0aCk7XHJcbiAgfVxyXG5cclxuICB0aWNrVHJhbnNmb3JtKHRpY2spOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuICd0cmFuc2xhdGUoJyArIHRoaXMuYWRqdXN0ZWRTY2FsZSh0aWNrKSArICcsJyArIHRoaXMudmVydGljYWxTcGFjaW5nICsgJyknO1xyXG4gIH1cclxuXHJcbiAgZ3JpZExpbmVUcmFuc2Zvcm0oKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBgdHJhbnNsYXRlKDAsJHstdGhpcy52ZXJ0aWNhbFNwYWNpbmcgLSA1fSlgO1xyXG4gIH1cclxuXHJcbiAgdGlja1RyaW0obGFiZWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy50cmltVGlja3MgPyB0cmltTGFiZWwobGFiZWwsIHRoaXMubWF4VGlja0xlbmd0aCkgOiBsYWJlbDtcclxuICB9XHJcbn1cclxuIl19