import { NgModule } from '@angular/core';
import { ChartCommonModule } from '../common/chart-common.module';
import { AdvancedPieChartComponent } from './advanced-pie-chart.component';
import { PieLabelComponent } from './pie-label.component';
import { PieArcComponent } from './pie-arc.component';
import { PieChartComponent } from './pie-chart.component';
import { PieGridComponent } from './pie-grid.component';
import { PieGridSeriesComponent } from './pie-grid-series.component';
import { PieSeriesComponent } from './pie-series.component';
export class PieChartModule {
}
PieChartModule.decorators = [
    { type: NgModule, args: [{
                imports: [ChartCommonModule],
                declarations: [
                    AdvancedPieChartComponent,
                    PieLabelComponent,
                    PieArcComponent,
                    PieChartComponent,
                    PieGridComponent,
                    PieGridSeriesComponent,
                    PieSeriesComponent
                ],
                exports: [
                    AdvancedPieChartComponent,
                    PieLabelComponent,
                    PieArcComponent,
                    PieChartComponent,
                    PieGridComponent,
                    PieGridSeriesComponent,
                    PieSeriesComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGllLWNoYXJ0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9waWUtY2hhcnQvcGllLWNoYXJ0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQXVCNUQsTUFBTSxPQUFPLGNBQWM7OztZQXJCMUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO2dCQUM1QixZQUFZLEVBQUU7b0JBQ1oseUJBQXlCO29CQUN6QixpQkFBaUI7b0JBQ2pCLGVBQWU7b0JBQ2YsaUJBQWlCO29CQUNqQixnQkFBZ0I7b0JBQ2hCLHNCQUFzQjtvQkFDdEIsa0JBQWtCO2lCQUNuQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AseUJBQXlCO29CQUN6QixpQkFBaUI7b0JBQ2pCLGVBQWU7b0JBQ2YsaUJBQWlCO29CQUNqQixnQkFBZ0I7b0JBQ2hCLHNCQUFzQjtvQkFDdEIsa0JBQWtCO2lCQUNuQjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2hhcnRDb21tb25Nb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY2hhcnQtY29tbW9uLm1vZHVsZSc7XHJcbmltcG9ydCB7IEFkdmFuY2VkUGllQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuL2FkdmFuY2VkLXBpZS1jaGFydC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQaWVMYWJlbENvbXBvbmVudCB9IGZyb20gJy4vcGllLWxhYmVsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBpZUFyY0NvbXBvbmVudCB9IGZyb20gJy4vcGllLWFyYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQaWVDaGFydENvbXBvbmVudCB9IGZyb20gJy4vcGllLWNoYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBpZUdyaWRDb21wb25lbnQgfSBmcm9tICcuL3BpZS1ncmlkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFBpZUdyaWRTZXJpZXNDb21wb25lbnQgfSBmcm9tICcuL3BpZS1ncmlkLXNlcmllcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBQaWVTZXJpZXNDb21wb25lbnQgfSBmcm9tICcuL3BpZS1zZXJpZXMuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NoYXJ0Q29tbW9uTW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEFkdmFuY2VkUGllQ2hhcnRDb21wb25lbnQsXHJcbiAgICBQaWVMYWJlbENvbXBvbmVudCxcclxuICAgIFBpZUFyY0NvbXBvbmVudCxcclxuICAgIFBpZUNoYXJ0Q29tcG9uZW50LFxyXG4gICAgUGllR3JpZENvbXBvbmVudCxcclxuICAgIFBpZUdyaWRTZXJpZXNDb21wb25lbnQsXHJcbiAgICBQaWVTZXJpZXNDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEFkdmFuY2VkUGllQ2hhcnRDb21wb25lbnQsXHJcbiAgICBQaWVMYWJlbENvbXBvbmVudCxcclxuICAgIFBpZUFyY0NvbXBvbmVudCxcclxuICAgIFBpZUNoYXJ0Q29tcG9uZW50LFxyXG4gICAgUGllR3JpZENvbXBvbmVudCxcclxuICAgIFBpZUdyaWRTZXJpZXNDb21wb25lbnQsXHJcbiAgICBQaWVTZXJpZXNDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQaWVDaGFydE1vZHVsZSB7fVxyXG4iXX0=