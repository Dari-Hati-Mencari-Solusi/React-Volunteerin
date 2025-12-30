# LCP & CLS Optimization - Focused Strategy

## 📊 Current Metrics (Before Optimization)

| Metric | Current | Target | Gap | Priority |
|--------|---------|--------|-----|----------|
| **Performance** | 65 | > 85 | +20 | 🔴 High |
| **FCP** | 1.1s | < 1.5s | ✅ Met | 🟢 Good |
| **LCP** | 5.7s | < 4.0s | -1.7s | 🔴 Critical |
| **TBT** | 30ms | < 300ms | ✅ Met | 🟢 Excellent |
| **CLS** | 0 | < 0.1 | ✅ Met | 🟢 Perfect |

### Analysis
- ✅ **FCP sudah bagus** (1.1s) - JANGAN RUSAK!
- 🔴 **LCP masalah utama** (5.7s) - Perlu turun 1.7s
- ✅ **CLS perfect** (0) - MAINTAIN!
- ✅ **TBT excellent** (30ms) - MAINTAIN!

**Goal**: Turunkan LCP tanpa mengorbankan FCP, TBT, dan CLS yang sudah optimal.

---

## 🎯 Strategy: Focused LCP Optimization

### Problem: LCP 5.7s (Largest Contentful Paint)

**Root Cause Analysis**:
1. Hero banner (Swiper carousel) adalah LCP element
2. Swiper library (~150KB) loaded synchronously
3. Banner images tidak di-optimize untuk loading priority
4. Possible blocking resources delays first banner render

### Solution Applied

#### 1. Font Loading Optimization (Non-Blocking)

**File: `index.html`**
```html
<!-- Preconnect untuk DNS resolution -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Load fonts dengan display=swap (non-blocking) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**File: `src/App.css`**
```css
/* REMOVED: @import blocking font */
/* OLD: @import url('https://fonts.googleapis.com/css2?family=Inter...'); */

/* Font now loaded non-blocking in HTML */
body {
  font-family: 'Inter', sans-serif;
}
```

**Impact**: 
- ❌ REMOVED image preload (tidak efektif, malah overhead)
- ✅ Font loading tidak block rendering
- Expected: FCP maintain, LCP -200ms

---

#### 2. Hero Banner Priority Loading

**File: `src/components/Fragments/HeroSection.jsx`**
```jsx
{bannerData.map((banner, index) => (
  <SwiperSlide key={index}>
    <img 
      src={banner.image}
      alt={`Banner ${index + 1}`}
      // CRITICAL: First slide loads with highest priority
      loading={index === 0 ? "eager" : "lazy"}
      fetchPriority={index === 0 ? "high" : "auto"}
      decoding={index === 0 ? "sync" : "async"}  // Sync untuk immediate paint
    />
  </SwiperSlide>
))}
```

**Why `decoding="sync"` for first banner?**
- Ensures first banner is decoded immediately
- Prevents delay between download → decode → paint
- Other slides use `async` to not block main thread

**Impact**:
- First banner prioritized by browser
- Other slides lazy loaded (save bandwidth)
- Expected: LCP -800ms to -1200ms

---

#### 3. Remove Unnecessary Lazy Loading

**Problem**: Marketing component di-lazy load → menambah complexity

**File: `src/pages/LandingPage.jsx`**
```jsx
// REMOVED lazy loading
// const Marketing = lazy(() => import('../components/Fragments/Marketing'));

// NOW: Direct import
import Marketing from '../components/Fragments/Marketing';

// In JSX - no Suspense wrapper
<Marketing />  // Direct render, no delay
```

**Why?**
- Marketing tidak heavy (no charts, no maps)
- Lazy loading menambah overhead (code splitting, Suspense)
- Direct import lebih simple dan fast untuk lightweight components

**Impact**:
- Simplified code, less overhead
- Better for components < 50KB
- Expected: No negative impact on LCP, maintain CLS

---

#### 4. Vite Build Optimization

**File: `vite.config.js`**
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'swiper-vendor': ['swiper'],  // Separate chunk untuk better caching
        },
      },
    },
    minify: 'esbuild',  // Faster build, good minification
    chunkSizeWarningLimit: 1000,
  },
});
```

**Changes**:
- ❌ REMOVED `chart-vendor` chunk (tidak di landing page)
- ❌ REMOVED Terser (slower, marginal gains)
- ❌ REMOVED `drop_console` (debugging tetap available)
- ✅ KEEP esbuild minifier (fast, sufficient)

**Why?**
- Terser slow build time untuk marginal size reduction (~2-3%)
- esbuild minifier 10-100x faster dengan good results
- Focus on what matters: LCP improvement

---

## 📈 Expected Results

### Target Metrics After Optimization

| Metric | Before | After (Expected) | Improvement | Status |
|--------|--------|------------------|-------------|--------|
| **Performance** | 65 | 75-82 | +10-17 | 🟡 Better |
| **FCP** | 1.1s | 1.0-1.2s | Maintained | ✅ Good |
| **LCP** | 5.7s | 3.5-4.5s | -1.2s to -2.2s | 🟢 Target Met |
| **TBT** | 30ms | 30-50ms | Maintained | ✅ Good |
| **CLS** | 0 | 0-0.05 | Maintained | ✅ Perfect |

