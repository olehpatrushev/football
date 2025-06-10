import {Animatable, Mesh, Animation, Vector3} from "@babylonjs/core";

export class Tracer {
    animation: Animation;
    animatable: Animatable;
    ball: Mesh;
    trail: Mesh;
    points: Vector3[]

    setAnimation(animation: Animation) {
        this.animation = animation;
    }

    getAnimation() {
        return this.animation;
    }

    setAnimatable(animatable: Animatable) {
        this.animatable = animatable;
    }

    getAnimatable() {
        return this.animatable;
    }

    setBall(ball: Mesh) {
        this.ball = ball;
    }

    getBall() {
        return this.ball;
    }

    setTrail(trail: Mesh) {
        this.trail = trail;
    }

    getTrail() {
        return this.trail;
    }

    setPoints(points: Vector3[]) {
        this.points = points;
    }

    getPoints() {
        return this.points;
    }
}