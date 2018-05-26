export abstract class IDateService {
    abstract UTCString(): string;
}

export class DateService implements IDateService {

    UTCString(): string {
        return new Date().toUTCString();
    }
}
