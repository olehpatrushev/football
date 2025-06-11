import {AnimatableMesh} from "../../core/AnimatableMesh";
import {BallCreatorOptionsInterface} from "./BallCreatorOptionsInterface";

export interface BallCreatorInterface {
    create(options: BallCreatorOptionsInterface): AnimatableMesh;
}