import {
    Ok,
    NoContent,
    BadRequest,
    Unauthorized,
    NotFound,
    HttpStatusCode,
    HttpResponseMessage
} from '../../../index';

describe('modules.builtin.http_response.spec', () => {
    it('Ok.verify_properties_without_content', () => {
        let o = Ok();
        expect(o.statusCode).toBe(HttpStatusCode.oK);
        expect(o.content).toBe(undefined);
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('Ok.verify_properties_with_content', () => {
        let o = Ok('test');
        expect(o.statusCode).toBe(HttpStatusCode.oK);
        expect(o.content).toBe('test');
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('NoContent.verify_properties', () => {
        let o = NoContent();
        expect(o.statusCode).toBe(HttpStatusCode.noContent);
        expect(o.content).toBe(undefined);
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('BadRequest.verify_properties_without_content', () => {
        let o = BadRequest();
        expect(o.statusCode).toBe(HttpStatusCode.badRequest);
        expect(o.content).toBe(undefined);
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('BadRequest.verify_properties_with_content', () => {
        let o = BadRequest('test');
        expect(o.statusCode).toBe(HttpStatusCode.badRequest);
        expect(o.content).toBe('test');
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('Unauthorized.verify_properties_without_content', () => {
        let o = Unauthorized();
        expect(o.statusCode).toBe(HttpStatusCode.unauthorized);
        expect(o.content).toBe(undefined);
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('Unauthorized.verify_properties_with_content', () => {
        let o = Unauthorized('test');
        expect(o.statusCode).toBe(HttpStatusCode.unauthorized);
        expect(o.content).toBe('test');
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('NotFound.verify_properties_without_content', () => {
        let o = NotFound();
        expect(o.statusCode).toBe(HttpStatusCode.notFound);
        expect(o.content).toBe(undefined);
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
    it('NotFound.verify_properties_with_content', () => {
        let o = NotFound('test');
        expect(o.statusCode).toBe(HttpStatusCode.notFound);
        expect(o.content).toBe('test');
        expect(o instanceof HttpResponseMessage).toBe(true);
    });
});
