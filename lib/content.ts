// Page copy. `meta` = meta description (115–160 chars).
import { CLUE_SET_BY_SLUG, THEME_BY_SLUG } from "./themes.ts";

export type Content = { meta: string; intro: string; steps: string[]; tips: string[]; faq: { q: string; a: string }[]; related: string[]; table?: { caption: string; head: string[]; rows: string[][] } };

export const CONTENT: Record<string, Content> = {
  "bingo-card-generator": {
    meta: "Free bingo card generator: type your own words, pick 5×5, 4×4 or 3×3, and print up to 200 unique cards with a caller's sheet. Download a PDF, no sign-up.",
    intro: "Make custom bingo cards for a classroom, party, shower or team meeting. Type your words or phrases, choose the card size and how many cards you need, and every card comes out shuffled differently, with a caller's sheet at the end.",
    steps: [
      "Type one word or phrase per line. A 5 × 5 card with a free space needs at least 24.",
      "Choose the card size, number of cards and how many cards to print per page.",
      "Download the PDF. The last page is the caller's checklist of every word.",
    ],
    tips: [
      "Enter more words than one card needs (30–40 for 5 × 5). The bigger the pool, the more different the cards are, and the longer games last.",
      "For young kids, use 3 × 3 cards with short words they can read, like colors or animals.",
      "Shuffle cards gives a completely new set; the same settings always produce the same cards, so you can reprint them.",
      "Two cards per page fits nicely on half sheets; four per page saves paper for big groups.",
    ],
    faq: [
      { q: "How many words do I need for bingo cards?", a: "At least 24 for 5 × 5 cards with a free space (25 without), 16 for 4 × 4 and 8 or 9 for 3 × 3. With more words than that, each card gets a different mix." },
      { q: "Are all the cards different?", a: "Yes. Each card is shuffled separately, and the generator checks for duplicates, so no two cards are the same." },
      { q: "How do I play word bingo?", a: "The caller reads words from the caller's sheet one at a time, in random order. Players mark matching squares. The first to complete a row, column or diagonal calls \"Bingo!\"" },
      { q: "Can I make 100 bingo cards?", a: "Yes, up to 200 in one PDF." },
    ],
    related: ["printable-bingo-cards", "blank-bingo-card", "bingo-christmas", "bingo-baby-shower"],
  },
  "printable-bingo-cards": {
    meta: "Free printable bingo cards with numbers 1–75 in the classic B-I-N-G-O layout. Print 1 to 200 different cards plus a caller's sheet of all 75 numbers.",
    intro: "Classic number bingo cards, laid out the American way: B has 1–15, I 16–30, N 31–45 with a free center square, G 46–60 and O 61–75. Print as many different cards as you need and the caller's sheet.",
    steps: ["Choose how many cards and how many per page.", "Download the PDF and print.", "Cut out the caller's sheet numbers, or tick them off as you call."],
    tips: [
      "Each column holds 5 of its 15 numbers (4 in the N column), so the number of possible cards is astronomically large and repeats are very unlikely; the generator also checks for duplicates.",
      "For senior centers, print one large card per page.",
      "Use dried beans, coins or a dauber to mark numbers.",
    ],
    faq: [
      { q: "What numbers are on a bingo card?", a: "In US 75-ball bingo: B 1–15, I 16–30, N 31–45, G 46–60 and O 61–75, with a free space in the middle of the N column." },
      { q: "How do you win bingo?", a: "Usually by covering five squares in a row across, down or diagonally. Popular variations include four corners, blackout (every square) and the letter X." },
    ],
    related: ["bingo-card-generator", "blank-bingo-card", "2027-bingo-card"],
    table: { caption: "75-ball bingo columns", head: ["Column", "Numbers", "On each card"], rows: [["B", "1–15", "5"], ["I", "16–30", "5"], ["N", "31–45", "4 + free space"], ["G", "46–60", "5"], ["O", "61–75", "5"]] },
  },
  "blank-bingo-card": {
    meta: "Free blank bingo card template to print: empty 5×5, 4×4 or 3×3 grids with or without a free space, 1, 2 or 4 cards per page. Write in your own words.",
    intro: "Empty bingo cards to fill in by hand. Great for classrooms where students write their own words, or for party games you want to customize with a pen.",
    steps: ["Choose the grid size and whether to include a free space.", "Pick 1, 2 or 4 cards per page and how many cards.", "Download and print, then fill in the squares."],
    tips: ["Classroom idea: give students a blank card and a word list; they write words in any squares they like, so every card is different.", "Laminate blank cards and use dry-erase markers to reuse them."],
    faq: [{ q: "What size is a bingo card?", a: "On one card per page, each square is about 1.5 inches; at four per page, about 0.7 inches." }],
    related: ["bingo-card-generator", "printable-bingo-cards", "2027-bingo-card"],
  },
  "2027-bingo-card": {
    meta: "Make a 2027 bingo card: put 25 goals for the new year on a 5×5 card, or start from our list of ideas. Cross them off all year. Free printable PDF.",
    intro: "A goals bingo card for 2027: 25 small resolutions in a 5 × 5 grid. Cross one off whenever you do it, and aim for a line, or the whole card, by next December. Start with our ideas or type your own.",
    steps: ["Edit the list: keep the ideas you like and add your own goals.", "Fill all 25 squares, or tick Free space to make one square a gift.", "Download the PDF and stick it on the fridge or the first page of a planner."],
    tips: [
      "Mix easy goals (watch a sunrise) with bigger ones (run a 5K) so you get early wins in January.",
      "Make one card each for the family, or a shared card for a couple or a friend group, and compare in December.",
      "Put one goal per month in the top row if you like a schedule; Shuffle cards moves everything else around.",
    ],
    faq: [
      { q: "What is a yearly bingo card?", a: "A personal goals list laid out as a bingo card. It became popular on social media as a lighter alternative to New Year's resolutions: missing one square doesn't break the card." },
      { q: "How many goals do I need?", a: "25 for a full 5 × 5 card, or 24 with a free space in the middle. A 4 × 4 card needs 16 and a 3 × 3 card 9." },
    ],
    related: ["2026-bingo-card", "bingo-card-generator", "blank-bingo-card"],
  },
  "2026-bingo-card": {
    meta: "2026 bingo card: put the goals you still want this year on a 5×5 card, from small wins to a holiday checklist. Free printable PDF, no sign-up.",
    intro: "There is still time left in 2026. Put the goals you want to finish this year on a 5 × 5 card, like a fall reading list, a holiday checklist or one last trip, and cross them off before New Year's Eve.",
    steps: ["Edit the list to the goals you still have time for.", "Add a free space if you want an easier card.", "Download the PDF and print."],
    tips: ["Short deadlines work best with small, concrete goals.", "When you're ready to plan next year, the 2027 bingo card uses the same tool."],
    faq: [{ q: "Can I change the year on the card?", a: "Yes. The title is editable, so you can print a card for any year or event." }],
    related: ["2027-bingo-card", "bingo-card-generator", "blank-bingo-card"],
  },
  "word-search-maker": {
    meta: "Free word search maker: type your own words, choose the grid size and difficulty, and print a puzzle with an answer key. Make several versions at once.",
    intro: "Turn any list into a word search: spelling words, vocabulary, names for a party, or a theme. Choose the grid size and which directions words can run, and download the puzzle with an answer key.",
    steps: ["Type one word per line (spaces are removed, so \"candy cane\" becomes CANDYCANE).", "Pick the grid size and difficulty.", "Download the PDF; answer keys come after the puzzles."],
    tips: [
      "Easy (across and down only) suits grades K–2; medium adds diagonals; hard allows backwards words for older kids and adults.",
      "A 15 × 15 grid fits about 15–20 words comfortably.",
      "Need different puzzles for each student? Set \"Different puzzles\" to 5 or 10: same words, new layouts.",
    ],
    faq: [
      { q: "How do I make a word search puzzle?", a: "Type your words above, choose the grid size and difficulty, and the puzzle is built instantly. Click Download PDF to print it with the answer key." },
      { q: "Why didn't some words fit?", a: "Words longer than the grid can't fit, and very crowded grids run out of room. Make the grid bigger or use fewer words." },
      { q: "Can I make a word search for my class?", a: "Yes. Use spelling or vocabulary words, and print several layouts so neighbors can't copy." },
    ],
    related: ["printable-word-search", "crossword-maker", "word-search-kids", "bingo-card-generator"],
  },
  "printable-word-search": {
    meta: "Free printable word search puzzles: animals, holidays, seasons, sports and math, each with an answer key. Pick a theme, choose difficulty and print.",
    intro: "Ready-made word searches on popular themes, each with 20 words and an answer key. Pick a theme, set the size and difficulty, or switch to your own words.",
    steps: ["Choose a theme from the list (or browse the themed pages below).", "Pick grid size and difficulty.", "Download the PDF with answers."],
    tips: ["Word searches build spelling and pattern recognition; for kids, read the words aloud first.", "Large print versions are easier for seniors and people with low vision."],
    faq: [{ q: "Are these word searches free?", a: "Yes. Print as many as you like for home, class or activities." }],
    related: ["word-search-maker", "word-search-kids", "word-search-large-print", "ws-christmas"],
  },
  "word-search-kids": {
    meta: "Easy word search for kids: short words like cat, dog and sun in a 10×10 grid, across and down only, with big letters and an answer key. Free to print.",
    intro: "A first word search for young readers: short, familiar words hidden only across and down in a small grid with large letters. Change the words to match your child's reading list.",
    steps: ["Keep the starter words or type your child's sight words.", "Keep the grid at 8 × 8 or 10 × 10 for beginners.", "Print and help them find the first word."],
    tips: ["For ages 4–6, use 8–10 words of three or four letters.", "Ages 7–9 can handle 12 × 12 grids and diagonals."],
    faq: [{ q: "What age are word searches for?", a: "Simple word searches work from about age 5, when children recognize letters and short words." }],
    related: ["printable-word-search", "word-search-maker", "sudoku-for-kids", "maze-generator"],
  },
  "word-search-large-print": {
    meta: "Large print word search puzzles with big, clear letters and a smaller grid, easier on the eyes for seniors. Choose your own words and print with an answer key.",
    intro: "Word searches with extra-large letters and a smaller grid, so they're comfortable to read. Ideal for seniors, memory care activities and anyone who prefers big print.",
    steps: ["Keep the words or type your own.", "Choose 12 × 12 or 13 × 13 for the biggest letters.", "Print on one sheet with the word list in large type."],
    tips: ["Smaller grids mean bigger letters: 12 × 12 gives letters about 0.4 inches tall on Letter paper.", "Familiar themes like gardens, family or decades make good topics for memory care."],
    faq: [{ q: "What is a large print word search?", a: "A word search with fewer, larger letters, usually set in a clean sans-serif font, which is easier on the eyes." }],
    related: ["printable-word-search", "word-search-maker", "printable-sudoku"],
  },
  "crossword-maker": {
    meta: "Free crossword puzzle maker: enter words and clues, and get a printable crossword with numbered clues and an answer key. Optional word bank for kids.",
    intro: "Enter your words and clues and the crossword maker fits them into a grid, numbers the squares, and lists Across and Down clues. Download it as a PDF with an answer key.",
    steps: ["Write one entry per line as word - clue.", "Click New layout until you like the shape; words that share letters fit best.", "Download the PDF with the answer key."],
    tips: ["Use 10–20 words of different lengths with common letters (E, A, R, S, T) so they interlock.", "Add a word bank for younger students or for vocabulary review.", "Clue writing tip: for vocabulary, use the definition; for reading, use a sentence with a blank."],
    faq: [
      { q: "How do I make a crossword puzzle?", a: "Type each answer and its clue on a line separated by a dash, like \"whale - largest animal on Earth\". The maker builds the grid automatically." },
      { q: "Why are some words left out?", a: "A word can only be placed where it crosses another word with a shared letter. Try New layout, or add words that share letters with the leftovers." },
    ],
    related: ["printable-crosswords", "word-search-maker", "bingo-card-generator"],
  },
  "printable-crosswords": {
    meta: "Free printable crossword puzzles for kids and classes: animals, Christmas, Thanksgiving, Halloween and science, with numbered clues and answer keys.",
    intro: "Ready-to-print crosswords with 12 clues each on kid-friendly themes. Pick a theme, add a word bank to make it easier, and print with the answer key, or edit the clues to make it your own.",
    steps: ["Choose a theme.", "Optionally add the word bank or edit clues.", "Download and print."],
    tips: ["These puzzles suit roughly grades 2–6.", "Add a word bank for younger students."],
    faq: [{ q: "Are the answers included?", a: "Yes. The answer key is the last page of the PDF." }],
    related: ["crossword-maker", "printable-word-search", "printable-sudoku"],
  },
  "printable-sudoku": {
    meta: "Free printable sudoku puzzles: easy, medium, hard and expert, 1 to 6 per page, every puzzle with one unique solution and an answer page. Make new ones anytime.",
    intro: "Generate fresh sudoku puzzles at the difficulty you want and print them 1, 2, 4 or 6 to a page. Every puzzle is checked to have exactly one solution, and the solutions are printed at the end.",
    steps: ["Choose the difficulty and how many puzzles.", "Choose how many per page.", "Download the PDF; click New puzzles anytime for a different set."],
    tips: [
      "Rules: fill each row, column and 3 × 3 box with the digits 1–9, with no repeats.",
      "Start with rows, columns or boxes that are nearly full.",
      "Difficulty here is set by how many numbers are given: about 40 for easy, 32 medium, 28 hard and 25 expert. Fewer clues usually means harder logic.",
    ],
    faq: [
      { q: "How many clues does a sudoku need?", a: "At least 17 for a puzzle with a single solution, which was proven by computer search in 2012. Most printed puzzles have 25–40." },
      { q: "Does every puzzle have one solution?", a: "Yes. Each puzzle is checked by a solver, and numbers are only removed while the solution stays unique." },
    ],
    related: ["sudoku-easy", "sudoku-hard", "sudoku-for-kids", "maze-generator"],
    table: { caption: "Difficulty levels", head: ["Level", "Given numbers", "Good for"], rows: [["Easy", "≈ 40", "Beginners"], ["Medium", "≈ 32", "Regular players"], ["Hard", "≈ 28", "Experienced players"], ["Expert", "≈ 25", "A real challenge"]] },
  },
  "sudoku-easy": {
    meta: "Easy sudoku puzzles to print, with about 40 numbers given so they can be solved by simple scanning. Four puzzles per page, solutions included.",
    intro: "Easy sudoku for beginners: with about 40 of the 81 squares filled in, you can solve these by scanning rows, columns and boxes. Print as many as you like.",
    steps: ["Choose how many puzzles and per page.", "Download and print.", "Check your work on the solution pages."],
    tips: ["Look for a box or line missing only one or two numbers.", "Pencil in small candidate numbers when stuck."],
    faq: [{ q: "How do you solve easy sudoku?", a: "Find squares where only one number can go by checking its row, column and box. Easy puzzles can be solved this way without guessing." }],
    related: ["printable-sudoku", "sudoku-hard", "sudoku-for-kids"],
  },
  "sudoku-hard": {
    meta: "Hard sudoku puzzles to print, with about 28 givens that need pairs and candidate elimination. 1–6 per page with full solutions. New puzzles every click.",
    intro: "Hard sudoku with about 28 given numbers. Expect to use candidate notes and techniques like naked pairs. Every puzzle has a unique solution.",
    steps: ["Choose how many puzzles and per page.", "Download and print.", "Solutions are at the end."],
    tips: ["Write candidates in each empty cell, then look for pairs that eliminate options elsewhere.", "Print one per page for room to write notes."],
    faq: [{ q: "What makes a sudoku hard?", a: "Fewer givens and, more importantly, the need for techniques beyond simple scanning, such as naked pairs and pointing pairs; the hardest puzzles can need even more advanced patterns." }],
    related: ["printable-sudoku", "sudoku-expert", "sudoku-easy"],
  },
  "sudoku-expert": {
    meta: "Expert sudoku puzzles to print with about 25 given numbers. Large one-per-page layout for notes, unique solutions, and an answer page. Free PDF.",
    intro: "Expert sudoku with as few as about 25 givens. These take patience and advanced techniques. Print one per page to leave room for candidates.",
    steps: ["Pick how many puzzles.", "Choose 1 per page for room to work.", "Download and print."],
    tips: ["When stuck, look for a cell with only two candidates and follow each possibility."],
    faq: [{ q: "How hard is expert sudoku?", a: "Expert puzzles usually need advanced techniques; solving times of 30 minutes or more are normal." }],
    related: ["sudoku-hard", "printable-sudoku", "maze-generator"],
  },
  "sudoku-for-kids": {
    meta: "Sudoku for kids: printable 4×4 and 6×6 puzzles with easy rules for ages 5 and up. Six per page with solutions; switch to 9×9 when they're ready.",
    intro: "Small sudoku grids for children: 4 × 4 (numbers 1–4) and 6 × 6 (numbers 1–6). They teach the same logic as the big puzzle in a size kids can finish.",
    steps: ["Choose 4 × 4 for ages 5–7 or 6 × 6 for ages 7–10.", "Pick the difficulty and how many puzzles.", "Download and print."],
    tips: ["Explain one rule at a time: no repeats in a row, then column, then box.", "Kids who finish 6 × 6 easily are ready for easy 9 × 9."],
    faq: [{ q: "What age can kids do sudoku?", a: "Many children can solve 4 × 4 sudoku from about age 5 or 6, and 6 × 6 from 7 or 8." }],
    related: ["printable-sudoku", "maze-generator", "word-search-kids"],
  },
  "maze-generator": {
    meta: "Free printable maze generator: easy mazes for kids to expert mazes for adults, with solution pages. Make 1 to 10 different mazes in one PDF.",
    intro: "Generate a new maze at the click of a button. Choose easy for preschoolers up to expert for adults, print several different mazes at once, and get solution pages.",
    steps: ["Choose a difficulty.", "Choose how many mazes.", "Download the PDF; solutions follow the mazes."],
    tips: ["Every maze has exactly one path from start to finish.", "Easy mazes help preschoolers with pencil control."],
    faq: [{ q: "How are the mazes made?", a: "With a randomized depth-first search, which creates \"perfect\" mazes: one solution and no loops." }],
    related: ["sudoku-for-kids", "printable-sudoku", "word-search-kids"],
  },
};

