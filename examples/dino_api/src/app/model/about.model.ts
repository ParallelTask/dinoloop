export class About {
    _id?: string;
    title?: string = 'I_am_the_title';
    content?: string = 'I_am_the_content';
    createdDate?: string;
    modified?: [{
        name?: string;
        timestamp?: string;
        action?: string;
        fields?: string[];
    }];
    isDeleted?: boolean;
}
