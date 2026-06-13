/** Video dosyalarını `public/bk-signs/videos/` altına koy. Yoksa CSS animasyonu kullanılır. */
export const SIGNS_VIDEO_SLOTS = {
  sun: "/bk-signs/videos/01-sun.mp4",
  supernova: "/bk-signs/videos/02-supernova.mp4",
  burst: "/bk-signs/videos/03-burst.mp4",
  ironEarth: "/bk-signs/videos/04-iron-earth.mp4",
} as const;

export const SIGNS_VIDEO_PROMPTS = {
  sun: {
    image: `Cinematic deep space, our Sun as a small bright sphere drifting through the Milky Way, subtle solar corona, dark void background, photorealistic, 8k, no text, no watermark, widescreen 16:9`,
    motion: `Slow forward drift through space, gentle parallax stars, sun glow pulses subtly, seamless loop, cinematic`,
  },
  supernova: {
    image: `The Sun transforming into a red giant star, deep space, dramatic scale, crimson orange plasma, scientific accuracy, dark background, photorealistic, 8k, no text, widescreen 16:9`,
    motion: `Star slowly expands and brightens, surface turbulence, red shift intensifies, cinematic slow zoom`,
  },
  burst: {
    image: `Supernova explosion in space, iron-rich stellar core ejecting, brilliant white-gold flash, cosmic debris, scientific visualization, dark void, 8k, no text, widescreen 16:9`,
    motion: `Explosive outward burst, shockwave ring expands, particles scatter, one-shot dramatic explosion not loop`,
  },
  ironEarth: {
    image: `Meteorites containing iron streaking toward Earth atmosphere, night side of planet, glowing trails, scientific, cinematic, dark space, photorealistic, 8k, no text, widescreen 16:9`,
    motion: `Meteors fall toward camera, atmospheric entry glow, slow cinematic descent, seamless loop`,
  },
} as const;