// ---------- Themed pages ----------
const THEME_NOTE: Record<string, string> = {
  christmas: "Christmas is December 25; bingo and word searches are favorites for class parties in the last week before winter break.",
  thanksgiving: "Thanksgiving is the fourth Thursday of November (November 26 in 2026); a puzzle keeps kids busy while dinner cooks.",
  halloween: "Halloween is October 31. Use the cards for class parties and trunk-or-treat events.",
  "baby-shower": "A common version: guests mark gifts as the parents open them; the first line wins a prize.",
  "bridal-shower": "Guests mark squares as the bride opens gifts; have small prizes ready for the first bingo.",
  easter: "Easter 2027 is Sunday, March 28.",
  valentines: "Valentine's Day is February 14; these work for class parties and family game nights.",
  summer: "Pack a few for road trips and rainy days.",
  fall: "Great for September to November classroom centers.",
  spring: "Use in March and April alongside spring vocabulary.",
  winter: "A good indoor-recess activity for snowy days.",
  math: "Use as a vocabulary review before a unit test.",
  sports: "Swap in team names or positions for a custom version.",
  animals: "Kids can circle the animals they've seen in real life.",
};

// Holidays are proper nouns and keep their capitals mid-sentence.
const PROPER = new Set(["christmas", "thanksgiving", "halloween", "easter", "valentines"]);
const lower = (slug: string, name: string) => (PROPER.has(slug) ? name : name.toLowerCase());

