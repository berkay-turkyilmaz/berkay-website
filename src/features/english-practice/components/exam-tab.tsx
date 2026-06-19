"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Check, Clock, LogOut, Sparkles, Trophy, X, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { countQuestionsForMode, pickExamQuestions } from "../data/exam-questions";
import { isAnswerCorrect } from "../lib/exam-scoring";
import type { ExamMode, ExamQuestion } from "../types";
import { XP_REWARDS } from "../constants";
import { ep } from "../styles";
import { EXAM_QUESTION_POOL } from "../data/exam-questions";

type Props = {
  questionCount: number;
  examMode: ExamMode;
  onExamModeChange: (mode: ExamMode) => void;
  onFinish: (score: number, total: number, durationSec: number, mode: ExamMode) => void;
  onXp: (amount: number) => void;
  onViewResults: () => void;
};

type Phase = "intro" | "active" | "review" | "done";

const EXAM_MODES: ExamMode[] = ["mixed", "multiple", "true_false", "tap", "fill", "translate"];

function getGradeKey(pct: number): "excellent" | "good" | "fair" | "needs_work" {
  if (pct >= 90) return "excellent";
  if (pct >= 75) return "good";
  if (pct >= 60) return "fair";
  return "needs_work";
}

type ReviewRow = {
  question: ExamQuestion;
  given: string;
  correct: boolean;
};

