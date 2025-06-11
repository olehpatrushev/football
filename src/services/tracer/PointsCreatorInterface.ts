import {Vector3} from "@babylonjs/core";
import {PointsCreatorOptionsInterface} from "./PointsCreatorOptionsInterface";

export interface PointsCreatorInterface {
    create(options: PointsCreatorOptionsInterface): Vector3[]
}