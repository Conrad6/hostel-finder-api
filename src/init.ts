import { config as dotEnvConfig } from 'dotenv';
import { Container } from 'inversify';
import { plural } from 'pluralize';
import DocumentStore, { IDocumentStore, ObjectTypeDescriptor } from "ravendb";
import { Comment } from './models/Comment';
import { Hostel, HostelContact } from './models/Hostel';
import { Role } from './models/Role';
import { User } from "./models/User";
import { MainServer } from './server';



const userTypeDescriptor = {
    construct: (dto: object) => {
        const user: User = new User();
        const { id, dateCreated, lastUpdated, names, email, username, passwordHash, phone, normalizedUsername, roles } = dto as any;
        user.names = names;
        user.email = email;
        user.username = username;
        user.passwordHash = passwordHash;
        user.phone = phone;
        user.normalizedUsername = normalizedUsername;
        user.roles = roles;
        user.id = id;
        user.lastUpdated = lastUpdated;
        user.dateCreated = dateCreated;
        return user;
    },
    isType: (obj: object) => obj instanceof User,
    name: User.name
};

const roleTypeDescriptor = {
    construct: (dto: object) => {
        const role: Role = new Role();
        const { id, dateCreated, lastUpdated, name, normalizedName } = dto as any;
        role.id = id;
        role.dateCreated = dateCreated;
        role.lastUpdated = lastUpdated;
        role.name = name;
        role.normalizedName = normalizedName;

        return role;
    },
    isType: (obj: object) => obj instanceof Role,
    name: Role.name
};

const hostelTypeDescriptor = {
    construct: (dto: object) => {
        const hostel = new Hostel();
        const { id, dateCreated, lastUpdated, name, description, photos, price, contact, comments } = dto as any;
        hostel.id = id;
        hostel.dateCreated = dateCreated;
        hostel.lastUpdated = lastUpdated;
        hostel.name = name;
        hostel.description = description;
        hostel.photos = photos;
        hostel.price = price;
        hostel.contact = contact;
        hostel.comments = comments;

        return hostel;
    },
    isType: (obj: object) => obj instanceof Hostel,
    name: Hostel.name
};

const hostelContactTypeDescriptor = {
    construct: (dto: object) => {
        const contact = new HostelContact();
        const { hostel, phone, email } = dto as any;
        contact.email = email;
        contact.hostel = hostel;
        contact.phone = phone;

        return contact;
    },
    isType: (obj: object) => obj instanceof HostelContact,
    name: HostelContact.name
};

const commentTypeDescriptor = {
    construct: (dto: object) => {
        const _comment = new Comment();
        const { id, lastUpdated, dateCreated, user, comment, replies } = dto as any;
        _comment.id = id;
        _comment.lastUpdated = lastUpdated;
        _comment.dateCreated = dateCreated;
        _comment.user = user;
        _comment.replies = replies;
        _comment.comment = comment;

        return _comment;
    },
    isType: (obj: object) => obj instanceof Comment,
    name: Comment.name
};

export const ioc = new Container({ defaultScope: 'Singleton', skipBaseClassChecks: true });
export const TYPES = {
    userTypeDescriptor: Symbol.for('UserTypeDescriptor'),
    documentStore: Symbol.for('IDocumentStore'),
    roleTypeDescriptor: Symbol.for('RoleTypeDescriptor'),
    hostelTypeDescriptor: Symbol.for('HostelTypeDescriptor'),
    commentTypeDescriptor: Symbol.for('CommentTypeDescriptor'),
    mainServer: Symbol.for('MainServer'),
    ioc: Symbol.for('Ioc'),
    hostelContactTypeDescriptor: Symbol.for('HostelContactTypeDescriptor')
};


ioc.bind<ObjectTypeDescriptor<User>>(TYPES.userTypeDescriptor).toConstantValue(userTypeDescriptor);
ioc.bind<ObjectTypeDescriptor<Role>>(TYPES.roleTypeDescriptor).toConstantValue(roleTypeDescriptor);
ioc.bind<ObjectTypeDescriptor<Hostel>>(TYPES.hostelTypeDescriptor).toConstantValue(hostelTypeDescriptor);
ioc.bind<ObjectTypeDescriptor<HostelContact>>(TYPES.hostelContactTypeDescriptor).toConstantValue(hostelContactTypeDescriptor);
ioc.bind<ObjectTypeDescriptor<Comment>>(TYPES.commentTypeDescriptor).toConstantValue(commentTypeDescriptor);

if (process.env.NODE_ENV?.trim() === 'development') {
    if (dotEnvConfig({ path: `${process.cwd()}\\.development.env` }).error) {
        process.exit(1);
    }
} else {
    if (dotEnvConfig({ path: `${process.cwd()}\\.env` }).error) {
        process.exit(1);
    }
}

const docStore = new DocumentStore(process.env.RAVEN_DB_URL?.trim() || '', process.env.RAVEN_DB_DATABASE_NAME?.trim() || '');
docStore.conventions.findCollectionName = descriptor => plural(descriptor.name);
docStore.conventions.registerEntityType(userTypeDescriptor);
docStore.conventions.registerEntityType(roleTypeDescriptor);
docStore.conventions.registerEntityType(hostelTypeDescriptor);
docStore.conventions.registerEntityType(hostelContactTypeDescriptor);
docStore.conventions.registerEntityType(commentTypeDescriptor);

ioc.bind<IDocumentStore>(TYPES.documentStore).toConstantValue(docStore.initialize());
ioc.bind<Container>(Container).toSelf();
ioc.bind<MainServer>(TYPES.mainServer).to(MainServer);