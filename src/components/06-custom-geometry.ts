import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private cube!: Three.Mesh;

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
        this.camera.position.z = 2;
    }

    private setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new Three.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    private setupModel() {
        const rawPositions = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];

        const positions = new Float32Array(rawPositions);
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute("position", new Three.BufferAttribute(positions, 3));

        geometry.setIndex([0, 1, 2, 2, 1, 3]);
        //정점 구성, 좌표 0(-1,-1,0)부터 시작하여 삼각형 012, 213 을 그려서 사각형 표현

        // geometry.computeVertexNormals();
        // 자동 법선 벡터 /정점에 대한 법선벡터가 지정되어야 제대로 작동 (입사각과 반사각 계산하여 재질 표면과 색상 결정)

        const rawNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
        const normals = new Float32Array(rawNormals);
        geometry.setAttribute("normal", new Three.BufferAttribute(normals, 3));
        // 사용자 지정 법선 벡터
        // 메쉬 표면 수직으로 지정해야하기 때문에 0,0,1

        const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
        const colors = new Float32Array(rawColors);
        geometry.setAttribute("color", new Three.BufferAttribute(colors, 3));
        // 사용자 지정 색상, 재질에 vertexColors 속성 추가해야 정상 적용
        // 메쉬 기본 색상에 영향 받음

        const material = new Three.MeshPhongMaterial({ color: 0xffffff, vertexColors: true });
        const box = new Three.Mesh(geometry, material);

        const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);

        this.scene.add(box, helper);
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
