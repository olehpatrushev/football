import {Tools, Vector3} from "@babylonjs/core";
import {Tracer} from "../../entities/Tracer";
import {PointsCreatorInterface} from "./PointsCreatorInterface";
import {PointsCreatorOptionsInterface} from "./PointsCreatorOptionsInterface";

export class PointsCreator implements PointsCreatorInterface {
    create(options: PointsCreatorOptionsInterface): Vector3[] {
        const gravity = -9.81;
        const angle = Tools.ToRadians(45);
        const range = options.toLine - options.fromLine;
        const velocity = Math.sqrt(range * -gravity / Math.sin(2 * angle));
        const duration = range / (velocity * Math.cos(angle)); // seconds
        const frameCount = duration * options.fps;
        const points = [];
        const randomCorrection = Math.random() * options.fieldWidth / 3;

        for (let i = 0; i < frameCount; i++) {
            const t = i / options.fps;
            const x = velocity * Math.cos(angle) * t;
            const y = velocity * Math.sin(angle) * t + 0.5 * gravity * t * t;
            let realZ;
            switch (options.side) {
                case Tracer.SIDE_LEFT:
                    realZ = 0;
                    break;
                case Tracer.SIDE_RIGHT:
                    realZ = options.fieldWidth / 3 * 2;
                    break;
                default:
                    realZ = options.fieldWidth / 3;
                    break;
            }
            points.push(
                options.basePoint.clone().add(
                    new Vector3(
                        -(x + options.fromLine) / options.scaleCoefficient,
                        y / options.scaleCoefficient + 0.1,
                        realZ + randomCorrection
                    )
                )
            );
        }

        return points;
    }
}