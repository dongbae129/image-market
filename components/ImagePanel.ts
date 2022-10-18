import { MeshBasicMaterial, DoubleSide, Mesh } from 'three';

interface ImgInfo {
  textureLoader: any;
  scene: any;
  geometry: any;
  imageSrc: string | null;
  x: number;
  y: number;
  z: number;
}
export class ImagePanel {
  [x: string]: any;
  constructor(info: ImgInfo) {
    const texture = info.imageSrc
      ? info.textureLoader.load(info.imageSrc)
      : null;

    let material;
    if (texture) {
      material = new MeshBasicMaterial({
        map: texture,
        side: DoubleSide
      });
    } else {
      material = new MeshBasicMaterial({
        color: '#212529',
        side: DoubleSide,
        // wireframe: true,
        transparent: true,
        opacity: 0.4
      });
    }

    this.mesh = new Mesh(info.geometry, material);
    this.mesh.position.set(info.x, info.y, info.z);
    this.mesh.lookAt(0, 0, 0);

    // Sphere 상태의 회전각을 저장해 둠
    this.sphereRotationX = this.mesh.rotation.x;
    this.sphereRotationY = this.mesh.rotation.y;
    this.sphereRotationZ = this.mesh.rotation.z;

    info.scene.add(this.mesh);
  }
}
