import { ICollectionQuestion } from "./collectionQuestion";

export interface ICollection {
    name: string;
    description: string;
    questions: Array<ICollectionQuestion>;
    user: string;
    _id: string;
}
