# 🖼️ LazyImage Component - Usage Examples

## Kapan JANGAN Gunakan LazyImage

```jsx
❌ JANGAN gunakan untuk:
1. Hero banner / LCP images
2. Above-fold content
3. Logo / Critical UI elements
4. Images yang langsung terlihat saat page load

// ❌ SALAH - Hero banner adalah LCP element
import LazyImage from './components/Images/LazyImage';

function HeroSection() {
  return (
    <LazyImage 
      src={heroBanner}
      alt="Hero Banner"
    />
  );
}

// ✅ BENAR - Hero banner dengan eager loading
function HeroSection() {
  return (
    <img 
      src={heroBanner}
      alt="Hero Banner"
      loading="eager"
      fetchpriority="high"
      width="1200"
      height="675"
    />
  );
}
```

---

## Kapan HARUS Gunakan LazyImage

```jsx
✅ GUNAKAN untuk:
1. Event thumbnails (below-fold)
2. User avatars (non-critical)
3. Gallery images
4. Product images (below-fold)
5. Partner logos (non-critical)
```

---

## 📖 Usage Examples

### Example 1: Event Card (Below-fold)

```jsx
import LazyImage from '../../components/Images/LazyImage';
import placeholderImg from '../../assets/images/placeholder.jpg';

function EventCard({ event }) {
  return (
    <div className="event-card">
      {/* ✅ BENAR - Event thumbnail below-fold */}
      <LazyImage
        src={event.imageUrl}
        alt={event.title}
        placeholder={placeholderImg}
        aspectRatio="16/9"
        className="rounded-lg"
      />
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </div>
  );
}
```

### Example 2: User Avatar

```jsx
import LazyImage from '../../components/Images/LazyImage';
import defaultAvatar from '../../assets/images/default-avatar.png';

function UserProfile({ user }) {
  return (
    <div className="profile">
      {/* ✅ BENAR - Avatar dengan aspect ratio 1:1 */}
      <LazyImage
        src={user.avatarUrl}
        alt={user.name}
        placeholder={defaultAvatar}
        aspectRatio="1/1"
        width={100}
        height={100}
        className="rounded-full"
      />
      <h2>{user.name}</h2>
    </div>
  );
}
```

### Example 3: Event Detail Banner (Above-fold but not LCP)

```jsx
import LazyImage from '../../components/Images/LazyImage';

function EventDetail({ event }) {
  return (
    <div className="event-detail">
      {/* 
        ⚠️ CATATAN: Jika banner ini adalah LCP element,
        jangan gunakan LazyImage. Gunakan <img> biasa dengan
        loading="eager" dan fetchpriority="high"
      */}
      
      {/* ✅ OK jika bukan LCP (ada navbar di atas, dll) */}
      <LazyImage
        src={event.bannerUrl}
        alt={event.title}
        aspectRatio="16/9"
        width={1200}
        height={675}
        className="w-full"
      />
      
      {/* Event details... */}
    </div>
  );
}
```

### Example 4: Gallery (Multiple Images)

```jsx
import LazyImage from '../../components/Images/LazyImage';

function PhotoGallery({ photos }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <LazyImage
          key={photo.id}
          src={photo.url}
          alt={`Gallery ${index + 1}`}
          aspectRatio="4/3"
          className="rounded-lg hover:scale-105 transition-transform"
        />
      ))}
    </div>
  );
}
```

### Example 5: Partner Logo List

```jsx
import LazyImage from '../../components/Images/LazyImage';
import logoPlaceholder from '../../assets/images/logo-placeholder.png';

function PartnerLogos({ partners }) {
  return (
    <div className="partners-section">
      <h2>Partner Kami</h2>
      <div className="flex flex-wrap gap-4">
        {partners.map((partner) => (
          <LazyImage
            key={partner.id}
            src={partner.logoUrl}
            alt={partner.name}
            placeholder={logoPlaceholder}
            aspectRatio="4/3"
            width={200}
            height={150}
            className="partner-logo"
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Aspect Ratio Guide

```jsx
// Common aspect ratios:

// Square (Profile pictures, icons)
aspectRatio="1/1"

// Landscape (Event banners, hero images)
aspectRatio="16/9"   // Widescreen
aspectRatio="4/3"    // Classic
aspectRatio="3/2"    // Photo

// Portrait
aspectRatio="2/3"
aspectRatio="9/16"   // Mobile/vertical video

