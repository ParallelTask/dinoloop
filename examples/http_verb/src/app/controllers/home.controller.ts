import {
    ApiController,
    Controller,
    HttpGet,
    SendsResponse,
    HttpPost,
    HttpAll
} from '../../../../index';

@Controller('/home')
export class HomeController extends ApiController {

    // verifies if get is working
    @SendsResponse()
    @HttpGet('/name')
    getName(): void {
        this.response.json('HomeController');
    }

    // verifies if named segments are working
    @SendsResponse()
    @HttpGet('/get/:id')
    get(id: string): void {
        this.response.json(`get => params.id: ${this.request.params.id} and id: ${id}`);
    }

    // verifies if named segments are working
    @SendsResponse()
    @HttpGet('/get/:id/fotos/:image')
    getMore(image: string, id: string): void {
        this.response.json(`get => params.id: ${this.request.params.id},
        params.image: ${this.request.params.image} and
        id: ${id}, image: ${image}`);
    }

    // verifies if named segments and query-strings are mapped.
    // Following are the routes to request
    // server:8088/api/home/query/stack?search=queue
    // id => stack, search = queue
    // server:8088/api/home/query/stack?name=queue
    // id => stack, search = undefined
    // server:8088/api/home/query/stack?search=queue&search=list
    // id => stack, search = queue, list
    @SendsResponse()
    @HttpGet('/query/:name')
    query(name: string, search: string): void {
        this.response.json(`get => params.name: ${this.request.params.name},
        and name: ${name}, search: ${search}`);
    }

    // verifies if this method responds to all http-verbs
    @SendsResponse()
    @HttpAll('/all/:id')
    all(id: string): void {
        this.response.json(`get => params.id: ${this.request.params.id} and id: ${id}`);
    }

    // verifies if request-body is injecting into first argument and also named segments
    @SendsResponse()
    @HttpPost('/post/:id')
    post(body: any, id: string): void {
        this.response.json(`post => params.id: ${this.request.params.id} and id: ${id}.
        and request.body: ${ JSON.stringify(this.request.body)}, injected args:
            ${ JSON.stringify(body)}`);
    }
}
