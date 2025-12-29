enum ImageModels {
  FLUX_PRO = 'fal-ai/flux-pro',
  FLUX_GENERAL = 'fal-ai/flux-general',
  FLUX_DEV = 'fal-ai/flux/dev',
  FLUX_SCHNELL = 'fal-ai/flux/schnell',
  SDXL_LIGHTNING = 'fal-ai/fast-lightning-sdxl',
  AURA_FLOW = 'fal-ai/aura-flow',
  FLUX_SCHNELL_IMG_2_IMG = 'fal-ai/flux/dev/image-to-image'
}

export const DEFAULT_IMAGE_MODEL: ImageModels = ImageModels.FLUX_SCHNELL;
export const IMAGE_GENERATION_PRICE = 20;
