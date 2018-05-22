import { IRouterCallBack, IBindModelAttributeExtended } from './attribute';
import { IDIContainer } from '../interfaces/idino';
import { Express } from './express';

export interface IDinoResponse {
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

export interface IActionMethodAttributes {
    route: string;
    httpVerb: string;
    isAsync: boolean;
    sendsResponse: boolean;
    observableResponse: boolean;
    bindsModel: IBindModelAttributeExtended;
}
