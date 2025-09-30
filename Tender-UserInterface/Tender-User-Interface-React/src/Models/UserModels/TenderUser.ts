export class TenderUser {
    userID: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    profilePicture?: string;
    isSuperUser: boolean;

    constructor(data: any) {
        this.userID = data.userID ?? crypto.randomUUID(); // fallback like Guid.NewGuid()
        this.fullName = data.fullName ?? "";
        this.email = data.email ?? "";
        this.phoneNumber = data.phoneNumber ?? undefined;
        this.role = data.role ?? "StandardUser"; // default role
        this.profilePicture = data.profilePicture ?? undefined;
        this.isSuperUser = data.isSuperUser ?? false; // default false
    }
}