import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "40px 56px" }}>
      <h1>No bingo on that square</h1>
      <p className="lede">The page you&apos;re looking for doesn&apos;t exist. Try one of these:</p>
      <div className="index"><ul>
        <li><Link href="/bingo-card-generator/"><span>Bingo card generator</span><span>your own words</span></Link></li>
        <li><Link href="/word-search-maker/"><span>Word search maker</span><span>with answer key</span></Link></li>
        <li><Link href="/crossword-maker/"><span>Crossword maker</span><span>words and clues</span></Link></li>
        <li><Link href="/printable-sudoku/"><span>Printable sudoku</span><span>easy to expert</span></Link></li>
      </ul></div>
    </div>
  );
}
