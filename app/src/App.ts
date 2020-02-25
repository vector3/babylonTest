import {
  Engine,
  Scene,
  HemisphericLight,
  Vector3,
  Mesh,
  FreeCamera,
  Color3,
  UtilityLayerRenderer,
  ScaleGizmo,
  GizmoManager
} from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials/grid";
import "@babylonjs/inspector";
import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/core/Debug/";
import "@babylonjs/gui";
// import "@babylonjs/serializers";
// import "@babylonjs/materials";
// import "@babylonjs/procedural-textures"

export class App {
  //////////////////////////////////////
  // VARS
  //////////////////////////////////////

  private _engine: Engine;
  private _scene: Scene;

  //////////////////////////////////////
  // METHODS
  //////////////////////////////////////

  private InitVars(): void {}

  private StartBabylon(): void {
    const canvas: HTMLCanvasElement = document.getElementById("renderCanvas") as HTMLCanvasElement;

    this._engine = new Engine(canvas);
    this._scene = new Scene(this._engine);

    const camera: FreeCamera = new FreeCamera("camera1", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light: HemisphericLight = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this._scene
    );
    light.intensity = 0.7;

    const material: GridMaterial = new GridMaterial("grid", this._scene);

    const sphere: Mesh = Mesh.CreateSphere("sphere1", 16, 2, this._scene);
    sphere.position.y = 2;
    sphere.material = material;

    const ground: Mesh = Mesh.CreateGround("ground1", 6, 6, 2, this._scene);
    ground.material = material;

    // https://doc.babylonjs.com/how_to/gizmo
    const gizmoManager: GizmoManager = new GizmoManager(this._scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.scaleGizmoEnabled = true;
    gizmoManager.attachableMeshes = [sphere];

    this._scene.debugLayer.show();

    // Render every frame
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }

  //////////////////////////////////////
  // HANDLER
  //////////////////////////////////////

  //////////////////////////////////////
  // CONSTRUCTOR / INIT
  //////////////////////////////////////

  constructor() {
    this.InitVars();
  }

  Start() {
    console.log("startxx");
    this.StartBabylon();
  }
}
