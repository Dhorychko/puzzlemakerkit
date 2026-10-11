// Server component: picks the client tool for a catalog item.
import type { Item } from "@/lib/catalog";
import { BingoTool, CrosswordTool, MazeTool, SudokuTool, WordSearchTool } from "./Tools";

export default function ToolFor({ item }: { item: Item }) {
  const t = item.tool;
  const slug = item.path.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "puzzle";
  switch (t.k) {
    case "bingo": return <BingoTool mode={t.mode} theme={t.theme} year={t.year} slug={slug} title={item.title} />;
    case "ws": return <WordSearchTool theme={t.theme} kind={t.kind} pick={t.pick} slug={slug} title={item.title} />;
    case "cw": return <CrosswordTool set={t.set} slug={slug} title={item.title} />;
    case "sudoku": return <SudokuTool level={t.level} box={t.box} slug={slug} title={item.title} />;
    case "maze": return <MazeTool slug={slug} title={item.title} />;
  }
}
