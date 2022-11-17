import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { DoubleSide } from 'three';

import { ImagePanel } from './ImagePanel';
import gsap from 'gsap';
import { MouseEvent, useRef, useEffect, useMemo, useCallback } from 'react';

const ImgSphere = ({ user }: any) => {
  // Renderer
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const randomPositionArray: number[] = [];
  const imagePanels: ImagePanel[] = [];
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 7, 7), []);
  const canvasSize = useRef<number[]>();

  sphereGeometry.scale(0.2, 0.2, 0.2);
  const sphereRef = useRef<any>();

  //   let canvas = canvasRef.current;

  // Points

  const scene = useMemo(() => new THREE.Scene(), []);

  const gltfLoader = new GLTFLoader();
  const fontLoader = new FontLoader();

  const getImageMesh = (image: string) => {
    const width = 0.4;
    const height = 0.4;
    const planegeo = new THREE.PlaneGeometry(width, height);
    const planemat = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(`/uploads/${image}`)
      // side: DoubleSide,
      // color: "red",
    });
    return new THREE.Mesh(planegeo, planemat);
  };
  const newMaterial = (color: string, opacity = 1) =>
    new THREE.MeshStandardMaterial({ color, opacity });
  const outerScale: [number, number, number] = [0.05, 0.05, 0.05];
  // "first"|"second"|"third"|"four"|"five"
  type bookInformationType = {
    [key: string]: {
      outerPosition: [number, number, number];
      outerRotation: [number] | [number, number] | [number, number, number];
      imgPosition: [number, number, number];
      imgRotation: [number] | [number, number] | [number, number, number];
      textPosition: [number, number, number];
      color: string;
      imgName: string;
    };
  };
  const bookInformation: bookInformationType = {
    first: {
      outerPosition: [-0.4, 1.4, 1.7],
      outerRotation: [1.93],
      imgPosition: [1.08, 1.45, 1.75],
      imgRotation: [-1.21],
      textPosition: [0.9, 1.53, 1.53],
      color: 'brown',
      imgName: '사인.jpg'
    },
    second: {
      outerPosition: [-0.07, 1.9, 1.5],
      outerRotation: [1.93, -0.25, 0.4],
      imgPosition: [1.26, 1.432, 1.98],
      imgRotation: [-1.21, 0.25, -0.4],
      textPosition: [1.18, 1.554, 1.7],
      color: '#ffc9c9',
      imgName: '진라거.jpg'
    },
    third: {
      outerPosition: [-1, 0.93, 3],
      outerRotation: [1.93, 0, -1],
      imgPosition: [-0.17, 1.42, 1.87],
      imgRotation: [-1.21, 0, 1],
      textPosition: [-0.47, 1.41, 1.9],
      color: '#748ffc',
      imgName: 'K-002.jpg'
    },
    four: {
      outerPosition: [-1.01, 1.44, 1.5],
      outerRotation: [1.9, 0.02, 0.4],
      imgPosition: [0.34, 1.33, 2.1],
      imgRotation: [-1.24, -0.02, -0.4],
      textPosition: [0.25, 1.425, 1.82],
      color: '#22b8cf',
      imgName: 'K-007.jpg'
    },
    five: {
      outerPosition: [-2.1, 1.41, 1.8],
      outerRotation: [2.12, 0.06, 0.23],
      imgPosition: [-0.68, 1.34, 2.2],
      imgRotation: [-1.02, -0.06, -0.23],
      textPosition: [-0.8, 1.482, 1.95],
      color: '#495057',
      imgName: 'K-009.jpg'
    }
  };
  type OrderType = 'first' | 'second' | 'third' | 'four' | 'five';
  type MaterialWithColor = THREE.Material & {
    color: {
      set: (color: string) => void;
    };
  };
  const setBook = useCallback((gltf: GLTF, order: OrderType) => {
    const bookOuter = gltf.scene.children[0] as THREE.Mesh;
    const bookInner = gltf.scene.children[1] as THREE.Mesh;
    bookOuter.position.set(...bookInformation[order].outerPosition);
    bookInformation[order].outerRotation.forEach((v, i) => {
      i === 0
        ? (bookOuter.rotation.x = v)
        : i === 1
        ? (bookOuter.rotation.y = v)
        : (bookOuter.rotation.z = v);
    });
    bookOuter.scale.set(...outerScale);
    (bookOuter.material as MaterialWithColor).color.set(
      bookInformation[order].color
    );
    bookInner.material = newMaterial('#f8f9fa');
    bookInner.position.copy(bookOuter.position);
    bookInner.scale.copy(bookOuter.scale);
    bookInner.rotation.copy(bookOuter.rotation);

    const imgMesh = getImageMesh(bookInformation[order].imgName);
    imgMesh.position.set(...bookInformation[order].imgPosition);
    bookInformation[order].imgRotation.forEach((v, i) => {
      i === 0
        ? (imgMesh.rotation.x = v)
        : i === 1
        ? (imgMesh.rotation.y = v)
        : (imgMesh.rotation.z = v);
    });
    scene.add(imgMesh);

    fontLoader.load('/jsons/Do_Hyeon_Regular.json', (font) => {
      // 글자 최대 수 13
      const textgeo = new TextGeometry('img test 11e3', {
        font,
        size: 0.05,
        height: 0
        // curveSegments: 5,
      });
      const textmat = new THREE.MeshStandardMaterial({
        color: 'black'
      });
      const textmesh = new THREE.Mesh(textgeo, textmat);
      textmesh.position.set(...bookInformation[order].textPosition);
      bookInformation[order].imgRotation.forEach((v, i) => {
        i === 0
          ? (textmesh.rotation.x = v)
          : i === 1
          ? (textmesh.rotation.y = v)
          : (textmesh.rotation.z = v);
      });
      scene.add(textmesh);
    });

    scene.add(bookOuter);
    scene.add(bookInner);
  }, []);

  scene.background = new THREE.Color('gray');

  // scene.background = new THREE.Color('white');
  sphereRef.current = Array.from(sphereGeometry.attributes.position.array);

  const getSphereArr = (sphereRef: number[]) => {
    const arr: number[] = [];
    sphereRef.forEach((v: number, i: number) => {
      arr.push(v);
      if (i >= 5 && i % 3 === 2) {
        const index = arr.length - 1;

        if (
          arr[index] === arr[index - 3] &&
          arr[index - 1] === arr[index - 4] &&
          arr[index - 2] === arr[index - 5]
        ) {
          arr.pop();
          arr.pop();
          arr.pop();
        }
      }
    });
    arr.splice(24, 3);
    arr.splice(45, 3);
    arr.splice(66, 3);
    arr.splice(87, 3);
    arr.splice(108, 3);
    arr.splice(129, 3);
    arr.splice(132);
    return arr;
  };
  const spherePositionArray: number[] = getSphereArr(sphereRef.current);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvasSize.current = [
        canvasRef.current?.clientWidth,
        canvasRef.current?.clientHeight
      ];
      const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);

      const textureLoader = new THREE.TextureLoader();

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
      });
      //   renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(canvasSize.current[0], canvasSize.current[1]);
      renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.y = 1.4;
      camera.position.z = 4;
      scene.add(camera);

      // const testMesh = new THREE.Mesh(
      //   sphereGeometry,
      //   new THREE.MeshBasicMaterial({ color: 'black' })
      // );
      // testMesh.position.set(0, 1, 2);
      // scene.add(testMesh);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const draw = () => {
        // const clock = new THREE.Clock();
        // const delta = clock.getDelta();

        controls.update();

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
      };

      const setSize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setSize(canvasSize.current[0], canvasSize.current[1]);

        renderer.render(scene, camera);
      };
      //   window.addEventListener('resize', setSize);
      draw();

      // Scene

      // Light
      const ambientLight = new THREE.AmbientLight('white', 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight('white', 5);

      // directionalLight.position.x = 1;
      // directionalLight.position.z = 4;
      // directionalLight.position.x = -1.5;
      // directionalLight.position.y = -4.5;
      // directionalLight.position.z = 10.4;
      directionalLight.position.x = -1.5;
      directionalLight.position.y = -2.6;
      directionalLight.position.z = 5;
      // const lighyHelper = new THREE.DirectionalLightHelper(directionalLight);
      // scene.add(lighyHelper);
      // const gui = new dat.GUI();
      // if (window) {
      //   gui.add(lighyHelper.position, 'x', -5, 5);
      //   gui.add(lighyHelper.position, 'y', -5, 5);
      //   gui.add(lighyHelper.position, 'z', -5, 5);
      // }

      scene.add(directionalLight);

      //   -24/8 해서 -3이 돼야함.
      // spherePositionArray.current.splice(-18);

      gltfLoader.load('/models/bdesk.glb', (gltf) => {
        const bdesk = gltf.scene.children[0];

        bdesk.scale.set(2, 2.5, 2);
        bdesk.position.set(0, 1.1, 2.4);
        bdesk.rotateX((Math.PI * 20) / 180);

        scene.add(bdesk);
      });
      gltfLoader.load('/models/book.glb', (gltf) => {
        setBook(gltf, 'first');
      });
      gltfLoader.load('/models/book.glb', (gltf) => {
        setBook(gltf, 'second');
      });
      gltfLoader.load('/models/book.glb', (gltf) => {
        setBook(gltf, 'third');
      });
      gltfLoader.load('/models/book.glb', (gltf) => {
        setBook(gltf, 'four');
      });
      gltfLoader.load('/models/book.glb', (gltf) => {
        setBook(gltf, 'five');
      });
      /**명패 */
      gltfLoader.load('/models/nameplate.glb', (gltf) => {
        const nameplate = gltf.scene.children[0];
        nameplate.scale.set(0.5, 0.5, 1);
        nameplate.position.set(0.42, 1.228, 2.8);
        nameplate.rotation.y = (Math.PI * 90) / 180;
        nameplate.rotation.z = (Math.PI * 20) / 180;

        fontLoader.load('/jsons/Do_Hyeon_Regular.json', (font) => {
          // 글자 최대 수 13
          // 영어 대문자 8개(0.125),소문자 10개(0.1),숫자 8개(0.125),한글 6개(0.16)
          const textgeo = new TextGeometry('비서실장   김인자', {
            font,
            size: 0.1,
            height: 0
            // curveSegments: 5,
          });
          // textgeo.center();
          const textmat = new THREE.MeshStandardMaterial({
            color: 'black'
          });
          const textmesh = new THREE.Mesh(textgeo, textmat);
          textmesh.position.set(-0.55, 1.05, 2.8);
          textmesh.rotation.x = 0.3;
          scene.add(textmesh);
        });

        scene.add(nameplate);
      });
      /**액자 */
      gltfLoader.load('/models/frame.glb', (gltf) => {
        const frame = gltf.scene.children[0];
        frame.scale.set(3, 3, 2);
        frame.position.set(-1.5, 1.83, 2);
        frame.rotation.x = -0.2;
        frame.rotation.y = 1;
        frame.rotation.z = 0.47;

        const planegeo = new THREE.PlaneGeometry(0.5, 0.5);
        const planemat = new THREE.MeshStandardMaterial({
          map: new THREE.TextureLoader().load('/uploads/mother.png'),
          side: DoubleSide
          // color: "red",
        });
        const planemesh = new THREE.Mesh(planegeo, planemat);
        planemesh.position.set(-1.423, 1.56, 1.95);
        planemesh.scale.set(0.6, 0.9, 1);
        planemesh.rotation.x = -0.2;
        planemesh.rotation.y = 1;
        planemesh.rotation.z = 0.48;

        scene.add(planemesh);

        scene.add(frame);
      });
      /**구 받침대 */
      const propSphereGeo = new THREE.BoxGeometry(0.3, 0.01, 0.3);
      const propSphereMesh = new THREE.Mesh(
        propSphereGeo,
        newMaterial('#fff5f5')
      );
      propSphereMesh.position.set(1.2, 1.05, 2.6);
      propSphereMesh.rotateX((Math.PI * 20) / 180);
      scene.add(propSphereMesh);
      for (let i = 0; i < spherePositionArray.length; i++) {
        randomPositionArray.push((Math.random() - 0.5) * 2);
      }

      // 여러개의 Plane Mesh 생성
      for (let i = 0; i < spherePositionArray.length; i += 3) {
        if (i < user.length) {
        }
        const imagePanel = new ImagePanel({
          textureLoader,
          scene,
          geometry: planeGeometry,
          imageSrc:
            // i < 213 ? `/uploads/0${Math.ceil(Math.random() * 5)}.jpg` : null,
            i / 3 < user.length ? `/uploads/${user[i / 3].image}` : null,
          x: spherePositionArray[i],
          y: spherePositionArray[i + 1],
          z: spherePositionArray[i + 2]
        });

        imagePanels.push(imagePanel);
      }
    }
  }, [scene, user]);

  const setShape = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    const type = target.dataset.type;
    let array: number[] = [];
    switch (type) {
      case 'random': {
        array = randomPositionArray;
        // if (canvasRef.current instanceof Element) {
        //   canvasRef.current.style.transform = 'translate(-50%, -50%) scale(2)';
        // }

        break;
      }

      case 'sphere': {
        array = spherePositionArray;
        // if (canvasRef.current instanceof Element) {
        //   canvasRef.current.style.transform = 'translate(0,0) scale(1)';
        // }
        break;
      }
    }

    for (let i = 0; i < imagePanels.length; i++) {
      // 위치 이동
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: type === 'random' ? array[i * 3] : array[i * 3] + 1.2,
        y: array[i * 3 + 1] + 1.3,
        z: array[i * 3 + 2] + 2.6
      });

      // 회전
      if (type === 'random') {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0
        });
        imagePanels[i].mesh.scale.set(0.8, 0.8, 0.8);
      } else if (type === 'sphere') {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ
        });
        imagePanels[i].mesh.scale.set(0.2, 0.2, 0.2);
      }
    }
  };

  return (
    <div className="imgsspherewrap">
      <div className="btnwrap" onClick={setShape}>
        <button className="random" data-type="random">
          random
        </button>
        <button className="sphere" data-type="sphere">
          sphere
        </button>
      </div>

      <canvas id="three-canvas" ref={canvasRef}></canvas>
      <style jsx>{`
        .imgsspherewrap {
          position: relative;
          width: 100%;
          height: 100%;
          .btnwrap {
            position: absolute;
            margin-top: 10px;
            margin-left: 10px;
          }
          button {
            position: absolute;
            z-index: 3;
          }
          button.sphere {
            z-index: 3;
            top: 30px;
          }
          canvas {
            width: 100%;
            height: 100%;
            transition-duration: 2s;
          }
        }
      `}</style>
    </div>
  );
};

export default ImgSphere;
