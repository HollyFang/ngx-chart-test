import { NgModule } from '@angular/core';
import { ChartCommonModule } from '../common/chart-common.module';
import { LinearGaugeComponent } from './linear-gauge.component';
import { GaugeComponent } from './gauge.component';
import { GaugeArcComponent } from './gauge-arc.component';
import { GaugeAxisComponent } from './gauge-axis.component';
import { PieChartModule } from '../pie-chart/pie-chart.module';
import { BarChartModule } from '../bar-chart/bar-chart.module';
export class GaugeModule {
}
GaugeModule.decorators = [
    { type: NgModule, args: [{
                imports: [ChartCommonModule, PieChartModule, BarChartModule],
                declarations: [LinearGaugeComponent, GaugeComponent, GaugeArcComponent, GaugeAxisComponent],
                exports: [LinearGaugeComponent, GaugeComponent, GaugeArcComponent, GaugeAxisComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F1Z2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2dhdWdlL2dhdWdlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBTy9ELE1BQU0sT0FBTyxXQUFXOzs7WUFMdkIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUM7Z0JBQzVELFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsQ0FBQztnQkFDM0YsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDO2FBQ3ZGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2hhcnRDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY2hhcnQtY29tbW9uLm1vZHVsZSc7XHJcbmltcG9ydCB7IExpbmVhckdhdWdlQ29tcG9uZW50IH0gZnJvbSAnLi9saW5lYXItZ2F1Z2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR2F1Z2VDb21wb25lbnQgfSBmcm9tICcuL2dhdWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEdhdWdlQXJjQ29tcG9uZW50IH0gZnJvbSAnLi9nYXVnZS1hcmMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR2F1Z2VBeGlzQ29tcG9uZW50IH0gZnJvbSAnLi9nYXVnZS1heGlzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBpZUNoYXJ0TW9kdWxlIH0gZnJvbSAnLi4vcGllLWNoYXJ0L3BpZS1jaGFydC5tb2R1bGUnO1xyXG5pbXBvcnQgeyBCYXJDaGFydE1vZHVsZSB9IGZyb20gJy4uL2Jhci1jaGFydC9iYXItY2hhcnQubW9kdWxlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NoYXJ0Q29tbW9uTW9kdWxlLCBQaWVDaGFydE1vZHVsZSwgQmFyQ2hhcnRNb2R1bGVdLFxyXG4gIGRlY2xhcmF0aW9uczogW0xpbmVhckdhdWdlQ29tcG9uZW50LCBHYXVnZUNvbXBvbmVudCwgR2F1Z2VBcmNDb21wb25lbnQsIEdhdWdlQXhpc0NvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogW0xpbmVhckdhdWdlQ29tcG9uZW50LCBHYXVnZUNvbXBvbmVudCwgR2F1Z2VBcmNDb21wb25lbnQsIEdhdWdlQXhpc0NvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEdhdWdlTW9kdWxlIHt9XHJcbiJdfQ==