import {Tracer} from "../entities/Tracer";
import {
    MeshBuilder,
    Tools,
    Vector3,
    Scene,
    BoundingBox,
    StandardMaterial, Color3, Material, Texture
} from "@babylonjs/core";
import {AnimatableMesh} from "../core/AnimatableMesh";
import {PointsCreatorInterface} from "./tracer/PointsCreatorInterface";
import {BallCreatorInterface} from "./tracer/BallCreatorInterface";
import {BallCreatorOptionsInterface} from "./tracer/BallCreatorOptionsInterface";
import {PointsCreatorOptionsInterface} from "./tracer/PointsCreatorOptionsInterface";
import {LABEL_TYPE_FIRST, LABEL_TYPE_LAST, LabelCreatorOptionsInterface} from "./tracer/LabelCreatorOptionsInterface";
import {LabelCreatorInterface} from "./tracer/LabelCreatorInterface";

export class TracerService {
    private readonly scene: Scene;

    private tracers: Tracer[] = [];

    private leftFrontPointOfTheField: Vector3 = new Vector3(-28.7526, -8.50535, 18.3178);
    private rightRearPointOfTheField: Vector3 = new Vector3(30.6383, -8.50535, -16.6845);

    private fieldBoundingBox: BoundingBox;
    private readonly scaleCoefficient;
    private readonly fieldWidth;

    private readonly ballCreator: BallCreatorInterface;
    private readonly pointsCreator: PointsCreatorInterface;
    private readonly labelCreator: LabelCreatorInterface;

    constructor(
        scene: Scene,
        pointsCreator: PointsCreatorInterface,
        ballCreator: BallCreatorInterface,
        labelCreator: LabelCreatorInterface
    ) {
        this.scene = scene;
        this.ballCreator = ballCreator;
        this.pointsCreator = pointsCreator;
        this.labelCreator = labelCreator;

        this.scene.onBeforeRenderObservable.add(() => {
            this.renderTracers();
        });

        this.fieldBoundingBox = new BoundingBox(this.rightRearPointOfTheField, this.leftFrontPointOfTheField);
        this.fieldWidth = this.fieldBoundingBox.extendSize.scale(2).z;
        this.scaleCoefficient = 100 / Math.abs(this.fieldBoundingBox.extendSize.scale(2).x);
    }

    createBall(options: BallCreatorOptionsInterface): AnimatableMesh {
        return this.ballCreator.create(options);
    }

    createPoints(options: PointsCreatorOptionsInterface): Vector3[] {
        return this.pointsCreator.create(options);
    }

    createLabel(options: LabelCreatorOptionsInterface): AnimatableMesh {
        return this.labelCreator.create(options);
    }

    createTracer(fromLine: number = 0, toLine: number = 100, side: string = Tracer.SIDE_CENTER) {
        fromLine = Math.abs(parseInt(String(fromLine)));
        toLine = Math.abs(parseInt(String(toLine)));

        const fps = 60;

        if (isNaN(fromLine) || isNaN(toLine) || toLine <= fromLine) {
            throw new Error(`Invalid parameters are given: fromLine=${fromLine}, toLine=${toLine}`);
        }

        const tracer = new Tracer();
        const points = this.createPoints({
            toLine,
            fromLine,
            fieldWidth: this.fieldWidth,
            side,
            basePoint: this.rightRearPointOfTheField,
            scaleCoefficient: this.scaleCoefficient,
            fps
        });
        tracer.setPoints(points);

        const ball = this.createBall({
            scene: this.scene,
            fps,
            points
        });
        tracer.setBall(ball);

        const startLabel = this.createLabel({
            scene: this.scene,
            fps,
            position: points[0],
            totalFrames: points.length,
            type: LABEL_TYPE_FIRST
        });
        startLabel.getAnimatable().syncWith(ball.getAnimatable());
        tracer.setStartLabel(startLabel);

        const endLabel = this.createLabel({
            scene: this.scene,
            fps,
            position: points.slice(-1)[0],
            totalFrames: points.length,
            type: LABEL_TYPE_LAST
        });
        endLabel.getAnimatable().syncWith(ball.getAnimatable());
        tracer.setEndLabel(endLabel);

        this.tracers.push(tracer);
    }

    renderTracers() {
        this.tracers.forEach((tracer: Tracer) => {
            if (tracer.getTrail()) {
                const trail = tracer.getTrail();
                this.scene.removeMesh(trail, true);
                trail.dispose(false, true);
                tracer.setTrail(null);
            }
            const masterFrame = Math.floor(tracer.getBall().getAnimatable().masterFrame);
            const pointsCount = tracer.getPoints().length;
            const maxTrailLength = Math.floor(pointsCount / 6);
            const trailLength = Math.min(maxTrailLength, masterFrame, pointsCount - masterFrame);
            const trailPoints = tracer.getPoints().slice(Math.max(0, masterFrame - trailLength), masterFrame + trailLength);
            if (trailPoints.length > 1) {
                const trail = MeshBuilder.CreateTube("trail", {
                    path: trailPoints,
                    radius: 0.1,
                    tessellation: 6
                }, this.scene);
                const material = new StandardMaterial("tracerMaterial", this.scene);
                material.diffuseColor = material.emissiveColor = Color3.FromHexString("#00ff00");
                material.needDepthPrePass = true;
                trail.material = material;
                tracer.setTrail(trail);
            }
        })
    }

    removeTracers() {
        while (this.tracers.length > 0) {
            const tracer = this.tracers.shift();
            tracer.destroy();
        }
    }
}