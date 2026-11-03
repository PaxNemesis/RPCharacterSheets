// Images are only ever stored as raster data URLs made by shrinkImage. Anything else in a loaded
// file, such as a link to another site, would make the browser fetch it, so it isn't shown.
const IMAGE_DATA = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+=*$/

export const isImageData = (value: unknown): value is string => typeof value === 'string' && IMAGE_DATA.test(value)
