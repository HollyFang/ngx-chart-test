import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './charts/chart.component';
import { BaseChartComponent } from './base-chart.component';
import { AxesModule } from './axes/axes.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { CircleSeriesComponent } from './circle-series.component';
import { CircleComponent } from './circle.component';
import { GridPanelComponent } from './grid-panel.component';
import { GridPanelSeriesComponent } from './grid-panel-series.component';
import { SvgLinearGradientComponent } from './svg-linear-gradient.component';
import { SvgRadialGradientComponent } from './svg-radial-gradient.component';
import { AreaComponent } from './area.component';
import { CountUpDirective } from './count/count.directive';
import { TooltipArea } from './tooltip-area.component';
import { Timeline } from './timeline/timeline.component';
import { VisibilityObserver } from '../utils/visibility-observer';
import { LegendComponent } from './legend/legend.component';
import { LegendEntryComponent } from './legend/legend-entry.component';
import { ScaleLegendComponent } from './legend/scale-legend.component';
import { AdvancedLegendComponent } from './legend/advanced-legend.component';
const COMPONENTS = [
    AreaComponent,
    BaseChartComponent,
    CountUpDirective,
    TooltipArea,
    ChartComponent,
    LegendComponent,
    LegendEntryComponent,
    ScaleLegendComponent,
    CircleComponent,
    CircleSeriesComponent,
    GridPanelComponent,
    GridPanelSeriesComponent,
    SvgLinearGradientComponent,
    SvgRadialGradientComponent,
    Timeline,
    AdvancedLegendComponent
];
export class ChartCommonModule {
}
ChartCommonModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, AxesModule, TooltipModule],
                declarations: [...COMPONENTS, VisibilityObserver],
                exports: [CommonModule, AxesModule, TooltipModule, ...COMPONENTS, VisibilityObserver]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnQtY29tbW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vY2hhcnQtY29tbW9uLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzNELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRTdFLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxjQUFjO0lBQ2QsZUFBZTtJQUNmLG9CQUFvQjtJQUNwQixvQkFBb0I7SUFDcEIsZUFBZTtJQUNmLHFCQUFxQjtJQUNyQixrQkFBa0I7SUFDbEIsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQiwwQkFBMEI7SUFDMUIsUUFBUTtJQUNSLHVCQUF1QjtDQUN4QixDQUFDO0FBT0YsTUFBTSxPQUFPLGlCQUFpQjs7O1lBTDdCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQztnQkFDbEQsWUFBWSxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsa0JBQWtCLENBQUM7Z0JBQ2pELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLEdBQUcsVUFBVSxFQUFFLGtCQUFrQixDQUFDO2FBQ3RGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IENoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9jaGFydHMvY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQmFzZUNoYXJ0Q29tcG9uZW50IH0gZnJvbSAnLi9iYXNlLWNoYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEF4ZXNNb2R1bGUgfSBmcm9tICcuL2F4ZXMvYXhlcy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBUb29sdGlwTW9kdWxlIH0gZnJvbSAnLi90b29sdGlwL3Rvb2x0aXAubW9kdWxlJztcclxuaW1wb3J0IHsgQ2lyY2xlU2VyaWVzQ29tcG9uZW50IH0gZnJvbSAnLi9jaXJjbGUtc2VyaWVzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENpcmNsZUNvbXBvbmVudCB9IGZyb20gJy4vY2lyY2xlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEdyaWRQYW5lbENvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC1wYW5lbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBHcmlkUGFuZWxTZXJpZXNDb21wb25lbnQgfSBmcm9tICcuL2dyaWQtcGFuZWwtc2VyaWVzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN2Z0xpbmVhckdyYWRpZW50Q29tcG9uZW50IH0gZnJvbSAnLi9zdmctbGluZWFyLWdyYWRpZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFN2Z1JhZGlhbEdyYWRpZW50Q29tcG9uZW50IH0gZnJvbSAnLi9zdmctcmFkaWFsLWdyYWRpZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFyZWFDb21wb25lbnQgfSBmcm9tICcuL2FyZWEuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ291bnRVcERpcmVjdGl2ZSB9IGZyb20gJy4vY291bnQvY291bnQuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgVG9vbHRpcEFyZWEgfSBmcm9tICcuL3Rvb2x0aXAtYXJlYS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUaW1lbGluZSB9IGZyb20gJy4vdGltZWxpbmUvdGltZWxpbmUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVmlzaWJpbGl0eU9ic2VydmVyIH0gZnJvbSAnLi4vdXRpbHMvdmlzaWJpbGl0eS1vYnNlcnZlcic7XHJcbmltcG9ydCB7IExlZ2VuZENvbXBvbmVudCB9IGZyb20gJy4vbGVnZW5kL2xlZ2VuZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMZWdlbmRFbnRyeUNvbXBvbmVudCB9IGZyb20gJy4vbGVnZW5kL2xlZ2VuZC1lbnRyeS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTY2FsZUxlZ2VuZENvbXBvbmVudCB9IGZyb20gJy4vbGVnZW5kL3NjYWxlLWxlZ2VuZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBZHZhbmNlZExlZ2VuZENvbXBvbmVudCB9IGZyb20gJy4vbGVnZW5kL2FkdmFuY2VkLWxlZ2VuZC5jb21wb25lbnQnO1xyXG5cclxuY29uc3QgQ09NUE9ORU5UUyA9IFtcclxuICBBcmVhQ29tcG9uZW50LFxyXG4gIEJhc2VDaGFydENvbXBvbmVudCxcclxuICBDb3VudFVwRGlyZWN0aXZlLFxyXG4gIFRvb2x0aXBBcmVhLFxyXG4gIENoYXJ0Q29tcG9uZW50LFxyXG4gIExlZ2VuZENvbXBvbmVudCxcclxuICBMZWdlbmRFbnRyeUNvbXBvbmVudCxcclxuICBTY2FsZUxlZ2VuZENvbXBvbmVudCxcclxuICBDaXJjbGVDb21wb25lbnQsXHJcbiAgQ2lyY2xlU2VyaWVzQ29tcG9uZW50LFxyXG4gIEdyaWRQYW5lbENvbXBvbmVudCxcclxuICBHcmlkUGFuZWxTZXJpZXNDb21wb25lbnQsXHJcbiAgU3ZnTGluZWFyR3JhZGllbnRDb21wb25lbnQsXHJcbiAgU3ZnUmFkaWFsR3JhZGllbnRDb21wb25lbnQsXHJcbiAgVGltZWxpbmUsXHJcbiAgQWR2YW5jZWRMZWdlbmRDb21wb25lbnRcclxuXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQXhlc01vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbLi4uQ09NUE9ORU5UUywgVmlzaWJpbGl0eU9ic2VydmVyXSxcclxuICBleHBvcnRzOiBbQ29tbW9uTW9kdWxlLCBBeGVzTW9kdWxlLCBUb29sdGlwTW9kdWxlLCAuLi5DT01QT05FTlRTLCBWaXNpYmlsaXR5T2JzZXJ2ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDaGFydENvbW1vbk1vZHVsZSB7fVxyXG4iXX0=