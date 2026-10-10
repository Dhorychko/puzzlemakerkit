import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "About PuzzleMakerKit and Terms of Use" },
  description: "PuzzleMakerKit makes free puzzle generators: bingo cards, word searches, crosswords, sudoku and mazes. How it works and how you can use what you print.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <div className="wrap article" style={{ paddingTop: 24 }}>
      <article className="prose">
        <h1>About PuzzleMakerKit</h1>
        <p className="lede">Free puzzle generators for teachers, parents, party hosts and puzzle fans.</p>
        <h2>How it works</h2>
        <p>Every puzzle is generated in your browser from the words and settings you choose. Nothing you type is uploaded or stored. The same settings always produce the same puzzle, so you can reprint it; use Shuffle or New layout for a different one.</p>
        <ul>
          <li>Bingo cards are shuffled one by one and checked so no two cards are identical.</li>
          <li>Sudoku puzzles are tested by a solver: clues are removed only while exactly one solution remains.</li>
          <li>Mazes are &ldquo;perfect&rdquo;: one path from start to finish and no loops.</li>
        </ul>
        <h2>Using what you print</h2>
        <p>Puzzles you make here are free to print and copy for classes, parties, clubs, senior centers and newsletters. Please don&apos;t resell the generators or republish the site&apos;s pages.</p>
        <p><Link href="/">Back to all puzzle makers</Link></p>
      </article>
    </div>
  );
}
