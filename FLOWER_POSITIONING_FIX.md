# Flower Positioning Fix

## Issue
The right-side flower was cut off at the edge of the screen and not fully visible in the viewport.

## Root Cause
The flower was positioned too close to the right edge at `right: 5%`. Combined with the flower's rotation (`rotate(-20deg)`) and its width, parts of the flower were extending beyond the visible area.

## Solution
Adjusted the right-side flower position to bring it more into the viewport:

**File:** `src/rose-animation.css`
**Line:** 84

**Before:**
```css
.rose-background .flower--2 {
  right: 5%;
  /* ... */
}
```

**After:**
```css
.rose-background .flower--2 {
  right: 12%;
  /* ... */
}
```

## Result
✅ Right-side flower is now fully visible within the viewport
✅ Both left and right flowers are properly positioned
✅ Flowers frame the content nicely without being cut off

## Files Modified
- `src/rose-animation.css` - Changed right flower position from 5% to 12%

## Note
The dev server will hot-reload this change automatically. If you don't see it immediately, try a hard refresh (`Ctrl + Shift + R`).
