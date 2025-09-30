import { TenderUser } from "./TenderUser.js";
import { Tags } from "../Tags.js";

export class StandardUser extends TenderUser {
    address?: string;
    tags: Tags[];

    constructor(data: any) {
        super(data); // pass common fields to TenderUser
        this.address = data.address ?? undefined;
        this.tags = data.tags ? data.tags.map((t: any) => new Tags(t.id, t.name)) : [];
    }
}