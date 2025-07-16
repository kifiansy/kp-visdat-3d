import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface DataPoint {
  alasan: string;
  jumlah_mahasiswa: number;
  persentase: number;
  position: [number, number, number];
  storyPosition: [number, number, number];
  color: string;
  demografi: any;
  akademik: any;
}

interface AnimatedPlanetProps {
  dataPoint: DataPoint;
  onHover: (data: DataPoint | null) => void;
  onClick: (data: DataPoint) => void;
  isSelected: boolean;
  isStoryMode: boolean;
  isCurrentStoryPlanet: boolean;
}

const AnimatedPlanet: React.FC<AnimatedPlanetProps> = ({
  dataPoint,
  onHover,
  onClick,
  isSelected,
  isStoryMode,
  isCurrentStoryPlanet,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

      const scale = hovered ? 1.3 : isSelected ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

      // Transisi ketika story mode ke kiri
      const targetPosition =
        isStoryMode && isCurrentStoryPlanet
          ? new THREE.Vector3(-8, 0, 2) // Posisi di kiri
          : new THREE.Vector3(...dataPoint.position);

      meshRef.current.position.lerp(targetPosition, 0.05);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.PI / 2;

      // Cincin planet
      if (meshRef.current) {
        ringRef.current.position.copy(meshRef.current.position);
      }
    }
  });

  // Perhitungan radius ukuran planet sesuai jumlah
  const baseRadius = 0.9;
  const maxStudents = 80;
  const minStudents = 20;

  const normalizedCount =
    (dataPoint.jumlah_mahasiswa - minStudents) / (maxStudents - minStudents);
  const radius = baseRadius + normalizedCount * 0.8;

  return (
    <group>
      {/* Planet */}
      <mesh
        ref={meshRef}
        position={dataPoint.position}
        onPointerOver={() => {
          if (!isStoryMode) {
            setHovered(true);
            onHover(dataPoint);
          }
        }}
        onPointerOut={() => {
          if (!isStoryMode) {
            setHovered(false);
            onHover(null);
          }
        }}
        onClick={() => onClick(dataPoint)}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial
          color={dataPoint.color}
          transparent
          opacity={hovered ? 0.9 : 0.8}
          emissive={dataPoint.color}
          emissiveIntensity={hovered ? 0.3 : isSelected ? 0.2 : 0.1}
          shininess={100}
          specular={new THREE.Color(0xffffff)}
        />
      </mesh>

      {/* Cincin planet untuk planet besar */}
      {radius > 0.7 && (
        <mesh ref={ringRef} position={dataPoint.position}>
          <ringGeometry args={[radius * 1.2, radius * 1.4, 32]} />
          <meshBasicMaterial
            color={dataPoint.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Nama planet ketika story mode berjalan */}
      {(!isStoryMode || isCurrentStoryPlanet) && (
        <>
          <Text
            position={[
              isStoryMode && isCurrentStoryPlanet ? -8 : dataPoint.position[0],
              (isStoryMode && isCurrentStoryPlanet
                ? 0
                : dataPoint.position[1]) +
                radius +
                0.6,
              isStoryMode && isCurrentStoryPlanet ? 2 : dataPoint.position[2],
            ]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000033"
          >
            {dataPoint.alasan}
          </Text>

          <Text
            position={[
              isStoryMode && isCurrentStoryPlanet ? -8 : dataPoint.position[0],
              (isStoryMode && isCurrentStoryPlanet
                ? 0
                : dataPoint.position[1]) +
                radius +
                0.35,
              isStoryMode && isCurrentStoryPlanet ? 2 : dataPoint.position[2],
            ]}
            fontSize={0.15}
            color="#88ccff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000033"
          >
            {dataPoint.jumlah_mahasiswa} mahasiswa ({dataPoint.persentase}%)
          </Text>
        </>
      )}
    </group>
  );
};

const GalaxyParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const colors = new Float32Array(500 * 3);

    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      // Random star colors
      const color = new THREE.Color();
      color.setHSL(
        Math.random() * 0.2 + 0.5,
        0.55,
        Math.random() * 0.25 + 0.75
      );
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} transparent opacity={0.8} vertexColors />
    </points>
  );
};

