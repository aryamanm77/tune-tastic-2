import { Capacitor, registerPlugin } from '@capacitor/core'
import type { Song } from '../context/PlayerContext'

interface TuneTasticWidgetPlugin {
  updateNowPlaying(options: { title: string; artist: string; artwork: string; songId: string; isPlaying: boolean }): Promise<void>
}

const TuneTasticWidget = registerPlugin<TuneTasticWidgetPlugin>('TuneTasticWidget')

export function updateMusicWidget(song: Song | null, isPlaying: boolean) {
  if (!Capacitor.isNativePlatform()) return

  void TuneTasticWidget.updateNowPlaying({
    title: song?.title ?? 'TuneTastic',
    artist: song?.artist ?? 'Choose a song to start listening',
    artwork: song?.coverArt ?? '',
    songId: song?.id ?? '',
    isPlaying,
  }).catch(() => undefined)
}
