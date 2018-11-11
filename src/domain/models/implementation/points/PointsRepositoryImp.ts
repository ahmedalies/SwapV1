import { injectable, inject } from "inversify";
import { RepositoryImp } from "../RepositoryImp";
import { DomianPointSystem } from "../../../entities/DomainPointSystem";
import { MongoPointSystem } from "../../../../infrastructure/dal/entities/mongo/schemas/dal/MongoPointSystem";
import { PointSystemSchema } from "../../../../infrastructure/dal/entities/mongo/schemas/PointSystemSchema";
import { PointsDataMapper } from '../../../../infrastructure/dal/implementation/PointsDataMapper'
import { PointsRepository } from "../../interfaces/points/PointsRepository";
import { TYPES } from "../../../../infrastructure/dal/types";
import { ORMRepository } from "../../../../infrastructure/dal/implementation/ORMRepository";

@injectable()
export class PointsRepositoryImp extends RepositoryImp<DomianPointSystem, MongoPointSystem> implements PointsRepository {

    public constructor(
        @inject(TYPES.ORMRepositoryForUserEntity) repository: ORMRepository<MongoPointSystem>,
        @inject(TYPES.EntityDataMApperForPoint) dataMapper: PointsDataMapper,
        @inject(TYPES.UserMongoSchema) model: PointSystemSchema
    ){
        super(repository, dataMapper, model);
    }
}