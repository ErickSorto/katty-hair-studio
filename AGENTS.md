<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Katty Hair Studio One-Shot Site Reference

This file is the reconstruction contract for the Katty Hair Studio site. A future agent should be able to reproduce the current homepage on desktop and mobile from this file and the checked-in assets without inventing a new visual direction. Preserve the business facts, art direction, section order, bilingual behavior, booking behavior, and responsive geometry below.

## Project Identity

- Business: Katty Hair Studio, a Dominican-owned, full-service hair salon and beauty supply in Brentwood, Maryland.
- Address: `3816 Bladensburg Rd, Brentwood, MD 20722`.
- Primary phone: `+1 240-582-6622`; render as `(240) 582-6622`; use `tel:+12405826622`.
- WhatsApp: `+1 240-478-4065`; use `https://wa.me/12404784065`.
- Public rating snapshot: `4.8` from `156 Google reviews`. Keep the number, count, five horizontal stars, and public Google-profile link synchronized anywhere they appear.
- Offer: `$10 off all services on Mondays`. Booking applies the discount at the salon; do not describe it as an online payment discount.
- Hours: Monday `10:00 AM - 6:30 PM`; Tuesday closed; Wednesday-Friday `10:00 AM - 6:30 PM`; Saturday `8:00 AM - 4:30 PM`; Sunday `10:00 AM - 3:30 PM`.
- Main services: silk presses, Dominican blowouts, color and highlights, extensions and wigs, braids, cuts, styling, treatments, and eyebrow waxing.
- Primary conversion: request an appointment. Secondary conversions: call, WhatsApp, directions, services, gallery, and public reviews.
- Public site origin: `https://www.kattyhairstudio.com`.
- Social profiles are defined in `src/app/SiteChrome.tsx`: Instagram, Facebook, YouTube, X, and TikTok. Do not replace those URLs with placeholders.

## Visual System

### Art direction

- The page is an editorial salon composition built from real salon context, client results, portrait art, and a restrained rose palette. It must not read as a generic SaaS or card-template landing page.
- The signature image move is a warm pink salon interior behind a separate transparent red-haired model cutout. The model overlaps the background without occupying layout flow.
- Typography pairs Playfair Display for display headings with Arial/Helvetica for interface and body copy. Playfair is loaded with `next/font/google` in both locale layouts and exposed as `--font-display`.
- Use large serif headlines with tight line height, small dark-rose eyebrow labels, thin rules, low-radius rectangular controls, and occasional brass highlights. Do not introduce pill cards for general content; pills are reserved for language, compact trust chips, and the video status label.
- Corners are intentionally restrained: `--radius: 8px`; video cards use `10px`; the desktop proof band uses `6px`; circles are limited to icons, video controls, and language/button states.
- Visual depth comes from layered gradients, image shades, hairline patterns, borders, and soft wine-tinted shadows. Do not substitute a flat white background across the page.

### Design tokens

Keep the variables in `src/app/globals.css` as the source of truth:

- `--blush: #f4c8d0`
- `--blush-bright: #fbe5e9`
- `--rose: #eda2ae`
- `--rose-warm: #dd5871`
- `--mauve: #a92d50`
- `--wine: #7b1f42`
- `--oxblood: #591333`
- `--cream: #fffdfd`
- `--paper: #fffefd`
- `--sand: #fceff2`
- `--peach: #fff2f4`
- `--brass: #c19365`
- `--ink: #331b26`
- `--ink-soft: rgba(51, 27, 38, 0.72)`
- `--line: rgba(123, 31, 66, 0.16)`
- `--request-gradient: linear-gradient(135deg, #71183a, #a52b4d 58%, #d04763)`
- `--container-max: 1400px`
- `--container-pad: clamp(20px, 2.2vw, 34px)`; mobile changes this to `18px` at `740px` and below.
- `--page-gutter` combines container padding with a centered `1400px` maximum.

### Motion

- Hero eyebrow, heading, actions, and model use short staged entrance motion. Keep the model reveal delay after the text begins.
- `[data-reveal]` elements are activated once by `src/app/ViewportReveal.tsx` using an `IntersectionObserver` with `threshold: 0.08` and `rootMargin: -10% 0 -10% 0`.
- Process steps use a separate observer with `threshold: 0.3` and `rootMargin: 0 0 -16% 0`.
- Respect `prefers-reduced-motion: reduce`: reveal content immediately, activate all process steps, stop carousel auto-advance, and remove nonessential transitions.

