import {Restangular} from "ngx-restangular";
import {HydraCollection} from "../restangular/hydra-collection";
import {Entity} from "./entity";

export abstract class EntityService<T extends Entity>
{
    public list(parameters = {}): Promise<HydraCollection<T>>
    {
        return this.getEndpoint().getList(parameters).toPromise();
    }

    public find(id): Promise<T | null>
    {
        return this.getEndpoint().one(String(id)).get().toPromise();
    }

    public remove(entity: T | any): Promise<null>
    {
        return entity.remove().toPromise();
    }

    public save(entity: T | any): Promise<T>
    {
        if (null != entity.nodeUri) {
            return entity.save().toPromise();
        } else {
            return this.getEndpoint().post(entity).toPromise();
        }
    }

    public clone(entity: T | any): T
    {
        return entity.clone(entity);
    }

    protected abstract getEndpoint(): Restangular;
}
