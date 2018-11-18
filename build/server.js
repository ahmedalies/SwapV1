"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
// import classes annotated by @controller
require("./controller/AuthController");
require("./controller/InterestsController");
require("./controller/AdminController");
require("./controller/UserInterestContoller");
require("./controller/UserItemController");
const types_1 = require("./domain/types");
const types_2 = require("./infrastructure/types");
const AuthRepositoryImp_1 = require("./domain/models/auth/AuthRepositoryImp");
const MongoORMRepository_1 = require("./infrastructure/dal/implementation/MongoORMRepository");
const UserDataMapper_1 = require("./infrastructure/dal/data_mapper/UserDataMapper");
const PointsRepositoryImp_1 = require("./domain/models/points/PointsRepositoryImp");
const PointsDataMapper_1 = require("./infrastructure/dal/data_mapper/PointsDataMapper");
const UserSchema_1 = require("./infrastructure/entities/mongo/schemas/UserSchema");
const InterestsRepositoryImp_1 = require("./domain/models/interests/InterestsRepositoryImp");
const InterestDataMapper_1 = require("./infrastructure/dal/data_mapper/InterestDataMapper");
const InterestSchema_1 = require("./infrastructure/entities/mongo/schemas/InterestSchema");
const AdminSchema_1 = require("./infrastructure/entities/mongo/schemas/AdminSchema");
const AdminRepositoryImp_1 = require("./domain/models/admin/AdminRepositoryImp");
const AdminDataMapper_1 = require("./infrastructure/dal/data_mapper/AdminDataMapper");
const PrivilegeRepositoryImp_1 = require("./domain/models/privileges/PrivilegeRepositoryImp");
const ControlPrivilegeSchema_1 = require("./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema");
const PrivilegeDataMapper_1 = require("./infrastructure/dal/data_mapper/PrivilegeDataMapper");
const UserInterestsSchema_1 = require("./infrastructure/entities/mongo/schemas/UserInterestsSchema");
const UserInterestsRepositoryImp_1 = require("./domain/models/user_interests/UserInterestsRepositoryImp");
const UserInterestsDataMapper_1 = require("./infrastructure/dal/data_mapper/UserInterestsDataMapper");
const UserRepositoryImp_1 = require("./domain/models/user/UserRepositoryImp");
const UserInterestService_1 = require("./domain/services/UserInterestService");
const ItemSchema_1 = require("./infrastructure/entities/mongo/schemas/ItemSchema");
const ItemDataMapper_1 = require("./infrastructure/dal/data_mapper/ItemDataMapper");
const UserItemService_1 = require("./domain/services/UserItemService");
const UserItemRepositoryImp_1 = require("./domain/models/user_item/UserItemRepositoryImp");
// object container
let container = new inversify_1.Container();
//repositories
container.bind(types_1.TYPES.AuthRepository).to(AuthRepositoryImp_1.AuthRepositoryImp);
container.bind(types_1.TYPES.PointSystemRepository).to(PointsRepositoryImp_1.PointsRepositoryImp);
container.bind(types_1.TYPES.InterestsRepository).to(InterestsRepositoryImp_1.InterestsRepositoryImp);
container.bind(types_1.TYPES.AdminRepository).to(AdminRepositoryImp_1.AdminRepositoryImp);
container.bind(types_1.TYPES.PrivilegeRepository).to(PrivilegeRepositoryImp_1.PrivilegeRepositoryImp);
container.bind(types_1.TYPES.UserInterestsRepository).to(UserInterestsRepositoryImp_1.UserInterestsRepositoryImp);
container.bind(types_1.TYPES.UserRepository).to(UserRepositoryImp_1.UserRepositoryImp);
container.bind(types_1.TYPES.UserItemRepository).to(UserItemRepositoryImp_1.UserItemRepositoryImp);
//orm-mongo
container.bind(types_2.TYPES.ORMRepositoryForUserEntity).to(MongoORMRepository_1.MongoORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForInterestEntity).to(MongoORMRepository_1.MongoORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForAdminEntity).to(MongoORMRepository_1.MongoORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForPrivilegeEntity).to(MongoORMRepository_1.MongoORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForUserInterestsEntity).to(MongoORMRepository_1.MongoORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForUserItemEntity).to(MongoORMRepository_1.MongoORMRepository);
//Schemas
container.bind(types_2.TYPES.UserSchema).to(UserSchema_1.UserSchema);
container.bind(types_2.TYPES.InterestSchema).to(InterestSchema_1.InterestSchema);
container.bind(types_2.TYPES.AdminSchema).to(AdminSchema_1.AdminSchema);
container.bind(types_2.TYPES.PrivilegeSchema).to(ControlPrivilegeSchema_1.ControlPrivilegeSchema);
container.bind(types_2.TYPES.UserInterestSchema).to(UserInterestsSchema_1.UserInterestSchema);
container.bind(types_2.TYPES.ItemSchema).to(ItemSchema_1.ItemSchema);
//data-mapper
container.bind(types_2.TYPES.EntityDataMapperForUser).to(UserDataMapper_1.UserDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForPoint).to(PointsDataMapper_1.PointsDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForInterests).to(InterestDataMapper_1.InterestDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForAdmin).to(AdminDataMapper_1.AdminDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForPrivilege).to(PrivilegeDataMapper_1.PrivilegeDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForUserInterests).to(UserInterestsDataMapper_1.UserInterestsDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForItem).to(ItemDataMapper_1.ItemDataMapper);
//services
container.bind(types_1.TYPES.UserInterestService).to(UserInterestService_1.UserInterestService);
container.bind(types_1.TYPES.UserItemService).to(UserItemService_1.UserItemService);
// build a server
let server = new inversify_express_utils_1.InversifyExpressServer(container, null, { rootPath: "/api/v1" });
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
//# sourceMappingURL=server.js.map