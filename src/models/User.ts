import { BaseModel } from "./BaseModel";
import { Role } from "./Role";

export class User extends BaseModel {
    names?: string;
    email?: string;
    username?: string;
    passwordHash?: string;
    phone?: string;
    normalizedUsername?: string;
    roles?: Role[];
}