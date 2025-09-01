"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AnswerCard } from "@/components/AnswerCard";
import { getFingerprint } from "@/lib/fingerprint";
import { ShareCard } from "@/components/ShareCard";

type Question = {
  id: string;
  prompt: string;
  starts_at: string;
  ends_at: string;
};

type AnswerRow = {
  id: string;
  text: string;
  votes: number;
  has_voted: boolean;
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [streak, setStreak] = useState(0);

  const totalVotes = useMemo(() => answers.reduce((a, r) => a + r.votes, 0), [answers]);
  const top = useMemo(() => answers[0], [answers]);

  useEffect(() => {
    void init();
  }, []);

  async function init() {
    const fp = getFingerprint();
    // get active question
    const { data: qRes, error: qErr } = await supabase
      .from("questions")
      .select("*")
      .eq("is_active", true)
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (qErr || !qRes) { setLoading(false); return; }

    setQuestion(qRes as Question);

    await loadAnswers(qRes.id, fp);
    hydrateStreak();
    setLoading(false);
  }

  async function loadAnswers(questionId: string, fp: string) {
    const { data, error } = await supabase.rpc("get_answers_with_vote", {
      p_question_id: questionId,
      p_fingerprint: fp
    });
    if (!error && data) {
      setAnswers(
        data
          .map((d: any) => ({
            id: d.id,
            text: d.text,
            votes: d.votes_count,
            has_voted: d.has_voted
          }))
          .sort((a: any, b: any) => b.votes - a.votes)
      );
    }
  }

  function hydrateStreak() {
    const key = "expose_streak";
    const lastKey = "expose_last_played";
    const last = localStorage.getItem(lastKey);
    const today = new Date().toDateString();
    if (last === today) {
      setStreak(parseInt(localStorage.getItem(key) || "1", 10));
    } else {
      setStreak(parseInt(localStorage.getItem(key) || "0", 10));
    }
  }

  function bumpStreak() {
    const key = "expose_streak";
    const lastKey = "expose_last_played";
    const today = new Date().toDateString();
    const cur = parseInt(localStorage.getItem(key) || "0", 10);
    const last = localStorage.getItem(lastKey);
    if (last !== today) {
      localStorage.setItem(key, String(cur + 1));
      localStorage.setItem(lastKey, today);
      setStreak(cur + 1);
    }
  }

  async function submitAnswer() {
    if (!question || !input.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("answers").insert({
        question_id: question.id,
        text: input.trim().slice(0, 200)
      });
      if (!error) {
        setInput("");
        bumpStreak();
        await loadAnswers(question.id, getFingerprint());
      } else {
        alert("Failed to submit");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function vote(answerId: string) {
    if (!question) return;
    const fp = getFingerprint();
    const { error } = await supabase.from("votes").insert({
      answer_id: answerId,
      voter_fingerprint: fp
    });
    if (error) {
      if (error.code === "23505") {
        // unique constraint -> already voted
      } else {
        alert("Vote failed");
      }
    }
    await loadAnswers(question.id, fp);
  }

  if (loading) {
    return (
      <div className="mt-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-3/4 bg-white/10 rounded" />
          <div className="h-20 w-full bg-white/5 rounded" />
          <div className="h-20 w-full bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="mt-16 text-center">
        <h1 className="text-2xl font-bold">No question live right now</h1>
        <p className="text-white/60 mt-2">Come back in a bit.</p>
      </div>
    );
  }

  const rankLabel = top
    ? top.votes === 0
      ? "No votes yet"
      : `Top answer at ${Math.round((top.votes / Math.max(1, totalVotes)) * 100)}%`
    : "—";

  return (
    <div className="mt-4 space-y-6">
      <section className="card p-5 relative overflow-hidden">
        <div className="absolute -inset-1 opacity-[0.06] bg-[radial-gradient(900px_500px_at_10%_-10%,_#a78bfa,_transparent_60%)] pointer-events-none" />
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight">{question.prompt}</h1>
          <div className="text-xs text-white/60">
            Ends {new Date(question.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer to unlock the vault"
            maxLength={200}
            className="flex-1 bg-soft/70 border border-white/10 rounded-xl px-3.5 py-3 outline-none focus:ring-2 focus:ring-purple-500/40"
          />
          <button onClick={submitAnswer} disabled={submitting || !input.trim()} className="btn">
            {submitting ? "Sending…" : "Submit"}
          </button>
        </div>
        <p className="text-xs text-white/50 mt-2">
          Anon. One line. Keep it real. Unlocks the vault instantly.
        </p>
      </section>

      <section className="space-y-3">
        {answers.length === 0 ? (
          <div className="card p-5 text-white/70">No answers yet. Be the first.</div>
        ) : (
          answers.map((a) => (
            <AnswerCard
              key={a.id}
              id={a.id}
              text={a.text}
              votes={a.votes}
              totalVotes={totalVotes}
              hasVoted={a.has_voted}
              onVote={vote}
            />
          ))
        )}
      </section>

      <ShareCard question={question.prompt} rankLabel={rankLabel} streak={streak} />
      <footer className="text-center text-xs text-white/40 pt-6">© {new Date().getFullYear()} Expose</footer>
    </div>
  );
}
