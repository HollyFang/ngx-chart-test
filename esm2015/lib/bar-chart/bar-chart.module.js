import { NgModule } from '@angular/core';
import { ChartCommonModule } from '../common/chart-common.module';
import { BarComponent } from './bar.component';
import { BarHorizontalComponent } from './bar-horizontal.component';
import { BarHorizontal2DComponent } from './bar-horizontal-2d.component';
import { BarHorizontalNormalizedComponent } from './bar-horizontal-normalized.component';
import { BarHorizontalStackedComponent } from './bar-horizontal-stacked.component';
import { BarVerticalComponent } from './bar-vertical.component';
import { BarVertical2DComponent } from './bar-vertical-2d.component';
import { BarVerticalNormalizedComponent } from './bar-vertical-normalized.component';
import { BarVerticalStackedComponent } from './bar-vertical-stacked.component';
import { SeriesHorizontal } from './series-horizontal.component';
import { SeriesVerticalComponent } from './series-vertical.component';
import { BarLabelComponent } from './bar-label.component';
export class BarChartModule {
}
BarChartModule.decorators = [
    { type: NgModule, args: [{
                imports: [ChartCommonModule],
                declarations: [
                    BarComponent,
                    BarHorizontalComponent,
                    BarHorizontal2DComponent,
                    BarHorizontalNormalizedComponent,
                    BarHorizontalStackedComponent,
                    BarVerticalComponent,
                    BarVertical2DComponent,
                    BarVerticalNormalizedComponent,
                    BarVerticalStackedComponent,
                    BarLabelComponent,
                    SeriesHorizontal,
                    SeriesVerticalComponent
                ],
                exports: [
                    BarComponent,
                    BarHorizontalComponent,
                    BarHorizontal2DComponent,
                    BarHorizontalNormalizedComponent,
                    BarHorizontalStackedComponent,
                    BarVerticalComponent,
                    BarVertical2DComponent,
                    BarVerticalNormalizedComponent,
                    BarVerticalStackedComponent,
                    BarLabelComponent,
                    SeriesHorizontal,
                    SeriesVerticalComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLWNoYXJ0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9iYXItY2hhcnQvYmFyLWNoYXJ0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNuRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRSxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQWlDMUQsTUFBTSxPQUFPLGNBQWM7OztZQS9CMUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDO2dCQUM1QixZQUFZLEVBQUU7b0JBQ1osWUFBWTtvQkFDWixzQkFBc0I7b0JBQ3RCLHdCQUF3QjtvQkFDeEIsZ0NBQWdDO29CQUNoQyw2QkFBNkI7b0JBQzdCLG9CQUFvQjtvQkFDcEIsc0JBQXNCO29CQUN0Qiw4QkFBOEI7b0JBQzlCLDJCQUEyQjtvQkFDM0IsaUJBQWlCO29CQUNqQixnQkFBZ0I7b0JBQ2hCLHVCQUF1QjtpQkFDeEI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osc0JBQXNCO29CQUN0Qix3QkFBd0I7b0JBQ3hCLGdDQUFnQztvQkFDaEMsNkJBQTZCO29CQUM3QixvQkFBb0I7b0JBQ3BCLHNCQUFzQjtvQkFDdEIsOEJBQThCO29CQUM5QiwyQkFBMkI7b0JBQzNCLGlCQUFpQjtvQkFDakIsZ0JBQWdCO29CQUNoQix1QkFBdUI7aUJBQ3hCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDaGFydENvbW1vbk1vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jaGFydC1jb21tb24ubW9kdWxlJztcclxuaW1wb3J0IHsgQmFyQ29tcG9uZW50IH0gZnJvbSAnLi9iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQmFySG9yaXpvbnRhbENvbXBvbmVudCB9IGZyb20gJy4vYmFyLWhvcml6b250YWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQmFySG9yaXpvbnRhbDJEQ29tcG9uZW50IH0gZnJvbSAnLi9iYXItaG9yaXpvbnRhbC0yZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCYXJIb3Jpem9udGFsTm9ybWFsaXplZENvbXBvbmVudCB9IGZyb20gJy4vYmFyLWhvcml6b250YWwtbm9ybWFsaXplZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCYXJIb3Jpem9udGFsU3RhY2tlZENvbXBvbmVudCB9IGZyb20gJy4vYmFyLWhvcml6b250YWwtc3RhY2tlZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCYXJWZXJ0aWNhbENvbXBvbmVudCB9IGZyb20gJy4vYmFyLXZlcnRpY2FsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJhclZlcnRpY2FsMkRDb21wb25lbnQgfSBmcm9tICcuL2Jhci12ZXJ0aWNhbC0yZC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCYXJWZXJ0aWNhbE5vcm1hbGl6ZWRDb21wb25lbnQgfSBmcm9tICcuL2Jhci12ZXJ0aWNhbC1ub3JtYWxpemVkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEJhclZlcnRpY2FsU3RhY2tlZENvbXBvbmVudCB9IGZyb20gJy4vYmFyLXZlcnRpY2FsLXN0YWNrZWQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2VyaWVzSG9yaXpvbnRhbCB9IGZyb20gJy4vc2VyaWVzLWhvcml6b250YWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2VyaWVzVmVydGljYWxDb21wb25lbnQgfSBmcm9tICcuL3Nlcmllcy12ZXJ0aWNhbC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBCYXJMYWJlbENvbXBvbmVudCB9IGZyb20gJy4vYmFyLWxhYmVsLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtDaGFydENvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBCYXJDb21wb25lbnQsXHJcbiAgICBCYXJIb3Jpem9udGFsQ29tcG9uZW50LFxyXG4gICAgQmFySG9yaXpvbnRhbDJEQ29tcG9uZW50LFxyXG4gICAgQmFySG9yaXpvbnRhbE5vcm1hbGl6ZWRDb21wb25lbnQsXHJcbiAgICBCYXJIb3Jpem9udGFsU3RhY2tlZENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsQ29tcG9uZW50LFxyXG4gICAgQmFyVmVydGljYWwyRENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsTm9ybWFsaXplZENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsU3RhY2tlZENvbXBvbmVudCxcclxuICAgIEJhckxhYmVsQ29tcG9uZW50LFxyXG4gICAgU2VyaWVzSG9yaXpvbnRhbCxcclxuICAgIFNlcmllc1ZlcnRpY2FsQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBCYXJDb21wb25lbnQsXHJcbiAgICBCYXJIb3Jpem9udGFsQ29tcG9uZW50LFxyXG4gICAgQmFySG9yaXpvbnRhbDJEQ29tcG9uZW50LFxyXG4gICAgQmFySG9yaXpvbnRhbE5vcm1hbGl6ZWRDb21wb25lbnQsXHJcbiAgICBCYXJIb3Jpem9udGFsU3RhY2tlZENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsQ29tcG9uZW50LFxyXG4gICAgQmFyVmVydGljYWwyRENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsTm9ybWFsaXplZENvbXBvbmVudCxcclxuICAgIEJhclZlcnRpY2FsU3RhY2tlZENvbXBvbmVudCxcclxuICAgIEJhckxhYmVsQ29tcG9uZW50LFxyXG4gICAgU2VyaWVzSG9yaXpvbnRhbCxcclxuICAgIFNlcmllc1ZlcnRpY2FsQ29tcG9uZW50XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQmFyQ2hhcnRNb2R1bGUge31cclxuIl19