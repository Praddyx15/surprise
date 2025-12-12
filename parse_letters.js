const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'temp_formatted.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

// Extract text from <w:t> tags
const textMatches = xmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
let fullText = '';

if (textMatches) {
    fullText = textMatches.map(tag => {
        const match = tag.match(/<w:t[^>]*>(.*?)<\/w:t>/);
        return match ? match[1] : '';
    }).join('');
}

// Replace xml:space="preserve" and other XML entities if needed, but mostly it's plain text.
// The text might be "Title", ": ", "Day 1", etc. so joining them is correct.
// However, we need to handle newlines. In Word XML, paragraphs are <w:p>.
// So we should probably iterate over <w:p> and join text within them, then add a newline.

const paragraphMatches = xmlContent.match(/<w:p[\s\S]*?<\/w:p>/g);
let textLines = [];

if (paragraphMatches) {
    textLines = paragraphMatches.map(p => {
        const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
        if (tMatches) {
            return tMatches.map(tag => {
                const match = tag.match(/<w:t[^>]*>(.*?)<\/w:t>/);
                return match ? match[1] : '';
            }).join('');
        }
        return '';
    });
}

const content = textLines.join('\n');
console.log("Extracted Content Length:", content.length);

// Now parse the content
const days = content.split(/## DAY \d+/i).slice(1); // Split by day header

const letters = [];
const puzzles = {};

days.forEach((dayContent, index) => {
    const dayNum = index + 1;

    // Extract Title
    const titleMatch = dayContent.match(/\*\*Title\*\*:\s*(.*?)\n/);
    const title = titleMatch ? titleMatch[1].trim() : `Day ${dayNum}`;

    // Extract Puzzle Word
    const puzzleMatch = dayContent.match(/\*\*Puzzle Word\*\*:\s*([A-Z]+)/);
    const puzzleWord = puzzleMatch ? puzzleMatch[1].trim() : '';

    // Extract Hint
    const hintMatch = dayContent.match(/\*\*Hint\*\*:\s*(.*?)\n/);
    const hint = hintMatch ? hintMatch[1].trim() : '';

    // Extract Letter Content
    // It starts after "Letter Content:" and "```" and ends before "```"
    const contentMatch = dayContent.match(/Letter Content[\s\S]*?```([\s\S]*?)```/);
    let letterBody = contentMatch ? contentMatch[1].trim() : '';

    if (title && letterBody) {
        letters.push({
            day: dayNum,
            title: title,
            content: letterBody,
            color: `gradient-${dayNum <= 7 ? dayNum : 7}` // Reuse gradient 7 for day 8 as per original
        });
    }

    if (puzzleWord) {
        puzzles[dayNum] = {
            word: puzzleWord,
            hint: hint
        };
    }
});

console.log("Letters Found:", letters.length);
console.log("Puzzles Found:", Object.keys(puzzles).length);

const output = `
export const letters = ${JSON.stringify(letters, null, 4)};

export const wordPuzzles = ${JSON.stringify(puzzles, null, 4)};
`;

console.log(output);
