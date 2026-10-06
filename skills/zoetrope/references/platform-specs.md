# Platform Specs & Export Settings (2026)

## Master files

Render one master per aspect, then upload natively to each platform (never re-upload a download — stacked compression + watermark suppression).

| Aspect | Resolution | Use for |
|---|---|---|
| 9:16 | 1080×1920 | TikTok, Reels, Shorts, Stories |
| 1:1 | 1080×1080 | Feed posts (IG/FB/X/LinkedIn fallback) |
| 4:5 | 1080×1350 | IG/FB/LinkedIn feed (best feed visibility) |
| 16:9 | 1920×1080 | YouTube long-form, X, LinkedIn, website embeds |

Universal codec settings: **H.264 video + AAC audio, 30fps** (60fps ok if the motion is fast), bitrate **8–15 Mbps** for 1080×1920 (high master survives re-encode), max file ~500MB. Remotion default `h264` codec + `--crf=18` is a good master setting.

## Duration limits & sweet spots

| Platform | Max | Sweet spot |
|---|---|---|
| TikTok | 10 min in-app | 15–30s |
| Instagram Reels | 15 min upload | < 60s (feed crops preview to 4:5) |
| YouTube Shorts | 3 min | 15–60s |
| LinkedIn | 15 min | 30–90s |
| X | 2:20 (free) | 15–45s |

Launch reels: aim 15–30s. Faceless shorts: 20–45s.

## Safe zones — keep all text/logos/CTAs inside

Cross-platform conservative zone on a 1080×1920 frame (works everywhere):

- **Top: 250px** clear
- **Bottom: 576px** clear (YouTube Shorts has the biggest bottom UI)
- **Left: 60px**, **Right: 164px** clear (right rail of like/comment/share buttons)

Per-platform detail (1080×1920):

- **TikTok**: top 108px, bottom 320px, left 60px, right 120px
- **Reels**: top ~270px (14%), bottom ~670px (35%), sides ~65px (6%); boosted posts: safe area 1010×1280, offset 220px top / 420px bottom
- **Shorts**: top ~250px, bottom ~400px+

The template's `lib/safeZones.ts` exposes these as constants and a `<SafeZone>` overlay component for dev previews (strip it or disable before final render).

## Instagram feed crop trap

A 9:16 Reel displays as a **4:5 center crop** in the home feed — top and bottom ~285px can be cut. Keep the hook readable in the center 1080×1350.

## Covers / thumbnails

Frame 0 is your cover on TikTok; design it as the thumbnail. IG grid crops to 4:5 (1080×1350); YT Shorts poster is the first frame.