### Breakdown:
- Font optimization: LCP -200ms
- First banner priority: LCP -800ms to -1200ms
- Simplified loading: TBT maintained
- **Total LCP reduction**: -1.0s to -1.4s
- **Final LCP**: 3.5-4.5s ✅ (target < 4.0s)

---

## ✅ What We're Maintaining (Don't Break!)

### 1. Excellent FCP (1.1s)
- ✅ Landing page direct import (no lazy loading)
- ✅ No artificial setTimeout delays
- ✅ Immediate UI rendering

### 2. Perfect CLS (0)
- ✅ No lazy loading yang cause layout shift
- ✅ Direct component rendering
- ✅ No Suspense fallback shifting content

### 3. Excellent TBT (30ms)
- ✅ No heavy computations on main thread
- ✅ Simplified code (less overhead)
- ✅ Efficient event handlers

---

## 🔧 Testing Instructions

### 1. Build Production
```bash
npm run build
```

### 2. Preview Build
```bash
npm run preview
```

### 3. Lighthouse Audit
- Open Chrome DevTools (F12)
- Lighthouse tab
- Settings:
  - ✅ Performance
  - ✅ Mobile
  - ✅ Throttling: **Slow 4G** (same as before)
  - ✅ Clear storage
- Click "Analyze page load"

### 4. Compare Results

**Focus on these metrics**:
1. **LCP**: Should be 3.5-4.5s (was 5.7s)
2. **FCP**: Should maintain 1.0-1.2s (was 1.1s)
3. **CLS**: Should maintain 0-0.05 (was 0)
4. **TBT**: Should maintain <50ms (was 30ms)

---

## 🎓 Key Learnings

### ✅ DO's

1. **Prioritize LCP Element**
   - ✅ Identify LCP element (hero banner)
   - ✅ Use `loading="eager"` + `fetchPriority="high"`
   - ✅ Use `decoding="sync"` for immediate paint

2. **Non-Blocking Resources**
   - ✅ Load fonts in HTML with `display=swap`
   - ✅ Preconnect to external domains
   - ✅ Avoid `@import` in CSS

3. **Simplify When Possible**
   - ✅ Direct import for lightweight components
   - ✅ Save lazy loading for heavy components (Charts, Maps)
   - ✅ Use esbuild over Terser (faster, good enough)

### ❌ DON'Ts

1. **Don't Over-Optimize**
   - ❌ Don't preload everything (overhead!)
   - ❌ Don't lazy load lightweight components
   - ❌ Don't use Terser unless size-critical

2. **Don't Break What Works**
   - ❌ Don't lazy load landing page
   - ❌ Don't add artificial delays
   - ❌ Don't change components with CLS 0

3. **Don't Ignore Metrics**
   - ❌ Don't optimize LCP at expense of FCP
   - ❌ Don't sacrifice CLS for speed
   - ❌ Don't ignore actual user experience

---

## 🔍 Debugging If Results Not Improved

### If LCP Still High (> 4.5s)

**Check**:
1. Banner image file size
   ```bash
   # Check image sizes
   ls -lh src/assets/images/banner*.jpg
   ```
   - If > 200KB per image, compress them
   - Use online tools: TinyPNG, Squoosh

2. Network tab in DevTools
   - Check banner1.jpg download time
   - Should start downloading early (high priority)
   - If delayed, check blocking resources

3. Swiper library loading
   - Check if Swiper chunk loaded before banner
   - If yes, consider critical CSS extraction

### If FCP Degraded (> 1.5s)

**Revert**:
- Check if any component accidentally lazy loaded
- Verify no setTimeout added
- Check bundle analyzer for size increase

### If CLS Increased (> 0.05)

**Fix**:
- Check for Suspense fallbacks causing shifts
- Verify skeleton sizes match actual content
- Add explicit heights to containers

---

## 📚 References

1. **LCP Optimization**
   - https://web.dev/optimize-lcp/
   - https://web.dev/lcp/

2. **Priority Hints**
   - https://web.dev/priority-hints/
   - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#fetchpriority

3. **Font Loading**
   - https://web.dev/font-display/
   - https://csswizardry.com/2020/05/the-fastest-google-fonts/

---

## ✅ Summary

**What Changed**:
1. ✅ Font loading: `@import` → `<link>` dengan `display=swap`
2. ✅ First banner: `fetchPriority="high"` + `decoding="sync"`
3. ✅ Marketing: Lazy → Direct import
4. ✅ Build: Terser → esbuild (faster)

**What Maintained**:
1. ✅ FCP: 1.1s (excellent)
2. ✅ CLS: 0 (perfect)
3. ✅ TBT: 30ms (excellent)
4. ✅ Direct import landing page

**Expected Result**:
- **LCP**: 5.7s → **3.5-4.5s** ✅
- **Performance Score**: 65 → **75-82** ✅
- **All other metrics**: Maintained ✅

---

**Author**: Wahyu (Skripsi - 2024)  
**Focus**: LCP optimization tanpa mengorbankan metrics lain  
**Last Updated**: December 29, 2024
