import { Capacitor, registerPlugin } from '@capacitor/core'

interface NativeSpeechPlugin {
  speak(options: { text: string; pitch: number; rate: number }): Promise<void>
  stop(): Promise<void>
}

interface TuneTasticCameraPlugin {
  requestPermission(): Promise<void>
}

const NativeSpeech = registerPlugin<NativeSpeechPlugin>('NativeSpeech')
const TuneTasticCamera = registerPlugin<TuneTasticCameraPlugin>('TuneTasticCamera')

export const canUseNativeDeviceFeatures = () => Capacitor.isNativePlatform()

export async function speakNatively(text: string) {
  await NativeSpeech.speak({ text, pitch: 0.5, rate: 0.8 })
}

export async function stopNativeSpeech() {
  await NativeSpeech.stop()
}

export async function requestNativeCameraPermission() {
  if (!Capacitor.isNativePlatform()) return true
  await TuneTasticCamera.requestPermission()
  return true
}
