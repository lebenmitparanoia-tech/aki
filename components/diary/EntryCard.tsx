
import React from "react";
type EntryCardProps = { entry: { title?: string; date?: string; content?: string; } };
const EntryCard: React.FC<EntryCardProps> = ({ entry }) => (
  <article className="p-4 sm:p-6 bg-white/10 text-white rounded-xl border border-white/10">
    <header className="mb-2">
      <h3 className="text-lg font-bold">{entry?.title ?? "Eintrag"}</h3>
      {entry?.date && <p className="text-sm text-white/70">{entry.date}</p>}
    </header>
    <div className="prose prose-invert max-w-none text-white/90">
      {entry?.content ? <p>{String(entry.content).slice(0, 280)}{String(entry.content).length > 280 ? "…" : ""}</p> : <p>Inhalt folgt.</p>}
    </div>
  </article>
);
export default EntryCard;