function bingoTheme(slug: string): Content {
  const t = THEME_BY_SLUG[slug];
  const n = t.name, l = lower(slug, n);
  return {
    meta: `Free printable ${l} bingo cards: ${t.bingo!.length} ${l} words shuffled onto unique 5×5 cards, plus a caller's sheet. Edit the words and print a PDF.`,
    intro: `${n} bingo, ready to print. Every card has a different mix of ${t.bingo!.length} ${l} words, and the caller's sheet lists them all. Edit the list to add your own, then print as many cards as you need.`,
    steps: ["Keep the word list or add your own ideas.", "Choose how many cards (one per player) and cards per page.", "Download the PDF and cut the pages if you printed 2 or 4 per page."],
    tips: [THEME_NOTE[slug], "Print a couple of extra cards for late arrivals.", "Small prizes, like candy or stickers, keep everyone playing to the end."],
    faq: [
      { q: `How do you play ${l} bingo?`, a: "The caller reads words from the caller's sheet in random order; players mark matching squares. The first to get five in a row (or the whole card) wins." },
      { q: "Can I change the words?", a: "Yes. Edit, add or remove any words before you print." },
    ],
    related: ["bingo-card-generator", ...(THEME_BY_SLUG[slug].words ? [`ws-${slug}`] : []), "blank-bingo-card", "printable-bingo-cards"],
  };
}

