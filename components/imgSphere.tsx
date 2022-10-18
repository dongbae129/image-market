import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ImagePanel } from './ImagePanel';
import gsap from 'gsap';
import { MouseEvent, useRef, useEffect, useMemo } from 'react';

const ImgSphere = ({ user }: any) => {
  // Renderer
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const randomPositionArray: number[] = [];
  const imagePanels: ImagePanel[] = [];
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 7, 7), []);
  const canvasSize = useRef<number[]>();
  console.log(canvasSize);

  const sphereRef = useRef<any>();

  //   let canvas = canvasRef.current;

  // Points

  const scene = useMemo(() => new THREE.Scene(), []);

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

  console.log(spherePositionArray);
  //   spherePositionArray = Array.from(sphereGeometry.attributes.position.array);
  useEffect(() => {
    console.log(user, 'user');
    const canvas = canvasRef.current;

    if (canvas) {
      canvasSize.current = [
        canvasRef.current?.clientWidth,
        canvasRef.current?.clientHeight
      ];
      const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);

      const textureLoader = new THREE.TextureLoader();
      //   sphereGeometry = new THREE.SphereGeometry(1, 8, 8);

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
      camera.position.y = 1;
      camera.position.z = 2;
      scene.add(camera);

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

      const directionalLight = new THREE.DirectionalLight('white', 1);
      directionalLight.position.x = 1;
      directionalLight.position.z = 4;
      scene.add(directionalLight);

      //   -24/8 해서 -3이 돼야함.
      // spherePositionArray.current.splice(-18);

      for (let i = 0; i < spherePositionArray.length; i++) {
        randomPositionArray.push((Math.random() - 0.5) * 2);
      }

      // 여러개의 Plane Mesh 생성

      for (let i = 0; i < spherePositionArray.length; i += 3) {
        if (i < user.length) {
          console.log(user[i].image, 'image');
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
      console.log(imagePanels, 'II');

      // 그리기

      // 버튼

      // 이벤트
    }
  }, []);

  const setShape = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    const type = target.dataset.type;
    let array: number[] = [];
    switch (type) {
      case 'random': {
        array = randomPositionArray;
        if (canvasRef.current instanceof Element) {
          canvasRef.current.style.transform = 'translate(-50%, -50%) scale(2)';
        }

        break;
      }

      case 'sphere': {
        array = spherePositionArray;
        if (canvasRef.current instanceof Element) {
          canvasRef.current.style.transform = 'translate(0,0) scale(1)';
        }
        break;
      }
    }

    for (let i = 0; i < imagePanels.length; i++) {
      // 위치 이동
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: array[i * 3],
        y: array[i * 3 + 1],
        z: array[i * 3 + 2]
      });

      // 회전
      if (type === 'random') {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0
        });
      } else if (type === 'sphere') {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ
        });
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
          width: 100%;
          height: 100%;
          button {
            position: absolute;
            z-index: 3;
            left: 20px;
            top: 20px;
          }
          button.sphere {
            z-index: 3;
            top: 50px;
          }
          canvas {
            width: 100%;
            height: 100%;
            transition-duration: 2s;
          }

          canvas:hover {
            border: 1px solid red;
          }
        }
      `}</style>
    </div>
  );
};

export default ImgSphere;
