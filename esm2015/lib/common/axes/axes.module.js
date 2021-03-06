import { NgModule } from '@angular/core';
import { AxisLabelComponent } from './axis-label.component';
import { XAxisComponent } from './x-axis.component';
import { XAxisTicksComponent } from './x-axis-ticks.component';
import { YAxisComponent } from './y-axis.component';
import { YAxisTicksComponent } from './y-axis-ticks.component';
import { CommonModule } from '@angular/common';
export class AxesModule {
}
AxesModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [AxisLabelComponent, XAxisComponent, XAxisTicksComponent, YAxisComponent, YAxisTicksComponent],
                exports: [AxisLabelComponent, XAxisComponent, XAxisTicksComponent, YAxisComponent, YAxisTicksComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhlcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL2F4ZXMvYXhlcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQU8vQyxNQUFNLE9BQU8sVUFBVTs7O1lBTHRCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7Z0JBQzVHLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsbUJBQW1CLENBQUM7YUFDeEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBBeGlzTGFiZWxDb21wb25lbnQgfSBmcm9tICcuL2F4aXMtbGFiZWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgWEF4aXNDb21wb25lbnQgfSBmcm9tICcuL3gtYXhpcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBYQXhpc1RpY2tzQ29tcG9uZW50IH0gZnJvbSAnLi94LWF4aXMtdGlja3MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgWUF4aXNDb21wb25lbnQgfSBmcm9tICcuL3ktYXhpcy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBZQXhpc1RpY2tzQ29tcG9uZW50IH0gZnJvbSAnLi95LWF4aXMtdGlja3MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXHJcbiAgZGVjbGFyYXRpb25zOiBbQXhpc0xhYmVsQ29tcG9uZW50LCBYQXhpc0NvbXBvbmVudCwgWEF4aXNUaWNrc0NvbXBvbmVudCwgWUF4aXNDb21wb25lbnQsIFlBeGlzVGlja3NDb21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IFtBeGlzTGFiZWxDb21wb25lbnQsIFhBeGlzQ29tcG9uZW50LCBYQXhpc1RpY2tzQ29tcG9uZW50LCBZQXhpc0NvbXBvbmVudCwgWUF4aXNUaWNrc0NvbXBvbmVudF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEF4ZXNNb2R1bGUge31cclxuIl19