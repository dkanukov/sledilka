'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Image, Typography } from 'antd'
import Carousel from 'react-multi-carousel'

import styles from './index.module.css'

const { Title, Text, Paragraph } = Typography

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
			<div className={styles.header}>
				<div className={styles.sceneContainer} ref={containerRef}/>
				<Title className={styles.headerText}>
					Sledilka
				</Title>
			</div>
			<Carousel
				additionalTransfrom={0}
				arrows
				autoPlaySpeed={3000}
				centerMode={false}
				className=""
				containerClass={styles.carousel}
				dotListClass=""
				draggable
				focusOnSelect={false}
				infinite
				itemClass=""
				keyBoardControl
				minimumTouchDrag={80}
				pauseOnHover
				renderArrowsWhenDisabled={false}
				renderButtonGroupOutside={false}
				renderDotsOutside={false}
				responsive={{
					desktop: {
						breakpoint: {
							max: 3000,
							min: 1024,
						},
						items: 3,
						partialVisibilityGutter: 40,
					},
					mobile: {
						breakpoint: {
							max: 464,
							min: 0,
						},
						items: 1,
						partialVisibilityGutter: 30,
					},
					tablet: {
						breakpoint: {
							max: 1024,
							min: 464,
						},
						items: 2,
						partialVisibilityGutter: 30,
					},
				}}
				rewind={false}
				rewindWithAnimation={false}
				rtl={false}
				shouldResetAutoplay
				showDots={false}
				sliderClass=""
				slidesToSlide={1}
				swipeable
			>
				<Image
					src={'/img1.jpeg'}
				/>
				<Image
					src={'/img2.jpeg'}
				/>
				<Image
					src={'/img3.jpeg'}
				/>
			</Carousel>
			<Title
				className={styles.mt20px}
			>
				Удобный просмотр ваших устройств
			</Title>
		</div>
	)
}
