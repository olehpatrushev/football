import {Tracer} from "../entities/Tracer";
import {Animation, CreateSphere, MeshBuilder, Tools, Vector3} from "@babylonjs/core";

export class TracerService {
    scene;

    constructor(scene) {
        this.scene = scene
    }

    createTracer() {
        const ball = CreateSphere("ball", {diameter: 1}, this.scene);
        const tracer = new Tracer();

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

        // Animation
        const anim = new Animation("ballMove", "position", fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE);

        const keys = points.map((p, i) => ({frame: i, value: p}));
        anim.setKeys(keys);
        ball.animations.push(anim);
        this.scene.beginAnimation(ball, 0, keys[keys.length - 1].frame, true);

        let trail;
        let trailPointIndex = 2;
        const trailPointsCount = frameCount / 2;

        const renderTracerCallback = () => {
            if (trail) {
                this.scene.removeMesh(trail);
            }
            const trailPoints = points.slice(Math.max(0, trailPointIndex - trailPointsCount), trailPointIndex)
            trail = MeshBuilder.CreateTube("trail", {
                path: trailPoints,
                updatable: true,
            }, this.scene);
            trailPointIndex++;
            if (trailPointIndex > frameCount) {
                trailPointIndex = 2;
            }
        };

        tracer.setRenderCallback(renderTracerCallback);
        // Update trail on each frame
        this.scene.onBeforeRenderObservable.add(renderTracerCallback);

        return tracer;
    }
}