import * as bodyParser from 'body-parser'
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as express from 'express';
import fetch from 'node-fetch'
import "reflect-metadata";
import {Container, inject} from 'inversify';
import {interfaces, InversifyExpressServer, TYPE} from 'inversify-express-utils'
import * as multer from "multer";
import * as http from 'http';   

// import classes annotated by @controller
import './controller/AuthController'
import './controller/InterestsController'
import './controller/AdminPrivilegeController'
import './controller/AdminController'
import './controller/UserInterestContoller'
import './controller/UserItemController'
import './controller/SwapRequestContoller'

import { AuthRepository } from './domain/models/auth/AuthRepository';
import { TYPES as DOMAIN_TYPES } from './domain/types';
import { TYPES as INFRASTRUCTURE_TYPES } from './infrastructure/types'
import { AuthRepositoryImp } from './domain/models/auth/AuthRepositoryImp';
import { MongoORMRepository } from './infrastructure/implementation/MongoORMRepository';
import { DALUser } from './infrastructure/entities/dal/DALUser';
import { EntityDataMapper } from './infrastructure/interfaces/EntityDataMapper';
import { DomainUser } from './domain/entities/DomainUser';
import { UserDataMapper } from './infrastructure/data_mapper/UserDataMapper';
import { PointsRepositoryImp } from './domain/models/points/PointsRepositoryImp';
import { PointsDataMapper } from './infrastructure/data_mapper/PointsDataMapper';
import { PointsRepository } from './domain/models/points/PointsRepository';
import { DomianPointSystem } from './domain/entities/DomainPointSystem';
import { DALPointSystem } from './infrastructure/entities/dal/DALPointSystem';
import { UserSchema } from './infrastructure/entities/mongo/schemas/UserSchema';
import { BaseSchema } from './infrastructure/interfaces/BaseSchema';
import {InterestsRepository} from "./domain/models/interests/InterestsRepository";
import {InterestsRepositoryImp} from "./domain/models/interests/InterestsRepositoryImp";
import {DomainInterest} from "./domain/entities/DomainInterest";
import {DALInterest} from "./infrastructure/entities/dal/DALInterest";
import {InterestDataMapper} from "./infrastructure/data_mapper/InterestDataMapper";
import {InterestSchema} from "./infrastructure/entities/mongo/schemas/InterestSchema";
import {AdminSchema} from "./infrastructure/entities/mongo/schemas/AdminSchema";
import {AdminRepositoryImp} from "./domain/models/admin/AdminRepositoryImp";
import {DomainAdmin} from "./domain/entities/DomainAdmin";
import {DALAdmin} from "./infrastructure/entities/dal/DALAdmin";
import {AdminDataMapper} from "./infrastructure/data_mapper/AdminDataMapper";
import {AdminRepository} from "./domain/models/admin/AdminRepository";
import {PrivilegeRepository} from "./domain/models/privileges/PrivilegeRepository";
import {PrivilegeRepositoryImp} from "./domain/models/privileges/PrivilegeRepositoryImp";
import {ControlPrivilegeSchema} from "./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema";
import {DomainControlPrivilege} from "./domain/entities/DomainControlPrivilege";
import {DALControlPrivilege} from "./infrastructure/entities/dal/DALControlPrivilege";
import {PrivilegeDataMapper} from "./infrastructure/data_mapper/PrivilegeDataMapper";
import {DALUserInterests} from "./infrastructure/entities/dal/DALUserInterests";
import {UserInterestSchema} from "./infrastructure/entities/mongo/schemas/UserInterestsSchema";
import {UserInterestsRepository} from "./domain/models/user_interests/UserInterestsRepository";
import {UserInterestsRepositoryImp} from "./domain/models/user_interests/UserInterestsRepositoryImp";
import {DomainUserInterests} from "./domain/entities/DomainUserInterests";
import {UserInterestsDataMapper} from "./infrastructure/data_mapper/UserInterestsDataMapper";
import {UserRepository} from "./domain/models/user/UserRepository";
import {UserRepositoryImp} from "./domain/models/user/UserRepositoryImp";
import {UserInterestService} from "./domain/services/UserInterestService";
import {DALItem} from "./infrastructure/entities/dal/DALItem";
import {ItemSchema} from "./infrastructure/entities/mongo/schemas/ItemSchema";
import {ItemDataMapper} from "./infrastructure/data_mapper/ItemDataMapper";
import {DomainItem} from "./domain/entities/DomainItem";
import {UserItemService} from "./domain/services/UserItemService";
import {UserItemRepository} from "./domain/models/user_item/UserItemRepository";
import {UserItemRepositoryImp} from "./domain/models/user_item/UserItemRepositoryImp";
import {SwapRequestRepositoryImp} from "./domain/models/swap_request/SwapRequestRepositoryImp";
import {SwapRequestRepository} from "./domain/models/swap_request/SwapRequestRepository";
import {SwapRequestSchema} from "./infrastructure/entities/mongo/schemas/SwapRequestSchema";
import {SwapRequestMapper} from "./infrastructure/data_mapper/SwapRequestMapper";
import {DALSwapRequest} from "./infrastructure/entities/dal/DALSwapRequest";
import {DomainSwapRequest} from "./domain/entities/DomainSwapRequest";
import {SwapRequestService} from "./domain/services/SwapRequestService";
import {MysqlORMRepository} from "./infrastructure/implementation/MysqlORMRepository";
import {ORMRepository} from "./infrastructure/implementation/ORMRepository";
import {AuthService} from "./domain/services/AuthService";
import {DomainAdminPrivilege} from "./domain/entities/DomainAdminPrivilege";
import {DALAdminPrivilege} from "./infrastructure/entities/dal/DALAdminPrivilege";
import {AdminPrivilegeDataMapper} from "./infrastructure/data_mapper/AdminPrivilegeDataMapper";
import {AdminPrivilegeRepositoryImp} from "./domain/models/admin/admin_privilege/AdminPrivilegeRepositoryImp";
import {AdminPrivilegeRepository} from "./domain/models/admin/admin_privilege/AdminPrivilegeRepository";
import { InterestsController } from './controller/InterestsController';

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
container.bind<SwapRequestRepository>(DOMAIN_TYPES.SwapRequestRepository).to(SwapRequestRepositoryImp);
container.bind<AdminPrivilegeRepository>(DOMAIN_TYPES.AdminPrivilegeRepository).to(AdminPrivilegeRepositoryImp);

