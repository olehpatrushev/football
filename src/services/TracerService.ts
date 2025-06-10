import {Tracer} from "../entities/Tracer";
import {
    Animation,
    CreateSphere,
    MeshBuilder,
    Tools,
    Vector3,
    Scene,
    BoundingBox,
    StandardMaterial, Color3
} from "@babylonjs/core";

export class TracerService {
    scene: Scene;
    tracers: Tracer[] = [];

    leftFrontPointOfTheField: Vector3 = new Vector3(-28.7526, -8.50535, 18.3178);
    rightRearPointOfTheField: Vector3 = new Vector3(30.6383, -8.50535, -16.6845);

    fieldBoundingBox: BoundingBox;
    scaleCoefficient;

    constructor(scene: Scene) {
        this.scene = scene
        this.scene.onBeforeRenderObservable.add(() => {
            this.renderTracers();
        });
        this.fieldBoundingBox = new BoundingBox(this.leftFrontPointOfTheField, this.rightRearPointOfTheField);
        this.scaleCoefficient = 100 / Math.abs(this.fieldBoundingBox.extendSize.scale(2).x);
    }

    createTracer(fromLine: number = 0, toLine: number = 100, side: string = Tracer.SIDE_CENTER) {
        fromLine = Math.abs(parseInt(String(fromLine)));
        toLine = Math.abs(parseInt(String(toLine)));

        if (isNaN(fromLine) || isNaN(toLine) || toLine <= fromLine) {
            throw new Error(`Invalid parameters are given: fromLine=${fromLine}, toLine=${toLine}`);
        }

        const tracer = new Tracer();
        const ball = CreateSphere("ball", {diameter: 1}, this.scene);
        ball.isVisible = false;
        tracer.setBall(ball);

        // Motion parameters
        const gravity = -9.81;
        const angle = Tools.ToRadians(45);
        const range = toLine - fromLine;
        const velocity = Math.sqrt(range * -gravity / Math.sin(2 * angle));
        const duration = range / (velocity * Math.cos(angle)); // seconds
        const fps = 60;
        const frameCount = duration * fps;
        const points = [];
        const randomCorrection = (5 - Math.random() * 10)

        for (let i = 0; i < frameCount; i++) {
            const t = i / fps;
            const x = velocity * Math.cos(angle) * t;
            const y = velocity * Math.sin(angle) * t + 0.5 * gravity * t * t;
            let realZ;
            switch (side) {
                case Tracer.SIDE_LEFT:
                    realZ = 0;
                    break;
                case Tracer.SIDE_RIGHT:
                    realZ = this.fieldBoundingBox.extendSize.z * 2;
                    break;
                default:
                    realZ = this.fieldBoundingBox.extendSize.z;
                    break;
            }
            points.push(
                this.leftFrontPointOfTheField.clone().add(
                    new Vector3(
                        (x + fromLine) / this.scaleCoefficient,
                        y / this.scaleCoefficient,
                        realZ + randomCorrection
                    )
                )
            );
        }

        tracer.setPoints(points);

        // Animation
        const animation: Animation = new Animation("ballMove", "position", fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE);

        const keys = points.map((p, i) => ({frame: i, value: p}));
        animation.setKeys(keys);
        ball.animations.push(animation);
        const animatable = this.scene.beginAnimation(ball, 0, keys[keys.length - 1].frame, true);

        tracer.setAnimation(animation);
        tracer.setAnimatable(animatable);

        this.tracers.push(tracer);
    }

    renderTracers() {
        this.tracers.forEach((tracer: Tracer) => {
            if (tracer.getTrail()) {
                this.scene.removeMesh(tracer.getTrail());
            }
            const masterFrame = tracer.getAnimatable().masterFrame;
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
                material.diffuseColor = Color3.FromHexString("#00ff00");
                material.emissiveColor = Color3.FromHexString("#00ff00");
                trail.material = material;
                tracer.setTrail(trail);
            }
        })
    }

    removeTracers() {
        while (this.tracers.length > 0) {
            const tracer = this.tracers.shift();
            tracer.getAnimatable().stop();
            this.scene.removeMesh(tracer.getBall());
            this.scene.removeMesh(tracer.getTrail());
        }
    }
}