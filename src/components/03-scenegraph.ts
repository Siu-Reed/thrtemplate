import * as Three from "three";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private system1 = new Three.Object3D();
    private system2 = new Three.Object3D();
    private system3 = new Three.Object3D();
    private mesh1!: Three.Mesh;
    private mesh2!: Three.Mesh;
    private mesh3!: Three.Mesh;

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
        this.camera.position.z = 20;
    }

    private setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new Three.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    private setupModel() {
        const geometry1 = new Three.SphereGeometry(3, 10, 10);
        const geometry2 = new Three.SphereGeometry(2, 10, 10);
        const geometry3 = new Three.SphereGeometry(1, 10, 10);
        const material1 = new Three.MeshPhongMaterial({ color: 0x44a88 });
        const material2 = new Three.MeshPhongMaterial({ color: 0x12458 });
        const material3 = new Three.MeshPhongMaterial({ color: 0xad990 });

        this.mesh1 = new Three.Mesh(geometry1, material1);
        this.mesh2 = new Three.Mesh(geometry2, material2);
        this.mesh3 = new Three.Mesh(geometry3, material3);

        this.system1.add(this.mesh1, this.system2);
        this.system2.add(this.mesh2, this.system3);
        this.system3.add(this.mesh3);

        this.system2.position.x = 10;
        this.system3.position.x = 3;

        this.scene.add(this.system1);
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
        this.system1.rotation.y = T;
        this.system2.rotation.y = 2 * T;
        this.system3.rotation.y = 4 * T;
    }
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }
}
