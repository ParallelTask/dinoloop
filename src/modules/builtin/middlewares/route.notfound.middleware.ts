// tslint:disable-next-line:no-require-imports
import pathToRegexp = require('path-to-regexp');
import { RequestStartMiddleware } from '../../filter';
import { RouteNotFoundException } from '../exceptions';
import { Response, Request } from '../../types';
import { IRouteTable } from '../../interfaces';

// it would proceed to next handler only if valid route is matched
// if valid route is not found, it fires error middleware chain
/**
 * Compares the requested route against the registered routes
 * @Throws RouteNotFoundException
 */
export class RouteNotFoundMiddleware extends RequestStartMiddleware {
    private routes: RegExp[] = [];
    private isRouteTableLoaded = false;

    constructor(private routeTable: IRouteTable) {
        super();
    }

    invoke(request: Request, response: Response, next): void {

        if (this.isRouteTableLoaded === false) {
            // load the routes and create UrlParser objects
            let routes = this.routeTable.getRoutes();
            for (const route of routes) {
                this.routes.push(pathToRegexp(route));
            }
            this.isRouteTableLoaded = true;
        }

        // Note: Following format should match with expression in "route.table.ts"
        // '/[httpVerb]_[route]'
        let requestUrl =
            `/${request.method}_${request.baseUrl}${request.path}`.toLowerCase();
        let isRouteMatched = false;

        for (const route of this.routes) {
            if (route.test(requestUrl)) {
                isRouteMatched = true;
                break;
            }
        }

        if (isRouteMatched) {
            next();
        } else {
            next(new RouteNotFoundException(request.method,
                `${request.baseUrl}${request.path}`));
        }
    }
}
