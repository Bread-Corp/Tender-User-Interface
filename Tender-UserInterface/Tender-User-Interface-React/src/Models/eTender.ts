import { BaseTender } from "./BaseTender.js";

export class ETender extends BaseTender {

    tenderNumber?: string;
    procurementMethod?: string;
    procurementMethodDetails?: string;
    procuringEntity?: string;
    currency?: string;
    value?: number; // decimal gets converted to number in ts
    category?: string;
    tenderer?: string;

    // fallbacks for missing data
    constructor(data: any) {
        super(data)
        this.tenderNumber = data.tenderNumber ?? "Unknown";
        this.procurementMethod = data.procurementMethod ?? "Not specified";
        this.procurementMethodDetails = data.procurementMethodDetails ?? "Not specified";
        this.procuringEntity = data.procuringEntity ?? "Not specified";
        this.currency = data.currency ?? "ZAR";
        this.value = data.value ?? 0;
        this.category = data.category ?? "General";
        this.tenderer = data.tenderer ?? "Not provided";
    }
}