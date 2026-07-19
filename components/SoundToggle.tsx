"use client";

import { useSound } from "@/lib/sound";
import { usePixelVariants } from "@/lib/pixelVariants";
import { PixelSpeakerOnIcon, PixelSpeakerOffIcon } from "./pixelIcons";

const SpeakerOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);
const SpeakerOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  const { icons } = usePixelVariants();
  const On = icons === "pixel" ? PixelSpeakerOnIcon : SpeakerOn;
  const Off = icons === "pixel" ? PixelSpeakerOffIcon : SpeakerOff;
  return (
    <button
      className="icon-btn sound-toggle"
      aria-label={enabled ? "Mute interaction sounds" : "Unmute interaction sounds"}
      aria-pressed={enabled}
      title={enabled ? "Sound on" : "Sound off"}
      onClick={toggle}
    >
      <span className="icon-swap" aria-hidden="true">{enabled ? <On /> : <Off />}</span>
    </button>
  );
}