## Codebase Map

- `src/app/(en)/page.tsx`: canonical homepage data, English and Spanish homepage copy, JSON-LD, art paths, section markup, and exported `HomePage`.
- `src/app/(es)/es/page.tsx`: Spanish metadata and `<HomePage locale="es" />`; do not fork the homepage markup.
- `src/app/globals.css`: complete visual system and responsive cascade. It is intentionally large; search for the selector before adding another override.
- `src/app/SiteChrome.tsx`: fixed announcement bar, desktop nav, mobile drawer, final banner, footer, and fixed mobile action bar.
- `src/app/ServiceNavigation.tsx`: desktop service menu and expandable drawer service directory.
- `src/app/DrawerToggleButton.tsx`: accessible open/close state and focus transfer.
- `src/app/DrawerAutoClose.tsx`: closes the drawer on drawer-link activation and Escape.
- `src/app/i18n/config.ts`: `/es` path mapping, canonical URLs, and language alternates.
- `src/app/i18n/shared-copy.ts`: header, drawer, footer, and shared navigation copy.
- `src/app/i18n/LanguageSwitcher.tsx`: EN/ES links plus `katty-locale` cookie/localStorage preference.
- `src/app/ReviewPager.tsx`: two featured review slides plus one public-Google summary slide.
- `src/app/VideoStoryStack.tsx`: three lazy-loaded vertical client videos, stacked-card state, controls, auto-advance, and captions.
- `src/app/BookingSection.tsx`: three-step live booking flow and confirmation state.
- `src/app/i18n/booking-copy.ts`: complete English/Spanish booking copy.
- `src/app/LocationSection.tsx`: address, directions, hours, and map embed.
- `src/app/ViewportReveal.tsx`: reveal and process-step observers.
- `src/app/(en)/layout.tsx` and `src/app/(es)/es/layout.tsx`: font, site metadata, locale document behavior, analytics, and share metadata.
- `src/app/robots.ts`, `src/app/sitemap.ts`, and `public/llms.txt`: crawl and discovery surfaces.
- `src/app/api/booking/**`, `src/lib/booking/**`, and `src/lib/google-calendar/**`: availability, booking, storage, calendar, email, and notification behavior. Do not mock these when the task is to preserve the real site.

## Homepage Section Order

Do not reorder these blocks. The order creates a deliberate conversion narrative: identity, proof, human testimony, process clarity, choice, price, inspiration, founder, location, booking.

1. `SiteHeader`
2. `section.hero#home`
3. `section.proof-band` on desktop; `.hero-mobile-signals` is the mobile equivalent inside the hero
4. `section.reviews-section`
5. `section.video-stories-section#client-stories`
6. `section.intro-section#visit-plan`
7. `section.services-section#services`
8. `section.category-architecture-section#service-categories`
9. `section.process-section#process`
10. `section.prices-section#prices`
11. `section.gallery-section#gallery`
12. `section.info-section#info`
13. `LocationSection` rendering `section.location-section#location`
14. `BookingSection` rendering `section.booking-experience#booking`
15. `section.home-faq-section#faq`
16. `SiteFinalBanner`
17. `SiteFooter`
18. `MobileActionBar`

At `1440x900`, the current rendered baselines are: header `130px`; hero top `130px`, height `770px`; proof band top `922px`, height `80px`; reviews top `1018px`, height `689px`; videos top `1717px`, height `1006px`; booking top `10499px`, height `849px`. At `390x844`, the header is `116px`; hero top `116px`, height `664px`; reviews top `810px`, height `1371px`; videos top `2197px`, height `1206px`; booking top `14297px`, height `1160px`. Treat these as screenshot regression baselines, not hardcoded section heights outside the hero.

## Layout And Spacing Rules

- `.site-shell` starts below the fixed header with `padding-top: var(--header-height)` and clips horizontal overflow.
- Desktop header variables: announcement `44px`, navbar `86px`, total `130px`.
- Mobile header variables: announcement `44px`, navbar `72px`, total `116px`.
- Full-width sections use `var(--page-gutter)` so content aligns with the hero, header, and footer.
- Primary desktop breakpoint groups are `1100px`, `900px`, `740px`, `620px`, and `560px`. Preserve the existing cascade instead of replacing it with a single device breakpoint.
- Desktop alternates split layouts, editorial media, and full-width narrative sections. At `900px` and below, major split sections collapse to one column. At `740px` and below, section padding becomes `56px` for core sections unless a section has a tighter specific rule.
- `html` has a `320px` minimum width and a header-aware `scroll-padding-top`. No route may create horizontal scrolling at `320px`, `360px`, `390px`, `740px`, `900px`, `1024px`, or `1440px`.
- Touch controls must remain at least `40px` high; primary mobile controls are `46-48px` high.
- Do not place content under the fixed mobile action bar. `.site-shell` reserves `72px + env(safe-area-inset-bottom)` on mobile.

