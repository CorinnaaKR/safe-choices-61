import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveObjectProps {
  position: [number, number, number];
  geometry?: 'box' | 'sphere' | 'cylinder';
  size?: [number, number, number];
  color: string;
  glowColor?: string;
  label: string;
  collected?: boolean;
  focused?: boolean;
  onClick: () => void;
}

export function InteractiveObject({
  position,
  geometry = 'box',
  size = [0.3, 0.3, 0.3],
  color,
  glowColor = '#f59e0b',
  label,
  collected = false,
  focused = false,
  onClick,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.rotation.y += 0.01;
    }
    if (glowRef.current && !collected) {
      const pulse = focused ? 0.25 : 0.15;
      const speed = focused ? 4 : 3;
      const baseScale = focused ? 1.3 : 1;
      const scale = baseScale + Math.sin(state.clock.elapsedTime * speed) * pulse;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[size[0], 16, 16]} />;
      case 'cylinder':
        return <cylinderGeometry args={[size[0], size[0], size[1], 16]} />;
      default:
        return <boxGeometry args={size} />;
    }
  };

  return (
    <group position={position}>
      {/* Glow effect */}
      {!collected && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[focused ? 0.7 : 0.5, 16, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={focused ? 0.25 : hovered ? 0.2 : 0.08}
          />
        </mesh>
      )}

      {/* Ground ring indicator */}
      {!collected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.02, 0]}>
          <ringGeometry args={[0.3, 0.45, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={focused ? 0.4 : 0.15} />
        </mesh>
      )}

      {/* Main object */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!collected) onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = collected ? 'default' : 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <GeometryComponent />
        <meshStandardMaterial
          color={collected ? '#6b7280' : color}
          emissive={hovered && !collected ? glowColor : focused ? glowColor : '#000000'}
          emissiveIntensity={focused ? 0.6 : hovered ? 0.4 : 0}
          transparent={collected}
          opacity={collected ? 0.4 : 1}
        />
      </mesh>

      {/* Label */}
      {(hovered && !collected) && (
        <Html position={[0, 0.6, 0]} center>
          <div className="bg-card/95 backdrop-blur border-2 border-decision-highlight px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            <p className="text-xs font-semibold text-foreground">{label}</p>
            <p className="text-[10px] text-decision-highlight">Click to investigate</p>
          </div>
        </Html>
      )}

      {collected && (
        <Html position={[0, 0.5, 0]} center>
          <div className="bg-feedback-positive/90 px-2 py-0.5 rounded-full shadow pointer-events-none">
            <p className="text-[10px] font-bold text-white">✓ Collected</p>
          </div>
        </Html>
      )}
    </group>
  );
}
