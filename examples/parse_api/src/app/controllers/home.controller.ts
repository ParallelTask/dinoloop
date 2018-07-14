import {
    ApiController,
    Controller,
    HttpGet,
    HttpPost,
    HttpAll,
    Parse,
    Async
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
    returnProps
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
            modelErrors: this.model.modelErrors,
            values: this.model.values
        };
    }
}
