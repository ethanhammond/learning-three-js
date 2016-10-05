/*
 * Ethan Hammond
 * 10/4/2016
 * Second Three.js project, dynamically add elements to screen with UI
 * TODO:
 */

"use strict";
function init() {

     var stats = initStats();

    //Create a new scene
	 var scene = new THREE.Scene();

    //Set camera position
	 var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    //Set camera position and orientation
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    //Create renderer and set size
	 var renderer = new THREE.WebGLRenderer();
	 renderer.setClearColor(0xffffff);
	 renderer.setSize(window.innerWidth, window.innerHeight);
	 renderer.shadowMapEnabled = true;

    //Add coordinate axis
	 var axes = new THREE.AxisHelper( 20 );
	 scene.add(axes);

    //Set ground plane size and color
	 var planeGeometry = new THREE.PlaneGeometry(60,60,1,1);
	 var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

    //Position the plane and add it to the scene
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    //Create ambientLight in general area
     var ambientLight = new THREE.AmbientLight( 0x0c0c0c0c);
     scene.add(ambientLight);

    //Create spotlight aimed at objects and add to scene
	 var spotLight = new THREE.SpotLight( 0xffffff);
	 spotLight.position.set( -40, 60, -10);
	 scene.add(spotLight);

    //Allow shadows to be rendered by the spotlight
	 spotLight.castShadow = true;

    //Place output of renderer in HTML
    $("#WebGL-output").append(renderer.domElement);

    //Set change in animation speed per tick of UI element
    var controls = new function() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function () {

            var cubeSize = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;


            // position the cube randomly in the scene

            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function () {
            console.log(scene.children);
        }
    };

    //Create UI elements for each animation variable
     var gui = new dat.GUI();
     gui.add(controls, 'rotationSpeed', 0, 0.5);
     gui.add(controls, 'addCube');
     gui.add(controls, 'removeCube');
     gui.add(controls, 'outputObjects');
     gui.add(controls, 'numberOfObjects').listen();

    //Prep for animations
    renderScene();

    function renderScene() {
        stats.update();

        // rotate the cubes around its axes
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {

                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
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
}


