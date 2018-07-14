import { RequestEndMiddleware } from '../../filter';
import { DataUtility } from '../../utility';
import { Response } from '../../types';
import { HttpStatusCode } from '../../constants';

// If user did not configure requestEnd middleware to send response
// then ResponseMiddleware is the last requestEnd middleware that gets fired,
// sends json response by default.
/**
 * Formats result as JSON response
 */
export class ResponseEndMiddleware extends RequestEndMiddleware {
    invoke(request, response: Response, next, result): void {

        if (DataUtility.isUndefined(result)) {
            response.status(HttpStatusCode.noContent).json();
        } else {
            response.status(HttpStatusCode.oK).json(result);
        }
    }
}