## Hero Rules

### Required assets and layers

- Background: `/hero/katty-salon-interior-hero-clear-pink-v4.webp`, `1672x941`, `fill`, `quality={60}`, eager, `fetchPriority="high"`, `sizes="100vw"`.
- Foreground model: `/hero/katty-red-hair-model-cutout-v8.webp`, `667x1698`, transparent background, eager, `quality={75}`. Preserve this asset's transparency and portrait ratio.
- Background is `.hero-image` at `z-index: -4`; two gradient pseudo-elements sit above it; `.hero-model` sits at `z-index: -1`; content is above all art.
- `.hero-model` must remain absolutely positioned so it cannot push or shrink `.hero-content`.
- Keep the model's full face, red curls, white top, and lower torso visible on mobile. The visual bottom must meet the hero image region; do not leave a transparent pad or floating shadow gap above the trust strip.

### Desktop geometry

- `.hero` uses `min-height: calc(100svh - var(--header-height))`.
- `.hero-image` uses `object-fit: cover` and `object-position: 50% 50%`.
- Base model: `top: clamp(18px, 3vh, 30px)`, `right: clamp(22px, 4vw, 72px)`, width `max(clamp(360px, 37vw, 510px), calc(39.3svh - 63px))`.
- At `1280px` and above, model right is `clamp(88px, 6vw, 112px)` and width is `max(clamp(540px, 36vw, 640px), calc(39.3svh - 63px))`.
- `.hero-content` is bottom-aligned, `min(760px, 100%)` wide, and padded with `clamp(68px, 10vh, 118px)` above and `clamp(88px, 13vh, 144px)` below.
- Desktop H1 uses the single text node `Katty Hair Studio`, Playfair Display, `clamp(4.4rem, 8vw, 8.4rem)`, `0.88` line-height, and a cream-peach-brass text gradient. Keep its shadow and underline accent.
- The left content sequence is eyebrow, H1, supporting sentence, two CTA buttons, then the small review/quote line. Both CTAs must fit in the first viewport at `1440x900`.
- The left-side wine gradient must make all text readable without darkening the model's face.

### Mobile geometry

- At `740px` and below, `.hero` is exactly `calc(100svh - var(--header-height) - var(--mobile-action-height))` and has `min-height: 0`.
- Reserve `--mobile-signal-height: 86px` at the bottom of the hero. The background, shades, and model visual stop above this signal strip.
- `.hero-image` height is `calc(100% - var(--mobile-signal-height))` with `object-position: 36% 50%`.
- Model: `top: 24px`, `right: -8px`, width `max(min(85vw, 340px), calc(39.3svh - 114px))`.
- Mobile H1 is three explicit lines: `Katty`, `Hair`, `Studio`. Hide `.hero-title-desktop`; show `.hero-title-mobile`.
- Mobile H1 max width is `min(60vw, 232px)`, size `clamp(3.15rem, 14vw, 4.8rem)`, line-height `0.92`.
- Hide `.hero-copy` and `.hero-trust-line` on mobile. The proof strip replaces the trust sentence.
- Stack hero actions within `min(54vw, 204px)`. Each is at least `46px` high. The primary gradient button precedes the dark translucent services button.
- At `390x844`, the hero must show the model's entire face, all three H1 lines, both CTAs, and all three trust cells without horizontal overflow.
- At heights at or below `820px`, reduce H1 sizing using the existing short-height media query. Do not solve short heights by hiding either hero CTA.

## Trust Signal And Review Section Rules

### Hero and desktop trust signals

- Data lives in `proofPoints` and its Spanish equivalent in `src/app/(en)/page.tsx`.
- Render exactly three signals in this order: `4.8 / 156 Google reviews`, `$10 off / Mondays only`, `Upfront quote / Before service`.
- On desktop, `.proof-band` is a three-column pale-blush strip after the hero with `78px` minimum cards. The Google item is the only linked card.
- At `740px` and below, hide `.proof-band` and render the same three values through `.hero-mobile-signals` inside the hero. Each cell uses a horizontal icon/value-label arrangement and a dividing rule.

