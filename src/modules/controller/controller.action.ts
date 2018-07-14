import { IBindModelAttributeExtended, IActionMethodAttribute } from '../types';

export class ControllerAction {
    actionAttributes?: IActionMethodAttribute;

    constructor(actionAttributes: IActionMethodAttribute) {
        this.actionAttributes = actionAttributes;
    }

    static create(actionAttributes: IActionMethodAttribute): ControllerAction {
        return new ControllerAction(actionAttributes);
    }
}
