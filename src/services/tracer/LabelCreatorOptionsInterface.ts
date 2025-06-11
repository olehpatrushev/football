import {Scene, Vector3} from "@babylonjs/core";

export const LABEL_TYPE_FIRST = "first" as const;
export const LABEL_TYPE_LAST = "last" as const;

export const LABEL_TYPES = [LABEL_TYPE_FIRST, LABEL_TYPE_LAST] as const;
export type LabelType = typeof LABEL_TYPES[number]; // "first" | "last"

export interface LabelCreatorOptionsInterface {
    scene: Scene;
    fps: number;
    totalFrames: number;
    position: Vector3;
    type: LabelType;
}