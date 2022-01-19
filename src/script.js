import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
//PARTICLE PACKS FROM - https://www.kenney.nl/assets/particle-pack
// or create your own in GIMP 

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */


//geometry
const particlesGeometry = new THREE.BufferGeometry(6, 32, 32)
const count = 20000

const positions = new Float32Array(count * 3) // 500 vertices, each vertex has 3 values xyz, so 500 * 3.
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() -0.5) * 10 //-0.5 centers it, *10 enlarges it.
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // 3 values per vertex
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)) // 3 values per vertex


//material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true //perspective (close to camera larger)
})
//particlesMaterial.color = new THREE.Color('red')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
//particlesMaterial.alphaTest = 0.001 // tells the gpu not to render the outer black area of texture even though it will be transparent eventually, but some of them aren't.
//particlesMaterial.depthTest = false // the gpu won't try to distinguish which are in from or at the back when deactivated. another solution to the above, but may creates a bug where you can see far particles behind large objects.
particlesMaterial.depthWrite = false // Best solution. 
particlesMaterial.blending = THREE.AdditiveBlending //when particles overlap, they brighten and combine colours. nice. GPU heavy.
particlesMaterial.vertexColors = true

//points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update particles
    //particles.rotation.y = elapsedTime * 0.1 //all particles move
    for(let i = 0; i < count * 3; i++){        //singular particle animation
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3] 
    
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()