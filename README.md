# PuzzleMakerKit

Bingo, word search, crossword, sudoku and maze generators. Next.js 16 static export; PDFs are built in the browser with jsPDF (loaded on click).

- `npm run build` → `out/`; `npm test` → generator tests (unique bingo cards, valid word placement, crossword consistency, unique sudoku solutions, maze paths)
- Vercel: preset Next.js (`vercel.json`), add `puzzlemakerkit.com`, redirect `www` → apex (308). Optional env: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`.
- Theme word lists and crossword clues: `lib/themes.ts`. Page copy: `lib/content.ts`.

## Before launch
- Contact page shows hello@puzzlemakerkit.com: set up forwarding for this address at your domain registrar (or change it in app/contact/page.tsx).
- Privacy page (/privacy/) already covers advertising cookies; add your ads.txt to public/ once AdSense approves the site.
