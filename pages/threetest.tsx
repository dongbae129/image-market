import type { NextPage } from 'next';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';
import { PreventDragClick } from '@libs/client/PreventDragClick';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useRef, useEffect } from 'react';
import { TextG } from '@components/TextG';
import { Canvas, useFrame } from '@react-three/fiber';
import axios from 'axios';
import { useQuery } from 'react-query';
const Threetest: NextPage = () => {
  const getProducts = () => axios.get('/api/product').then((res) => res.data);
  const { data, isLoading, error } = useQuery(['getProducts'], getProducts);

  // console.log(canvasRef.current, 'C');
  //   const canvas = useRef<HTMLCanvasElement>(null).current;
  //   const canvas = window?.document && document.querySelector('#three-canvas');
  const test = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // const canvas2 = window?.document && document.querySelector('#three-canvas');
    const canvas = test.current;
    console.log(canvas, '11');
    // console.log(canvas2, '22');

    if (canvas) {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
      });
      renderer?.setSize(window.innerWidth, window.innerHeight);
      renderer?.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
      if (renderer) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      //   renderer?.shadowMap?.enabled = true;
      //   renderer?.shadowMap?.type = THREE.PCFSoftShadowMap;

      // Scene
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.y = 1.5;
      camera.position.z = 4;
      scene.add(camera);

      // Light
      const ambientLight = new THREE.AmbientLight('white', 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight('white', 1);
      directionalLight.position.x = 1;
      directionalLight.position.z = 2;
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);

      // Cannon(물리 엔진)
      const cannonWorld = new CANNON.World();
      cannonWorld.gravity.set(0, -6, 0);

      // 성능을 위한 세팅
      cannonWorld.allowSleep = true;
      cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

      // Contact Material
      const defaultMaterial = new CANNON.Material('default');
      const defaultContactMaterial = new CANNON.ContactMaterial(
        defaultMaterial,
        defaultMaterial,
        {
          friction: 0.5,
          restitution: 0.3
        }
      );
      cannonWorld.defaultContactMaterial = defaultContactMaterial;

      const floorShape = new CANNON.Plane();
      const floorBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: floorShape,
        material: defaultMaterial
      });
      floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI / 2
      );
      cannonWorld.addBody(floorBody);

      // Mesh
      const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: 'slategray'
        })
      );
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);
      const testCBox = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

      const getCBody = (x: number) => {
        const body = new CANNON.Body({
          mass: 0,
          position: new CANNON.Vec3(x, 0.5, 0),
          shape: testCBox
        });
        return body;
      };
      const cBody: CANNON.Body[] = [];

      const zeroOneMinusone = [0, 1, -1];
      zeroOneMinusone.forEach((v) => cBody.push(getCBody(v)));
      cBody.forEach((v) => cannonWorld.addBody(v));

      const getBoxGeo = (x: number, y: number, z: number) =>
        new THREE.BoxGeometry(x, y, z);
      const getBoxMaterial = (color: number) =>
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(color)
        });
      const vstandMesh: THREE.Mesh[] = [];

      [1, 0.5, 0.5].forEach((v, i) => {
        const color = i === 0 ? 0xd4af37 : i === 1 ? 0xa8a9ad : 0xb08d57;
        vstandMesh.push(
          new THREE.Mesh(getBoxGeo(1, v, 1), getBoxMaterial(color))
        );
      });

      const testArr = ['ㄱㄱ', 'ㄴㄴ', 'ㄷㄷ'];

      zeroOneMinusone.forEach((v, i) => {
        if (i === 0) {
          vstandMesh[i].position.y = 0.5;
          scene.add(vstandMesh[i]);
          return;
        }
        vstandMesh[i].position.y = 0.25;
        vstandMesh[i].position.x = v;
        scene.add(vstandMesh[i]);
      });

      const spheres: TextG[] = [];

      const fontLoader = new FontLoader();

      let count = 0;
      const getRnadomX = () => {
        // -2.5 ~ 2.5
        const x = (Math.random() - 0.5) * 5;
        let z;
        if (x >= -1.5 && x <= 1.5) {
          z = Math.random() + 1.5;
          if (count === 0) {
            count++;
          } else {
            count--;
            z *= -1;
          }
          return [x, z];
        }
        z = (Math.random() - 0.5) * 3;
        return [x, z];
      };
      testArr.forEach((v, i) => {
        const indexX = i === 0 ? 0 : i === 1 ? 1 : -1;
        const indexY = i === 0 ? 1.2 : 0.7;
        const stand = new TextG({
          text: `#${v}`,
          fontLoader,
          scene,
          cannonWorld,
          x: indexX,
          y: indexY,
          z: 0
        });
        new TextG({
          text: `${++i}`,
          fontLoader,
          scene,
          cannonWorld,
          x: indexX,
          y: indexY - 0.4,
          z: -0.5,
          standcolor: true
        });
        console.log(stand, 's');
      });
      // 그리기
      const clock = new THREE.Clock();

      function draw() {
        const delta = clock.getDelta();

        let cannonStepTime = 1 / 60;
        cannonWorld.step(cannonStepTime, delta, 3);
        if (delta < 0.01) cannonStepTime = 1 / 120;

        spheres.forEach((item) => {
          item.mesh && item.mesh.position.copy(item.cannonBody.position);
          item.mesh && item.mesh.quaternion.copy(item.cannonBody.quaternion);
        });

        renderer.render(scene, camera);
        renderer.setAnimationLoop(draw);
      }

      function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
      }

      //   function collide() {
      //     // 내용...
      //   }

      // 이벤트
      const arrTest =
        'aa,bb,cc,dd,ee,ff,gg,hh,ii,jj,kk,ll,mm,nn,oo,pp,qq,rr,ss,tt,uu,vv,ww,xx,yy,zz,AA,BB,CC,DD,EE,FF,GG,HH,II,JJ,KK,LL,MM,NN,OO,PP,QQ,RR,SS,TT,UU,VV,WW,XX,YY,ZZ'.split(
          ','
        );
      // 여기!@!
      const preventDragClick = new PreventDragClick(canvas);
      window.addEventListener('resize', setSize);
      //   여기
      const testclick = () => {
        if (preventDragClick.mouseMoved) return;
        data?.products.forEach((v, i) => {
          const [x, z] = getRnadomX();
          const mySphere = new TextG({
            text: `#${v.description}`,
            // text: `#${v}`,
            fontLoader,
            scene,
            cannonWorld,
            x,
            y: Math.random() * i + 2,
            z,
            run: true,
            scale: Math.random() + 0.2
          });
          spheres.push(mySphere);
        });
        console.log(spheres);
      };
      canvas.addEventListener('click', () => {
        if (preventDragClick.mouseMoved) return;
        data?.products.forEach((v, i) => {
          const [x, z] = getRnadomX();
          const mySphere = new TextG({
            text: `#${v.description}`,
            fontLoader,
            scene,
            cannonWorld,
            x,
            y: Math.random() * i + 2,
            z,
            run: true,
            scale: Math.random() + 0.2
          });
          spheres.push(mySphere);
        });
        console.log(spheres);
      });

      //   삭제하기
      const btn = document.createElement('button');
      btn.style.cssText =
        'position: absolute; left: 20px; top: 20px; font-size: 20px';
      btn.innerHTML = '삭제';
      document.body.append(btn);

      btn.addEventListener('click', () => {
        spheres.forEach((item) => {
          cannonWorld.removeBody(item.cannonBody);
          scene.remove(item.mesh);
        });
      });

      draw();
    }
  });
  return (
    <div>
      <canvas id="three-canvas" ref={test}></canvas>
    </div>
  );
};

export default Threetest;
