# andy-portfolio

Personal engineering portfolio for Andy Alvarez. Angular 22 (standalone components, SCSS, no SSR), built from the "PS2 Chrome Head-Unit" design (mockup C).

## Run

```bash
npm install
npx ng serve --port 4200     # dev server → http://localhost:4200
npx ng build                 # production build → dist/andy-portfolio/browser
```

This is local only. Nothing is deployed and there's no git remote.

## Where things live

| What | File |
|---|---|
| Name, title, stats, contact links | `src/app/data/profile.ts` |
| Featured case studies (PCM, EV WPT) | `src/app/data/cases.ts` |
| Project cards | `src/app/data/projects.ts` |
| Resume (timeline, document, skills) | `src/app/data/resume.ts` |
| **All YouTube videos** | `src/app/data/videos.ts` |
| Own clips, IEEE paper, PCM photo | `src/app/data/media.ts` |
| Images / clips / PDF / fonts | `public/assets/{media,video,docs,fonts}` |
| Theme tokens, buttons, section headings | `src/styles.scss`, `src/styles/_mixins.scss` |

The components are in `src/app/components/` (header, hero, featured-case, projects, video-row, resume, contact). Shared players are in `src/app/shared/` (yt-embed, inline-video, pdf-viewer, viewer-frame).

## Adding or removing a video

Edit `src/app/data/videos.ts`. Each entry looks like this:

```ts
{ id: 'YOUTUBE_ID', title: '…', source: 'Guident', date: 'Jul 2025',
  placement: 'row',          // 'hero' = hero card, 'pcm' = PCM case study, 'row' = "In the field" row
  enabled: true, andyConfirmed: false }
```

- To hide a video, set `enabled: false`.
- To add a local thumbnail, drop `public/assets/media/yt/<id>_max.jpg` in and set `thumb`. Without one, YouTube's `hqdefault` thumbnail is used.
- YouTube loads only after a click: the page shows a local thumbnail, then swaps in a `youtube-nocookie.com` iframe. YouTube's own logo stays inside the iframe and can't be removed.

## Media rules

- **No downloads or outbound "watch on YouTube" links.** Own clips play in `<video controlsList="nodownload">` with the right-click menu disabled. The IEEE paper renders with pdf.js onto canvases, with no download or print buttons. A determined visitor can still save media from DevTools.
- **The resume renders as HTML** from `data/resume.ts` instead of embedding the PDF, because the PDF contains a phone number. The site shows no phone number or street address.
- **PCM passenger photo:** `PCM_PHOTO.approved` in `data/media.ts` is `false`, so the photo is hidden. The file is still in `public/assets/media/`, so it gets served if someone requests it directly. Delete it until it's approved.
- The IEEE Access paper (Behnamfar, Tariq & Sarwat) is CC BY-NC-ND 4.0 and is shown unmodified, with credit.

## Fonts

Orbitron, Chakra Petch, VT323 and IBM Plex Sans are bundled as TTF in `public/assets/fonts` under SIL OFL 1.1 (see `OFL-NOTICE.txt`). Nothing loads from a font CDN.
