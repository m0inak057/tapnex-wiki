# Vercel Configuration Notes

## Cache-Control Strategy

### HTML Files and General Content
- **Rule**: `"source": "/(.*)"` (applies to all files not matching specific patterns)
- **Cache-Control**: `public, s-maxage=60, stale-while-revalidate=300`
- **Explanation**:
  - `s-maxage=60`: CDN (Vercel Edge Network) caches content for 60 seconds
  - `stale-while-revalidate=300`: Allows serving stale content for up to 5 minutes while revalidating in the background
  - **Benefits**: Improves performance while ensuring relatively fresh content for HTML pages
  - **Previous setting**: `public, max-age=0, must-revalidate` (no browser caching)

### Static Assets (Immutable)
The following file types use aggressive long-term caching:

#### CSS Files
- **Pattern**: `/(.*)\\.css`
- **Cache-Control**: `public, max-age=31536000, immutable`
- Cached for 1 year (assumes versioned/hashed filenames)

#### JavaScript Files
- **Pattern**: `/(.*)\\.js`
- **Cache-Control**: `public, max-age=31536000, immutable`
- Cached for 1 year (assumes versioned/hashed filenames)

#### PNG Images
- **Pattern**: `/(.*)\\.png`
- **Cache-Control**: `public, max-age=31536000, immutable`
- Cached for 1 year

## URL Handling
- `cleanUrls: true` - Removes `.html` extension from URLs
- `trailingSlash: false` - URLs don't end with trailing slashes

## Rewrites
- `/volunteer-systems` → `/EVENT-MANAGEMENT/volunteer-systems/index.html`
- `/ticketing-platform` → `/EVENT-MANAGEMENT/ticketing-platform/index.html`

## Performance Considerations
This caching strategy provides a good balance between:
- **Performance**: CDN caching and stale-while-revalidate reduce latency
- **Freshness**: HTML content is revalidated every 60 seconds at the CDN level
- **Asset optimization**: Static assets are cached aggressively for optimal performance
