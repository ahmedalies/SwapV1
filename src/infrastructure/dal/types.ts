export const TYPES = {
    ORMRepositoryForUserEntity: Symbol.for('ORMRepository<MongoUser>'),
    EntityDataMApperForAuth: Symbol.for('EntityDataMapper<DomainUser, MongoUser>'),
    EntityDataMApperForPoint: Symbol.for('EntityDataMapper<DomianPointSystem, MongoPointSystem>'),
    UserMongoSchema: Symbol.for('MongoUserSchema'),
    PointSystemMongoSchema: Symbol.for('PointSystemSchema')
}