import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stack } from '@mui/material';

function InteractiveKnot() {
	const meshRef = useRef<any>(null);
	const { pointer } = useThree();

	useFrame((_, delta) => {
		if (!meshRef.current) return;
		meshRef.current.rotation.x += delta * 0.7;
		meshRef.current.rotation.y += delta * 0.95;
		// Tilt gently toward the cursor position, on top of the constant auto-rotation.
		meshRef.current.rotation.x += (pointer.y * 0.6 - meshRef.current.rotation.x * 0.02) * delta;
		meshRef.current.rotation.y += (pointer.x * 0.6 - meshRef.current.rotation.y * 0.02) * delta;
	});

	return (
		<mesh ref={meshRef}>
			<torusKnotGeometry args={[2.2, 0.7, 200, 32]} />
			<meshStandardMaterial color={'#e8856a'} roughness={0.25} metalness={0.4} />
		</mesh>
	);
}

export default function CsHero() {
	return (
		<Stack className={'cs-hero'}>
			<Stack className={'cs-hero-left'}>
				<span className={'cs-hero-eyebrow'}>SUPPORT · HELP CENTER</span>
				<h1 className={'cs-hero-title'}>CS</h1>
				<p className={'cs-hero-sub'}>We're here to help, anytime.</p>
				<div className={'cs-hero-caption'}>
					<span className={'cs-hero-dot'} />
					Move your cursor over the shape to interact
				</div>
			</Stack>
			<Stack className={'cs-hero-right'}>
				<Canvas camera={{ position: [0, 0, 7.2] }}>
					<ambientLight intensity={0.6} />
					<directionalLight position={[3, 3, 3]} intensity={1.1} />
					<InteractiveKnot />
				</Canvas>
			</Stack>
		</Stack>
	);
}
