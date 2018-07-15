import { KeyValuePair, ModelError } from '../types';

/**
 * Represents the model validation errors
 */
export class DinoModel {
    isValid?: boolean = true;
    /**
     * Key - Param key, Value - Param value
     */
    values?: KeyValuePair[] = [];
    /**
     * Key - Param key, Value - List of validation errors
     */
    modelErrors: ModelError[] = [];
}
