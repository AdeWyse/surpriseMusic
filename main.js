
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();



let mixers = [];

init();
animate();
function init() {

    const container = document.createElement('div');
    container.id = 'canvas-container';
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 300 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x9FC5E8 );
    scene.fog = new THREE.Fog( 0x9FC5E8, 200, 1000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 5 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
    dirLight.position.set( 0, 200, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x9FC5E8, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

  
    // model
 const loader = new FBXLoader();
    loader.load('public/dancingPai.fbx', function (object) {
        const mixer = new THREE.AnimationMixer(object); // Create a new mixer for this model
        const action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        mixers.push(mixer); // Add this mixer to the array
    });

    // Second model
    const loader2 = new FBXLoader();
    loader2.load('public/dancingEu.fbx', function (object) {
        // Position the second model relative to the first model
        object.position.set(100, 0, 0); // Adjust the position as needed
        // Add the second model to the scene
        const mixer = new THREE.AnimationMixer(object); // Create a new mixer for this model
        const action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        mixers.push(mixer); // Add this mixer to the array
    });

    // Third model
    const loader3 = new FBXLoader();
    loader3.load('public/dancingEu.fbx', function (object) {
        // Position the third model relative to the first model
        object.position.set(-100, 0, 0); // Adjust the position as needed
        // Add the third model to the scene
        const mixer = new THREE.AnimationMixer(object); // Create a new mixer for this model
        const action = mixer.clipAction(object.animations[0]);
        action.play();

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(object);

        mixers.push(mixer); // Add this mixer to the array
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

    // stats
    stats = new Stats();
    //container.appendChild( stats.dom );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update all the mixers
    for (const mixer of mixers) {
    if ( mixer ) mixer.update( delta );
}

    renderer.render(scene, camera);

    renderer.render( scene, camera );

}

