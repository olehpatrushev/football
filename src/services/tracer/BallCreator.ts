import {Animation, CreateSphere} from "@babylonjs/core";
import {BallCreatorInterface} from "./BallCreatorInterface";
import {AnimatableMesh} from "../../core/AnimatableMesh";
import {BallCreatorOptionsInterface} from "./BallCreatorOptionsInterface";

export class BallCreator implements BallCreatorInterface {
    create(options: BallCreatorOptionsInterface): AnimatableMesh {
        const ball = new AnimatableMesh();
        const ballMesh = CreateSphere("ball", {diameter: 1}, options.scene);
        ballMesh.isVisible = false;

        // Animation
        const animation: Animation = new Animation(
            "ballMove",
            "position",
            options.fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = options.points.map((p, i) => ({frame: i, value: p}));
        animation.setKeys(keys);
        ballMesh.animations.push(animation);
        const animatable = options.scene.beginAnimation(ballMesh, 0, keys[keys.length - 1].frame, true);

        ball.setMesh(ballMesh);
        ball.setAnimation(animation);
        ball.setAnimatable(animatable);

        return ball;
    }
}