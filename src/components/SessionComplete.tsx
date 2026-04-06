interface Props {
  total: number;
  onRestart: () => void;
}

export default function SessionComplete({ total, onRestart }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Sessionen klar!</h2>
      <p className="text-slate-600 mb-6">Du har gått igenom {total} ord.</p>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
      >
        Ny session
      </button>
    </div>
  );
}
