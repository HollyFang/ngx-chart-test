import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { DomPortalHost, ComponentPortal } from '@angular/cdk/portal';
function isViewContainerRef(x) {
    return x.element;
}
/**
 * Injection service is a helper to append components
 * dynamically to a known location in the DOM, most
 * noteably for dialogs/tooltips appending to body.
 *
 * @export
 */
export class InjectionService {
    constructor(applicationRef, componentFactoryResolver, injector) {
        this.applicationRef = applicationRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.injector = injector;
    }
    /**
     * Sets a default global root view container. This is useful for
     * things like ngUpgrade that doesn't have a ApplicationRef root.
     *
     * @param container
     */
    static setGlobalRootViewContainer(container) {
        InjectionService.globalRootViewContainer = container;
    }
    /**
     * Gets the root view container to inject the component to.
     *
     * @memberOf InjectionService
     */
    getRootViewContainer() {
        if (this._container)
            return this._container;
        if (InjectionService.globalRootViewContainer)
            return InjectionService.globalRootViewContainer;
        if (this.applicationRef.components.length)
            return this.applicationRef.components[0];
        throw new Error('View Container not found! ngUpgrade needs to manually set this via setRootViewContainer or setGlobalRootViewContainer.');
    }
    /**
     * Overrides the default root view container. This is useful for
     * things like ngUpgrade that doesn't have a ApplicationRef root.
     *
     * @param container
     *
     * @memberOf InjectionService
     */
    setRootViewContainer(container) {
        this._container = container;
    }
    /**
     * Gets the html element for a component ref.
     *
     * @param componentRef
     *
     * @memberOf InjectionService
     */
    getComponentRootNode(component) {
        if (isViewContainerRef(component)) {
            return component.element.nativeElement;
        }
        if (component.hostView && component.hostView.rootNodes.length > 0) {
            return component.hostView.rootNodes[0];
        }
        // the top most component root node has no `hostView`
        return component.location.nativeElement;
    }
    /**
     * Gets the root component container html element.
     *
     * @memberOf InjectionService
     */
    getRootViewContainerNode(component) {
        return this.getComponentRootNode(component);
    }
    /**
     * Projects the bindings onto the component
     *
     * @param component
     * @param options
     *
     * @memberOf InjectionService
     */
    projectComponentBindings(component, bindings) {
        if (bindings) {
            if (bindings.inputs !== undefined) {
                const bindingKeys = Object.getOwnPropertyNames(bindings.inputs);
                for (const bindingName of bindingKeys) {
                    component.instance[bindingName] = bindings.inputs[bindingName];
                }
            }
            if (bindings.outputs !== undefined) {
                const eventKeys = Object.getOwnPropertyNames(bindings.outputs);
                for (const eventName of eventKeys) {
                    component.instance[eventName] = bindings.outputs[eventName];
                }
            }
        }
        return component;
    }
    /**
     * Appends a component to a adjacent location
     *
     * @param componentClass
     * @param [options={}]
     * @param [location]
     *
     * @memberOf InjectionService
     */
    appendComponent(componentClass, bindings = {}, location) {
        if (!location)
            location = this.getRootViewContainer();
        const appendLocation = this.getComponentRootNode(location);
        const portalHost = new DomPortalHost(appendLocation, this.componentFactoryResolver, this.applicationRef, this.injector);
        const portal = new ComponentPortal(componentClass);
        const componentRef = portalHost.attach(portal);
        this.projectComponentBindings(componentRef, bindings);
        return componentRef;
    }
}
InjectionService.globalRootViewContainer = null;
InjectionService.decorators = [
    { type: Injectable }
];
InjectionService.ctorParameters = () => [
    { type: ApplicationRef },
    { type: ComponentFactoryResolver },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvY29tbW9uL3Rvb2x0aXAvaW5qZWN0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGNBQWMsRUFDZCx3QkFBd0IsRUFFeEIsVUFBVSxFQUNWLFFBQVEsRUFJVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXJFLFNBQVMsa0JBQWtCLENBQUMsQ0FBTTtJQUNoQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxnQkFBZ0I7SUFlM0IsWUFDVSxjQUE4QixFQUM5Qix3QkFBa0QsRUFDbEQsUUFBa0I7UUFGbEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUN6QixDQUFDO0lBaEJKOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFNBQTJCO1FBQzNELGdCQUFnQixDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQztJQUN2RCxDQUFDO0lBVUQ7Ozs7T0FJRztJQUNILG9CQUFvQjtRQUNsQixJQUFJLElBQUksQ0FBQyxVQUFVO1lBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzVDLElBQUksZ0JBQWdCLENBQUMsdUJBQXVCO1lBQUUsT0FBTyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztRQUU5RixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLE1BQU07WUFBRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBGLE1BQU0sSUFBSSxLQUFLLENBQ2Isd0hBQXdILENBQ3pILENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILG9CQUFvQixDQUFDLFNBQTJCO1FBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxvQkFBb0IsQ0FBQyxTQUErQztRQUNsRSxJQUFJLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7U0FDeEM7UUFDRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLElBQUssU0FBUyxDQUFDLFFBQWlDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0YsT0FBUSxTQUFTLENBQUMsUUFBaUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFnQixDQUFDO1NBQ2pGO1FBRUQscURBQXFEO1FBQ3JELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx3QkFBd0IsQ0FBQyxTQUErQztRQUN0RSxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILHdCQUF3QixDQUFDLFNBQTRCLEVBQUUsUUFBYTtRQUNsRSxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ2pDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hFLEtBQUssTUFBTSxXQUFXLElBQUksV0FBVyxFQUFFO29CQUNyQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ2hFO2FBQ0Y7WUFFRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUNsQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLE1BQU0sU0FBUyxJQUFJLFNBQVMsRUFBRTtvQkFDakMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM3RDthQUNGO1NBQ0Y7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxlQUFlLENBQUksY0FBdUIsRUFBRSxXQUFnQixFQUFFLEVBQUUsUUFBYztRQUM1RSxJQUFJLENBQUMsUUFBUTtZQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN0RCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0QsTUFBTSxVQUFVLEdBQUcsSUFBSSxhQUFhLENBQ2xDLGNBQWMsRUFDZCxJQUFJLENBQUMsd0JBQXdCLEVBQzdCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0RCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDOztBQWpJTSx3Q0FBdUIsR0FBcUIsSUFBSSxDQUFDOztZQUZ6RCxVQUFVOzs7WUF0QlQsY0FBYztZQUNkLHdCQUF3QjtZQUd4QixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBcHBsaWNhdGlvblJlZixcclxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXHJcbiAgQ29tcG9uZW50UmVmLFxyXG4gIEluamVjdGFibGUsXHJcbiAgSW5qZWN0b3IsXHJcbiAgVmlld0NvbnRhaW5lclJlZixcclxuICBFbWJlZGRlZFZpZXdSZWYsXHJcbiAgVHlwZVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBEb21Qb3J0YWxIb3N0LCBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcclxuXHJcbmZ1bmN0aW9uIGlzVmlld0NvbnRhaW5lclJlZih4OiBhbnkpOiB4IGlzIFZpZXdDb250YWluZXJSZWYge1xyXG4gIHJldHVybiB4LmVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmplY3Rpb24gc2VydmljZSBpcyBhIGhlbHBlciB0byBhcHBlbmQgY29tcG9uZW50c1xyXG4gKiBkeW5hbWljYWxseSB0byBhIGtub3duIGxvY2F0aW9uIGluIHRoZSBET00sIG1vc3RcclxuICogbm90ZWFibHkgZm9yIGRpYWxvZ3MvdG9vbHRpcHMgYXBwZW5kaW5nIHRvIGJvZHkuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEluamVjdGlvblNlcnZpY2Uge1xyXG4gIHN0YXRpYyBnbG9iYWxSb290Vmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiA9IG51bGw7XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgYSBkZWZhdWx0IGdsb2JhbCByb290IHZpZXcgY29udGFpbmVyLiBUaGlzIGlzIHVzZWZ1bCBmb3JcclxuICAgKiB0aGluZ3MgbGlrZSBuZ1VwZ3JhZGUgdGhhdCBkb2Vzbid0IGhhdmUgYSBBcHBsaWNhdGlvblJlZiByb290LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIHN0YXRpYyBzZXRHbG9iYWxSb290Vmlld0NvbnRhaW5lcihjb250YWluZXI6IFZpZXdDb250YWluZXJSZWYpOiB2b2lkIHtcclxuICAgIEluamVjdGlvblNlcnZpY2UuZ2xvYmFsUm9vdFZpZXdDb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9jb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXHJcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3JcclxuICApIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHJvb3QgdmlldyBjb250YWluZXIgdG8gaW5qZWN0IHRoZSBjb21wb25lbnQgdG8uXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgSW5qZWN0aW9uU2VydmljZVxyXG4gICAqL1xyXG4gIGdldFJvb3RWaWV3Q29udGFpbmVyKCk6IFZpZXdDb250YWluZXJSZWYgfCBDb21wb25lbnRSZWY8YW55PiB7XHJcbiAgICBpZiAodGhpcy5fY29udGFpbmVyKSByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xyXG4gICAgaWYgKEluamVjdGlvblNlcnZpY2UuZ2xvYmFsUm9vdFZpZXdDb250YWluZXIpIHJldHVybiBJbmplY3Rpb25TZXJ2aWNlLmdsb2JhbFJvb3RWaWV3Q29udGFpbmVyO1xyXG5cclxuICAgIGlmICh0aGlzLmFwcGxpY2F0aW9uUmVmLmNvbXBvbmVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5hcHBsaWNhdGlvblJlZi5jb21wb25lbnRzWzBdO1xyXG5cclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ1ZpZXcgQ29udGFpbmVyIG5vdCBmb3VuZCEgbmdVcGdyYWRlIG5lZWRzIHRvIG1hbnVhbGx5IHNldCB0aGlzIHZpYSBzZXRSb290Vmlld0NvbnRhaW5lciBvciBzZXRHbG9iYWxSb290Vmlld0NvbnRhaW5lci4nXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHJvb3QgdmlldyBjb250YWluZXIuIFRoaXMgaXMgdXNlZnVsIGZvclxyXG4gICAqIHRoaW5ncyBsaWtlIG5nVXBncmFkZSB0aGF0IGRvZXNuJ3QgaGF2ZSBhIEFwcGxpY2F0aW9uUmVmIHJvb3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29udGFpbmVyXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgSW5qZWN0aW9uU2VydmljZVxyXG4gICAqL1xyXG4gIHNldFJvb3RWaWV3Q29udGFpbmVyKGNvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZik6IHZvaWQge1xyXG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgaHRtbCBlbGVtZW50IGZvciBhIGNvbXBvbmVudCByZWYuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29tcG9uZW50UmVmXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgSW5qZWN0aW9uU2VydmljZVxyXG4gICAqL1xyXG4gIGdldENvbXBvbmVudFJvb3ROb2RlKGNvbXBvbmVudDogVmlld0NvbnRhaW5lclJlZiB8IENvbXBvbmVudFJlZjxhbnk+KTogSFRNTEVsZW1lbnQge1xyXG4gICAgaWYgKGlzVmlld0NvbnRhaW5lclJlZihjb21wb25lbnQpKSB7XHJcbiAgICAgIHJldHVybiBjb21wb25lbnQuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGNvbXBvbmVudC5ob3N0VmlldyAmJiAoY29tcG9uZW50Lmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXR1cm4gKGNvbXBvbmVudC5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRoZSB0b3AgbW9zdCBjb21wb25lbnQgcm9vdCBub2RlIGhhcyBubyBgaG9zdFZpZXdgXHJcbiAgICByZXR1cm4gY29tcG9uZW50LmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSByb290IGNvbXBvbmVudCBjb250YWluZXIgaHRtbCBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEluamVjdGlvblNlcnZpY2VcclxuICAgKi9cclxuICBnZXRSb290Vmlld0NvbnRhaW5lck5vZGUoY29tcG9uZW50OiBWaWV3Q29udGFpbmVyUmVmIHwgQ29tcG9uZW50UmVmPGFueT4pOiBIVE1MRWxlbWVudCB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnRSb290Tm9kZShjb21wb25lbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHJvamVjdHMgdGhlIGJpbmRpbmdzIG9udG8gdGhlIGNvbXBvbmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICpcclxuICAgKiBAbWVtYmVyT2YgSW5qZWN0aW9uU2VydmljZVxyXG4gICAqL1xyXG4gIHByb2plY3RDb21wb25lbnRCaW5kaW5ncyhjb21wb25lbnQ6IENvbXBvbmVudFJlZjxhbnk+LCBiaW5kaW5nczogYW55KTogQ29tcG9uZW50UmVmPGFueT4ge1xyXG4gICAgaWYgKGJpbmRpbmdzKSB7XHJcbiAgICAgIGlmIChiaW5kaW5ncy5pbnB1dHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IGJpbmRpbmdLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmluZGluZ3MuaW5wdXRzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGJpbmRpbmdOYW1lIG9mIGJpbmRpbmdLZXlzKSB7XHJcbiAgICAgICAgICBjb21wb25lbnQuaW5zdGFuY2VbYmluZGluZ05hbWVdID0gYmluZGluZ3MuaW5wdXRzW2JpbmRpbmdOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChiaW5kaW5ncy5vdXRwdXRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBldmVudEtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiaW5kaW5ncy5vdXRwdXRzKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBldmVudEtleXMpIHtcclxuICAgICAgICAgIGNvbXBvbmVudC5pbnN0YW5jZVtldmVudE5hbWVdID0gYmluZGluZ3Mub3V0cHV0c1tldmVudE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBcHBlbmRzIGEgY29tcG9uZW50IHRvIGEgYWRqYWNlbnQgbG9jYXRpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb21wb25lbnRDbGFzc1xyXG4gICAqIEBwYXJhbSBbb3B0aW9ucz17fV1cclxuICAgKiBAcGFyYW0gW2xvY2F0aW9uXVxyXG4gICAqXHJcbiAgICogQG1lbWJlck9mIEluamVjdGlvblNlcnZpY2VcclxuICAgKi9cclxuICBhcHBlbmRDb21wb25lbnQ8VD4oY29tcG9uZW50Q2xhc3M6IFR5cGU8VD4sIGJpbmRpbmdzOiBhbnkgPSB7fSwgbG9jYXRpb24/OiBhbnkpOiBDb21wb25lbnRSZWY8YW55PiB7XHJcbiAgICBpZiAoIWxvY2F0aW9uKSBsb2NhdGlvbiA9IHRoaXMuZ2V0Um9vdFZpZXdDb250YWluZXIoKTtcclxuICAgIGNvbnN0IGFwcGVuZExvY2F0aW9uID0gdGhpcy5nZXRDb21wb25lbnRSb290Tm9kZShsb2NhdGlvbik7XHJcblxyXG4gICAgY29uc3QgcG9ydGFsSG9zdCA9IG5ldyBEb21Qb3J0YWxIb3N0KFxyXG4gICAgICBhcHBlbmRMb2NhdGlvbixcclxuICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXHJcbiAgICAgIHRoaXMuYXBwbGljYXRpb25SZWYsXHJcbiAgICAgIHRoaXMuaW5qZWN0b3JcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnRDbGFzcyk7XHJcblxyXG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gcG9ydGFsSG9zdC5hdHRhY2gocG9ydGFsKTtcclxuICAgIHRoaXMucHJvamVjdENvbXBvbmVudEJpbmRpbmdzKGNvbXBvbmVudFJlZiwgYmluZGluZ3MpO1xyXG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcclxuICB9XHJcbn1cclxuIl19