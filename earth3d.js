import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class EarthViewer {
    constructor() {
        this.container = document.querySelector('.earth3d-container');
        this.canvas = document.getElementById('earth3d-canvas');
        this.loadingEl = document.querySelector('.earth3d-loading');
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.controls = null;
        this.animationId = null;
        
        this.isInitialized = false;
        this.isLoading = true;
        
        this.init();
    }
    
    async init() {
        this.showLoading();
        
        try {
            await this.setupScene();
            await this.createEarth();
            this.setupControls();
            this.setupEventListeners();
            this.animate();
            
            this.hideLoading();
            this.isInitialized = true;
            
            console.log('3D Earth initialized successfully');
        } catch (error) {
            console.error('Failed to initialize 3D Earth:', error);
            this.showError();
        }
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Calculate canvas size (maintaining aspect ratio)
        const canvasSize = this.getCanvasSize();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            1,  // Aspect ratio (1:1 for circular canvas)
            0.1, 
            1000
        );
        this.camera.position.z = 3;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.renderer.setSize(canvasSize, canvasSize);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Enable shadows for more realism (disabled for full daylight)
        this.renderer.shadowMap.enabled = false;
        
        return Promise.resolve();
    }
    
    async createEarth() {
        // Create sphere geometry with higher detail
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Load earth texture
        const textureLoader = new THREE.TextureLoader();
        
        return new Promise((resolve, reject) => {
            textureLoader.load(
                'images/EARTH.png',
                (texture) => {
                    // Configure texture
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.flipY = false;
                    
                    // Create material with enhanced properties for full daylight
                    const material = new THREE.MeshLambertMaterial({ 
                        map: texture,
                        transparent: false,
                        color: 0xffffff, // Pure white to not tint the texture
                        side: THREE.FrontSide
                    });
                    
                    // Create earth mesh
                    this.earth = new THREE.Mesh(geometry, material);
                    
                    // Add slight tilt to earth (like real Earth)
                    this.earth.rotation.z = 23.5 * Math.PI / 180; // 23.5 degrees tilt
                    
                    this.scene.add(this.earth);
                    
                    // Add lighting for realistic appearance
                    this.setupLighting();
                    
                    resolve();
                },
                (progress) => {
                    // Loading progress
                    const percentage = Math.round((progress.loaded / progress.total) * 100);
                    if (this.loadingEl) {
                        this.loadingEl.textContent = `Loading Earth... ${percentage}%`;
                    }
                },
                (error) => {
                    console.error('Error loading earth texture:', error);
                    // Fallback: create earth with proper blue/green material
                    this.createFallbackEarth(geometry);
                    resolve();
                }
            );
        });
    }
    
    createFallbackEarth(geometry) {
        console.log('Using fallback earth material');
        
        // Create a nice Earth-like blue-green gradient material
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Create a blue to green gradient
        const gradient = context.createLinearGradient(0, 0, 512, 256);
        gradient.addColorStop(0, '#4A90E2');    // Ocean blue
        gradient.addColorStop(0.3, '#2E8B57');  // Sea green
        gradient.addColorStop(0.6, '#228B22');  // Forest green
        gradient.addColorStop(1, '#8FBC8F');    // Light green
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 256);
        
        // Add some continent-like patterns
        context.fillStyle = '#90EE90';
        context.fillRect(100, 80, 80, 60);
        context.fillRect(300, 120, 120, 80);
        context.fillRect(450, 60, 60, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        
        const material = new THREE.MeshLambertMaterial({ 
            map: texture,
            color: 0xffffff
        });
        
        this.earth = new THREE.Mesh(geometry, material);
        this.earth.rotation.z = 23.5 * Math.PI / 180;
        
        this.scene.add(this.earth);
        this.setupLighting();
    }
    
    setupLighting() {
        // High ambient light for full daylight illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        // Primary directional light from front
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
        frontLight.position.set(0, 0, 5);
        this.scene.add(frontLight);
        
        // Secondary directional light from side for even coverage
        const sideLight = new THREE.DirectionalLight(0xffffff, 0.4);
        sideLight.position.set(5, 0, 0);
        this.scene.add(sideLight);
        
        // Back light to eliminate any dark areas
        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(0, 0, -5);
        this.scene.add(backLight);
        
        // Top light for complete coverage
        const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
        topLight.position.set(0, 5, 0);
        this.scene.add(topLight);
    }
    
    setupControls() {
        // Create orbit controls for interactive rotation
        this.controls = new OrbitControls(this.camera, this.canvas);
        
        // Configure controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI;
        
        // Disable zoom and pan for cleaner look
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        
        // Auto-rotate (optional, can be toggled)
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1; // Slow, realistic rotation
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // Handle mouse interactions for enhanced effects
        this.canvas.addEventListener('mouseenter', () => {
            if (this.controls) {
                this.controls.autoRotateSpeed = 2; // Faster rotation on hover
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            if (this.controls) {
                this.controls.autoRotateSpeed = 1; // Back to normal speed
            }
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.earth) {
            // Additional manual rotation for smooth movement
            this.earth.rotation.y += 0.005;
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    handleResize() {
        if (!this.renderer || !this.camera) return;
        
        const canvasSize = this.getCanvasSize();
        
        this.camera.aspect = 1; // Keep 1:1 aspect ratio
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(canvasSize, canvasSize);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    getCanvasSize() {
        // Get size based on viewport for responsive design
        if (window.innerWidth <= 480) {
            return 280;
        } else if (window.innerWidth <= 768) {
            return 320;
        } else {
            return 400;
        }
    }
    
    updateTheme() {
        if (!this.scene) return;
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Update ambient lighting based on theme (maintaining full daylight)
        const ambientLight = this.scene.children.find(child => child.type === 'AmbientLight');
        if (ambientLight) {
            ambientLight.intensity = isDark ? 0.7 : 0.8;
        }
        
        // Adjust all directional lights slightly for theme
        const directionalLights = this.scene.children.filter(child => child.type === 'DirectionalLight');
        directionalLights.forEach((light, index) => {
            if (index === 0) { // Front light
                light.intensity = isDark ? 0.5 : 0.6;
            } else { // Other lights
                light.intensity = isDark ? 0.25 : 0.3;
            }
        });
    }
    
    showLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.add('visible');
            this.loadingEl.textContent = 'Loading Earth...';
        }
    }
    
    hideLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.remove('visible');
        }
        this.isLoading = false;
    }
    
    showError() {
        if (this.loadingEl) {
            this.loadingEl.classList.add('visible');
            this.loadingEl.textContent = 'Error loading 3D Earth';
            this.loadingEl.style.color = '#ef4444';
        }
        this.isLoading = false;
    }
    
    destroy() {
        // Clean up resources
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.earth && this.earth.geometry) {
            this.earth.geometry.dispose();
        }
        
        if (this.earth && this.earth.material) {
            if (this.earth.material.map) {
                this.earth.material.map.dispose();
            }
            this.earth.material.dispose();
        }
        
        // Remove all scene objects
        while(this.scene && this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}

// Initialize the Earth viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment to ensure all elements are rendered
    setTimeout(() => {
        if (document.getElementById('earth3d-canvas')) {
            window.earthViewer = new EarthViewer();
        }
    }, 100);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.earthViewer) {
        window.earthViewer.destroy();
    }
});