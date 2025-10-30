# 📋 Project Detail Modal Feature

## Overview
Add a detailed project view modal that opens when clicking on a project card. The modal will allow users to manage project information including notes, links, resources, deadlines, objectives, and more.

---

## 🎨 Design Principles

### Visual Style
- **Glassmorphism design** - Match existing `backdrop-blur-md bg-white/30` aesthetic
- **Soft pastel colors** - Use updated muted color palette
- **Smooth animations** - Slide-in/fade-in transitions
- **Organized sections** - Clear visual hierarchy with collapsible sections
- **Responsive layout** - Works on all screen sizes

### Color Palette (Updated Softer Colors)
```css
Pink: #E8A5C0
Lavender: #A89BC7
Mint: #8FD5C1
Peach: #E5C4A1
Sky: #A8D5E2
Lilac: #C9A8D4
```

---

## 📁 File Structure

```
src/
├── lib/
│   ├── components/
│   │   └── ProjectDetailModal.svelte    # NEW - Main modal component
│   ├── types/
│   │   └── project.ts                   # UPDATE - Add new fields
│   └── stores/
│       └── projects.svelte.ts           # UPDATE - Add update methods
```

---

## 🔧 Implementation Plan

### **Step 1: Update Project Type**

**File:** `src/lib/types/tab.ts`

Add new fields to the Project interface:

```typescript
export interface Project {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
  
  // NEW FIELDS
  description?: string;           // Project description/notes
  objective?: string;             // Main objective/goal
  deadline?: string;              // ISO date string (YYYY-MM-DD)
  links?: ProjectLink[];          // External links/resources
  resources?: ProjectResource[];  // Documents, files, etc.
  status?: 'planning' | 'active' | 'paused' | 'completed';
  tags?: string[];                // Project tags
}

export interface ProjectLink {
  id: string;
  title: string;
  url: string;
  type: 'documentation' | 'repository' | 'design' | 'other';
  createdAt: number;
}

export interface ProjectResource {
  id: string;
  title: string;
  description?: string;
  url?: string;                   // External URL or file path
  type: 'document' | 'image' | 'video' | 'other';
  createdAt: number;
}
```

---

### **Step 2: Update Project Store**

**File:** `src/lib/stores/projects.svelte.ts`

Add methods to update project details:

```typescript
updateDescription(id: string, description: string) {
  this.projects = this.projects.map((p) =>
    p.id === id ? { ...p, description, updatedAt: Date.now() } : p
  );
  this.save();
}

updateObjective(id: string, objective: string) {
  this.projects = this.projects.map((p) =>
    p.id === id ? { ...p, objective, updatedAt: Date.now() } : p
  );
  this.save();
}

updateDeadline(id: string, deadline: string) {
  this.projects = this.projects.map((p) =>
    p.id === id ? { ...p, deadline, updatedAt: Date.now() } : p
  );
  this.save();
}

updateStatus(id: string, status: Project['status']) {
  this.projects = this.projects.map((p) =>
    p.id === id ? { ...p, status, updatedAt: Date.now() } : p
  );
  this.save();
}

addLink(projectId: string, link: Omit<ProjectLink, 'id' | 'createdAt'>) {
  this.projects = this.projects.map((p) => {
    if (p.id === projectId) {
      const newLink: ProjectLink = {
        ...link,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      return {
        ...p,
        links: [...(p.links || []), newLink],
        updatedAt: Date.now()
      };
    }
    return p;
  });
  this.save();
}

removeLink(projectId: string, linkId: string) {
  this.projects = this.projects.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        links: (p.links || []).filter((l) => l.id !== linkId),
        updatedAt: Date.now()
      };
    }
    return p;
  });
  this.save();
}

addResource(projectId: string, resource: Omit<ProjectResource, 'id' | 'createdAt'>) {
  this.projects = this.projects.map((p) => {
    if (p.id === projectId) {
      const newResource: ProjectResource = {
        ...resource,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      return {
        ...p,
        resources: [...(p.resources || []), newResource],
        updatedAt: Date.now()
      };
    }
    return p;
  });
  this.save();
}

removeResource(projectId: string, resourceId: string) {
  this.projects = this.projects.map((p) => {
    if (p.id === projectId) {
      return {
        ...p,
        resources: (p.resources || []).filter((r) => r.id !== resourceId),
        updatedAt: Date.now()
      };
    }
    return p;
  });
  this.save();
}

updateTags(id: string, tags: string[]) {
  this.projects = this.projects.map((p) =>
    p.id === id ? { ...p, tags, updatedAt: Date.now() } : p
  );
  this.save();
}
```

---

### **Step 3: Create ProjectDetailModal Component**

**File:** `src/lib/components/ProjectDetailModal.svelte`

**Features:**
- Full-screen modal with glassmorphism
- Tabbed sections for organization
- Markdown support for description/notes
- Link management with icons
- Resource management
- Deadline picker
- Status selector
- Tags system
- Collapsible sections

**Sections:**
1. **Overview** - Name, description, objective, status
2. **Timeline** - Deadline, created date, progress
3. **Links** - External links with type icons
4. **Resources** - Documents, files, references
5. **Tasks** - List of tasks in this project (read-only)
6. **Tags** - Project categorization

