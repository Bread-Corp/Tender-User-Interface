import { Tags } from "./Tags.js";

export abstract class BaseTender {
    tenderID: string;
    title: string;
    status: string;
    publishedDate: Date;
    closingDate: Date;
    dateAppended: Date;
    source: string;
    tag: Tags[];
    description?: string;
    aiSummary?: string;
    supportingDocs?: string;

    // fallbacks where necessary
    constructor(data: any) {
        this.tenderID = data.tenderID ?? "Unknown ID";
        this.title = data.title ?? "Untitled Tender";
        this.status = data.status ?? "Pending";
        this.publishedDate = new Date(data.publishedDate);
        this.closingDate = new Date(data.closingDate);

        // check if data exists and valid - if not then fallback to current date and time
        this.dateAppended = data.dateAppended ? new Date(data.dateAppended) : new Date();
        this.source = data.source ?? "Unknown source";
        this.tag = data.tag ?? [];
        this.description = data.description;
        this.aiSummary = data.aiSummary;
        this.supportingDocs = data.supportingDocs;
    }

    isClosed(): boolean {
        return this.closingDate < new Date();
    }
}