### Review narrative and carousel

- `.reviews-section` begins immediately after the hero proof. Desktop is a copy column plus a carousel column; at `1100px` and below it becomes one column.
- Heading: `See what you can expect from every visit.` Supporting copy must reference real Google reviews, careful listening, relaxing care, and a personalized finish.
- Render the three review chips in a single row when space permits: `5-star review`, `10-year client`, `Cut + styling`. Spanish may use a two-column grid with the final chip centered across both columns.
- `src/app/ReviewPager.tsx` renders exactly three slides: Faben Henok, Marimar Montero, then the Google summary. Do not add fabricated names or quotes.
- First two slides use square client images from `/reviews/`, a service/result badge, reviewer identity, horizontal five-star row, context metadata, a serif quote, and three checked highlights.
- Images lazy-render only when the pager is within `240px` of the viewport and only for the active slide. Preserve that behavior to avoid loading off-screen client imagery.
- The public Google rating signal must show the multicolor Google mark, `4.8`, five horizontal gold stars, and `156 reviews` in one compact surface on desktop.
- `.review-track` is a horizontal `scroll-snap` track with `grid-auto-columns: 100%`, hidden scrollbar, touch swiping, and programmatic previous/next controls.
- Controls are `40x40`; dots are `32x7` and the active dot expands to `46px`. Keep correct disabled states at the first and final slide.
- On mobile, the rating signal spans the top row, controls sit to the right beneath it, the swipe hint becomes visible, and each review card becomes one column with the square client image above the copy.
- Verify every `.stars` group stays horizontal on `390px`; no star may wrap into a column.

## Video Section Rules

- Section: `.video-stories-section#client-stories`; component: `src/app/VideoStoryStack.tsx`.
- Heading: `The best proof is how they talk about their hair.` Include the two chips `Real client reels` and `Unscripted results`, a booking CTA, and an Instagram link.
- Desktop is a two-column section with copy at left and a vertical story stack at right. Base section minimum height is `820px`; stack width is at most `390px`.
- Use exactly three `9:16` stories in the current order. Each story needs MP4, WebP poster, Spanish VTT caption track, eyebrow, title, detail, and descriptive accessible label.
- Assets:
  - `/video-stories/client-story-best-v1.mp4`, poster `client-story-best-v1.webp`, captions `client-story-best-v1.es.vtt`.
  - `/video-stories/client-story-shine-v1.mp4`, poster `client-story-shine-v1.webp`, captions `client-story-shine-v1.es.vtt`.
  - `/video-stories/client-story-salon-v1.mp4`, poster `client-story-salon-v1.webp`, captions `client-story-salon-v1.es.vtt`.
- Active card is straight and fully opaque. Second card translates `42px, -23px`, rotates `4.2deg`, and scales `0.945`; third translates `72px, -40px`, rotates `7deg`, and scales `0.885`.
- Load no video source until the user activates the active story. Use `preload="none"`, `playsInline`, `controlsList="nodownload"`, and show native controls only while the active video is playing.
- Begin poster loading when the stack is within `320px` of the viewport. Auto-advance every `10,000ms` only when no video plays, the user is not hovering/focusing, and reduced motion is off.
- Hide shade, custom play button, watch label, and caption while starting or playing. When playback ends, advance one story and resume carousel timing.
- At `900px` and below, collapse to one column. At `560px` and below, stack width is `min(78vw, 326px)` and the trailing cards use the smaller `20px/34px` offsets so they remain in the viewport.
- Controls are two `46x46` circular buttons with three dots between them. The active dot expands from `8px` to `28px`.

## Remaining Homepage Art And Section Rules

