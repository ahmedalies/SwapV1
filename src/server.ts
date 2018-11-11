import * as bodyParser from 'body-parser'
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';

import "reflect-metadata";
import {Container} from 'inversify';
import {interfaces, InversifyExpressServer, TYPE} from 'inversify-express-utils'

// import classes annotated by @controller
import './controller/AuthController'

import { AuthRepository } from './domain/models/interfaces/AuthRepository';
import { TYPES as DOMAIN_TYPES } from './domain/types';
import { TYPES as INFRASTRUCTURE_TYPES } from './infrastructure/dal/types'
import { AuthRepositoryImp } from './domain/models/implementation/AuthRepositoryImp';
import { ORMRepository } from './infrastructure/dal/implementation/ORMRepository';
import { MongoUser } from './infrastructure/dal/entities/mongo/schemas/dal/MongoUser';
import { EntityDataMapper } from './infrastructure/dal/interfaces/EntityDataMapper';
import { DomainUser } from './domain/entities/DomainUser';
import { AuthDataMapper } from './infrastructure/dal/implementation/AuthDataMapper';
import { PointsRepositoryImp } from './domain/models/implementation/points/PointsRepositoryImp';
import { PointsDataMapper } from './infrastructure/dal/implementation/PointsDataMapper';
import { PointsRepository } from './domain/models/interfaces/points/PointsRepository';
import { DomianPointSystem } from './domain/entities/DomainPointSystem';
import { MongoPointSystem } from './infrastructure/dal/entities/mongo/schemas/dal/MongoPointSystem';
import { MongoUserSchema } from './infrastructure/dal/entities/mongo/schemas/UserSchema';
import { BaseSchema } from './infrastructure/dal/entities/mongo/schemas/BaseSchema';

// object container
let container = new Container();

//interface
container.bind<AuthRepository>(DOMAIN_TYPES.AuthRepository).to(AuthRepositoryImp)
container.bind<PointsRepository>(DOMAIN_TYPES.PonitSystemRepository).to(PointsRepositoryImp)

//orm-mongo
container.bind<ORMRepository<MongoUser>>(INFRASTRUCTURE_TYPES.ORMRepositoryForUserEntity).to(ORMRepository)
container.bind<BaseSchema>(INFRASTRUCTURE_TYPES.UserMongoSchema).to(MongoUserSchema)

//data-mapper
container.bind<EntityDataMapper<DomainUser, MongoUser>>(INFRASTRUCTURE_TYPES.EntityDataMApperForAuth).to(AuthDataMapper)
container.bind<EntityDataMapper<DomianPointSystem, MongoPointSystem>>(INFRASTRUCTURE_TYPES.EntityDataMApperForPoint).to(PointsDataMapper)



// build a server
let server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" });

server.setConfig((app) => {
    // mongodb connection
    const MONGO_URI = "mongodb://127.0.0.1:27017/swap-v2";
    mongoose.connect(MONGO_URI || process.env.MONGODB_URI, { useNewUrlParser: true });

    var logger = morgan('dev');
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