function wsTheme(slug: string): Content {
  const t = THEME_BY_SLUG[slug];
  const n = t.name, l = lower(slug, n);
  const sample = t.words!.slice(0, 4).map((w) => w.toLowerCase()).join(", ");
  return {
    meta: `Free printable ${l} word search with ${t.words!.length} words like ${t.words!.slice(0, 3).map((w) => w.toLowerCase()).join(", ")}. Pick easy or hard and print it with an answer key.`,
    intro: `${/^[aeiou]/i.test(l) ? "An" : "A"} ${l} word search with ${t.words!.length} words to find, from ${sample} and more. Make it easy (across and down) or hard (all directions), and print it with the answer key.`,
    steps: ["Choose the grid size and difficulty.", "Print several different layouts for a class.", "Answer keys come after the puzzles."],
    tips: [THEME_NOTE[slug], ...(t.words!.some((w) => w.includes(" ")) ? [`Multi-word answers like "${t.words!.find((w) => w.includes(" "))!.toLowerCase()}" are hidden without the space.`] : ["For younger kids, choose Easy so words only run across and down."])],
    faq: [
      { q: `How many words are in the ${l} word search?`, a: `${t.words!.length}. You can remove some for younger kids or add your own.` },
      { q: "Is there an answer key?", a: "Yes, after the puzzle in the PDF. Untick it if you don't want it." },
    ],
    related: ["printable-word-search", ...(t.bingo ? [`bingo-${slug}`] : []), "word-search-maker", "word-search-kids"],
  };
}