export function ExamTab({
  questionCount,
  examMode,
  onExamModeChange,
  onFinish,
  onXp,
  onViewResults,
}: Props) {
  const t = useTranslations("EnglishPath.exam");
  const [phase, setPhase] = useState<Phase>("intro");
  const [activeMode, setActiveMode] = useState<ExamMode>(examMode);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });
  const [reviewRows, setReviewRows] = useState<ReviewRow[]>([]);

  const poolSize = useMemo(() => countQuestionsForMode(activeMode), [activeMode]);
  const effectiveCount = Math.min(questionCount, poolSize);

  const start = () => {
    onExamModeChange(activeMode);
    const picked = pickExamQuestions(questionCount, activeMode);
    setQuestions(picked);
    setIndex(0);
    setAnswers({});
    setInput("");
    setReviewRows([]);
    setPhase("active");
    setStartedAt(Date.now());
  };

  useEffect(() => {
    if (phase !== "active") return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [phase, startedAt]);

  const q = questions[index];

  const scoreAnswers = useCallback(
    (answerMap: Record<string, string>) => {
      let score = 0;
      const rows: ReviewRow[] = [];
      for (const question of questions) {
        const given = answerMap[question.id] ?? "";
        const correct = isAnswerCorrect(question, given);
        if (correct) score++;
        rows.push({ question, given, correct });
      }
      return { score, rows };
    },
    [questions]
  );

  const finishExam = useCallback(
    (answerMap: Record<string, string>) => {
      const { score, rows } = scoreAnswers(answerMap);
      const duration = Math.floor((Date.now() - startedAt) / 1000);
      setFinalScore({ score, total: questions.length });
      setReviewRows(rows);
      onFinish(score, questions.length, duration, activeMode);
      onXp(score * XP_REWARDS.examPerCorrect);
      setPhase("review");
    },
    [scoreAnswers, startedAt, questions.length, onFinish, onXp, activeMode]
  );

  const submitAnswer = useCallback(() => {
    if (!q) return;
    const value =
      q.type === "multiple" || q.type === "true_false" || q.type === "tap"
        ? answers[q.id]
        : input.trim();
    if (!value) return;

    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    setInput("");

    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      finishExam(next);
    }
  }, [q, answers, input, index, questions.length, finishExam]);

  const selectOption = (opt: string) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  };

  const exitExam = () => {
    if (!window.confirm(t("exit_confirm"))) return;
    setPhase("intro");
    setQuestions([]);
    setIndex(0);
    setAnswers({});
    setInput("");
    setReviewRows([]);
    setElapsed(0);
  };

  if (phase === "intro") {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-6 pb-10">
        <div
          className={cn(
            ep.heroGradient,
            "relative overflow-hidden rounded-2xl p-8 text-center text-white border border-slate-700/30"
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.2),transparent_55%)]" />
          <div className="relative">
            <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-4" aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h2>
            <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              {t("intro", { count: effectiveCount })}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" aria-hidden />
                {EXAM_QUESTION_POOL.length} {t("pool_total")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-300" aria-hidden />
                {t("xp_hint", { xp: effectiveCount * XP_REWARDS.examPerCorrect })}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className={cn(ep.sectionLabel, "mb-3 px-1")}>{t("pick_mode")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAM_MODES.map((mode) => {
              const count = countQuestionsForMode(mode);
              const active = activeMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  disabled={count === 0}
                  onClick={() => setActiveMode(mode)}
                  className={cn(
                    ep.card,
                    ep.clickable,
                    "p-4 text-left transition-all disabled:opacity-40",
                    active && "border-teal-400 ring-2 ring-teal-100 bg-teal-50/80"
                  )}
                >
                  <p className="font-semibold text-slate-800 text-sm">{t(`modes.${mode}`)}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{t(`mode_desc.${mode}`)}</p>
                  <p className="text-[10px] font-mono text-teal-600 mt-2 font-semibold">
                    {count} {t("pool")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={start}
          disabled={effectiveCount === 0}
          className={cn(ep.btnPrimary, "w-full py-4 rounded-xl text-lg font-bold disabled:opacity-40")}
        >
          {t("start")} ({Math.min(questionCount, poolSize)})
        </button>
      </div>
    );
  }

  if (phase === "review" || phase === "done") {
    const pct = finalScore.total > 0 ? Math.round((finalScore.score / finalScore.total) * 100) : 0;
    const gradeKey = getGradeKey(pct);
    const xpEarned = finalScore.score * XP_REWARDS.examPerCorrect;
    const durationMin = Math.floor(elapsed / 60);
    const durationSec = elapsed % 60;

    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6 pb-10">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(ep.card, "p-6 sm:p-8 text-center overflow-hidden relative")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-white to-amber-50/40 pointer-events-none" />
          <div className="relative">
            <Award
              className={cn(
                "w-10 h-10 mx-auto mb-3",
                pct >= 75 ? "text-amber-500" : pct >= 60 ? "text-teal-600" : "text-slate-400"
              )}
              aria-hidden
            />
            <div className="text-5xl font-black text-teal-600 tabular-nums">%{pct}</div>
            <p className="text-base font-semibold text-slate-800 mt-2">{t(`grades.${gradeKey}`)}</p>
            <p className="text-sm text-slate-500 mt-1">
              {finalScore.score} / {finalScore.total} {t("correct_label")} · {t(`modes.${activeMode}`)}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100">
                <Clock className="w-3.5 h-3.5" aria-hidden />
                {durationMin}:{String(durationSec).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-medium">
                <Zap className="w-3.5 h-3.5" aria-hidden />
                +{xpEarned} XP
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
            <button
              type="button"
              onClick={start}
              className={cn(ep.btnSecondary, "px-6 py-3 rounded-xl font-semibold")}
            >
              {t("retry")}
            </button>
            <button
              type="button"
              onClick={() => setPhase(phase === "review" ? "done" : "review")}
              className={cn(ep.btnSecondary, "px-6 py-3 rounded-xl font-semibold")}
            >
              {phase === "review" ? t("hide_review") : t("show_review")}
            </button>
            <button
              type="button"
              onClick={onViewResults}
              className={cn(ep.btnPrimary, "px-6 py-3 rounded-xl font-semibold")}
            >
              {t("view_results")}
            </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {phase === "review" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className={cn(ep.sectionLabel, "px-1")}>{t("review_title")}</p>
              {reviewRows.map((row) => (
                <div
                  key={row.question.id}
                  className={cn(
                    ep.card,
                    "p-4 border-l-4",
                    row.correct ? "border-l-emerald-500" : "border-l-rose-500"
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {row.correct ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        {t(`types.${row.question.type}`)}
                      </span>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{row.question.prompt}</p>
                    </div>
                  </div>
                  {!row.correct && (
                    <p className="text-xs text-slate-500 ml-6">
                      {t("your_answer")}: <span className="text-rose-600">{row.given || "—"}</span>
                    </p>
                  )}
                  <p className="text-xs text-teal-700 ml-6 mt-1 font-medium">
                    {t("correct_answer")}: {row.question.answer}
                  </p>
                  <p className="text-xs text-slate-400 ml-6 mt-1">{row.question.explanation}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!q) return null;

  const isTapStyle = q.type === "multiple" || q.type === "true_false" || q.type === "tap";
  const optionGrid = q.type === "tap" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={exitExam}
          className={cn(
            ep.clickable,
            "inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {t("exit_exam")}
        </button>
        <div className={cn("flex items-center gap-4 text-sm font-mono", ep.mutedSm)}>
          <span className="tabular-nums">
            {index + 1} / {questions.length}
          </span>
          <span className="flex items-center gap-1 tabular-nums">
            <Clock className="w-4 h-4" />
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className={cn(ep.card, "p-6 sm:p-8")}>
        <span className={cn("text-xs uppercase tracking-widest font-semibold", ep.mutedSm)}>
          {t(`types.${q.type}`)}
        </span>
        <p className="text-xl font-medium mt-3 mb-6 text-slate-800 leading-relaxed">{q.prompt}</p>

        {isTapStyle && q.options && (
          <div className={cn("grid gap-2", optionGrid)}>
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt;
              const isBinary = q.type === "tap" || q.type === "true_false";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => selectOption(opt)}
                  className={cn(
                    ep.clickable,
                    "text-left py-3.5 px-4 rounded-xl border font-medium transition-all",
                    isBinary && "text-center text-base sm:text-lg py-5",
                    selected
                      ? "border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-100"
                      : "border-slate-200 hover:border-teal-200 text-slate-700 bg-white"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {(q.type === "fill" || q.type === "translate") && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
            placeholder={t("input_placeholder")}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
            autoComplete="off"
          />
        )}

        <button
          type="button"
          onClick={submitAnswer}
          disabled={isTapStyle ? !answers[q.id] : !input.trim()}
          className={cn(ep.btnPrimary, "mt-6 w-full py-3.5 rounded-xl font-bold disabled:opacity-40")}
        >
          {index + 1 < questions.length ? t("next") : t("finish")}
        </button>
      </div>
    </div>
  );
}
