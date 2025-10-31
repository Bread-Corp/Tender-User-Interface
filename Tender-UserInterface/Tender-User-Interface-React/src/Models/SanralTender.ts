import { BaseTender } from "./BaseTender.js";

export class SanralTender extends BaseTender {

    tenderNumber: string;
    category?: string;
    location?: string;
    email?: string;
    fullTextNotice?: string;

    constructor(data: any) {
        super(data); 
        this.tenderNumber = data.tenderNumber ?? "Unknown";
        this.category = data.category ?? "Not specified";
        this.location = data.location ?? "Not specified";
        this.email = data.email ?? "";
        this.fullTextNotice = data.fullTextNotice ?? "";
    }
}