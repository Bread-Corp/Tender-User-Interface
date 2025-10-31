import { BaseTender } from "./BaseTender.js";

export class TransnetTender extends BaseTender {

    tenderNumber: string;
    category?: string;
    region?: string;
    contactPerson?: string;
    email?: string;
    institution?: string;
    tenderType?: string;

    constructor(data: any) {
        super(data);
        this.tenderNumber = data.tenderNumber ?? "Unknown";
        this.category = data.category ?? "Not specified";
        this.region = data.region ?? "Not specified";
        this.contactPerson = data.contactPerson ?? "Not specified";
        this.email = data.email ?? "";
        this.institution = data.institution ?? "Not specified";
        this.tenderType = data.tenderType ?? "Not specified";
    }
}