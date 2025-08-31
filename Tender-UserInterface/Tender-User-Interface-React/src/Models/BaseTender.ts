import { Tags } from "./Tags.js";

export abstract class BaseTender {
    tenderID: string;
    title: string;
    status: string;
    publishedDate: Date;
    closingDate: Date;
    dateAppended: Date;
    source: string;
    tags: Tags[];
    description?: string;
    supportingDocs?: string;

    constructor(data: any) {
        this.tenderID = data.tenderID;
        this.title = data.title;
        this.status = data.status;
        this.publishedDate = new Date (data.publishedDate);
        this.closingDate = new Date (data.closingDate);
        this.dateAppended = new Date (data.dateAppended);
        this.source = data.source;
        this.tags = data.tags;
        this.description = data.description;
        this.supportingDocs = data.supportingDocs;
    }

    isClosed(): boolean {
        return this.closingDate < new Date();
    }
}