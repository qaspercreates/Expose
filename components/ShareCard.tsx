"use client";

type Props = {
  question: string;
  rankLabel: string;
  streak: number;
  url?: string;
};

export function ShareCard({ question, rankLabel, streak, url = "expose.game" }: Props) {
  const text = `EXPOSE\nQ: ${question}\n${rankLabel}\n🔥 ${streak}-day streak\n${url}`;
  return (
    <div className="card p-4 mt-6">
      <div className="text-sm text-white/60 mb-2">Share</div>
      <div className="bg-soft/60 rounded-lg p-3 text-sm whitespace-pre-wrap">{text}</div>
      <button
        className="btn mt-3"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            alert("Copied share text");
          } catch {
            alert("Copy failed");
          }
        }}
      >
        Copy share text
      </button>
    </div>
  );
}
