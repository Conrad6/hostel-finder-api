import { BaseModel } from "./BaseModel";

export class Comment extends BaseModel {
    user?: string;
    comment?: string;
    replies?: string[];
}