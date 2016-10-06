/*
 * Ethan Hammond
 * 10/4/2016
 * First Three.js project, create scene with cube and sphere, basic animations and UI
 * TODO:
 */

"use strict";
function init() {

  var stats = initStats();

  //Create a new scene
  var scene = new THREE.Scene();

  //Set camera position
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  //Create renderer and set size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColorHex(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  var orbitControls = new THREE.OrbitControls(camera);
  //orbitControls.addEventListener( 'change', renderScene );

  //Add coordinate axis
  var axes = new THREE.AxisHelper( 20 );
  scene.add(axes);

  //Set change in animation speed per tick of UI element
  var controls = new function() {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.growthRate = 0.01;
  };
  //Create UI elements for each animation variable
  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed',0,0.5);
  gui.add(controls, 'bouncingSpeed',0,0.5);
  gui.add(controls, 'growthRate', 0.001, 0.5);

  //Set ground plane size and color
  var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
  var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

  //Position the plane and add it to the scene
  var plane = new THREE.Mesh(planeGeometry,planeMaterial);
  plane.rotation.x=-0.5*Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  plane.receiveShadow = true;
  scene.add(plane);

  //Create cube
  var cubeSize = 4;
  var cubeGeometry = new THREE.CubeGeometry(cubeSize,cubeSize, cubeSize);
  var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x777fff});
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  //Position the cube
  cube.position.x = -3;
  cube.position.y = 3;
  cube.position.z = 0;

  //Set cube to cast shadow and add to scene
  cube.castShadow = true;
  scene.add(cube);

  //Create sphere
  var sphereGeometry = new THREE.SphereGeometry(4,20,20);
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
  var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

  //Position the sphere
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;

  //Set sphere to cast shadow and add to scene
  sphere.castShadow = true;
  scene.add(sphere);

  //Set camera position and orientation
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  //Create spotlight aimed at objects and add to scene
  var spotLight = new THREE.SpotLight( 0xffffff);
  spotLight.position.set( -40, 60, -10);
  scene.add(spotLight);

  //Allow shadows to be rendered by the spotlight
  spotLight.castShadow = true;

  //Place output of renderer in HTML
  $("#WebGL-output").append(renderer.domElement);

  //Prep for animations
  var step = 0;
  var growDirection = 1;
  var maxCubeSize = 7;
  var minCubeSize = 1;
  var previousTime = 0;

  renderScene();

  function renderScene() {
    //Update FPS or render-time counter
    stats.update();

    requestAnimationFrame(renderScene);

    //Rotate the cube, speed set by UI
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    //Change the Size of the cube
    growDirection = cubeSize >= maxCubeSize ? -1 : growDirection;
    growDirection = cubeSize <= minCubeSize ? 1 : growDirection;
    cubeSize += growDirection * controls.growthRate;
    cube.scale.x = cubeSize;
    cube.scale.y = cubeSize;
    cube.scale.z = cubeSize;
    //console.log(controls.rotationSpeed);

    //Bounce the sphere, speed set by UI
    step+=controls.bouncingSpeed;
    sphere.position.x = 20+( 10*(Math.cos(step)));
    sphere.position.y = 2 +( 10*Math.abs(Math.sin(step)));

    //orbitControls.update();
    //Render the animation
    renderer.render(scene, camera);
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    $("#Stats-output").append( stats.domElement );
    return stats;
  }
}

window.onload = function() {
  init();
};

