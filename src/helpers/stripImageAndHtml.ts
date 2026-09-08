const stripImagesAndHtml = (html?: string) => {
  if (!html) return ''
  // remove img tags first
  const withoutImgs = html.replace(/<img[^>]*>/gi, '')
  // use DOMParser on client for robust extraction
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(withoutImgs, 'text/html')
      return doc.body.textContent || ''
    } catch {
      // fallback to regex
    }
  }
  return withoutImgs.replace(/<[^>]*>/g, '')
}

export default stripImagesAndHtml