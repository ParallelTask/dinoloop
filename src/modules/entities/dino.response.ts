// DinoResponse is just an abstraction over IDinoProperties
// IDinoProperties have all the properties which exist on res.locals.dino.
// DinoResponse abstracts and exposes its subset to end consumer.
// limited API is provided, not to confuse the user with IDinoProperties.
export abstract class DinoResponse {
    /**
     * Proceeds to next middleware in the chain
     */
    proceed?(result: any): void;

    /**
     * Proceeds to next error middleware in the chain
     */
    throw?(err: Error): void;
}
