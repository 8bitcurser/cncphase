# Crown and Skull - 8-Bit Retro Styling Guide

## Overview

This comprehensive styling system provides authentic 8-bit RPG aesthetics for the Crown and Skull tabletop RPG web application. The design evokes classic NES/SNES era gaming with pixel-perfect UI elements, CRT screen effects, and a carefully curated retro color palette.

## Quick Start

### Installation

The stylesheet is already integrated into your application. Simply include it in your HTML:

```html
<link rel="stylesheet" href="/static/css/retro-style.css">
```

### View the Demo

Open `/static/retro-demo.html` in your browser to see all components and effects in action.

## Color Palette

The system uses a limited color palette inspired by classic 8-bit games:

### Primary Colors (Deep Purples/Blues)
- `--color-primary-dark: #2b0f54` - Deep purple, main UI backgrounds
- `--color-primary-medium: #463464` - Medium purple, borders and accents
- `--color-primary-light: #6b4f9f` - Light purple, hover states

### Secondary Colors (Cyberpunk Cyan/Green)
- `--color-secondary-bright: #00ff9f` - Bright cyan, primary actions and highlights
- `--color-secondary-medium: #72f1b8` - Medium cyan, text and links
- `--color-secondary-dark: #00cc7f` - Dark cyan, button backgrounds

### Accent Colors (Royal Gold)
- `--color-accent-bright: #ffd700` - Bright gold, titles and important elements
- `--color-accent-medium: #ffaa00` - Medium gold, warnings and alerts
- `--color-accent-dark: #cc8800` - Dark gold, hover states

### Danger/Warning Colors
- `--color-danger-dark: #8b0000` - Deep red, critical states
- `--color-danger-bright: #ff0040` - Bright red, errors and damage
- `--color-danger-medium: #cc0033` - Medium red, warnings

### Background Colors
- `--color-bg-darkest: #0a0a0a` - Deepest black, page background
- `--color-bg-dark: #1a1a1a` - Dark gray, card backgrounds
- `--color-bg-medium: #2a2a2a` - Medium gray, panels
- `--color-bg-light: #3a3a3a` - Light gray, disabled states

### Text Colors
- `--color-text-primary: #f0e6d2` - Off-white, primary text
- `--color-text-secondary: #ffffff` - Pure white, headings
- `--color-text-muted: #999999` - Gray, secondary text

## Typography

### Font Family

The system uses **Press Start 2P** (loaded from Google Fonts) with monospace fallbacks:

```css
font-family: var(--font-primary);
/* Fallback: 'Courier New', monospace */
```

### Font Sizes

Pixel-perfect sizing using an 8px grid:

- `--font-size-xs: 8px` - Tiny labels
- `--font-size-sm: 10px` - Small text, buttons
- `--font-size-base: 12px` - Body text
- `--font-size-md: 14px` - Medium headings
- `--font-size-lg: 16px` - Large headings
- `--font-size-xl: 20px` - Extra large
- `--font-size-2xl: 24px` - Titles
- `--font-size-3xl: 32px` - Hero text

### Headings

```html
<h1>Quest Title</h1>        <!-- Gold with shadow -->
<h2>Chapter Name</h2>       <!-- Cyan with shadow -->
<h3>Section Title</h3>      <!-- Gold with shadow -->
<h4>Subsection</h4>         <!-- White with shadow -->
```

All headings are automatically:
- Uppercase
- Letter-spaced (2px)
- Shadow-enhanced for depth

## Components

### Buttons

#### Basic Usage

```html
<button>Default Button</button>
<button class="btn-primary">Primary Action</button>
<button class="btn-accent">Accent Button</button>
<button class="btn-danger">Danger Action</button>
<button disabled>Disabled</button>
```

#### Button Sizes

```html
<button class="btn-sm">Small</button>
<button>Normal</button>
<button class="btn-lg">Large</button>
```

