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
        setTimeout(() => this.updateDims());
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
    rotateTicks: [{ type: Input }],
    dimensionsChanged: [{ type: Output }],
    ticksElement: [{ type: ViewChild, args: ['ticksel',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLXRpY2tzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy94LWF4aXMtdGlja3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR1osU0FBUyxFQUdULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBNEI3QyxNQUFNLE9BQU8sbUJBQW1CO0lBMUJoQztRQTZCVyxrQkFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEIsZUFBVSxHQUFHLE1BQU0sQ0FBQztRQUNwQixjQUFTLEdBQVksSUFBSSxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBRTNCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR3RCLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTNCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFDN0IsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsZUFBVSxHQUFXLFFBQVEsQ0FBQztRQUM5QixtQkFBYyxHQUFXLENBQUMsQ0FBQztRQUMzQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7UUFLOUIsV0FBTSxHQUFXLENBQUMsQ0FBQztJQXlIckIsQ0FBQztJQXJIQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7b0JBR0UsS0FBSztxQkFDTCxLQUFLOzRCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7NEJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSztvQkFDTCxLQUFLOzBCQUNMLEtBQUs7Z0NBRUwsTUFBTTsyQkFnQk4sU0FBUyxTQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBFbGVtZW50UmVmLFxyXG4gIFZpZXdDaGlsZCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3lcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpbUxhYmVsIH0gZnJvbSAnLi4vdHJpbS1sYWJlbC5oZWxwZXInO1xyXG5pbXBvcnQgeyByZWR1Y2VUaWNrcyB9IGZyb20gJy4vdGlja3MuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXgtYXhpcy10aWNrc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgI3RpY2tzZWw+XHJcbiAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgdGljayBvZiB0aWNrc1wiIGNsYXNzPVwidGlja1wiIFthdHRyLnRyYW5zZm9ybV09XCJ0aWNrVHJhbnNmb3JtKHRpY2spXCI+XHJcbiAgICAgICAgPHRpdGxlPnt7IHRpY2tGb3JtYXQodGljaykgfX08L3RpdGxlPlxyXG4gICAgICAgIDxzdmc6dGV4dFxyXG4gICAgICAgICAgc3Ryb2tlLXdpZHRoPVwiMC4wMVwiXHJcbiAgICAgICAgICBbYXR0ci50ZXh0LWFuY2hvcl09XCJ0ZXh0QW5jaG9yXCJcclxuICAgICAgICAgIFthdHRyLnRyYW5zZm9ybV09XCJ0ZXh0VHJhbnNmb3JtXCJcclxuICAgICAgICAgIFtzdHlsZS5mb250LXNpemVdPVwiJzEycHgnXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICB7eyB0aWNrVHJpbSh0aWNrRm9ybWF0KHRpY2spKSB9fVxyXG4gICAgICAgIDwvc3ZnOnRleHQ+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG5cclxuICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgdGljayBvZiB0aWNrc1wiIFthdHRyLnRyYW5zZm9ybV09XCJ0aWNrVHJhbnNmb3JtKHRpY2spXCI+XHJcbiAgICAgIDxzdmc6ZyAqbmdJZj1cInNob3dHcmlkTGluZXNcIiBbYXR0ci50cmFuc2Zvcm1dPVwiZ3JpZExpbmVUcmFuc2Zvcm0oKVwiPlxyXG4gICAgICAgIDxzdmc6bGluZSBjbGFzcz1cImdyaWRsaW5lLXBhdGggZ3JpZGxpbmUtcGF0aC12ZXJ0aWNhbFwiIFthdHRyLnkxXT1cIi1ncmlkTGluZUhlaWdodFwiIHkyPVwiMFwiIC8+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBYQXhpc1RpY2tzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBzY2FsZTtcclxuICBASW5wdXQoKSBvcmllbnQ7XHJcbiAgQElucHV0KCkgdGlja0FyZ3VtZW50cyA9IFs1XTtcclxuICBASW5wdXQoKSB0aWNrVmFsdWVzOiBhbnlbXTtcclxuICBASW5wdXQoKSB0aWNrU3Ryb2tlID0gJyNjY2MnO1xyXG4gIEBJbnB1dCgpIHRyaW1UaWNrczogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgbWF4VGlja0xlbmd0aDogbnVtYmVyID0gMTY7XHJcbiAgQElucHV0KCkgdGlja0Zvcm1hdHRpbmc7XHJcbiAgQElucHV0KCkgc2hvd0dyaWRMaW5lcyA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGdyaWRMaW5lSGVpZ2h0O1xyXG4gIEBJbnB1dCgpIHdpZHRoO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVRpY2tzOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2ZXJ0aWNhbFNwYWNpbmc6IG51bWJlciA9IDIwO1xyXG4gIHJvdGF0ZUxhYmVsczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGlubmVyVGlja1NpemU6IG51bWJlciA9IDY7XHJcbiAgb3V0ZXJUaWNrU2l6ZTogbnVtYmVyID0gNjtcclxuICB0aWNrUGFkZGluZzogbnVtYmVyID0gMztcclxuICB0ZXh0QW5jaG9yOiBzdHJpbmcgPSAnbWlkZGxlJztcclxuICBtYXhUaWNrc0xlbmd0aDogbnVtYmVyID0gMDtcclxuICBtYXhBbGxvd2VkTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBhZGp1c3RlZFNjYWxlOiBhbnk7XHJcbiAgdGV4dFRyYW5zZm9ybTogYW55O1xyXG4gIHRpY2tzOiBhbnk7XHJcbiAgdGlja0Zvcm1hdDogKG86IGFueSkgPT4gYW55O1xyXG4gIGhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgQFZpZXdDaGlsZCgndGlja3NlbCcpIHRpY2tzRWxlbWVudDogRWxlbWVudFJlZjtcclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVEaW1zKCkpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGltcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IGhlaWdodCA9IHBhcnNlSW50KHRoaXMudGlja3NFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LCAxMCk7XHJcbiAgICBpZiAoaGVpZ2h0ICE9PSB0aGlzLmhlaWdodCkge1xyXG4gICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgdGhpcy5kaW1lbnNpb25zQ2hhbmdlZC5lbWl0KHsgaGVpZ2h0IH0pO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNjYWxlID0gdGhpcy5zY2FsZTtcclxuICAgIHRoaXMudGlja3MgPSB0aGlzLmdldFRpY2tzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMudGlja0Zvcm1hdHRpbmcpIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gdGhpcy50aWNrRm9ybWF0dGluZztcclxuICAgIH0gZWxzZSBpZiAoc2NhbGUudGlja0Zvcm1hdCkge1xyXG4gICAgICB0aGlzLnRpY2tGb3JtYXQgPSBzY2FsZS50aWNrRm9ybWF0LmFwcGx5KHNjYWxlLCB0aGlzLnRpY2tBcmd1bWVudHMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICBpZiAoZC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRGF0ZScpIHtcclxuICAgICAgICAgIHJldHVybiBkLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZC50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yb3RhdGVUaWNrcyA/IHRoaXMuZ2V0Um90YXRpb25BbmdsZSh0aGlzLnRpY2tzKSA6IG51bGw7XHJcblxyXG4gICAgdGhpcy5hZGp1c3RlZFNjYWxlID0gdGhpcy5zY2FsZS5iYW5kd2lkdGhcclxuICAgICAgPyBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUoZCkgKyB0aGlzLnNjYWxlLmJhbmR3aWR0aCgpICogMC41O1xyXG4gICAgICAgIH1cclxuICAgICAgOiB0aGlzLnNjYWxlO1xyXG5cclxuICAgIHRoaXMudGV4dFRyYW5zZm9ybSA9ICcnO1xyXG4gICAgaWYgKGFuZ2xlICYmIGFuZ2xlICE9PSAwKSB7XHJcbiAgICAgIHRoaXMudGV4dFRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX0pYDtcclxuICAgICAgdGhpcy50ZXh0QW5jaG9yID0gJ2VuZCc7XHJcbiAgICAgIHRoaXMudmVydGljYWxTcGFjaW5nID0gMTA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRleHRBbmNob3IgPSAnbWlkZGxlJztcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICB9XHJcblxyXG4gIGdldFJvdGF0aW9uQW5nbGUodGlja3MpOiBudW1iZXIge1xyXG4gICAgbGV0IGFuZ2xlID0gMDtcclxuICAgIHRoaXMubWF4VGlja3NMZW5ndGggPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCB0aWNrID0gdGhpcy50aWNrRm9ybWF0KHRpY2tzW2ldKS50b1N0cmluZygpO1xyXG4gICAgICBsZXQgdGlja0xlbmd0aCA9IHRpY2subGVuZ3RoO1xyXG4gICAgICBpZiAodGhpcy50cmltVGlja3MpIHtcclxuICAgICAgICB0aWNrTGVuZ3RoID0gdGhpcy50aWNrVHJpbSh0aWNrKS5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aWNrTGVuZ3RoID4gdGhpcy5tYXhUaWNrc0xlbmd0aCkge1xyXG4gICAgICAgIHRoaXMubWF4VGlja3NMZW5ndGggPSB0aWNrTGVuZ3RoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVuID0gTWF0aC5taW4odGhpcy5tYXhUaWNrc0xlbmd0aCwgdGhpcy5tYXhBbGxvd2VkTGVuZ3RoKTtcclxuICAgIGNvbnN0IGNoYXJXaWR0aCA9IDg7IC8vIG5lZWQgdG8gbWVhc3VyZSB0aGlzXHJcbiAgICBjb25zdCB3b3JkV2lkdGggPSBsZW4gKiBjaGFyV2lkdGg7XHJcblxyXG4gICAgbGV0IGJhc2VXaWR0aCA9IHdvcmRXaWR0aDtcclxuICAgIGNvbnN0IG1heEJhc2VXaWR0aCA9IE1hdGguZmxvb3IodGhpcy53aWR0aCAvIHRpY2tzLmxlbmd0aCk7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIG9wdGltYWwgYW5nbGVcclxuICAgIHdoaWxlIChiYXNlV2lkdGggPiBtYXhCYXNlV2lkdGggJiYgYW5nbGUgPiAtOTApIHtcclxuICAgICAgYW5nbGUgLT0gMzA7XHJcbiAgICAgIGJhc2VXaWR0aCA9IE1hdGguY29zKGFuZ2xlICogKE1hdGguUEkgLyAxODApKSAqIHdvcmRXaWR0aDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYW5nbGU7XHJcbiAgfVxyXG5cclxuICBnZXRUaWNrcygpIHtcclxuICAgIGxldCB0aWNrcztcclxuICAgIGNvbnN0IG1heFRpY2tzID0gdGhpcy5nZXRNYXhUaWNrcygyMCk7XHJcbiAgICBjb25zdCBtYXhTY2FsZVRpY2tzID0gdGhpcy5nZXRNYXhUaWNrcygxMDApO1xyXG5cclxuICAgIGlmICh0aGlzLnRpY2tWYWx1ZXMpIHtcclxuICAgICAgdGlja3MgPSB0aGlzLnRpY2tWYWx1ZXM7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2NhbGUudGlja3MpIHtcclxuICAgICAgdGlja3MgPSB0aGlzLnNjYWxlLnRpY2tzLmFwcGx5KHRoaXMuc2NhbGUsIFttYXhTY2FsZVRpY2tzXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aWNrcyA9IHRoaXMuc2NhbGUuZG9tYWluKCk7XHJcbiAgICAgIHRpY2tzID0gcmVkdWNlVGlja3ModGlja3MsIG1heFRpY2tzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGlja3M7XHJcbiAgfVxyXG5cclxuICBnZXRNYXhUaWNrcyh0aWNrV2lkdGg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gdGlja1dpZHRoKTtcclxuICB9XHJcblxyXG4gIHRpY2tUcmFuc2Zvcm0odGljayk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICsgdGhpcy5hZGp1c3RlZFNjYWxlKHRpY2spICsgJywnICsgdGhpcy52ZXJ0aWNhbFNwYWNpbmcgKyAnKSc7XHJcbiAgfVxyXG5cclxuICBncmlkTGluZVRyYW5zZm9ybSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwkey10aGlzLnZlcnRpY2FsU3BhY2luZyAtIDV9KWA7XHJcbiAgfVxyXG5cclxuICB0aWNrVHJpbShsYWJlbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnRyaW1UaWNrcyA/IHRyaW1MYWJlbChsYWJlbCwgdGhpcy5tYXhUaWNrTGVuZ3RoKSA6IGxhYmVsO1xyXG4gIH1cclxufVxyXG4iXX0=