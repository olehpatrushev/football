import {Mesh, Vector3} from "@babylonjs/core";
import {AnimatableMesh} from "../core/AnimatableMesh";

export class Tracer {
    static SIDE_LEFT = 'left';
    static SIDE_CENTER = 'center';
    static SIDE_RIGHT = 'right';

    ball: AnimatableMesh;
    startLabel: AnimatableMesh;
    endLabel: AnimatableMesh;
    trail: Mesh;
    points: Vector3[];

    setBall(ball: AnimatableMesh) {
        this.ball = ball;
    }

    getBall(): AnimatableMesh {
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

    setStartLabel(startLabel: AnimatableMesh) {
        this.startLabel = startLabel;
    }

    getStartLabel(): AnimatableMesh {
        return this.startLabel;
    }

    setEndLabel(endLabel: AnimatableMesh) {
        this.endLabel = endLabel;
    }

    getEndLabel(): AnimatableMesh {
        return this.endLabel;
    }

    destroy(): void {
        this.getBall().destroy();
        this.getStartLabel().destroy();
        this.getEndLabel().destroy();

        const trail = this.getTrail();
        trail?.getScene()?.removeMesh(trail, true);
        trail?.dispose(false, true);
    }
}