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
    description: 'High-speed supercars, night street racing, and highway speed acceleration',
    videoUrl: 'https://videos.pexels.com/video-files/2103099/2103099-sd_640_360_30fps.mp4',
    accentColor: '#ef4444'
  },
  {
    id: 'nature-forest',
    name: 'Nature & Wilderness',
    category: 'Nature',
    icon: '🌲',
    description: 'Lush green mountain trails, rushing stream waterfall, and fresh wilderness',
    videoUrl: 'https://videos.pexels.com/video-files/3015510/3015510-hd_1280_720_24fps.mp4',
    accentColor: '#10b981'
  },
  {
    id: 'music-world',
    name: 'Music World & Concert Stage',
    category: 'Music World',
    icon: '🎵',
    description: 'Laser festival lights, cheering crowd energy, and pulsating live concert stage',
    videoUrl: 'https://videos.pexels.com/video-files/2022395/2022395-hd_1280_720_30fps.mp4',
    accentColor: '#a855f7'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean & Sea Waves',
    category: 'Ocean',
    icon: '🌊',
    description: 'Crystal turquoise waters and rolling ocean waves crashing on the shore',
    videoUrl: 'https://videos.pexels.com/video-files/854400/854400-hd_1280_720_30fps.mp4',
    accentColor: '#06b6d4'
  },
  {
    id: 'cyberpunk-city',
    name: 'Cyberpunk Neon City',
    category: 'Cyberpunk',
    icon: '🌆',
    description: 'Rainy futuristic Tokyo streets, glowing neon billboards, and cyberpunk nightlife',
    videoUrl: 'https://videos.pexels.com/video-files/3129671/3129671-hd_1280_720_30fps.mp4',
    accentColor: '#ec4899'
  },
  {
    id: 'deep-space',
    name: 'Deep Space & Nebula',
    category: 'Space',
    icon: '🌌',
    description: 'Floating through cosmic interstellar stardust, vibrant nebulae, and galaxy clusters',
    videoUrl: 'https://videos.pexels.com/video-files/856963/856963-hd_1280_720_25fps.mp4',
    accentColor: '#6366f1'
  },
  {
    id: 'rain-storm',
    name: 'Moody Rain & Thunderstorm',
    category: 'Weather',
    icon: '🌧️',
    description: 'Gentle raindrops streaming down a window overlooking nighttime ambient lights',
    videoUrl: 'https://videos.pexels.com/video-files/2611250/2611250-hd_1280_720_30fps.mp4',
    accentColor: '#38bdf8'
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset & Golden Horizon',
    category: 'Sunset',
    icon: '🌅',
    description: 'Warm golden hour twilight glow and evening serenity across ocean horizon',
    videoUrl: 'https://videos.pexels.com/video-files/2098989/2098989-hd_1280_720_30fps.mp4',
    accentColor: '#f59e0b'
  },
  {
    id: 'retro-synthwave',
    name: 'Retro Synthwave & Outrun',
    category: 'Retro',
    icon: '🕹️',
    description: '80s retro neon geometric landscape and glowing wireframe horizon',
    videoUrl: 'https://videos.pexels.com/video-files/2795393/2795393-hd_1280_720_25fps.mp4',
    accentColor: '#f43f5e'
  },
  {
    id: 'lofi-study',
    name: 'Chill Lo-Fi & Study Room',
    category: 'Lo-Fi',
    icon: '☕',
    description: 'Cozy midnight room with raindrops on the window and relaxing ambient vibes',
    videoUrl: 'https://videos.pexels.com/video-files/1526909/1526909-hd_1280_720_24fps.mp4',
    accentColor: '#d97706'
  },
  {
    id: 'aurora-borealis',
    name: 'Northern Lights Aurora',
    category: 'Aurora',
    icon: '✨',
    description: 'Emerald green and violet celestial curtains dancing across arctic skies',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Aurora_Borealis_03-17-2013.webm',
    accentColor: '#2dd4bf'
  },
  {
    id: 'forest-pines',
    name: 'Deep Forest & Sun Rays',
    category: 'Forest',
    icon: '🍃',
    description: 'Golden morning light filtering through towering evergreen pine tree canopies',
    videoUrl: 'https://videos.pexels.com/video-files/1943483/1943483-hd_1280_720_25fps.mp4',
    accentColor: '#22c55e'
  },
  {
    id: 'mountain-alps',
    name: 'Snowy Mountain Alps',
    category: 'Mountains',
    icon: '🏔️',
    description: 'Grand alpine summits and majestic snow-capped peaks in winter sunlight',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/94/B%C3%BCelenhorn_%28Monstein%29%2C_aerial_video.webm',
    accentColor: '#93c5fd'
  },
  {
    id: 'cozy-fireplace',
    name: 'Roaring Fireplace & Embers',
    category: 'Fireplace',
    icon: '🔥',
    description: 'Warm crackling hearth log flames providing cozy ambient heat and glow',
    videoUrl: 'https://videos.pexels.com/video-files/1779202/1779202-hd_1280_720_25fps.mp4',
    accentColor: '#ea580c'
  },
  {
    id: 'hyperspace-warp',
    name: 'Hyperspace Warp Tunnel',
    category: 'Sci-Fi',
    icon: '🚀',
    description: 'Light-speed warp acceleration through a futuristic dimensional vortex',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/NASA_Black_Hole_Visualization_Takes_Viewers_Beyond_the_Brink_%28SVS14576_BHPlunge_360_FINAL_1080%29.webm',
    accentColor: '#8b5cf6'
  },
  {
    id: 'electric-energy',
    name: 'Electric Neon Energy',
    category: 'Visualizer',
    icon: '⚡',
    description: 'High-voltage electric energy waves, neon pulses, and audio visualizer motion',
    videoUrl: 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4',
    accentColor: '#00f0ff'
  },
  {
    id: 'city-timelapse',
    name: 'Night City Traffic Timelapse',
    category: 'Timelapse',
    icon: '🚦',
    description: 'Streaking vehicle light trails and bustling traffic across urban metropolis',
    videoUrl: 'https://videos.pexels.com/video-files/3191572/3191572-hd_1280_720_25fps.mp4',
    accentColor: '#3b82f6'
  },
  {
    id: 'desert-dunes',
    name: 'Desert Dunes & Starlight',
    category: 'Desert',
    icon: '🏜️',
    description: 'Vast shifting golden sand dunes under tranquil open desert sunset skies',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Mojave_Desert_Sunset_%2840480403760%29.webm',
    accentColor: '#ca8a04'
  },
  {
    id: 'clouds-flight',
    name: 'Dreamy Sunset Cloud Flight',
    category: 'Clouds',
    icon: '☁️',
    description: 'Soaring above pastel sunset cumulus cloudscapes in total peace from airplane view',
    videoUrl: 'https://videos.pexels.com/video-files/855564/855564-hd_1280_720_24fps.mp4',
    accentColor: '#f472b6'
  },
  {
    id: 'vinyl-turntable',
    name: 'Vintage Turntable & Vinyl Record',
    category: 'Vinyl Audio',
    icon: '📼',
    description: 'Real analog 33 RPM LP vinyl record spinning on vintage turntable with needle in groove',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/LP_Long_play_vinyl_record_%28record_player%29_3_-_Free_HD_stock_footage.webm',
    accentColor: '#14b8a6'
  }
];
