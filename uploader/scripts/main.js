/*
 * Ethan Hammond
 * 10/4/2016
 * Load CAD Files with file selection.
 * TODO: Add Loading gif
 */

"use strict";

var object, objectHasValue;

function loadInterface() {
    $(".viewer").hide();
    $(".homeScreen").show();
}

function awaitButtonClicks() {
    $(".heatsink").click( function() {
        object = "Heatsink";
        objectHasValue = true;
        $(".viewer").show();
        $(".footer").show();
        $(".homeScreen").hide();
        init();
    });

    $(".gfxcard").click( function() {
        object = "gfxcard";
        objectHasValue = true;
        $(".viewer").show();
        $(".footer").show();
        $(".homeScreen").hide();
        init();
    });

    $(".v10head").click(function() {
        object = "v10head";
        objectHasValue = true;
        $(".viewer").show();
        $(".footer").show();
        $(".homeScreen").hide();
        init();
    });
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

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;

    //Set ground plane size and color
    var planeGeometry = new THREE.PlaneGeometry(0,0,0,0);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    //Position the plane and add it to the scene
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = false;
    scene.add(plane);

    //Set camera position and orientation
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    //Create pointlight aimed at objects and add to scene
    var topLight = new THREE.PointLight(0xffffff);
    topLight.position.set( 40, -60, -20);
    scene.add(topLight);

    //Create pointlight aimed at objects and add to scene
    var bottomLight = new THREE.PointLight(0xffffff);
    bottomLight.position.set(40, 60, 20);
    scene.add(bottomLight);

    window.addEventListener( 'resize', onWindowResize, false );

    //Add coordinate axis
    /*var axes = new THREE.AxisHelper( 100 );
     scene.add(axes);*/

    //Load STL file from fixed location
    var loader = new THREE.STLLoader();
    loader.addEventListener('load', function (event){
        var geometry = event.content;
        var material = new THREE.MeshLambertMaterial({color: 0xD3D3D3});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        scene.add(mesh);
    });

    // STL file to be loaded
    loader.load("./assets/"+object+".stl");

    //Place output of renderer in HTML
    $("#WebGL-output").append(renderer.domElement);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    //Prep for animations
    animate();

    function animate() {
        requestAnimationFrame( animate );
        controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        stats.update();
        render();
    }

    function render() {
        renderer.render( scene, camera );
        requestAnimationFrame(render);

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
    loadInterface();
    awaitButtonClicks();
};

