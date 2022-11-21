import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

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
        this.scene.add(this.camera);
        // 동적 광원 구성을 위해 추가
    }

    private setupLight() {
        // 모든 면에 대해 동일하게 비추는 빛
        const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const color = 0xffffff;
        const intensity = 1;
        const light = new Three.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        // this.scene.add(light);
        // 정적 광원 / scene 에 포함되어 움직이지 않음
        this.camera.add(light);
        // 동적 광원
    }

    private setupModel() {
        const textureLoader = new Three.TextureLoader();
        const map = textureLoader.load("./Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("./Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("./Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("./Glass_Window_002_normal.jpg");
        const mapRoughness = textureLoader.load("./Glass_Window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("./Glass_Window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("./Glass_Window_002_opacity.jpg");
        const mapLight1 = textureLoader.load("./light1.jpeg");
        const mapLight2 = textureLoader.load("./light2.jpg");

        const material = new Three.MeshStandardMaterial({
            map: map,

            normalMap: mapNormal,
            displacementMap: mapHeight,
            displacementScale: 0.2,
            displacementBias: -0.15,

            aoMap: mapAO,
            // 그림자 같은 효과,
            // uv2 속성 지정해야 사용 가능,
            aoMapIntensity: 10,
            // 기본값 = 1, 그림자 강도

            roughnessMap: mapRoughness,
            // 맵 이미지 픽셀값이 밝을 수록 거칠기가 강해짐
            roughness: 1,
            // 0~1 강도

            metalnessMap: mapMetalic,
            // 맵 이미지 픽셀값이 밝을 수록 금속성이 강해짐
            metalness: 0.5,

            // alphaMap: mapAlpha,
            transparent: true,
            side: Three.DoubleSide,
            // 맵 이미지 픽셀값이 밝을 수록 선명, 검정일 때 투명, 투명도 활성화 후에 사용 가능

            lightMap: mapLight1,
            lightMapIntensity: 2,
            // 지정된 이미지 색상으로 발광 효과
            // uv2 속성에 데이터를 지정해야함
        });

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material);

        box.position.set(-1, 0, 0);
        sphere.position.set(1, 0, 0);

        box.geometry.attributes.uv2 = box.geometry.attributes.uv;
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;

        const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);

        this.scene.add(box, sphere);
        // this.scene.add(boxHelper, sphereHelper);
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