**UI Components:**
```svelte
<!-- Header with project name and color -->
<div class="sticky top-0 bg-white/95 backdrop-blur-md">
  <div class="flex items-center gap-3">
    <div class="w-12 h-12 rounded-xl" style="background: {project.color}"></div>
    <h2>{project.name}</h2>
    <StatusBadge status={project.status} />
  </div>
</div>

<!-- Tabbed Navigation -->
<div class="flex gap-2 border-b">
  <button class="tab {activeTab === 'overview' ? 'active' : ''}">Overview</button>
  <button class="tab {activeTab === 'links' ? 'active' : ''}">Links</button>
  <button class="tab {activeTab === 'resources' ? 'active' : ''}">Resources</button>
  <button class="tab {activeTab === 'tasks' ? 'active' : ''}">Tasks</button>
</div>

<!-- Content Area -->
<div class="content">
  {#if activeTab === 'overview'}
    <!-- Description with markdown -->
    <!-- Objective -->
    <!-- Deadline picker -->
    <!-- Status selector -->
  {:else if activeTab === 'links'}
    <!-- Link list with add/remove -->
  {:else if activeTab === 'resources'}
    <!-- Resource list with add/remove -->
  {:else if activeTab === 'tasks'}
    <!-- Task list (read-only) -->
  {/if}
</div>
```

---

### **Step 4: Update ProjectCard Component**

**File:** `src/lib/components/ProjectCard.svelte`

Add click handler to open modal:

```svelte
<script>
  import ProjectDetailModal from './ProjectDetailModal.svelte';
  
  let showDetailModal = $state(false);
  
  function handleProjectClick() {
    showDetailModal = true;
  }
</script>

<!-- Add click handler to project header -->
<button onclick={handleProjectClick} class="project-header">
  <!-- Existing header content -->
</button>

<!-- Add modal at bottom -->
<ProjectDetailModal 
  {project} 
  bind:isOpen={showDetailModal} 
  onClose={() => showDetailModal = false} 
/>
```

---

## 🎯 Key Features

### 1. **Description/Notes**
- Markdown editor with preview toggle
- Auto-save on blur
- Syntax highlighting for code blocks

### 2. **Links Management**
- Add external links with title and URL
- Categorize by type (docs, repo, design, other)
- Icon indicators for each type
- Click to open in new tab
- Delete functionality

### 3. **Resources**
- Add documents, images, videos
- Title and description
- Optional URL or file reference
- Type categorization
- Preview thumbnails for images

### 4. **Deadline**
- Date picker component
- Visual countdown/progress indicator
- Overdue warning styling
- Clear deadline option

### 5. **Objective**
- Single clear goal statement
- Prominent display
- Markdown support

### 6. **Status**
- Dropdown selector
- Visual badges with colors:
  - Planning: Blue
  - Active: Green
  - Paused: Orange
  - Completed: Purple

### 7. **Tags**
- Add/remove tags
- Color-coded chips
- Filter projects by tags (future)

---

## 🎨 Styling Guidelines

### Modal Container
```css
backdrop-blur-md bg-white/90
rounded-2xl border border-white/40
shadow-2xl
max-w-4xl w-full
max-h-[90vh] overflow-y-auto
```

### Section Headers
```css
text-lg font-bold text-gray-800
border-b border-gray-200
pb-2 mb-4
```

### Input Fields
```css
bg-white/60 backdrop-blur-sm
border-2 border-white/40
focus:border-pastel-lavender
rounded-lg px-4 py-3
```

### Buttons
```css
bg-pastel-{color}/60 hover:bg-pastel-{color}/80
rounded-lg px-4 py-2
transition-all hover:scale-105
```

### Tabs
```css
px-4 py-2 rounded-t-lg
transition-all
active: bg-white/60 border-b-2 border-pastel-lavender
inactive: hover:bg-white/30
```

---

## 📝 Implementation Checklist

- [ ] Update Project interface with new fields
- [ ] Update ProjectLink and ProjectResource interfaces
- [ ] Add store methods for updating project details
- [ ] Create ProjectDetailModal component
- [ ] Add Overview tab with description, objective, status
- [ ] Add Timeline section with deadline picker
- [ ] Add Links tab with add/remove functionality
- [ ] Add Resources tab with add/remove functionality
- [ ] Add Tasks tab (read-only list)
- [ ] Add Tags management
- [ ] Integrate modal with ProjectCard click
- [ ] Add markdown support for description
- [ ] Add date picker for deadline
- [ ] Add status selector dropdown
- [ ] Style with glassmorphism theme
- [ ] Add animations and transitions
- [ ] Test on mobile/responsive
- [ ] Add keyboard shortcuts (Esc to close)

---

## 🚀 Future Enhancements

1. **Progress Tracking** - Visual progress bar based on completed tasks
2. **Collaborators** - Add team members to projects
3. **Comments** - Discussion thread for project
4. **Activity Log** - Timeline of changes
5. **Templates** - Pre-made project structures
6. **Export** - Download project details as PDF/Markdown
7. **Attachments** - Upload files directly
8. **Subtasks** - Nested task hierarchy
9. **Time Tracking** - Log hours spent on project
10. **Integrations** - Connect to GitHub, Notion, etc.

---

## 🎯 Success Metrics

- ✅ Modal opens smoothly when clicking project
- ✅ All fields save properly to localStorage
- ✅ Markdown renders correctly
- ✅ Links open in new tabs
- ✅ Deadline shows countdown
- ✅ Status updates reflect in project card
- ✅ Mobile responsive
- ✅ Matches app aesthetic

---

**Ready to implement? Start with Step 1 and work through sequentially!**
