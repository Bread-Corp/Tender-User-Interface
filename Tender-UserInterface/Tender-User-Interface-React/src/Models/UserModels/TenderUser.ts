export class TenderUser {
    UserID: string;
    FullName: string;
    Email: string;
    PhoneNumber?: string;
    Role: string;
    ProfilePicture?: string;
    IsSuperUser: boolean;

    constructor(data: any) {
        this.UserID = data.UserID ?? undefined; // fallback like Guid.NewGuid()
        this.FullName = data.FullName ?? "";
        this.Email = data.Email ?? "";
        this.PhoneNumber = data.PhoneNumber ?? undefined;
        this.Role = data.Role ?? "StandardUser"; // default role
        this.ProfilePicture = data.ProfilePicture ?? undefined;
        this.IsSuperUser = data.IsSuperUser ?? false; // default false
    }
}