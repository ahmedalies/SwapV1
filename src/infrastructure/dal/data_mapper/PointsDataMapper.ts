import { injectable } from "inversify";
import { EntityDataMapper } from "../interfaces/EntityDataMapper";
import { DomianPointSystem } from "../../../domain/entities/DomainPointSystem";
import { DALPointSystem } from "../../entities/dal/DALPointSystem";

@injectable()
export class PointsDataMapper implements EntityDataMapper<DomianPointSystem, DALPointSystem> {

    public toDomain(object: DALPointSystem): DomianPointSystem {
        let p_system = new DomianPointSystem();
        p_system._id = object._id;
        p_system.name = object.name;
        p_system.numberAssignedToTask = object.value;
        p_system.created_at = object.created_at;
        return p_system;
    }

    public toDAL(object: DomianPointSystem): DALPointSystem {
        let p_system = new DALPointSystem();
        p_system._id = object._id;
        p_system.name = object.name;
        p_system.value = object.numberAssignedToTask;
        p_system.created_at = object.created_at;
        return p_system;
    }
}