#### Button Groups

```html
<div class="btn-group">
    <button>Action 1</button>
    <button>Action 2</button>
    <button>Action 3</button>
</div>
```

**Features:**
- Authentic press effect (translateY on click)
- Pixel-perfect borders using box-shadow
- Glowing hover states
- Keyboard focus indicators

### Cards and Panels

#### Card with Header

```html
<div class="card">
    <div class="card-header">
        <h3>Card Title</h3>
    </div>
    <p>Card content goes here...</p>
</div>
```

#### Glowing Card

```html
<div class="card card-glow">
    <p>This card has an animated glow effect</p>
</div>
```

#### Panel

```html
<div class="panel">
    <p>Panel content with inset shadow effect</p>
</div>
```

### Form Elements

#### Complete Form Example

```html
<form>
    <div class="form-group">
        <label for="name">Character Name</label>
        <input type="text" id="name" placeholder="Enter name...">
    </div>

    <div class="form-group">
        <label for="class">Character Class</label>
        <select id="class">
            <option>Warrior</option>
            <option>Mage</option>
        </select>
    </div>

    <div class="form-group">
        <label for="bio">Background</label>
        <textarea id="bio" placeholder="Enter backstory..."></textarea>
    </div>

    <div class="form-group">
        <label>
            <input type="checkbox" checked>
            Enable combat mode
        </label>
    </div>

    <button type="submit" class="btn-primary">Submit</button>
</form>
```

#### Error States

```html
<div class="form-group error">
    <label for="email">Email</label>
    <input type="email" id="email" value="invalid">
    <span class="error-message">Invalid email address!</span>
</div>
```

### Stats and Health Bars

#### Stat Boxes

```html
<div class="stat-box">
    <span class="stat-label">HP</span>
    <span class="stat-value">85</span>
</div>
<div class="stat-box">
    <span class="stat-label">MP</span>
    <span class="stat-value">42</span>
</div>
```

#### Health Bar

```html
<div class="health-bar">
    <div class="health-bar-fill" style="width: 75%;">
        <span class="health-bar-text">75 / 100</span>
    </div>
</div>
```

#### Health Bar States

```html
<!-- Good health (green) -->
<div class="health-bar-fill" style="width: 75%;"></div>

<!-- Low health (yellow) -->
<div class="health-bar-fill low" style="width: 35%;"></div>

<!-- Critical health (red, pulsing) -->
<div class="health-bar-fill critical" style="width: 15%;"></div>
```

### Navigation

The navigation system is automatically styled from the layout template:

```html
<header>
    <nav>
        <h1><a href="/">Crown & Skull</a></h1>
        <ul>
            <li><a href="/" class="active">Home</a></li>
            <li><a href="/combat">Combat</a></li>
            <li><a href="/magic">Magic</a></li>
        </ul>
    </nav>
</header>
```

**Features:**
- Glowing hover effects
- Active state indication
- Pixel borders on hover
- Fully responsive

### Badges

```html
<span class="badge">Level 5</span>
<span class="badge success">Active</span>
<span class="badge danger">Poisoned</span>
<span class="badge warning">Low HP</span>
```

### Notifications

Create dynamic notifications with JavaScript:

```html
<div class="notification success">
    Quest completed! You gained 500 XP.
</div>

<div class="notification error">
    Critical failure! You took 20 damage.
</div>

<div class="notification warning">
    Low health! Use a potion.
</div>
```

### Modal Dialog

```html
<div class="dialog-overlay"></div>
<div class="dialog">
    <h3>Level Up!</h3>
    <p>Choose an attribute to increase:</p>
    <div class="btn-group">
        <button class="btn-primary">Strength</button>
        <button class="btn-primary">Dexterity</button>
        <button class="btn-primary">Intelligence</button>
    </div>
</div>
```

### Loading Spinner

```html
<div class="loading"></div>
```

### Dividers

