// tslint:disable-next-line:no-require-imports
import UrlParser = require('url-pattern');
import { RequestStartMiddleWare } from '../../filter/filter';
import { RouteNotFoundException } from '../exceptions/exceptions';
import { IExpressResponse, IExpressRequest } from '../../types/express';
import { IRouteTable } from '../../interfaces/idino';

// it would proceed to next handler only if valid route is matched
// if valid route is not found, it fires error middleware chain
/**
 * Compares the requested route against the registered routes
 */
export class RouteNotFoundMiddleware extends RequestStartMiddleWare {
    private routes: string[] = [];
    constructor(private routeTable: IRouteTable) {
        super();
        this.routes = this.routeTable.getRoutes();
    }

    invoke(request: IExpressRequest, response: IExpressResponse, next): void {

        let routes = this.routes;

        // Note: Following format should match with the expression provided in "route.table.ts"
        // '/[httpVerb]_[route]'
        let requestUrl = `/${request.method}_${request.baseUrl}${request.path}`.toLowerCase();
        let isRouteMatched = false;

        for (const route of routes) {
            let urlParser = new UrlParser(route);
            let values = urlParser.match(requestUrl);
            if (values !== null) {
                isRouteMatched = true;
                break;
            }
        }

        if (isRouteMatched) {
            next();
        } else {
            next(new RouteNotFoundException(request.method, `${request.baseUrl}${request.path}`));
        }
    }
}