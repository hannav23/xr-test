let scene, camera, renderer;

function initScene() {
  // Create scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Add a cube
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

async function startXR() {
  if (!navigator.xr) {
    console.error("WebXR not supported in this browser.");
    return;
  }

  // Try AR first
  const arSupported = await navigator.xr.isSessionSupported("immersive-ar");
  if (arSupported) {
    console.log("Starting AR session...");
    await activateXR("immersive-ar", { requiredFeatures: ["hit-test"] });
    return;
  }

  // Fallback to VR
  const vrSupported = await navigator.xr.isSessionSupported("immersive-vr");
  if (vrSupported) {
    console.log("Starting VR session...");
    await activateXR("immersive-vr");
    return;
  }

  console.warn("Neither AR nor VR is supported on this device.");
}

async function activateXR(mode, options = {}) {
  const xrSession = await navigator.xr.requestSession(mode, options);
  const gl = renderer.getContext("webgl", { xrCompatible: true });
  await gl.makeXRCompatible();
  renderer.xr.setSession(xrSession);
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

// Initialize
initScene();
animate();
