export interface ICollectionQuestion {
    question: string;
    options: Array<string>;
    correct: number;
    description?: string;
    duration: number;
}
