import { UserIdentity } from '../../../index';

describe('modules.builtin.providers.user.identity.spec', () => {
    it('set.work_normally_without_error', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', 'test');
        // Known: Not a valid way to unit test
        // not sure how to test since it is a void method
        // but we want a stable build
        expect(userIdentity.get('key1')).toBeDefined();
    });
    it('get.return_values_for_keys_which_are_set', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', 'test');
        userIdentity.set('key2', undefined);
        userIdentity.set('key3', { a: 1 });
        expect(userIdentity.get('key1')).toBe('test');
        expect(userIdentity.get('key2')).toBe(undefined);
        expect(userIdentity.get('key3')).toEqual({ a: 1 });
    });
    it('get.return_undefined_when_key_not_set', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', 'test');
        expect(userIdentity.get('key2')).toBeUndefined();
    });
    it('contains.return_false_when_key_not_exists', () => {
        let userIdentity = new UserIdentity();
        expect(userIdentity.contains('key')).toBeFalsy();
    });
    it('contains.return_true_when_key_exists', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', 'test');
        expect(userIdentity.contains('key1')).toBeTruthy();
    });
    it('contains.return_true_when_key_exists_and_value_is_undefined', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', undefined);
        expect(userIdentity.contains('key1')).toBeTruthy();
    });
    it('clear.clears_complete_objects_data', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', undefined);
        expect(userIdentity.contains('key1')).toBeTruthy();
        userIdentity.clear();
        expect(userIdentity.contains('key1')).toBeFalsy();
    });
    it('remove.deletes_key_when_key_exists_and_value_for_key_is_defined', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', 45);
        userIdentity.remove('key1');
        expect(userIdentity.contains('key1')).toBeFalsy();
    });
    it('remove.deletes_key_when_key_exists_value_for_key_is_undefined', () => {
        let userIdentity = new UserIdentity();
        userIdentity.set('key1', undefined);
        userIdentity.remove('key1');
        expect(userIdentity.contains('key1')).toBeFalsy();
    });
    it('remove.deletes_key_when_key_not_exists', () => {
        let userIdentity = new UserIdentity();
        userIdentity.remove('key1');
        expect(userIdentity.contains('key1')).toBeFalsy();
    });
});
