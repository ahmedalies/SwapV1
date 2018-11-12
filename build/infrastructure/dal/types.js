"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = {
    ORMRepositoryForUserEntity: Symbol.for('ORMRepository<DALUser>'),
    ORMRepositoryForInterestEntity: Symbol.for('ORMRepository<DALInterest>'),
    EntityDataMapperForAuth: Symbol.for('EntityDataMapper<DomainUser, DALUser>'),
    EntityDataMapperForInterests: Symbol.for('EntityDataMapper<DomainInterest, DomainInterest>'),
    EntityDataMapperForPoint: Symbol.for('EntityDataMapper<DomianPointSystem, DALPointSystem>'),
    EntityDataMapperForAdmin: Symbol.for('EntityDataMapper<DomianAdmin, DALAdmin>'),
    UserSchema: Symbol.for('UserSchema'),
    InterestSchema: Symbol.for('InterestSchema'),
    PointSystemSchema: Symbol.for('PointSystemSchema'),
    AdminSchema: Symbol.for('AdminSchema')
};
//# sourceMappingURL=types.js.map