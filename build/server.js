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
const types_1 = require("./domain/types");
const types_2 = require("./infrastructure/dal/types");
const AuthRepositoryImp_1 = require("./domain/models/implementation/AuthRepositoryImp");
const ORMRepository_1 = require("./infrastructure/dal/implementation/ORMRepository");
const AuthDataMapper_1 = require("./infrastructure/dal/implementation/AuthDataMapper");
// object container
let container = new inversify_1.Container();
// bind objects to container
container.bind(types_1.TYPES.AuthRepository).to(AuthRepositoryImp_1.AuthRepositoryImp);
container.bind(types_2.TYPES.ORMRepositoryForUserEntity).to(ORMRepository_1.ORMRepository);
container.bind(types_2.TYPES.EntityDataMApperForAuth).to(AuthDataMapper_1.AuthDataMapper);
// build a server
let server = new inversify_express_utils_1.InversifyExpressServer(container, null, { rootPath: "/api/v1" });
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
//# sourceMappingURL=server.js.map