const Scene: React.FC<{
  processedData: DataPoint[];
  hoveredData: DataPoint | null;
  setHoveredData: (data: DataPoint | null) => void;
  onDataSelect: (data: any) => void;
  selectedData: any;
  isStoryMode: boolean;
  currentStoryStep: number;
}> = ({
  processedData,
  hoveredData,
  setHoveredData,
  onDataSelect,
  selectedData,
  isStoryMode,
  currentStoryStep,
}) => {
  const { camera } = useThree();

  // Update posisi kamera
  useEffect(() => {
    if (isStoryMode && processedData[currentStoryStep]) {
      // Posisi kamera untuk fokus di sebelah kiri
      const cameraPosition = new THREE.Vector3(-10, 2, 8);

      // Transisi kamera smooth
      const animate = () => {
        camera.position.lerp(cameraPosition, 0.02);
        camera.lookAt(new THREE.Vector3(-8, 0, 2)); // Look at the planet position

        if (camera.position.distanceTo(cameraPosition) > 0.1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [isStoryMode, currentStoryStep, processedData, camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#4444ff" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#88ccff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff88cc" />
      <spotLight
        position={[0, 25, 0]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#aaffff"
        castShadow
      />

      <GalaxyParticles />

      {processedData.map((dataPoint, index) => (
        <AnimatedPlanet
          key={`${dataPoint.alasan}-${index}`}
          dataPoint={dataPoint}
          onHover={setHoveredData}
          onClick={onDataSelect}
          isSelected={selectedData?.alasan === dataPoint.alasan}
          isStoryMode={isStoryMode}
          isCurrentStoryPlanet={isStoryMode && index === currentStoryStep}
        />
      ))}

      <OrbitControls
        enabled={!isStoryMode}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.8}
        panSpeed={0.8}
        rotateSpeed={0.5}
        minDistance={8}
        maxDistance={30}
      />
    </>
  );
};

interface DataVisualization3DProps {
  data: any[];
  onDataSelect: (data: any) => void;
  selectedData: any;
  isStoryMode?: boolean;
  currentStoryStep?: number;
}

const DataVisualization3D: React.FC<DataVisualization3DProps> = ({
  data,
  onDataSelect,
  selectedData,
  isStoryMode = false,
  currentStoryStep = 0,
}) => {
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  const processedData: DataPoint[] = useMemo(() => {
    const planetColors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
      "#ff9f43",
      "#10ac84",
      "#ee5a52",
    ];

    return data.map((item, index) => ({
      ...item,
      position: [
        Math.cos(index * 0.8) * (5 + index * 0.5),
        Math.sin(index * 0.3) * 4,
        Math.sin(index * 0.8) * (5 + index * 0.5),
      ] as [number, number, number],
      storyPosition: [
        -6, // Positioned on the left side
        0,
        2,
      ] as [number, number, number],
      color: planetColors[index % planetColors.length],
    }));
  }, [data]);

  const fallbackContent = (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-purple-950">
      <div className="text-center">
        <div className="text-blue-200 text-xl mb-4">Loading Visualisasi...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <Suspense fallback={fallbackContent}>
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000", 0);
          }}
          style={{ background: "transparent" }}
        >
          <Scene
            processedData={processedData}
            hoveredData={hoveredData}
            setHoveredData={setHoveredData}
            onDataSelect={onDataSelect}
            selectedData={selectedData}
            isStoryMode={isStoryMode}
            currentStoryStep={currentStoryStep}
          />
        </Canvas>
      </Suspense>

      {/* Hover info - only show when not in story mode */}
      {hoveredData && !isStoryMode && (
        <div className="absolute bottom-32 right-6 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-blue-400/40 text-white max-w-xs z-10 shadow-lg shadow-blue-500/30">
          <h3 className="text-blue-300 font-bold mb-2">
            Alasan {hoveredData.alasan}
          </h3>
          <p className="text-sm text-blue-100">
            Jumlah: {hoveredData.jumlah_mahasiswa} mahasiswa
          </p>
          <p className="text-sm text-blue-100">
            Persentase: {hoveredData.persentase}%
          </p>
          <p className="text-sm text-blue-200 mt-1">Klik untuk data lengkap</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualization3D;
