import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
export class GridPanelComponent {
}
GridPanelComponent.decorators = [
    { type: Component, args: [{
                selector: 'g[ngx-charts-grid-panel]',
                template: `
    <svg:rect [attr.height]="height" [attr.width]="width" [attr.x]="x" [attr.y]="y" stroke="none" class="gridpanel" />
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
GridPanelComponent.propDecorators = {
    path: [{ type: Input }],
    width: [{ type: Input }],
    height: [{ type: Input }],
    x: [{ type: Input }],
    y: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1wYW5lbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL2dyaWQtcGFuZWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUzFFLE1BQU0sT0FBTyxrQkFBa0I7OztZQVA5QixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsUUFBUSxFQUFFOztHQUVUO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7bUJBRUUsS0FBSztvQkFDTCxLQUFLO3FCQUNMLEtBQUs7Z0JBQ0wsS0FBSztnQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZ1tuZ3gtY2hhcnRzLWdyaWQtcGFuZWxdJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHN2ZzpyZWN0IFthdHRyLmhlaWdodF09XCJoZWlnaHRcIiBbYXR0ci53aWR0aF09XCJ3aWR0aFwiIFthdHRyLnhdPVwieFwiIFthdHRyLnldPVwieVwiIHN0cm9rZT1cIm5vbmVcIiBjbGFzcz1cImdyaWRwYW5lbFwiIC8+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgR3JpZFBhbmVsQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBwYXRoO1xyXG4gIEBJbnB1dCgpIHdpZHRoO1xyXG4gIEBJbnB1dCgpIGhlaWdodDtcclxuICBASW5wdXQoKSB4O1xyXG4gIEBJbnB1dCgpIHk7XHJcbn1cclxuIl19