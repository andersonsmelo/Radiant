# Radiant UI Kit

Design system reference for the Radiant mobile application.

## Color Palette

### Background Colors
- **Primary Background**: `#000000` - Main app background
- **Secondary Background**: `#1C1C1E` - Cards, elevated surfaces
- **Tertiary Background**: `#2C2C2E` - Secondary buttons, disabled states

### Text Colors
- **Primary Text**: `#FFFFFF` - Main content
- **Secondary Text**: `#8E8E93` - Labels, secondary information
- **Tertiary Text**: `#3A3A3C` - Dividers, subtle elements

### Accent Colors
- **Primary Blue**: `#0A84FF` - Primary actions, links, progress
- **Success Green**: `#34C759` - Success states, correct answers, achievements
- **Error Red**: `#FF453A` - Errors, incorrect answers, warnings

### Semantic Colors
- **Correct/Pass**: `#34C759`
- **Incorrect/Fail**: `#FF453A`
- **Info/Highlight**: `#0A84FF`

## Typography

### Font Sizes
- **Extra Large**: `64px` - Score displays, large numbers
- **Title**: `48px` - App title
- **Large Title**: `32px` - Section headers
- **Headline**: `24px` - Card titles, XP awards
- **Body Large**: `20px` - Result messages
- **Body**: `18px` - Buttons, primary content
- **Callout**: `16px` - Labels, secondary content
- **Caption**: `14px` - Small labels, metadata
- **Small**: `12px` - Fine print, badges

### Font Weights
- **Regular**: `400`
- **Medium**: `500`
- **Semibold**: `600`
- **Bold**: `700`
- **Extra Bold**: `800`

## Spacing

### Padding/Margin Scale
- **XS**: `4px`
- **SM**: `8px`
- **MD**: `12px`
- **LG**: `16px`
- **XL**: `20px`
- **2XL**: `24px`
- **3XL**: `32px`
- **4XL**: `40px`
- **5XL**: `60px`

### Common Patterns
- **Card Padding**: `32px` (large cards), `16px` (compact cards)
- **Screen Padding**: `20px`
- **Button Height**: `56px`
- **Gap Between Elements**: `16px` - `24px`

## Border Radius

- **Small**: `8px` - Small elements
- **Medium**: `12px` - Buttons, cards
- **Large**: `16px` - Large cards, containers

## Components

### Buttons

#### Primary Button
```typescript
{
  height: 56,
  borderRadius: 12,
  backgroundColor: '#0A84FF',
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '600',
}
```

#### Secondary Button
```typescript
{
  height: 56,
  borderRadius: 12,
  backgroundColor: '#2C2C2E',
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '600',
}
```

#### Disabled State
```typescript
{
  backgroundColor: '#2C2C2E',
  opacity: 0.5,
  color: '#8E8E93',
}
```

### Cards

#### Standard Card
```typescript
{
  backgroundColor: '#1C1C1E',
  borderRadius: 16,
  padding: 32,
}
```

#### Compact Card
```typescript
{
  backgroundColor: '#1C1C1E',
  borderRadius: 12,
  padding: 16,
}
```

### Score Display
```typescript
{
  fontSize: 64,
  fontWeight: '700',
  color: '#34C759', // Pass
  color: '#FF453A', // Fail
}
```

### XP Award Container
```typescript
{
  backgroundColor: 'rgba(10, 132, 255, 0.1)',
  borderRadius: 12,
  padding: 16,
}
```

### Progress Text
```typescript
{
  fontSize: 14,
  fontWeight: '500',
  color: '#8E8E93',
}
```

## Layout Patterns

### Screen Structure
```
SafeAreaView (flex: 1, backgroundColor: '#000000')
  ├─ Header (padding: 20, borderBottom: 1px #2C2C2E)
  ├─ Content (flex: 1)
  └─ Footer (padding: 20, borderTop: 1px #2C2C2E)
```

### Summary Screen
```
SafeAreaView
  └─ Container (flex: 1, justifyContent: center, padding: 20)
      ├─ Title (fontSize: 32, marginBottom: 40)
      ├─ Score Card (marginBottom: 24)
      ├─ Result Message (marginBottom: 16)
      ├─ XP Award (marginBottom: 24)
      ├─ Daily Goal Message (marginBottom: 24)
      ├─ Progress Info (marginBottom: 24)
      └─ Action Buttons (gap: 12)
```

## Accessibility

### Contrast Ratios
- **Primary Text on Background**: 21:1 (AAA)
- **Secondary Text on Background**: 4.5:1 (AA)
- **Primary Button**: 4.5:1 (AA)

### Touch Targets
- **Minimum Size**: `44px × 44px`
- **Recommended Button Height**: `56px`

## Dark Mode

Radiant uses a dark-first design approach:
- All colors are optimized for dark mode
- High contrast for readability
- Reduced eye strain with dark backgrounds
- Vibrant accent colors for important actions

## Usage Guidelines

### Do's
✅ Use semantic colors for their intended purpose  
✅ Maintain consistent spacing using the scale  
✅ Keep text hierarchy clear with size and weight  
✅ Use high contrast for important information  
✅ Provide visual feedback for all interactions

### Don'ts
❌ Don't use arbitrary colors outside the palette  
❌ Don't use font sizes not in the scale  
❌ Don't reduce button heights below 56px  
❌ Don't use low contrast text on dark backgrounds  
❌ Don't mix different border radius values in the same context

## Examples

### Daily Goal Display
```typescript
{
  backgroundColor: '#1C1C1E',
  borderRadius: 12,
  padding: 16,
  fontSize: 16,
  fontWeight: '600',
  color: '#FFFFFF',
}
```

### Success Message
```typescript
{
  fontSize: 18,
  fontWeight: '600',
  color: '#34C759',
  textAlign: 'center',
}
```

### Gamification Stats
```typescript
Container: {
  flexDirection: 'row',
  backgroundColor: '#1C1C1E',
  borderRadius: 12,
  padding: 16,
}

Label: {
  fontSize: 14,
  color: '#8E8E93',
}

Value: {
  fontSize: 20,
  fontWeight: '700',
  color: '#FFFFFF',
}
```

---

**Version**: 1.0  
**Last Updated**: 2026-01-26  
**Maintained by**: Radiant Development Team
