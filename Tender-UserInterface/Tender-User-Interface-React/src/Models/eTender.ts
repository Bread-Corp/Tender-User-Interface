import { BaseTender } from "./BaseTender.js";

export class ETender extends BaseTender {

    tenderNumber: string;
    audience?: string;
    officeLocation?: string;
    email?: string;
    address?: string;
    province?: string;

    // fallbacks for missing data
    constructor(data: any) {
        super(data)
        this.tenderNumber = data.tenderNumber ?? "Unknown";
        this.audience = data.audience ?? "General";
        this.officeLocation = data.officeLocation ?? "Not specified";
        this.email = data.email ?? "";
        this.address = data.address ?? "";
        this.province = data.province ?? "Unknown";
    }
}