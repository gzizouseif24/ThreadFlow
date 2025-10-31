# Threadflow - CLAUDE.md

## Project Overview

**Threadflow** is a modern, interactive web application for organizing and visualizing ideas. The tagline is "Where your ideas untangle themselves." It provides two distinct views for managing ideas:
- **Mood Board**: Traditional grid-based layout for organized browsing
- **Canvas Board**: Interactive freeform canvas with drag-and-drop positioning and visual connections between ideas

## Tech Stack

### Frontend Framework
- **Svelte 5.39.5** - Reactive frontend framework
- **SvelteKit 2.43.2** - Full-stack meta-framework for Svelte
- **TypeScript 5.9.2** - Static type checking

### Build & Development
- **Vite 7.1.7** - Modern JavaScript bundler
- **@sveltejs/vite-plugin-svelte 6.2.0** - Vite plugin for Svelte compilation
- **@sveltejs/adapter-auto** - Auto-detecting deployment adapter

### Styling & UI
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS transformation
- **Autoprefixer 10.4.21** - Vendor prefixes
- **lucide-svelte 0.546.0** - SVG icon library
- **canvas-confetti 1.9.3** - Celebration animations

### Interactive Libraries
- **@neodrag/svelte 2.3.3** - Drag and drop functionality
- **@dnd-kit/core 6.3.1** - Headless drag-drop library
- **@dnd-kit/sortable 10.0.0** - Sortable lists addon
- **svelte-dnd-action 0.9.65** - Alternative drag-drop action

### Development Tools
- **svelte-check 4.3.2** - Svelte type checker

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Root layout component
│   └── +page.svelte            # Main application page
├── lib/
│   ├── components/
│   │   ├── TabCard.svelte      # Individual idea card component
│   │   ├── MoodBoard.svelte    # Grid view of ideas
│   │   ├── CanvasBoard.svelte  # Interactive canvas with connections
│   │   └── FlowBoard.svelte    # Experimental/alternate board
│   ├── stores/
│   │   └── tabs.svelte.ts      # Reactive state management store
│   ├── types/
│   │   └── tab.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── storage.ts          # localStorage persistence utilities
│   ├── assets/
│   │   └── favicon.svg         # Project favicon
│   ├── app.css                 # Global styles and Tailwind directives
│   ├── app.d.ts                # TypeScript app declarations
│   └── app.html                # Root HTML template
static/
├── robots.txt
.svelte-kit/                    # SvelteKit build artifacts (auto-generated)
build/                          # Production build output (auto-generated)
```

## Key Files & Responsibilities

### Components
- **+page.svelte**: Main UI orchestrator with textarea input, view toggle buttons, and board rendering
- **+layout.svelte**: Root layout wrapper with favicon and global styles
- **TabCard.svelte**: Individual idea card with edit, complete, pin, delete, and image URL features
- **MoodBoard.svelte**: Responsive grid layout (3-4 columns on desktop, 1 on mobile) for browsing ideas
- **CanvasBoard.svelte**: Freeform draggable canvas with SVG connection lines between ideas (Shift+click to connect)

### State Management
- **tabs.svelte.ts**: Reactive store managing all tab/idea CRUD operations and localStorage sync
  - Methods: add(), update(), togglePin(), toggleComplete(), delete(), reorder(), updatePosition(), addConnection(), removeConnection(), updateImage()
- **tab.ts**: Core TypeScript interfaces (Tab, ViewMode, Connection)

### Utilities & Configuration
- **storage.ts**: Browser localStorage wrapper for persistence
- **app.css**: Tailwind directives with custom gradient background
- **tailwind.config.js**: Custom pastel color palette (pink, lavender, mint, peach, sky, lilac)
- **tsconfig.json**: TypeScript strict mode enabled
- **svelte.config.js**: Svelte configuration with Vite preprocessor
- **vite.config.ts**: Vite bundler configuration
- **postcss.config.js**: PostCSS with Tailwind and Autoprefixer

## Core Data Model

```typescript
interface Tab {
  id: string;                      // UUID identifier
  content: string;                 // The idea/thought text
  isPinned: boolean;               // Pinned status (displays first)
  isCompleted: boolean;            // Completion status
  createdAt: number;               // Creation timestamp
  updatedAt: number;               // Last update timestamp
  position?: { x: number; y: number };  // Canvas position (x, y)
  imageUrl?: string;               // Optional icon/image URL
  connectedTo?: string[];          // Array of connected tab IDs
}