// Custom
aspectRatio="21/9"   // Ultra-wide
```

---

## 🔧 Props Reference

```jsx
<LazyImage
  src={string}              // Required: URL gambar asli
  alt={string}              // Required: Alt text
  placeholder={string}      // Optional: URL placeholder/blur image
  className={string}        // Optional: CSS classes
  skeletonClassName={string}// Optional: Skeleton CSS classes
  aspectRatio={string}      // Optional: e.g., "16/9", default "16/9"
  width={number}            // Optional: Explicit width (better CLS)
  height={number}           // Optional: Explicit height (better CLS)
/>
```

---

## ⚡ Performance Impact

### Without LazyImage (Default img):
```jsx
<img src={largeImage} alt="Event" />

❌ Problems:
- All images load immediately (slow page load)
- High bandwidth usage
- Poor performance on slow connections
```

### With LazyImage (Optimized):
```jsx
<LazyImage 
  src={largeImage} 
  alt="Event"
  aspectRatio="16/9"
/>

✅ Benefits:
- Only loads when in viewport (faster page load)
- Reserved space prevents CLS
- Skeleton provides better UX
- Lower initial bandwidth
```

---

## 🎯 Best Practices

### 1. Always Provide Aspect Ratio
```jsx
// ❌ BAD - No aspect ratio = potential CLS
<LazyImage src={img} alt="Event" />

// ✅ GOOD - Fixed aspect ratio
<LazyImage src={img} alt="Event" aspectRatio="16/9" />
```

### 2. Use Explicit Dimensions When Possible
```jsx
// ✅ BETTER - Explicit dimensions for better CLS
<LazyImage 
  src={img} 
  alt="Event"
  width={800}
  height={450}
/>
```

### 3. Provide Placeholder
```jsx
// ✅ GOOD - Placeholder for better UX
<LazyImage 
  src={img} 
  alt="Event"
  placeholder={placeholderImg}
  aspectRatio="16/9"
/>
```

### 4. Match Skeleton Class with Final Image
```jsx
// ✅ GOOD - Skeleton matches final image style
<LazyImage 
  src={img} 
  alt="Event"
  className="rounded-lg shadow-md"
  skeletonClassName="rounded-lg"
  aspectRatio="16/9"
/>
```

---

## 🐛 Common Mistakes

### Mistake 1: Using for LCP Images
```jsx
// ❌ WRONG - Hero banner is LCP
function Hero() {
  return (
    <LazyImage src={heroBanner} alt="Hero" />
  );
}

// ✅ CORRECT
function Hero() {
  return (
    <img 
      src={heroBanner} 
      alt="Hero"
      loading="eager"
      fetchpriority="high"
    />
  );
}
```

### Mistake 2: Not Providing Aspect Ratio
```jsx
// ❌ WRONG - Causes CLS
<LazyImage src={img} alt="Event" />

// ✅ CORRECT
<LazyImage 
  src={img} 
  alt="Event"
  aspectRatio="16/9"
/>
```

### Mistake 3: Using for All Images
```jsx
// ❌ WRONG - Logo should load immediately
<LazyImage src={logo} alt="Logo" />

// ✅ CORRECT
<img src={logo} alt="Logo" loading="eager" />
```

---

## 📊 Performance Metrics

### Impact on CLS:
```
Without aspect ratio:     CLS = 0.25 (POOR)
With aspect ratio:        CLS = 0.05 (GOOD)

Improvement: 80% reduction in CLS
```

### Impact on Load Time:
```
Without lazy loading:     10 images × 500KB = 5MB initial load
With lazy loading:        2 images × 500KB = 1MB initial load
                         8 images load on scroll

Improvement: 80% reduction in initial load
```

---

## 🔍 Debugging

### Check if LazyImage is Working:
1. Open Chrome DevTools > Network
2. Filter by "Img"
3. Scroll halaman
4. Images should load only when scrolled into view

### Check CLS:
1. Open Chrome DevTools > Performance
2. Record page load
3. Check "Experience" section
4. Look for "Layout Shift" (should be minimal)

---

## 🚀 Migration Guide

### Before (Old LazyImage):
```jsx
<LazyImage 
  src={img} 
  alt="Event"
  className="event-img"
/>
```

### After (Optimized LazyImage):
```jsx
<LazyImage 
  src={img} 
  alt="Event"
  aspectRatio="16/9"  // ← ADD THIS
  className="event-img"
/>
```

---

**Author**: GitHub Copilot  
**Date**: December 30, 2025  
**Version**: 1.0
