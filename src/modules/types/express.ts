import { IDinoResponse } from './dino.types';
// export { Express, Router, Request, Response, NextFunction } from 'express';

export type Express = any;
export type Router = any;
export type Request = any;
export type Response = any;
export type NextFunction = any;

export interface IExpressResponse {
    locals: {
        dino: IDinoResponse
    }
}

export interface IExpressRequest {
    method?: string;
    baseUrl?: string;
    path?: string;
    originalUrl?: string;
}
