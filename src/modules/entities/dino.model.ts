import { KeyValuePair, ModelError } from '../types';

export class DinoModel {
    isValid?: boolean = true;
    values?: KeyValuePair[] = [];
    modelErrors: ModelError[] = [];
}
