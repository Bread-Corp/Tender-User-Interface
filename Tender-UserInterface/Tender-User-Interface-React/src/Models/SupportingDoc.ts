export class SupportingDoc {
    name: string;
    url: string;

    constructor(data: any) {
        this.name = data.name ?? "Untitled";
        this.url = data.url ?? "";
    }
}