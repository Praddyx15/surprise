const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, 'temp_formatted.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf8');

// Regex to find paragraphs
const paragraphRegex = /<w:p[\s\S]*?<\/w:p>/g;
const paragraphs = xmlContent.match(paragraphRegex) || [];

let cleanText = '';

paragraphs.forEach(p => {
    // Find all text nodes within the paragraph
    const textRegex = /<w:t[^>]*>(.*?)<\/w:t>/g;
    const textMatches = p.match(textRegex);

    if (textMatches) {
        const lineText = textMatches.map(t => {
            const m = t.match(/<w:t[^>]*>(.*?)<\/w:t>/);
            return m ? m[1] : '';
        }).join('');

        if (lineText.trim()) {
            cleanText += lineText + '\n';
        }
    } else {
        // Empty paragraph, maybe just a newline
        // cleanText += '\n'; 
    }
});

fs.writeFileSync('clean_text.txt', cleanText);
console.log("Clean text written to clean_text.txt");

// Parse the clean text
const days = cleanText.split(/## DAY/i).slice(1); // Split by day header

const letters = [];
const puzzles = {};

days.forEach((dayContent, index) => {
    // dayContent starts with the number and then the rest
    // e.g. " 1 (13/12/25)\nTitle: ..."

    const lines = dayContent.split('\n');
    let dayNum = index + 1;

    // Try to extract day number from the first line if possible, or use index
    const dayNumMatch = lines[0].match(/^\s*(\d+)/);
    if (dayNumMatch) {
        dayNum = parseInt(dayNumMatch[1]);
    }

    // Extract Title
    const titleLine = lines.find(l => l.includes('**Title**') || l.includes('Title:'));
    let title = `Day ${dayNum}`;
    if (titleLine) {
        title = titleLine.replace(/\*\*Title\*\*:/, '').replace('Title:', '').trim();
        // Remove leading "Day X: " if it's duplicated in the title text, or keep it.
        // The original had "Day 1: Missing You Already"
    }

    // Extract Puzzle Word
    const puzzleLine = lines.find(l => l.includes('**Puzzle Word**') || l.includes('Puzzle Word:'));
    let puzzleWord = '';
    if (puzzleLine) {
        const m = puzzleLine.match(/Puzzle Word.*?:?\s*([A-Z]+)/i);
        if (m) puzzleWord = m[1].trim().toUpperCase();
    }

    // Extract Hint
    const hintLine = lines.find(l => l.includes('**Hint**') || l.includes('Hint:'));
    let hint = '';
    if (hintLine) {
        hint = hintLine.replace(/\*\*Hint\*\*:/, '').replace('Hint:', '').trim();
    }

    // Extract Letter Content
    // Look for "Letter Content" and "```"
    let contentStart = -1;
    let contentEnd = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Letter Content') || lines[i].includes('**Letter Content**')) {
            contentStart = i;
        }
        if (contentStart !== -1 && lines[i].includes('```')) {
            if (contentStart === -1) contentStart = i; // Should not happen if logic is correct
            else if (i > contentStart + 1) { // End of block
                contentEnd = i;
                break;
            }
        }
    }

    let letterBody = '';
    if (contentStart !== -1) {
        // Find the first ``` after contentStart
        let codeBlockStart = -1;
        for (let i = contentStart; i < lines.length; i++) {
            if (lines[i].includes('```')) {
                codeBlockStart = i;
                break;
            }
        }

        if (codeBlockStart !== -1) {
            // Find the next ```
            let codeBlockEnd = -1;
            for (let i = codeBlockStart + 1; i < lines.length; i++) {
                if (lines[i].includes('```')) {
                    codeBlockEnd = i;
                    break;
                }
            }

            if (codeBlockEnd !== -1) {
                letterBody = lines.slice(codeBlockStart + 1, codeBlockEnd).join('\n').trim();
            }
        }
    }

    if (letterBody) {
        letters.push({
            day: dayNum,
            title: title,
            content: letterBody,
            color: `gradient-${dayNum <= 7 ? dayNum : 7}`
        });
    }

    if (puzzleWord) {
        puzzles[dayNum] = {
            word: puzzleWord,
            hint: hint
        };
    }
});

const output = {
    letters,
    wordPuzzles: puzzles
};

fs.writeFileSync('extracted_data.json', JSON.stringify(output, null, 4));
console.log("Data written to extracted_data.json");
console.log("Letters found:", letters.length);
console.log("Puzzles found:", Object.keys(puzzles).length);
