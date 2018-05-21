import { Attributes } from './constants';
import { DataUtility } from '../utility/data.utility';
import { ObjectUtility } from '../utility/object.utility';
import { Reflector } from '../lib/reflector';
import { IValidatorType } from './types/ivalidator';

export abstract class Validator {

    static isValid(obj: any): boolean {
        return Validator.tryValidateWithType(obj, obj.constructor, true).length === 0;
    }

    static tryValidateAll(obj: any): string[] {
        return Validator.tryValidateWithType(obj, obj.constructor, false);
    }

    static tryValidate(obj: any): string[] {
        return Validator.tryValidateWithType(obj, obj.constructor, true);
    }

    static tryValidateWithType(data: any, type: any, skipOnFirstError: boolean): string[] {

        // Prepare validation errors array
        let validationErrors = [];
        let obj = ObjectUtility.create(type.prototype);
        let objProto = ObjectUtility.getPrototypeOf(obj);
        let metadata: IValidatorType = Reflector.getMetadata(Attributes.validate, obj);

        // loop through the hierarchy of object
        while (!(DataUtility.isUndefinedOrNull(metadata) ||
            DataUtility.isUndefinedOrNull(ObjectUtility.getPrototypeOf(objProto)))) {

            if (!DataUtility.isUndefinedOrNull(metadata.fields)) {
                // loop through the fields of the object that needs to be validated
                for (const field of metadata.fields) {
                    // if field is set to optional and its value is undefined or null
                    // then consider this field as validated to true, skip to next field
                    if (field.optional && DataUtility.isUndefinedOrNull(data[field.name])) {
                        continue;
                    }
                    // loop through all validators for each field
                    for (const validator of field.validators) {
                        let val = data[field.name];
                        let values = DataUtility.isArray(val) ? val : [val];

                        for (const value of values) {
                            let errs = validator.validate(value, field.name, obj);

                            // capture the errors returned from validators
                            if (!DataUtility.isUndefinedOrNull(errs) && errs.length > 0) {
                                for (const err of errs) {
                                    validationErrors.push(err);
                                }
                                // if complete is not set then return if atleast one error is found
                                if (skipOnFirstError) {
                                    return validationErrors;
                                }
                            }
                        }
                    }
                }
            }
            objProto = ObjectUtility.getPrototypeOf(objProto);
            metadata = Reflector.getOwnMetadata(Attributes.validate, objProto);
        }

        return validationErrors;
    }
}