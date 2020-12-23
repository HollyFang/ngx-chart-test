import { ElementRef, NgZone, ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VisibilityObserver } from '../utils/visibility-observer';
export class BaseChartComponent {
    constructor(chartElement, zone, cd) {
        this.chartElement = chartElement;
        this.zone = zone;
        this.cd = cd;
        this.scheme = 'cool';
        this.schemeType = 'ordinal';
        this.animations = true;
        this.select = new EventEmitter();
    }
    ngAfterViewInit() {
        this.bindWindowResizeEvent();
        // listen for visibility of the element for hidden by default scenario
        this.visibilityObserver = new VisibilityObserver(this.chartElement, this.zone);
        this.visibilityObserver.visible.subscribe(this.update.bind(this));
    }
    ngOnDestroy() {
        this.unbindEvents();
        if (this.visibilityObserver) {
            this.visibilityObserver.visible.unsubscribe();
            this.visibilityObserver.destroy();
        }
    }
    ngOnChanges(changes) {
        this.update();
    }
    update() {
        if (this.results) {
            this.results = this.cloneData(this.results);
        }
        else {
            this.results = [];
        }
        if (this.view) {
            this.width = this.view[0];
            this.height = this.view[1];
        }
        else {
            const dims = this.getContainerDims();
            if (dims) {
                this.width = dims.width;
                this.height = dims.height;
            }
        }
        // default values if width or height are 0 or undefined
        if (!this.width) {
            this.width = 600;
        }
        if (!this.height) {
            this.height = 400;
        }
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        if (this.cd) {
            this.cd.markForCheck();
        }
    }
    getContainerDims() {
        let width;
        let height;
        const hostElem = this.chartElement.nativeElement;
        if (hostElem.parentNode !== null) {
            // Get the container dimensions
            const dims = hostElem.parentNode.getBoundingClientRect();
            width = dims.width;
            height = dims.height;
        }
        if (width && height) {
            return { width, height };
        }
        return null;
    }
    /**
     * Converts all date objects that appear as name
     * into formatted date strings
     */
    formatDates() {
        for (let i = 0; i < this.results.length; i++) {
            const g = this.results[i];
            g.label = g.name;
            if (g.label instanceof Date) {
                g.label = g.label.toLocaleDateString();
            }
            if (g.series) {
                for (let j = 0; j < g.series.length; j++) {
                    const d = g.series[j];
                    d.label = d.name;
                    if (d.label instanceof Date) {
                        d.label = d.label.toLocaleDateString();
                    }
                }
            }
        }
    }
    unbindEvents() {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }
    bindWindowResizeEvent() {
        const source = observableFromEvent(window, 'resize');
        const subscription = source.pipe(debounceTime(200)).subscribe(e => {
            this.update();
            if (this.cd) {
                this.cd.markForCheck();
            }
        });
        this.resizeSubscription = subscription;
    }
    /**
     * Clones the data into a new object
     *
     * @memberOf BaseChart
     */
    cloneData(data) {
        const results = [];
        for (const item of data) {
            const copy = {
                name: item['name']
            };
            if (item['value'] !== undefined) {
                copy['value'] = item['value'];
            }
            if (item['series'] !== undefined) {
                copy['series'] = [];
                for (const seriesItem of item['series']) {
                    const seriesItemCopy = Object.assign({}, seriesItem);
                    copy['series'].push(seriesItemCopy);
                }
            }
            if (item['extra'] !== undefined) {
                copy['extra'] = JSON.parse(JSON.stringify(item['extra']));
            }
            results.push(copy);
        }
        return results;
    }
}
BaseChartComponent.decorators = [
    { type: Component, args: [{
                selector: 'base-chart',
                template: ` <div></div> `
            },] }
];
BaseChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
BaseChartComponent.propDecorators = {
    results: [{ type: Input }],
    view: [{ type: Input }],
    scheme: [{ type: Input }],
    schemeType: [{ type: Input }],
    customColors: [{ type: Input }],
    animations: [{ type: Input }],
    select: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL2Jhc2UtY2hhcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBS2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsSUFBSSxtQkFBbUIsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFNbEUsTUFBTSxPQUFPLGtCQUFrQjtJQWU3QixZQUFzQixZQUF3QixFQUFZLElBQVksRUFBWSxFQUFxQjtRQUFqRixpQkFBWSxHQUFaLFlBQVksQ0FBWTtRQUFZLFNBQUksR0FBSixJQUFJLENBQVE7UUFBWSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVo5RixXQUFNLEdBQVEsTUFBTSxDQUFDO1FBQ3JCLGVBQVUsR0FBVyxTQUFTLENBQUM7UUFFL0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUxQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQU9vRSxDQUFDO0lBRTNHLGVBQWU7UUFDYixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUU3QixzRUFBc0U7UUFDdEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1B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LGlCQUFpQjs7O3NCQW9CaEIsS0FBSzttQkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7cUJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgRWxlbWVudFJlZixcclxuICBOZ1pvbmUsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgQ29tcG9uZW50LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25DaGFuZ2VzLFxyXG4gIFNpbXBsZUNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IGZyb21FdmVudCBhcyBvYnNlcnZhYmxlRnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgVmlzaWJpbGl0eU9ic2VydmVyIH0gZnJvbSAnLi4vdXRpbHMvdmlzaWJpbGl0eS1vYnNlcnZlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2Jhc2UtY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiBgIDxkaXY+PC9kaXY+IGBcclxufSlcclxuZXhwb3J0IGNsYXNzIEJhc2VDaGFydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICBASW5wdXQoKSByZXN1bHRzOiBhbnk7XHJcbiAgQElucHV0KCkgdmlldzogW251bWJlciwgbnVtYmVyXTtcclxuICBASW5wdXQoKSBzY2hlbWU6IGFueSA9ICdjb29sJztcclxuICBASW5wdXQoKSBzY2hlbWVUeXBlOiBzdHJpbmcgPSAnb3JkaW5hbCc7XHJcbiAgQElucHV0KCkgY3VzdG9tQ29sb3JzOiBhbnk7XHJcbiAgQElucHV0KCkgYW5pbWF0aW9uczogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHdpZHRoOiBudW1iZXI7XHJcbiAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgcmVzaXplU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgdmlzaWJpbGl0eU9ic2VydmVyOiBWaXNpYmlsaXR5T2JzZXJ2ZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjaGFydEVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuYmluZFdpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcblxyXG4gICAgLy8gbGlzdGVuIGZvciB2aXNpYmlsaXR5IG9mIHRoZSBlbGVtZW50IGZvciBoaWRkZW4gYnkgZGVmYXVsdCBzY2VuYXJpb1xyXG4gICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIgPSBuZXcgVmlzaWJpbGl0eU9ic2VydmVyKHRoaXMuY2hhcnRFbGVtZW50LCB0aGlzLnpvbmUpO1xyXG4gICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudmlzaWJsZS5zdWJzY3JpYmUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIpIHtcclxuICAgICAgdGhpcy52aXNpYmlsaXR5T2JzZXJ2ZXIudmlzaWJsZS51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLnZpc2liaWxpdHlPYnNlcnZlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucmVzdWx0cykge1xyXG4gICAgICB0aGlzLnJlc3VsdHMgPSB0aGlzLmNsb25lRGF0YSh0aGlzLnJlc3VsdHMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5yZXN1bHRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlldykge1xyXG4gICAgICB0aGlzLndpZHRoID0gdGhpcy52aWV3WzBdO1xyXG4gICAgICB0aGlzLmhlaWdodCA9IHRoaXMudmlld1sxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGRpbXMgPSB0aGlzLmdldENvbnRhaW5lckRpbXMoKTtcclxuICAgICAgaWYgKGRpbXMpIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gZGltcy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGRpbXMuaGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGVmYXVsdCB2YWx1ZXMgaWYgd2lkdGggb3IgaGVpZ2h0IGFyZSAwIG9yIHVuZGVmaW5lZFxyXG4gICAgaWYgKCF0aGlzLndpZHRoKSB7XHJcbiAgICAgIHRoaXMud2lkdGggPSA2MDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmhlaWdodCkge1xyXG4gICAgICB0aGlzLmhlaWdodCA9IDQwMDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLndpZHRoID0gTWF0aC5mbG9vcih0aGlzLndpZHRoKTtcclxuICAgIHRoaXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLmhlaWdodCk7XHJcblxyXG4gICAgaWYgKHRoaXMuY2QpIHtcclxuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENvbnRhaW5lckRpbXMoKTogYW55IHtcclxuICAgIGxldCB3aWR0aDtcclxuICAgIGxldCBoZWlnaHQ7XHJcbiAgICBjb25zdCBob3N0RWxlbSA9IHRoaXMuY2hhcnRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKGhvc3RFbGVtLnBhcmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgICAgLy8gR2V0IHRoZSBjb250YWluZXIgZGltZW5zaW9uc1xyXG4gICAgICBjb25zdCBkaW1zID0gaG9zdEVsZW0ucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgd2lkdGggPSBkaW1zLndpZHRoO1xyXG4gICAgICBoZWlnaHQgPSBkaW1zLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2lkdGggJiYgaGVpZ2h0KSB7XHJcbiAgICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIGFsbCBkYXRlIG9iamVjdHMgdGhhdCBhcHBlYXIgYXMgbmFtZVxyXG4gICAqIGludG8gZm9ybWF0dGVkIGRhdGUgc3RyaW5nc1xyXG4gICAqL1xyXG4gIGZvcm1hdERhdGVzKCk6IHZvaWQge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgZyA9IHRoaXMucmVzdWx0c1tpXTtcclxuICAgICAgZy5sYWJlbCA9IGcubmFtZTtcclxuICAgICAgaWYgKGcubGFiZWwgaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZy5sYWJlbCA9IGcubGFiZWwudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChnLnNlcmllcykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZy5zZXJpZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIGNvbnN0IGQgPSBnLnNlcmllc1tqXTtcclxuICAgICAgICAgIGQubGFiZWwgPSBkLm5hbWU7XHJcbiAgICAgICAgICBpZiAoZC5sYWJlbCBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICAgICAgZC5sYWJlbCA9IGQubGFiZWwudG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgdW5iaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucmVzaXplU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGJpbmRXaW5kb3dSZXNpemVFdmVudCgpOiB2b2lkIHtcclxuICAgIGNvbnN0IHNvdXJjZSA9IG9ic2VydmFibGVGcm9tRXZlbnQod2luZG93LCAncmVzaXplJyk7XHJcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2UucGlwZShkZWJvdW5jZVRpbWUoMjAwKSkuc3Vic2NyaWJlKGUgPT4ge1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICBpZiAodGhpcy5jZCkge1xyXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZXNpemVTdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbG9uZXMgdGhlIGRhdGEgaW50byBhIG5ldyBvYmplY3RcclxuICAgKlxyXG4gICAqIEBtZW1iZXJPZiBCYXNlQ2hhcnRcclxuICAgKi9cclxuICBwcml2YXRlIGNsb25lRGF0YShkYXRhKTogYW55IHtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZGF0YSkge1xyXG4gICAgICBjb25zdCBjb3B5ID0ge1xyXG4gICAgICAgIG5hbWU6IGl0ZW1bJ25hbWUnXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKGl0ZW1bJ3ZhbHVlJ10gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvcHlbJ3ZhbHVlJ10gPSBpdGVtWyd2YWx1ZSddO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbVsnc2VyaWVzJ10gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvcHlbJ3NlcmllcyddID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBzZXJpZXNJdGVtIG9mIGl0ZW1bJ3NlcmllcyddKSB7XHJcbiAgICAgICAgICBjb25zdCBzZXJpZXNJdGVtQ29weSA9IE9iamVjdC5hc3NpZ24oe30sIHNlcmllc0l0ZW0pO1xyXG4gICAgICAgICAgY29weVsnc2VyaWVzJ10ucHVzaChzZXJpZXNJdGVtQ29weSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbVsnZXh0cmEnXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29weVsnZXh0cmEnXSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbVsnZXh0cmEnXSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHRzLnB1c2goY29weSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfVxyXG59XHJcbiJdfQ==