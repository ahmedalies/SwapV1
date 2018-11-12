export const TYPES = {
    ORMRepositoryForUserEntity: Symbol.for('ORMRepository<DALUser>'),
    ORMRepositoryForInterestEntity: Symbol.for('ORMRepository<DALInterest>'),
    ORMRepositoryForAdminEntity: Symbol.for('ORMRepository<DALAdmin>'),
    ORMRepositoryForPrivilegeEntity: Symbol.for('ORMRepository<DALControlPrivilege>'),
    EntityDataMapperForAuth: Symbol.for('EntityDataMapper<DomainUser, DALUser>'),
    EntityDataMapperForInterests: Symbol.for('EntityDataMapper<DomainInterest, DomainInterest>'),
    EntityDataMapperForPoint: Symbol.for('EntityDataMapper<DomianPointSystem, DALPointSystem>'),
    EntityDataMapperForAdmin: Symbol.for('EntityDataMapper<DomianAdmin, DALAdmin>'),
    EntityDataMapperForPrivilege: Symbol.for('EntityDataMapper<DomianControlPrivilege, DALControlPrivilege>'),
    UserSchema: Symbol.for('UserSchema'),
    InterestSchema : Symbol.for('InterestSchema'),
    PointSystemSchema: Symbol.for('PointSystemSchema'),
    AdminSchema: Symbol.for('AdminSchema'),
    PrivilegeSchema: Symbol.for('ControlPrivilegeSchema')
};