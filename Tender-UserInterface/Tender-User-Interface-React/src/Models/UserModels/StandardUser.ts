import { TenderUser } from "./TenderUser.js";
import { Tags } from "../Tags.js";

export class StandardUser extends TenderUser {
    Address?: string;
    Tags: Tags[];

    constructor(data: any) {
        super(data); // pass common fields to TenderUser
        this.Address = data.Address ?? undefined;
        this.Tags = data.Tags ? data.Tags.map((t: any) => new Tags(t.id ?? undefined, t.name ?? t)) : [];
    }
}