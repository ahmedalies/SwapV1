import { injectable, inject } from "inversify";
import { RepositoryImp } from "../base/RepositoryImp";
import { DomianPointSystem } from "../../entities/DomainPointSystem";
import { DALPointSystem } from "../../../infrastructure/entities/dal/DALPointSystem";
import { PointSystemSchema } from "../../../infrastructure/entities/mongo/schemas/PointSystemSchema";
import { PointsDataMapper } from '../../../infrastructure/dal/data_mapper/PointsDataMapper'
import { PointsRepository } from "./PointsRepository";
import { TYPES } from "../../../infrastructure/types";
import { MongoORMRepository } from "../../../infrastructure/dal/implementation/MongoORMRepository";

@injectable()
export class PointsRepositoryImp extends RepositoryImp<DomianPointSystem, DALPointSystem> implements PointsRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: MongoORMRepository<DALPointSystem>,
        @inject(TYPES.EntityDataMapperForPoint) dataMapper: PointsDataMapper,
        @inject(TYPES.UserSchema) model: PointSystemSchema
    ){
        super(repository, dataMapper, model);
    }
}