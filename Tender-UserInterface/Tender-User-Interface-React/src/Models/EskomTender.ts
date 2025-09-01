import { BaseTender } from "./BaseTender.js";
export class EskomTender extends BaseTender {

    tenderNumber: string;
    reference?: string;
    audience?: string;
    officeLocation?: string;
    email?: string;
    address?: string;
    province?: string;

    constructor(data: any) {
        super(data); 
        this.tenderNumber = data.tenderNumber ?? "Unknown";
        this.reference = data.reference ?? "";
        this.audience = data.audience ?? "General";
        this.officeLocation = data.officeLocation ?? "Not specified";
        this.email = data.email ?? "";
        this.address = data.address ?? "";
        this.province = data.province ?? "Unknown";
    }
}