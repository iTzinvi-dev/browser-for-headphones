# Zenith X — Scrollytelling Landing Page

A high-end scrollytelling headphone brand page with scroll-linked canvas animation.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add image frames to public folder

Place all your frame images inside `public/frames/`:

```
public/
  frames/
    ezgif-frame-001.jpg
    ezgif-frame-002.jpg
    ...
    ezgif-frame-184.jpg
```

**Quick setup from the provided zip:**
```bash
# From the project root:
mkdir -p public/frames
unzip /path/to/ezgif-7597fc87bf819f92-jpg.zip -d public/frames/
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
npm run build
npm run start
```

---

## Architecture

```
app/
  layout.tsx               # Root layout with Inter font
  page.tsx                 # Entry point
  globals.css              # Tailwind base + custom scrollbar
  components/
    HeadphoneScroll.tsx    # Core scrollytelling component
    FooterSection.tsx      # Specs + CTA footer
public/
  frames/                  # 184 JPG image frames (you add these)
```

## How it works

1. **HeadphoneScroll.tsx** creates a `h-[400vh]` scroll container
2. A `<canvas>` is `sticky top-0 h-screen` inside it
3. `useScroll` from Framer Motion tracks scroll progress 0→1
4. Progress is mapped to frame index 0→183 via `useTransform`
5. Each `useMotionValueEvent` tick draws the current frame via `requestAnimationFrame`
6. Text overlays fade in/out based on scroll progress thresholds
7. Canvas scales via `devicePixelRatio` for crisp rendering on retina displays

## Customization

**Frame count:** Change `TOTAL_FRAMES = 184` in `HeadphoneScroll.tsx`

**Scroll sections height:** Change `h-[400vh]` — more vh = slower scroll through frames

**Text sections:** Edit the `TEXT_SECTIONS` array — adjust `startProgress`/`endProgress` (0.0–1.0)

**Background color:** Change `#050505` throughout (matches the image sequence background)

## Performance notes

- All 184 frames are preloaded on mount — loading progress shown
- RAF-batched canvas draws prevent duplicate renders
- `will-change: opacity, transform` on text overlays
- Canvas is sized with `devicePixelRatio` for crisp retina rendering
