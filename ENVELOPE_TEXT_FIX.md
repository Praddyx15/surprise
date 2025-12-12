# Envelope Text Color Fix

## Issue Identified
The envelope cards on the main screen had barely visible text. The "Day 1", "Day 2", etc. titles and the "Click to unlock" / "Available on day X" subtitles were showing in dark/default colors on the gradient envelope backgrounds, making them very hard to read.

## Root Cause
The CSS only defined text colors for two states:
1. `.envelope.unlocked` - white text ✅
2. `.envelope.locked` - light purple/gray text ✅

But there was **no color defined** for the third state:
3. **Available but not unlocked** (envelopes with 💗 heart icon) - NO COLOR DEFINED ❌

This meant those envelopes were using the browser's default text color (usually black), which was invisible on the dark gradient backgrounds.

## The Fix

Added default white color to both `.envelope-title` and `.envelope-subtitle`:

```css
.envelope-title {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: white;  /* ← ADDED */
}

.envelope-subtitle {
    font-size: 0.9rem;
    color: white;  /* ← ADDED */
}
```

## How It Works Now

1. **Default state** (available to play): White text ✅
2. **Unlocked state**: White text (explicitly set) ✅
3. **Locked state**: Light purple/gray text (overrides default) ✅

All three states now have proper, visible text colors!

## Files Modified
- `src/style.css` - Added 2 color declarations

## Result
✅ All envelope text is now clearly visible
✅ "Day 1", "Day 2", etc. titles show in white
✅ "Click to unlock" / "Available on day X" subtitles show in white
✅ Locked envelopes still show in lighter colors for disabled appearance
✅ Perfect contrast on all gradient backgrounds