```html
<!-- Standard divider -->
<div class="divider"></div>

<!-- Glowing divider -->
<div class="divider-glow"></div>
```

## Layout Utilities

### Grid System

```html
<!-- 2-column grid -->
<div class="grid grid-2 gap-md">
    <div class="card">Column 1</div>
    <div class="card">Column 2</div>
</div>

<!-- 3-column grid -->
<div class="grid grid-3 gap-md">
    <div class="card">Column 1</div>
    <div class="card">Column 2</div>
    <div class="card">Column 3</div>
</div>

<!-- 4-column grid -->
<div class="grid grid-4 gap-sm">
    <div class="card">Column 1</div>
    <div class="card">Column 2</div>
    <div class="card">Column 3</div>
    <div class="card">Column 4</div>
</div>
```

**Note:** Grids automatically collapse to single column on mobile devices.

### Flexbox Utilities

```html
<div class="flex justify-between align-center gap-md">
    <div>Left content</div>
    <div>Right content</div>
</div>

<div class="flex flex-column gap-sm">
    <div>Row 1</div>
    <div>Row 2</div>
    <div>Row 3</div>
</div>
```

Available flex classes:
- Direction: `.flex-row`, `.flex-column`
- Justify: `.justify-start`, `.justify-center`, `.justify-end`, `.justify-between`
- Align: `.align-start`, `.align-center`, `.align-end`
- Gap: `.gap-sm`, `.gap-md`, `.gap-lg`
- Wrap: `.flex-wrap`

### Spacing Utilities

#### Margin

```html
<div class="mt-md">Top margin</div>
<div class="mb-lg">Bottom margin</div>
```

Available: `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl`
Available: `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`

#### Padding

```html
<div class="p-md">Padding on all sides</div>
```

Available: `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl`

### Text Utilities

#### Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
```

#### Colors

```html
<p class="text-primary">Primary colored text</p>
<p class="text-secondary">Secondary colored text</p>
<p class="text-accent">Accent colored text</p>
<p class="text-danger">Danger colored text</p>
<p class="text-muted">Muted colored text</p>
```

### Display Utilities

```html
<div class="block">Block element</div>
<div class="inline-block">Inline-block element</div>
<div class="flex">Flex container</div>
<div class="grid">Grid container</div>
<div class="hidden">Hidden element</div>
```

## Special Effects

### CRT Screen Effects

The stylesheet includes authentic CRT monitor effects:

1. **Scanlines** - Horizontal lines across the screen
2. **Screen flicker** - Subtle flickering animation
3. **Vignette** - Darkened edges like old monitors

#### Strong CRT Mode

For a more intense retro effect, add the `crt-strong` class to the body:

```html
<body class="crt-strong">
```

This enables:
- Stronger scanlines
- RGB color separation effect
- More visible screen curvature

### Pixel Borders

Apply authentic 8-bit borders to any element:

```html
<div class="pixel-border">
    Content with pixel-perfect border
</div>

<div class="pixel-border-glow">
    Content with glowing pixel border
</div>
```

### Glow Effects

```html
<p class="glow">This text glows and pulses</p>
```

### Blink Effect

Classic 8-bit text blinking:

```html
<p class="blink">Important message!</p>
```

### Shake Effect

Add shake effect for damage or errors:

```html
<button class="shake">Shaking button</button>
```

Or trigger via JavaScript:

```javascript
element.classList.add('shake');
setTimeout(() => element.classList.remove('shake'), 500);
```

## Animation Examples

### Available Keyframe Animations

All animations are defined and ready to use:

```css
/* Flicker - CRT screen effect */
animation: flicker 0.15s infinite alternate;

/* Glow - Pulsing glow */
animation: glow 1.5s ease-in-out infinite alternate;

/* Card Glow - Border pulse */
animation: cardGlow 2s ease-in-out infinite alternate;

/* Pulse - Opacity pulse */
animation: pulse 0.5s ease-in-out infinite alternate;

