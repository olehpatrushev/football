import {Scene, Vector3} from "@babylonjs/core";

export interface BallCreatorOptionsInterface {
    scene: Scene;
    fps: number;
    points: Vector3[];
}