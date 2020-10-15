export const youtubeId = (url: string): string => {
  if(!url) return ''
  const match = url.match(/\?v=([\w-]+)/)
  if(match) {
    return match[1]
  }
  else {
    return url
  }
}

export default {
  youtubeId,
}