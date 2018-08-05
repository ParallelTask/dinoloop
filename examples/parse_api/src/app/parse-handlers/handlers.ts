import {
    IParseHandler,
    IParseProps,
    DinoModel
} from '../../../../index';
import { User } from '../controllers/user';

export const toNumberTen: IParseHandler = (props: IParseProps) => {
    return 10;
};

export const toNumber: IParseHandler = (props: IParseProps) => {
    return parseInt(props.value);
};

export const toJPG: IParseHandler = (props: IParseProps) => {
    return `${props.value}.jpg`;
};

export const toUser: IParseHandler = (props: IParseProps) => {
    return null;
};

export const toUserAdd: IParseHandler = (props: IParseProps) => {
    const dino: User = props.value;

    return `hello ${dino.name}`;
};

export const throwException: IParseHandler = (props: IParseProps) => {
    throw Error('TestError');
};

export const convertToProvidedData: IParseHandler = (props: IParseProps) => {
    return props.data.name;
};

export const returnProps: IParseHandler = (props: IParseProps) => {
    return {
        controllerName: props.controller.constructor.name,
        properties: props
    };
};

// You can aggregate the validation errors via keys
export const numValidation: IParseHandler =
    (props: IParseProps, model: DinoModel) => {
        model.isValid = false;
        model.values.push({
            key: props.key,
            value: props.value
        });
        model.errors.push({
            key: props.key,
            value: ['Should be Number', 'Max is 10']
        });

        return props.value;
    };

// You can aggregate the validation errors via keys
export const boolValidation: IParseHandler =
    (props: IParseProps, model: DinoModel) => {
        model.isValid = false;
        model.values.push({
            key: props.key,
            value: props.value
        });
        model.errors.push({
            key: props.key,
            value: ['Should be boolean', 'Only true is allowed']
        });

        return props.value;
    };
