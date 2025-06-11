import {AnimatableMesh} from "../../core/AnimatableMesh";
import {LabelCreatorOptionsInterface} from "./LabelCreatorOptionsInterface";

export interface LabelCreatorInterface {
    create(options: LabelCreatorOptionsInterface): AnimatableMesh;
}