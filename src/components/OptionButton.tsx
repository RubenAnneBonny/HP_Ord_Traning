"use client";

interface Props {
  text: string;
  state: "idle" | "correct" | "wrong";
  disabled: boolean;
  onClick: () => void;
}

export default function OptionButton({ text, state, disabled, onClick }: Props) {
  const base = "w-full text-left px-4 py-3 rounded-lg border-2 transition-colors font-medium";
  const colors =
    state === "correct"
      ? "border-green-500 bg-green-50 text-green-800"
      : state === "wrong"
      ? "border-red-400 bg-red-50 text-red-800"
      : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 text-slate-800";

  return (
    <button className={`${base} ${colors}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}
