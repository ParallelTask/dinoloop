import { IRouterCallBack } from './attribute';
import { IDIContainer } from '../interfaces';
import { Express } from './express';

export interface IDinoProperties {
    context?: any;
    result?: any;
    proceed?(result: any): void;
    throw?(err: Error): void;
}

export interface IRouterConfig {
    diContainer: IDIContainer;
    routerCb: IRouterCallBack;
    enableTaskContext: boolean;
}

export interface IDinoContainerConfig {
    app: Express;
    baseUri: string;
    raiseModelError: boolean;
    enableTaskContext: boolean;
    routerCallback: IRouterCallBack;
    diContainer: any;
    diResolveCb: any;
}
