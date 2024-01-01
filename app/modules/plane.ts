import { PlaneGeometry, RawShaderMaterial, Mesh, TextureLoader } from "three";
import vertexShader from "../shaders/vertexshader.vert";
import fragmentShader from "../shaders/fragmentshader.frag";
import * as THREE from "three";
import Stage from "./stage";

interface Element {
  width: number;
  height: number;
  img: string;
  top: number;
  left: number;
}

export default class Plane extends THREE.Mesh {
  element: Element;
  stage: Stage;
  mesh: Mesh | null;
  meshSize: { x: number; y: number };
  texture: THREE.Texture;
  textureSize: { x: number; y: number };
  windowWidth: number;
  windowHeight: number;
  windowWidthHalf: number;
  windowHeightHalf: number;
  meshWidthHalf: number;
  meshHeightHalf: number;

  constructor(stage: Stage, option: Element) {
    super(new THREE.PlaneGeometry(1.0, 1.0, 32, 32));
    this.element = option;
    this.stage = stage;

    // console.log(this.element);

    this.mesh = null;

    this.meshSize = {
      x: this.element.width,
      y: this.element.height,
    };

    this.texture = new THREE.TextureLoader().load(this.element.img);

    this.textureSize = {
      x: 760,
      y: 560,
    };

    this.windowWidth = 0;
    this.windowHeight = 0;

    this.windowWidthHalf = 0;
    this.windowHeightHalf = 0;

    this.meshWidthHalf = 0;
    this.meshHeightHalf = 0;
  }

  init() {
    this._setWindowSize();
    this._setMesh();
    this._setMeshScale();
    this._setMeshPosition();

    // レンダラーの更新処理を追加
    this.stage.renderer.render = () => {
      this._render();
    };
  }

  // 3.1. three.jsの初期化と更新処理の修正

  _setWindowSize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.windowWidthHalf = this.windowWidth * 0.5;
    this.windowHeightHalf = this.windowHeight * 0.5;
  }

  _setMeshScale() {
    this.mesh!.scale.x = this.element.width;
    this.mesh!.scale.y = this.element.height;

    if (this.mesh!.material instanceof RawShaderMaterial) {
      this.mesh!.material.uniforms.u_meshsize.value.x = this.mesh!.scale.x;
      this.mesh!.material.uniforms.u_meshsize.value.y = this.mesh!.scale.y;
    }

    this.meshWidthHalf = this.mesh!.scale.x * 0.5;
    this.meshHeightHalf = this.mesh!.scale.y * 0.5;
  }

  _setMeshPosition() {
    this.mesh!.position.y =
      this.windowHeightHalf - this.meshHeightHalf - this.element.top;
    this.mesh!.position.x =
      -this.windowWidthHalf + this.meshWidthHalf + this.element.left;
  }

  _setStrength(strength: number) {
    if (this.mesh!.material instanceof RawShaderMaterial) {
      this.mesh!.material.uniforms.u_strength.value = strength;
    }
  }

  // 3.2. レンダラーの更新処理を追加

  _render() {
    if (this.mesh) {
      this._setMeshScale();
      this._setMeshPosition();
    }
  }

  // 3.3. シェーダーの修正

  _setMesh() {
    const geometry = new THREE.PlaneGeometry(1.0, 1.0, 32, 32);
    const material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_texture: {
          type: "t",
          value: this.texture,
        } as any,
        u_meshsize: {
          type: "v2",
          value: this.meshSize,
        } as any,
        u_texturesize: {
          type: "v2",
          value: this.textureSize,
        } as any,
        u_strength: {
          type: "f",
          value: 0.0,
        } as any,
      },
      transparent: true,
    });
    this.mesh = new Mesh(geometry, material);
    this.stage.scene.add(this.mesh);
  }

  // 3.4. Stageクラスの修正

  onResize() {
    this._setWindowSize();
  }

  onRaf() {}
}

// interface Element {
//   width: number;
//   height: number;
//   img: string;
//   top: number;
//   left: number;
// }

// export default class Plane {
//   element: Element;
//   stage: any;
//   mesh: any;
//   meshSize: { x: number; y: number };
//   texture: any;
//   textureSize: { x: number; y: number };
//   windowWidth: number;
//   windowHeight: number;
//   windowWidthHalf: number;
//   windowHeightHalf: number;
//   meshWidthHalf: number;
//   meshHeightHalf: number;

//   constructor(stage: any, option: Element) {
//     this.element = option;
//     this.stage = stage;

//     // console.log(this.element);

//     this.mesh = null;

//     this.meshSize = {
//       x: this.element.width,
//       y: this.element.height,
//     };

//     this.texture = new TextureLoader().load(this.element.img);

//     this.textureSize = {
//       x: 760,
//       y: 560,
//     };

//     this.windowWidth = 0;
//     this.windowHeight = 0;

//     this.windowWidthHalf = 0;
//     this.windowHeightHalf = 0;

//     this.meshWidthHalf = 0;
//     this.meshHeightHalf = 0;
//   }

//   init() {
//     this._setWindowSize();
//     this._setMesh();
//     this._setMeshScale();
//     this._setMeshPosition();
//   }

//   _setWindowSize() {
//     this.windowWidth = window.innerWidth;
//     this.windowHeight = window.innerHeight;

//     this.windowWidthHalf = this.windowWidth * 0.5;
//     this.windowHeightHalf = this.windowHeight * 0.5;
//   }

//   _setMeshScale() {
//     this.mesh.scale.x = this.element.width;
//     this.mesh.scale.y = this.element.height;

//     this.mesh.material.uniforms.u_meshsize.value.x = this.mesh.scale.x;
//     this.mesh.material.uniforms.u_meshsize.value.y = this.mesh.scale.y;

//     this.meshWidthHalf = this.mesh.scale.x * 0.5;
//     this.meshHeightHalf = this.mesh.scale.y * 0.5;
//   }

//   _setMeshPosition() {
//     this.mesh.position.y =
//       this.windowHeightHalf - this.meshHeightHalf - this.element.top;
//     this.mesh.position.x =
//       -this.windowWidthHalf + this.meshWidthHalf + this.element.left;
//   }

//   _setStrength(strength: number) {
//     this.mesh.material.uniforms.u_strength.value = strength;
//   }

//   _setMesh() {
//     const geometry = new PlaneGeometry(1.0, 1.0, 32, 32);
//     const material = new RawShaderMaterial({
//       vertexShader: vertexShader,
//       fragmentShader: fragmentShader,
//       uniforms: {
//         u_texture: {
//           type: "t",
//           value: this.texture,
//         } as any,
//         u_meshsize: {
//           type: "v2",
//           value: this.meshSize,
//         } as any,
//         u_texturesize: {
//           type: "v2",
//           value: this.textureSize,
//         } as any,
//         u_strength: {
//           type: "f",
//           value: 0.0,
//         } as any,
//       },
//       transparent: true,
//     });
//     this.mesh = new Mesh(geometry, material);
//     this.stage.scene.add(this.mesh);
//   }

//   onResize() {
//     this._setWindowSize();
//   }

//   _render() {
//     if (this.mesh) {
//       this._setMeshScale();
//       this._setMeshPosition();
//     }
//   }

//   onRaf() {
//     this._render();
//   }
// }
