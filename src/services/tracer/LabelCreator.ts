import {Animation, CreateSphere, MeshBuilder, StandardMaterial, Texture, Vector3} from "@babylonjs/core";
import {AnimatableMesh} from "../../core/AnimatableMesh";
import {LABEL_TYPE_FIRST, LABEL_TYPE_LAST, LabelCreatorOptionsInterface} from "./LabelCreatorOptionsInterface";
import {LabelCreatorInterface} from "./LabelCreatorInterface";

export class LabelCreator implements LabelCreatorInterface {
    create(options: LabelCreatorOptionsInterface): AnimatableMesh {
        const label = new AnimatableMesh();
        // Материал с текстурой
        const labelMaterial = new StandardMaterial("labelMaterial", options.scene);
        const labelTexture = new Texture("images/ball_green.png", options.scene);
        labelTexture.hasAlpha = true;
        labelMaterial.diffuseTexture = labelTexture;
        labelMaterial.emissiveTexture = labelTexture;
        labelMaterial.backFaceCulling = false; // Показать обе стороны

        const labelMesh = MeshBuilder.CreatePlane("startLabel", {width: 2, height: 2}, options.scene);
        labelMesh.material = labelMaterial;

        labelMesh.position.copyFrom(options.position);
        labelMesh.position.y += 0.1;
        labelMesh.rotate(new Vector3(1, 0, 0), Math.PI / 2);

        const animation: Animation = new Animation(
            "labelScaling",
            "scaling",
            options.fps,
            Animation.ANIMATIONTYPE_VECTOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [];
        if (options.type == LABEL_TYPE_FIRST) {
            keys.push({
                frame: 0,
                value: Vector3.Zero()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 0.1),
                value: Vector3.One()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 0.5),
                value: Vector3.Zero()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 1.0),
                value: Vector3.Zero()
            })
        } else {
            keys.push({
                frame: 0,
                value: Vector3.Zero()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 0.5),
                value: Vector3.Zero()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 0.9),
                value: Vector3.One()
            })
            keys.push({
                frame: Math.floor(options.totalFrames * 1.0),
                value: Vector3.Zero()
            })
        }
        animation.setKeys(keys);
        labelMesh.animations.push(animation);
        const animatable = options.scene.beginAnimation(labelMesh, 0, keys[keys.length - 1].frame, true);

        label.setMesh(labelMesh);
        label.setAnimation(animation);
        label.setAnimatable(animatable);

        return label;
    }
}