import { ObjectUtility } from '../../index';

class TestFunc {
    a = 45;
    b = 'test';
}

describe('modules.utility.object.utility.spec', () => {
    it('create.invoke_Object.create', () => {
        spyOn(Object, 'create').and.callFake(o => expect(o).toEqual({ name: 'test' }));
        ObjectUtility.create({ name: 'test' });
        expect(Object.create).toHaveBeenCalledTimes(1);
    });
    it('keys.invoke_Object.keys', () => {
        let d;
        spyOn(Object, 'keys').and.callFake(o => d = o);
        ObjectUtility.keys({ name: 'test' });
        expect(Object.keys).toHaveBeenCalledTimes(1);
        expect(d).toEqual({ name: 'test' });
    });
    it('getPrototypeOf.invoke_Object.getPrototypeOf', () => {
        spyOn(Object, 'getPrototypeOf').and.callFake(o => expect(o).toEqual({ name: 'test' }));
        ObjectUtility.getPrototypeOf({ name: 'test' });
        expect(Object.getPrototypeOf).toHaveBeenCalledTimes(1);
    });
    it('getOwnPropertyNames.invoke_Object.getOwnPropertyNames', () => {
        spyOn(Object, 'getOwnPropertyNames').and.callFake(o => expect(o).toEqual({ name: 'test' }));
        ObjectUtility.getOwnPropertyNames({ name: 'test' });
        expect(Object.getOwnPropertyNames).toHaveBeenCalledTimes(1);
    });
    it('changeObjectReferences.return_null_when_value_is_null', () => {
        expect(ObjectUtility.replaceObjectReferences(null, {}, String)).toBeNull();
    });
    it('changeObjectReferences.return_undefined_when_value_is_undefined', () => {
        expect(ObjectUtility.replaceObjectReferences(undefined, {}, String)).toBeUndefined();
    });
    it('changeObjectReferences.return_string_when_value_is_string', () => {
        expect(ObjectUtility.replaceObjectReferences('test', {}, String)).toBe('test');
    });
    it('changeObjectReferences.return_5_when_value_is_5', () => {
        expect(ObjectUtility.replaceObjectReferences(5, {}, String)).toBe(5);
    });
    it('changeObjectReferences.return_true_when_value_is_true', () => {
        expect(ObjectUtility.replaceObjectReferences(true, {}, String)).toBe(true);
    });
    it('changeObjectReferences.return_Function_when_value_is_Function', () => {
        expect(ObjectUtility.replaceObjectReferences(Function, {}, String)).toBe(Function);
    });
    it('changeObjectReferences.return_string_when_value_is_obj_and_className_is_undefined', () => {
        let obj = {};
        expect(ObjectUtility.replaceObjectReferences(obj, {}, undefined)).toBe(obj);
    });
    it('changeObjectReferences.return_string_when_value_is_obj_and_className_is_null', () => {
        let obj = {};
        expect(ObjectUtility.replaceObjectReferences(obj, {}, null)).toBe(obj);
    });
    it('changeObjectReferences.replaces_occurrences_when_value_exists(null)_and_className_is_TestFunc', () => {
        let o = {
            a: 1,
            b: true,
            c: {
                a: String(),
                b: {},
                c: new TestFunc(),
                d: {
                    a: 'test_world',
                    b: Object,
                    c: () => 45,
                    d: new TestFunc(),
                    f: {
                        a: {
                            a: Object,
                            b: new TestFunc(),
                            c: new TestFunc(),
                            d: {
                                a: new TestFunc(),
                                b: 'hello_world'
                            },
                            e: () => 65,
                            f: undefined
                        }
                    }
                }
            },
            d: new TestFunc()
        };
        let obj = ObjectUtility.replaceObjectReferences(o, null, TestFunc);

        // make sure other properties are not modified
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(true);
        expect(obj.c.a).toEqual(String());
        expect(obj.c.b).toEqual({});
        // should replace with null
        expect(obj.c.c).toBeNull();
        expect(obj.c.d.a).toBe('test_world');
        expect(obj.c.d.b).toEqual(Object);
        expect(obj.c.d.c()).toBe(45);
        // should replace with null
        expect(obj.c.d.d).toBeNull();
        expect(obj.c.d.f.a.a).toEqual(Object);
        // should replace with null
        expect(obj.c.d.f.a.b).toBeNull();
        // should replace with null
        expect(obj.c.d.f.a.c).toBeNull();
        // should replace with null
        expect(obj.c.d.f.a.d.a).toBeNull();
        expect(obj.c.d.f.a.d.b).toBe('hello_world');
        expect(obj.c.d.f.a.e()).toBe(65);
        expect(obj.c.d.f.a.f).toBe(undefined);
        // should replace with null
        expect(obj.d).toBeNull();
    });
    it('changeObjectReferences.replaces_occurrences_when_value_exists(obj)_and_className_is_TestFunc', () => {
        let t = new TestFunc();
        t.a = 10;
        t.b = 'rainbow';

        let o = {
            a: 1,
            b: true,
            c: {
                a: String(),
                b: {},
                c: new TestFunc(),
                d: {
                    a: 'test_world',
                    b: Object,
                    c: () => 45,
                    d: new TestFunc(),
                    f: {
                        a: {
                            a: Object,
                            b: new TestFunc(),
                            c: new TestFunc(),
                            d: {
                                a: new TestFunc(),
                                b: 'hello_world'
                            },
                            e: () => 65,
                            f: undefined
                        }
                    }
                }
            },
            d: new TestFunc()
        };
        let obj = ObjectUtility.replaceObjectReferences(o, t, TestFunc);

        // make sure other properties are not modified
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(true);
        expect(obj.c.a).toEqual(String());
        expect(obj.c.b).toEqual({});
        // should replace with reference
        // .toBe() makes sure we are comparing via reference and not by value
        // since references must be same, it should be done using .toBe()
        expect(obj.c.c).toBe(t);
        expect(obj.c.d.a).toBe('test_world');
        expect(obj.c.d.b).toEqual(Object);
        expect(obj.c.d.c()).toBe(45);
        // should replace with referenced t
        expect(obj.c.d.d).toBe(t);
        expect(obj.c.d.f.a.a).toEqual(Object);
        // should replace with referenced t
        expect(obj.c.d.f.a.b).toBe(t);
        // should replace with referenced t
        expect(obj.c.d.f.a.c).toBe(t);
        // should replace with referenced t
        expect(obj.c.d.f.a.d.a).toBe(t);
        expect(obj.c.d.f.a.d.b).toBe('hello_world');
        expect(obj.c.d.f.a.e()).toBe(65);
        expect(obj.c.d.f.a.f).toBe(undefined);
        // should replace with referenced t
        expect(obj.d).toBe(t);
        expect(t.a).toBe(10);
        expect(t.b).toBe('rainbow');
    });
});
