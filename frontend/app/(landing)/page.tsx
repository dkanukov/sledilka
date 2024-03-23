'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Image, List, Typography } from 'antd'
import Carousel from 'react-multi-carousel'

import styles from './index.module.css'

const { Title, Text, Paragraph } = Typography

export default function Landing() {
	const containerRef = useRef<HTMLDivElement>(null)
	const renderer = useRef(new THREE.WebGLRenderer())
	const [listRows] = useState([
		'Просмотр текущего состояния устройств на карте: Наша система позволяет вам в реальном времени отслеживать расположение и состояние всех устройств в вашей локальной сети с помощью удобного интерфейса карты.',
		'Просмотр видео с камер: Вы можете легко получать доступ к видеопотокам с камер видеонаблюдения, установленным в вашей организации, прямо через наше приложение.',
		'Создание объектов и добавление слоев на карту: Вы можете создавать и настраивать объекты на карте для более удобного отображения вашей инфраструктуры. Добавляйте слои, чтобы структурировать информацию и делать ее более доступной.',
		'Добавление/изменение элементов сети на схему объекта: Наша система позволяет вам управлять элементами сети, включая коммутаторы, маршрутизаторы и другие устройства, прямо на схеме объекта.\n',
		'Добавление/изменение камер на схеме объекта: Легко добавляйте и настраивайте камеры видеонаблюдения на схеме вашего объекта для более удобного контроля.',
	])

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
			<Text>
				Мы представляем вам инновационное программное обеспечение, которое поможет вам эффективно контролировать и управлять вашей организационной инфраструктурой. Наша система предлагает широкий спектр функций, предназначенных для мониторинга и управления вашими устройствами прямо с вашего компьютера или мобильного устройства.
			</Text>
			<Title
				className={styles.mt20px}
			>
				Функционал системы:
			</Title>
			<List
				bordered
				dataSource={listRows}
				renderItem={(item) => (
					<List.Item>
						{item}
					</List.Item>
				)}
			/>
		</div>
	)
}
