import { useTexture } from '@react-three/drei';
import { forwardRef } from 'react';
import * as THREE from 'three';

const Model = forwardRef((props, ref) => {
    // Carga la orquídea en alta resolución que el usuario descargó a public/orquidea.png
    const texture = useTexture('/orquidea.png');

    // Asegurar que la textura se vea nítida y con corrección de color (sRGB)
    texture.colorSpace = THREE.SRGBColorSpace;

    return (
        <group ref={ref} {...props} dispose={null}>
            {/* 
        Plano 2.5D Billboard.
        Mantenemos una proporción ancha (16:9 aprox) para acomodar la composición 
        de la orquídea con las hojas de monstera detrás.
      */}
            <mesh castShadow receiveShadow>
                <planeGeometry args={[5, 3.2]} />
                <meshStandardMaterial
                    map={texture}
                    side={THREE.DoubleSide}
                    transparent={true}
                    roughness={0.4}
                />
            </mesh>
        </group>
    );
});

useTexture.preload('/orquidea.png');

export default Model;
