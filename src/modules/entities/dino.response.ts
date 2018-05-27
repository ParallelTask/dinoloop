// DinoResponse is just an abstraction over IDinoResponse
// IDinoResponse have all the properties which exist on DinoResponse
// However, DinoResponse is exposed to end user.
// limited API is provided, so as not to confuse the user with API
export abstract class DinoResponse {
    proceed?(result: any): void;
    throw?(err: Error): void;
}
