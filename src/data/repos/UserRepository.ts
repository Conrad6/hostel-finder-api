import { IQueryRepository, QueryRepository } from "./QueryRepository";
import { User } from "../../models/User";
import { inject } from "inversify";
import { TYPES } from "../../init";
import { IDocumentStore, ObjectTypeDescriptor } from "ravendb";
import { injectable } from 'inversify';

export interface IUserRepository extends IQueryRepository<User> {
}

@injectable()
export abstract class UserRepository extends QueryRepository<User> implements IUserRepository {
    protected constructor(
        @inject(TYPES.documentStore) store: IDocumentStore,
        @inject(TYPES.userTypeDescriptor) descriptor: ObjectTypeDescriptor<User>
    ) {
        super(store, descriptor);
    }
}