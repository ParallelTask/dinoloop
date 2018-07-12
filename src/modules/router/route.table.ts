import { IRouteTable } from '../interfaces';
import { Attribute, RouteAttribute } from '../constants';

// RouteTable has the list of routes registered with dino
// but these routes are registered after invoking .bind().
export class RouteTable implements IRouteTable {
    private routes: string[] = [];

    add(route: string, httpVerb: string): void {
        // if httpVerb is 'all', it should respond to every httpverb
        // we could use router's named segments to achieve this
        const url =
            httpVerb === RouteAttribute[Attribute.httpAll] ?
                `/:verb_${route}` : `/${httpVerb}_${route}`;
        this.routes.push(url.toLowerCase());
    }

    getRoutes(): string[] {
        return this.routes;
    }

    static create(): RouteTable {
        return new RouteTable();
    }
}
