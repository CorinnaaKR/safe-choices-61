import { useMemo } from 'react';
import * as THREE from 'three';

/** Generate a procedural texture with noise/grain */
function createNoiseTexture(
  baseColor: string,
  variation: number = 0.05,
  size: number = 256
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const base = new THREE.Color(baseColor);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = (Math.random() - 0.5) * 2 * variation;
      const color = base.clone();
      color.r = Math.max(0, Math.min(1, color.r + r));
      color.g = Math.max(0, Math.min(1, color.g + r * 0.8));
      color.b = Math.max(0, Math.min(1, color.b + r * 0.6));
      ctx.fillStyle = `rgb(${Math.floor(color.r * 255)},${Math.floor(color.g * 255)},${Math.floor(color.b * 255)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Wood plank texture */
function createWoodTexture(baseColor: string, size: number = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const base = new THREE.Color(baseColor);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Wood grain lines
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * size;
    const alpha = 0.03 + Math.random() * 0.08;
    const dark = Math.random() > 0.5;
    ctx.strokeStyle = dark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha * 0.5})`;
    ctx.lineWidth = 0.5 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < size; x += 10) {
      ctx.lineTo(x, y + Math.sin(x * 0.02) * 3 + (Math.random() - 0.5) * 2);
    }
    ctx.stroke();
  }

  // Knots
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(60,30,10,0.15)`;
    ctx.fill();
  }

  // Subtle noise
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Tile / linoleum pattern */
function createTileTexture(baseColor: string, lineColor: string, tileSize: number = 32, size: number = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Tile grid
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Subtle variation per tile
  for (let ty = 0; ty < size; ty += tileSize) {
    for (let tx = 0; tx < size; tx += tileSize) {
      const alpha = (Math.random() - 0.5) * 0.06;
      ctx.fillStyle = alpha > 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${-alpha})`;
      ctx.fillRect(tx + 1, ty + 1, tileSize - 2, tileSize - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Grass texture */
function createGrassTexture(size: number = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#4A7C2E';
  ctx.fillRect(0, 0, size, size);

  // Grass blades
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const h = 2 + Math.random() * 6;
    const green = 60 + Math.floor(Math.random() * 80);
    ctx.strokeStyle = `rgba(${20 + Math.floor(Math.random() * 30)},${green},${10 + Math.floor(Math.random() * 30)},0.4)`;
    ctx.lineWidth = 0.5 + Math.random();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 3, y - h);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/** Wall texture with subtle plaster/paint effect */
function createWallTexture(baseColor: string, size: number = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Plaster grain
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.random() > 0.6) {
        const v = (Math.random() - 0.5) * 0.04;
        ctx.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// ===== Hook-based API for use in components =====

export function useWoodTexture(color: string, repeat: [number, number] = [1, 1]) {
  return useMemo(() => {
    const tex = createWoodTexture(color);
    tex.repeat.set(repeat[0], repeat[1]);
    return tex;
  }, [color, repeat[0], repeat[1]]);
}

export function useTileTexture(base: string, line: string, tileSize?: number, repeat: [number, number] = [1, 1]) {
  return useMemo(() => {
    const tex = createTileTexture(base, line, tileSize);
    tex.repeat.set(repeat[0], repeat[1]);
    return tex;
  }, [base, line, tileSize, repeat[0], repeat[1]]);
}

export function useGrassTexture() {
  return useMemo(() => createGrassTexture(), []);
}

export function useWallTexture(color: string, repeat: [number, number] = [1, 1]) {
  return useMemo(() => {
    const tex = createWallTexture(color);
    tex.repeat.set(repeat[0], repeat[1]);
    return tex;
  }, [color, repeat[0], repeat[1]]);
}

export function useNoiseTexture(color: string, variation?: number) {
  return useMemo(() => createNoiseTexture(color, variation), [color, variation]);
}
