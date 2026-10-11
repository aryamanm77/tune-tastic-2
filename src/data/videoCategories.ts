export interface VideoCategory {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  videoUrl: string;
  accentColor: string;
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: 'racing-cars',
    name: 'Racing Supercars & Drift',
    category: 'Racing Cars',
    icon: '🏎️',
    description: 'High-speed hypercars, night highway drift, and redline acceleration',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#ef4444'
  },
  {
    id: 'nature-forest',
    name: 'Nature & Wilderness',
    category: 'Nature',
    icon: '🌲',
    description: 'Lush green mountain trails, pine trees, and fresh mountain breezes',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/forest_bike.mp4',
    accentColor: '#10b981'
  },
  {
    id: 'music-world',
    name: 'Music World & Concert Stage',
    category: 'Music World',
    icon: '🎵',
    description: 'Laser festival lights, pulsing crowd energy, and live stage vibes',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/rafting.mp4',
    accentColor: '#a855f7'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean & Sea Waves',
    category: 'Ocean',
    icon: '🌊',
    description: 'Crystal turquoise waters, rolling tides, and coral marine depths',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/sea_turtle.mp4',
    accentColor: '#06b6d4'
  },
  {
    id: 'cyberpunk-city',
    name: 'Cyberpunk Neon City',
    category: 'Cyberpunk',
    icon: '🌆',
    description: 'Rainy futuristic Tokyo alleys, glowing neon signs, and chrome reflections',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#ec4899'
  },
  {
    id: 'deep-space',
    name: 'Deep Space & Nebula',
    category: 'Space',
    icon: '🌌',
    description: 'Floating through cosmic interstellar stardust and orbiting galaxies',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#6366f1'
  },
  {
    id: 'rain-storm',
    name: 'Moody Rain & Thunderstorm',
    category: 'Weather',
    icon: '🌧️',
    description: 'Gentle raindrops streaming down a window overlooking nighttime lights',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/rafting.mp4',
    accentColor: '#38bdf8'
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset & Golden Horizon',
    category: 'Sunset',
    icon: '🌅',
    description: 'Warm golden hour skies, radiant twilight glow, and evening serenity',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/forest_bike.mp4',
    accentColor: '#f59e0b'
  },
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave & Outrun',
    category: 'Retro',
    icon: '🕹️',
    description: '80s wireframe grid highway racing towards a neon magenta sun',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#f43f5e'
  },
  {
    id: 'lofi-study',
    name: 'Chill Lo-Fi & Study Room',
    category: 'Lo-Fi',
    icon: '☕',
    description: 'Cozy midnight bedroom desk with rain tapping on the glass',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/dog.mp4',
    accentColor: '#d97706'
  },
  {
    id: 'aurora-borealis',
    name: 'Northern Lights Aurora',
    category: 'Aurora',
    icon: '✨',
    description: 'Emerald green and violet celestial curtains dancing across arctic skies',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/snow_horses.mp4',
    accentColor: '#2dd4bf'
  },
  {
    id: 'forest-pines',
    name: 'Deep Forest & Sun Rays',
    category: 'Forest',
    icon: '🍃',
    description: 'Golden morning light filtering through towering redwood canopies',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/forest_bike.mp4',
    accentColor: '#22c55e'
  },
  {
    id: 'mountain-alps',
    name: 'Snowy Mountain Alps',
    category: 'Mountains',
    icon: '🏔️',
    description: 'Grand alpine summits and majestic galloping horses in pure snow',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/snow_horses.mp4',
    accentColor: '#93c5fd'
  },
  {
    id: 'cozy-fireplace',
    name: 'Roaring Fireplace & Embers',
    category: 'Fireplace',
    icon: '🔥',
    description: 'Warm crackling hearth flames providing cozy ambient heat',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/marmots.mp4',
    accentColor: '#ea580c'
  },
  {
    id: 'hyperspace-warp',
    name: 'Hyperspace Warp Tunnel',
    category: 'Sci-Fi',
    icon: '🚀',
    description: 'Light-speed warp acceleration through a futuristic dimensional vortex',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#8b5cf6'
  },
  {
    id: 'electric-energy',
    name: 'Electric Neon Energy',
    category: 'Visualizer',
    icon: '⚡',
    description: 'High-voltage electric sparks and pulsing audio visualizer lightwaves',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#00f0ff'
  },
  {
    id: 'city-timelapse',
    name: 'Night City Traffic Timelapse',
    category: 'Timelapse',
    icon: '🚦',
    description: 'Streaking red and white light trails across towering urban skyscrapers',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/samples/cld-sample-video.mp4',
    accentColor: '#3b82f6'
  },
  {
    id: 'desert-dunes',
    name: 'Desert Dunes & Starlight',
    category: 'Desert',
    icon: '🏜️',
    description: 'Vast shifting golden sand dunes under tranquil open desert skies',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/marmots.mp4',
    accentColor: '#ca8a04'
  },
  {
    id: 'clouds-flight',
    name: 'Dreamy Sunset Cloud Flight',
    category: 'Clouds',
    icon: '☁️',
    description: 'Soaring above pastel sunset cumulus cloudscapes in total peace',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/rafting.mp4',
    accentColor: '#f472b6'
  },
  {
    id: 'vinyl-turntable',
    name: 'Vintage Turntable & Tape Deck',
    category: 'Vinyl Audio',
    icon: '📼',
    description: 'Spinning 33 RPM analog vinyl and glowing vintage hi-fi VU meters',
    videoUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,w_1280/dog.mp4',
    accentColor: '#14b8a6'
  }
];
