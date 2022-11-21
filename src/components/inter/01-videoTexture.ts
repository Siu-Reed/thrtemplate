import * as Three from "three";
import { TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";

export default class App {
    private container: HTMLDivElement = document.querySelector("#webgl-container")!;
    private renderer: Three.WebGLRenderer = new Three.WebGLRenderer({ antialias: true });
    private scene: Three.Scene = new Three.Scene();
    private camera!: Three.PerspectiveCamera;
    private videoTexture!: Three.VideoTexture;

    stageWidth!: number;
    stageHeight!: number;

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.setSize();

        this.setupCamera();
        this.setupLight();
        this.setupVideo();
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
    private setupVideo() {
        const video = document.createElement("video");
        if (navigator.mediaDevices) {
            const constraints = {
                video: {
                    width: 1280,
                    height: 720,
                },
            };

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    video.srcObject = stream;
                    video.play();
                    this.videoTexture = new Three.VideoTexture(video);
                    this.setupModel();
                    // 비동기 처리 해야 댐
                })
                .catch(function (error) {
                    console.error("카메라에 접근할 수 없습니다.", error);
                });
        } else {
            console.error("mediaDevices 인터페이스 사용 불가");
        }
    }
    private setupModel() {
        const geometry = new Three.BoxGeometry(1, 1, 1);
        const material = new Three.MeshPhongMaterial({
            map: this.videoTexture,
            color: 0x44a888,
        });
        const box = new Three.Mesh(geometry, material);

        this.scene.add(box);
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
