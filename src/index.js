import { SceneInit } from "./SceneInit";
import { Mesh, MeshNormalMaterial, PlaneGeometry, ShaderMaterial } from "three";

import { vertexShader, fragmentShader } from "./Shaders.js";

const test = new SceneInit("myThreeJsCanvas");
// test.initScene();
test.animate();

// function setupAudioContext() {
const audioContext = new window.AudioContext();
const audioElement = document.getElementById("myAudio");
const source = audioContext.createMediaElementSource(audioElement);
const analyser = audioContext.createAnalyser();
source.connect(analyser);
analyser.fftSize = 1024;
const dataArray = new Uint8Array(analyser.frequencyBinCount);
// }

const uniforms = {
  u_time: {
    type: "f",
    value: 1.0,
  },
  u_amplitude: {
    type: "f",
    value: 3.0,
  },
  u_data_arr: {
    type: "float[64]",
    value: dataArray,
  },

  // u_black: { type: "vec3", value: new THREE.Color(0x000000) },
  // u_white: { type: "vec3", value: new THREE.Color(0xffffff) },
};
const render = (time) => {
  // console.log(dataArray);
  analyser.getByteFrequencyData(dataArray);
  uniforms.u_time.value = time;
  uniforms.u_data_arr.value = dataArray;
  requestAnimationFrame(render);
};

render();
const planeGeometry = new PlaneGeometry(64, 64, 64, 64);
const planeMaterial = new MeshNormalMaterial({ wireframe: true });
const planeCustomMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
  wireframe: true,
});
const planeMesh = new Mesh(planeGeometry, planeCustomMaterial);
planeMesh.rotation.x = -Math.PI + Math.PI / 6;
// planeMesh.scale.x = 2;

test.add(planeMesh);

const play = document.querySelector(".play");
play.addEventListener("click", () => {
  [...document.querySelectorAll(".audio")].forEach((item) => item.play());
});
