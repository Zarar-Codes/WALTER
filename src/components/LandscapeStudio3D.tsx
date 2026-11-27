import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';

export type LandscapeStage = 'design' | 'construction' | 'planting';
type TimeOfDay = 'morning' | 'golden' | 'twilight';
type CameraPreset = 'overview' | 'patio' | 'waterfall' | 'plan';

interface LandscapeStudio3DProps {
  activeStage: LandscapeStage;
  onStageChange: (stage: LandscapeStage) => void;
}

// Pre-allocated scratch math helpers (zero GC inside animation loop)
const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number]; label: string }
> = {
  overview: { pos: [14.5, 9.8, 15.2], target: [0, 1.2, 0.5], label: 'Overview' },
  patio: { pos: [6.8, 4.4, 9.5], target: [-1.4, 1.4, 0.2], label: 'Patio & Hearth' },
  waterfall: { pos: [-9.2, 5.2, 9.4], target: [-4.6, 1.1, 1.8], label: 'Waterfall' },
  plan: { pos: [0.2, 21.5, 4.2], target: [0, 0.5, 0], label: 'Plan View' },
};

const LIGHTING_PRESETS: Record<
  TimeOfDay,
  {
    label: string;
    sky: number;
    fogDensity: number;
    sunColor: number;
    sunIntensity: number;
    sunPos: [number, number, number];
    hemiSky: number;
    hemiGround: number;
    hemiIntensity: number;
    exposure: number;
    lampIntensity: number;
    windowEmissive: number;
  }
> = {
  morning: {
    label: 'Morning',
    sky: 0xdbe6ec,
    fogDensity: 0.011,
    sunColor: 0xfff6e5,
    sunIntensity: 2.35,
    sunPos: [15, 21, 13],
    hemiSky: 0xcbe2f6,
    hemiGround: 0x4b5c43,
    hemiIntensity: 0.95,
    exposure: 1.05,
    lampIntensity: 0,
    windowEmissive: 0.12,
  },
  golden: {
    label: 'Golden Hour',
    sky: 0xdfd4c6,
    fogDensity: 0.013,
    sunColor: 0xffd29d,
    sunIntensity: 2.65,
    sunPos: [19, 10.5, 9],
    hemiSky: 0xb7c9e2,
    hemiGround: 0x4c4a3d,
    hemiIntensity: 0.85,
    exposure: 1.08,
    lampIntensity: 1.4,
    windowEmissive: 0.55,
  },
  twilight: {
    label: 'Twilight',
    sky: 0x182544,
    fogDensity: 0.016,
    sunColor: 0x7b98cf,
    sunIntensity: 0.65,
    sunPos: [-12, 14, -10],
    hemiSky: 0x3b5384,
    hemiGround: 0x161c24,
    hemiIntensity: 0.65,
    exposure: 1.15,
    lampIntensity: 3.4,
    windowEmissive: 1.25,
  },
};

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createFlagstoneTextures(maxAniso: number) {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  ctx.fillStyle = '#5c5f5a';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#252525';
  bCtx.fillRect(0, 0, size, size);

  const tones = ['#969891', '#8b8f88', '#a3a29a', '#7e837e', '#9a968c', '#888a84'];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const rows = 6;
  const rowH = size / rows;
  for (let r = 0; r < rows; r++) {
    let x = 0;
    const y = r * rowH;
    while (x < size) {
      const w = Math.min(size - x, 64 + Math.floor(rand() * 88));
      const pad = 4;
      const tone = tones[Math.floor(rand() * tones.length)];
      ctx.fillStyle = tone;
      ctx.fillRect(x + pad, y + pad, Math.max(8, w - pad * 2), rowH - pad * 2);

      // Subtle mineral grain
      for (let i = 0; i < 24; i++) {
        ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(25,30,28,0.08)';
        ctx.fillRect(
          x + pad + rand() * Math.max(4, w - pad * 2),
          y + pad + rand() * (rowH - pad * 2),
          4 + rand() * 8,
          2 + rand() * 5
        );
      }

      const bVal = 175 + Math.floor(rand() * 55);
      bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      bCtx.fillRect(x + pad, y + pad, Math.max(8, w - pad * 2), rowH - pad * 2);

      x += w;
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3.2, 2.6);
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3.2, 2.6);
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

function createStackedStoneTextures(maxAniso: number) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const b = document.createElement('canvas');
  b.width = size;
  b.height = size;
  const bCtx = b.getContext('2d')!;

  ctx.fillStyle = '#474642';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#202020';
  bCtx.fillRect(0, 0, size, size);

  const palette = ['#8f8a7f', '#9c9689', '#7d7a72', '#a8a194', '#85827a'];
  let seed = 109;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const courses = 14;
  const h = size / courses;
  for (let r = 0; r < courses; r++) {
    let x = 0;
    const y = r * h;
    while (x < size) {
      const w = Math.min(size - x, 42 + Math.floor(rand() * 76));
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.fillRect(x + 2, y + 2, Math.max(6, w - 4), h - 4);
      const bv = 160 + Math.floor(rand() * 70);
      bCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      bCtx.fillRect(x + 2, y + 2, Math.max(6, w - 4), h - 4);
      x += w;
    }
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2.5, 1.4);
  map.anisotropy = maxAniso;

  const bumpMap = new THREE.CanvasTexture(b);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2.5, 1.4);
  bumpMap.anisotropy = maxAniso;

  return { map, bumpMap };
}

function createLawnTexture(maxAniso: number) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#4f7039';
  ctx.fillRect(0, 0, size, size);

  // Subtle mowed architectural lawn bands
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(116,158,76,0.16)' : 'rgba(42,66,30,0.12)';
    ctx.fillRect((size / 8) * i, 0, size / 8, size);
  }

  let seed = 77;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 2400; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(140,180,92,0.18)' : 'rgba(34,55,24,0.18)';
    ctx.fillRect(rand() * size, rand() * size, 2, 5);
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(7, 7);
  map.anisotropy = maxAniso;
  return map;
}

