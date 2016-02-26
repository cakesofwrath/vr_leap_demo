// https://developer.leapmotion.com/gallery/vr-quickstart
// https://gist.github.com/pehrlich/75f26a54a2f4a46cbb0c
// https://github.com/leapmotion-examples/javascript/tree/master/v2

// Including this in the footer so that the bone hand plugin can create its canvas on the body

//
// CREATE THE SCENE
//
//

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

var canvas = document.getElementById("scene");
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);

onResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onResize, false);



var geometry = new THREE.BoxGeometry(2, 2, 2);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00})
var cube = new THREE.Mesh(geometry, material);
cube.position.set(-5, 0, 0);
scene.add(cube);

// camera.position.z = 5;
// Connect to localhost and start getting frames
Leap.loop();

// Docs: http://leapmotion.github.io/leapjs-plugins/main/transform/
Leap.loopController.use('transform', {

  // This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
  vr: true,

  // This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
  // The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
  // (As the hands will usually interact with multiple objects in the scene.)
  effectiveParent: camera

});

// Docs: http://leapmotion.github.io/leapjs-plugins/main/bone-hand/
Leap.loopController.use('boneHand', {

  // If you already have a scene or want to create it yourself, you can pass it in here
  // Alternatively, you can pass it in whenever you want by doing
  // Leap.loopController.plugins.boneHand.scene = myScene.
  scene: scene,

  // targetEl: document.body,

  // Display the arm
  arm: true

});

Leap.loopController.use("pinchEvent");

Leap.loopController.loopWhileDisconnected = true;
//
// ADD VIRTUAL REALITY
//
//

var boneHand = Leap.loopController.plugins.boneHand;
    /*transform = Leap.loopController.plugins.transform,
    renderer = boneHand.renderer,
    scene = boneHand.scene,
    camera = boneHand.camera;*/
// console.log(boneHand);
// transform.effectiveParent = camera;

// Moves (translates and rotates) the camera
var vrControls = new THREE.VRControls(camera, function(message){
  console.log(message);
});

var vrEffect = new THREE.VREffect(renderer, function(message){
    console.log(message);
  });


var onkey = function(event) {
  if (event.key === 'z' || event.keyCode === 122) {
    console.log('z');
    vrControls.resetSensor();
  }
  if (event.key === 'f' || event.keyCode === 102) {
    console.log('f');
    return vrEffect.setFullScreen(true);
  }
};

window.addEventListener("dblclick", function(){
  // TODO: add a toggleFullScreen method to VREffect
  var isFullscreen = document.mozFullScreenElement || document.webkitFullscreenElement;
  vrEffect.setFullScreen(!isFullscreen);
});

window.addEventListener("keypress", onkey, true);

/*var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 20, 20),
    new THREE.MeshPhongMaterial({
        color: 0xe6e6e6,
        specular: 0xe6e6e6
    })
);
sphere.position.set(0, -0.1, -0.39);
// spheres.push(sphere);
scene.add(sphere);
sphere.visible = true;

sphere.lastPosition = sphere.position.clone();
sphere.pinched = false;
sphere.tmpPosition = new THREE.Vector3;*/

Leap.loopController.on("frame", function(frame) {
    var hand = frame.hands[0];

    if(!hand) return;
})/*.on("pinch", function(hand) {
    sphere.visible = true;
    sphere.pinched = true;
    hand.data("sphere", sphere);

    console.log("SPHERE PINCHED");
}).on("unpinch", function(hand) {
    var sphere = hand.data("sphere");
    console.log("SPHERE UNPINCHED");

    if(!sphere) return;

    sphere.pinched = false;
    hand.data("sphere", null);
}).on("frameEnd", function(f){
}).on("hand", function(hand) {
    var sphere = hand.data("sphere");

    if(!sphere) return;

    sphere.pinched = false;
    sphere.lastPosition = sphere.position.clone();
    sphere.position.fromArray(hand.palmPosition);;
});*/

var render = function() {
    /*if(!sphere.pinched) {
        var newPos = (new THREE.Vector3).subVectors(sphere.position, sphere.lastPosition);

        newPos.multiplyScalar(0.96);
        // newPos.y -= 0.0005;

        newPos.add(sphere.position);

        sphere.lastPosition = sphere.position.clone();
        sphere.position.copy(newPos);
    }*/

    vrControls.update();
    vrEffect.render(scene, camera);
    requestAnimationFrame(render);
}

render();

//
// MAKE IT GO
//
//

/*var render = function() {
  vrControls.update();
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  vrEffect.render(scene, camera);

  requestAnimationFrame(render);
};

render();*/


//
// Add a debug message Real quick
// Prints out when receiving oculus data.
//
//

var receivingPositionalData = false;
var receivingOrientationData = false;

var timerID = setInterval(function(){

  if (camera.position.x !== 0 && !receivingPositionalData){
    receivingPositionalData = true;
    console.log("receiving positional data");
  }

  if (camera.quaternion.x !== 0 && !receivingOrientationData){
    receivingOrientationData = true;
    console.log("receiving orientation data");
  }

  if (receivingOrientationData && receivingPositionalData){
    clearInterval(timerID);
  }

}, 2000);


