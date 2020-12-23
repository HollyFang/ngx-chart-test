/**
 * Based on the data, return an array with unique values.
 *
 * @export
 * @returns array
 */
export function getUniqueXDomainValues(results) {
    const valueSet = new Set();
    for (const result of results) {
        for (const d of result.series) {
            valueSet.add(d.name);
        }
    }
    return Array.from(valueSet);
}
/**
 * Get the scaleType of enumerable of values.
 * @returns  'time', 'linear' or 'ordinal'
 */
export function getScaleType(values, checkDateType = true) {
    if (checkDateType) {
        const allDates = values.every(value => value instanceof Date);
        if (allDates) {
            return 'time';
        }
    }
    const allNumbers = values.every(value => typeof value === 'number');
    if (allNumbers) {
        return 'linear';
    }
    return 'ordinal';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3N3aW1sYW5lL25neC1jaGFydHMvc3JjL2xpYi9jb21tb24vZG9tYWluLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxPQUFjO0lBQ25ELE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0IsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDNUIsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzdCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUMsTUFBYSxFQUFFLGFBQWEsR0FBRyxJQUFJO0lBQzlELElBQUksYUFBYSxFQUFFO1FBQ2pCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksSUFBSSxDQUFDLENBQUM7UUFDOUQsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLE1BQU0sQ0FBQztTQUNmO0tBQ0Y7SUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDcEUsSUFBSSxVQUFVLEVBQUU7UUFDZCxPQUFPLFFBQVEsQ0FBQztLQUNqQjtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQmFzZWQgb24gdGhlIGRhdGEsIHJldHVybiBhbiBhcnJheSB3aXRoIHVuaXF1ZSB2YWx1ZXMuXHJcbiAqXHJcbiAqIEBleHBvcnRcclxuICogQHJldHVybnMgYXJyYXlcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVYRG9tYWluVmFsdWVzKHJlc3VsdHM6IGFueVtdKTogYW55W10ge1xyXG4gIGNvbnN0IHZhbHVlU2V0ID0gbmV3IFNldCgpO1xyXG4gIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcclxuICAgIGZvciAoY29uc3QgZCBvZiByZXN1bHQuc2VyaWVzKSB7XHJcbiAgICAgIHZhbHVlU2V0LmFkZChkLm5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZVNldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHNjYWxlVHlwZSBvZiBlbnVtZXJhYmxlIG9mIHZhbHVlcy5cclxuICogQHJldHVybnMgICd0aW1lJywgJ2xpbmVhcicgb3IgJ29yZGluYWwnXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2NhbGVUeXBlKHZhbHVlczogYW55W10sIGNoZWNrRGF0ZVR5cGUgPSB0cnVlKTogc3RyaW5nIHtcclxuICBpZiAoY2hlY2tEYXRlVHlwZSkge1xyXG4gICAgY29uc3QgYWxsRGF0ZXMgPSB2YWx1ZXMuZXZlcnkodmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlKTtcclxuICAgIGlmIChhbGxEYXRlcykge1xyXG4gICAgICByZXR1cm4gJ3RpbWUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgYWxsTnVtYmVycyA9IHZhbHVlcy5ldmVyeSh2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKTtcclxuICBpZiAoYWxsTnVtYmVycykge1xyXG4gICAgcmV0dXJuICdsaW5lYXInO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuICdvcmRpbmFsJztcclxufVxyXG4iXX0=