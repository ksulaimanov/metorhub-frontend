const ABSOLUTE_URL_RE = /^[a-z][a-z\d+\-.]*:\/\//i

const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const joinUrl = (base: string, path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

const gcsPublicBaseUrl = normalizeBaseUrl(import.meta.env.VITE_GCS_PUBLIC_BASE_URL)

export function resolveMediaUrl(source?: string | null): string | undefined {
  if (!source) return undefined

  const trimmed = source.trim()
  if (!trimmed) return undefined

  // Keep already-resolvable URL-like sources as-is.
  if (
    ABSOLUTE_URL_RE.test(trimmed)
    || trimmed.startsWith('//')
    || trimmed.startsWith('data:')
    || trimmed.startsWith('blob:')
  ) {
    return trimmed
  }

  if (gcsPublicBaseUrl) {
    return joinUrl(gcsPublicBaseUrl, trimmed)
  }

  return trimmed
}

