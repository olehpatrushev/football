import {Animatable, Mesh, Animation} from "@babylonjs/core";

export class AnimatableMesh {
    mesh: Mesh;
    animatable: Animatable;
    animation: Animation;

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

    setMesh(mesh: Mesh) {
        this.mesh = mesh;
    }

    getMesh(): Mesh {
        return this.mesh;
    }

    destroy(): void {
        const mesh = this.getMesh();
        mesh.getScene()?.removeMesh(mesh, true);
        mesh.dispose(false, true);
        this.getAnimatable().stop();
    }
}