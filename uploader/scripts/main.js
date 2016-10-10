/*
 * Ethan Hammond
 * 10/4/2016
 * First Three.js project, create scene with cube and sphere, basic animations and UI
 * TODO: Create PLY Loader
 */

"use strict";

var object;

function loadInterface() {
    $(".viewer").hide();
    $(".homeScreen").show();
}

$("#showViewer").click( function() {
    $(".viewer").show();
    $(".footer").show();
    $(".homeScreen").hide();
    animate();
});

$("#hideViewer").click( function() {
    $(".viewer").hide();
    $(".homeScreen").show();
});

function setHeatsink() {
    object = "Heatsink";
    init();
}

function setGfxCard() {
    object = "gfxcard";
    init();
}

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
    orbitControls.addEventListener( 'change', renderScene );

    //Set ground plane size and color
    var planeGeometry = new THREE.PlaneGeometry(0,0,0,0);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    //Position the plane and add it to the scene
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    //Set camera position and orientation
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    //Create spotlight aimed at objects and add to scene
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set( 40, 60, -10);
    scene.add(pointLight);

    //Add coordinate axis
    /*var axes = new THREE.AxisHelper( 100 );
     scene.add(axes);*/

    //Load STL file from fixed location
    var loader = new THREE.STLLoader();
    loader.addEventListener('load', function (event){
        var geometry = event.content;
        var material = new THREE.MeshLambertMaterial({ ambient: 0xFBB917,color: 0xD3D3D3 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        mesh.rotation.z = Math.PI / 2;
        scene.add(mesh);
    });

    // STL file to be loaded
    loader.load("./assets/"+object+".stl");

    //Place output of renderer in HTML
    $("#WebGL-output").append(renderer.domElement);

    //Prep for animations
    renderScene();

    function renderScene() {
        //Update FPS or render-time counter
        stats.update();

        requestAnimationFrame(renderScene);

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

function animate() {
    requestAnimationFrame( animate );
}

window.onload = function() {
    loadInterface();
};

