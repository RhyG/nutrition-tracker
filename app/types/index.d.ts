declare namespace NodeJS {
  interface Global {
    __DEV__?: boolean;
    __E2E__: boolean;
  }
}

export type JournalEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
};
