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
        const material = new Three.MeshBasicMaterial({
            visible: true,

            transparent: true,
            opacity: 0.5,
            // transparent가 true 여야지 opacity 정상작동

            depthTest: true,
            // mesh의 픽셀 위치 z 값을, 깊이 버퍼값을 이용해 검사할 지에 대한 여부
            depthWrite: true,
            // 렌더링되고 있는 mesh의 픽셀 위치 z 값을 깊이 버퍼에 기록할 지에 대한 여부
            side: Three.FrontSide,
            // mesh를 구성하는 면에 대해 앞면, 뒷면, 전체 등을 렌더링 할 지 선택
            // MeshBasicMaterial 의 경우 광원의 영향을 받지 않아 위 속성에 대한 변화 차이 느끼기 힘듬

            color: 0xffff00,
            // wireframe: true,
            // mesh 를 선형태로 렌더링할 지 여부
        });
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