- Visit plan `#visit-plan`: copy and three chips at left; `/editorial/katty-reference-chestnut-layers-v4.webp` (`1122x1402`) at right with the attached `.finish-cta` asking users to share a reference.
- Services `#services`: `/gallery/katty-golden-dimension-themed.webp` at left with a lower media caption; four large linked service rows at right.
- Category architecture `#service-categories`: two editorial cards only. Hair salon uses `/hero/katty-salon-interior-hero-clear-pink-v4.webp`; extension technician uses `/services/generated/hair-extension-technician-v2.webp`.
- Process `#process`: exactly three connected steps using `/process/katty-step-1-show-goal.webp`, `katty-step-2-take-shape.webp`, and `katty-step-3-leave-ready.webp`. Desktop is horizontal; mobile is a vertical connected timeline with `118px` art.
- Prices `#prices`: four quote rows and `/editorial/katty-price-still-life.webp` (`1122x1402`) with the attached `$10 off` Monday badge. Do not publish fixed dollar prices for services that are currently quote-based.
- Founder `#info`: `/founder/katty-founder-original-portrait-v5.webp` (`613x766`), four studio information cards, founder quote, and `/awards/bestprosintown-recommended.png` (`774x488`).
- Location `#location`: address, two actions, exact hours, and the Google Maps iframe from `src/app/LocationSection.tsx`.
- FAQ `#faq`: four native `<details>` items; first item is open on initial render.
- Final banner repeats the official lockup, the line `Bring your reference. Leave with a clear plan.`, and the booking CTA.

## Mobile Rules

- The mobile contract starts at `740px`. Tablet/small-desktop adjustments also exist at `1100px` and `900px`; test both transitions.
- Mobile header shows only the Monday offer and WhatsApp in the announcement row. Hide the desktop phone center, social icons, language switcher, and Brentwood location from that row.
- Mobile navbar shows the official lockup at `52px` high and a `46x46` menu button.
- `.mobile-action-bar` is fixed above the safe area with two columns: request `1.25fr`, call `0.75fr`. Each link is at least `48px` high. It must remain visible while scrolling but must not cover booking controls or footer links.
- At `390x844`, confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- At `320px` and `360px`, announcement text may use the short label, but WhatsApp and the menu button must remain reachable.
- Mobile gallery is exactly two columns with `8px` gaps. Tile heights are `clamp(220px, 68vw, 270px)` and labels stay inset `10px` from the bottom and sides.
- Mobile booking places the atmospheric art above the form, not beside it. The booking workspace reserves bottom space for the fixed action bar only on the homepage mode.

## Drawer Rules

- Drawer state uses the hidden checkbox `#katty-drawer`; do not replace it without preserving open/close, Escape, focus transfer, link auto-close, backdrop close, and body scroll lock.
- Open button: `.menu-button`; close button: `.drawer-close-button`; backdrop: `.drawer-backdrop`; panel: `#katty-mobile-drawer.mobile-drawer`.
- Drawer width is `min(88vw, 382px)`, height and max-height are `100dvh`, and `overflow-y: auto`. It slides from the right and keeps `overscroll-behavior: contain`.
- The drawer order is fixed: brand/close, language row, navigation with expandable Services, today/hours card, address card, full-width request CTA, call/WhatsApp, then five social buttons.
- At `390x560`, the drawer must be internally scrollable. Current baseline: drawer `clientHeight 560`, `scrollHeight 599`, body overflow `hidden`, booking CTA top near `412px`, call row top near `491px`.
- At heights below `700px`, `.drawer-links` becomes two columns; gaps and card padding shrink; the request, call, and WhatsApp controls remain at least `40px` high.
- Language buttons must remain independent links. Activating EN or ES must never trigger `tel:` or WhatsApp navigation.
- Services may expand the drawer beyond one viewport; the last service link, booking CTA, and social links must remain reachable by scrolling.

## Translation Rules

- English routes are unprefixed. Spanish routes use `/es`; `localizePath()` owns path conversion.
- Spanish homepage imports the canonical `HomePage` and passes `locale="es"`. Do not duplicate the component tree into `src/app/(es)/es/page.tsx`.
- Every visible string added to the homepage, header, drawer, review pager, video stack, location, booking, FAQ, final banner, or footer must ship in both English and Spanish in the same change.
- Shared chrome copy belongs in `src/app/i18n/shared-copy.ts`; booking copy belongs in `src/app/i18n/booking-copy.ts`; page-specific copy belongs beside the data in `src/app/(en)/page.tsx`.
- `LanguageSwitcher` stores `katty-locale` for one year in a SameSite=Lax cookie and localStorage, and preserves the current query string and hash.
- `LocaleDocument` must keep `<html lang>` and `data-locale` synchronized after client navigation.
- Verify Spanish at `390px` because review chips, rating labels, booking step labels, and drawer links have longer strings.

## Review Carousel Rules

