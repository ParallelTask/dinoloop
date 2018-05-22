export abstract class DinoResponse {
    result?: any;
    proceed?(result: any): void;
    throw?(err: Error): void;
}
