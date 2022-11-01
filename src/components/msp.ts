import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;

    stageWidth!: number;
    stageHeight!: number;

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.setSize();

        this.setupScene();
        this.setupCamera();
        this.setupLight();
        this.setupModel();
        this.setupControls();

        this.resize();
        requestAnimationFrame(this.render.bind(this));

        window.addEventListener("resize", this.resize.bind(this));
    }
    setSize() {
        this.stageWidth = this.container.clientWidth;
        this.stageHeight = this.container.clientHeight;
    }
    private setupScene() {
        this.scene.background = new Three.Color(0xf0f0f0);
    }

    private setupCamera() {
        this.camera = new Three.PerspectiveCamera(75, this.stageWidth / this.stageHeight, 0.1, 100);

        this.camera.position.z = 4.5;
        this.scene.add(this.camera);
    }
    private setupLight() {
        const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
        const directionalLight = new Three.DirectionalLight(0xffffff, 1);
        this.scene.add(ambientLight);
        this.camera.add(directionalLight);
        // 동적 광원
    }
    private setupModel() {
        const gltfLoader = new GLTFLoader();

        gltfLoader.load("./msp/msp.gltf", gltf => {
            const model = gltf.scene;
            model.rotateX(Three.MathUtils.degToRad(-75));
            model.rotateZ(Three.MathUtils.degToRad(-20));
            this.scene.add(model);
        });
    }
    private setupControls() {
        new OrbitControls(this.camera, this.container);
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
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }
    update(T: DOMHighResTimeStamp) {
        T *= 0.001;
    }
}