- The source of review truth is the current data in `src/app/(en)/page.tsx`, not generated placeholder copy.
- Preserve both featured client image paths and their distinct object positions.
- Review stars are SVG icons rendered as one row. Rating `4.8` is not represented as four filled stars plus a partial star; keep five gold icons alongside the numeric rating and accessible label `4.8 out of 5 stars`.
- The Google summary is the final carousel slide and must link to the public profile.
- Touch swipe, arrow navigation, dot navigation, disabled arrow state, and active dot must update the same `activeSlide` state.

## Gallery And Image Rules

- Homepage gallery renders exactly `localizedGallery.slice(0, 6)` and exactly six `.gallery-tile` elements.
- Use these active homepage files in order: `katty-glossy-body-waves-themed.webp`, `katty-golden-dimension-themed.webp`, `katty-silky-side-waves-themed-v2.webp`, `katty-copper-waves-themed.webp`, `katty-sculpted-curls-themed.webp`, `katty-vintage-curl-set-themed-v2.webp`.
- Preserve per-image `objectPosition` values from the gallery data. Centering every photo will crop faces and finished hair incorrectly.
- Use WebP for active page photos. Preserve PNG only for transparent official logos, trust plaques, and the BestProsInTown source badge.
- Real client, salon, founder, storefront, and existing project art takes priority over newly generated imagery.
- Keep descriptive alt text on content images. Background decoration must use `alt=""` and `aria-hidden="true"`.
- Do not rename public assets without updating every JSX, metadata, JSON-LD, email, and social reference found by `rg`.

## Share Preview And Metadata Rules

- Current canonical share art is `/social/katty-share-preview.webp`, exactly `1200x630`. It is referenced in both locale layouts, both homepage metadata objects, Twitter metadata, and homepage JSON-LD.
- Do not point metadata at a JPG path that does not exist. The repo currently has no static JPG version of `katty-share-preview`.
- If Messages/SMS compatibility is part of a future task, create `/public/social/katty-share-preview.jpg` at exactly `1200x630` before changing metadata. Then update English layout, Spanish layout, English homepage, Spanish homepage, Twitter images, and JSON-LD together.
- Preserve `metadataBase`, canonical URL, `en`, `es`, and `x-default` language alternates from `localizedAlternates()`.
- English Open Graph locale is `en_US` with alternate `es_US`; Spanish is the inverse.
- Preserve `summary_large_image` Twitter cards and route-specific titles/descriptions.
- Verify the rendered head, not only the TypeScript objects.

## Booking/Contact Rules

- Homepage CTA links target `#booking`. The fixed mobile request action opens the localized standalone booking page, while the full mobile action bar hides whenever an embedded `.booking-experience--section` is visible and returns after the user leaves that section.
- Booking art is `/editorial/katty-client-plan-result-v2.webp` (`1023x1537`) with a wine shade, inset border, serif heading, Monday note, and payment-at-salon note.
- Booking is a three-step flow: service, schedule, details. Preserve progress semantics, backwards navigation, validation, focus movement, loading states, empty states, and confirmation state.
- Service step loads `/api/booking/catalog`; schedule step loads `/api/booking/availability`; submission posts JSON to `/api/booking`.
- Production availability and booking depend on Supabase and Google Calendar. Demo behavior is gated by `NEXT_PUBLIC_BOOKING_DEMO_MODE === "true"`; never enable demo mode silently in production.
- Required contact fields are name, email, and phone. Notes are optional and capped at `1000` characters. SMS consent is optional and links to terms and privacy.
- Do not transmit form data during visual QA. Visual tests may select a service and inspect schedule UI, but must stop before booking submission unless the user explicitly authorizes a test booking.
- Preserve time-passed checks, time zone formatting, Monday savings display, confirmation code, email/SMS confirmation copy, and local-test calendar link behavior.
- All call links use `tel:+12405826622`; all WhatsApp links use `https://wa.me/12404784065`; map links use the encoded `3816 Bladensburg Rd` query.

## Known Pitfalls

