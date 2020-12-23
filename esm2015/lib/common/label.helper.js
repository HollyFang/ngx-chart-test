/**
 * Formats a label given a date, number or string.
 *
 * @export
 */
export function formatLabel(label) {
    if (label instanceof Date) {
        label = label.toLocaleDateString();
    }
    else {
        label = label.toLocaleString();
    }
    return label;
}
/**
 * Escapes a label.
 *
 * @export
 */
export function escapeLabel(label) {
    return label.toLocaleString().replace(/[&'`"<>]/g, match => {
        return {
            '&': '&amp;',
            // tslint:disable-next-line: quotemark
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        }[match];
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWwuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi9sYWJlbC5oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBVTtJQUNwQyxJQUFJLEtBQUssWUFBWSxJQUFJLEVBQUU7UUFDekIsS0FBSyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQ3BDO1NBQU07UUFDTCxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2hDO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBVTtJQUNwQyxPQUFPLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ3pELE9BQU87WUFDTCxHQUFHLEVBQUUsT0FBTztZQUNaLHNDQUFzQztZQUN0QyxHQUFHLEVBQUUsUUFBUTtZQUNiLEdBQUcsRUFBRSxRQUFRO1lBQ2IsR0FBRyxFQUFFLFFBQVE7WUFDYixHQUFHLEVBQUUsTUFBTTtZQUNYLEdBQUcsRUFBRSxNQUFNO1NBQ1osQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBGb3JtYXRzIGEgbGFiZWwgZ2l2ZW4gYSBkYXRlLCBudW1iZXIgb3Igc3RyaW5nLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TGFiZWwobGFiZWw6IGFueSk6IHN0cmluZyB7XHJcbiAgaWYgKGxhYmVsIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgbGFiZWwgPSBsYWJlbC50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbGFiZWwgPSBsYWJlbC50b0xvY2FsZVN0cmluZygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxhYmVsO1xyXG59XHJcblxyXG4vKipcclxuICogRXNjYXBlcyBhIGxhYmVsLlxyXG4gKlxyXG4gKiBAZXhwb3J0XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlTGFiZWwobGFiZWw6IGFueSk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGxhYmVsLnRvTG9jYWxlU3RyaW5nKCkucmVwbGFjZSgvWyYnYFwiPD5dL2csIG1hdGNoID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICcmJzogJyZhbXA7JyxcclxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBxdW90ZW1hcmtcclxuICAgICAgXCInXCI6ICcmI3gyNzsnLFxyXG4gICAgICAnYCc6ICcmI3g2MDsnLFxyXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcclxuICAgICAgJzwnOiAnJmx0OycsXHJcbiAgICAgICc+JzogJyZndDsnXHJcbiAgICB9W21hdGNoXTtcclxuICB9KTtcclxufVxyXG4iXX0=