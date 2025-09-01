"use client";

import { useState } from "react";
import { clsx } from "clsx";

type Props = {
  id: string;
  text: string;
  votes: number;
  totalVotes: number;
  hasVoted: boolean;
  onVote: (answerId: string) => Promise<void>;
};

export function AnswerCard({ id, text, votes, totalVotes, hasVoted, onVote }: Props) {
  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const [busy, setBusy] = useState(false);

  return (
    <div className="card p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(600px_300px_at_20%_-20%,_#a78bfa,_transparent_60%)]" />
      <p className="text-base leading-6 mb-3">{text}</p>
      <div className="h-2 w-full bg-soft/70 rounded-full overflow-hidden mb-3">
        <div
          className={clsx("h-full rounded-full transition-all", pct >= 75 ? "bg-purple-400" : "bg-white/70")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{pct}% liked</span>
        <button
          disabled={busy || hasVoted}
          onClick={async () => {
            setBusy(true);
            try { await onVote(id); } finally { setBusy(false); }
          }}
          className={clsx(
            "px-3 py-1.5 rounded-lg text-sm font-semibold transition",
            hasVoted ? "bg-white/10 text-white/60 cursor-not-allowed" : "bg-white text-black hover:opacity-90"
          )}
        >
          {hasVoted ? "Voted" : busy ? "…" : "Vote"}
        </button>
      </div>
    </div>
  );
}