function createCedarTexture(maxAniso: number) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8b5732';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 3) {
    const alpha = 0.08 + Math.sin(y * 0.25) * 0.05;
    ctx.fillStyle = y % 6 === 0 ? `rgba(54,28,12,${alpha})` : `rgba(182,126,76,${alpha})`;
    ctx.fillRect(0, y, size, 2);
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);
  map.anisotropy = maxAniso;
  return map;
}

function createContactShadowTexture() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(10, 18, 28, 0.45)');
  grad.addColorStop(0.65, 'rgba(10, 18, 28, 0.16)');
  grad.addColorStop(1, 'rgba(10, 18, 28, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Composite 5-part procedural Ontario specimen tree (bottom-center pivot) */
function createSpecimenTree(
  trunkMat: THREE.Material,
  canopyMatPrimary: THREE.Material,
  canopyMatSecondary: THREE.Material,
  scale = 1,
  seedOffset = 0
): THREE.Group {
  const group = new THREE.Group();

  // Tapered organic trunk via LatheGeometry
  const trunkPoints = [
    new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.16, 0.55),
    new THREE.Vector2(0.12, 1.45),
    new THREE.Vector2(0.08, 2.35),
  ];
  const trunkGeo = new THREE.LatheGeometry(trunkPoints, 10);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);

  // Two diverging primary limbs via TubeGeometry
  const limbCurves = [
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.65, 0),
      new THREE.Vector3(0.45, 2.25, 0.25),
      new THREE.Vector3(0.85, 2.75, 0.38),
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.75, 0),
      new THREE.Vector3(-0.48, 2.32, -0.22),
      new THREE.Vector3(-0.82, 2.8, -0.4),
    ]),
  ];
  limbCurves.forEach((curve) => {
    const limb = new THREE.Mesh(new THREE.TubeGeometry(curve, 6, 0.065, 6, false), trunkMat);
    limb.castShadow = true;
    group.add(limb);
  });

  // Layered multi-cluster organic canopy
  const crownSpecs: Array<[number, number, number, number, boolean]> = [
    [0, 3.15, 0, 1.25, true],
    [0.78, 2.85, 0.35, 0.92, false],
    [-0.75, 2.9, -0.32, 0.95, true],
    [0.25, 2.75, -0.68, 0.85, false],
    [-0.22, 3.45, 0.42, 0.78, false],
  ];
  crownSpecs.forEach(([cx, cy, cz, r, primary], idx) => {
    const lobeGeo = new THREE.IcosahedronGeometry(r, 1);
    const lobe = new THREE.Mesh(
      lobeGeo,
      primary ? canopyMatPrimary : canopyMatSecondary
    );
    lobe.position.set(cx, cy, cz);
    lobe.scale.set(1.12, 0.82, 1.05);
    lobe.rotation.y = (idx + seedOffset) * 1.1;
    lobe.castShadow = true;
    lobe.receiveShadow = true;
    group.add(lobe);
  });

  group.scale.setScalar(scale);
  return group;
}

