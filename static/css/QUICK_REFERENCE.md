# 8-Bit Retro Styling - Quick Reference

## Most Common Components

### Buttons
```html
<button>Default</button>
<button class="btn-primary">Primary</button>
<button class="btn-accent">Accent</button>
<button class="btn-danger">Danger</button>
<button class="btn-sm">Small</button>
<button class="btn-lg">Large</button>
```

### Cards
```html
<div class="card">
    <div class="card-header"><h3>Title</h3></div>
    <p>Content</p>
</div>
```

### Forms
```html
<div class="form-group">
    <label for="input">Label</label>
    <input type="text" id="input" placeholder="...">
</div>
```

### Health Bar
```html
<div class="health-bar">
    <div class="health-bar-fill" style="width: 75%;">
        <span class="health-bar-text">75/100</span>
    </div>
</div>
```

### Stats
```html
<div class="stat-box">
    <span class="stat-label">HP</span>
    <span class="stat-value">85</span>
</div>
```

### Grids
```html
<div class="grid grid-3 gap-md">
    <div class="card">1</div>
    <div class="card">2</div>
    <div class="card">3</div>
</div>
```

## Color Variables

```css
--color-primary-dark: #2b0f54
--color-primary-medium: #463464
--color-secondary-bright: #00ff9f
--color-secondary-medium: #72f1b8
--color-accent-bright: #ffd700
--color-accent-medium: #ffaa00
--color-danger-bright: #ff0040
--color-bg-darkest: #0a0a0a
--color-bg-dark: #1a1a1a
--color-text-primary: #f0e6d2
```

## Spacing

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
```

## Common Utility Classes

### Spacing
```
.mt-md    margin-top: 16px
.mb-lg    margin-bottom: 24px
.p-md     padding: 16px
```

### Text
```
.text-center      text-align: center
.text-primary     color: purple
.text-secondary   color: cyan
.text-accent      color: gold
.text-danger      color: red
```

### Layout
```
.flex              display: flex
.grid              display: grid
.grid-2            2 columns
.grid-3            3 columns
.gap-md            gap: 16px
.justify-between   space-between
.align-center      align-items: center
```

### Effects
```
.pixel-border       8-bit border
.pixel-border-glow  glowing border
.glow              pulsing glow
.blink             classic blink
.shake             shake animation
```

## JavaScript Helpers

### Notification
```javascript
const notif = document.createElement('div');
notif.className = 'notification success';
notif.textContent = 'Success!';
document.body.appendChild(notif);
```

### Update Health Bar
```javascript
const fill = document.querySelector('.health-bar-fill');
fill.style.width = '50%';
fill.classList.add('low'); // or 'critical'
```

### Modal Dialog
```javascript
const overlay = document.createElement('div');
overlay.className = 'dialog-overlay';

const dialog = document.createElement('div');
dialog.className = 'dialog';
dialog.innerHTML = '<h3>Title</h3><p>Content</p>';

document.body.append(overlay, dialog);
```

## Responsive Breakpoints

- Mobile: `< 480px` - Single column
- Tablet: `< 768px` - Reduced spacing
- Desktop: `> 768px` - Full features
- Large: `> 1440px` - Max width 1400px

## Special Body Classes

```html
<body class="crt-strong">  <!-- Stronger CRT effect -->
```

## Font Sizes

```css
--font-size-xs: 8px    Small labels
--font-size-sm: 10px   Buttons, inputs
--font-size-base: 12px Body text
--font-size-lg: 16px   Headings
--font-size-xl: 20px   Large headings
--font-size-2xl: 24px  Titles
```

## Health Bar States

```html
<!-- Normal (green) -->
<div class="health-bar-fill" style="width: 75%;"></div>

<!-- Low (yellow, < 35%) -->
<div class="health-bar-fill low" style="width: 30%;"></div>

<!-- Critical (red, pulsing, < 15%) -->
<div class="health-bar-fill critical" style="width: 10%;"></div>
```

## Badge Variants

```html
<span class="badge">Default</span>
<span class="badge success">Success</span>
<span class="badge danger">Danger</span>
<span class="badge warning">Warning</span>
```

## Complete Example

```html
<div class="card card-glow">
    <div class="card-header">
        <h3>Character Sheet</h3>
    </div>

    <div class="mb-lg">
        <div class="stat-box">
            <span class="stat-label">HP</span>
            <span class="stat-value">85</span>
        </div>
    </div>

    <div class="health-bar">
        <div class="health-bar-fill" style="width: 85%;">
            <span class="health-bar-text">85/100</span>
        </div>
    </div>

    <div class="btn-group mt-md">
        <button class="btn-primary">Rest</button>
        <button class="btn-danger">Combat</button>
    </div>
</div>
```
