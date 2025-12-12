# 💌 Love Letters - Interactive Love Letter Web App

A romantic, interactive web application designed for couples in long-distance relationships. Share 8 personalized love letters that unlock through fun Wordle-style word puzzles!

![Love Letters App](https://img.shields.io/badge/Made%20with-❤️-red)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 📅 **Day-by-Day Unlocking**: Letters become available based on a start date
- 🎮 **Wordle-Style Puzzles**: Solve word puzzles (any length) to unlock each letter
- 💾 **Progress Saving**: Your progress is automatically saved in the browser
- 🎨 **Beautiful Design**: Gradient colors, glassmorphism, and smooth animations
- 📱 **Fully Responsive**: Works perfectly on mobile and desktop
- ⌨️ **Keyboard Support**: Play with on-screen or physical keyboard

## 🚀 Quick Start

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd Letters-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser** to `http://localhost:1234`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 🎨 Customization Guide

### 1. Set Your Start Date

Edit `src/play.js` (line 6):
```javascript
let START_DATE = new Date('2025-12-10'); // Change to your desired start date
```

### 2. Customize Your Letters

Edit `src/letters.js` to personalize each letter:

```javascript
{
    day: 1,
    title: "Day 1: Your Custom Title",
    content: `Your personalized message here...`,
    color: "gradient-1" // Choose from gradient-1 to gradient-7
}
```

### 3. Set Your Word Puzzles

Edit the word puzzles in `src/letters.js`:

```javascript
export const wordPuzzles = {
    1: { word: "HEART", hint: "Your custom hint" },
    2: { word: "BABYKUTTIYA", hint: "What you are to me" },
    // ... customize all 8 puzzles
};
```

**Important**: Words can be any length! Use all UPPERCASE letters. Examples: HEART (5), FOREVER (7), BABYKUTTIYA (12)

### 4. Customize Page Title

Edit `src/index.html` (lines 6 and 14):
```html
<title>Your Custom Title</title>
...
<h1>Your Custom Heading</h1>
```

## 🎮 How to Play

1. **Visit the app** on the start date you configured
2. **Click on an available envelope** (marked with 💗)
3. **Solve the Wordle puzzle** by guessing the word:
   - 🟩 Green = Correct letter in correct position
   - 🟨 Yellow = Correct letter in wrong position
   - ⬜ Gray = Letter not in the word
4. **Read your love letter** once you solve the puzzle!
5. **Come back each day** for a new letter

## 📁 Project Structure

```
Letters-main/
├── src/
│   ├── index.html      # Main HTML structure
│   ├── play.js         # Game logic and interactions
│   ├── letters.js      # Your letters and puzzles (CUSTOMIZE THIS!)
│   ├── style.css       # App styling
│   ├── rose-animation.css  # Flower garden animations
│   └── config.js       # Configuration settings
├── complete-flowers.html   # Reference: Flower HTML snippet
├── flower-reference.html   # Reference: Full flower implementation
├── package.json        # Project configuration
└── README.md          # This file

*Note: The reference files (complete-flowers.html, flower-reference.html) are for development reference only and not loaded by the app.*
```

## 🛠️ Technical Details

- **Build Tool**: Parcel v2.14.0 (zero-config bundler)
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Pure CSS with modern features
- **Storage**: Browser localStorage for progress persistence
- **No Dependencies**: Lightweight and fast!

## 🎨 Color Gradients

The app includes 7 beautiful gradient options:
- `gradient-1`: Pink to Rose
- `gradient-2`: Purple to Pink
- `gradient-3`: Red to Pink
- `gradient-4`: Rose to Red
- `gradient-5`: Pink to Purple
- `gradient-6`: Fuchsia to Pink
- `gradient-7`: Red to Pink

## 📱 Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 💡 Tips

- **Test Your Puzzles**: Make sure your word puzzles are solvable!
- **Backup Your Data**: Keep a copy of `letters.js` with your personalized content
- **Share the Link**: Deploy to Netlify, Vercel, or GitHub Pages to share with your loved one
- **Reset Progress**: Clear browser localStorage to reset unlocked letters

## 🐛 Troubleshooting

**Letters won't unlock?**
- Check that your `START_DATE` is set correctly
- Make sure the current date is on or after the letter's day

**Lost progress?**
- Progress is saved in browser localStorage
- Clearing browser data will reset progress

**Word puzzle not working?**
- Words must be in UPPERCASE in `letters.js`
- Words can be any length (3-15 letters recommended for best display)

## 📄 License

MIT License - Feel free to use and customize for personal use!

## ❤️ Made With Love

Created for couples who believe that distance is just a test of how far love can travel.

---

**Enjoy your love letters! 💕**
