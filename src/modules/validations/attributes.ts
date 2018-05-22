import { Attributes } from './constants';
import { Reflector } from '../lib/reflector';
import { IValidatorType } from './types/ivalidator';

/**
 * Sets metadata to validate the object
 */
export function Validate(attr: IValidatorType):
    (target: any, propertyKey: string) => void {
    return (target: any, propertyKey: string): void => {
        Reflector.defineMetadata(Attributes.validate, attr, target.prototype);
    };
}
