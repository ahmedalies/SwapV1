import * as bodyParser from 'body-parser'
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';

import "reflect-metadata";
import {Container} from 'inversify';
import {interfaces, InversifyExpressServer, TYPE} from 'inversify-express-utils'

// import classes annotated by @controller
import './controller/AuthController'
import './controller/InterestsController'
import './controller/AdminController'
import './controller/UserInterestContoller'
import './controller/UserItemController'

import { AuthRepository } from './domain/models/auth/AuthRepository';
import { TYPES as DOMAIN_TYPES } from './domain/types';
import { TYPES as INFRASTRUCTURE_TYPES } from './infrastructure/types'
import { AuthRepositoryImp } from './domain/models/auth/AuthRepositoryImp';
import { MongoORMRepository } from './infrastructure/dal/implementation/MongoORMRepository';
import { DALUser } from './infrastructure/entities/dal/DALUser';
import { EntityDataMapper } from './infrastructure/dal/interfaces/EntityDataMapper';
import { DomainUser } from './domain/entities/DomainUser';
import { UserDataMapper } from './infrastructure/dal/data_mapper/UserDataMapper';
import { PointsRepositoryImp } from './domain/models/points/PointsRepositoryImp';
import { PointsDataMapper } from './infrastructure/dal/data_mapper/PointsDataMapper';
import { PointsRepository } from './domain/models/points/PointsRepository';
import { DomianPointSystem } from './domain/entities/DomainPointSystem';
import { DALPointSystem } from './infrastructure/entities/dal/DALPointSystem';
import { UserSchema } from './infrastructure/entities/mongo/schemas/UserSchema';
import { BaseSchema } from './infrastructure/entities/mongo/schemas/BaseSchema';
import {InterestsRepository} from "./domain/models/interests/InterestsRepository";
import {InterestsRepositoryImp} from "./domain/models/interests/InterestsRepositoryImp";
import {DomainInterest} from "./domain/entities/DomainInterest";
import {DALInterest} from "./infrastructure/entities/dal/DALInterest";
import {InterestDataMapper} from "./infrastructure/dal/data_mapper/InterestDataMapper";
import {InterestSchema} from "./infrastructure/entities/mongo/schemas/InterestSchema";
import {AdminSchema} from "./infrastructure/entities/mongo/schemas/AdminSchema";
import {AdminRepositoryImp} from "./domain/models/admin/AdminRepositoryImp";
import {DomainAdmin} from "./domain/entities/DomainAdmin";
import {DALAdmin} from "./infrastructure/entities/dal/DALAdmin";
import {AdminDataMapper} from "./infrastructure/dal/data_mapper/AdminDataMapper";
import {AdminRepository} from "./domain/models/admin/AdminRepository";
import {PrivilegeRepository} from "./domain/models/privileges/PrivilegeRepository";
import {PrivilegeRepositoryImp} from "./domain/models/privileges/PrivilegeRepositoryImp";
import {ControlPrivilegeSchema} from "./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";
import {DomainControlPrivilege} from "./domain/entities/DomainControlPrivilege";
import {DALControlPrivilege} from "./infrastructure/entities/dal/DALControlPrivilege";
import {PrivilegeDataMapper} from "./infrastructure/dal/data_mapper/PrivilegeDataMapper";
import {DALUserInterests} from "./infrastructure/entities/dal/DALUserInterests";
import {UserInterestSchema} from "./infrastructure/entities/mongo/schemas/UserInterestsSchema";
import {UserInterestsRepository} from "./domain/models/user_interests/UserInterestsRepository";
import {UserInterestsRepositoryImp} from "./domain/models/user_interests/UserInterestsRepositoryImp";
import {DomainUserInterests} from "./domain/entities/DomainUserInterests";
import {UserInterestsDataMapper} from "./infrastructure/dal/data_mapper/UserInterestsDataMapper";
import {UserRepository} from "./domain/models/user/UserRepository";
import {UserRepositoryImp} from "./domain/models/user/UserRepositoryImp";
import {UserInterestService} from "./domain/services/UserInterestService";
import {DALItem} from "./infrastructure/entities/dal/DALItem";
import {ItemSchema} from "./infrastructure/entities/mongo/schemas/ItemSchema";
import {ItemDataMapper} from "./infrastructure/dal/data_mapper/ItemDataMapper";
import {DomainItem} from "./domain/entities/DomainItem";
import {UserItemService} from "./domain/services/UserItemService";
import {UserItemRepository} from "./domain/models/user_item/UserItemRepository";
import {UserItemRepositoryImp} from "./domain/models/user_item/UserItemRepositoryImp";

