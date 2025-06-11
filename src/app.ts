import {RouterService} from "./services/RouterService";
import {SceneService} from "./services/SceneService";
import "@babylonjs/inspector";
import {Tracer} from "./entities/Tracer";
import {TracerServiceFactory} from "./services/TracerServiceFactory";

const routerService = new RouterService();

const sceneService = new SceneService(
    document.getElementById("renderCanvas"),
    document.getElementById("loadingScreen")
);

await sceneService.init();
if (routerService.getIsDEBUG()) {
    sceneService.showDebugLayer();
}

const tracerService = TracerServiceFactory.create({
    scene: sceneService.getScene()
});

[Tracer.SIDE_CENTER].forEach((side) => {
    for (let i = 0; i < 10; i++) {
        let from = Math.floor(Math.random() * 50);
        let to = from + Math.floor(Math.random() * 49) + 1;
        tracerService.createTracer(from, to, side);
    }
})

window["test"] = tracerService
