import {
    AppStartMiddleware
} from '../../../../index';

export class InitMiddleware extends AppStartMiddleware {
    invoke(): void {
        console.log('InitMiddleware invoked');
    }
}
