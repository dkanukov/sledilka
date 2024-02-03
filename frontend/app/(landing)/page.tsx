'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Typography } from 'antd'

import styles from './index.module.css'

const { Title } = Typography

export default function Landing() {
	const containerRef = useRef<HTMLDivElement>(null)
	const renderer = useRef(new THREE.WebGLRenderer())

	const setupScene = () => {
		const scene = new THREE.Scene()
		const ambientLight = new THREE.AmbientLight()
		const light = new THREE.PointLight(0xffffff, 1)

		light.position.set(0.8, 1.4, 1.0)

		scene.add(light)
		scene.add(ambientLight)

		return scene
	}

	const setupCamera = () => {
		const camera = new THREE.PerspectiveCamera(75)

		camera.position.set(0.8, 1.4, 1.0)
		camera.translateZ(20)

		return camera
	}

	const setupControls = (camera: THREE.Camera) => {
		const controls = new OrbitControls(camera, renderer.current.domElement)

		controls.enableRotate = true

		return controls
	}

	useEffect(() => {
		const loader = new GLTFLoader()
		const scene = setupScene()
		const camera = setupCamera()
		const controls = setupControls(camera)

		let objectCamera: THREE.Group<THREE.Object3DEventMap> | null = null

		renderer.current.setSize(300, 300)

		loader.load('/scene.gltf', (obj) => {
			obj.scene.position.set(0, -5, 0)
			scene.add(obj.scene)
			objectCamera = obj.scene
		}, undefined, (error) => {console.log(error)})

		const render = () => {
			if (objectCamera) {
				objectCamera.rotateY(0.006)
			}

			const canvas = renderer.current.domElement
			camera.aspect = canvas.clientWidth / canvas.clientHeight
			camera.updateProjectionMatrix()

			controls.update()
			renderer.current.render(scene, camera)

			if (typeof requestAnimationFrame !== 'undefined') {
				requestAnimationFrame(render)
			}
		}

		containerRef.current?.appendChild(renderer.current.domElement)
		render()
	})

	return (
		<div className={styles.root}>
			<div className={styles.sceneContainer} ref={containerRef}/>
			<Title className={styles.headerText}>
					Sledilka
			</Title>
		</div>
	)
}
