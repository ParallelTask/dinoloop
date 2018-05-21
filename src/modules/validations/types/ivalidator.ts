export interface IValidator {
    validate(value: any, field: string, obj: any): string[];
}

export interface IValidatorType {
    fields: [{
        name: string,
        validators: IValidator[],
        optional?: boolean
    }]
}