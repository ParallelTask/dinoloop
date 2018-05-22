import { Validate, Reflector, Attributes } from '../../index';

describe('modules.validations.attributes.spec', () => {
    it('isUndefined.return_true_when_undefined', () => {
        spyOn(Reflector, 'defineMetadata').and.callFake(
            (key, value, target) => {
                expect(key).toBe(Attributes.validate);
                expect(target).toBe(Function.prototype);
                expect(value).toEqual({
                    fields: [{
                        name: 'test',
                        validators: []
                    }]
                });
            });
        Validate({
            fields: [{
                name: 'test',
                validators: []
            }]
        })(Function, 'test');
        expect(Reflector.defineMetadata).toHaveBeenCalledTimes(1);
    });
});
