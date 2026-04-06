import wordsData from "@/data/words.json";
import { Word } from "@/lib/types";
import QuizApp from "@/components/QuizApp";

export default function Home() {
  const words = wordsData as Word[];
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-700 mb-8">HP ORD Träning</h1>
      <QuizApp allWords={words} />
    </main>
  );
}
