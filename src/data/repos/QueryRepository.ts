import { BaseModel } from "../../models/BaseModel"
import { RepositoryBase, IRepositoryBase } from "./RepositoryBase";
import { IDocumentStore, ObjectTypeDescriptor, IDocumentQuery } from "ravendb";

export interface IQueryRepository<T extends BaseModel> extends IRepositoryBase<T> {
    query(): IDocumentQuery<T>;
}

export abstract class QueryRepository<T extends BaseModel> extends RepositoryBase<T> implements IQueryRepository<T> {
    protected constructor(store: IDocumentStore, descriptor: ObjectTypeDescriptor<T>){
        super(descriptor, store);
    }

    query = () => this.store.openSession()?.query(this.descriptor);
}