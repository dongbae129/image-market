import { Body, Box, Vec3 } from 'cannon-es';
import { Mesh, MeshStandardMaterial } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';

export class TextG {
  [x: string]: any;
  constructor(info: any) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;

    this.geometry = info.geometry;
    this.material = info.material;
    this.fontLoader = info.fontLoader;

    this.width = info.width || 3;
    this.height = info.height || 1;
    this.depth = info.depth || 0.05;

    this.x = info.x || 0;
    this.y = info.y || 0.5;
    this.z = info.z || 0;

    this.vecx = info.vecx || 0.2;
    this.vecy = info.vecy || 0.2;
    this.vecz = info.vecz || 0.2;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const textGeoLocal = this;
    info.fontLoader.load('/jsons/Do_Hyeon_Regular.json', function (font: Font) {
      textGeoLocal.geometry = new TextGeometry(info.text, {
        font,
        size: 0.3,
        height: 0.1,
        curveSegments: 12
      });
      textGeoLocal.geometry.center();

      textGeoLocal.material = new MeshStandardMaterial({
        color: info.standcolor
          ? 'black'
          : info.run
          ? 'darkgray'
          : info.x === 0
          ? 0xd4af37
          : info.x === 1
          ? 0xa8a9ad
          : 0xb08d57
        // wireframe: true,
      });

      textGeoLocal.mesh = new Mesh(
        textGeoLocal.geometry,
        textGeoLocal.material
      );
      // textGeoLocal.mesh.position.set(textGeoLocal.x, 1, 0.5);
      textGeoLocal.mesh.position.set(
        textGeoLocal.x,
        textGeoLocal.y,
        -textGeoLocal.z
      );
      textGeoLocal.scene.add(textGeoLocal.mesh);
      info.run ? textGeoLocal.setCannonBody() : null;
    });
  }
  setCannonBody() {
    const shape = new Box(
      new Vec3(this.vecx, this.vecy, this.vecz)
      // new Vec3(this.width / 2, 0.2, this.depth / 2)
    );

    this.cannonBody = new Body({
      mass: 1,
      // position: new Vec3(this.x, 2, 0.5),
      position: new Vec3(this.x, this.y + 0.3, this.z),
      shape
    });

    this.cannonWorld.addBody(this.cannonBody);
  }
}
