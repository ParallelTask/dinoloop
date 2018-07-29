import { IParseProps } from './types';
import { DinoModel } from '../entities';

export interface IMiddlewareClass {
    useClass?: Function;
    data?: any;
}

export declare type IMiddlewareProvider = Function | IMiddlewareClass;

export interface IControllerAttribute {
    filters?: IMiddlewareProvider[];
    middlewares?: IMiddlewareProvider[];
    exceptions?: IMiddlewareProvider[];
    result?: IMiddlewareProvider[];
    use?: any[];
}

export interface IControllerAttributeExtended extends IControllerAttribute {
    prefix?: string;
}

export interface IControllerAttributeProvider {
    prefix?: string;
    afterActionFilters?: IMiddlewareProvider[];
    beforeActionFilters?: IMiddlewareProvider[];
    middlewares?: IMiddlewareProvider[];
    exceptions?: IMiddlewareProvider[];
    result?: IMiddlewareProvider[];
    use?: any[];
}

export declare type IRouterCallBack = () => any;

export declare type IParseHandler =
    (props: IParseProps, model?: DinoModel) => any;

export interface IParseAttribute {
    key?: string;
    handler?: IParseHandler;
    controller?: any;
    action?: string;
    data?: any;
    isQueryParam?: boolean;
}

export interface IActionMethodAttribute {
    route?: string;
    httpVerb?: string;
    isAsync?: boolean;
    sendsResponse?: boolean;
    actionArguments?: IParseAttribute[];
}