/* Blink - Classic blink */
animation: blink 1s step-start infinite;

/* Shake - Damage shake */
animation: shake 0.5s ease-in-out;

/* Slide In - From top */
animation: slideInTop 0.3s ease-out;

/* Fade In - Opacity */
animation: fadeIn 0.3s ease-out;

/* Scale In - Modal entrance */
animation: scaleIn 0.3s ease-out;

/* Spin - Loading spinner */
animation: spin 0.8s linear infinite;
```

## JavaScript Integration

### Dynamic Notifications

```javascript
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Usage
showNotification('Quest completed!', 'success');
showNotification('Error occurred!', 'error');
showNotification('Low health!', 'warning');
```

### Dynamic Health Bars

```javascript
function updateHealthBar(element, currentHealth, maxHealth) {
    const percentage = (currentHealth / maxHealth) * 100;
    const fill = element.querySelector('.health-bar-fill');
    const text = element.querySelector('.health-bar-text');

    fill.style.width = percentage + '%';
    text.textContent = `${currentHealth} / ${maxHealth}`;

    // Update state classes
    fill.classList.remove('low', 'critical');
    if (percentage <= 35) {
        fill.classList.add('low');
    }
    if (percentage <= 15) {
        fill.classList.remove('low');
        fill.classList.add('critical');
    }
}

// Usage
const healthBar = document.querySelector('.health-bar');
updateHealthBar(healthBar, 45, 100);
```

### Modal Dialog Management

```javascript
function showDialog(title, content, buttons) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    dialog.innerHTML = `
        <h3 class="mb-md">${title}</h3>
        <p class="mb-lg">${content}</p>
        <div class="btn-group">${buttons}</div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    overlay.addEventListener('click', closeDialog);
}

function closeDialog() {
    const overlay = document.querySelector('.dialog-overlay');
    const dialog = document.querySelector('.dialog');
    if (overlay) overlay.remove();
    if (dialog) dialog.remove();
}

// Usage
showDialog(
    'Level Up!',
    'You reached level 6. Choose an attribute:',
    '<button class="btn-primary" onclick="closeDialog()">STR</button>' +
    '<button class="btn-primary" onclick="closeDialog()">DEX</button>'
);
```

## Customization

### Overriding Colors

Create your own color scheme by overriding CSS custom properties:

```css
:root {
    --color-primary-dark: #your-color;
    --color-secondary-bright: #your-color;
    --color-accent-bright: #your-color;
    /* etc... */
}
```

### Adjusting CRT Effects

Modify the CRT intensity by changing the scanline opacity:

```css
body::before {
    opacity: 0.3; /* Lighter scanlines (default 0.5) */
}
```

Or disable CRT effects entirely:

```css
body::before,
body::after {
    display: none;
}
```

### Custom Button Variants

Create custom button styles:

```css
.btn-custom {
    background-color: #your-color;
    box-shadow:
        0 var(--border-medium) 0 #darker-shade,
        var(--pixel-border-shadow);
}

.btn-custom:hover {
    background-color: #lighter-shade;
}
```

## Responsive Design

The system includes responsive breakpoints:

### Mobile (< 480px)
- Reduced font sizes
- Single column layouts
- Stacked navigation
- Full-width buttons

### Tablet (< 768px)
- Medium font sizes
- Collapsed grids
- Vertical navigation
- Adjusted spacing

### Desktop (> 1440px)
- Maximum container width: 1400px
- Full feature set

All grids automatically collapse to single column on mobile devices.

## Browser Support

**Fully Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Not Supported:**
- Internet Explorer 11 (uses CSS custom properties)

**Graceful Degradation:**
- Older browsers will show unstyled content
- Core functionality remains accessible

## Performance Notes

- CRT effects use CSS-only animations (no JavaScript)
- Box-shadow technique for borders is GPU-accelerated
- Transitions optimized for 60fps
- Font loaded asynchronously from Google Fonts CDN
- No images required (pure CSS effects)

