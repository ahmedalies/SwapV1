export const TYPES = {
    //orm
    ORMRepositoryForUserEntity: Symbol.for('ORMRepository<DALUser>'),
    ORMRepositoryForInterestEntity: Symbol.for('ORMRepository<DALInterest>'),
    ORMRepositoryForAdminEntity: Symbol.for('ORMRepository<DALAdmin>'),
    ORMRepositoryForPrivilegeEntity: Symbol.for('ORMRepository<DALControlPrivilege>'),
    ORMRepositoryForUserInterestsEntity: Symbol.for('ORMRepository<DALUserInterests>'),
    ORMRepositoryForUserItemEntity: Symbol.for('ORMRepository<DALItem>'),
    ORMRepositoryForSwapRequestEntity: Symbol.for('ORMRepository<DALSwapRequest>'),

    //data mapper
    EntityDataMapperForUser: Symbol.for('EntityDataMapper<DomainUser, DALUser>'),
    EntityDataMapperForInterests: Symbol.for('EntityDataMapper<DomainInterest, DomainInterest>'),
    EntityDataMapperForPoint: Symbol.for('EntityDataMapper<DomianPointSystem, DALPointSystem>'),
    EntityDataMapperForAdmin: Symbol.for('EntityDataMapper<DomianAdmin, DALAdmin>'),
    EntityDataMapperForPrivilege: Symbol.for('EntityDataMapper<DomianControlPrivilege, DALControlPrivilege>'),
    EntityDataMapperForUserInterests: Symbol.for('EntityDataMapper<DomianUserInterests, DALUserInterests>'),
    EntityDataMapperForItem: Symbol.for('EntityDataMapper<DomianItem, DALItem>'),
    EntityDataMapperForSwapRequest: Symbol.for('EntityDataMapper<DomianSwapRequest, DALSwapRequest>'),

    //mongo schema
    UserSchema: Symbol.for('UserSchema'),
    InterestSchema : Symbol.for('InterestSchema'),
    PointSystemSchema: Symbol.for('PointSystemSchema'),
    AdminSchema: Symbol.for('AdminSchema'),
    PrivilegeSchema: Symbol.for('ControlPrivilegeSchema'),
    UserInterestSchema: Symbol.for('UserInterestSchema'),
    ItemSchema: Symbol.for('ItemSchema'),
    SwapRequestSchema: Symbol.for('SwapRequestSchema'),
};