import {Vector3} from "@babylonjs/core";

export interface PointsCreatorOptionsInterface {
    toLine: number;
    fromLine: number;
    fieldWidth: number;
    side: string;
    basePoint: Vector3;
    scaleCoefficient: number;
    fps: number;
}