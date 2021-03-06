export class InjectionRegisteryService {
    constructor(injectionService) {
        this.injectionService = injectionService;
        this.defaults = {};
        this.components = new Map();
    }
    getByType(type = this.type) {
        return this.components.get(type);
    }
    create(bindings) {
        return this.createByType(this.type, bindings);
    }
    createByType(type, bindings) {
        bindings = this.assignDefaults(bindings);
        const component = this.injectComponent(type, bindings);
        this.register(type, component);
        return component;
    }
    destroy(instance) {
        const compsByType = this.components.get(instance.componentType);
        if (compsByType && compsByType.length) {
            const idx = compsByType.indexOf(instance);
            if (idx > -1) {
                const component = compsByType[idx];
                component.destroy();
                compsByType.splice(idx, 1);
            }
        }
    }
    destroyAll() {
        this.destroyByType(this.type);
    }
    destroyByType(type) {
        const comps = this.components.get(type);
        if (comps && comps.length) {
            let i = comps.length - 1;
            while (i >= 0) {
                this.destroy(comps[i--]);
            }
        }
    }
    injectComponent(type, bindings) {
        return this.injectionService.appendComponent(type, bindings);
    }
    assignDefaults(bindings) {
        const inputs = Object.assign({}, this.defaults.inputs);
        const outputs = Object.assign({}, this.defaults.outputs);
        if (!bindings.inputs && !bindings.outputs) {
            bindings = { inputs: bindings };
        }
        if (inputs) {
            bindings.inputs = Object.assign(Object.assign({}, inputs), bindings.inputs);
        }
        if (outputs) {
            bindings.outputs = Object.assign(Object.assign({}, outputs), bindings.outputs);
        }
        return bindings;
    }
    register(type, component) {
        if (!this.components.has(type)) {
            this.components.set(type, []);
        }
        const types = this.components.get(type);
        types.push(component);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uLXJlZ2lzdGVyeS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi90b29sdGlwL2luamVjdGlvbi1yZWdpc3Rlcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLE9BQWdCLHlCQUF5QjtJQU03QyxZQUFtQixnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUgzQyxhQUFRLEdBQW9CLEVBQUUsQ0FBQztRQUMvQixlQUFVLEdBQXFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFFWCxDQUFDO0lBRXpELFNBQVMsQ0FBQyxPQUFnQixJQUFJLENBQUMsSUFBSTtRQUNqQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBZ0I7UUFDckIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFhLEVBQUUsUUFBeUI7UUFDbkQsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFekMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFL0IsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUF5QjtRQUMvQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFaEUsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNaLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNwQixXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNGO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQWE7UUFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN6QixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7SUFDSCxDQUFDO0lBRVMsZUFBZSxDQUFDLElBQWEsRUFBRSxRQUF5QjtRQUNoRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFUyxjQUFjLENBQUMsUUFBeUI7UUFDaEQsTUFBTSxNQUFNLHFCQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFFLENBQUM7UUFDM0MsTUFBTSxPQUFPLHFCQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFFLENBQUM7UUFFN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ3pDLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQztTQUNqQztRQUVELElBQUksTUFBTSxFQUFFO1lBQ1YsUUFBUSxDQUFDLE1BQU0sbUNBQVEsTUFBTSxHQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQztTQUNyRDtRQUVELElBQUksT0FBTyxFQUFFO1lBQ1gsUUFBUSxDQUFDLE9BQU8sbUNBQVEsT0FBTyxHQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUUsQ0FBQztTQUN4RDtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFUyxRQUFRLENBQUMsSUFBYSxFQUFFLFNBQTBCO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDL0I7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudFJlZiwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBJbmplY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9pbmplY3Rpb24uc2VydmljZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhcnRpYWxCaW5kaW5ncyB7XHJcbiAgaW5wdXRzPzogb2JqZWN0O1xyXG4gIG91dHB1dHM/OiBvYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbmplY3Rpb25SZWdpc3RlcnlTZXJ2aWNlPFQgPSBhbnk+IHtcclxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgdHlwZTogVHlwZTxUPjtcclxuXHJcbiAgcHJvdGVjdGVkIGRlZmF1bHRzOiBQYXJ0aWFsQmluZGluZ3MgPSB7fTtcclxuICBwcm90ZWN0ZWQgY29tcG9uZW50czogTWFwPGFueSwgQXJyYXk8Q29tcG9uZW50UmVmPFQ+Pj4gPSBuZXcgTWFwKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmplY3Rpb25TZXJ2aWNlOiBJbmplY3Rpb25TZXJ2aWNlKSB7fVxyXG5cclxuICBnZXRCeVR5cGUodHlwZTogVHlwZTxUPiA9IHRoaXMudHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cy5nZXQodHlwZSk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUoYmluZGluZ3M6IG9iamVjdCk6IENvbXBvbmVudFJlZjxUPiB7XHJcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVCeVR5cGUodGhpcy50eXBlLCBiaW5kaW5ncyk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVCeVR5cGUodHlwZTogVHlwZTxUPiwgYmluZGluZ3M6IFBhcnRpYWxCaW5kaW5ncyk6IENvbXBvbmVudFJlZjxUPiB7XHJcbiAgICBiaW5kaW5ncyA9IHRoaXMuYXNzaWduRGVmYXVsdHMoYmluZGluZ3MpO1xyXG5cclxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuaW5qZWN0Q29tcG9uZW50KHR5cGUsIGJpbmRpbmdzKTtcclxuICAgIHRoaXMucmVnaXN0ZXIodHlwZSwgY29tcG9uZW50KTtcclxuXHJcbiAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveShpbnN0YW5jZTogQ29tcG9uZW50UmVmPFQ+KTogdm9pZCB7XHJcbiAgICBjb25zdCBjb21wc0J5VHlwZSA9IHRoaXMuY29tcG9uZW50cy5nZXQoaW5zdGFuY2UuY29tcG9uZW50VHlwZSk7XHJcblxyXG4gICAgaWYgKGNvbXBzQnlUeXBlICYmIGNvbXBzQnlUeXBlLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBpZHggPSBjb21wc0J5VHlwZS5pbmRleE9mKGluc3RhbmNlKTtcclxuXHJcbiAgICAgIGlmIChpZHggPiAtMSkge1xyXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBzQnlUeXBlW2lkeF07XHJcbiAgICAgICAgY29tcG9uZW50LmRlc3Ryb3koKTtcclxuICAgICAgICBjb21wc0J5VHlwZS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVzdHJveUFsbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZGVzdHJveUJ5VHlwZSh0aGlzLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveUJ5VHlwZSh0eXBlOiBUeXBlPFQ+KTogdm9pZCB7XHJcbiAgICBjb25zdCBjb21wcyA9IHRoaXMuY29tcG9uZW50cy5nZXQodHlwZSk7XHJcblxyXG4gICAgaWYgKGNvbXBzICYmIGNvbXBzLmxlbmd0aCkge1xyXG4gICAgICBsZXQgaSA9IGNvbXBzLmxlbmd0aCAtIDE7XHJcbiAgICAgIHdoaWxlIChpID49IDApIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3koY29tcHNbaS0tXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBpbmplY3RDb21wb25lbnQodHlwZTogVHlwZTxUPiwgYmluZGluZ3M6IFBhcnRpYWxCaW5kaW5ncyk6IENvbXBvbmVudFJlZjxUPiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmplY3Rpb25TZXJ2aWNlLmFwcGVuZENvbXBvbmVudCh0eXBlLCBiaW5kaW5ncyk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgYXNzaWduRGVmYXVsdHMoYmluZGluZ3M6IFBhcnRpYWxCaW5kaW5ncyk6IFBhcnRpYWxCaW5kaW5ncyB7XHJcbiAgICBjb25zdCBpbnB1dHMgPSB7IC4uLnRoaXMuZGVmYXVsdHMuaW5wdXRzIH07XHJcbiAgICBjb25zdCBvdXRwdXRzID0geyAuLi50aGlzLmRlZmF1bHRzLm91dHB1dHMgfTtcclxuXHJcbiAgICBpZiAoIWJpbmRpbmdzLmlucHV0cyAmJiAhYmluZGluZ3Mub3V0cHV0cykge1xyXG4gICAgICBiaW5kaW5ncyA9IHsgaW5wdXRzOiBiaW5kaW5ncyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpbnB1dHMpIHtcclxuICAgICAgYmluZGluZ3MuaW5wdXRzID0geyAuLi5pbnB1dHMsIC4uLmJpbmRpbmdzLmlucHV0cyB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvdXRwdXRzKSB7XHJcbiAgICAgIGJpbmRpbmdzLm91dHB1dHMgPSB7IC4uLm91dHB1dHMsIC4uLmJpbmRpbmdzLm91dHB1dHMgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYmluZGluZ3M7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgcmVnaXN0ZXIodHlwZTogVHlwZTxUPiwgY29tcG9uZW50OiBDb21wb25lbnRSZWY8VD4pOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5jb21wb25lbnRzLmhhcyh0eXBlKSkge1xyXG4gICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KHR5cGUsIFtdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0eXBlcyA9IHRoaXMuY29tcG9uZW50cy5nZXQodHlwZSk7XHJcbiAgICB0eXBlcy5wdXNoKGNvbXBvbmVudCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==