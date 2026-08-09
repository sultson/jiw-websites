import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { zaalWerken, type Werk } from '../content';

/** Distance from the middle of the room to the hanging wall. */
const RADIUS = 6.2;
const EYE = 1.72;
/** World units per metre of canvas, so relative scale between works is honest. */
const SCALE = 1.3;
/** The wall sits just behind the works, so they read as hung rather than floating. */
const SHELL = 6.35;
const FLOOR_Y = 0.35;
/** The pool of light is painted on the wall itself, a hair in front of it. */
const GLOW_R = 6.32;

/**
 * The picture light: a warm pool thrown on the wall around each work.
 *
 * In a dark room this is what says "lit" rather than "left in the dark". It is
 * a textured quad rather than a real spotlight, because ten spotlights would
 * cost ten shadow-free lights on every lit surface and buy nothing a gradient
 * cannot draw.
 */
function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  // The frame covers the middle of this quad, so the pool has to stay strong
  // well out towards the edges or nothing is left to see.
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 236, 205, 1)');
  gradient.addColorStop(0.32, 'rgba(255, 228, 188, 0.72)');
  gradient.addColorStop(0.62, 'rgba(252, 212, 162, 0.28)');
  gradient.addColorStop(1, 'rgba(250, 204, 150, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/**
 * The lamp on the canvas itself.
 *
 * The artwork is unlit, so no light in the scene can reach it: at plain white
 * it renders at exactly the value of the photograph, which in a dark room reads
 * as a picture nobody bothered to light. This multiplies it by a little over
 * one, warm, which is what a gallery lamp does to a canvas. Kept small on
 * purpose: push it further and the highlights clip, and clipping the highlights
 * of a painting is worse than a dim room.
 */
const CANVAS_LIGHT = new THREE.Color(1.16, 1.13, 1.07);

type Placed = Werk & { w: number; h: number; angle: number };

/**
 * Wordless "this is interactive" marker: a still dot with a ring that swells
 * out of it and fades. Only the work turned to the front carries one.
 */
function Hotspot({ shown }: { shown: () => boolean }) {
  const dot = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const phase = useRef(0);

  useFrame((_, delta) => {
    const visible = shown();
    phase.current = (phase.current + delta * 0.5) % 1;
    const e = phase.current;

    if (halo.current) {
      const material = halo.current.material as THREE.MeshBasicMaterial;
      material.opacity += ((visible ? 0.3 : 0) - material.opacity) * Math.min(1, delta * 5);
    }
    if (dot.current) {
      const material = dot.current.material as THREE.MeshBasicMaterial;
      material.opacity += ((visible ? 0.85 : 0) - material.opacity) * Math.min(1, delta * 5);
    }
    if (ring.current) {
      ring.current.scale.setScalar(1 + e * 2.6);
      const material = ring.current.material as THREE.MeshBasicMaterial;
      // Ease the ping out, then hold at nothing while it resets.
      const ping = Math.pow(1 - e, 2) * 0.5;
      material.opacity += ((visible ? ping : 0) - material.opacity) * Math.min(1, delta * 10);
    }
  });

  return (
    <group renderOrder={5}>
      {/* Keeps the marker readable where a work is pale. */}
      <mesh ref={halo}>
        <circleGeometry args={[0.105, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0} depthTest={false} depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <circleGeometry args={[0.032, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthTest={false} depthWrite={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.052, 0.062, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** "180 × 135 cm" -> longest side in metres. */
function longSideMetres(size: string) {
  const nums = size.match(/\d+(?:[.,]\d+)?/g)?.map((n) => Number(n.replace(',', '.'))) ?? [];
  if (!nums.length) return 1.4;
  return Math.max(...nums) / 100;
}

function place(works: Werk[]): Placed[] {
  return works.map((work, i) => {
    // Every source photograph is portrait, so the long side is the height. The
    // ratio comes off the photograph itself, so a work uploaded in the CMS
    // hangs in its true proportion without anyone typing a number.
    const h = longSideMetres(work.afmetingen) * SCALE;
    return { ...work, h, w: h * work.img.ratio, angle: (i / works.length) * Math.PI * 2 };
  });
}

function Piece({
  work,
  dimmed,
  focused,
  glowMap,
  markerShown,
  onSelect,
}: {
  work: Placed;
  dimmed: boolean;
  focused: boolean;
  glowMap: THREE.Texture;
  markerShown: () => boolean;
  onSelect: () => void;
}) {
  const texture = useTexture(work.img.room);
  const art = useRef<THREE.Mesh>(null);
  const echo = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  const frameW = work.w + 0.12;
  const frameH = work.h + 0.12;

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 5);
    const target = dimmed ? 0.4 : 1;
    if (art.current) {
      const material = art.current.material as THREE.MeshBasicMaterial;
      material.opacity += (target - material.opacity) * k;
    }
    if (echo.current) {
      const material = echo.current.material as THREE.MeshBasicMaterial;
      material.opacity += (target * 0.14 - material.opacity) * k;
    }
    if (glow.current) {
      // Up close the wall pool would fill half the screen, so it steps back.
      const material = glow.current.material as THREE.MeshBasicMaterial;
      material.opacity += ((focused ? 0.25 : 1) - material.opacity) * k;
    }
  });

  return (
    <>
      {/* Picture light on the wall. Sits behind the frame, so it never washes
          over the painting itself.

          Curved, not flat, and drawn at the room's centre rather than at the
          work: a flat quad this wide inside a rotunda this tight has its ends
          outside the cylinder, where the wall cuts them off and leaves a hard
          vertical edge in the middle of a soft pool. Bent to the wall's own
          radius it stays inside, and the pool ends where it fades. */}
      <mesh ref={glow} position={[0, EYE + 0.12, 0]}>
        <cylinderGeometry
          args={[
            GLOW_R,
            GLOW_R,
            frameH * 1.62,
            24,
            1,
            true,
            work.angle - (frameW * 2.9) / GLOW_R / 2,
            (frameW * 2.9) / GLOW_R,
          ]}
        />
        <meshBasicMaterial
          map={glowMap}
          transparent
          opacity={1}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <group
        position={[Math.sin(work.angle) * RADIUS, EYE, Math.cos(work.angle) * RADIUS]}
        // Turned to face the middle of the room, where the visitor stands.
        rotation={[0, work.angle + Math.PI, 0]}
      >
      {/* The frame catches the pool and picks up its warmth, which is what puts
          the canvas in front of the wall rather than on it. */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[frameW, frameH, 0.1]} />
        <meshStandardMaterial color="#241f1a" roughness={0.7} />
      </mesh>

      <mesh
        ref={art}
        position={[0, 0, 0.012]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <planeGeometry args={[work.w, work.h]} />
        {/* Unlit, so the paintings keep their hue and the scene stays cheap; the
            colour multiplier is the gallery lamp on top of it. */}
        <meshBasicMaterial
          map={texture}
          color={CANVAS_LIGHT}
          toneMapped={false}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Top right of the canvas: background in all of these portraits, and
          clear of the page copy on a phone, where the lower third is covered. */}
      <group position={[work.w * 0.32, work.h * 0.3, 0.02]}>
        <Hotspot shown={markerShown} />
      </group>

      {/* Mirrored on the polished floor. Cheaper than a real reflection pass. */}
      <mesh ref={echo} position={[0, -2 * (EYE - FLOOR_Y), 0.012]} scale={[1, -1, 1]} renderOrder={2}>
        <planeGeometry args={[work.w, work.h]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          transparent
          opacity={0.14}
          depthWrite={false}
          depthTest={false}
        />
        </mesh>
      </group>
    </>
  );
}

function Room({
  works,
  focusIndex,
  dragRef,
  onSelect,
}: {
  works: Placed[];
  focusIndex: number | null;
  dragRef: React.RefObject<{ velocity: number; dragging: boolean; moved: number }>;
  onSelect: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const rotation = useRef(0);
  /** Index of the work currently turned to the front. */
  const centred = useRef(0);
  const idleFor = useRef(0);
  const wasDragging = useRef(false);
  const { camera, size } = useThree();
  const glowMap = useMemo(makeGlowTexture, []);

  // Portrait screens see a much narrower slice, so they get a longer lens.
  const portrait = size.height >= size.width;

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = portrait ? 46 : 54;
    cam.updateProjectionMatrix();
  }, [camera, portrait]);

  // Stepping back out of a work leaves it centred rather than snapping away.
  useEffect(() => {
    if (focusIndex !== null) centred.current = focusIndex;
  }, [focusIndex]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const drag = dragRef.current;
    const twoPi = Math.PI * 2;
    const step = twoPi / works.length;

    if (drag.dragging) {
      rotation.current += drag.velocity * delta;
      wasDragging.current = true;
    } else {
      if (wasDragging.current) {
        // Released: settle on whichever work is nearest to front, and hold off
        // the automatic advance so the visitor keeps control.
        centred.current = ((-Math.round(rotation.current / step) % works.length) + works.length) % works.length;
        idleFor.current = -3.5;
        wasDragging.current = false;
      }

      if (focusIndex === null) {
        idleFor.current += delta;
        if (idleFor.current > 5.5) {
          centred.current = (centred.current + 1) % works.length;
          idleFor.current = 0;
        }
      }

      // Always ease to a work rather than drifting, so the framing never lands
      // in the gap between two canvases.
      const target = -works[focusIndex ?? centred.current].angle;
      const diff = ((((target - rotation.current + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI;
      rotation.current += diff * Math.min(1, delta * (focusIndex !== null ? 3.4 : 2.1));
      drag.velocity = 0;
    }

    if (group.current) group.current.rotation.y = rotation.current;

    // The visitor stands in the middle and steps toward a work when it is
    // chosen. A narrow viewport can only step a little way in before the canvas
    // starts cropping, so it keeps its distance.
    const targetZ = focusIndex !== null ? RADIUS - (portrait ? 5.2 : 3.1) : 0;
    camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 3);

    // Aim off-centre so the page copy has somewhere to sit: below the work on
    // phones, beside it on wide screens. Focusing recentres on the work.
    const aimX = focusIndex !== null || portrait ? 0 : 2.5;
    const aimY = focusIndex !== null ? (portrait ? EYE - 0.5 : EYE) : portrait ? EYE - 0.95 : EYE - 0.15;
    camera.lookAt(aimX, aimY, RADIUS + 2);
  });

  return (
    <>
      {/* The paintings are unlit, so light only has to shape frames, floor and
          wall. Low ambient, one warm lamp overhead: the room stays a dark room
          and the pools around the works do the lighting. */}
      <ambientLight intensity={0.75} />
      <pointLight position={[0, 4.4, 0]} intensity={52} distance={22} decay={2} color="#f7e3c4" />

      <group ref={group}>
        {works.map((work, i) => (
          <Piece
            key={work.id}
            work={work}
            glowMap={glowMap}
            dimmed={focusIndex !== null && focusIndex !== i}
            focused={focusIndex === i}
            // Read per frame: `centred` is a ref, so the marker can follow the
            // carousel without re-rendering the whole room.
            markerShown={() => focusIndex === null && centred.current === i && !dragRef.current.dragging}
            onSelect={() => onSelect(i)}
          />
        ))}

        {/* Inside the rotating group, so the light pools stay with their works. */}
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[SHELL, SHELL, 11, 64, 1, true]} />
          <meshStandardMaterial color="#3a322b" roughness={1} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* Polished dark floor: it carries the works back as a reflection, which
          is half of why a lit room reads as lit. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <circleGeometry args={[SHELL, 64]} />
        <meshStandardMaterial color="#12100e" roughness={0.32} metalness={0.45} />
      </mesh>
    </>
  );
}

export default function Room3D({
  focusIndex,
  onSelect,
  onReady,
  onFirstDrag,
  onLost,
}: {
  focusIndex: number | null;
  onSelect: (index: number | null) => void;
  onReady?: () => void;
  onFirstDrag?: () => void;
  /** The GPU took the context away. Not an error, just the end of the room. */
  onLost?: () => void;
}) {
  const works = useMemo(() => place(zaalWerken), []);
  const dragRef = useRef({ velocity: 0, dragging: false, moved: 0 });
  const lastX = useRef(0);
  const [ready, setReady] = useState(false);

  // Drag is tracked on the window rather than by capturing the pointer on this
  // element: capturing would divert pointerup away from the canvas, and R3F
  // would never raycast a click through to a painting.
  const onDown = (event: React.PointerEvent) => {
    lastX.current = event.clientX;
    dragRef.current.dragging = true;
    dragRef.current.moved = 0;

    const move = (e: PointerEvent) => {
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      dragRef.current.moved += Math.abs(dx);
      // Negated so the room follows the finger: swipe right, the wall moves
      // right. The camera looks down +z, so world +x reads as screen left.
      dragRef.current.velocity = -dx * 0.3;
      // Once they have turned the room themselves, the glyph has done its job.
      if (dragRef.current.moved > 24) onFirstDrag?.();
    };
    const up = () => {
      dragRef.current.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      // Fires when the browser takes the gesture over for a vertical scroll.
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <div
      className={`room-canvas absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      onPointerDown={onDown}
    >
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, EYE, 0], fov: 50, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0e0d0c');
          // A phone under memory pressure drops the context without throwing.
          // Told about it, the hero can put its image strip back; left alone,
          // the visitor is looking at an empty black band.
          gl.domElement.addEventListener('webglcontextlost', () => onLost?.(), { once: true });
          setReady(true);
          onReady?.();
        }}
        // Fires only when a click hit no painting. Doing this on the wrapping
        // div instead would undo the selection that was just made, because
        // React flushes the state update before the synthetic click arrives.
        onPointerMissed={() => {
          if (dragRef.current.moved < 8) onSelect(null);
        }}
      >
        <fog attach="fog" args={['#0e0d0c', 7, 22]} />
        <Room
          works={works}
          focusIndex={focusIndex}
          dragRef={dragRef}
          onSelect={(i) => {
            // Ignore the click that ends a drag.
            if (dragRef.current.moved > 8) return;
            onSelect(focusIndex === i ? null : i);
          }}
        />
      </Canvas>
    </div>
  );
}
