import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class SceneInit {
  constructor(id) {
    this._scene = new Scene();
    this._camera = new PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this._renderer = new WebGLRenderer();
    // this._renderer.domElement.id = id;
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);
    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    this._camera.position.x = 100;
    // const axesHelper = new AxesHelper(50);
    // axesHelper.setColors("red", "green", "blue");
    // this._scene.add(axesHelper);

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this._controls.update();
  }

  add(object) {
    this._scene.add(object);
  }

  onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
  render() {
    this._renderer.render(this._scene, this._camera);
  }
}