export function LandscapeStudio3D({
  activeStage,
  onStageChange,
}: LandscapeStudio3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('golden');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mutable ref bridge so React state updates never recreate the WebGL context
  const stateRef = useRef({
    stage: activeStage,
    timeOfDay,
    cameraPreset,
    cameraAnimating: false,
    triggerRender: () => {},
  });

  useEffect(() => {
    stateRef.current.stage = activeStage;
    stateRef.current.triggerRender();
  }, [activeStage]);

  useEffect(() => {
    stateRef.current.timeOfDay = timeOfDay;
    stateRef.current.triggerRender();
  }, [timeOfDay]);

  const selectCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    stateRef.current.cameraPreset = preset;
    stateRef.current.cameraAnimating = true;
    const goal = CAMERA_PRESETS[preset];
    _camGoalPos.set(...goal.pos);
    _camGoalTarget.set(...goal.target);
    stateRef.current.triggerRender();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = mount.clientWidth || 960;
    const height = mount.clientHeight || 540;

    const scene = new THREE.Scene();
    const initialLight = LIGHTING_PRESETS[stateRef.current.timeOfDay];
    scene.background = new THREE.Color(initialLight.sky);
    scene.fog = new THREE.FogExp2(initialLight.sky, initialLight.fogDensity);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 160);
    camera.position.set(...CAMERA_PRESETS.overview.pos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = initialLight.exposure;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    // Mandatory procedural studio RoomEnvironment IBL on every device
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI * 0.475;
    controls.minPolarAngle = 0.18;
    controls.minDistance = 6.5;
    controls.maxDistance = 30;
    controls.enablePan = false;
    controls.update();

    // Cancel scripted camera transition if user interacts directly
    controls.addEventListener('start', () => {
      stateRef.current.cameraAnimating = false;
    });

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // --- Studio Warm/Cool Lighting Rig ---
    const sunLight = new THREE.DirectionalLight(
      initialLight.sunColor,
      initialLight.sunIntensity
    );
    sunLight.position.set(...initialLight.sunPos);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 55;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(
      initialLight.hemiSky,
      initialLight.hemiGround,
      initialLight.hemiIntensity
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x9fb8db, 0.42);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // Warm architectural outdoor lights (fireplace + pergola + garden uplights)
    const fireLight = new THREE.PointLight(0xff8e3c, initialLight.lampIntensity, 10, 2);
    fireLight.position.set(-1.35, 1.35, -1.65);
    scene.add(fireLight);

    const pergolaLight = new THREE.PointLight(0xffcf87, initialLight.lampIntensity * 0.75, 11, 2);
    pergolaLight.position.set(2.9, 2.7, 0.2);
    scene.add(pergolaLight);

    // --- Procedural Textures & Shared PBR Materials ---
    const flagstoneTex = createFlagstoneTextures(maxAniso);
    const stackedStoneTex = createStackedStoneTextures(maxAniso);
    const lawnMap = createLawnTexture(maxAniso);
    const cedarMap = createCedarTexture(maxAniso);
    const shadowMapTex = createContactShadowTexture();

    const lawnMat = new THREE.MeshStandardMaterial({
      map: lawnMap,
      roughness: 0.92,
      metalness: 0.02,
    });
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x3b2f26,
      roughness: 0.95,
      metalness: 0.0,
    });
    const flagstoneMat = new THREE.MeshStandardMaterial({
      map: flagstoneTex.map,
      bumpMap: flagstoneTex.bumpMap,
      bumpScale: 0.08,
      roughness: 0.78,
      metalness: 0.05,
    });
    const stackedStoneMat = new THREE.MeshStandardMaterial({
      map: stackedStoneTex.map,
      bumpMap: stackedStoneTex.bumpMap,
      bumpScale: 0.11,
      roughness: 0.84,
      metalness: 0.04,
    });
    const limestoneCapMat = new THREE.MeshStandardMaterial({
      color: 0xc2beb2,
      roughness: 0.56,
      metalness: 0.06,
    });
    const cedarMat = new THREE.MeshStandardMaterial({
      map: cedarMap,
      roughness: 0.68,
      metalness: 0.04,
    });
    const bronzeMetalMat = new THREE.MeshStandardMaterial({
      color: 0x2c3035,
      roughness: 0.32,
      metalness: 0.85,
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xd9d4c7,
      roughness: 0.88,
      metalness: 0.0,
    });
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x253552,
      emissive: 0xffc982,
      emissiveIntensity: initialLight.windowEmissive,
      roughness: 0.14,
      metalness: 0.25,
      clearcoat: 1.0,
    });
    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x4c3d32,
      roughness: 0.92,
      metalness: 0.0,
    });
    const mapleGreenMat = new THREE.MeshStandardMaterial({
      color: 0x3f6e33,
      roughness: 0.82,
      metalness: 0.02,
    });
    const mapleLightMat = new THREE.MeshStandardMaterial({
      color: 0x56873f,
      roughness: 0.78,
      metalness: 0.02,
    });
    const japaneseMapleMat = new THREE.MeshStandardMaterial({
      color: 0x7c342b,
      roughness: 0.76,
      metalness: 0.03,
    });
    const boulderMat = new THREE.MeshStandardMaterial({
      color: 0x787b75,
      roughness: 0.86,
      metalness: 0.05,
    });
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x265b6e,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.84,
    });
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0xff6b24,
      emissive: 0xff7b29,
      emissiveIntensity: 2.2,
      roughness: 0.4,
    });

    // =========================================================================
    // 1. EXTENDED NATURAL ONTARIO TERRAIN (No floating box!)
    // =========================================================================
    const terrainGeo = new THREE.PlaneGeometry(110, 110, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const dist = Math.hypot(x, z);
      // Flat buildable estate yard inside radius 10.5, gently rolling hills outside
      let y = 0;
      if (dist > 10.5) {
        const blend = THREE.MathUtils.smoothstep(dist, 10.5, 24);
        y =
          blend *
          (Math.sin(x * 0.14) * Math.cos(z * 0.12) * 1.45 +
            Math.max(0, -z * 0.04) * 1.2);
      }
      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();
    const terrainMesh = new THREE.Mesh(terrainGeo, lawnMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Contact shadow plane directly under estate centerpiece
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 16),
      new THREE.MeshBasicMaterial({
        map: shadowMapTex,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.015, 0.4);
    scene.add(contactShadow);

    // =========================================================================
    // 2. ARCHITECTURAL RESIDENCE BACKDROP (Composite 8-Part Group)
    // =========================================================================
    const houseGroup = new THREE.Group();
    houseGroup.position.set(0.6, 0, -6.2);

    const housePlinth = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.5, 4.4), limestoneCapMat);
    housePlinth.position.set(0, 0.25, 0);
    housePlinth.castShadow = true;
    housePlinth.receiveShadow = true;
    houseGroup.add(housePlinth);

    const houseBody = new THREE.Mesh(new THREE.BoxGeometry(11.0, 3.8, 4.0), stackedStoneMat);
    houseBody.position.set(0, 2.4, 0);
    houseBody.castShadow = true;
    houseBody.receiveShadow = true;
    houseGroup.add(houseBody);

    // Pitched architectural gable roof
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-6.1, 0);
    roofShape.lineTo(0, 2.35);
    roofShape.lineTo(6.1, 0);
    roofShape.closePath();
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, {
      depth: 4.8,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 2,
    });
    roofGeo.translate(0, 0, -2.4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x2a3038,
      roughness: 0.72,
      metalness: 0.18,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 4.25, 0);
    roof.castShadow = true;
    houseGroup.add(roof);

    // Cedar porch fascia & architectural glass doors/windows
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.22, 4.6), cedarMat);
    fascia.position.set(0, 4.24, 0);
    houseGroup.add(fascia);

    [-3.3, 0, 3.3].forEach((wx) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 2.35, 0.18), bronzeMetalMat);
      frame.position.set(wx, 1.95, 1.98);
      houseGroup.add(frame);

      const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.1), windowGlassMat);
      pane.position.set(wx, 1.95, 2.09);
      houseGroup.add(pane);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.2, 0.26), limestoneCapMat);
      lintel.position.set(wx, 3.22, 2.02);
      houseGroup.add(lintel);
    });

    scene.add(houseGroup);

    // =========================================================================
    // 3. STAGE 01 — DESIGN BLUEPRINT LAYER
    // =========================================================================
    const designLayer = new THREE.Group();

    // Architectural site grid & alignment lines
    const gridHelper = new THREE.GridHelper(22, 22, 0x00c52b, 0x24345f);
    gridHelper.position.set(0, 0.04, 0.6);
    const gridMats = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];
    gridMats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.55;
    });
    designLayer.add(gridHelper);

    // Architectural contour / zone outline paths
    const zoneMaterial = new THREE.LineBasicMaterial({
      color: 0x00c52b,
      transparent: true,
      opacity: 0.9,
    });
    const makeRectOutline = (w: number, d: number, x: number, y: number, z: number) => {
      const pts = [
        new THREE.Vector3(-w / 2, 0, -d / 2),
        new THREE.Vector3(w / 2, 0, -d / 2),
        new THREE.Vector3(w / 2, 0, d / 2),
        new THREE.Vector3(-w / 2, 0, d / 2),
        new THREE.Vector3(-w / 2, 0, -d / 2),
      ];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), zoneMaterial);
      line.position.set(x, y, z);
      return line;
    };
    designLayer.add(makeRectOutline(10.8, 7.6, 0.4, 0.08, 0.6));
    designLayer.add(makeRectOutline(4.6, 4.2, 3.0, 0.1, 0.2));
    designLayer.add(makeRectOutline(4.2, 4.2, -4.6, 0.1, 1.8));

    // Pergola conceptual drafting wireframe (visible in Design stage)
    const wirePergola = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.4, 2.9, 3.8)),
      new THREE.LineBasicMaterial({ color: 0x00c52b, transparent: true, opacity: 0.75 })
    );
    wirePergola.position.set(3.0, 1.65, 0.2);
    designLayer.add(wirePergola);

    scene.add(designLayer);

    // =========================================================================
    // 4. STAGE 02 — CONSTRUCTION LAYER (Patio, Retaining Walls, Pergola, Hearth, Waterfall)
    // =========================================================================
    const constructionLayer = new THREE.Group();

    // Primary natural flagstone terrace pad
    const patioPad = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.26, 7.2), flagstoneMat);
    patioPad.position.set(0.4, 0.13, 0.6);
    patioPad.receiveShadow = true;
    patioPad.castShadow = true;
    constructionLayer.add(patioPad);

    // Secondary raised entry landing & steps connecting to residence
    const upperLanding = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.42, 2.2), flagstoneMat);
    upperLanding.position.set(0.6, 0.21, -3.1);
    upperLanding.receiveShadow = true;
    constructionLayer.add(upperLanding);

    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.14, 0.48),
        limestoneCapMat
      );
      step.position.set(0.6, 0.34 - s * 0.1, -1.85 + s * 0.45);
      step.castShadow = true;
      step.receiveShadow = true;
      constructionLayer.add(step);
    }

    // Tiered Natural Limestone Retaining Walls with beveled capstones
    const wallSpecs: Array<[number, number, number, number, number, number]> = [
      [5.4, 0.72, 0.52, -2.1, 0.36, 4.35],
      [4.2, 0.72, 0.52, 3.7, 0.36, 4.35],
      [0.52, 0.72, 7.2, 5.85, 0.36, 0.7],
    ];
    wallSpecs.forEach(([w, h, d, x, y, z]) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), stackedStoneMat);
      wall.position.set(x, y, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      constructionLayer.add(wall);

      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.12, 0.1, d + 0.12),
        limestoneCapMat
      );
      cap.position.set(x, y + h / 2 + 0.05, z);
      cap.castShadow = true;
      cap.receiveShadow = true;
      constructionLayer.add(cap);
    });

    // --- Composite 10-Part Custom Cedar Pergola Pavilion ---
    const pergolaGroup = new THREE.Group();
    pergolaGroup.position.set(3.0, 0.26, 0.2);

    const postOffsets: Array<[number, number]> = [
      [-1.95, -1.65],
      [1.95, -1.65],
      [-1.95, 1.65],
      [1.95, 1.65],
    ];
    postOffsets.forEach(([px, pz]) => {
      // Stone plinth base
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.48, 0.46), stackedStoneMat);
      plinth.position.set(px, 0.24, pz);
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      pergolaGroup.add(plinth);

      const plinthCap = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.52), limestoneCapMat);
      plinthCap.position.set(px, 0.52, pz);
      pergolaGroup.add(plinthCap);

      // Cedar post
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.35, 0.22), cedarMat);
      post.position.set(px, 1.72, pz);
      post.castShadow = true;
      pergolaGroup.add(post);

      // Diagonal architectural knee brace
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.72, 0.12), cedarMat);
      brace.position.set(px > 0 ? px - 0.26 : px + 0.26, 2.48, pz);
      brace.rotation.z = px > 0 ? -Math.PI / 4 : Math.PI / 4;
      pergolaGroup.add(brace);
    });

    // Double header beams
    [-1.65, 1.65].forEach((bz) => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.26, 0.18), cedarMat);
      beam.position.set(0, 2.86, bz);
      beam.castShadow = true;
      pergolaGroup.add(beam);
    });

    // Overhead louvered cedar rafters
    for (let i = -4; i <= 4; i++) {
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 4.15), cedarMat);
      rafter.position.set(i * 0.48, 3.06, 0);
      rafter.castShadow = true;
      pergolaGroup.add(rafter);
    }

    // Outdoor Lounge Ensemble under pergola
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.36, 0.85), bronzeMetalMat);
    sofaBase.position.set(0, 0.18, -0.75);
    sofaBase.castShadow = true;
    pergolaGroup.add(sofaBase);

    const sofaCushion = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.2, 0.78), cushionMat);
    sofaCushion.position.set(0, 0.44, -0.74);
    pergolaGroup.add(sofaCushion);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.48, 0.2), cushionMat);
    sofaBack.position.set(0, 0.68, -1.06);
    pergolaGroup.add(sofaBack);

    const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.36, 0.72), cedarMat);
    coffeeTable.position.set(0, 0.18, 0.45);
    coffeeTable.castShadow = true;
    pergolaGroup.add(coffeeTable);

    constructionLayer.add(pergolaGroup);

    // --- Composite 7-Part Natural Stone Outdoor Fireplace ---
    const fireplaceGroup = new THREE.Group();
    fireplaceGroup.position.set(-1.35, 0.26, -2.0);

    const hearth = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.38, 1.35), limestoneCapMat);
    hearth.position.set(0, 0.19, 0.18);
    hearth.castShadow = true;
    hearth.receiveShadow = true;
    fireplaceGroup.add(hearth);

    const fireboxLeft = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.45, 1.05), stackedStoneMat);
    fireboxLeft.position.set(-0.78, 1.1, 0);
    fireboxLeft.castShadow = true;
    fireplaceGroup.add(fireboxLeft);

    const fireboxRight = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.45, 1.05), stackedStoneMat);
    fireboxRight.position.set(0.78, 1.1, 0);
    fireboxRight.castShadow = true;
    fireplaceGroup.add(fireboxRight);

    const fireboxBack = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.45, 0.36), stackedStoneMat);
    fireboxBack.position.set(0, 1.1, -0.34);
    fireplaceGroup.add(fireboxBack);

    const mantel = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.18, 1.25), limestoneCapMat);
    mantel.position.set(0, 1.9, 0.08);
    mantel.castShadow = true;
    fireplaceGroup.add(mantel);

    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.95, 0.88), stackedStoneMat);
    chimney.position.set(0, 2.95, -0.05);
    chimney.castShadow = true;
    fireplaceGroup.add(chimney);

    const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.14, 1.12), limestoneCapMat);
    chimneyCap.position.set(0, 3.98, -0.05);
    chimneyCap.castShadow = true;
    fireplaceGroup.add(chimneyCap);

    // Fire ember bed inside firebox
    const embers = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), emberMat);
    embers.position.set(0, 0.56, 0.05);
    embers.scale.set(1.5, 0.7, 0.9);
    fireplaceGroup.add(embers);

    constructionLayer.add(fireplaceGroup);

    // --- Composite 6-Part Natural Granite Waterfall & Garden Pond ---
    const waterGroup = new THREE.Group();
    waterGroup.position.set(-5.0, 0, 1.8);

    // Pond stone basin rim
    const pondBasin = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.5, 0.24, 24),
      boulderMat
    );
    pondBasin.position.set(0, 0.12, 0.35);
    pondBasin.receiveShadow = true;
    waterGroup.add(pondBasin);

    // Reflective pond water plane
    const pondWater = new THREE.Mesh(new THREE.CircleGeometry(2.12, 28), waterMat);
    pondWater.rotation.x = -Math.PI / 2;
    pondWater.position.set(0, 0.255, 0.35);
    waterGroup.add(pondWater);

    // Stacked granite waterfall boulders
    const boulderConfigs: Array<[number, number, number, number, number, number]> = [
      [-0.55, 0.72, -1.15, 1.15, 0.88, 0.95],
      [0.62, 0.65, -1.05, 1.05, 0.82, 0.85],
      [0.02, 1.38, -1.35, 0.95, 0.76, 0.82],
      [-1.35, 0.38, -0.35, 0.78, 0.52, 0.7],
      [1.45, 0.35, -0.15, 0.72, 0.48, 0.68],
      [-0.85, 0.28, 1.75, 0.62, 0.36, 0.56],
    ];
    boulderConfigs.forEach(([bx, by, bz, sx, sy, sz], i) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), boulderMat);
      rock.position.set(bx, by, bz);
      rock.scale.set(sx, sy, sz);
      rock.rotation.set(i * 0.5, i * 0.9, i * 0.3);
      rock.castShadow = true;
      rock.receiveShadow = true;
      waterGroup.add(rock);
    });

    // Cascading waterfall ribbon
    const cascadeGeo = new THREE.PlaneGeometry(0.72, 1.25, 4, 8);
    const cascadeMat = new THREE.MeshPhysicalMaterial({
      color: 0xaee3f0,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });
    const cascade = new THREE.Mesh(cascadeGeo, cascadeMat);
    cascade.position.set(0.02, 0.82, -0.78);
    cascade.rotation.x = -0.34;
    waterGroup.add(cascade);

    // Raised garden bed soil pads (ready for planting stage)
    const bedWest = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.22, 1.35), soilMat);
    bedWest.position.set(2.9, 0.11, 3.25);
    waterGroup.add(bedWest);

    constructionLayer.add(waterGroup);
    scene.add(constructionLayer);

    // =========================================================================
    // 5. STAGE 03 — PLANTING & CARE LAYER (Trees + Instanced Hedges, Blooms, Evergreens)
    // =========================================================================
    const plantingLayer = new THREE.Group();

    // Composite Hero Specimen Trees
    const sugarMapleRight = createSpecimenTree(
      barkMat,
      mapleGreenMat,
      mapleLightMat,
      1.35,
      1
    );
    sugarMapleRight.position.set(7.4, 0, -2.4);
    plantingLayer.add(sugarMapleRight);

    const sugarMapleBack = createSpecimenTree(
      barkMat,
      mapleGreenMat,
      mapleLightMat,
      1.5,
      3
    );
    sugarMapleBack.position.set(-7.2, 0, -4.6);
    plantingLayer.add(sugarMapleBack);

    const japaneseMaple = createSpecimenTree(
      barkMat,
      japaneseMapleMat,
      japaneseMapleMat,
      0.86,
      5
    );
    japaneseMaple.position.set(-6.5, 0, 0.2);
    plantingLayer.add(japaneseMaple);

    // InstancedMesh 1: Sculpted Boxwood Hedges & Ornamental Shrubs (38 instances)
    const shrubGeo = new THREE.IcosahedronGeometry(0.42, 1);
    const shrubMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.86,
      metalness: 0.02,
    });
    const shrubCoords: Array<[number, number, number, number]> = [
      // Along front retaining wall
      [-4.2, 0.35, 4.9, 1.05],
      [-3.3, 0.35, 4.9, 0.95],
      [-2.4, 0.35, 4.9, 1.0],
      [-1.5, 0.35, 4.9, 0.92],
      [-0.6, 0.35, 4.9, 1.02],
      [2.1, 0.35, 4.9, 1.0],
      [3.0, 0.35, 4.9, 0.94],
      [3.9, 0.35, 4.9, 1.08],
      [4.8, 0.35, 4.9, 0.96],
      // Along east retaining wall
      [6.55, 0.35, 3.6, 1.05],
      [6.55, 0.35, 2.5, 0.98],
      [6.55, 0.35, 1.4, 1.1],
      [6.55, 0.35, 0.3, 0.96],
      [6.55, 0.35, -0.8, 1.04],
      [6.55, 0.35, -1.9, 1.0],
      // Around waterfall & woodland edge
      [-7.1, 0.35, 2.4, 1.15],
      [-6.8, 0.35, 3.4, 1.02],
      [-5.9, 0.35, 4.1, 0.94],
      [-3.7, 0.35, 0.2, 0.88],
      [-3.4, 0.35, -1.3, 0.95],
      [-4.2, 0.35, -2.4, 1.12],
      [-5.4, 0.35, -2.8, 1.08],
      // Foundation beds along residence
      [-4.4, 0.38, -3.7, 1.05],
      [-3.4, 0.38, -3.7, 0.96],
      [4.1, 0.38, -3.7, 1.04],
      [5.1, 0.38, -3.7, 0.98],
      [6.0, 0.38, -3.5, 1.12],
    ];
    const shrubInstanced = new THREE.InstancedMesh(
      shrubGeo,
      shrubMat,
      shrubCoords.length
    );
    shrubInstanced.castShadow = !isSoftwareGl;
    shrubInstanced.receiveShadow = true;
    const shrubTints = [0x2f5e2c, 0x3b6e32, 0x487d39, 0x2a5428];
    shrubCoords.forEach(([x, y, z, s], idx) => {
      _dummy.position.set(x, y, z);
      _dummy.scale.set(s * 1.15, s * 0.82, s * 1.1);
      _dummy.rotation.set(0, idx * 0.7, 0);
      _dummy.updateMatrix();
      shrubInstanced.setMatrixAt(idx, _dummy.matrix);
      _color.setHex(shrubTints[idx % shrubTints.length]);
      shrubInstanced.setColorAt(idx, _color);
    });
    shrubInstanced.instanceMatrix.needsUpdate = true;
    if (shrubInstanced.instanceColor) shrubInstanced.instanceColor.needsUpdate = true;
    shrubInstanced.computeBoundingSphere();
    plantingLayer.add(shrubInstanced);

    // InstancedMesh 2: White Annabelle Hydrangea Blooms (24 instances)
    const bloomGeo = new THREE.DodecahedronGeometry(0.24, 1);
    const bloomMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.75,
      metalness: 0.0,
    });
    const bloomCoords: Array<[number, number, number]> = [
      [-3.8, 0.65, 4.7],
      [-2.8, 0.62, 4.75],
      [-1.9, 0.66, 4.72],
      [-1.0, 0.64, 4.75],
      [2.5, 0.65, 4.75],
      [3.5, 0.68, 4.72],
      [4.4, 0.62, 4.78],
      [6.4, 0.66, 3.0],
      [6.4, 0.64, 1.9],
      [6.4, 0.68, 0.8],
      [6.4, 0.62, -0.3],
      [-3.5, 0.64, -3.55],
      [-2.6, 0.62, -3.55],
      [4.5, 0.65, -3.55],
      [5.4, 0.62, -3.55],
      [-6.5, 0.58, 2.8],
      [-5.6, 0.56, 3.6],
      [-3.5, 0.58, -0.5],
      [-4.1, 0.62, -1.9],
      [5.8, 0.6, 4.3],
      [-4.6, 0.58, 4.6],
      [1.8, 0.6, 4.8],
      [6.35, 0.6, -1.4],
      [-5.2, 0.58, -2.5],
    ];
    const bloomInstanced = new THREE.InstancedMesh(
      bloomGeo,
      bloomMat,
      bloomCoords.length
    );
    const bloomTints = [0xf6f8f1, 0xe8f0e2, 0xfdfcf7, 0xdce6d9];
    bloomCoords.forEach(([x, y, z], idx) => {
      const sc = 0.85 + ((idx * 17) % 30) / 100;
      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(sc);
      _dummy.rotation.set(idx * 0.4, idx * 0.9, 0);
      _dummy.updateMatrix();
      bloomInstanced.setMatrixAt(idx, _dummy.matrix);
      _color.setHex(bloomTints[idx % bloomTints.length]);
      bloomInstanced.setColorAt(idx, _color);
    });
    bloomInstanced.instanceMatrix.needsUpdate = true;
    if (bloomInstanced.instanceColor) bloomInstanced.instanceColor.needsUpdate = true;
    bloomInstanced.computeBoundingSphere();
    plantingLayer.add(bloomInstanced);

    // InstancedMesh 3: Perimeter Emerald Cedar Privacy Grove (26 instances bounding outdoor horizon)
    const cedarConeGeo = new THREE.ConeGeometry(0.95, 4.8, 7);
    cedarConeGeo.translate(0, 2.4, 0);
    const cedarFoliageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.88,
      metalness: 0.02,
    });
    const groveCoords: Array<[number, number, number]> = [];
    for (let i = 0; i < 26; i++) {
      const angle = Math.PI * 0.82 + (i / 25) * Math.PI * 1.36;
      const radius = 12.2 + ((i * 7) % 5) * 0.95;
      const gx = Math.cos(angle) * radius;
      const gz = Math.sin(angle) * radius - 1.5;
      groveCoords.push([gx, 0, gz]);
    }
    const groveInstanced = new THREE.InstancedMesh(
      cedarConeGeo,
      cedarFoliageMat,
      groveCoords.length
    );
    groveInstanced.castShadow = !isSoftwareGl;
    groveInstanced.receiveShadow = true;
    const groveTints = [0x244a2a, 0x2d5830, 0x1f4025, 0x346133];
    groveCoords.forEach(([x, y, z], idx) => {
      const sc = 0.85 + ((idx * 13) % 30) / 100;
      _dummy.position.set(x, y, z);
      _dummy.scale.set(sc, sc * (0.95 + (idx % 3) * 0.14), sc);
      _dummy.rotation.set(0, idx * 1.1, 0);
      _dummy.updateMatrix();
      groveInstanced.setMatrixAt(idx, _dummy.matrix);
      _color.setHex(groveTints[idx % groveTints.length]);
      groveInstanced.setColorAt(idx, _color);
    });
    groveInstanced.instanceMatrix.needsUpdate = true;
    if (groveInstanced.instanceColor) groveInstanced.instanceColor.needsUpdate = true;
    groveInstanced.computeBoundingSphere();
    plantingLayer.add(groveInstanced);

    scene.add(plantingLayer);

    // Pre-warm shaders once on hardware GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // --- Smooth Stage & Lighting Animation State ---
    let constructionProgress = stateRef.current.stage === 'design' ? 0 : 1;
    let plantingProgress = stateRef.current.stage === 'planting' ? 1 : 0;
    let designOpacity = stateRef.current.stage === 'design' ? 1 : 0.12;

    const currentSky = new THREE.Color(initialLight.sky);
    const targetSky = new THREE.Color(initialLight.sky);
    const currentSunColor = new THREE.Color(initialLight.sunColor);
    const targetSunColor = new THREE.Color(initialLight.sunColor);
    const currentHemiSky = new THREE.Color(initialLight.hemiSky);
    const targetHemiSky = new THREE.Color(initialLight.hemiSky);
    const currentSunPos = new THREE.Vector3(...initialLight.sunPos);
    const targetSunPos = new THREE.Vector3(...initialLight.sunPos);

    // --- On-Demand Coalesced Render Loop with Software-WebGL afterDraw Guard ---
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepAndRender() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      let stillSettling = false;

      // 1. Stage Layer Exponential Damping
      const targetConstruction = stateRef.current.stage === 'design' ? 0 : 1;
      const targetPlanting = stateRef.current.stage === 'planting' ? 1 : 0;
      const targetDesignOpacity = stateRef.current.stage === 'design' ? 1 : 0.0;

      constructionProgress = THREE.MathUtils.damp(
        constructionProgress,
        targetConstruction,
        6.5,
        dt
      );
      plantingProgress = THREE.MathUtils.damp(plantingProgress, targetPlanting, 6.0, dt);
      designOpacity = THREE.MathUtils.damp(designOpacity, targetDesignOpacity, 6.5, dt);

      if (
        Math.abs(constructionProgress - targetConstruction) > 0.004 ||
        Math.abs(plantingProgress - targetPlanting) > 0.004 ||
        Math.abs(designOpacity - targetDesignOpacity) > 0.004
      ) {
        stillSettling = true;
      }

      constructionLayer.visible = constructionProgress > 0.015;
      constructionLayer.scale.y = Math.max(0.01, constructionProgress);
      constructionLayer.position.y = (1 - constructionProgress) * -0.45;

      plantingLayer.visible = plantingProgress > 0.015;
      plantingLayer.scale.setScalar(Math.max(0.01, plantingProgress));
      plantingLayer.position.y = (1 - plantingProgress) * -0.25;

      designLayer.visible = designOpacity > 0.015;
      zoneMaterial.opacity = designOpacity * 0.9;
      gridMats.forEach((m) => {
        m.opacity = designOpacity * 0.55;
      });
      (wirePergola.material as THREE.LineBasicMaterial).opacity = designOpacity * 0.8;

      // 2. Lighting Mood Damping
      const lp = LIGHTING_PRESETS[stateRef.current.timeOfDay];
      targetSky.setHex(lp.sky);
      targetSunColor.setHex(lp.sunColor);
      targetHemiSky.setHex(lp.hemiSky);
      targetSunPos.set(...lp.sunPos);

      const lerpAlpha = 1 - Math.exp(-5.5 * dt);
      currentSky.lerp(targetSky, lerpAlpha);
      currentSunColor.lerp(targetSunColor, lerpAlpha);
      currentHemiSky.lerp(targetHemiSky, lerpAlpha);
      currentSunPos.lerp(targetSunPos, lerpAlpha);

      (scene.background as THREE.Color).copy(currentSky);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(currentSky);
        scene.fog.density = THREE.MathUtils.damp(scene.fog.density, lp.fogDensity, 5.5, dt);
      }

      sunLight.color.copy(currentSunColor);
      sunLight.position.copy(currentSunPos);
      sunLight.intensity = THREE.MathUtils.damp(sunLight.intensity, lp.sunIntensity, 5.5, dt);
      hemiLight.color.copy(currentHemiSky);
      hemiLight.intensity = THREE.MathUtils.damp(hemiLight.intensity, lp.hemiIntensity, 5.5, dt);
      renderer.toneMappingExposure = THREE.MathUtils.damp(
        renderer.toneMappingExposure,
        lp.exposure,
        5.5,
        dt
      );
      fireLight.intensity = THREE.MathUtils.damp(fireLight.intensity, lp.lampIntensity, 5.5, dt);
      pergolaLight.intensity = THREE.MathUtils.damp(
        pergolaLight.intensity,
        lp.lampIntensity * 0.75,
        5.5,
        dt
      );
      windowGlassMat.emissiveIntensity = THREE.MathUtils.damp(
        windowGlassMat.emissiveIntensity,
        lp.windowEmissive,
        5.5,
        dt
      );

      if (
        Math.abs(sunLight.intensity - lp.sunIntensity) > 0.015 ||
        Math.abs(fireLight.intensity - lp.lampIntensity) > 0.02
      ) {
        stillSettling = true;
      }

      // 3. Camera Preset Exponential Damping
      if (stateRef.current.cameraAnimating) {
        const camAlpha = 1 - Math.exp(-6.5 * dt);
        camera.position.lerp(_camGoalPos, camAlpha);
        controls.target.lerp(_camGoalTarget, camAlpha);
        if (
          camera.position.distanceTo(_camGoalPos) < 0.04 &&
          controls.target.distanceTo(_camGoalTarget) < 0.04
        ) {
          camera.position.copy(_camGoalPos);
          controls.target.copy(_camGoalTarget);
          stateRef.current.cameraAnimating = false;
        } else {
          stillSettling = true;
        }
      }

      const controlsChanged = controls.update();
      if (controlsChanged && !isSoftwareGl) {
        stillSettling = true;
      }

      renderer.render(scene, camera);

      const finish = () => {
        renderBusy = false;
        if (renderDirty || stillSettling) {
          renderDirty = false;
          requestRender();
        }
      };

      if (isSoftwareGl) {
        afterDraw(finish);
      } else {
        finish();
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      lastTime = performance.now();
      frameId = requestAnimationFrame(stepAndRender);
    }

    stateRef.current.triggerRender = requestRender;
    controls.addEventListener('change', requestRender);

    // ResizeObserver keeps viewport sharp on expand/collapse & responsive layout changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(1, Math.floor(entry.contentRect.width));
        const h = Math.max(1, Math.floor(entry.contentRect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(mount);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      envTarget.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      flagstoneTex.map.dispose();
      flagstoneTex.bumpMap.dispose();
      stackedStoneTex.map.dispose();
      stackedStoneTex.bumpMap.dispose();
      lawnMap.dispose();
      cedarMap.dispose();
      shadowMapTex.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        isExpanded
          ? 'fixed inset-0 z-[65] bg-[#121D39] w-screen h-screen'
          : 'relative w-full h-[500px] sm:h-[580px] lg:h-[640px] bg-[#121D39] overflow-hidden border border-[#192647]/15'
      }
    >
      {/* Isolated WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        aria-label="Interactive 3D architectural landscape studio showing Walter's Design, Construction, and Planting stages"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top-Left Minimal Spec Header (No Backdrop Filter over WebGL, No Pulsing Dots) */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-3">
        <div className="bg-[#121D39]/92 border border-white/15 px-3.5 py-2 text-white">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#00C52B]">
            Interactive 3D Concept Studio
          </p>
          <p className="text-xs text-white/80 mt-0.5">
            Drag to orbit · Scroll to zoom · Switch stages below
          </p>
        </div>
      </div>

      {/* Top-Right Expand / Reset Action Buttons */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => selectCameraPreset('overview')}
          aria-label="Reset 3D camera view"
          className="inline-flex items-center justify-center w-10 h-10 bg-[#121D39]/92 hover:bg-[#192647] border border-white/15 text-white hover:text-[#00C52B] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? 'Exit full viewport 3D view' : 'Expand 3D view to full screen'}
          className="inline-flex items-center justify-center w-10 h-10 bg-[#121D39]/92 hover:bg-[#192647] border border-white/15 text-white hover:text-[#00C52B] transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Zero Viewport Center Occlusion, Solid RGBA Surface) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(920px,94%)] flex flex-col items-center pointer-events-none">
        <button
          type="button"
          onClick={() => setControlsCollapsed((prev) => !prev)}
          aria-expanded={!controlsCollapsed}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#121D39]/95 border border-white/15 border-b-0 text-[11px] font-medium tracking-[0.12em] uppercase text-white/85 hover:text-[#00C52B] transition-colors cursor-pointer whitespace-nowrap"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div className="pointer-events-auto w-full bg-[#121D39]/95 border border-white/15 px-3.5 py-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
            {/* Stage Switcher */}
            <div className="flex items-center gap-1 bg-white/5 p-1">
              {(
                [
                  { id: 'design', label: '01 Design' },
                  { id: 'construction', label: '02 Construction' },
                  { id: 'planting', label: '03 Planting & Care' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onStageChange(item.id)}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    activeStage === item.id
                      ? 'bg-[#00C52B] text-[#121D39] font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Camera Views */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1">
              {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => selectCameraPreset(preset)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    cameraPreset === preset
                      ? 'bg-white text-[#121D39] font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {CAMERA_PRESETS[preset].label}
                </button>
              ))}
            </div>

            {/* Time of Day Lighting */}
            <div className="flex items-center gap-1 bg-white/5 p-1">
              {(Object.keys(LIGHTING_PRESETS) as TimeOfDay[]).map((tod) => (
                <button
                  key={tod}
                  type="button"
                  onClick={() => setTimeOfDay(tod)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    timeOfDay === tod
                      ? 'bg-[#24345F] text-[#00C52B] border border-[#00C52B]/50 font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {LIGHTING_PRESETS[tod].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
