let scene, camera, renderer, cube;

function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, -0.5); // half a meter in front
  scene.add(cube);
}

async function startXR() {
  const xrSession = await navigator.xr.requestSession("immersive-ar", { requiredFeatures: ["local-floor"] });
  const gl = renderer.getContext("webgl", { xrCompatible: true });
  await gl.makeXRCompatible();
  renderer.xr.setSession(xrSession);
}

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

initScene();
animate();
