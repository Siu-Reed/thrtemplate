import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    private setupCamera() {
        this.camera = new Three.PerspectiveCamera(75, this.stageWidth / this.stageHeight, 0.1, 100);
        this.camera.position.z = 3;
    }

    private setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new Three.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    private setupModel() {
        const textureLoader = new Three.TextureLoader();
        const map = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_height.jpg");
        const mapNormal = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("./Glass_Window_002_SD/Glass_Window_002_opacity.jpg");

        const material = new Three.MeshStandardMaterial({
            map: map,
            normalMap: mapNormal,
        });
        // Uv 좌표는 three.js의 geometry에 기본 지정되어 있고 0~1의 값임

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), material);
        const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material);
        box.position.set(-1, 0, 0);
        sphere.position.set(1, 0, 0);
        this.scene.add(box, sphere);
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
    update(T: DOMHighResTimeStamp) {
        T *= 0.001;
    }
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }
}
