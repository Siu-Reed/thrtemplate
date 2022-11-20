import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default class App {
    container: HTMLElement = document.querySelector("#webgl-container")!;
    renderer = new Three.WebGLRenderer({ antialias: true });
    composer!: EffectComposer;
    bloomPass!: UnrealBloomPass;
    scene = new Three.Scene();
    camera!: Three.PerspectiveCamera;

    stageWidth = this.container!.clientWidth;
    stageHeight = this.container!.clientHeight;

    //
    //
    sunLight?: Three.PointLight;

    private systemCenterAxis = new Three.Object3D();
    private solarsystem = new Three.Object3D();

    private aSystem = new Three.Object3D();
    private bSystem = new Three.Object3D();
    private cSystem = new Three.Object3D();
    private dSystem = new Three.Object3D();
    private eSystem = new Three.Object3D();
    private fSystem = new Three.Object3D();
    private gSystem = new Three.Object3D();
    private hSystem = new Three.Object3D();

    private aOrbit = new Three.Object3D();
    private bOrbit = new Three.Object3D();
    private cOrbit = new Three.Object3D();
    private dOrbit = new Three.Object3D();
    private eOrbit = new Three.Object3D();
    private fOrbit = new Three.Object3D();
    private gOrbit = new Three.Object3D();
    private hOrbit = new Three.Object3D();

    private sunMesh?: Three.Object3D;
    private a0Mesh?: Three.Object3D;
    private b0Mesh?: Three.Object3D;
    private c0Mesh?: Three.Object3D;
    private c1Mesh?: Three.Object3D;
    private d0Mesh?: Three.Object3D;
    private e0Mesh?: Three.Object3D;
    private f0Mesh?: Three.Object3D;
    private f1Mesh?: Three.Object3D;
    private g0Mesh?: Three.Object3D;
    private h0Mesh?: Three.Object3D;

    constructor() {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.container?.appendChild(this.renderer.domElement);

        this.setupCamera();
        this.setupLight();
        this.setupModel();
        this.setupPostProcess();
        this.setupControl();

        this.resize();
        requestAnimationFrame(this.render.bind(this));

        window.addEventListener("resize", this.resize.bind(this));
    }

    setupPostProcess() {
        const renderPass = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(new Three.Vector2(window.innerWidth, window.innerHeight), 2, 0.5, 0.8);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderPass);
        this.composer.addPass(this.bloomPass);
    }

    setupCamera() {
        this.camera = new Three.PerspectiveCamera(75, this.stageWidth! / this.stageHeight!, 0.1, 10000);
        this.camera.position.z = 800;
    }

    setupLight() {
        const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
        this.sunLight = new Three.PointLight(0xffffff, 1);
        this.scene.add(ambientLight, this.sunLight);
    }

    setupModel() {
        const sunGeometry = new Three.SphereGeometry(50, 128, 128);
        const sunTexture = new Three.MeshStandardMaterial({
            color: 0xff6a3e,
            emissive: 0xffff00,
        });
        this.sunMesh = new Three.Mesh(sunGeometry, sunTexture);
        //
        //
        const a0Geometry = new Three.SphereGeometry(10, 128, 128);
        const a0Texture = new Three.MeshStandardMaterial({
            color: 0xb9ccf2,
            // emissive: 0xffffff,
        });
        this.a0Mesh = new Three.Mesh(a0Geometry, a0Texture);
        //
        //
        const b0Geometry = new Three.SphereGeometry(20, 128, 128);
        const b0Texture = new Three.MeshStandardMaterial({
            color: 0xe75d21,
            // emissive: 0xffffff,
        });
        this.b0Mesh = new Three.Mesh(b0Geometry, b0Texture);
        //
        //
        const c0Geometry = new Three.SphereGeometry(25, 128, 128);
        const c0Texture = new Three.MeshStandardMaterial({
            color: 0x3960ef,
            // emissive: 0xffffff,
        });
        this.c0Mesh = new Three.Mesh(c0Geometry, c0Texture);

        const c1Geometry = new Three.SphereGeometry(5, 128, 128);
        const c1Texture = new Three.MeshStandardMaterial({
            color: 0xfbffbe,
            // emissive: 0xffffff,
        });
        this.c1Mesh = new Three.Mesh(c1Geometry, c1Texture);
        //
        //
        const d0Geometry = new Three.SphereGeometry(18, 128, 128);
        const d0Texture = new Three.MeshStandardMaterial({
            color: 0xe29d42,
            metalness: 1,
            // emissive: 0xffffff,
        });
        this.d0Mesh = new Three.Mesh(d0Geometry, d0Texture);
        //
        //
        const e0Geometry = new Three.SphereGeometry(40, 128, 128);
        const e0Texture = new Three.MeshStandardMaterial({
            color: 0xdbc09d,
            // emissive: 0xffffff,
        });
        this.e0Mesh = new Three.Mesh(e0Geometry, e0Texture);
        //
        //
        const f0Geometry = new Three.SphereGeometry(30, 128, 128);
        const f0Texture = new Three.MeshStandardMaterial({
            color: 0x6a9572,
            // emissive: 0xffffff,
        });
        this.f0Mesh = new Three.Mesh(f0Geometry, f0Texture);

        const f1Geometry = new Three.TorusGeometry(40, 4, 4, 128);
        const f1Texture = new Three.MeshStandardMaterial({
            color: 0x464325,
            // emissive: 0xffffff,
        });
        this.f1Mesh = new Three.Mesh(f1Geometry, f1Texture);
        this.f1Mesh.rotation.x = Three.MathUtils.degToRad(80);
        //
        //
        const g0Geometry = new Three.SphereGeometry(25, 128, 128);
        const g0Texture = new Three.MeshStandardMaterial({
            color: 0x4ab8ce,
            // emissive: 0xffffff,
        });
        this.g0Mesh = new Three.Mesh(g0Geometry, g0Texture);
        //
        //
        const h0Geometry = new Three.SphereGeometry(20, 128, 128);
        const h0Texture = new Three.MeshStandardMaterial({
            color: 0x2c4493,
            // emissive: 0xffffff,
        });
        this.h0Mesh = new Three.Mesh(h0Geometry, h0Texture);
        //
        //
        //
        this.aSystem.add(this.a0Mesh);
        this.bSystem.add(this.b0Mesh);
        this.cSystem.add(this.c0Mesh, this.c1Mesh);
        this.dSystem.add(this.d0Mesh);
        this.eSystem.add(this.e0Mesh);
        this.fSystem.add(this.f0Mesh, this.f1Mesh);
        this.gSystem.add(this.g0Mesh);
        this.hSystem.add(this.h0Mesh);
        //
        //
        //
        this.c1Mesh.position.x = 40;

        //
        //
        //
        this.aSystem.position.x = 80;
        this.bSystem.position.x = 140;
        this.cSystem.position.x = 210;
        this.dSystem.position.x = 290;
        this.eSystem.position.x = 370;
        this.fSystem.position.x = 470;
        this.fSystem.position.x = 470;
        this.gSystem.position.x = 550;
        this.hSystem.position.x = 620;
        //
        //
        //
        this.aOrbit.add(this.systemCenterAxis, this.aSystem);
        this.bOrbit.add(this.systemCenterAxis, this.bSystem);
        this.cOrbit.add(this.systemCenterAxis, this.cSystem);
        this.dOrbit.add(this.systemCenterAxis, this.dSystem);
        this.eOrbit.add(this.systemCenterAxis, this.eSystem);
        this.fOrbit.add(this.systemCenterAxis, this.fSystem);
        this.gOrbit.add(this.systemCenterAxis, this.gSystem);
        this.hOrbit.add(this.systemCenterAxis, this.hSystem);
        //
        //
        //
        this.solarsystem.add(this.sunMesh, this.aOrbit, this.bOrbit, this.cOrbit, this.dOrbit, this.eOrbit, this.fOrbit, this.gOrbit, this.hOrbit);
        this.scene.add(this.solarsystem);
    }

    setupControl() {
        new OrbitControls(this.camera, this.container);
    }

    resize() {
        this.stageWidth = this.container!.clientWidth;
        this.stageHeight = this.container!.clientHeight;

        this.camera.aspect = this.stageWidth / this.stageHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.stageWidth, this.stageHeight);
        this.composer.setSize(this.stageWidth, this.stageHeight);
    }

    render(T: DOMHighResTimeStamp) {
        this.composer.render();
        this.update(T);
        requestAnimationFrame(this.render.bind(this));
    }

    update(T: DOMHighResTimeStamp) {
        T *= 0.001;
        this.aOrbit.rotation.y = T * 0.25;
        this.bOrbit.rotation.y = T * 0.6;
        this.cOrbit.rotation.y = T;
        this.dOrbit.rotation.y = T * 1.8;
        this.eOrbit.rotation.y = T * 0.08;
        this.fOrbit.rotation.y = T * 0.03;
        this.gOrbit.rotation.y = T * 0.01;
        this.hOrbit.rotation.y = T * 0.005;

        this.aSystem.rotation.y = T;
        this.bSystem.rotation.y = T;
        this.cSystem.rotation.y = T * 2;
        this.dSystem.rotation.y = T;
        this.eSystem.rotation.y = T;
        this.fSystem.rotation.y = T;
        this.gSystem.rotation.y = T;
        this.hSystem.rotation.y = T;
    }
}
