import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DoubleSide } from 'three';

/**
 * Scene
 */
const scene = new THREE.Scene()
const root = new THREE.Object3D()

/**
 * Cameras
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, 2, 1, 5000)
camera.position.set(0, (650 * Math.cos( 20 ) + 300), 1200)
  

 /**
 * Renderers
 */
const css3DContainer = document.querySelector('#css3d')
const css3DRenderer = new CSS3DRenderer();
css3DContainer.appendChild(css3DRenderer.domElement)
  
const webglCanvas = document.querySelector('#webgl')
const webglRenderer = new THREE.WebGLRenderer({
canvas: webglCanvas,
antialias: true,
alpha: true
})
webglRenderer.outputEncoding = THREE.sRGBEncoding
webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
webglRenderer.setClearColor('#FF856B')
 
/**
 * Controls
 */
 const controls = new OrbitControls(camera, css3DContainer)
 controls.enableDamping = true
 controls.rotateSpeed = 4
 controls.minPolarAngle = 0
 controls.maxPolarAngle = 1.2

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture, side: DoubleSide })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

/**
 * Helper functions
 */
// Video element function
function VideoElement( videoID, x, y, z ) {

    const obj = new THREE.Object3D

    const div = document.createElement( 'div' )
    div.setAttribute("class", "video_element")

    const iframe = document.createElement( 'iframe' )
    iframe.src = `https://www.youtube.com/embed/${videoID}?rel=0`
    div.appendChild( iframe )

    const object = new CSS3DObject( div )
    object.position.set( x, y, z )

    obj.css3dObject = object
    obj.add(object)

    // Invisible plane for clipping purposes
    let material = new THREE.MeshPhongMaterial({
        opacity	: 0.15,
        color	: new THREE.Color( 0x000000 ),
        blending: THREE.NoBlending
    })
    // dimensions are smaller than video with 2px on both X and Y axis in order to hide a little bit the white outline
    let geometry = new THREE.BoxGeometry( 478, 358, 1 )
    let mesh = new THREE.Mesh( geometry, material )
    mesh.position.set(x, y, z)
    obj.add( mesh );

    return obj
    // return object

}

// Window resize function
function onWindowResize() {
    const width = webglCanvas.clientWidth
    const height = webglCanvas.clientHeight
    
    if (webglCanvas.width !== width || webglCanvas.height !== height) {
        webglRenderer.setSize(width, height, false)
        css3DRenderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }
}
  
window.addEventListener('resize', onWindowResize, false)
onWindowResize()

/**
 * Adding 3D models and html elements to the scene
 */
// 3D model
gltfLoader.load(
'portal.glb',
    (gltf) =>
    {
        gltf.scene.scale.x = 300
        gltf.scene.scale.y = 300
        gltf.scene.scale.z = 300
        scene.add(gltf.scene)

        // Get each object
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // Apply materials
        bakedMesh.material = bakedMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
    }
)
  
// Video element
const youtube_video = new VideoElement( 'Bf_YemfEaDs', 0, 310, -532)
root.add(youtube_video)
scene.add( root )
 

// Block iframe events when dragging camera
controls.addEventListener( 'start', function () {
    css3DContainer.classList.add('inactive')
})
controls.addEventListener( 'end', function () {
    css3DContainer.classList.remove('inactive')
})

/**
 * Animate
 */
function tick() {
    controls.update()
    css3DRenderer.render(scene, camera)
    webglRenderer.render(scene, camera)
    requestAnimationFrame(tick)
}

requestAnimationFrame(tick)