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

export interface Progress {
  seenWords: string[];
  failedWords: string[];
  savedWords: string[];
}
