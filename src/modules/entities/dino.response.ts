// DinoResponse is just an abstraction over IDinoProperties
// IDinoProperties have all the properties which exist on res.locals.dino
// However, DinoResponse is exposed to end user.
// limited API is provided, so as not to confuse the user with IDinoProperties API
export abstract class DinoResponse {
    proceed?(result: any): void;
    throw?(err: Error): void;
}
