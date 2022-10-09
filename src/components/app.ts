import * as THREE from "three";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera = null!;
    private cube: THREE.Mesh = null!;
    stageWidth: number = null!;
    stageHeight: number = null!;

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.setSize();

        this.setupCamera();
        this.setupLight();
        this.setupModel();

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));

        requestAnimationFrame(this.render.bind(this));
    }

    setSize() {
        this.stageWidth = this.container.clientWidth;
        this.stageHeight = this.container.clientHeight;
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
        this.cube.rotation.x = T;
        this.cube.rotation.y = T;
    }

    private setupCamera() {
        const camera = new THREE.PerspectiveCamera(75, this.stageWidth / this.stageHeight, 0.1, 100);
        camera.position.z = 2;
        this.camera = camera;
    }

    private setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    private setupModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

        const cube = new THREE.Mesh(geometry, material);

        this.scene.add(cube);
        this.cube = cube;
    }
}
