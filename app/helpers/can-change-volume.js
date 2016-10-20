import { helper } from 'ember-helper';

// A test to see if we can change volume on HTML5 Audio Elements.
// Mostly for iOS
// https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW11

export function canChangeVolume() {
  let audio = document.createElement('audio');
  if (audio.volume !== undefined) {
    audio.volume = 0.99; //arbitrary value
    return (audio.volume === 0.99);
  }
  // this browser doesn't seem to support HTML5 <audio>
  return false;
}

export default helper(canChangeVolume);
