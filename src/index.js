import { SceneInit } from "./SceneInit";
import {
  Mesh,
  MeshNormalMaterial,
  PlaneGeometry,
  ShaderMaterial,
  VideoTexture,
} from "three";

import { vertexShader, fragmentShader } from "./Shaders.js";

const Analyse = function (propAudio) {
  this.audio = new Audio();
  const context = new AudioContext();
  const source = context.createMediaElementSource(propAudio || this.audio);
  this.analyser = context.createAnalyser();
  source.connect(this.analyser);
  this.analyser.connect(context.destination);
  this.analyser.fftSize = 1024;
  this.bands = new Uint8Array(this.analyser.frequencyBinCount);
  this.context = context;
  return this;
};

const video = document.createElement("video");
video.width = 1200;
video.height = 1200;
video.src = "assets/satisfaction.mp4";

const texture = new VideoTexture(video);

const elem = new Analyse(video);

let uAmplitude = 8.0;

u_amplitude.addEventListener("change", (e) => {
  console.log(e.target.value);
  uAmplitude = (+e.target.value).toFixed(2);
});

const uniforms = {
  u_time: {
    type: "f",
    value: 1.0,
  },
  u_amplitude: {
    type: "f",
    value: uAmplitude,
  },
  u_data_arr: {
    type: "float[64]",
    value: elem.bands,
  },
  map: {
    type: "sampler2D",
    value: texture,
  },
};
let playFlag = false;

const render = (time) => {
  elem.analyser.getByteFrequencyData(elem.bands);
  uniforms.u_time.value = time;
  uniforms.map.value = texture;
  uniforms.u_amplitude.value = uAmplitude;
  uniforms.u_data_arr.value = elem.bands;
  if (playFlag) {
    requestAnimationFrame(render);
  }
};

const test = new SceneInit("myThreeJsCanvas");
test.animate();

const planeGeometry = new PlaneGeometry(100, 100, 100, 100);
const planeMaterial = new MeshNormalMaterial({ wireframe: true });
const planeCustomMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
  wireframe: true,
});
const planeMesh = new Mesh(planeGeometry, planeCustomMaterial);
planeMesh.rotation.z = -Math.PI / 2 - 0.1;
planeMesh.rotation.y = -1;
planeMesh.rotation.x = -Math.PI / 2;

test.add(planeMesh);

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.querySelector("#play");
  playBtn.addEventListener("click", () => {
    if (elem.context.state === "suspended") {
      elem.context.resume();
    }
    video.play();
    playFlag = true;
    render();
  });

  const pauseBtn = document.querySelector("#pause");
  pauseBtn.addEventListener("click", () => {
    video.pause();
    playFlag = false;
  });
});

let currentTime = 30;
video.addEventListener("play", function () {
  this.currentTime = currentTime;
});

destinationCalabria.addEventListener("click", () => {
  currentTime = 0;
  video.src = "assets/destinationCalabria.mp4";
  video.play();
  playFlag = true;
  render();
});

satisfaction.addEventListener("click", () => {
  currentTime = 30;
  video.src = "assets/satisfaction.mp4";
  video.play();
  playFlag = true;
  render();
});