const CW_NOTE: Record<string, string> = {
  christmas: "A quiet activity for the last days before winter break.",
  thanksgiving: "Print one for each place at the kids' table.",
  halloween: "Pair it with Halloween bingo for a class party.",
  science: "Use it to review vocabulary at the end of a unit.",
};
function cwTheme(slug: string): Content {
  const c = CLUE_SET_BY_SLUG[slug];
  const n = c.name, l = PROPER.has(slug) ? n : n.toLowerCase();
  const ex = c.entries.slice(0, 2).map((e) => `"${e.clue}"`).join(" and ");
  return {
    meta: `Free printable ${l} crossword with ${c.entries.length} clues and an answer key. Add a word bank for younger kids, or edit the clues. Download a PDF.`,
    intro: `${/^[aeiou]/i.test(l) ? "An" : "A"} ${l} crossword with ${c.entries.length} kid-friendly clues, such as ${ex}. Print it as is, add a word bank to make it easier, or change any word and clue before you print.`,
    steps: ["Keep the clues or edit any line (word - clue).", "Tick Word bank for younger solvers.", "Download the PDF; the answer key is the last page."],
    tips: [CW_NOTE[slug] ?? "Good for early finishers and substitute plans.", "Click New layout for a differently shaped grid with the same clues."],
    faq: [
      { q: `Is there an answer key for the ${l} crossword?`, a: "Yes, on the last page of the PDF. Untick Answer key page to leave it out." },
      { q: "What age is it for?", a: "The clues suit roughly grades 2–5. With the word bank, younger kids can solve it too." },
    ],
    related: ["printable-crosswords", "crossword-maker", ...(THEME_BY_SLUG[slug]?.words ? [`ws-${slug}`] : []), ...(THEME_BY_SLUG[slug]?.bingo ? [`bingo-${slug}`] : [])],
  };
}

export function getContent(key: string): Content {
  if (CONTENT[key]) return CONTENT[key];
  if (key.startsWith("cw-")) return cwTheme(key.slice(3));
  if (key.startsWith("bingo-")) return bingoTheme(key.slice(6));
  if (key.startsWith("ws-")) return wsTheme(key.slice(3));
  throw new Error(`No content for ${key}`);
}
