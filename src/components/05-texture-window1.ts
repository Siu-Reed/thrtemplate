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

        const material = new Three.MeshStandardMaterial({
            // map: map,

            // normalMap: mapNormal,
            // 노멀맵 = 법선 벡터를 이미지화해서 저장해둔 것으로  인위적으로 픽셀 단위 광원효과가 달라져 입체감 표현,geometry 형상이 바뀌는 것은 아니니 착시
            // 법선벡터 = mesh 표면에 대한 수직 벡터로 광원의 영향을 계산하는데 사용

            displacementMap: mapHeight,
            // mesh의 geometry 좌표를 실제 변형하여 입체감, 맵 이미지 픽셀 값이 밝을 수로 좌표 변위가 커짐
            // 박스와 같이 표면 구성좌표가 없는 곳에서는 변형 없으니 세그먼트 분리해야함 1, 1, 1 > 1, 1, 1, 256, 256, 256
            displacementScale: 0.2,
            // 변위효과 기본값 1
            displacementBias: -0.15,
            // 뜨는 사각형 조절.. 잘 모르겟으 찾아봐야됨

            aoMap: mapAO,
        });

        const box = new Three.Mesh(new Three.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        const sphere = new Three.Mesh(new Three.SphereGeometry(0.5, 32, 32), material);

        box.position.set(-1, 0, 0);
        sphere.position.set(1, 0, 0);

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
