import { FormField } from './formField';

export class FormFile {
    public section: string;
    public sectionElements: FormField[];

    constructor(sectionName?: string, elements?: FormField[]) {
        if (sectionName) { this.section = sectionName; }
        if (elements) { this.sectionElements = elements; }
    }
}
