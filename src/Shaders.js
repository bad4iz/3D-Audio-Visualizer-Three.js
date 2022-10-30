const vertexShader = () => {
  return `
      varying float x;
      varying float y;
      varying float z;
      uniform float width;
       uniform float height;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_amplitude;
      uniform float[64] u_data_arr;
     
    
      void main() {
        vUv = vec2( position.x /100.0, position.y /100.0);
        x = abs(position.x);
	      y = abs(position.y);
        float floor_x = round(x);
	      float floor_y = round(y);
        float x_multiplier = (32.0 - x) / 8.0;
        float y_multiplier = (32.0 - y) / 8.0;
        z = sin(u_data_arr[int(floor_x)] / 50.0 + u_data_arr[int(floor_y)] / 50.0) * u_amplitude;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
      }
    `;
};

const fragmentShader = () => {
  return `
    varying float x;
    varying float y;
    varying float z;
    varying vec2 vUv;
    uniform float u_time;
    uniform vec3 u_black;
    uniform vec3 u_white;
   
    uniform sampler2D map;
    void main() {
      vec4 color = texture2D( map, vUv+0.5);
      gl_FragColor = vec4( color.r, color.g, color.b, 1 );
    }
  `;
};

export { vertexShader, fragmentShader };
