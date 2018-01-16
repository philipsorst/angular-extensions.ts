import {HydraView} from "./hydra-view";

export class HydraCollection<T> extends Array<T>
{
    public totalItems: number;

    public view: HydraView;
}
