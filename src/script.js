import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('.canvas')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 20
camera.position.z = 1000
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.addEventListener( 'start', function () {
    canvas.classList.add('inactive')
})
controls.addEventListener( 'end', function () {
    canvas.classList.remove('inactive')
})

/**
 * Renderer
 */
const renderer = new CSS3DRenderer();
renderer.setSize(sizes.width, sizes.height)
canvas.appendChild( renderer.domElement )


/**
 * Helper functions
 */
// Element function
function VideoElement( videoID, x, y, z ) {

    const div = document.createElement( 'div' )
    div.setAttribute("class", "video_element")

    const iframe = document.createElement( 'iframe' )
    iframe.src = `https://www.youtube.com/embed/${videoID}?rel=0`
    div.appendChild( iframe )

    const object = new CSS3DObject( div )
    object.position.set( x, y, z )

    return object

}

/**
 * Add elements to the scene
 */
 const group = new THREE.Group();
 group.add( new VideoElement( 'Bf_YemfEaDs', 0, 0, 240) );
 scene.add( group );

 console.log(group)

/**
 * Animate
 */

const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()