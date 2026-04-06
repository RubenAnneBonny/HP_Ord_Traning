interface Props {
  example: string;
  word: string;
  onRetry: () => void;
}

export default function FeedbackPanel({ example, word, onRetry }: Props) {
  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
      <p className="text-sm font-semibold text-amber-800 mb-1">Fel svar — exempel:</p>
      <p className="text-slate-700 italic mb-3">&ldquo;{example}&rdquo;</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
      >
        Försök igen
      </button>
    </div>
  );
}
