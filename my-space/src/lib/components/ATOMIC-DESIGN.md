# Atomic Design System

This component library follows the [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) methodology by Brad Frost.

## Structure

```
lib/
├── atoms/          # Basic building blocks
├── molecules/      # Groups of atoms
├── organisms/      # Complex UI components
└── index.js        # Exports all components
```

## Component Hierarchy

### 🔹 Atoms
Basic UI elements that can't be broken down further.

- **Button** - Customizable button with variants (primary, secondary, outline, ghost) and sizes
- **Input** - Form input with error handling and validation states
- **Link** - Styled anchor tag with internal/external link support
- **Icon** - SVG icon component with multiple icons

### 🔸 Molecules
Groups of atoms that function together as a unit.

- **Card** - Content card with image, title, subtitle, and link
- **NavItem** - Navigation link with icon and active state

### 🔺 Organisms
Complex components built from molecules and atoms.

- **Header** - Site header with navigation and mobile menu
- **Footer** - Site footer with links and copyright
- **Navigation** - Flexible navigation component (horizontal/vertical)

## Usage Examples

### Using Individual Components

```svelte
<script>
  import { Button, Input, Card } from '$lib';
</script>

<Button variant="primary" size="medium">
  Click me
</Button>

<Input
  type="email"
  placeholder="Enter your email"
  bind:value={email}
/>

<Card
  title="My Card"
  subtitle="Card description"
  image="/path/to/image.jpg"
  href="/link"
>
  Card content goes here
</Card>
```

### Using Organisms

```svelte
<script>
  import { Header, Footer } from '$lib';
</script>

<Header siteName="My Space" />

<main>
  <!-- Your page content -->
</main>

<Footer />
```

### Button Component Props

```typescript
variant: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
size: 'small' | 'medium' | 'large' (default: 'medium')
disabled: boolean (default: false)
type: 'button' | 'submit' | 'reset' (default: 'button')
onclick: function
```

### Input Component Props

```typescript
type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
value: string (bindable)
placeholder: string
disabled: boolean
required: boolean
name: string
id: string
error: string
```

### Card Component Props

```typescript
title: string
subtitle: string
image: string
href: string
children: snippet (for content)
```

### Icon Component Props

```typescript
name: 'menu' | 'close' | 'home' | 'user' | 'search' | 'arrow'
size: 'small' | 'medium' | 'large' (default: 'medium')
color: string (default: 'currentColor')
```

## Adding New Components

When creating new components, follow these guidelines:

1. **Atoms**: Create in `atoms/` folder
   - Should be simple, single-purpose components
   - Should not depend on other atoms
   - Examples: buttons, inputs, labels, icons

2. **Molecules**: Create in `molecules/` folder
   - Combine 2+ atoms to create functional units
   - Should have a clear, focused purpose
   - Examples: search forms, menu items, cards

3. **Organisms**: Create in `organisms/` folder
   - Complex components using molecules and atoms
   - Can be full sections of a page
   - Examples: headers, footers, sidebars

4. **Export**: Always add your component to the appropriate `index.js` file

## Best Practices

- ✅ Use Svelte 5 runes (`$props`, `$state`, `$bindable`)
- ✅ Provide clear prop types with JSDoc comments
- ✅ Include accessibility attributes (aria-labels, roles)
- ✅ Keep styles scoped to components
- ✅ Make components reusable and configurable
- ✅ Use semantic HTML elements
- ✅ Test components with different prop combinations

## Customization

All components use CSS custom properties for easy theming. You can override styles in your global CSS or component-level styles.

Example:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --border-radius: 0.375rem;
}
```

## Resources

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
