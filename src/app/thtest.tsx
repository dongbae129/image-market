import type { NextPage } from 'next';
import { Canvas } from '@react-three/fiber';

const Thtest: NextPage = () => {
  return (
    <div>
      <Canvas>
        <pointLight position={[10, 10, 10]} />
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Thtest;
