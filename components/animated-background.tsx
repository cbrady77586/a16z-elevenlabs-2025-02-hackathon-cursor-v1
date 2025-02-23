'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CALMING_COLORS = ['#E2E7E7', '#55AAAA', '#1C2E63'];
const ENERGIZING_COLORS = ['#9425c9', '#1dd6e1', '#f0e9df', '#ff7a41', '#3f1046', '#b9f94e'];

interface AnimatedBackgroundProps {
  isActive: boolean;
  sessionDuration: number; // in minutes
}

export function AnimatedBackground({ isActive, sessionDuration }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const colors = theme === 'calming' ? CALMING_COLORS : ENERGIZING_COLORS;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colors: { value: colors.map(color => new THREE.Color(color)) },
        isActive: { value: isActive ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 colors[${colors.length}];
        uniform float isActive;
        varying vec2 vUv;

        void main() {
          // Slower animation based on session duration
          float cycleSpeed = 0.1; // Reduced from 0.5
          float t = time * cycleSpeed * isActive;
          vec2 uv = vUv;
          
          float colorIndex = mod(floor(t), ${colors.length}.0);
          float nextColorIndex = mod(colorIndex + 1.0, ${colors.length}.0);
          
          vec3 currentColor = colors[int(colorIndex)];
          vec3 nextColor = colors[int(nextColorIndex)];
          
          float mixValue = fract(t);
          vec3 finalColor = mix(currentColor, nextColor, mixValue);
          
          // Fade in/out based on isActive
          float opacity = isActive * 0.15; // Reduced opacity
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 1;

    let animationFrame: number;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      if (isActive) {
        // Slower animation speed
        material.uniforms.time.value += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isActive, theme, sessionDuration]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-1000 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'white' }}
    />
  );
}