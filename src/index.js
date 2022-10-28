import { SceneInit } from "./SceneInit";
import { Mesh, MeshNormalMaterial, PlaneGeometry, ShaderMaterial } from "three";

import { vertexShader, fragmentShader } from "./Shaders.js";

const test = new SceneInit("myThreeJsCanvas");
// test.initScene();
test.animate();

const Analyse = function () {
  var an = this;

  //Создание источника
  this.audio = new Audio();
  this.audio.src = "./assets/Lyudvig_van_Betkhoven.mp3";
  this.controls = true;
  //Создаем аудио-контекст
  this.context = new AudioContext();
  this.node = this.context.createScriptProcessor(2048, 1, 1);
  //Создаем анализатор
  this.analyser = this.context.createAnalyser();
  // this.analyser.smoothingTimeConstant = 0.3;
  this.analyser.fftSize = 512;
  this.bands = new Uint8Array(this.analyser.frequencyBinCount);
  //Подписываемся на событие
  this.audio.addEventListener("canplay", function () {
    //отправляем на обработку в  AudioContext
    an.source = an.context.createMediaElementSource(an.audio);
    //связываем источник и анализатором
    an.source.connect(an.analyser);
    //связываем анализатор с интерфейсом, из которого он будет получать данные
    an.analyser.connect(an.node);
    //Связываем все с выходом
    an.node.connect(an.context.destination);
    an.source.connect(an.context.destination);
    //подписываемся на событие изменения входных данных
    an.node.onaudioprocess = function () {
      an.analyser.getByteFrequencyData(an.bands);
      if (!an.audio.paused) {
        if (typeof an.update === "function") {
          return an.update(an.bands);
        } else {
          return 0;
        }
      }
    };
  });

  return this;
};

const elem = new Analyse();

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
    value: elem.bands,
  },

  // u_black: { type: "vec3", value: new THREE.Color(0x000000) },
  // u_white: { type: "vec3", value: new THREE.Color(0xffffff) },
};
const render = (time) => {
  // console.log(dataArray);
  elem.analyser.getByteFrequencyData(elem.bands);
  uniforms.u_time.value = time;
  uniforms.u_data_arr.value = elem.bands;
  requestAnimationFrame(render);
};

render();
const planeGeometry = new PlaneGeometry(64, 64, 64, 64);
const planeMaterial = new MeshNormalMaterial({ wireframe: true });
const planeCustomMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
  // wireframe: true,
});
const planeMesh = new Mesh(planeGeometry, planeCustomMaterial);
planeMesh.rotation.x = -Math.PI + Math.PI / 6;
// planeMesh.scale.x = 2;

test.add(planeMesh);

const play = document.querySelector(".play");
play.addEventListener("click", () => {
  elem.audio.play();
  // [...document.querySelectorAll(".audio")].forEach((item) => item.play());
});
