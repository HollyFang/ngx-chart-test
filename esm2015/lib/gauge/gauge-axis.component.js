import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { line } from 'd3-shape';
export class GaugeAxisComponent {
    constructor() {
        this.rotate = '';
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.rotationAngle = -90 + this.startAngle;
        this.rotate = `rotate(${this.rotationAngle})`;
        this.ticks = this.getTicks();
    }
    getTicks() {
        const bigTickSegment = this.angleSpan / this.bigSegments;
        const smallTickSegment = bigTickSegment / this.smallSegments;
        const tickLength = 20;
        const ticks = {
            big: [],
            small: []
        };
        const startDistance = this.radius + 10;
        const textDist = startDistance + tickLength + 10;
        for (let i = 0; i <= this.bigSegments; i++) {
            const angleDeg = i * bigTickSegment;
            const angle = (angleDeg * Math.PI) / 180;
            const textAnchor = this.getTextAnchor(angleDeg);
            let skip = false;
            if (i === 0 && this.angleSpan === 360) {
                skip = true;
            }
            if (!skip) {
                let text = Number.parseFloat(this.valueScale.invert(angleDeg).toString()).toLocaleString();
                if (this.tickFormatting) {
                    text = this.tickFormatting(text);
                }
                ticks.big.push({
                    line: this.getTickPath(startDistance, tickLength, angle),
                    textAnchor,
                    text,
                    textTransform: `
            translate(${textDist * Math.cos(angle)}, ${textDist * Math.sin(angle)}) rotate(${-this.rotationAngle})
          `
                });
            }
            if (i === this.bigSegments) {
                continue;
            }
            for (let j = 1; j <= this.smallSegments; j++) {
                const smallAngleDeg = angleDeg + j * smallTickSegment;
                const smallAngle = (smallAngleDeg * Math.PI) / 180;
                ticks.small.push({
                    line: this.getTickPath(startDistance, tickLength / 2, smallAngle)
                });
            }
        }
        return ticks;
    }
    getTextAnchor(angle) {
        // [0, 45] = 'middle';
        // [46, 135] = 'start';
        // [136, 225] = 'middle';
        // [226, 315] = 'end';
        angle = (this.startAngle + angle) % 360;
        let textAnchor = 'middle';
        if (angle > 45 && angle <= 135) {
            textAnchor = 'start';
        }
        else if (angle > 225 && angle <= 315) {
            textAnchor = 'end';
        }
        return textAnchor;
    }
    getTickPath(startDistance, tickLength, angle) {
        const y1 = startDistance * Math.sin(angle);
        const y2 = (startDistance + tickLength) * Math.sin(angle);
        const x1 = startDistance * Math.cos(angle);
        const x2 = (startDistance + tickLength) * Math.cos(angle);
        const points = [
            { x: x1, y: y1 },
            { x: x2, y: y2 }
        ];
        const lineGenerator = line()
            .x(d => d.x)
            .y(d => d.y);
        return lineGenerator(points);
    }
}
GaugeAxisComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-gauge-axis]',
                template: `
    <svg:g [attr.transform]="rotate">
      <svg:g *ngFor="let tick of ticks.big" class="gauge-tick gauge-tick-large">
        <svg:path [attr.d]="tick.line" />
      </svg:g>
      <svg:g *ngFor="let tick of ticks.big" class="gauge-tick gauge-tick-large">
        <svg:text
          [style.textAnchor]="tick.textAnchor"
          [attr.transform]="tick.textTransform"
          alignment-baseline="central"
        >
          {{ tick.text }}
        </svg:text>
      </svg:g>
      <svg:g *ngFor="let tick of ticks.small" class="gauge-tick gauge-tick-small">
        <svg:path [attr.d]="tick.line" />
      </svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
GaugeAxisComponent.propDecorators = {
    bigSegments: [{ type: Input }],
    smallSegments: [{ type: Input }],
    min: [{ type: Input }],
    max: [{ type: Input }],
    angleSpan: [{ type: Input }],
    startAngle: [{ type: Input }],
    radius: [{ type: Input }],
    valueScale: [{ type: Input }],
    tickFormatting: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UtYXhpcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvZ2F1Z2UvZ2F1Z2UtYXhpcy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTRCLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxVQUFVLENBQUM7QUF5QmhDLE1BQU0sT0FBTyxrQkFBa0I7SUF2Qi9CO1FBb0NFLFdBQU0sR0FBVyxFQUFFLENBQUM7SUFrR3RCLENBQUM7SUFoR0MsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3pELE1BQU0sZ0JBQWdCLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDN0QsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHO1lBQ1osR0FBRyxFQUFFLEVBQUU7WUFDUCxLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFFRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUN2QyxNQUFNLFFBQVEs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QUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxFQUFFLEdBQUcsQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRCxNQUFNLEVBQUUsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLEVBQUUsR0FBRyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELE1BQU0sTUFBTSxHQUFHO1lBQ2IsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7WUFDaEIsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7U0FDakIsQ0FBQztRQUNGLE1BQU0sYUFBYSxHQUFHLElBQUksRUFBTzthQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBcklGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMEJBQTBCO2dCQUNwQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7OzBCQUVFLEtBQUs7NEJBQ0wsS0FBSztrQkFDTCxLQUFLO2tCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzs2QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBsaW5lIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtZ2F1Z2UtYXhpc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgW2F0dHIudHJhbnNmb3JtXT1cInJvdGF0ZVwiPlxyXG4gICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHRpY2sgb2YgdGlja3MuYmlnXCIgY2xhc3M9XCJnYXVnZS10aWNrIGdhdWdlLXRpY2stbGFyZ2VcIj5cclxuICAgICAgICA8c3ZnOnBhdGggW2F0dHIuZF09XCJ0aWNrLmxpbmVcIiAvPlxyXG4gICAgICA8L3N2ZzpnPlxyXG4gICAgICA8c3ZnOmcgKm5nRm9yPVwibGV0IHRpY2sgb2YgdGlja3MuYmlnXCIgY2xhc3M9XCJnYXVnZS10aWNrIGdhdWdlLXRpY2stbGFyZ2VcIj5cclxuICAgICAgICA8c3ZnOnRleHRcclxuICAgICAgICAgIFtzdHlsZS50ZXh0QW5jaG9yXT1cInRpY2sudGV4dEFuY2hvclwiXHJcbiAgICAgICAgICBbYXR0ci50cmFuc2Zvcm1dPVwidGljay50ZXh0VHJhbnNmb3JtXCJcclxuICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cImNlbnRyYWxcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIHt7IHRpY2sudGV4dCB9fVxyXG4gICAgICAgIDwvc3ZnOnRleHQ+XHJcbiAgICAgIDwvc3ZnOmc+XHJcbiAgICAgIDxzdmc6ZyAqbmdGb3I9XCJsZXQgdGljayBvZiB0aWNrcy5zbWFsbFwiIGNsYXNzPVwiZ2F1Z2UtdGljayBnYXVnZS10aWNrLXNtYWxsXCI+XHJcbiAgICAgICAgPHN2ZzpwYXRoIFthdHRyLmRdPVwidGljay5saW5lXCIgLz5cclxuICAgICAgPC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgR2F1Z2VBeGlzQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBiaWdTZWdtZW50czogYW55O1xyXG4gIEBJbnB1dCgpIHNtYWxsU2VnbWVudHM6IGFueTtcclxuICBASW5wdXQoKSBtaW46IGFueTtcclxuICBASW5wdXQoKSBtYXg6IGFueTtcclxuICBASW5wdXQoKSBhbmdsZVNwYW46IG51bWJlcjtcclxuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXI7XHJcbiAgQElucHV0KCkgcmFkaXVzOiBhbnk7XHJcbiAgQElucHV0KCkgdmFsdWVTY2FsZTogYW55O1xyXG4gIEBJbnB1dCgpIHRpY2tGb3JtYXR0aW5nOiBhbnk7XHJcblxyXG4gIHRpY2tzOiBhbnk7XHJcbiAgcm90YXRpb25BbmdsZTogbnVtYmVyO1xyXG4gIHJvdGF0ZTogc3RyaW5nID0gJyc7XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnJvdGF0aW9uQW5nbGUgPSAtOTAgKyB0aGlzLnN0YXJ0QW5nbGU7XHJcbiAgICB0aGlzLnJvdGF0ZSA9IGByb3RhdGUoJHt0aGlzLnJvdGF0aW9uQW5nbGV9KWA7XHJcbiAgICB0aGlzLnRpY2tzID0gdGhpcy5nZXRUaWNrcygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGlja3MoKTogYW55IHtcclxuICAgIGNvbnN0IGJpZ1RpY2tTZWdtZW50ID0gdGhpcy5hbmdsZVNwYW4gLyB0aGlzLmJpZ1NlZ21lbnRzO1xyXG4gICAgY29uc3Qgc21hbGxUaWNrU2VnbWVudCA9IGJpZ1RpY2tTZWdtZW50IC8gdGhpcy5zbWFsbFNlZ21lbnRzO1xyXG4gICAgY29uc3QgdGlja0xlbmd0aCA9IDIwO1xyXG4gICAgY29uc3QgdGlja3MgPSB7XHJcbiAgICAgIGJpZzogW10sXHJcbiAgICAgIHNtYWxsOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzdGFydERpc3RhbmNlID0gdGhpcy5yYWRpdXMgKyAxMDtcclxuICAgIGNvbnN0IHRleHREaXN0ID0gc3RhcnREaXN0YW5jZSArIHRpY2tMZW5ndGggKyAxMDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmJpZ1NlZ21lbnRzOyBpKyspIHtcclxuICAgICAgY29uc3QgYW5nbGVEZWcgPSBpICogYmlnVGlja1NlZ21lbnQ7XHJcbiAgICAgIGNvbnN0IGFuZ2xlID0gKGFuZ2xlRGVnICogTWF0aC5QSSkgLyAxODA7XHJcblxyXG4gICAgICBjb25zdCB0ZXh0QW5jaG9yID0gdGhpcy5nZXRUZXh0QW5jaG9yKGFuZ2xlRGVnKTtcclxuXHJcbiAgICAgIGxldCBza2lwID0gZmFsc2U7XHJcbiAgICAgIGlmIChpID09PSAwICYmIHRoaXMuYW5nbGVTcGFuID09PSAzNjApIHtcclxuICAgICAgICBza2lwID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFza2lwKSB7XHJcbiAgICAgICAgbGV0IHRleHQgPSBOdW1iZXIucGFyc2VGbG9hdCh0aGlzLnZhbHVlU2NhbGUuaW52ZXJ0KGFuZ2xlRGVnKS50b1N0cmluZygpKS50b0xvY2FsZVN0cmluZygpO1xyXG4gICAgICAgIGlmICh0aGlzLnRpY2tGb3JtYXR0aW5nKSB7XHJcbiAgICAgICAgICB0ZXh0ID0gdGhpcy50aWNrRm9ybWF0dGluZyh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGlja3MuYmlnLnB1c2goe1xyXG4gICAgICAgICAgbGluZTogdGhpcy5nZXRUaWNrUGF0aChzdGFydERpc3RhbmNlLCB0aWNrTGVuZ3RoLCBhbmdsZSksXHJcbiAgICAgICAgICB0ZXh0QW5jaG9yLFxyXG4gICAgICAgICAgdGV4dCxcclxuICAgICAgICAgIHRleHRUcmFuc2Zvcm06IGBcclxuICAgICAgICAgICAgdHJhbnNsYXRlKCR7dGV4dERpc3QgKiBNYXRoLmNvcyhhbmdsZSl9LCAke3RleHREaXN0ICogTWF0aC5zaW4oYW5nbGUpfSkgcm90YXRlKCR7LXRoaXMucm90YXRpb25BbmdsZX0pXHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpID09PSB0aGlzLmJpZ1NlZ21lbnRzKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHRoaXMuc21hbGxTZWdtZW50czsgaisrKSB7XHJcbiAgICAgICAgY29uc3Qgc21hbGxBbmdsZURlZyA9IGFuZ2xlRGVnICsgaiAqIHNtYWxsVGlja1NlZ21lbnQ7XHJcbiAgICAgICAgY29uc3Qgc21hbGxBbmdsZSA9IChzbWFsbEFuZ2xlRGVnICogTWF0aC5QSSkgLyAxODA7XHJcblxyXG4gICAgICAgIHRpY2tzLnNtYWxsLnB1c2goe1xyXG4gICAgICAgICAgbGluZTogdGhpcy5nZXRUaWNrUGF0aChzdGFydERpc3RhbmNlLCB0aWNrTGVuZ3RoIC8gMiwgc21hbGxBbmdsZSlcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aWNrcztcclxuICB9XHJcblxyXG4gIGdldFRleHRBbmNob3IoYW5nbGUpIHtcclxuICAgIC8vIFswLCA0NV0gPSAnbWlkZGxlJztcclxuICAgIC8vIFs0NiwgMTM1XSA9ICdzdGFydCc7XHJcbiAgICAvLyBbMTM2LCAyMjVdID0gJ21pZGRsZSc7XHJcbiAgICAvLyBbMjI2LCAzMTVdID0gJ2VuZCc7XHJcblxyXG4gICAgYW5nbGUgPSAodGhpcy5zdGFydEFuZ2xlICsgYW5nbGUpICUgMzYwO1xyXG4gICAgbGV0IHRleHRBbmNob3IgPSAnbWlkZGxlJztcclxuICAgIGlmIChhbmdsZSA+IDQ1ICYmIGFuZ2xlIDw9IDEzNSkge1xyXG4gICAgICB0ZXh0QW5jaG9yID0gJ3N0YXJ0JztcclxuICAgIH0gZWxzZSBpZiAoYW5nbGUgPiAyMjUgJiYgYW5nbGUgPD0gMzE1KSB7XHJcbiAgICAgIHRleHRBbmNob3IgPSAnZW5kJztcclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0QW5jaG9yO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGlja1BhdGgoc3RhcnREaXN0YW5jZSwgdGlja0xlbmd0aCwgYW5nbGUpOiBhbnkge1xyXG4gICAgY29uc3QgeTEgPSBzdGFydERpc3RhbmNlICogTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgY29uc3QgeTIgPSAoc3RhcnREaXN0YW5jZSArIHRpY2tMZW5ndGgpICogTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgY29uc3QgeDEgPSBzdGFydERpc3RhbmNlICogTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgY29uc3QgeDIgPSAoc3RhcnREaXN0YW5jZSArIHRpY2tMZW5ndGgpICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cclxuICAgIGNvbnN0IHBvaW50cyA9IFtcclxuICAgICAgeyB4OiB4MSwgeTogeTEgfSxcclxuICAgICAgeyB4OiB4MiwgeTogeTIgfVxyXG4gICAgXTtcclxuICAgIGNvbnN0IGxpbmVHZW5lcmF0b3IgPSBsaW5lPGFueT4oKVxyXG4gICAgICAueChkID0+IGQueClcclxuICAgICAgLnkoZCA9PiBkLnkpO1xyXG4gICAgcmV0dXJuIGxpbmVHZW5lcmF0b3IocG9pbnRzKTtcclxuICB9XHJcbn1cclxuIl19