import * as Three from "three";
import { Light } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private light!: Three.DirectionalLight;
    private helper!: Three.DirectionalLightHelper;

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
        this.camera.position.set(7, 7, 0);
        this.camera.lookAt(0, 0, 0);
    }

    private setupLight() {
        // const light = new Three.AmbientLight(0xffffff, 5);
        // 환경광
        // 단순히 씬에 존재하는 모든 물체에 대해 단일색상으로 빛 렌더
        // 광원의 영향을 받지 못하는 물체도 살짝 비춰주기 위해 씬에 아주 약하게만 추가

        // const light = new Three.HemisphereLight("b0d8f5", "bb7a1c", 1);
        // 주변광
        // 위에서 비치는 빛, 아래서 비치는 빛 두가지 인자

        const light = new Three.DirectionalLight("#ffffff", 1);
        this.light = light;
        // 태양처럼 빛과 물체간 거리에 상관 없이 동일한 빛의 효과를 줌
        light.position.set(0, 5, 0);
        light.target.position.set(0, 0, 0);
        this.scene.add(light.target);

        const helper = new Three.DirectionalLightHelper(light);
        this.helper = helper;
        this.scene.add(helper);

        this.scene.add(light);
    }

    private setupModel() {
        const groundGeometry = new Three.PlaneGeometry(10, 10);
        const groundMaterial = new Three.MeshStandardMaterial({
            color: "#2c3e50",
            roughness: 0.5,
            metalness: 0.5,
            side: Three.DoubleSide,
        });

        const ground = new Three.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Three.MathUtils.degToRad(-90);
        this.scene.add(ground);

        const bigSphereGeometry = new Three.SphereGeometry(1.5, 64, 64, 0, Math.PI);
        const bigSphereMaterial = new Three.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2,
        });

        const bigSphere = new Three.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.rotation.x = Three.MathUtils.degToRad(-90);
        this.scene.add(bigSphere);

        const torusGeometry = new Three.TorusGeometry(0.4, 0.1, 32, 32);
        const torusMaterial = new Three.MeshStandardMaterial({
            color: "#a0a0a0",
            roughness: 0.5,
            metalness: 0.1,
        });

        for (let i = 0; i < 8; i++) {
            const torusPivot = new Three.Object3D();
            const torus = new Three.Mesh(torusGeometry, torusMaterial);
            torusPivot.rotation.y = Three.MathUtils.degToRad(45 * i);

            torus.position.set(3, 0.5, 0);
            torusPivot.add(torus);
            this.scene.add(torusPivot);
        }

        const smallSphereGeometry = new Three.SphereGeometry(0.3, 32, 32);
        const smallSphereMaterial = new Three.MeshStandardMaterial({
            color: "#eeeeee",
            roughness: 0.2,
            metalness: 0.5,
        });
        const smallSpherePivot = new Three.Object3D();
        const smallSphere = new Three.Mesh(smallSphereGeometry, smallSphereMaterial);
        smallSpherePivot.add(smallSphere);
        smallSpherePivot.name = "smallSpherePivot";
        // 이름을 설정함으로서 객체 검색 가능해짐
        smallSphere.position.set(3, 0.5, 0);
        this.scene.add(smallSpherePivot);
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
        // ㅇ ㅅㅇ 객체명 지정
        const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot");
        if (smallSpherePivot) {
            smallSpherePivot.rotation.y = Three.MathUtils.degToRad(T * 50);

            if (this.light.target) {
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this.light.target.position);
                this.helper.update();
            }
        }
    }
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }
}
