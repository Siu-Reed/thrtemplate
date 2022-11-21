import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private light!: Three.SpotLight;
    private helper!: Three.SpotLightHelper;

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

        /**
         * 절두체? 화면이 담기는 정육면체
         *
         * @param [fov=50] Camera frustum vertical field of view. Default value is 50.
         * fovy, 절두체의 높이 방향에 대한 각도 라디안 아닌 deg
         *
         * @param [aspect=1] Camera frustum aspect ratio. Default value is 1.
         * 절두체의 가로 길이 / 세로 길이 비율
         *
         *
         * @param [near=0.1] Camera frustum ne ar plane. Default value is 0.1.
         * @param [far=2000] Camera frustum far plane. Default value is 2000.
         *  z-near, z-far 카메라 사이의 거리
         *
         * z-near 와 z-far 사이의 거리에 장면의 물제가 모두 들어오게 지정해야함
         * 벗어나는 영역은 렌더 되지않음
         */

        this.camera.position.set(7, 7, 0);
        this.camera.lookAt(0, 0, 0);
    }

    private setupLight() {
        this.light = new Three.SpotLight(0xffffff, 1);
        // 원뿔 형태의 광원
        this.light.position.set(0, 5, 0);
        this.light.target.position.set(0, 0, 0);
        this.light.angle = Three.MathUtils.degToRad(40);
        this.light.penumbra = 0;
        // 빛의 감쇄율 0~1 사이 숫자, 1에 가까울수록 빛이 점점 감쇄

        this.helper = new Three.SpotLightHelper(this.light);

        this.scene.add(this.light, this.light.target, this.helper);
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

            if (this.light) {
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this.light.target.position);
                // target 을 변경하는 지, light 자체를 변경하는 지에 따라 다른 형상이니 유의
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
