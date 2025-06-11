import {TracerService} from "./TracerService";
import {TracerServiceOptions} from "./tracer/TracerServiceOptions";
import {PointsCreator} from "./tracer/PointsCreator";
import {BallCreator} from "./tracer/BallCreator";
import {LabelCreator} from "./tracer/LabelCreator";

export class TracerServiceFactory {
    static create(options: TracerServiceOptions): TracerService {
        const {
            scene,
            pointsCreator = new PointsCreator(),
            ballCreator = new BallCreator(),
            labelCreator = new LabelCreator()
        } = options;

        return new TracerService(
            scene,
            pointsCreator,
            ballCreator,
            labelCreator
        );
    }
}