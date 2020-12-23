import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { interpolate } from 'd3-interpolate';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import { id } from '../utils/id';
export class PieArcComponent {
    constructor(element) {
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.cornerRadius = 0;
        this.explodeSlices = false;
        this.gradient = false;
        this.animate = true;
        this.pointerEvents = true;
        this.isActive = false;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.dblclick = new EventEmitter();
        this.initialized = false;
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
    }
    getGradient() {
        return this.gradient ? this.gradientFill : this.fill;
    }
    getPointerEvents() {
        return this.pointerEvents ? 'auto' : 'none';
    }
    update() {
        const calc = this.calculateArc();
        this.startOpacity = 0.5;
        this.radialGradientId = 'linearGrad' + id().toString();
        this.gradientFill = `url(#${this.radialGradientId})`;
        if (this.animate) {
            if (this.initialized) {
                this.updateAnimation();
            }
            else {
                this.loadAnimation();
                this.initialized = true;
            }
        }
        else {
            this.path = calc.startAngle(this.startAngle).endAngle(this.endAngle)();
        }
    }
    calculateArc() {
        let outerRadius = this.outerRadius;
        if (this.explodeSlices && this.innerRadius === 0) {
            outerRadius = (this.outerRadius * this.value) / this.max;
        }
        return arc().innerRadius(this.innerRadius).outerRadius(outerRadius).cornerRadius(this.cornerRadius);
    }
    loadAnimation() {
        const node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        const calc = this.calculateArc();
        node
            .transition()
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const copyOfD = Object.assign({}, d);
            copyOfD.endAngle = copyOfD.startAngle;
            const interpolater = interpolate(copyOfD, copyOfD);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        })
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    }
    updateAnimation() {
        const node = select(this.element)
            .selectAll('.arc')
            .data([{ startAngle: this.startAngle, endAngle: this.endAngle }]);
        const calc = this.calculateArc();
        node
            .transition()
            .duration(750)
            .attrTween('d', function (d) {
            this._current = this._current || d;
            const interpolater = interpolate(this._current, d);
            this._current = interpolater(0);
            return function (t) {
                return calc(interpolater(t));
            };
        });
    }
    onClick() {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this.select.emit(this.data), 200);
    }
    onDblClick(event) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(this._timeout);
        this.dblclick.emit({
            data: this.data,
            nativeEvent: event
        });
    }
}
PieArcComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-pie-arc]',
                template: `
    <svg:g class="arc-group">
      <svg:defs *ngIf="gradient">
        <svg:g
          ngx-charts-svg-radial-gradient
          [color]="fill"
          orientation="vertical"
          [name]="radialGradientId"
          [startOpacity]="startOpacity"
        />
      </svg:defs>
      <svg:path
        [attr.d]="path"
        class="arc"
        [class.active]="isActive"
        [attr.fill]="getGradient()"
        (click)="onClick()"
        (dblclick)="onDblClick($event)"
        (mouseenter)="activate.emit(data)"
        (mouseleave)="deactivate.emit(data)"
        [style.pointer-events]="getPointerEvents()"
      />
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PieArcComponent.ctorParameters = () => [
    { type: ElementRef }
];
PieArcComponent.propDecorators = {
    fill: [{ type: Input }],
    startAngle: [{ type: Input }],
    endAngle: [{ type: Input }],
    innerRadius: [{ type: Input }],
    outerRadius: [{ type: Input }],
    cornerRadius: [{ type: Input }],
    value: [{ type: Input }],
    max: [{ type: Input }],
    data: [{ type: Input }],
    explodeSlices: [{ type: Input }],
    gradient: [{ type: Input }],
    animate: [{ type: Input }],
    pointerEvents: [{ type: Input }],
    isActive: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }],
    dblclick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWFyYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvcGllLWNoYXJ0L3BpZS1hcmMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUdWLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRS9CLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFnQ2pDLE1BQU0sT0FBTyxlQUFlO0lBOEIxQixZQUFZLE9BQW1CO1FBNUJ0QixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGFBQVEsR0FBVyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUcvQixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUl6QixrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUMvQixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLFlBQU8sR0FBWSxJQUFJLENBQUM7UUFDeEIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFDOUIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUV6QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVF4QyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUkzQixJQUFJLENBQUMs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IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSB9IGZyb20gJ2QzLWludGVycG9sYXRlJztcclxuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMtc2VsZWN0aW9uJztcclxuaW1wb3J0IHsgYXJjIH0gZnJvbSAnZDMtc2hhcGUnO1xyXG5cclxuaW1wb3J0IHsgaWQgfSBmcm9tICcuLi91dGlscy9pZCc7XHJcbi8qIHRzbGludDpkaXNhYmxlICovXHJcbmltcG9ydCB7IE1vdXNlRXZlbnQgfSBmcm9tICcuLi9ldmVudHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdnW25neC1jaGFydHMtcGllLWFyY10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgY2xhc3M9XCJhcmMtZ3JvdXBcIj5cclxuICAgICAgPHN2ZzpkZWZzICpuZ0lmPVwiZ3JhZGllbnRcIj5cclxuICAgICAgICA8c3ZnOmdcclxuICAgICAgICAgIG5neC1jaGFydHMtc3ZnLXJhZGlhbC1ncmFkaWVudFxyXG4gICAgICAgICAgW2NvbG9yXT1cImZpbGxcIlxyXG4gICAgICAgICAgb3JpZW50YXRpb249XCJ2ZXJ0aWNhbFwiXHJcbiAgICAgICAgICBbbmFtZV09XCJyYWRpYWxHcmFkaWVudElkXCJcclxuICAgICAgICAgIFtzdGFydE9wYWNpdHldPVwic3RhcnRPcGFjaXR5XCJcclxuICAgICAgICAvPlxyXG4gICAgICA8L3N2ZzpkZWZzPlxyXG4gICAgICA8c3ZnOnBhdGhcclxuICAgICAgICBbYXR0ci5kXT1cInBhdGhcIlxyXG4gICAgICAgIGNsYXNzPVwiYXJjXCJcclxuICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImlzQWN0aXZlXCJcclxuICAgICAgICBbYXR0ci5maWxsXT1cImdldEdyYWRpZW50KClcIlxyXG4gICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIlxyXG4gICAgICAgIChkYmxjbGljayk9XCJvbkRibENsaWNrKCRldmVudClcIlxyXG4gICAgICAgIChtb3VzZWVudGVyKT1cImFjdGl2YXRlLmVtaXQoZGF0YSlcIlxyXG4gICAgICAgIChtb3VzZWxlYXZlKT1cImRlYWN0aXZhdGUuZW1pdChkYXRhKVwiXHJcbiAgICAgICAgW3N0eWxlLnBvaW50ZXItZXZlbnRzXT1cImdldFBvaW50ZXJFdmVudHMoKVwiXHJcbiAgICAgIC8+XHJcbiAgICA8L3N2ZzpnPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFBpZUFyY0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgZmlsbDtcclxuICBASW5wdXQoKSBzdGFydEFuZ2xlOiBudW1iZXIgPSAwO1xyXG4gIEBJbnB1dCgpIGVuZEFuZ2xlOiBudW1iZXIgPSBNYXRoLlBJICogMjtcclxuICBASW5wdXQoKSBpbm5lclJhZGl1cztcclxuICBASW5wdXQoKSBvdXRlclJhZGl1cztcclxuICBASW5wdXQoKSBjb3JuZXJSYWRpdXM6IG51bWJlciA9IDA7XHJcbiAgQElucHV0KCkgdmFsdWU7XHJcbiAgQElucHV0KCkgbWF4O1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgZXhwbG9kZVNsaWNlczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIGdyYWRpZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgQElucHV0KCkgYW5pbWF0ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgcG9pbnRlckV2ZW50czogYm9vbGVhbiA9IHRydWU7XHJcbiAgQElucHV0KCkgaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRlYWN0aXZhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGRibGNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICBwYXRoOiBhbnk7XHJcbiAgc3RhcnRPcGFjaXR5OiBudW1iZXI7XHJcbiAgcmFkaWFsR3JhZGllbnRJZDogc3RyaW5nO1xyXG4gIGxpbmVhckdyYWRpZW50SWQ6IHN0cmluZztcclxuICBncmFkaWVudEZpbGw6IHN0cmluZztcclxuICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgX3RpbWVvdXQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQubmF0aXZlRWxlbWVudDtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgfVxyXG5cclxuICBnZXRHcmFkaWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmdyYWRpZW50ID8gdGhpcy5ncmFkaWVudEZpbGwgOiB0aGlzLmZpbGw7XHJcbiAgfVxyXG5cclxuICBnZXRQb2ludGVyRXZlbnRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucG9pbnRlckV2ZW50cyA/ICdhdXRvJyA6ICdub25lJztcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUFyYygpO1xyXG4gICAgdGhpcy5zdGFydE9wYWNpdHkgPSAwLjU7XHJcbiAgICB0aGlzLnJhZGlhbEdyYWRpZW50SWQgPSAnbGluZWFyR3JhZCcgKyBpZCgpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLmdyYWRpZW50RmlsbCA9IGB1cmwoIyR7dGhpcy5yYWRpYWxHcmFkaWVudElkfSlgO1xyXG5cclxuICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbigpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubG9hZEFuaW1hdGlvbigpO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBhdGggPSBjYWxjLnN0YXJ0QW5nbGUodGhpcy5zdGFydEFuZ2xlKS5lbmRBbmdsZSh0aGlzLmVuZEFuZ2xlKSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlQXJjKCk6IGFueSB7XHJcbiAgICBsZXQgb3V0ZXJSYWRpdXMgPSB0aGlzLm91dGVyUmFkaXVzO1xyXG4gICAgaWYgKHRoaXMuZXhwbG9kZVNsaWNlcyAmJiB0aGlzLmlubmVyUmFkaXVzID09PSAwKSB7XHJcbiAgICAgIG91dGVyUmFkaXVzID0gKHRoaXMub3V0ZXJSYWRpdXMgKiB0aGlzLnZhbHVlKSAvIHRoaXMubWF4O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcmMoKS5pbm5lclJhZGl1cyh0aGlzLmlubmVyUmFkaXVzKS5vdXRlclJhZGl1cyhvdXRlclJhZGl1cykuY29ybmVyUmFkaXVzKHRoaXMuY29ybmVyUmFkaXVzKTtcclxuICB9XHJcblxyXG4gIGxvYWRBbmltYXRpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudClcclxuICAgICAgLnNlbGVjdEFsbCgnLmFyYycpXHJcbiAgICAgIC5kYXRhKFt7IHN0YXJ0QW5nbGU6IHRoaXMuc3RhcnRBbmdsZSwgZW5kQW5nbGU6IHRoaXMuZW5kQW5nbGUgfV0pO1xyXG5cclxuICAgIGNvbnN0IGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUFyYygpO1xyXG5cclxuICAgIG5vZGVcclxuICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAuYXR0clR3ZWVuKCdkJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9ICg8YW55PnRoaXMpLl9jdXJyZW50IHx8IGQ7XHJcbiAgICAgICAgY29uc3QgY29weU9mRCA9IE9iamVjdC5hc3NpZ24oe30sIGQpO1xyXG4gICAgICAgIGNvcHlPZkQuZW5kQW5nbGUgPSBjb3B5T2ZELnN0YXJ0QW5nbGU7XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoY29weU9mRCwgY29weU9mRCk7XHJcbiAgICAgICAgKDxhbnk+dGhpcykuX2N1cnJlbnQgPSBpbnRlcnBvbGF0ZXIoMCk7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICByZXR1cm4gY2FsYyhpbnRlcnBvbGF0ZXIodCkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pXHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgLmR1cmF0aW9uKDc1MClcclxuICAgICAgLmF0dHJUd2VlbignZCcsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgKDxhbnk+dGhpcykuX2N1cnJlbnQgPSAoPGFueT50aGlzKS5fY3VycmVudCB8fCBkO1xyXG4gICAgICAgIGNvbnN0IGludGVycG9sYXRlciA9IGludGVycG9sYXRlKCg8YW55PnRoaXMpLl9jdXJyZW50LCBkKTtcclxuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9IGludGVycG9sYXRlcigwKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgIHJldHVybiBjYWxjKGludGVycG9sYXRlcih0KSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVBbmltYXRpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCBub2RlID0gc2VsZWN0KHRoaXMuZWxlbWVudClcclxuICAgICAgLnNlbGVjdEFsbCgnLmFyYycpXHJcbiAgICAgIC5kYXRhKFt7IHN0YXJ0QW5nbGU6IHRoaXMuc3RhcnRBbmdsZSwgZW5kQW5nbGU6IHRoaXMuZW5kQW5nbGUgfV0pO1xyXG5cclxuICAgIGNvbnN0IGNhbGMgPSB0aGlzLmNhbGN1bGF0ZUFyYygpO1xyXG5cclxuICAgIG5vZGVcclxuICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAuZHVyYXRpb24oNzUwKVxyXG4gICAgICAuYXR0clR3ZWVuKCdkJywgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAoPGFueT50aGlzKS5fY3VycmVudCA9ICg8YW55PnRoaXMpLl9jdXJyZW50IHx8IGQ7XHJcbiAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVyID0gaW50ZXJwb2xhdGUoKDxhbnk+dGhpcykuX2N1cnJlbnQsIGQpO1xyXG4gICAgICAgICg8YW55PnRoaXMpLl9jdXJyZW50ID0gaW50ZXJwb2xhdGVyKDApO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNhbGMoaW50ZXJwb2xhdGVyKHQpKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKTogdm9pZCB7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCk7XHJcbiAgICB0aGlzLl90aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbGVjdC5lbWl0KHRoaXMuZGF0YSksIDIwMCk7XHJcbiAgfVxyXG5cclxuICBvbkRibENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dCk7XHJcblxyXG4gICAgdGhpcy5kYmxjbGljay5lbWl0KHtcclxuICAgICAgZGF0YTogdGhpcy5kYXRhLFxyXG4gICAgICBuYXRpdmVFdmVudDogZXZlbnRcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=