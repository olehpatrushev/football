import {Animatable, Mesh, Animation, Vector3} from "@babylonjs/core";

export class Tracer {
    static SIDE_LEFT = 'left';
    static SIDE_CENTER = 'center';
    static SIDE_RIGHT = 'right';

    animation: Animation;
    animatable: Animatable;
    ball: Mesh;
    trail: Mesh;
    points: Vector3[]

    setAnimation(animation: Animation) {
        this.animation = animation;
    }

    getAnimation(): Animation {
        return this.animation;
    }

    setAnimatable(animatable: Animatable) {
        this.animatable = animatable;
    }

    getAnimatable(): Animatable {
        return this.animatable;
    }

    setBall(ball: Mesh) {
        this.ball = ball;
    }

    getBall(): Mesh {
        return this.ball;
    }

    setTrail(trail: Mesh) {
        this.trail = trail;
    }

    getTrail(): Mesh {
        return this.trail;
    }

    setPoints(points: Vector3[]) {
        this.points = points;
    }

    getPoints() {
        return this.points;
    }
}