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

export interface IBindModelAttribute {
    stopOnError?: boolean;
    raiseModelError?: boolean;
}

export interface IControllerAttributeExtended extends IControllerAttribute {
    prefix?: string;
}

export interface IBindModelAttributeExtended {
    model?: Function;
    options?: IBindModelAttribute;
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