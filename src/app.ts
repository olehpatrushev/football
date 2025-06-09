import {RouterService} from "./services/RouterService";
import {SceneService} from "./services/SceneService";
import {ConfigService} from "./services/ConfigService";
import {TracerService} from "./services/TracerService";

const routerService = new RouterService();

const configService = new ConfigService(
    routerService.getIsDEBUG()
);

const sceneService = new SceneService(
    document.getElementById("renderCanvas"),
    document.getElementById("loadingScreen")
);
await sceneService.init();
if (configService.getIsDEBUG()) {
    sceneService.showDebugLayer();
}

const tracerService = new TracerService(sceneService.getScene());
tracerService.createTracer();
