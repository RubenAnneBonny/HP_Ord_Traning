interface Props {
  total: number;
  mode: "normal" | "review" | "saved";
  failedCount: number;
  savedCount: number;
  masteredCount: number;
  totalWords: number;
  onRestart: () => void;
  onStartReview: () => void;
  onStartSaved: () => void;
  onClearProgress: () => void;
}

export default function SessionComplete({
  total,
  mode,
  failedCount,
  savedCount,
  masteredCount,
  totalWords,
  onRestart,
  onStartReview,
  onStartSaved,
  onClearProgress,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {mode === "review" ? "Övning klar!" : mode === "saved" ? "Sparade ord klara!" : "Sessionen klar!"}
      </h2>
      <p className="text-slate-600 mb-2">Du har gått igenom {total} ord i denna session.</p>
      <p className="text-slate-500 text-sm mb-6">Totalt: {masteredCount} av {totalWords} ord klara</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          Ny session
        </button>
        {failedCount > 0 && (
          <button
            onClick={onStartReview}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
          >
            Öva misslyckade ord ({failedCount})
          </button>
        )}
        {savedCount > 0 && (
          <button
            onClick={onStartSaved}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl font-semibold transition-colors"
          >
            Öva sparade ord ({savedCount})
          </button>
        )}
        <button
          onClick={onClearProgress}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
        >
          Rensa framsteg
        </button>
      </div>
    </div>
  );
}