//base-orm
container.bind<ORMRepository<DALUser>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserEntity).to(ORMRepository);
container.bind<ORMRepository<DALInterest>>(INFRASTRUCTURE_TYPES.ORMRepositoryForInterestEntity).to(ORMRepository);
container.bind<ORMRepository<DALAdmin>>(INFRASTRUCTURE_TYPES.ORMRepositoryForAdminEntity).to(ORMRepository);
container.bind<ORMRepository<DALControlPrivilege>>(INFRASTRUCTURE_TYPES.ORMRepositoryForPrivilegeEntity).to(ORMRepository);
container.bind<ORMRepository<DALUserInterests>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserInterestsEntity).to(ORMRepository);
container.bind<ORMRepository<DALItem>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserItemEntity).to(ORMRepository);
container.bind<ORMRepository<DALSwapRequest>>(INFRASTRUCTURE_TYPES.ORMRepositoryForSwapRequestEntity).to(ORMRepository);

//mysql orm
container.bind<MysqlORMRepository>(INFRASTRUCTURE_TYPES.MysqlORMRepository).to(MysqlORMRepository);

//mongo orm
container.bind<MongoORMRepository>(INFRASTRUCTURE_TYPES.MongoORMRepository).to(MongoORMRepository);


//Schemas
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.UserSchema).to(UserSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.InterestSchema).to(InterestSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.AdminSchema).to(AdminSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.PrivilegeSchema).to(ControlPrivilegeSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.UserInterestSchema).to(UserInterestSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.ItemSchema).to(ItemSchema);
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.SwapRequestSchema).to(SwapRequestSchema);

//data-mapper
container.bind<EntityDataMapper<DomainUser, DALUser>>(INFRASTRUCTURE_TYPES.EntityDataMapperForUser).to(UserDataMapper);
container.bind<EntityDataMapper<DomianPointSystem, DALPointSystem>>(INFRASTRUCTURE_TYPES.EntityDataMapperForPoint).to(PointsDataMapper);
container.bind<EntityDataMapper<DomainInterest, DALInterest>>(INFRASTRUCTURE_TYPES.EntityDataMapperForInterests).to(InterestDataMapper);
container.bind<EntityDataMapper<DomainAdmin, DALAdmin>>(INFRASTRUCTURE_TYPES.EntityDataMapperForAdmin).to(AdminDataMapper);
container.bind<EntityDataMapper<DomainControlPrivilege, DALControlPrivilege>>(INFRASTRUCTURE_TYPES.EntityDataMapperForPrivilege).to(PrivilegeDataMapper);
container.bind<EntityDataMapper<DomainUserInterests, DALUserInterests>>(INFRASTRUCTURE_TYPES.EntityDataMapperForUserInterests).to(UserInterestsDataMapper);
container.bind<EntityDataMapper<DomainItem, DALItem>>(INFRASTRUCTURE_TYPES.EntityDataMapperForItem).to(ItemDataMapper);
container.bind<EntityDataMapper<DomainSwapRequest, DALSwapRequest>>(INFRASTRUCTURE_TYPES.EntityDataMapperForSwapRequest).to(SwapRequestMapper);
container.bind<EntityDataMapper<DomainAdminPrivilege, DALAdminPrivilege>>(INFRASTRUCTURE_TYPES.EntityDataMapperForAdminPrivilege).to(AdminPrivilegeDataMapper);

//services
container.bind<UserInterestService>(DOMAIN_TYPES.UserInterestService).to(UserInterestService);
container.bind<UserItemService>(DOMAIN_TYPES.UserItemService).to(UserItemService);
container.bind<SwapRequestService>(DOMAIN_TYPES.SwapRequestService).to(SwapRequestService);
container.bind<AuthService>(DOMAIN_TYPES.AuthService).to(AuthService);

// build a server
let server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });
server.setConfig((app) => {
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
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json());

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './src/images/interests/')
        },
        filename: function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
                cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
        }
    })
    let upload = multer({ storage: storage })
    app.post('/api/v1/admin/interests/add', upload.single('file'), function(req, res){
        if (req.file && req.body.name && req.body.nameAR && req.body.adminId){
            req.body.imageUrl = req.file.filename;
            fetch('http://localhost:8000/api/v1/admin/interests/add-inner', { 
                method: 'POST',
                body:    JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((respond) => {
                if(respond.ok)
                    res.status(200).json({error: false, message: 'added successfully'})
                else
                    res.status(200).send({error: true, message: 'error occured'})
            })
            .catch((err) => {res.send({error: 'true', message: 'error occured'})})
        } else {
            res.status(200).json({message: 'imageFile, name, nameAR and adminId are required', error: true});
        }
        
    }); 
});

server.setErrorConfig((app) => {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
});

let app = server.build();
app.listen(8000);
