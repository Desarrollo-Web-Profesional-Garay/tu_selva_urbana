import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import Model from './Model';
import { Suspense } from 'react';

/**
 * HeroScene houses the React Three Fiber Canvas.
 * It provides realistic lighting (Environment) and soft shadows (ContactShadows).
 * The inner model is wrapped in <Float> for idle levitation 
 * and passed the ref so GSAP can control its scrolling position.
 */
export default function HeroScene({ setModelNode }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                pointerEvents: 'none', // Let HTML buttons be clickable
                zIndex: 0
            }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

            {/* Studio Lighting Environment */}
            <Environment preset="city" />

            {/* GSAP will animate this outermost stable empty group. 
                It has NO React props like position/scale so React never overwrites GSAP */}
            <group ref={setModelNode}>

                {/* Inner group handles the static declarative layout setup */}
                <group position={[0, -1, 0]} scale={1.2} rotation={[0, -Math.PI / 4, 0]}>
                    <Suspense fallback={null}>
                        <Float
                            speed={1.5}
                            rotationIntensity={0.5}
                            floatIntensity={0.5}
                        >
                            {/* The model naturally lives inside at center coordinates */}
                            <Model />
                        </Float>

                        {/* Soft shadow directly underneath the plant */}
                        <ContactShadows
                            position={[0, -0.8, 0]}
                            opacity={0.6}
                            scale={10}
                            blur={2.5}
                            far={4}
                        />
                    </Suspense>
                </group>

            </group>
        </Canvas>
    );
}
