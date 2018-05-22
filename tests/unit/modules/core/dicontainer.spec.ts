import { DIContainer } from '../../index';

describe('modules.core.dicontainer.spec', () => {
    it('resolve.invoke_new_operator_when_di_framework_is_not_configured', () => {
        let container = new DIContainer(undefined, undefined);
        // Should resolve String with new operator
        let obj = container.resolve<String>(String);
        // its default value is ''
        expect(obj.toString()).toBe('');
    });
    it('static_create.invoke_constructor', () => {
        let container = DIContainer.create(undefined, undefined);
        expect(container instanceof DIContainer).toBeTruthy();
    });
    it('resolve.invoke_diResolve_when_di_framework_is_configured', () => {
        // DI container should be invoked and verify properties are properly injected
        let container = new DIContainer({ injector: true }, (injector, type) => {
            expect(injector).toEqual({ injector: true });
            expect(type).toEqual(String);

            return 'resolved';
        });
        let obj = container.resolve<String>(String);
        expect(obj).toBe('resolved');
    });
});
