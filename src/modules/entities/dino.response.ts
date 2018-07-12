// DinoResponse is just an abstraction over IDinoProperties
// IDinoProperties have all the properties which exist on res.locals.dino.
// DinoResponse abstracts and exposes its subset to end consumer.
// limited API is provided, not to confuse the user with IDinoProperties.
export abstract class DinoResponse {
    proceed?(result: any): void;
    throw?(err: Error): void;
}
