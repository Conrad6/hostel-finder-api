import { BaseModel } from "./BaseModel";
import { Comment } from "./Comment";

export class Hostel extends BaseModel {
    name?: string;
    description?: string;
    photos?: string[];
    price?: number;
    contact?: HostelContact;
    comments?: Comment[];
}

// tslint:disable-next-line: max-classes-per-file
export class HostelContact {
    hostel?: string;
    phone?: string[];
    email?: string[];
}