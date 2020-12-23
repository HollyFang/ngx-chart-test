import { NgModule } from '@angular/core';
import { ChartCommonModule } from './common/chart-common.module';
import { AreaChartModule } from './area-chart/area-chart.module';
import { BarChartModule } from './bar-chart/bar-chart.module';
import { BubbleChartModule } from './bubble-chart/bubble-chart.module';
import { HeatMapModule } from './heat-map/heat-map.module';
import { LineChartModule } from './line-chart/line-chart.module';
import { PolarChartModule } from './polar-chart/polar-chart.module';
import { NumberCardModule } from './number-card/number-card.module';
import { PieChartModule } from './pie-chart/pie-chart.module';
import { TreeMapModule } from './tree-map/tree-map.module';
import { GaugeModule } from './gauge/gauge.module';
import { ngxChartsPolyfills } from './polyfills';
export class NgxChartsModule {
    constructor() {
        ngxChartsPolyfills();
    }
}
NgxChartsModule.decorators = [
    { type: NgModule, args: [{
                exports: [
                    ChartCommonModule,
                    AreaChartModule,
                    BarChartModule,
                    BubbleChartModule,
                    HeatMapModule,
                    LineChartModule,
                    PolarChartModule,
                    NumberCardModule,
                    PieChartModule,
                    TreeMapModule,
                    GaugeModule
                ]
            },] }
];
NgxChartsModule.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNoYXJ0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvbmd4LWNoYXJ0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBaUJqRCxNQUFNLE9BQU8sZUFBZTtJQUMxQjtRQUNFLGtCQUFrQixFQUFFLENBQUM7SUFDdkIsQ0FBQzs7O1lBbEJGLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsaUJBQWlCO29CQUNqQixlQUFlO29CQUNmLGNBQWM7b0JBQ2QsaUJBQWlCO29CQUNqQixhQUFhO29CQUNiLGVBQWU7b0JBQ2YsZ0JBQWdCO29CQUNoQixnQkFBZ0I7b0JBQ2hCLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixXQUFXO2lCQUNaO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJy4vY29tbW9uL2NoYXJ0LWNvbW1vbi5tb2R1bGUnO1xyXG5pbXBvcnQgeyBBcmVhQ2hhcnRNb2R1bGUgfSBmcm9tICcuL2FyZWEtY2hhcnQvYXJlYS1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBCYXJDaGFydE1vZHVsZSB9IGZyb20gJy4vYmFyLWNoYXJ0L2Jhci1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBCdWJibGVDaGFydE1vZHVsZSB9IGZyb20gJy4vYnViYmxlLWNoYXJ0L2J1YmJsZS1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBIZWF0TWFwTW9kdWxlIH0gZnJvbSAnLi9oZWF0LW1hcC9oZWF0LW1hcC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBMaW5lQ2hhcnRNb2R1bGUgfSBmcm9tICcuL2xpbmUtY2hhcnQvbGluZS1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBQb2xhckNoYXJ0TW9kdWxlIH0gZnJvbSAnLi9wb2xhci1jaGFydC9wb2xhci1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBOdW1iZXJDYXJkTW9kdWxlIH0gZnJvbSAnLi9udW1iZXItY2FyZC9udW1iZXItY2FyZC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBQaWVDaGFydE1vZHVsZSB9IGZyb20gJy4vcGllLWNoYXJ0L3BpZS1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBUcmVlTWFwTW9kdWxlIH0gZnJvbSAnLi90cmVlLW1hcC90cmVlLW1hcC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBHYXVnZU1vZHVsZSB9IGZyb20gJy4vZ2F1Z2UvZ2F1Z2UubW9kdWxlJztcclxuaW1wb3J0IHsgbmd4Q2hhcnRzUG9seWZpbGxzIH0gZnJvbSAnLi9wb2x5ZmlsbHMnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBleHBvcnRzOiBbXHJcbiAgICBDaGFydENvbW1vbk1vZHVsZSxcclxuICAgIEFyZWFDaGFydE1vZHVsZSxcclxuICAgIEJhckNoYXJ0TW9kdWxlLFxyXG4gICAgQnViYmxlQ2hhcnRNb2R1bGUsXHJcbiAgICBIZWF0TWFwTW9kdWxlLFxyXG4gICAgTGluZUNoYXJ0TW9kdWxlLFxyXG4gICAgUG9sYXJDaGFydE1vZHVsZSxcclxuICAgIE51bWJlckNhcmRNb2R1bGUsXHJcbiAgICBQaWVDaGFydE1vZHVsZSxcclxuICAgIFRyZWVNYXBNb2R1bGUsXHJcbiAgICBHYXVnZU1vZHVsZVxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neENoYXJ0c01vZHVsZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBuZ3hDaGFydHNQb2x5ZmlsbHMoKTtcclxuICB9XHJcbn1cclxuIl19