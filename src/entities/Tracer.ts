export class Tracer {
    animationIndex = 0;
    points = []
    renderCallback;

    setPoints(points) {
        this.points = points;
    }

    tick() {
        this.animationIndex++;
    }

    setRenderCallback(renderCallback) {
        this.renderCallback = renderCallback;
    }

    getRenderCallback() {
        return this.renderCallback;
    }
}