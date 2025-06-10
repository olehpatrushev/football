import {RouterService} from "./services/RouterService";
import {SceneService} from "./services/SceneService";
import {TracerService} from "./services/TracerService";
import "@babylonjs/inspector";
import {Tracer} from "./entities/Tracer";

const routerService = new RouterService();

const sceneService = new SceneService(
    document.getElementById("renderCanvas"),
    document.getElementById("loadingScreen")
);
await sceneService.init();
if (routerService.getIsDEBUG()) {
    sceneService.showDebugLayer();
}

const tracerService = new TracerService(sceneService.getScene());
tracerService.createTracer();

[Tracer.SIDE_CENTER, Tracer.SIDE_LEFT, Tracer.SIDE_RIGHT].forEach((side) => {
    for (let i = 0; i < 10; i++) {
        let from = Math.floor(Math.random() * 50);
        let to = from + Math.floor(Math.random() * 50);
        tracerService.createTracer(from, to, side);
    }
})

window["test"] = tracerService
