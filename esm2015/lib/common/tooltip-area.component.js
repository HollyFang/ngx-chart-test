import { Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { createMouseEvent } from '../events';
export class TooltipArea {
    constructor() {
        this.anchorOpacity = 0;
        this.anchorPos = -1;
        this.anchorValues = [];
        this.showPercentage = false;
        this.tooltipDisabled = false;
        this.hover = new EventEmitter();
    }
    getValues(xVal) {
        const results = [];
        for (const group of this.results) {
            const item = group.series.find(d => d.name.toString() === xVal.toString());
            let groupName = group.name;
            if (groupName instanceof Date) {
                groupName = groupName.toLocaleDateString();
            }
            if (item) {
                const label = item.name;
                let val = item.value;
                if (this.showPercentage) {
                    val = (item.d1 - item.d0).toFixed(2) + '%';
                }
                let color;
                if (this.colors.scaleType === 'linear') {
                    let v = val;
                    if (item.d1) {
                        v = item.d1;
                    }
                    color = this.colors.getColor(v);
                }
                else {
                    color = this.colors.getColor(group.name);
                }
                const data = Object.assign({}, item, {
                    value: val,
                    name: label,
                    series: groupName,
                    min: item.min,
                    max: item.max,
                    color
                });
                results.push(data);
            }
        }
        return results;
    }
    mouseMove(event) {
        const xPos = event.pageX - event.target.getBoundingClientRect().left;
        const closestIndex = this.findClosestPointIndex(xPos);
        const closestPoint = this.xSet[closestIndex];
        this.anchorPos = this.xScale(closestPoint);
        this.anchorPos = Math.max(0, this.anchorPos);
        this.anchorPos = Math.min(this.dims.width, this.anchorPos);
        this.anchorValues = this.getValues(closestPoint);
        if (this.anchorPos !== this.lastAnchorPos) {
            const ev = createMouseEvent('mouseleave');
            this.tooltipAnchor.nativeElement.dispatchEvent(ev);
            this.anchorOpacity = 0.7;
            this.hover.emit({
                value: closestPoint
            });
            this.showTooltip();
            this.lastAnchorPos = this.anchorPos;
        }
    }
    findClosestPointIndex(xPos) {
        let minIndex = 0;
        let maxIndex = this.xSet.length - 1;
        let minDiff = Number.MAX_VALUE;
        let closestIndex = 0;
        while (minIndex <= maxIndex) {
            const currentIndex = ((minIndex + maxIndex) / 2) | 0;
            const currentElement = this.xScale(this.xSet[currentIndex]);
            const curDiff = Math.abs(currentElement - xPos);
            if (curDiff < minDiff) {
                minDiff = curDiff;
                closestIndex = currentIndex;
            }
            if (currentElement < xPos) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > xPos) {
                maxIndex = currentIndex - 1;
            }
            else {
                minDiff = 0;
                closestIndex = currentIndex;
                break;
            }
        }
        return closestIndex;
    }
    showTooltip() {
        const event = createMouseEvent('mouseenter');
        this.tooltipAnchor.nativeElement.dispatchEvent(event);
    }
    hideTooltip() {
        const event = createMouseEvent('mouseleave');
        this.tooltipAnchor.nativeElement.dispatchEvent(event);
        this.anchorOpacity = 0;
        this.lastAnchorPos = -1;
    }
    getToolTipText(tooltipItem) {
        let result = '';
        if (tooltipItem.series !== undefined) {
            result += tooltipItem.series;
        }
        else {
            result += '???';
        }
        result += ': ';
        if (tooltipItem.value !== undefined) {
            result += tooltipItem.value.toLocaleString();
        }
        if (tooltipItem.min !== undefined || tooltipItem.max !== undefined) {
            result += ' (';
            if (tooltipItem.min !== undefined) {
                if (tooltipItem.max === undefined) {
                    result += '≥';
                }
                result += tooltipItem.min.toLocaleString();
                if (tooltipItem.max !== undefined) {
                    result += ' - ';
                }
            }
            else if (tooltipItem.max !== undefined) {
                result += '≤';
            }
            if (tooltipItem.max !== undefined) {
                result += tooltipItem.max.toLocaleString();
            }
            result += ')';
        }
        return result;
    }
}
TooltipArea.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-tooltip-area]',
                template: `
    <svg:g>
      <svg:rect
        class="tooltip-area"
        [attr.x]="0"
        y="0"
        [attr.width]="dims.width"
        [attr.height]="dims.height"
        style="opacity: 0; cursor: 'auto';"
        (mousemove)="mouseMove($event)"
        (mouseleave)="hideTooltip()"
      />
      <ng-template #defaultTooltipTemplate let-model="model">
        <xhtml:div class="area-tooltip-container">
          <xhtml:div *ngFor="let tooltipItem of model" class="tooltip-item">
            <xhtml:span class="tooltip-item-color" [style.background-color]="tooltipItem.color"></xhtml:span>
            {{ getToolTipText(tooltipItem) }}
          </xhtml:div>
        </xhtml:div>
      </ng-template>
      <svg:rect
        #tooltipAnchor
        [@animationState]="anchorOpacity !== 0 ? 'active' : 'inactive'"
        class="tooltip-anchor"
        [attr.x]="anchorPos"
        y="0"
        [attr.width]="1"
        [attr.height]="dims.height"
        [style.opacity]="anchorOpacity"
        [style.pointer-events]="'none'"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'right'"
        [tooltipType]="'tooltip'"
        [tooltipSpacing]="15"
        [tooltipTemplate]="tooltipTemplate ? tooltipTemplate : defaultTooltipTemplate"
        [tooltipContext]="anchorValues"
        [tooltipImmediateExit]="true"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    trigger('animationState', [
                        transition('inactive => active', [
                            style({
                                opacity: 0
                            }),
                            animate(250, style({ opacity: 0.7 }))
                        ]),
                        transition('active => inactive', [
                            style({
                                opacity: 0.7
                            }),
                            animate(250, style({ opacity: 0 }))
                        ])
                    ])
                ]
            },] }
];
TooltipArea.propDecorators = {
    dims: [{ type: Input }],
    xSet: [{ type: Input }],
    xScale: [{ type: Input }],
    yScale: [{ type: Input }],
    results: [{ type: Input }],
    colors: [{ type: Input }],
    showPercentage: [{ type: Input }],
    tooltipDisabled: [{ type: Input }],
    tooltipTemplate: [{ type: Input }],
    hover: [{ type: Output }],
    tooltipAnchor: [{ type: ViewChild, args: ['tooltipAnchor', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hcmVhLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vdG9vbHRpcC1hcmVhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBK0Q3QyxNQUFNLE9BQU8sV0FBVztJQTdEeEI7UUE4REUsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQVUsRUFBRSxDQUFDO1FBU2hCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBR2hDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBZ0p2QyxDQUFDO0lBNUlDLFNBQVMsQ0FBQyxJQUFJO1FBQ1osTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBRW5CLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0UsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFJLFNB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QUFLLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgdHJpZ2dlciwgc3R5bGUsIGFuaW1hdGUsIHRyYW5zaXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcclxuaW1wb3J0IHsgY3JlYXRlTW91c2VFdmVudCB9IGZyb20gJy4uL2V2ZW50cyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2dbbmd4LWNoYXJ0cy10b29sdGlwLWFyZWFdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpnPlxyXG4gICAgICA8c3ZnOnJlY3RcclxuICAgICAgICBjbGFzcz1cInRvb2x0aXAtYXJlYVwiXHJcbiAgICAgICAgW2F0dHIueF09XCIwXCJcclxuICAgICAgICB5PVwiMFwiXHJcbiAgICAgICAgW2F0dHIud2lkdGhdPVwiZGltcy53aWR0aFwiXHJcbiAgICAgICAgW2F0dHIuaGVpZ2h0XT1cImRpbXMuaGVpZ2h0XCJcclxuICAgICAgICBzdHlsZT1cIm9wYWNpdHk6IDA7IGN1cnNvcjogJ2F1dG8nO1wiXHJcbiAgICAgICAgKG1vdXNlbW92ZSk9XCJtb3VzZU1vdmUoJGV2ZW50KVwiXHJcbiAgICAgICAgKG1vdXNlbGVhdmUpPVwiaGlkZVRvb2x0aXAoKVwiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRvb2x0aXBUZW1wbGF0ZSBsZXQtbW9kZWw9XCJtb2RlbFwiPlxyXG4gICAgICAgIDx4aHRtbDpkaXYgY2xhc3M9XCJhcmVhLXRvb2x0aXAtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICA8eGh0bWw6ZGl2ICpuZ0Zvcj1cImxldCB0b29sdGlwSXRlbSBvZiBtb2RlbFwiIGNsYXNzPVwidG9vbHRpcC1pdGVtXCI+XHJcbiAgICAgICAgICAgIDx4aHRtbDpzcGFuIGNsYXNzPVwidG9vbHRpcC1pdGVtLWNvbG9yXCIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVwidG9vbHRpcEl0ZW0uY29sb3JcIj48L3hodG1sOnNwYW4+XHJcbiAgICAgICAgICAgIHt7IGdldFRvb2xUaXBUZXh0KHRvb2x0aXBJdGVtKSB9fVxyXG4gICAgICAgICAgPC94aHRtbDpkaXY+XHJcbiAgICAgICAgPC94aHRtbDpkaXY+XHJcbiAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxzdmc6cmVjdFxyXG4gICAgICAgICN0b29sdGlwQW5jaG9yXHJcbiAgICAgICAgW0BhbmltYXRpb25TdGF0ZV09XCJhbmNob3JPcGFjaXR5ICE9PSAwID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnXCJcclxuICAgICAgICBjbGFzcz1cInRvb2x0aXAtYW5jaG9yXCJcclxuICAgICAgICBbYXR0ci54XT1cImFuY2hvclBvc1wiXHJcbiAgICAgICAgeT1cIjBcIlxyXG4gICAgICAgIFthdHRyLndpZHRoXT1cIjFcIlxyXG4gICAgICAgIFthdHRyLmhlaWdodF09XCJkaW1zLmhlaWdodFwiXHJcbiAgICAgICAgW3N0eWxlLm9wYWNpdHldPVwiYW5jaG9yT3BhY2l0eVwiXHJcbiAgICAgICAgW3N0eWxlLnBvaW50ZXItZXZlbnRzXT1cIidub25lJ1wiXHJcbiAgICAgICAgbmd4LXRvb2x0aXBcclxuICAgICAgICBbdG9vbHRpcERpc2FibGVkXT1cInRvb2x0aXBEaXNhYmxlZFwiXHJcbiAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwiJ3JpZ2h0J1wiXHJcbiAgICAgICAgW3Rvb2x0aXBUeXBlXT1cIid0b29sdGlwJ1wiXHJcbiAgICAgICAgW3Rvb2x0aXBTcGFjaW5nXT1cIjE1XCJcclxuICAgICAgICBbdG9vbHRpcFRlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZSA/IHRvb2x0aXBUZW1wbGF0ZSA6IGRlZmF1bHRUb29sdGlwVGVtcGxhdGVcIlxyXG4gICAgICAgIFt0b29sdGlwQ29udGV4dF09XCJhbmNob3JWYWx1ZXNcIlxyXG4gICAgICAgIFt0b29sdGlwSW1tZWRpYXRlRXhpdF09XCJ0cnVlXCJcclxuICAgICAgLz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBhbmltYXRpb25zOiBbXHJcbiAgICB0cmlnZ2VyKCdhbmltYXRpb25TdGF0ZScsIFtcclxuICAgICAgdHJhbnNpdGlvbignaW5hY3RpdmUgPT4gYWN0aXZlJywgW1xyXG4gICAgICAgIHN0eWxlKHtcclxuICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICB9KSxcclxuICAgICAgICBhbmltYXRlKDI1MCwgc3R5bGUoeyBvcGFjaXR5OiAwLjcgfSkpXHJcbiAgICAgIF0pLFxyXG4gICAgICB0cmFuc2l0aW9uKCdhY3RpdmUgPT4gaW5hY3RpdmUnLCBbXHJcbiAgICAgICAgc3R5bGUoe1xyXG4gICAgICAgICAgb3BhY2l0eTogMC43XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgYW5pbWF0ZSgyNTAsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSlcclxuICAgICAgXSlcclxuICAgIF0pXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcEFyZWEge1xyXG4gIGFuY2hvck9wYWNpdHk6IG51bWJlciA9IDA7XHJcbiAgYW5jaG9yUG9zOiBudW1iZXIgPSAtMTtcclxuICBhbmNob3JWYWx1ZXM6IGFueVtdID0gW107XHJcbiAgbGFzdEFuY2hvclBvczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoKSBkaW1zO1xyXG4gIEBJbnB1dCgpIHhTZXQ7XHJcbiAgQElucHV0KCkgeFNjYWxlO1xyXG4gIEBJbnB1dCgpIHlTY2FsZTtcclxuICBASW5wdXQoKSByZXN1bHRzO1xyXG4gIEBJbnB1dCgpIGNvbG9ycztcclxuICBASW5wdXQoKSBzaG93UGVyY2VudGFnZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQE91dHB1dCgpIGhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAVmlld0NoaWxkKCd0b29sdGlwQW5jaG9yJywgeyBzdGF0aWM6IGZhbHNlIH0pIHRvb2x0aXBBbmNob3I7XHJcblxyXG4gIGdldFZhbHVlcyh4VmFsKTogYW55W10ge1xyXG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgdGhpcy5yZXN1bHRzKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBncm91cC5zZXJpZXMuZmluZChkID0+IGQubmFtZS50b1N0cmluZygpID09PSB4VmFsLnRvU3RyaW5nKCkpO1xyXG4gICAgICBsZXQgZ3JvdXBOYW1lID0gZ3JvdXAubmFtZTtcclxuICAgICAgaWYgKGdyb3VwTmFtZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBncm91cE5hbWUgPSBncm91cE5hbWUudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgbGFiZWwgPSBpdGVtLm5hbWU7XHJcbiAgICAgICAgbGV0IHZhbCA9IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1BlcmNlbnRhZ2UpIHtcclxuICAgICAgICAgIHZhbCA9IChpdGVtLmQxIC0gaXRlbS5kMCkudG9GaXhlZCgyKSArICclJztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNvbG9yO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbG9ycy5zY2FsZVR5cGUgPT09ICdsaW5lYXInKSB7XHJcbiAgICAgICAgICBsZXQgdiA9IHZhbDtcclxuICAgICAgICAgIGlmIChpdGVtLmQxKSB7XHJcbiAgICAgICAgICAgIHYgPSBpdGVtLmQxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcih2KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29sb3IgPSB0aGlzLmNvbG9ycy5nZXRDb2xvcihncm91cC5uYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7XHJcbiAgICAgICAgICB2YWx1ZTogdmFsLFxyXG4gICAgICAgICAgbmFtZTogbGFiZWwsXHJcbiAgICAgICAgICBzZXJpZXM6IGdyb3VwTmFtZSxcclxuICAgICAgICAgIG1pbjogaXRlbS5taW4sXHJcbiAgICAgICAgICBtYXg6IGl0ZW0ubWF4LFxyXG4gICAgICAgICAgY29sb3JcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfVxyXG5cclxuICBtb3VzZU1vdmUoZXZlbnQpIHtcclxuICAgIGNvbnN0IHhQb3MgPSBldmVudC5wYWdlWCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xyXG5cclxuICAgIGNvbnN0IGNsb3Nlc3RJbmRleCA9IHRoaXMuZmluZENsb3Nlc3RQb2ludEluZGV4KHhQb3MpO1xyXG4gICAgY29uc3QgY2xvc2VzdFBvaW50ID0gdGhpcy54U2V0W2Nsb3Nlc3RJbmRleF07XHJcbiAgICB0aGlzLmFuY2hvclBvcyA9IHRoaXMueFNjYWxlKGNsb3Nlc3RQb2ludCk7XHJcbiAgICB0aGlzLmFuY2hvclBvcyA9IE1hdGgubWF4KDAsIHRoaXMuYW5jaG9yUG9zKTtcclxuICAgIHRoaXMuYW5jaG9yUG9zID0gTWF0aC5taW4odGhpcy5kaW1zLndpZHRoLCB0aGlzLmFuY2hvclBvcyk7XHJcblxyXG4gICAgdGhpcy5hbmNob3JWYWx1ZXMgPSB0aGlzLmdldFZhbHVlcyhjbG9zZXN0UG9pbnQpO1xyXG4gICAgaWYgKHRoaXMuYW5jaG9yUG9zICE9PSB0aGlzLmxhc3RBbmNob3JQb3MpIHtcclxuICAgICAgY29uc3QgZXYgPSBjcmVhdGVNb3VzZUV2ZW50KCdtb3VzZWxlYXZlJyk7XHJcbiAgICAgIHRoaXMudG9vbHRpcEFuY2hvci5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgICB0aGlzLmFuY2hvck9wYWNpdHkgPSAwLjc7XHJcbiAgICAgIHRoaXMuaG92ZXIuZW1pdCh7XHJcbiAgICAgICAgdmFsdWU6IGNsb3Nlc3RQb2ludFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5zaG93VG9vbHRpcCgpO1xyXG5cclxuICAgICAgdGhpcy5sYXN0QW5jaG9yUG9zID0gdGhpcy5hbmNob3JQb3M7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmaW5kQ2xvc2VzdFBvaW50SW5kZXgoeFBvcykge1xyXG4gICAgbGV0IG1pbkluZGV4ID0gMDtcclxuICAgIGxldCBtYXhJbmRleCA9IHRoaXMueFNldC5sZW5ndGggLSAxO1xyXG4gICAgbGV0IG1pbkRpZmYgPSBOdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgbGV0IGNsb3Nlc3RJbmRleCA9IDA7XHJcblxyXG4gICAgd2hpbGUgKG1pbkluZGV4IDw9IG1heEluZGV4KSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9ICgobWluSW5kZXggKyBtYXhJbmRleCkgLyAyKSB8IDA7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRFbGVtZW50ID0gdGhpcy54U2NhbGUodGhpcy54U2V0W2N1cnJlbnRJbmRleF0pO1xyXG5cclxuICAgICAgY29uc3QgY3VyRGlmZiA9IE1hdGguYWJzKGN1cnJlbnRFbGVtZW50IC0geFBvcyk7XHJcblxyXG4gICAgICBpZiAoY3VyRGlmZiA8IG1pbkRpZmYpIHtcclxuICAgICAgICBtaW5EaWZmID0gY3VyRGlmZjtcclxuICAgICAgICBjbG9zZXN0SW5kZXggPSBjdXJyZW50SW5kZXg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50RWxlbWVudCA8IHhQb3MpIHtcclxuICAgICAgICBtaW5JbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudEVsZW1lbnQgPiB4UG9zKSB7XHJcbiAgICAgICAgbWF4SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1pbkRpZmYgPSAwO1xyXG4gICAgICAgIGNsb3Nlc3RJbmRleCA9IGN1cnJlbnRJbmRleDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjbG9zZXN0SW5kZXg7XHJcbiAgfVxyXG5cclxuICBzaG93VG9vbHRpcCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlTW91c2VFdmVudCgnbW91c2VlbnRlcicpO1xyXG4gICAgdGhpcy50b29sdGlwQW5jaG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG5cclxuICBoaWRlVG9vbHRpcCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGV2ZW50ID0gY3JlYXRlTW91c2VFdmVudCgnbW91c2VsZWF2ZScpO1xyXG4gICAgdGhpcy50b29sdGlwQW5jaG9yLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB0aGlzLmFuY2hvck9wYWNpdHkgPSAwO1xyXG4gICAgdGhpcy5sYXN0QW5jaG9yUG9zID0gLTE7XHJcbiAgfVxyXG5cclxuICBnZXRUb29sVGlwVGV4dCh0b29sdGlwSXRlbTogYW55KTogc3RyaW5nIHtcclxuICAgIGxldCByZXN1bHQ6IHN0cmluZyA9ICcnO1xyXG4gICAgaWYgKHRvb2x0aXBJdGVtLnNlcmllcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdCArPSB0b29sdGlwSXRlbS5zZXJpZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgKz0gJz8/Pyc7XHJcbiAgICB9XHJcbiAgICByZXN1bHQgKz0gJzogJztcclxuICAgIGlmICh0b29sdGlwSXRlbS52YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdCArPSB0b29sdGlwSXRlbS52YWx1ZS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRvb2x0aXBJdGVtLm1pbiAhPT0gdW5kZWZpbmVkIHx8IHRvb2x0aXBJdGVtLm1heCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdCArPSAnICgnO1xyXG4gICAgICBpZiAodG9vbHRpcEl0ZW0ubWluICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAodG9vbHRpcEl0ZW0ubWF4ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIHJlc3VsdCArPSAn4omlJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzdWx0ICs9IHRvb2x0aXBJdGVtLm1pbi50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICAgIGlmICh0b29sdGlwSXRlbS5tYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcmVzdWx0ICs9ICcgLSAnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0b29sdGlwSXRlbS5tYXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJlc3VsdCArPSAn4omkJztcclxuICAgICAgfVxyXG4gICAgICBpZiAodG9vbHRpcEl0ZW0ubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXN1bHQgKz0gdG9vbHRpcEl0ZW0ubWF4LnRvTG9jYWxlU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0ICs9ICcpJztcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==