- The hero is made from two separate images. Replacing them with one flattened image removes responsive model positioning and usually crops the face on mobile.
- Transparent padding in the model asset can create a visible floating gap. Inspect the rendered alpha edge at the bottom; CSS `bottom: 0` alone does not prove visual contact.
- `.hero-model` must stay outside layout flow. A relative image in the grid will push the copy and move both CTAs below the first viewport.
- Mobile trust signals live inside the hero; desktop trust signals live after it. Rendering both on mobile duplicates the proof and breaks the height calculation.
- The fixed header, anchor scrolling, and fixed mobile action bar interact. Preserve `scroll-padding-top` for in-page booking links, and keep the mobile action bar visibility observer synchronized with the embedded booking section and the fixed header/action-bar heights.
- The drawer can be taller than short phones. Never switch `.mobile-drawer` to `overflow: hidden`.
- Review images intentionally lazy-render by active slide. A blank inactive slide before navigation is not a broken URL; test after activating that slide.
- The video section intentionally defers MP4 source assignment. Do not add `autoPlay` or eager `src` attributes to all three videos.
- Spanish text requires separate small-screen checks; do not assume English layout proves Spanish layout.
- `src/app/globals.css` has later route-specific and responsive overrides. Search the full file before editing an earlier selector, then inspect the final cascade.
- Current share metadata uses WebP. Do not document or deploy a JPG until the file exists.
- Booking is real application behavior, not a decorative contact form. Do not replace it with a static form for a visual rebuild.
- The working tree may contain unrelated booking and social-post work. Inspect `git status` and `git diff` before editing; never reset or overwrite user changes.

## Verification Checklist

Run these checks before claiming the homepage has been reproduced or changed:

1. Read the relevant Next.js 16.2.10 guide in `node_modules/next/dist/docs/` before changing framework code.
2. Run `npm run lint`.
3. Run `npm run check:booking-i18n` when booking or translated booking copy changes.
4. Run `npm run build`.
5. Run `git status --short` and report unrelated changes without reverting them.
6. Capture the English homepage at `1440x900`, `1024x768`, `390x844`, `390x560`, `360x800`, and `320x700`.
7. Capture the Spanish homepage at `1440x900` and `390x844`.
8. At `1440x900`, verify fixed header height near `130px`, hero height near `770px`, both hero CTAs in the first viewport, model face unobscured, and model bottom visually grounded.
9. At `390x844`, verify header height near `116px`, hero height near `664px`, three-line H1, both hero CTAs, all three trust cells, and fixed request/call bar.
10. At `390x560`, open the drawer. Verify body scroll lock, internal drawer scrolling, close button, language row, two-column nav, address, booking CTA, call, WhatsApp, and social buttons.
11. In the drawer, switch EN to ES and ES to EN. Verify the path changes correctly and neither action navigates to `tel:` or WhatsApp.
12. Review section: verify three chips, two real client slides plus summary slide, five horizontal stars, previous/next disabled states, swipe, three dots, and active-dot movement.
13. Video section: verify three cards, 9:16 ratio, stacked offsets, poster load near viewport, one user-triggered playback, native controls during playback, Spanish captions, next/previous controls, and no eager loading of all MP4 sources.
14. Gallery: assert `document.querySelectorAll('.gallery-tile').length === 6` and every `.gallery-tile img` has `naturalWidth > 0`.
15. Overflow: assert `document.documentElement.scrollWidth === document.documentElement.clientWidth` at every mobile viewport.
16. Booking: verify service, schedule, and details step layouts without submitting; verify the mobile form is not covered by `.mobile-action-bar`.
17. Metadata: inspect the rendered English and Spanish head for canonical, language alternates, Open Graph image, width `1200`, height `630`, locale, alternate locale, and Twitter image. Request the image URL and verify a successful image response.
18. Check browser console output for image, hydration, accessibility, and API errors.

## Safe Editing Guidance

- Preserve existing user changes. Before editing, run `git status --short` and inspect any diff touching the same file.
- Use the existing components and data arrays before creating new components. This keeps English/Spanish structure synchronized.
- Keep business facts centralized to the existing source files; if a fact changes, search the entire repo with `rg` and update every public occurrence in one task.
- Preserve `next/image` dimensions, `sizes`, eager/lazy loading intent, and `quality` values unless a measured performance or crop issue requires a change.
- Do not delete old public assets as part of a page edit. Confirm they are unreferenced across JSX, CSS, metadata, JSON-LD, email templates, and scripts first.
- Do not commit generated social-post assets, local calendar tokens, `.env` files, Supabase secrets, or `.data` contents unless the task explicitly targets them and the files are safe to publish.
- Keep all booking secrets and Supabase keys server-only. Client components may call API routes but must not import server credentials or server-only storage helpers.
- After CSS changes, verify the actual browser at every listed viewport. Lint and build do not verify image crop, overlap, drawer reachability, or fixed-bar coverage.
