import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { reduceTicks } from './ticks.helper';
import { roundedRect } from '../../common/shape.helper';
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
        let activeVal = this.adjustedScale(this.activeTime);
        console.log('setReferencelines');
        this.activeTimePath = roundedRect(activeVal, this.height, 1, this.height, 0, [
            false,
            false,
            false,
            false
        ]);
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

    <svg:path
      *ngIf="activeTime"
      [attr.d]="activeTimePath"
      [attr.transform]="gridLineTransform()"
    />
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieC1heGlzLXRpY2tzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vYXhlcy94LWF4aXMtdGlja3MuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR1osU0FBUyxFQUdULHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQWdDeEQsTUFBTSxPQUFPLG1CQUFtQjtJQTlCaEM7UUFpQ1csa0JBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLGVBQVUsR0FBRyxNQUFNLENBQUM7UUFDcEIsY0FBUyxHQUFZLElBQUksQ0FBQztRQUMxQixrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUUzQixrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUl0QixnQkFBVyxHQUFZLElBQUksQ0FBQztRQUUzQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBQzdCLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxRQUFRLENBQUM7UUFDOUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFDM0IscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1FBSzlCLFdBQU0sR0FBVyxDQUFDLENBQUM7SUF1SXJCLENBQUM7SUFsSUMsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsZUFBZTtRQUNiLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsVUFBVTtRQUNSLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1RixJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU3QixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3ZDO2FBQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNyRTthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29CQUNqQyxPQUFPLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUM7U0FDSDtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUUxRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUztZQUN2QyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUNULE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQztZQUN0RCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFZixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxLQUFLLEdBQUcsQ0FBQztZQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7U0FDNUI7UUFFRCxJQUFHLElBQUksQ0FBQyxVQUFVLEVBQUM7WUFDakIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUMzRSxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1NBQ04sQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELGdCQUFnQixDQUFDLEtBQUs7UUFDcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzdCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQ3pDO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7YUFDbEM7U0FDRjtRQUVELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNqRSxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyx1QkFBdUI7UUFDNUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztRQUVsQyxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCwwQkFBMEI7UUFDMUIsT0FBTyxTQUFTLEdBQUcsWUFBWSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRTtZQUM5QyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ1osU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztTQUMzRDtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLEtBQUssQ0FBQztRQUNWLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDekI7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQzNCLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNMLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsV0FBVyxDQUFDLFNBQWlCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBSTtRQUNoQixPQUFPLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztJQUNwRixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNyRCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3ZFLENBQUM7OztZQWpNRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7b0JBRUUsS0FBSztxQkFDTCxLQUFLOzRCQUNMLEtBQUs7eUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7NEJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7NkJBQ0wsS0FBSztvQkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSztnQ0FFTCxNQUFNOzJCQWlCTixTQUFTLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgVmlld0NoaWxkLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyB0cmltTGFiZWwgfSBmcm9tICcuLi90cmltLWxhYmVsLmhlbHBlcic7XHJcbmltcG9ydCB7IHJlZHVjZVRpY2tzIH0gZnJvbSAnLi90aWNrcy5oZWxwZXInO1xyXG5pbXBvcnQgeyByb3VuZGVkUmVjdCB9IGZyb20gJy4uLy4uL2NvbW1vbi9zaGFwZS5oZWxwZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMteC1heGlzLXRpY2tzXScsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzdmc6ZyAjdGlja3NlbD5cclxuICAgICAgPHN2ZzpnICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzXCIgY2xhc3M9XCJ0aWNrXCIgW2F0dHIudHJhbnNmb3JtXT1cInRpY2tUcmFuc2Zvcm0odGljaylcIj5cclxuICAgICAgICA8dGl0bGU+e3sgdGlja0Zvcm1hdCh0aWNrKSB9fTwvdGl0bGU+XHJcbiAgICAgICAgPHN2Zzp0ZXh0XHJcbiAgICAgICAgICBzdHJva2Utd2lkdGg9XCIwLjAxXCJcclxuICAgICAgICAgIFthdHRyLnRleHQtYW5jaG9yXT1cInRleHRBbmNob3JcIlxyXG4gICAgICAgICAgW2F0dHIudHJhbnNmb3JtXT1cInRleHRUcmFuc2Zvcm1cIlxyXG4gICAgICAgICAgW3N0eWxlLmZvbnQtc2l6ZV09XCInMTJweCdcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIHt7IHRpY2tUcmltKHRpY2tGb3JtYXQodGljaykpIH19XHJcbiAgICAgICAgPC9zdmc6dGV4dD5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcblxyXG4gICAgPHN2ZzpwYXRoXHJcbiAgICAgICpuZ0lmPVwiYWN0aXZlVGltZVwiXHJcbiAgICAgIFthdHRyLmRdPVwiYWN0aXZlVGltZVBhdGhcIlxyXG4gICAgICBbYXR0ci50cmFuc2Zvcm1dPVwiZ3JpZExpbmVUcmFuc2Zvcm0oKVwiXHJcbiAgICAvPlxyXG4gICAgPHN2ZzpnICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzXCIgW2F0dHIudHJhbnNmb3JtXT1cInRpY2tUcmFuc2Zvcm0odGljaylcIj5cclxuICAgICAgPHN2ZzpnICpuZ0lmPVwic2hvd0dyaWRMaW5lc1wiIFthdHRyLnRyYW5zZm9ybV09XCJncmlkTGluZVRyYW5zZm9ybSgpXCI+XHJcbiAgICAgICAgPHN2ZzpsaW5lIGNsYXNzPVwiZ3JpZGxpbmUtcGF0aCBncmlkbGluZS1wYXRoLXZlcnRpY2FsXCIgW2F0dHIueTFdPVwiLWdyaWRMaW5lSGVpZ2h0XCIgeTI9XCIwXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgWEF4aXNUaWNrc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgc2NhbGU7XHJcbiAgQElucHV0KCkgb3JpZW50O1xyXG4gIEBJbnB1dCgpIHRpY2tBcmd1bWVudHMgPSBbNV07XHJcbiAgQElucHV0KCkgdGlja1ZhbHVlczogYW55W107XHJcbiAgQElucHV0KCkgdGlja1N0cm9rZSA9ICcjY2NjJztcclxuICBASW5wdXQoKSB0cmltVGlja3M6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1heFRpY2tMZW5ndGg6IG51bWJlciA9IDE2O1xyXG4gIEBJbnB1dCgpIHRpY2tGb3JtYXR0aW5nO1xyXG4gIEBJbnB1dCgpIHNob3dHcmlkTGluZXMgPSBmYWxzZTtcclxuICBASW5wdXQoKSBncmlkTGluZUhlaWdodDtcclxuICBASW5wdXQoKSB3aWR0aDtcclxuICBASW5wdXQoKSBhY3RpdmVUaW1lO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVRpY2tzOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgQE91dHB1dCgpIGRpbWVuc2lvbnNDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB2ZXJ0aWNhbFNwYWNpbmc6IG51bWJlciA9IDIwO1xyXG4gIHJvdGF0ZUxhYmVsczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGlubmVyVGlja1NpemU6IG51bWJlciA9IDY7XHJcbiAgb3V0ZXJUaWNrU2l6ZTogbnVtYmVyID0gNjtcclxuICB0aWNrUGFkZGluZzogbnVtYmVyID0gMztcclxuICB0ZXh0QW5jaG9yOiBzdHJpbmcgPSAnbWlkZGxlJztcclxuICBtYXhUaWNrc0xlbmd0aDogbnVtYmVyID0gMDtcclxuICBtYXhBbGxvd2VkTGVuZ3RoOiBudW1iZXIgPSAxNjtcclxuICBhZGp1c3RlZFNjYWxlOiBhbnk7XHJcbiAgdGV4dFRyYW5zZm9ybTogYW55O1xyXG4gIHRpY2tzOiBhbnk7XHJcbiAgdGlja0Zvcm1hdDogKG86IGFueSkgPT4gYW55O1xyXG4gIGhlaWdodDogbnVtYmVyID0gMDtcclxuICBhY3RpdmVUaW1lUGF0aDpzdHJpbmc7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3RpY2tzZWwnKSB0aWNrc0VsZW1lbnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURpbXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUludCh0aGlzLnRpY2tzRWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCwgMTApO1xyXG4gICAgaWYgKGhlaWdodCAhPT0gdGhpcy5oZWlnaHQpIHtcclxuICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgIHRoaXMuZGltZW5zaW9uc0NoYW5nZWQuZW1pdCh7IGhlaWdodCB9KTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZURpbXMoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICBjb25zdCBzY2FsZSA9IHRoaXMuc2NhbGU7XHJcbiAgICB0aGlzLnRpY2tzID0gdGhpcy5nZXRUaWNrcygpO1xyXG5cclxuICAgIGlmICh0aGlzLnRpY2tGb3JtYXR0aW5nKSB7XHJcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IHRoaXMudGlja0Zvcm1hdHRpbmc7XHJcbiAgICB9IGVsc2UgaWYgKHNjYWxlLnRpY2tGb3JtYXQpIHtcclxuICAgICAgdGhpcy50aWNrRm9ybWF0ID0gc2NhbGUudGlja0Zvcm1hdC5hcHBseShzY2FsZSwgdGhpcy50aWNrQXJndW1lbnRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGlja0Zvcm1hdCA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgaWYgKGQuY29uc3RydWN0b3IubmFtZSA9PT0gJ0RhdGUnKSB7XHJcbiAgICAgICAgICByZXR1cm4gZC50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGQudG9Mb2NhbGVTdHJpbmcoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhbmdsZSA9IHRoaXMucm90YXRlVGlja3MgPyB0aGlzLmdldFJvdGF0aW9uQW5nbGUodGhpcy50aWNrcykgOiBudWxsO1xyXG5cclxuICAgIHRoaXMuYWRqdXN0ZWRTY2FsZSA9IHRoaXMuc2NhbGUuYmFuZHdpZHRoXHJcbiAgICAgID8gZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnNjYWxlKGQpICsgdGhpcy5zY2FsZS5iYW5kd2lkdGgoKSAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgIDogdGhpcy5zY2FsZTtcclxuXHJcbiAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSAnJztcclxuICAgIGlmIChhbmdsZSAmJiBhbmdsZSAhPT0gMCkge1xyXG4gICAgICB0aGlzLnRleHRUcmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9KWA7XHJcbiAgICAgIHRoaXMudGV4dEFuY2hvciA9ICdlbmQnO1xyXG4gICAgICB0aGlzLnZlcnRpY2FsU3BhY2luZyA9IDEwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZXh0QW5jaG9yID0gJ21pZGRsZSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodGhpcy5hY3RpdmVUaW1lKXtcclxuICAgICAgdGhpcy5zZXRBY3RpdmVUaW1lKCk7XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlRGltcygpKTtcclxuICB9XHJcblxyXG4gIHNldEFjdGl2ZVRpbWUoKTogdm9pZCB7XHJcbiAgICBsZXQgYWN0aXZlVmFsID0gdGhpcy5hZGp1c3RlZFNjYWxlKHRoaXMuYWN0aXZlVGltZSk7XHJcbmNvbnNvbGUubG9nKCdzZXRSZWZlcmVuY2VsaW5lcycpO1xyXG4gICAgdGhpcy5hY3RpdmVUaW1lUGF0aCA9IHJvdW5kZWRSZWN0KGFjdGl2ZVZhbCwgdGhpcy5oZWlnaHQsIDEsIHRoaXMuaGVpZ2h0LCAwLCBbXHJcbiAgICAgIGZhbHNlLFxyXG4gICAgICBmYWxzZSxcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIGZhbHNlXHJcbiAgICBdKTtcclxuICB9XHJcbiAgZ2V0Um90YXRpb25BbmdsZSh0aWNrcyk6IG51bWJlciB7XHJcbiAgICBsZXQgYW5nbGUgPSAwO1xyXG4gICAgdGhpcy5tYXhUaWNrc0xlbmd0aCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHRpY2sgPSB0aGlzLnRpY2tGb3JtYXQodGlja3NbaV0pLnRvU3RyaW5nKCk7XHJcbiAgICAgIGxldCB0aWNrTGVuZ3RoID0gdGljay5sZW5ndGg7XHJcbiAgICAgIGlmICh0aGlzLnRyaW1UaWNrcykge1xyXG4gICAgICAgIHRpY2tMZW5ndGggPSB0aGlzLnRpY2tUcmltKHRpY2spLmxlbmd0aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRpY2tMZW5ndGggPiB0aGlzLm1heFRpY2tzTGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5tYXhUaWNrc0xlbmd0aCA9IHRpY2tMZW5ndGg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZW4gPSBNYXRoLm1pbih0aGlzLm1heFRpY2tzTGVuZ3RoLCB0aGlzLm1heEFsbG93ZWRMZW5ndGgpO1xyXG4gICAgY29uc3QgY2hhcldpZHRoID0gODsgLy8gbmVlZCB0byBtZWFzdXJlIHRoaXNcclxuICAgIGNvbnN0IHdvcmRXaWR0aCA9IGxlbiAqIGNoYXJXaWR0aDtcclxuXHJcbiAgICBsZXQgYmFzZVdpZHRoID0gd29yZFdpZHRoO1xyXG4gICAgY29uc3QgbWF4QmFzZVdpZHRoID0gTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gdGlja3MubGVuZ3RoKTtcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgb3B0aW1hbCBhbmdsZVxyXG4gICAgd2hpbGUgKGJhc2VXaWR0aCA+IG1heEJhc2VXaWR0aCAmJiBhbmdsZSA+IC05MCkge1xyXG4gICAgICBhbmdsZSAtPSAzMDtcclxuICAgICAgYmFzZVdpZHRoID0gTWF0aC5jb3MoYW5nbGUgKiAoTWF0aC5QSSAvIDE4MCkpICogd29yZFdpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhbmdsZTtcclxuICB9XHJcblxyXG4gIGdldFRpY2tzKCkge1xyXG4gICAgbGV0IHRpY2tzO1xyXG4gICAgY29uc3QgbWF4VGlja3MgPSB0aGlzLmdldE1heFRpY2tzKDIwKTtcclxuICAgIGNvbnN0IG1heFNjYWxlVGlja3MgPSB0aGlzLmdldE1heFRpY2tzKDEwMCk7XHJcblxyXG4gICAgaWYgKHRoaXMudGlja1ZhbHVlcykge1xyXG4gICAgICB0aWNrcyA9IHRoaXMudGlja1ZhbHVlcztcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zY2FsZS50aWNrcykge1xyXG4gICAgICB0aWNrcyA9IHRoaXMuc2NhbGUudGlja3MuYXBwbHkodGhpcy5zY2FsZSwgW21heFNjYWxlVGlja3NdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRpY2tzID0gdGhpcy5zY2FsZS5kb21haW4oKTtcclxuICAgICAgdGlja3MgPSByZWR1Y2VUaWNrcyh0aWNrcywgbWF4VGlja3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aWNrcztcclxuICB9XHJcblxyXG4gIGdldE1heFRpY2tzKHRpY2tXaWR0aDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKHRoaXMud2lkdGggLyB0aWNrV2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgdGlja1RyYW5zZm9ybSh0aWNrKTogc3RyaW5nIHtcclxuICAgIHJldHVybiAndHJhbnNsYXRlKCcgKyB0aGlzLmFkanVzdGVkU2NhbGUodGljaykgKyAnLCcgKyB0aGlzLnZlcnRpY2FsU3BhY2luZyArICcpJztcclxuICB9XHJcblxyXG4gIGdyaWRMaW5lVHJhbnNmb3JtKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgwLCR7LXRoaXMudmVydGljYWxTcGFjaW5nIC0gNX0pYDtcclxuICB9XHJcblxyXG4gIHRpY2tUcmltKGxhYmVsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMudHJpbVRpY2tzID8gdHJpbUxhYmVsKGxhYmVsLCB0aGlzLm1heFRpY2tMZW5ndGgpIDogbGFiZWw7XHJcbiAgfVxyXG59XHJcbiJdfQ==