import { Head } from 'vite-react-ssg'

// Update at domain cutover — see docs/PHASE_CHECKLIST.md Phase 8 (No DNS
// changes until cutover, site currently lives on the Netlify subdomain).
const SITE_URL = 'https://anzacs.netlify.app'
const SITE_NAME = 'ANZ Agricrop'
const DEFAULT_IMAGE = '/anz_logos/badge.webp'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  noindex?: boolean
}

const Seo = ({ title, description, path, image = DEFAULT_IMAGE, noindex }: SeoProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  )
}

export default Seo
