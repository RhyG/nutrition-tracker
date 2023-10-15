declare namespace NodeJS {
  interface Global {
    __DEV__?: boolean;
    __E2E__: boolean;
  }
}

// TODO: Remove all project specific types from here.
export type JournalEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
};

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