// object container
let container = new Container();

//repositories
container.bind<AuthRepository>(DOMAIN_TYPES.AuthRepository).to(AuthRepositoryImp);
container.bind<PointsRepository>(DOMAIN_TYPES.PointSystemRepository).to(PointsRepositoryImp);
container.bind<InterestsRepository>(DOMAIN_TYPES.InterestsRepository).to(InterestsRepositoryImp);
container.bind<AdminRepository>(DOMAIN_TYPES.AdminRepository).to(AdminRepositoryImp);
container.bind<PrivilegeRepository>(DOMAIN_TYPES.PrivilegeRepository).to(PrivilegeRepositoryImp);
container.bind<UserInterestsRepository>(DOMAIN_TYPES.UserInterestsRepository).to(UserInterestsRepositoryImp);
container.bind<UserRepository>(DOMAIN_TYPES.UserRepository).to(UserRepositoryImp);
container.bind<UserItemRepository>(DOMAIN_TYPES.UserItemRepository).to(UserItemRepositoryImp);

//orm-mongo
container.bind<MongoORMRepository<DALUser>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserEntity).to(MongoORMRepository);
container.bind<MongoORMRepository<DALInterest>>(INFRASTRUCTURE_TYPES.ORMRepositoryForInterestEntity).to(MongoORMRepository);
container.bind<MongoORMRepository<DALAdmin>>(INFRASTRUCTURE_TYPES.ORMRepositoryForAdminEntity).to(MongoORMRepository);
container.bind<MongoORMRepository<DALControlPrivilege>>(INFRASTRUCTURE_TYPES.ORMRepositoryForPrivilegeEntity).to(MongoORMRepository);
container.bind<MongoORMRepository<DALUserInterests>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserInterestsEntity).to(MongoORMRepository);
container.bind<MongoORMRepository<DALItem>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserItemEntity).to(MongoORMRepository);

//Schemas
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.UserSchema).to(UserSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.InterestSchema).to(InterestSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.AdminSchema).to(AdminSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.PrivilegeSchema).to(ControlPrivilegeSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.UserInterestSchema).to(UserInterestSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.ItemSchema).to(ItemSchema);

//data-mapper
container.bind<EntityDataMapper<DomainUser, DALUser>>(INFRASTRUCTURE_TYPES.EntityDataMapperForUser).to(UserDataMapper);
container.bind<EntityDataMapper<DomianPointSystem, DALPointSystem>>(INFRASTRUCTURE_TYPES.EntityDataMapperForPoint).to(PointsDataMapper);
container.bind<EntityDataMapper<DomainInterest, DALInterest>>(INFRASTRUCTURE_TYPES.EntityDataMapperForInterests).to(InterestDataMapper);
container.bind<EntityDataMapper<DomainAdmin, DALAdmin>>(INFRASTRUCTURE_TYPES.EntityDataMapperForAdmin).to(AdminDataMapper);
container.bind<EntityDataMapper<DomainControlPrivilege, DALControlPrivilege>>(INFRASTRUCTURE_TYPES.EntityDataMapperForPrivilege).to(PrivilegeDataMapper);
container.bind<EntityDataMapper<DomainUserInterests, DALUserInterests>>(INFRASTRUCTURE_TYPES.EntityDataMapperForUserInterests).to(UserInterestsDataMapper);
container.bind<EntityDataMapper<DomainItem, DALItem>>(INFRASTRUCTURE_TYPES.EntityDataMapperForItem).to(ItemDataMapper);

//services
container.bind<UserInterestService>(DOMAIN_TYPES.UserInterestService).to(UserInterestService);
container.bind<UserItemService>(DOMAIN_TYPES.UserItemService).to(UserItemService);


// build a server
let server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });

server.setConfig((app) => {
    // mongodb connection
    const MONGO_URI = "mongodb://127.0.0.1:27017/swap-v2";
    mongoose.connect(MONGO_URI || process.env.MONGODB_URI, { useNewUrlParser: true })
        .then((res) => {
            //console.info(res)
        }).catch((err) => {
            console.error(err);
        });

    /*                 */
    /**** first run ****/
    /*                 */
    // Configuration.configureForFirstRun()
    // .then((res) => {
    //     console.info(res);
    // })
    // .catch((err) => {
    //     console.error(err);
    //
    // });

    let logger = morgan('dev');
    app.use(logger);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
});

server.setErrorConfig((app) => {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
});

let app = server.build();
app.listen(8000);