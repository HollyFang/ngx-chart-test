export function sortLinear(data, property, direction = 'asc') {
    return data.sort((a, b) => {
        if (direction === 'asc') {
            return a[property] - b[property];
        }
        else {
            return b[property] - a[property];
        }
    });
}
export function sortByDomain(data, property, direction = 'asc', domain) {
    return data.sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        const aIdx = domain.indexOf(aVal);
        const bIdx = domain.indexOf(bVal);
        if (direction === 'asc') {
            return aIdx - bIdx;
        }
        else {
            return bIdx - aIdx;
        }
    });
}
export function sortByTime(data, property, direction = 'asc') {
    return data.sort((a, b) => {
        const aDate = a[property].getTime();
        const bDate = b[property].getTime();
        if (direction === 'asc') {
            if (aDate > bDate)
                return 1;
            if (bDate > aDate)
                return -1;
            return 0;
        }
        else {
            if (aDate > bDate)
                return -1;
            if (bDate > aDate)
                return 1;
            return 0;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi91dGlscy9zb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEdBQUcsS0FBSztJQUMxRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEIsSUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQzthQUFNO1lBQ0wsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBTTtJQUNwRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV6QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsSUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQztTQUNwQjthQUFNO1lBQ0wsT0FBTyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsR0FBRyxLQUFLO0lBQzFELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXBDLElBQUksU0FBUyxLQUFLLEtBQUssRUFBRTtZQUN2QixJQUFJLEtBQUssR0FBRyxLQUFLO2dCQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVCLElBQUksS0FBSyxHQUFHLEtBQUs7Z0JBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsQ0FBQztTQUNWO2FBQU07WUFDTCxJQUFJLEtBQUssR0FBRyxLQUFLO2dCQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxLQUFLLEdBQUcsS0FBSztnQkFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QixPQUFPLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHNvcnRMaW5lYXIoZGF0YSwgcHJvcGVydHksIGRpcmVjdGlvbiA9ICdhc2MnKSB7XHJcbiAgcmV0dXJuIGRhdGEuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2FzYycpIHtcclxuICAgICAgcmV0dXJuIGFbcHJvcGVydHldIC0gYltwcm9wZXJ0eV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gYltwcm9wZXJ0eV0gLSBhW3Byb3BlcnR5XTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRCeURvbWFpbihkYXRhLCBwcm9wZXJ0eSwgZGlyZWN0aW9uID0gJ2FzYycsIGRvbWFpbikge1xyXG4gIHJldHVybiBkYXRhLnNvcnQoKGEsIGIpID0+IHtcclxuICAgIGNvbnN0IGFWYWwgPSBhW3Byb3BlcnR5XTtcclxuICAgIGNvbnN0IGJWYWwgPSBiW3Byb3BlcnR5XTtcclxuXHJcbiAgICBjb25zdCBhSWR4ID0gZG9tYWluLmluZGV4T2YoYVZhbCk7XHJcbiAgICBjb25zdCBiSWR4ID0gZG9tYWluLmluZGV4T2YoYlZhbCk7XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2FzYycpIHtcclxuICAgICAgcmV0dXJuIGFJZHggLSBiSWR4O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGJJZHggLSBhSWR4O1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc29ydEJ5VGltZShkYXRhLCBwcm9wZXJ0eSwgZGlyZWN0aW9uID0gJ2FzYycpIHtcclxuICByZXR1cm4gZGF0YS5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICBjb25zdCBhRGF0ZSA9IGFbcHJvcGVydHldLmdldFRpbWUoKTtcclxuICAgIGNvbnN0IGJEYXRlID0gYltwcm9wZXJ0eV0uZ2V0VGltZSgpO1xyXG5cclxuICAgIGlmIChkaXJlY3Rpb24gPT09ICdhc2MnKSB7XHJcbiAgICAgIGlmIChhRGF0ZSA+IGJEYXRlKSByZXR1cm4gMTtcclxuICAgICAgaWYgKGJEYXRlID4gYURhdGUpIHJldHVybiAtMTtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoYURhdGUgPiBiRGF0ZSkgcmV0dXJuIC0xO1xyXG4gICAgICBpZiAoYkRhdGUgPiBhRGF0ZSkgcmV0dXJuIDE7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiJdfQ==