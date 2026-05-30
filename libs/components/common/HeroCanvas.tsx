import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mount = mountRef.current;
		if (!mount) return;

		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(mount.clientWidth, mount.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		mount.appendChild(renderer.domElement);

		const COUNT = 100;
		const crimson = new THREE.Color('#8B1A1A');
		const navy = new THREE.Color('#1A3A5C');

		interface Particle {
			mesh: THREE.Mesh;
			speed: number;
		}

		const particles: Particle[] = [];
		const geometries: THREE.SphereGeometry[] = [];

		for (let i = 0; i < COUNT; i++) {
			const radius = 0.06 + Math.random() * 0.08;
			const geo = new THREE.SphereGeometry(radius, 6, 6);
			geometries.push(geo);

			const mat = new THREE.MeshBasicMaterial({
				color: i % 2 === 0 ? crimson : navy,
				transparent: true,
				opacity: 0.55,
			});

			const mesh = new THREE.Mesh(geo, mat);
			mesh.position.set(
				Math.random() * 16 - 8,
				Math.random() * 10 - 5,
				Math.random() * 6 - 3,
			);

			scene.add(mesh);
			particles.push({ mesh, speed: 0.003 + Math.random() * 0.003 });
		}

		const lineGeo = new THREE.BufferGeometry();
		const lineMat = new THREE.LineBasicMaterial({
			color: new THREE.Color('#8B1A1A'),
			transparent: true,
			opacity: 0.15,
		});
		const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
		scene.add(lineSegments);

		const handleResize = () => {
			if (!mount) return;
			camera.aspect = mount.clientWidth / mount.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(mount.clientWidth, mount.clientHeight);
		};
		window.addEventListener('resize', handleResize);

		let animId: number;

		const animate = () => {
			animId = requestAnimationFrame(animate);

			for (const p of particles) {
				p.mesh.position.y += p.speed;
				if (p.mesh.position.y > 5) {
					p.mesh.position.y = -5;
					p.mesh.position.x = Math.random() * 16 - 8;
				}
			}

			const pts: THREE.Vector3[] = [];
			for (let i = 0; i < COUNT; i++) {
				for (let j = i + 1; j < COUNT; j++) {
					const d = particles[i].mesh.position.distanceTo(particles[j].mesh.position);
					if (d < 2.5) {
						pts.push(particles[i].mesh.position.clone());
						pts.push(particles[j].mesh.position.clone());
					}
				}
			}
			lineGeo.setFromPoints(pts);

			camera.position.x += 0.0002;
			camera.lookAt(0, 0, 0);

			renderer.render(scene, camera);
		};

		animate();

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', handleResize);
			geometries.forEach((g) => g.dispose());
			lineMat.dispose();
			lineGeo.dispose();
			renderer.dispose();
			if (mount.contains(renderer.domElement)) {
				mount.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={mountRef}
			className="hero-canvas-mount"
			style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
		/>
	);
}
