import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private light!: Three.RectAreaLight;
    private helper!: RectAreaLightHelper;

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
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        this.camera.position.set(7, 7, 0);
        this.camera.lookAt(0, 0, 0);
    }

    private setupLight() {
        RectAreaLightUniformsLib.init();
        this.light = new Three.RectAreaLight(0xffffff, 10, 3, 0.5);
        // (색상, 세기, 가로, 세로)
        this.light.position.set(0, 5, 0);
        this.light.rotation.x = Three.MathUtils.degToRad(-90);
        // 광원의 방향을 대상의 위치로 지정하는 것이 않고 각도로 지정한다는 특이점이 있음!!

        this.helper = new RectAreaLightHelper(this.light);

        this.scene.add(this.light, this.helper);
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

        //
        // mesh 가 아닌 object3d 만 생성하여 화면상에 렌더링 되지 않음
        const targetPivot = new Three.Object3D();
        const target = new Three.Object3D();
        targetPivot.add(target);
        targetPivot.name = "targetPivot";
        target.position.set(3, 0.5, 0);
        this.scene.add(targetPivot);
        //
    }
    private setupControls() {
        new OrbitControls(this.camera, this.container);
    }

    reRender() {
        const aspect = this.container.clientWidth / this.container.clientHeight;

        // perspective 카메라의 경우 aspect를 업뎃해서 비율 조정했지만 이 경우는 left right 조정
        if (this.camera instanceof Three.PerspectiveCamera) {
            this.camera!.aspect = aspect;
        } else {
            // this.camera.left = -10 * aspect;
            // this.camera.right = 10 * aspect;
        }
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

            //
            const smallSphere = smallSpherePivot.children[0];
            smallSphere.getWorldPosition(this.camera.position);
            // 카메라의 위치를 작은 구의 위치로 계속하여 업데이트
            //

            // 카메라가 보는 방향을 작은 구의 이동방향으로
            const targetPivot = this.scene.getObjectByName("targetPivot");
            if (targetPivot) {
                targetPivot.rotation.y = Three.MathUtils.degToRad(T * 50 + 10);
                // 빨간 색 구보다 10도 더 회전시켜서 대략적인 빨간 구의 이동방향으로 잡음

                const target = targetPivot.children[0];
                const pt = new Three.Vector3();
                // vector?
                target.getWorldPosition(pt);
                //  target 의 위치를 얻는 코드

                this.camera.lookAt(pt);

                // orthgraphic 카메라의 경우 원근감이 없어서 원하는 결과 x
            }

            if (this.light) {
                const smallSphere = smallSpherePivot.children[0];
                // smallSphere.getWorldPosition(this.light.target.position);
                // target 을 변경하는 지, light 자체를 변경하는 지에 따라 다른 형상이니 유의
                // this.helper.update();
            }
        }
    }
    render(T: DOMHighResTimeStamp) {
        this.renderer.render(this.scene, this.camera);
        this.update(T);

        requestAnimationFrame(this.render.bind(this));
    }
}
