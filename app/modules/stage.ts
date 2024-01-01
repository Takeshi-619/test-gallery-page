import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  GridHelper,
  AxesHelper,
  MathUtils,
} from "three";
import Stats from "stats.js";

export default class Stage {
  renderParam: {
    clearColor: number;
    width: number;
    height: number;
  };
  cameraParam: {
    fov: number;
    near: number;
    far: number;
    lookAt: Vector3;
    x: number;
    y: number;
    z: number;
  };
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  isInitialized: boolean;
  orbitcontrols: OrbitControls | null;
  stats: Stats | null;
  isDev: boolean;

  constructor() {
    this.renderParam = {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.cameraParam = {
      fov: 45,
      near: 0.1,
      far: 100,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 1.0,
    };

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new WebGLRenderer();
    this.isInitialized = false;
    this.orbitcontrols = null;
    this.stats = null;
    this.isDev = false;
  }

  init() {
    this._setScene();
    this._setRender();
    this._setCamera();
    this._setDev();
  }

  _setScene() {
    this.scene = new Scene();
  }

  _setRender() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    const wrapper = document.querySelector("#webgl")!;
    wrapper.appendChild(this.renderer.domElement);
  }

  _setCamera() {
    if (!this.isInitialized) {
      this.camera = new PerspectiveCamera(
        0,
        0,
        this.cameraParam.near,
        this.cameraParam.far
      );

      this.camera.position.set(
        this.cameraParam.x,
        this.cameraParam.y,
        this.cameraParam.z
      );
      this.camera.lookAt(this.cameraParam.lookAt);

      this.isInitialized = true;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.camera.aspect = windowWidth / windowHeight;
    this.camera.fov =
      MathUtils.radToDeg(
        Math.atan(
          windowWidth / this.camera.aspect / (2 * this.camera.position.z)
        )
      ) * 2;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(windowWidth, windowHeight);
  }

  _setDev() {
    this.scene.add(new GridHelper(1000, 100));
    this.scene.add(new AxesHelper(100));
    this.stats = new Stats();
    this.orbitcontrols = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitcontrols.enableDamping = true;
    document.body.appendChild(this.stats.dom);
    this.stats.dom.style.left = "0px";
    this.stats.dom.style.right = "0px";
    document.getElementById("stats")!.appendChild(this.stats.dom);
    this.isDev = true;
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
    if (this.isDev) this.stats?.update();
    if (this.isDev) this.orbitcontrols?.update();
  }

  onResize() {
    this._setCamera();
  }

  onRaf() {
    this._render();
  }
}
