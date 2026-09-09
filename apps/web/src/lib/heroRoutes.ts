// Exact-match only — /products/:slug (ProductDetail) and /contact have no
// full-bleed Hero banner, so the header should never overlay them.
export const HERO_ROUTES = ['/', '/about', '/products']

export const routeHasHero = (pathname: string): boolean => HERO_ROUTES.includes(pathname)
