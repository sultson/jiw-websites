import { useMemo, useRef, useState, useEffect, type ComponentRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ServiceKey } from '../data';

const ORANGE = '#f27025';

interface DioramaProps {
  active: ServiceKey | null;
  onSelect: (key: ServiceKey | null) => void;
}

/** Box mesh that tints orange when its service is active. */
function Part({
  serviceKey,
  active,
  onSelect,
  color,
  position,
  args,
  rotation,
}: {
  serviceKey?: ServiceKey;
  active: ServiceKey | null;
  onSelect: (key: ServiceKey | null) => void;
  color: string;
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
}) {
  const isActive = serviceKey != null && active === serviceKey;
  const displayColor = isActive ? ORANGE : color;
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={
        serviceKey
          ? (e) => {
              e.stopPropagation();
              onSelect(isActive ? null : serviceKey);
            }
          : undefined
      }
      onPointerOver={
        serviceKey
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }
          : undefined
      }
      onPointerOut={serviceKey ? () => (document.body.style.cursor = 'auto') : undefined}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={displayColor}
        roughness={0.85}
        emissive={isActive ? ORANGE : '#000000'}
        emissiveIntensity={isActive ? 0.35 : 0}
      />
    </mesh>
  );
}

function Cyl({
  serviceKey,
  active,
  onSelect,
  color,
  position,
  radius,
  height,
  rotation,
}: {
  serviceKey?: ServiceKey;
  active: ServiceKey | null;
  onSelect: (key: ServiceKey | null) => void;
  color: string;
  position: [number, number, number];
  radius: number;
  height: number;
  rotation?: [number, number, number];
}) {
  const isActive = serviceKey != null && active === serviceKey;
  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      onClick={
        serviceKey
          ? (e) => {
              e.stopPropagation();
              onSelect(isActive ? null : serviceKey);
            }
          : undefined
      }
    >
      <cylinderGeometry args={[radius, radius, height, 12]} />
      <meshStandardMaterial
        color={isActive ? ORANGE : color}
        roughness={0.7}
        emissive={isActive ? ORANGE : '#000000'}
        emissiveIntensity={isActive ? 0.35 : 0}
      />
    </mesh>
  );
}

/** Label pin shown above the active service area. */
const LABEL_POINTS: Record<ServiceKey, { pos: [number, number, number]; label: string }> = {
  loodgieterswerk: { pos: [-2.55, 1.7, -0.9], label: 'Loodgieterswerk' },
  tegelwerk: { pos: [-1.5, 1.75, -1.2], label: 'Tegelwerk' },
  kitwerk: { pos: [-1.9, 1.15, 0.4], label: 'Kitwerk' },
  schilderwerk: { pos: [-2.2, 3.35, -1.0], label: 'Schilderwerk' },
  stucwerk: { pos: [0.6, 3.35, -1.0], label: 'Stucwerk' },
  timmerwerk: { pos: [-0.8, 4.55, 0], label: 'Timmerwerk' },
  straatwerk: { pos: [2.9, 0.75, 1.6], label: 'Straatwerk' },
};

