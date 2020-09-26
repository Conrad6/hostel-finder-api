import { IDocumentStore, ObjectTypeDescriptor } from 'ravendb';
import { BaseModel } from "../../models/BaseModel";

export interface IRepositoryBase<T extends BaseModel> {
    create(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<void>;
    read(id: string): Promise<T | undefined | null>;
    deleteById(id: string): Promise<void>;
    delete(entity: T): Promise<void>;
}

export abstract class RepositoryBase<T extends BaseModel> implements IRepositoryBase<T> {
    protected constructor(
        protected readonly descriptor: ObjectTypeDescriptor<T>,
        protected readonly store: IDocumentStore
    ) {
    }

    delete = (entity: T) => new Promise<void>((resolve, reject) => {
        const session = this.store.openSession();
        if (!session) {
            if (reject) {
                reject('Could not create database session');
            }
            return;
        }

        try {
            session.delete(entity)
                .then(() => session.saveChanges())
                .then(resolve);
        } catch (error) {
            reject(error);
        } finally {
            session.dispose();
        }
    });

    deleteById = (id: string) => new Promise<void>((resolve, reject) => {
        const session = this.store.openSession();
        if (!session) {
            if (reject) {
                reject('Could not create database session');
            }
            return;
        }

        try {
            session.delete(id)
                .then(() => session.saveChanges())
                .then(resolve);
        } catch (error) {
            reject(error);
        } finally {
            session.dispose();
        }
    });

    read = (id: string) => new Promise<T | undefined | null>((resolve, reject) => {
        const session = this.store.openSession();
        if (!session) {
            if (reject) {
                reject('Could not create database session');
            }
            return;
        }

        try {
            session.load(id)
                .then(e => {
                    if (!e) {
                        resolve(null);
                        return;
                    }
                    delete (e as any)['@metadata'];
                    resolve(e as T);
                });
        } catch (error) {
            reject(error);
        } finally {
            session.dispose();
        }
    });

    update = (id: string, entity: T) => new Promise<void>((resolve, reject) => {
        const session = this.store.openSession();
        if (!session) {
            if (reject) {
                reject('Could not create database session');
            }
            return;
        }

        try {
            session.load(id)
                .then(e => {
                    if (!e) {
                        resolve();
                        return;
                    }
                    return e;
                })
                .then(e => {
                    for (const key in entity) {
                        (e as any)[key] = entity[key];
                    }
                    const now = new Date(Date.now());
                    (e as T).lastUpdated = now;
                    return e;
                })
                .then(e => session.saveChanges())
                .then(resolve);
        } catch (error) {
            reject(error);
        } finally {
            session.dispose();
        }
    });

    create = (entity: T) => new Promise<T>((resolve, reject) => {
        delete entity.id;
        delete entity.dateCreated;
        delete entity.lastUpdated;

        const now = new Date(Date.now());
        entity.dateCreated = now;
        entity.lastUpdated = now;
        const session = this.store.openSession();
        if (!session) {
            if (reject) {
                reject('Could not create database session');
            }
            return;
        }

        try {
            session.store(entity, undefined, this.descriptor)
                .then(() => session.saveChanges())
                .then(() => delete (entity as any)['@metadata'])
                .then(() => resolve(entity));
        } catch (error) {
            reject(error);
        } finally {
            session.dispose();
        }
    });
}