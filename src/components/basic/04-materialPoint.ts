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
        this.camera.position.z = 10;
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
        for (let i = 0; i < 10000; i++) {
            const x = Three.MathUtils.randFloatSpread(5);
            const y = Three.MathUtils.randFloatSpread(5);
            const z = Three.MathUtils.randFloatSpread(5);
            vertices.push(x, y, z);
        }
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute("position", new Three.Float32BufferAttribute(vertices, 3));
        // 3은 xyz 세 수가 하나의 좌표임을 의미

        const sprite = new Three.TextureLoader().load("./circle.png");
        const material = new Three.PointsMaterial({
            map: sprite,
            alphaTest: 0.5,
            // 픽셀 값 중 알파값이 alphaTest 값보다 클 때만 렌더링
            color: 0xffff00,
            size: 0.1,
            // 포인트의 크기
            sizeAttenuation: true,
            // 카메라 거리에 따른 크기 변환
            // 카메라에서 가까운 포인트는 크고 먼 포인트는 작아지는 원근..
        });

        const points = new Three.Points(geometry, material);
        this.scene.add(points);
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
