import {Entity} from "./entity";
import {EntityService} from "./entity-service";
import {HydraCollection} from "../restangular/hydra-collection";
import {CollectionUtils} from "../util/collection-utils";

export abstract class CachedEntityService<T extends Entity> extends EntityService<T>
{
    private entities: HydraCollection<T>;

    private nodeUriHash: Map<string, T>;

    public load(): Promise<HydraCollection<T>>
    {
        if (null != this.entities) {
            return Promise.resolve(this.entities);
        }

        return this.list({pagination: false}).then((entities: HydraCollection<T>) => {
            let processedEntities = this.process(entities);
            this.hash(processedEntities);
            this.entities = processedEntities;

            return processedEntities;
        });
    }

    public reload(): Promise<HydraCollection<T>>
    {
        this.entities = null;
        this.nodeUriHash = null;
        return this.load();
    }

    public listCached(): HydraCollection<T>
    {
        if (null == this.entities) {
            throw new Error('You have to call load()');
        }

        return this.entities;
    }

    public findByNodeUri(nodeUri: string): T | null
    {
        if (null == this.nodeUriHash) {
            throw new Error('You have to call load()');
        }

        return this.nodeUriHash.get(nodeUri);
    }

    protected process(entities: HydraCollection<T>): HydraCollection<T>
    {
        return entities;
    }

    protected hash(entities: HydraCollection<T>)
    {
        this.nodeUriHash = CollectionUtils.mapByProperty(entities, 'nodeUri');
    }
}