type ViewMode = 'mood' | 'canvas';  // Two view modes supported
```

## Feature Set

### Idea Management
- Create new ideas via textarea input
- Edit existing idea content
- Delete ideas
- Mark ideas as complete/incomplete (shows confetti animation)
- Pin/unpin important ideas (pinned ideas show first in Mood Board)
- Add custom icon/image URL to each idea
- Drag to reposition in Canvas Board

### Views
- **Mood Board**: Organized grid layout with filtering by pin/completion status
- **Canvas Board**: Freeform interactive canvas with drag positioning and visual connections

### Visualization
- Visual connections between related ideas (Shift+click two cards to connect)
- SVG lines with dashed animation style
- Responsive grid layout with Tailwind breakpoints
- Pastel color palette with gradient background

### Data Persistence
- All data stored in browser localStorage (key: "threadflow-tabs")
- Auto-saves on every state change
- No backend required, fully client-side

### Footer Statistics
- Display count of active, completed, and pinned ideas

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run check        # Run TypeScript and Svelte type checking
npm run check:watch  # Watch mode for type checking
npm run prepare      # Sync SvelteKit configuration
```

## Design System

### Color Palette (Pastel Theme)
- **Pink**: #FFD6E8
- **Lavender**: #E5D4FF
- **Mint**: #D4FFE7
- **Peach**: #FFE5CC
- **Sky**: #D4E5FF
- **Lilac**: #F0D4FF

### Visual Characteristics
- Rounded cards with transparency and blur effects
- Smooth transitions and animations
- Hover effects for interactive feedback
- Gradient background: Sky → Lavender → Pink
- Mobile-first responsive design
- Confetti animation on task completion

## Naming Conventions

- **Files**: PascalCase for Svelte components (.svelte), camelCase for utilities/stores
- **Variables**: camelCase for all variables and functions
- **Types/Interfaces**: PascalCase (Tab, ViewMode, Connection)
- **CSS Classes**: Tailwind utility classes preferred, custom classes in lowercase with hyphens
- **Store subscriptions**: Use `$tabs` syntax (auto-subscribe in Svelte components)

## Code Style Guidelines

- TypeScript strict mode enabled
- Use Svelte reactive declarations ($:) for derived state
- Component prop typing with TypeScript interfaces
- Tailwind CSS for styling (no CSS-in-JS)
- Mobile-first responsive design approach
- Comments for complex logic, especially drag-drop and canvas operations

## Key Architectural Patterns

1. **Reactive Stores**: Centralized state management using Svelte stores (tabs.svelte.ts)
2. **Component Composition**: UI broken into reusable components (TabCard, MoodBoard, CanvasBoard)
3. **localStorage Persistence**: Automatic sync of state to browser storage
4. **SvelteKit File-based Routing**: Routes in src/routes/ directory
5. **Tailwind CSS**: Utility-first CSS with custom color configuration
6. **TypeScript**: Full type safety across the application

## Important Notes for Claude

- The project is **client-side only** with no backend API calls
- **localStorage** is the single source of truth for data persistence
- **Drag-and-drop** functionality is critical in Canvas Board - uses @neodrag/svelte and @dnd-kit libraries
- **SVG connections** between ideas are rendered as dashed lines dynamically
- **Mobile responsiveness** is important - Mood Board changes from 1 to 4 columns based on screen size
- When modifying state, always ensure localStorage stays in sync via the storage utility
- The **confetti animation** on task completion uses canvas-confetti library
- **Shift+click** interaction pattern in Canvas Board for creating connections
- DONT RUN NPM RUN DEV OR ANY OTHER COMMANDS LIKE THESE

## Deployment

- Uses `@sveltejs/adapter-auto` for automatic deployment detection (Vercel, Netlify, etc.)
- No environment variables required
- Fully static site - can be deployed anywhere
- Build artifacts go to `build/` directory (added to .gitignore)

## Future Enhancement Ideas

- Backend API integration for cloud sync
- Collaboration/sharing features
- Export ideas to various formats (PDF, JSON, etc.)
- Search and filter functionality
- Tags/categories for ideas
- Dark mode theme
- Real-time collaboration

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