function Paving({ active, onSelect }: DioramaProps) {
  const bricks = useMemo(() => {
    const rows: { x: number; z: number; w: number; tone: number }[] = [];
    let i = 0;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        rows.push({
          x: 1.9 + c * 0.42 + (r % 2 ? 0.21 : 0),
          z: 0.35 + r * 0.24,
          w: 0.38,
          tone: i++ % 3,
        });
      }
    }
    return rows;
  }, []);
  const tones = ['#b06a4a', '#a35f42', '#bd7654'];
  return (
    <group>
      {/* sand bed the bricks are being laid into */}
      <mesh position={[2.5, 0.02, 0.95]} receiveShadow>
        <boxGeometry args={[2.6, 0.05, 1.7]} />
        <meshStandardMaterial color="#8d8578" roughness={1} />
      </mesh>
      {bricks.map((b, i) => (
        <Part
          key={i}
          serviceKey="straatwerk"
          active={active}
          onSelect={onSelect}
          color={tones[b.tone]}
          position={[b.x - 0.4, 0.045, b.z]}
          args={[b.w, 0.09, 0.2]}
        />
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#7a5b3e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#75855f" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Van({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.5, 0.55, 0.68]} />
        <meshStandardMaterial color="#f27025" roughness={0.5} />
      </mesh>
      <mesh position={[-0.18, 0.85, 0]} castShadow>
        <boxGeometry args={[1.1, 0.36, 0.64]} />
        <meshStandardMaterial color="#f27025" roughness={0.5} />
      </mesh>
      <mesh position={[0.42, 0.8, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.6]} />
        <meshStandardMaterial color="#262b33" roughness={0.3} />
      </mesh>
      {([[-0.45, 0.34], [0.45, 0.34]] as const).map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x, 0.16, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 14]} />
            <meshStandardMaterial color="#1c1e24" roughness={0.9} />
          </mesh>
          <mesh position={[x, 0.16, -z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 14]} />
            <meshStandardMaterial color="#1c1e24" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Building({ active, onSelect }: DioramaProps) {
  const wall = '#e6e2da';
  const wallDark = '#d6d1c6';
  const floor = '#c9c3b6';
  const wood = '#b9895a';

  return (
    <group position={[-0.8, 0, -0.4]}>
      {/* shell: back, left, right walls + storey floors */}
      <Part active={active} onSelect={onSelect} color={wallDark} position={[0, 1.5, -1.1]} args={[4.6, 3, 0.14]} />
      <Part active={active} onSelect={onSelect} color={wall} position={[-2.3, 1.5, 0]} args={[0.14, 3, 2.2]} />
      <Part active={active} onSelect={onSelect} color={wall} position={[2.3, 1.5, 0]} args={[0.14, 3, 2.2]} />
      <Part active={active} onSelect={onSelect} color={floor} position={[0, 0.05, 0]} args={[4.6, 0.1, 2.2]} />
      <Part active={active} onSelect={onSelect} color={floor} position={[0, 1.5, 0]} args={[4.6, 0.12, 2.2]} />
      <Part active={active} onSelect={onSelect} color={floor} position={[0, 3.0, 0]} args={[4.6, 0.12, 2.2]} />
      {/* interior dividing walls */}
      <Part active={active} onSelect={onSelect} color={wall} position={[0, 0.75, 0]} args={[0.12, 1.5, 2.2]} />
      <Part active={active} onSelect={onSelect} color={wall} position={[-0.6, 2.25, 0]} args={[0.12, 1.5, 2.2]} />

      {/* ground floor left: bathroom (tegelwerk, loodgieterswerk, kitwerk) */}
      <Part serviceKey="tegelwerk" active={active} onSelect={onSelect} color="#9fb6bb" position={[-1.15, 0.55, -1.0]} args={[2.2, 0.9, 0.06]} />
      <Part serviceKey="tegelwerk" active={active} onSelect={onSelect} color="#8ea9af" position={[-1.15, 0.13, -0.35]} args={[2.2, 0.06, 1.5]} />
      {/* bathtub */}
      <Part serviceKey="kitwerk" active={active} onSelect={onSelect} color="#f4f2ee" position={[-1.55, 0.36, -0.55]} args={[1.15, 0.42, 0.6]} />
      <Part serviceKey="kitwerk" active={active} onSelect={onSelect} color="#dfdcd5" position={[-1.55, 0.55, -0.55]} args={[1.0, 0.05, 0.45]} />
      {/* washbasin + copper pipes */}
      <Part serviceKey="loodgieterswerk" active={active} onSelect={onSelect} color="#f4f2ee" position={[-0.35, 0.62, -0.85]} args={[0.5, 0.12, 0.35]} />
      <Cyl serviceKey="loodgieterswerk" active={active} onSelect={onSelect} color="#c07b45" position={[-0.35, 0.35, -0.95]} radius={0.035} height={0.6} />
      <Cyl serviceKey="loodgieterswerk" active={active} onSelect={onSelect} color="#c07b45" position={[-2.05, 0.8, -0.95]} radius={0.04} height={1.4} />
      <Cyl serviceKey="loodgieterswerk" active={active} onSelect={onSelect} color="#c07b45" position={[-1.2, 1.42, -0.95]} radius={0.035} height={1.7} rotation={[0, 0, Math.PI / 2]} />

      {/* ground floor right: hallway with door and warm wood floor */}
      <Part active={active} onSelect={onSelect} color="#8a6a48" position={[1.15, 0.62, -1.02]} args={[0.7, 1.24, 0.08]} />
      <Part active={active} onSelect={onSelect} color="#b98e60" position={[1.15, 0.11, -0.3]} args={[2.2, 0.05, 1.5]} />
      {/* upstairs wood floor */}
      <Part active={active} onSelect={onSelect} color="#c19a6c" position={[0, 1.585, -0.25]} args={[4.5, 0.05, 1.6]} />

      {/* first floor left: schilderwerk, wall half painted */}
      <Part serviceKey="schilderwerk" active={active} onSelect={onSelect} color="#e88a52" position={[-1.75, 2.25, -1.0]} args={[1.0, 1.35, 0.06]} />
      <Part serviceKey="schilderwerk" active={active} onSelect={onSelect} color="#f0ece4" position={[-0.95, 2.25, -1.0]} args={[0.6, 1.35, 0.06]} />
      {/* ladder */}
      <Part serviceKey="schilderwerk" active={active} onSelect={onSelect} color={wood} position={[-1.0, 2.05, -0.6]} args={[0.06, 1.1, 0.06]} rotation={[0.18, 0, 0]} />
      <Part serviceKey="schilderwerk" active={active} onSelect={onSelect} color={wood} position={[-0.75, 2.05, -0.6]} args={[0.06, 1.1, 0.06]} rotation={[0.18, 0, 0]} />
      <Part serviceKey="schilderwerk" active={active} onSelect={onSelect} color={wood} position={[-0.875, 2.0, -0.62]} args={[0.3, 0.05, 0.05]} rotation={[0.18, 0, 0]} />
      {/* paint bucket */}
      <Cyl serviceKey="schilderwerk" active={active} onSelect={onSelect} color="#e9e7e2" position={[-1.5, 1.68, -0.35]} radius={0.11} height={0.16} />

      {/* first floor right: stucwerk wall with fresh patch */}
      <Part serviceKey="stucwerk" active={active} onSelect={onSelect} color="#cfc9bd" position={[0.9, 2.25, -1.0]} args={[2.6, 1.35, 0.06]} />
      <Part serviceKey="stucwerk" active={active} onSelect={onSelect} color="#bdb5a5" position={[0.55, 2.15, -0.96]} args={[1.1, 0.9, 0.04]} />

      {/* roof: gable meeting at a ridge, timber rafters underneath (timmerwerk) */}
      {/* slope: half-depth 1.1, rise 1.1 -> 45 degrees, slope length ~1.62 with overhang */}
      <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color="#454b56" position={[0, 3.55, 0.55]} args={[5.0, 0.09, 1.68]} rotation={[Math.PI / 4, 0, 0]} />
      <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color="#454b56" position={[0, 3.55, -0.55]} args={[5.0, 0.09, 1.68]} rotation={[-Math.PI / 4, 0, 0]} />
      <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color={wood} position={[0, 4.12, 0]} args={[4.8, 0.13, 0.13]} />
      {[-1.9, -0.65, 0.65, 1.9].map((x) => (
        <group key={x}>
          <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color={wood} position={[x, 3.42, -0.49]} args={[0.09, 0.08, 1.42]} rotation={[-Math.PI / 4, 0, 0]} />
          <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color={wood} position={[x, 3.42, 0.49]} args={[0.09, 0.08, 1.42]} rotation={[Math.PI / 4, 0, 0]} />
          <Part serviceKey="timmerwerk" active={active} onSelect={onSelect} color={wood} position={[x, 3.14, 0]} args={[0.09, 0.07, 2.05]} />
        </group>
      ))}
      {/* rear facade: windows + door so the closed side reads as a building */}
      {[[-1.5, 2.25], [-0.2, 2.25], [1.3, 2.25], [-1.5, 0.85], [1.3, 0.85]].map(([wx, wy]) => (
        <group key={`${wx}-${wy}`} position={[wx, wy, -1.21]}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.82, 0.05]} />
            <meshStandardMaterial color="#f4f2ee" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.5, 0.7, 0.05]} />
            <meshStandardMaterial color="#2c3644" roughness={0.4} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.2, 0.67, -1.21]} castShadow>
        <boxGeometry args={[0.66, 1.34, 0.06]} />
        <meshStandardMaterial color="#8a6a48" roughness={0.8} />
      </mesh>
      <Gable x={-2.3} color={wall} />
      <Gable x={2.3} color={wall} />
      {/* chimney */}
      <mesh position={[1.6, 4.05, -0.45]} castShadow>
        <boxGeometry args={[0.32, 0.75, 0.32]} />
        <meshStandardMaterial color="#c9c3b6" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Flat triangular gable closing off the roof ends. */
function Gable({ x, color }: { x: number; color: string }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.1, 0);
    shape.lineTo(1.1, 0);
    shape.lineTo(0, 1.1);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);
  return (
    <mesh geometry={geometry} position={[x, 3.0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <meshStandardMaterial color={color} roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene({ active, onSelect, reducedMotion }: DioramaProps & { reducedMotion: boolean }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);

  useFrame(() => {
    if (controls.current) {
      controls.current.autoRotate = !reducedMotion && active == null;
    }
  });

  const label = active ? LABEL_POINTS[active] : null;

  return (
    <>
      <ambientLight intensity={0.85} />
      {/* warm fill so the cutaway interior stays readable */}
      <pointLight position={[-0.8, 1.4, 1.8]} intensity={14} distance={9} color="#ffe8d2" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.3} />

      <group position={[0, -1.1, 0]}>
        {/* plinth */}
        <mesh position={[0, -0.26, 0]} receiveShadow onClick={() => onSelect(null)}>
          <boxGeometry args={[8.6, 0.5, 5.4]} />
          <meshStandardMaterial color="#292d36" roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.005, 0]} receiveShadow>
          <boxGeometry args={[8.2, 0.02, 5.0]} />
          <meshStandardMaterial color="#3a3f4a" roughness={0.95} />
        </mesh>

        <Building active={active} onSelect={onSelect} />
        <Paving active={active} onSelect={onSelect} />
        <Van position={[2.5, 0, -1.05]} />
        <Tree position={[-3.6, 0, 1.7]} />
        <Tree position={[3.7, 0, 1.9]} />

        <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={12} blur={2.4} far={4} resolution={256} />

        {label && (
          <Html position={label.pos} center zIndexRange={[10, 0]}>
            <div className="pointer-events-none whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
              {label.label}
            </div>
          </Html>
        )}
      </group>

      <OrbitControls
        ref={controls}
        makeDefault
        target={new THREE.Vector3(0, 0.7, 0)}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.85}
        maxPolarAngle={1.35}
        autoRotateSpeed={0.45}
        rotateSpeed={0.6}
      />
    </>
  );
}

export default function Diorama({ active, onSelect }: DioramaProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  // Client-only component, so window is safe here. Pull the camera back on
  // narrow screens so the whole diorama fits the portrait canvas.
  const [narrow] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: narrow ? [9.2, 5.6, 11] : [7.2, 4.6, 8.6], fov: narrow ? 40 : 33 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <Scene active={active} onSelect={onSelect} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
