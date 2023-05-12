import * as Three from "three";

const container: HTMLDivElement = document.querySelector("#webgl-container")!;
const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

let stageWidth = container.clientWidth;
let stageHeight = container.clientHeight;

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, stageWidth / stageHeight, 0.1, 100);
camera.position.z = 2;

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);

const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshPhongMaterial({ color: 0x44a88 });
const cube = new Three.Mesh(geometry, material);

scene.add(light, cube);

const resize = () => {
    stageWidth = container.clientWidth;
    stageHeight = container.clientHeight;
    camera.aspect = stageWidth / stageHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(stageWidth, stageHeight);
};
resize();

const update = (T: DOMHighResTimeStamp) => {
    T *= 0.001;
    cube.rotation.x = T;
    cube.rotation.y = T / 10;
};
const render = (T: DOMHighResTimeStamp) => {
    renderer.render(scene, camera);
    update(T);
    requestAnimationFrame(render);
};

requestAnimationFrame(render);

window.addEventListener("resize", resize);

export * from "./01-structure_function";
