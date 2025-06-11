import {Animation, CreateSphere, MeshBuilder, StandardMaterial, Texture, Vector3} from "@babylonjs/core";
import {AnimatableMesh} from "../../core/AnimatableMesh";
import {LabelCreatorOptionsInterface} from "./LabelCreatorOptionsInterface";
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

        label.setMesh(labelMesh);

        return label;
    }
}