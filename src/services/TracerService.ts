import {Tracer} from "../entities/Tracer";
import {Animation, CreateSphere, MeshBuilder, Tools, Vector3, Scene} from "@babylonjs/core";

export class TracerService {
    scene: Scene;
    tracers: Tracer[] = [];

    constructor(scene: Scene) {
        this.scene = scene
        this.scene.onBeforeRenderObservable.add(() => {
            this.renderTracers();
        });
    }

    createTracer() {
        const tracer = new Tracer();
        const ball = CreateSphere("ball", {diameter: 1}, this.scene);
        tracer.setBall(ball);

        // Motion parameters
        const gravity = -9.81;
        const velocity = 25;
        const angle = Tools.ToRadians(50);
        const duration = 3; // seconds
        const fps = 60;
        const frameCount = duration * fps;
        const points = [];

        for (let i = 0; i < frameCount; i++) {
            const t = i / fps;
            const x = velocity * Math.cos(angle) * t;
            const y = velocity * Math.sin(angle) * t + 0.5 * gravity * t * t;
            const z = 0;
            if (y < 0) break;
            points.push(new Vector3(-50 + x, y + 1, z));
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

        return tracer;
    }

    renderTracers() {
        this.tracers.forEach((tracer: Tracer) => {
            if (tracer.getTrail()) {
                this.scene.removeMesh(tracer.getTrail());
            }
            const masterFrame = tracer.getAnimatable().masterFrame;
            const pointsCount = tracer.getPoints().length;
            if (masterFrame > 1) {
                const trailPoints = tracer.getPoints().slice(Math.max(0, masterFrame * 2 - pointsCount), masterFrame * 2)
                if (trailPoints.length > 1) {
                    const trail = MeshBuilder.CreateTube("trail", {
                        path: trailPoints,
                        radius: 0.1,
                        tessellation: 6
                    }, this.scene);
                    tracer.setTrail(trail);
                }
            }
        })
    }
}