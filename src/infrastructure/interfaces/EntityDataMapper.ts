export interface EntityDataMapper<Domain, DAL> {
    toDomain(dalObject: DAL): Domain;
    toDAL(domainObject: Domain): DAL;
}