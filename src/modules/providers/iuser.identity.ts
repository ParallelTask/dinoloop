
// Injecting this service into constructor dependencies would have instance per request.
// All the services resolved would have same IUserIdentity instance for the entire request.
// Hence providing UserIdentity concept which is similar to C# WebApi

/**
 * Contains information associated with request/user
 */
export abstract class IUserIdentity {
    abstract set(key: string, val: any): void;
    abstract get(key: string): any;
    abstract contains(key: string): boolean;
    abstract clear(): void;
    abstract remove(key: string): void;
}
