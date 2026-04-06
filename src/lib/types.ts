export interface Word {
  word: string;
  pos: string;
  definition: string;
  distractors: [string, string, string];
  example: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}
