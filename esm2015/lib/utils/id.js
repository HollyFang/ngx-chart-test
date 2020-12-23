const cache = {};
/**
 * Generates a short id.
 *
 * Description:
 *   A 4-character alphanumeric sequence (364 = 1.6 million)
 *   This should only be used for JavaScript specific models.
 *   http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
 *
 *   Example: `ebgf`
 */
export function id() {
    let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    // append a 'a' because neo gets mad
    newId = `a${newId}`;
    // ensure not already used
    if (!cache[newId]) {
        cache[newId] = true;
        return newId;
    }
    return id();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zd2ltbGFuZS9uZ3gtY2hhcnRzL3NyYy9saWIvdXRpbHMvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBRWpCOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxFQUFFO0lBQ2hCLElBQUksS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RixvQ0FBb0M7SUFDcEMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFFcEIsMEJBQTBCO0lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxFQUFFLEVBQUUsQ0FBQztBQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjYWNoZSA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIHNob3J0IGlkLlxyXG4gKlxyXG4gKiBEZXNjcmlwdGlvbjpcclxuICogICBBIDQtY2hhcmFjdGVyIGFscGhhbnVtZXJpYyBzZXF1ZW5jZSAoMzY0ID0gMS42IG1pbGxpb24pXHJcbiAqICAgVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGZvciBKYXZhU2NyaXB0IHNwZWNpZmljIG1vZGVscy5cclxuICogICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYyNDg2NjYvaG93LXRvLWdlbmVyYXRlLXNob3J0LXVpZC1saWtlLWF4NGo5ei1pbi1qc1xyXG4gKlxyXG4gKiAgIEV4YW1wbGU6IGBlYmdmYFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlkKCk6IHN0cmluZyB7XHJcbiAgbGV0IG5ld0lkID0gKCcwMDAwJyArICgoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDM2LCA0KSkgPDwgMCkudG9TdHJpbmcoMzYpKS5zbGljZSgtNCk7XHJcblxyXG4gIC8vIGFwcGVuZCBhICdhJyBiZWNhdXNlIG5lbyBnZXRzIG1hZFxyXG4gIG5ld0lkID0gYGEke25ld0lkfWA7XHJcblxyXG4gIC8vIGVuc3VyZSBub3QgYWxyZWFkeSB1c2VkXHJcbiAgaWYgKCFjYWNoZVtuZXdJZF0pIHtcclxuICAgIGNhY2hlW25ld0lkXSA9IHRydWU7XHJcbiAgICByZXR1cm4gbmV3SWQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaWQoKTtcclxufVxyXG4iXX0=