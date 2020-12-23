export function reduceTicks(ticks, maxTicks) {
    if (ticks.length > maxTicks) {
        const reduced = [];
        const modulus = Math.floor(ticks.length / maxTicks);
        for (let i = 0; i < ticks.length; i++) {
            if (i % modulus === 0) {
                reduced.push(ticks[i]);
            }
        }
        ticks = reduced;
    }
    return ticks;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja3MuaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3dpbWxhbmUvbmd4LWNoYXJ0cy9zcmMvbGliL2NvbW1vbi9heGVzL3RpY2tzLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRO0lBQ3pDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLEVBQUU7UUFDM0IsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQztRQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsR0FBRyxPQUFPLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Y7UUFDRCxLQUFLLEdBQUcsT0FBTyxDQUFDO0tBQ2pCO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZVRpY2tzKHRpY2tzLCBtYXhUaWNrcykge1xyXG4gIGlmICh0aWNrcy5sZW5ndGggPiBtYXhUaWNrcykge1xyXG4gICAgY29uc3QgcmVkdWNlZCA9IFtdO1xyXG4gICAgY29uc3QgbW9kdWx1cyA9IE1hdGguZmxvb3IodGlja3MubGVuZ3RoIC8gbWF4VGlja3MpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoaSAlIG1vZHVsdXMgPT09IDApIHtcclxuICAgICAgICByZWR1Y2VkLnB1c2godGlja3NbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aWNrcyA9IHJlZHVjZWQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGlja3M7XHJcbn1cclxuIl19