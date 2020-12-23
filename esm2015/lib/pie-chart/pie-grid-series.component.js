import { Component, Input, Output, EventEmitter, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { pie } from 'd3-shape';
export class PieGridSeriesComponent {
    constructor(element) {
        this.innerRadius = 70;
        this.outerRadius = 80;
        this.animations = true;
        this.select = new EventEmitter();
        this.activate = new EventEmitter();
        this.deactivate = new EventEmitter();
        this.element = element.nativeElement;
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        this.layout = pie()
            .value(d => d.data.value)
            .sort(null);
        this.arcs = this.getArcs();
    }
    getArcs() {
        return this.layout(this.data).map((arc, index) => {
            const label = arc.data.data.name;
            const other = arc.data.data.other;
            if (index === 0) {
                arc.startAngle = 0;
            }
            const color = this.colors(label);
            return {
                data: arc.data.data,
                class: 'arc ' + 'arc' + index,
                fill: color,
                startAngle: other ? 0 : arc.startAngle,
                endAngle: arc.endAngle,
                animate: this.animations && !other,
                pointerEvents: !other
            };
        });
    }
    onClick(data) {
        this.select.emit(this.data[0].data);
    }
    trackBy(index, item) {
        return item.data.name;
    }
    label(arc) {
        return arc.data.name;
    }
    color(arc) {
        return this.colors(this.label(arc));
    }
}
PieGridSeriesComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-pie-grid-series]',
                template: `
    <svg:g class="pie-grid-arcs">
      <svg:g
        ngx-charts-pie-arc
        *ngFor="let arc of arcs; trackBy: trackBy"
        [attr.class]="arc.class"
        [startAngle]="arc.startAngle"
        [endAngle]="arc.endAngle"
        [innerRadius]="innerRadius"
        [outerRadius]="outerRadius"
        [fill]="color(arc)"
        [value]="arc.data.value"
        [data]="arc.data"
        [gradient]="false"
        [pointerEvents]="arc.pointerEvents"
        [animate]="arc.animate"
        (select)="onClick($event)"
        (activate)="activate.emit($event)"
        (deactivate)="deactivate.emit($event)"
      ></svg:g>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PieGridSeriesComponent.ctorParameters = () => [
    { type: ElementRef }
];
PieGridSeriesComponent.propDecorators = {
    colors: [{ type: Input }],
    data: [{ type: Input }],
    innerRadius: [{ type: Input }],
    outerRadius: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }],
    activate: [{ type: Output }],
    deactivate: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWdyaWQtc2VyaWVzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9waWUtY2hhcnQvcGllLWdyaWQtc2VyaWVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFVBQVUsRUFHVix1QkFBdUIsRUFDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQTRCL0IsTUFBTSxPQUFPLHNCQUFzQjtJQWVqQyxZQUFZLE9BQW1CO1FBWnRCLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFMUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFPeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQVk7YUFDMUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDakMsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRWxDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDZixHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUNwQjtZQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakMsT0FBTztnQkFDTCxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO2dCQUNuQixLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssR0FBRyxLQUFLO2dCQUM3QixJQUFJLEVBQUUsS0FBSztnQkFDWCxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVO2dCQUN0QyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7Z0JBQ3RCLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSztnQkFDbEMsYUFBYSxFQUFFLENBQUMsS0FBSzthQUN0QixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTyxDQUFDLElBQUk7UUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUc7UUFDUCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7O1lBN0ZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsK0JBQStCO2dCQUN6QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O1lBaENDLFVBQVU7OztxQkFrQ1QsS0FBSzttQkFDTCxLQUFLOzBCQUNMLEtBQUs7MEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUVMLE1BQU07dUJBQ04sTUFBTTt5QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHBpZSB9IGZyb20gJ2QzLXNoYXBlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLXBpZS1ncmlkLXNlcmllc10nLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8c3ZnOmcgY2xhc3M9XCJwaWUtZ3JpZC1hcmNzXCI+XHJcbiAgICAgIDxzdmc6Z1xyXG4gICAgICAgIG5neC1jaGFydHMtcGllLWFyY1xyXG4gICAgICAgICpuZ0Zvcj1cImxldCBhcmMgb2YgYXJjczsgdHJhY2tCeTogdHJhY2tCeVwiXHJcbiAgICAgICAgW2F0dHIuY2xhc3NdPVwiYXJjLmNsYXNzXCJcclxuICAgICAgICBbc3RhcnRBbmdsZV09XCJhcmMuc3RhcnRBbmdsZVwiXHJcbiAgICAgICAgW2VuZEFuZ2xlXT1cImFyYy5lbmRBbmdsZVwiXHJcbiAgICAgICAgW2lubmVyUmFkaXVzXT1cImlubmVyUmFkaXVzXCJcclxuICAgICAgICBbb3V0ZXJSYWRpdXNdPVwib3V0ZXJSYWRpdXNcIlxyXG4gICAgICAgIFtmaWxsXT1cImNvbG9yKGFyYylcIlxyXG4gICAgICAgIFt2YWx1ZV09XCJhcmMuZGF0YS52YWx1ZVwiXHJcbiAgICAgICAgW2RhdGFdPVwiYXJjLmRhdGFcIlxyXG4gICAgICAgIFtncmFkaWVudF09XCJmYWxzZVwiXHJcbiAgICAgICAgW3BvaW50ZXJFdmVudHNdPVwiYXJjLnBvaW50ZXJFdmVudHNcIlxyXG4gICAgICAgIFthbmltYXRlXT1cImFyYy5hbmltYXRlXCJcclxuICAgICAgICAoc2VsZWN0KT1cIm9uQ2xpY2soJGV2ZW50KVwiXHJcbiAgICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgICAgKGRlYWN0aXZhdGUpPVwiZGVhY3RpdmF0ZS5lbWl0KCRldmVudClcIlxyXG4gICAgICA+PC9zdmc6Zz5cclxuICAgIDwvc3ZnOmc+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGllR3JpZFNlcmllc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgY29sb3JzO1xyXG4gIEBJbnB1dCgpIGRhdGE7XHJcbiAgQElucHV0KCkgaW5uZXJSYWRpdXMgPSA3MDtcclxuICBASW5wdXQoKSBvdXRlclJhZGl1cyA9IDgwO1xyXG4gIEBJbnB1dCgpIGFuaW1hdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZGVhY3RpdmF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgbGF5b3V0OiBhbnk7XHJcbiAgYXJjczogYW55O1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmKSB7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5sYXlvdXQgPSBwaWU8YW55LCBhbnk+KClcclxuICAgICAgLnZhbHVlKGQgPT4gZC5kYXRhLnZhbHVlKVxyXG4gICAgICAuc29ydChudWxsKTtcclxuXHJcbiAgICB0aGlzLmFyY3MgPSB0aGlzLmdldEFyY3MoKTtcclxuICB9XHJcblxyXG4gIGdldEFyY3MoKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5b3V0KHRoaXMuZGF0YSkubWFwKChhcmMsIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGxhYmVsID0gYXJjLmRhdGEuZGF0YS5uYW1lO1xyXG4gICAgICBjb25zdCBvdGhlciA9IGFyYy5kYXRhLmRhdGEub3RoZXI7XHJcblxyXG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICBhcmMuc3RhcnRBbmdsZSA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGNvbG9yID0gdGhpcy5jb2xvcnMobGFiZWwpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhdGE6IGFyYy5kYXRhLmRhdGEsXHJcbiAgICAgICAgY2xhc3M6ICdhcmMgJyArICdhcmMnICsgaW5kZXgsXHJcbiAgICAgICAgZmlsbDogY29sb3IsXHJcbiAgICAgICAgc3RhcnRBbmdsZTogb3RoZXIgPyAwIDogYXJjLnN0YXJ0QW5nbGUsXHJcbiAgICAgICAgZW5kQW5nbGU6IGFyYy5lbmRBbmdsZSxcclxuICAgICAgICBhbmltYXRlOiB0aGlzLmFuaW1hdGlvbnMgJiYgIW90aGVyLFxyXG4gICAgICAgIHBvaW50ZXJFdmVudHM6ICFvdGhlclxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGRhdGEpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0LmVtaXQodGhpcy5kYXRhWzBdLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgdHJhY2tCeShpbmRleCwgaXRlbSk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaXRlbS5kYXRhLm5hbWU7XHJcbiAgfVxyXG5cclxuICBsYWJlbChhcmMpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGFyYy5kYXRhLm5hbWU7XHJcbiAgfVxyXG5cclxuICBjb2xvcihhcmMpOiBhbnkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sb3JzKHRoaXMubGFiZWwoYXJjKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==