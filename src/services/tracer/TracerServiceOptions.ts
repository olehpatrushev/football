import {Scene} from "@babylonjs/core";
import {PointsCreatorInterface} from "./PointsCreatorInterface";
import {BallCreatorInterface} from "./BallCreatorInterface";
import {LabelCreatorInterface} from "./LabelCreatorInterface";

export interface TracerServiceOptions {
    scene: Scene;
    pointsCreator?: PointsCreatorInterface;
    ballCreator?: BallCreatorInterface;
    labelCreator?: LabelCreatorInterface;
}