export interface IKeyValuePair {
    key?: string;
    value?: any;
}

export class KeyValuePair {
    key: string;
    value: any;
}

export class ModelError {
    key: string;
    value: string[];
}

export interface IParseProps {
    action: string;
    controller: any;
    key: string;
    data: any;
    value: any;
}
