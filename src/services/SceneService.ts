import {
    ArcRotateCamera,
    Color3,
    CubeTexture,
    Database,
    Engine,
    HemisphericLight,
    ImportMeshAsync,
    MeshBuilder,
    Quaternion,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF/2.0";
import {Debug} from "@babylonjs/core/Legacy/legacy";

export class SceneService {
    canvasEl;
    loadingScreenEl;
    engine;
    scene;

    constructor(canvasEl, loadingScreenEl) {
        this.canvasEl = canvasEl;
        this.loadingScreenEl = loadingScreenEl;
    }

    async init() {
        Database.IDBStorageEnabled = true;

        this.engine = new Engine(this.canvasEl, true);
        this.engine.enableOfflineSupport = true;

        await this.createScene();

        this.engine.runRenderLoop(() => this.scene.render());

        window.addEventListener("resize", () => this.engine.resize());
    }

    showDebugLayer() {
        this.scene.debugLayer.show();
        new Debug.AxesViewer(this.scene, 100);
    }

    getScene() {
        return this.scene;
    }

    async createScene() {
        this.scene = new Scene(this.engine);

        // Настройка камеры
        const camera = new ArcRotateCamera("camera", 0, Math.PI / 3, 10, Vector3.Zero(), this.scene);
        camera.attachControl(this.canvasEl, true);
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 80;

        // Добавление освещения
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        // Создание неба
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 1000.0}, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // 1. Загрузка .env текстуры (HDR окружение)
        const envTexture = CubeTexture.CreateFromPrefilteredData(
            "https://assets.babylonjs.com/environments/studio.env",
            this.scene
        );

        // 2. Установка параметров
        envTexture.coordinatesMode = Texture.SPHERICAL_MODE; // 3 == SPHERICAL_MODE
        envTexture.lodGenerationScale = 0.8;
        envTexture.lodGenerationOffset = 0;
        envTexture.level = 1;
        envTexture.rotationY = 0; // ориентация освещения

        // 3. Назначение HDR окружения в сцену
        this.scene.environmentTexture = envTexture;
        this.scene.environmentIntensity = 1; // глобальная яркость environment света


        // Загрузка модели
        try {
            const result = await ImportMeshAsync("models/football.glb", this.scene);
            const model = result.meshes[0];

            // Получаем список анимаций
            // const animations = result.animationGroups;
            // if (animations && animations.length > 0) {
            //     // Запускаем все анимации
            //     animations.forEach(animation => {
            //         animation.play(true);
            //     });
            // }

            // Центрирование модели
            const boundingInfo = model.getHierarchyBoundingVectors();
            // const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);
            // model.position = center.scale(-1);

            // Автоматическая настройка камеры под размер модели
            const radius = boundingInfo.max.subtract(boundingInfo.min).length() * 0.5;
            camera.radius = radius * 2;

            const screen4 = this.scene.getMaterialByName("screen.4");
            const screen5 = this.scene.getMaterialByName("screen.5");
            screen4.needDepthPrePass = true;
            screen5.needDepthPrePass = true;

            const screen4aMesh = this.scene.getMeshByName("screen_4");
            const screen4bMesh = this.scene.getMeshByName("R_Tunnel_LED");
            screen4aMesh.position = new Vector3(518.0243530273438, -1350, 501.41876220703125);
            screen4aMesh.rotationQuaternion = new Quaternion(0, 0, 0.9961946980917455, -0.08715574274765824);
            screen4bMesh.position = new Vector3(518.0243530273438, -1350.04, 501.41876220703125);// (debugNode as BABYLON.Mesh)
            screen4bMesh.rotationQuaternion = new Quaternion(0, 0, 0.9961946980917455, -0.08715574274765824);// (debugNode as BABYLON.Mesh)

            const screen5aMesh = this.scene.getMeshByName("screen_5");
            const screen5bMesh = this.scene.getMeshByName("R_Tunnel_LED.001");
            screen5aMesh.position = new Vector3(518.0243530273438, 1434.703, 500.6176452636719);// (debugNode as BABYLON.Mesh)
            screen5aMesh.rotationQuaternion = new Quaternion(0, 0, -0.08715574274765815, 0.9961946980917455);// (debugNode as BABYLON.Mesh)
            screen5bMesh.position = new Vector3(518.0243530273438, 1434.703, 500.6176452636719);// (debugNode as BABYLON.Mesh)
            screen5bMesh.rotationQuaternion = new Quaternion(0, 0, -0.08715574274765817, 0.9961946980917455);// (debugNode as BABYLON.Mesh)

            // Скрываем спиннер после загрузки
            this.loadingScreenEl.style.display = "none";
        } catch (error) {
            console.error("Ошибка при загрузке модели:", error);
            this.loadingScreenEl.innerHTML = `<div style="color: red;">Ошибка загрузки модели: ${error.message}</div>`;
        }
    }
}