## Accessibility

- All interactive elements have keyboard focus states
- Color contrast meets WCAG AA standards
- Semantic HTML structure supported
- Screen reader friendly
- Keyboard navigation fully functional

## Tips and Best Practices

1. **Maintain the 8px Grid** - Use spacing variables for consistent alignment
2. **Limit Font Sizes** - Stick to predefined sizes for pixel-perfect rendering
3. **Use Semantic HTML** - The styles work best with proper HTML structure
4. **Test on Mobile** - Pixel fonts can be hard to read on small screens
5. **Don't Overuse Effects** - CRT scanlines and glows are subtle by design
6. **Leverage Utility Classes** - They're faster than writing custom CSS
7. **Keep Contrast High** - The limited palette requires careful color selection
8. **Use Grid for Layouts** - The grid system handles responsive design automatically

## Common Patterns

### Character Sheet

```html
<div class="card">
    <div class="card-header">
        <h2>Character: Thorin Ironshield</h2>
    </div>

    <!-- Stats -->
    <div class="mb-lg">
        <div class="stat-box">
            <span class="stat-label">Level</span>
            <span class="stat-value">6</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">HP</span>
            <span class="stat-value">85</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">MP</span>
            <span class="stat-value">42</span>
        </div>
    </div>

    <!-- Health Bar -->
    <div class="mb-md">
        <h4 class="mb-sm">Health</h4>
        <div class="health-bar">
            <div class="health-bar-fill" style="width: 85%;">
                <span class="health-bar-text">85 / 100</span>
            </div>
        </div>
    </div>

    <!-- Attributes -->
    <div class="grid grid-3 gap-sm">
        <div class="panel text-center">
            <div class="text-muted">STR</div>
            <div class="text-accent">18</div>
        </div>
        <div class="panel text-center">
            <div class="text-muted">DEX</div>
            <div class="text-accent">14</div>
        </div>
        <div class="panel text-center">
            <div class="text-muted">INT</div>
            <div class="text-accent">12</div>
        </div>
    </div>
</div>
```

### Combat Tracker

```html
<div class="card card-glow">
    <div class="card-header">
        <h2>Combat Round 3</h2>
    </div>

    <div class="panel mb-md">
        <h4>Initiative Order</h4>
        <div class="flex justify-between mb-sm">
            <span>Thorin <span class="badge success">Player</span></span>
            <span class="text-accent">18</span>
        </div>
        <div class="flex justify-between mb-sm">
            <span>Goblin 1 <span class="badge danger">Enemy</span></span>
            <span class="text-danger">15</span>
        </div>
    </div>

    <div class="btn-group">
        <button class="btn-primary">Next Turn</button>
        <button class="btn-danger">End Combat</button>
    </div>
</div>
```

## Troubleshooting

### Fonts Not Loading
- Check internet connection (Press Start 2P loads from Google Fonts CDN)
- Verify no content security policy blocking external fonts
- Fallback monospace fonts will be used automatically

### CRT Effects Too Strong
- Add `opacity: 0.3;` to `body::before` selector
- Or remove the class `crt-strong` if applied

### Buttons Not Pressing
- Ensure button doesn't have custom styles overriding the transform
- Check that `:active` pseudo-class isn't being prevented

### Grid Not Responsive
- Verify you're using the correct grid classes (`.grid-2`, `.grid-3`, etc.)
- Check for conflicting CSS that might override media queries

## Credits

**Designer:** BigPoppa
**Version:** 1.0.0
**Font:** Press Start 2P by CodeMan38
**Inspired by:** Classic NES/SNES RPGs, retro gaming aesthetics

## License

This styling system is part of the Crown and Skull GM Tools project.

---

**Ready to level up your UI?** Check out `/static/retro-demo.html` for live examples of every component!
