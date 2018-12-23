"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require("morgan");
const express = require("express");
const node_fetch_1 = require("node-fetch");
require("reflect-metadata");
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const multer = require("multer");
// import classes annotated by @controller
require("./controller/AuthController");
require("./controller/InterestsController");
require("./controller/AdminPrivilegeController");
require("./controller/AdminController");
require("./controller/UserInterestContoller");
require("./controller/UserItemController");
require("./controller/SwapRequestContoller");
const types_1 = require("./domain/types");
const types_2 = require("./infrastructure/types");
const AuthRepositoryImp_1 = require("./domain/models/auth/AuthRepositoryImp");
const MongoORMRepository_1 = require("./infrastructure/implementation/MongoORMRepository");
const UserDataMapper_1 = require("./infrastructure/data_mapper/UserDataMapper");
const PointsRepositoryImp_1 = require("./domain/models/points/PointsRepositoryImp");
const PointsDataMapper_1 = require("./infrastructure/data_mapper/PointsDataMapper");
const UserSchema_1 = require("./infrastructure/entities/mongo/schemas/UserSchema");
const InterestsRepositoryImp_1 = require("./domain/models/interests/InterestsRepositoryImp");
const InterestDataMapper_1 = require("./infrastructure/data_mapper/InterestDataMapper");
const InterestSchema_1 = require("./infrastructure/entities/mongo/schemas/InterestSchema");
const AdminSchema_1 = require("./infrastructure/entities/mongo/schemas/AdminSchema");
const AdminRepositoryImp_1 = require("./domain/models/admin/AdminRepositoryImp");
const AdminDataMapper_1 = require("./infrastructure/data_mapper/AdminDataMapper");
const PrivilegeRepositoryImp_1 = require("./domain/models/privileges/PrivilegeRepositoryImp");
const ControlPrivilegeSchema_1 = require("./infrastructure/entities/mongo/schemas/ControlPrivilegeSchema");
const PrivilegeDataMapper_1 = require("./infrastructure/data_mapper/PrivilegeDataMapper");
const UserInterestsSchema_1 = require("./infrastructure/entities/mongo/schemas/UserInterestsSchema");
const UserInterestsRepositoryImp_1 = require("./domain/models/user_interests/UserInterestsRepositoryImp");
const UserInterestsDataMapper_1 = require("./infrastructure/data_mapper/UserInterestsDataMapper");
const UserRepositoryImp_1 = require("./domain/models/user/UserRepositoryImp");
const UserInterestService_1 = require("./domain/services/UserInterestService");
const ItemSchema_1 = require("./infrastructure/entities/mongo/schemas/ItemSchema");
const ItemDataMapper_1 = require("./infrastructure/data_mapper/ItemDataMapper");
const UserItemService_1 = require("./domain/services/UserItemService");
const UserItemRepositoryImp_1 = require("./domain/models/user_item/UserItemRepositoryImp");
const SwapRequestRepositoryImp_1 = require("./domain/models/swap_request/SwapRequestRepositoryImp");
const SwapRequestSchema_1 = require("./infrastructure/entities/mongo/schemas/SwapRequestSchema");
const SwapRequestMapper_1 = require("./infrastructure/data_mapper/SwapRequestMapper");
const SwapRequestService_1 = require("./domain/services/SwapRequestService");
const MysqlORMRepository_1 = require("./infrastructure/implementation/MysqlORMRepository");
const ORMRepository_1 = require("./infrastructure/implementation/ORMRepository");
const AuthService_1 = require("./domain/services/AuthService");
const AdminPrivilegeDataMapper_1 = require("./infrastructure/data_mapper/AdminPrivilegeDataMapper");
const AdminPrivilegeRepositoryImp_1 = require("./domain/models/admin/admin_privilege/AdminPrivilegeRepositoryImp");
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
container.bind(types_1.TYPES.SwapRequestRepository).to(SwapRequestRepositoryImp_1.SwapRequestRepositoryImp);
container.bind(types_1.TYPES.AdminPrivilegeRepository).to(AdminPrivilegeRepositoryImp_1.AdminPrivilegeRepositoryImp);
//base-orm
container.bind(types_2.TYPES.ORMRepositoryForUserEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForInterestEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForAdminEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForPrivilegeEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForUserInterestsEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForUserItemEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.ORMRepositoryForSwapRequestEntity).to(ORMRepository_1.ORMRepository);
//mysql orm
container.bind(types_2.TYPES.MysqlORMRepository).to(MysqlORMRepository_1.MysqlORMRepository);
//mongo orm
container.bind(types_2.TYPES.MongoORMRepository).to(MongoORMRepository_1.MongoORMRepository);
//Schemas
container.bind(types_2.TYPES.UserSchema).to(UserSchema_1.UserSchema);
container.bind(types_2.TYPES.InterestSchema).to(InterestSchema_1.InterestSchema);
container.bind(types_2.TYPES.AdminSchema).to(AdminSchema_1.AdminSchema);
container.bind(types_2.TYPES.PrivilegeSchema).to(ControlPrivilegeSchema_1.ControlPrivilegeSchema);
container.bind(types_2.TYPES.UserInterestSchema).to(UserInterestsSchema_1.UserInterestSchema);
container.bind(types_2.TYPES.ItemSchema).to(ItemSchema_1.ItemSchema);
container.bind(types_2.TYPES.SwapRequestSchema).to(SwapRequestSchema_1.SwapRequestSchema);
//data-mapper
container.bind(types_2.TYPES.EntityDataMapperForUser).to(UserDataMapper_1.UserDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForPoint).to(PointsDataMapper_1.PointsDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForInterests).to(InterestDataMapper_1.InterestDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForAdmin).to(AdminDataMapper_1.AdminDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForPrivilege).to(PrivilegeDataMapper_1.PrivilegeDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForUserInterests).to(UserInterestsDataMapper_1.UserInterestsDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForItem).to(ItemDataMapper_1.ItemDataMapper);
container.bind(types_2.TYPES.EntityDataMapperForSwapRequest).to(SwapRequestMapper_1.SwapRequestMapper);
container.bind(types_2.TYPES.EntityDataMapperForAdminPrivilege).to(AdminPrivilegeDataMapper_1.AdminPrivilegeDataMapper);
//services
container.bind(types_1.TYPES.UserInterestService).to(UserInterestService_1.UserInterestService);
container.bind(types_1.TYPES.UserItemService).to(UserItemService_1.UserItemService);
container.bind(types_1.TYPES.SwapRequestService).to(SwapRequestService_1.SwapRequestService);
container.bind(types_1.TYPES.AuthService).to(AuthService_1.AuthService);
// build a server
let server = new inversify_express_utils_1.InversifyExpressServer(container, null, { rootPath: "/api/v1" });
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
    app.use(express.urlencoded({ extended: false }));
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json());
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './src/images/interests/');
        },
        filename: function (req, file, cb) {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
                cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
        }
    });
    let upload = multer({ storage: storage });
    app.post('/api/v1/admin/interests/add', upload.single('file'), function (req, res) {
        if (req.file && req.body.name && req.body.nameAR && req.body.adminId) {
            req.body.imageUrl = req.file.filename;
            node_fetch_1.default('http://localhost:8000/api/v1/admin/interests/add-inner', {
                method: 'POST',
                body: JSON.stringify(req.body),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((respond) => {
                if (respond.ok)
                    res.status(200).json({ error: false, message: 'added successfully' });
                else
                    res.status(200).send({ error: true, message: 'error occured' });
            })
                .catch((err) => { res.send({ error: 'true', message: 'error occured' }); });
        }
        else {
            res.status(200).json({ message: 'name, nameAR and adminId are required', error: true });
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
//# sourceMappingURL=server.js.map