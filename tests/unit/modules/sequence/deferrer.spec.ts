import { Deferrer } from '../../index';

describe('modules.sequence.deferrer.spec', () => {
    it('run.when_promise_resolved', async () => {
        let data = await Deferrer.run<string>((res, rej) => {
            setTimeout(() => {
                res('success!');
            }, 20);
        });
        expect(data).toBe('success!');
    });
    it('run.when_promise_rejected', async () => {
        try {
            let data = await Deferrer.run<string>((res, rej) => {
                setTimeout(() => {
                    rej(new Error('test_error'));
                }, 20);
            });
            // If code does not throw error,
            // following line will make sure to fail the test case
            expect(false).toBeTruthy();
        } catch (err) {
            expect(err).toEqual(new Error('test_error'));
        }
    });
});
