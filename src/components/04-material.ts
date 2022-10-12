import * as Three from "three";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private cube!: Three.Mesh;

    stageWidth!: number;
    stageHeight!: number;

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.setSize();

        this.setupCamera();
        this.setupLight();
        this.setupModel();

        this.resize();
        requestAnimationFrame(this.render.bind(this));

        window.addEventListener("resize", this.resize.bind(this));
    }
    setSize() {
        this.stageWidth = this.container.clientWidth;
        this.stageHeight = this.container.clientHeight;
    }

    private setupCamera() {
        this.camera = new Three.PerspectiveCamera(75, this.stageWidth / this.stageHeight, 0.1, 100);
        this.camera.position.z = 2;
    }

    private setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new Three.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    private setupModel() {
        const vertices = [];
        for (let i = 0; 1 < 10000; i++) {
            const x = Three.MathUtils.randFloatSpread(5);
            const y = Three.MathUtils.randFloatSpread(5);
            const z = Three.MathUtils.randFloatSpread(5);
            vertices.push(x, y, z);
        }
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute("position", new Three.Float32BufferAttribute(vertices, 3));
        // 3은 xyz 세 수가 하나의 좌표임을 의미

        const material = new Three.PointsMaterial({
            color: 0xff0000,
            size: 5,
            sizeAttenuation: false,
        });
        const points = new Three.Points(geometry, material);
        this.scene.add(points);
    }
    reRender() {
        this.camera.aspect = this.stageWidth / this.stageHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.stageWidth, this.stageHeight);
    }
    resize() {
        this.setSize();
        this.reRender();
    }
    update(T: DOMHighResTimeStamp) {
        T *= 0.001;
        this.cube.rotation.x = T;
        this.cube.rotation.y = T / 10;
    }
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }
}
