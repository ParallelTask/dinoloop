import {
    ApiController,
    Controller,
    HttpGet,
    HttpPost,
    Parse,
    Async,
    QueryParam
} from '../../../../index';
import {
    toNumberTen,
    toJPG,
    toNumber,
    toUser,
    throwException,
    convertToProvidedData,
    numValidation,
    boolValidation,
    returnProps,
    toUserAdd
} from '../parse-handlers/handlers';
import { User } from './user';

@Controller('/home')
export class HomeController extends ApiController {

    @HttpGet('/withoutParse/:id/:photo')
    withoutParse(id: number, photo: string): any {
        return {
            id: id,
            photo: photo,
            message: '.jpg is not added to photo, and id holds string type'
        };
    }

    // converts first argument to number 
    // and transforms second argument with jpg extension
    @HttpGet('/withParse/:id/:photo')
    withParse(@Parse(toNumber) id: number, @Parse(toJPG) photo: string): any {
        return {
            id: id,
            photo: photo,
            message: '.jpg added to photo, and id must be converted to number'
        };
    }

    // If exception is thrown by @Parse, then it bubbles up error middleware chain
    // Response will be sent by ServerParseErrorMiddleware
    @HttpGet('/parseException/:id')
    parseException(@Parse(throwException) id: number): any {
        return {
            message: '.jpg added to photo, and id must be converted to number'
        };
    }

    // Async version
    // If exception is thrown by @Parse, then it bubbles up error middleware chain
    // Response will be sent by ServerParseErrorMiddleware
    @Async()
    @HttpGet('/asyncParseException/:id')
    async asyncParseException(@Parse(throwException) id: number): Promise<string> {
        return '.jpg added to photo, and id must be converted to number';
    }

    // ignores what is passed, always transforms id value to 10
    @HttpGet('/getTen/:id')
    getTen(@Parse(toNumberTen) id: number): any {
        return {
            id: id,
            message: 'No matter what you pass to /:id, it would always transform to 10'
        };
    }

    @HttpPost('/postTen/:id')
    postTen(@Parse(toUser) user: User, @Parse(toNumberTen) id: number): any {
        return {
            user: user,
            id: id,
            message: 'No matter what you post in body, user will be null and id is ten'
        };
    }

    @HttpPost('/postUser/:id')
    postUser(@Parse(toUserAdd) user: User, @Parse(toNumberTen) id: number): any {
        return {
            user: user,
            id: id,
            message: 'Provide { "name": "dino" } as body and name is prepended with "hello"'
        };
    }

    // If the first parameter key is provided in variable segment
    // dino still injects the http-body into first parameter 
    // and not the variable segment value
    @HttpPost('/pickPost/:user')
    pickPost(@Parse(toUserAdd) user: User): any {
        return {
            user: user,
            message: 'user is picked from http-body and not from segment'
        };
    }

    // If the first parameter key is provided in variable segment
    // dino still injects the http-body into first parameter 
    // and not the variable segment value
    @HttpPost('/pickPostUser/:user')
    pickPostUser(@Parse(toUserAdd) body: User, @Parse(toNumber) user: number): any {
        return {
            body: body,
            user: user,
            message: 'user is picked from the segment and body from http-body'
        };
    }

    @HttpPost('/postWithoutParse')
    post(user: User): any {
        return {
            user: user,
            message: 'You will receive exactly what you have passed in the body'
        };
    }

    @HttpPost('/postWithoutParam')
    postWithoutParam(): any {
        return {
            message: 'Should not break and continue working'
        };
    }

    @HttpGet('/parseWithData/:id')
    parseWithData(@Parse(convertToProvidedData, String) id: number): any {
        return {
            id: id,
            message: 'Should return "String" always'
        };
    }

    @HttpGet('/props/:id')
    props(@Parse(returnProps, 'dummyData') id: number): any {
        return {
            props: id,
            message: 'Should return props properties'
        };
    }

    @HttpGet('/parseValidations/:id/:name')
    parseValidations(@Parse(numValidation) id: number,
        @Parse(boolValidation) name: boolean): any {
        return {
            id: id,
            name: name,
            message: 'Should return validation errors for model',
            isValid: this.model.isValid,
            modelErrors: this.model.errors,
            values: this.model.values
        };
    }

    // GET /queryParam?search=john
    // without parser
    @HttpGet('/queryParam')
    withQueryParam(@QueryParam() search: string): any {
        return {
            search: search
        };
    }

    // GET /queryParam?id=45
    // with parser
    @HttpGet('/queryParamParse')
    withQueryParamParse(@QueryParam(toNumber) id: number): any {
        return {
            id: id
        };
    }

    // GET /queryParam/45?search=john
    // with parser
    @HttpGet('/queryParam/:id')
    withQueryParamAndParse(@Parse(toNumber) id: number,
        @QueryParam() search: string): any {
        return {
            id: id,
            search: search
        };
    }

    // GET /queryParam/45?id=32
    // with parser
    @HttpGet('/queryParamAndParse/:id')
    queryParamAndParse(@QueryParam() id: string): any {
        return {
            id: id,
            req: 'Perform GET /queryParam/45?id=32',
            msg:
                'should map from query string. Should return 32'
        };
    }

    // GET /queryParam/45?id=32
    // with parser
    @HttpGet('/paramParser/:id')
    paramParser(id: string): any {
        return {
            id: id,
            req: 'Perform GET /queryParam/45?id=32',
            msg:
                'should map from variable segment. Should return 45'
        };
    }
}
