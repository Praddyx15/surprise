# 💕 8 Days of Love Letters

A romantic web app that reveals love letters one day at a time, starting from a special date.

## Features

- 🌸 Beautiful animated flower garden background
- 💌 8 personalized love letters
- 🔐 Daily unlock system with word puzzles
- ✨ Sparkle effects and smooth animations
- 📱 Works on desktop and mobile

## How It Works

1. Letters unlock one day at a time starting from the configured date
2. Each letter requires solving a word puzzle (Wordle-style)
3. Once solved, you can read and re-read the love letter

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Configuration

Edit `src/config.js` to customize:
- `startDate`: When Day 1 begins
- `totalDays`: Number of letters (default: 8)
- `maxAttempts`: Puzzle attempts allowed (default: 6)

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com) for instant deployment.

---

Made with 💗
