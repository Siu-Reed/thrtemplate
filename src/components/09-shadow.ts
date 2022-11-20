import * as Three from "three";
import { Light } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// directional, point, spotlight 세개가 그림자 생성 가능
// recieveShadow = true
// castShadow = true

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
        //
        this.renderer.shadowMap.enabled = true;
        //
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
        this.light = new Three.DirectionalLight("#ffffff", 1);
        //
        this.light.castShadow = true;
        //
        this.light.position.set(0, 5, 0);
        this.light.target.position.set(0, 0, 0);
        this.scene.add(this.light.target);

        const cameraHelper = new Three.CameraHelper(this.light.shadow.camera);
        // 그림자를 지원하는 광원은 shadow 속성을 갖고 거기엔 camera 속성이 있음
        // 카메라의 절두체를 벗어난 그림자들이 모두 잘려나가는 거 확인 가능
        // 그림자 카메라 절두체는 orthgraphic
        this.light.shadow.camera.top = this.light.shadow.camera.right = 6;
        this.light.shadow.camera.bottom = this.light.shadow.camera.left = -6;
        this.light.shadow.radius = 5;

        this.light.shadow.mapSize.width = this.light.shadow.mapSize.height = 2048;
        // 그림자 텍스쳐매핑이미지 크기, 기본값 512 크기를 키움으로서 그래픽 향상

        const helper = new Three.DirectionalLightHelper(this.light);
        this.helper = helper;
        this.scene.add(helper);

        this.scene.add(this.light, cameraHelper);
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
        //
        ground.receiveShadow = true;

        this.scene.add(ground);

        const bigSphereGeometry = new Three.TorusKnotGeometry();
        const bigSphereMaterial = new Three.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.2,
        });

        const bigSphere = new Three.Mesh(bigSphereGeometry, bigSphereMaterial);
        bigSphere.position.y = 1.6;
        bigSphere.rotation.x = Three.MathUtils.degToRad(-90);
        //
        bigSphere.castShadow = true;
        bigSphere.receiveShadow = true;
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
            //
            torus.castShadow = true;
            torus.receiveShadow = true;
            //
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
        //
        smallSphere.castShadow = true;
        smallSphere.receiveShadow = true;
        //
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
