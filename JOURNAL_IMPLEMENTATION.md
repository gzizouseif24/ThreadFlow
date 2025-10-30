# 📅 Calendar + Journal Feature Implementation Guide

## Overview
Add a minimalist calendar-based journaling system to Threadflow with glassmorphism design matching the existing aesthetic.

---

## 🎨 Design Principles

### Visual Style
- **Glassmorphism/Translucent design** - `backdrop-blur-md bg-white/30`
- **Vibrant pastel colors** - Match existing palette
- **Smooth animations** - GSAP for transitions
- **Minimalist layout** - Clean, spacious, intuitive

### Color Palette (Existing)
```css
Hot Pink: #FF69B4
Purple: #B57EDC
Mint: #00E5A0
Peach: #FFB347
Sky Blue: #4FC3F7
Orchid: #DA70D6
```

---

## 📦 Libraries & Dependencies

### Already Installed ✅
- `gsap` - Animations
- `lucide-svelte` - Icons
- `tailwindcss` - Styling
- `@neodrag/svelte` - Drag interactions (if needed)

### No New Dependencies Needed! 🎉
We'll build a custom calendar component using native JavaScript Date API.

---

## 📁 File Structure

```
src/
├── routes/
│   ├── +page.svelte              # Canvas (existing)
│   ├── +layout.svelte            # Add navigation
│   └── journal/
│       └── +page.svelte          # New Journal page
├── lib/
│   ├── components/
│   │   ├── Calendar.svelte       # Monthly calendar grid
│   │   ├── DayView.svelte        # Journal entry editor
│   │   ├── TaskTimeline.svelte   # Completed tasks list
│   │   └── JournalNav.svelte     # Month navigation
│   ├── stores/
│   │   └── journal.svelte.ts     # Journal entries store
│   ├── types/
│   │   └── journal.ts            # TypeScript interfaces
│   └── utils/
│       ├── dateUtils.ts          # Date helper functions
│       └── journalStorage.ts     # LocalStorage helpers
```

---

## 🔧 Implementation Steps

### **Step 1: Create Type Definitions**

**File:** `src/lib/types/journal.ts`

```typescript
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  notes: string;
  reflection: string;
  mood?: 'great' | 'good' | 'okay' | 'bad';
  completedTaskIds: string[];
  projectMentions: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEntry: boolean;
  taskCount: number;
}
```

---

### **Step 2: Create Date Utilities**

**File:** `src/lib/utils/dateUtils.ts`

```typescript
export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);
  
  const days: CalendarDay[] = [];
  
  // Previous month days
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(createCalendarDay(date, false));
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push(createCalendarDay(date, true));
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push(createCalendarDay(date, false));
  }
  
  return days;
}

function createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
  const today = new Date();
  return {
    date,
    dateString: formatDate(date),
    isCurrentMonth,
    isToday: isSameDay(date, today),
    hasEntry: false, // Will be updated by store
    taskCount: 0 // Will be updated by store
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

export function getMonthName(month: number): string {
  return new Date(2000, month).toLocaleString('default', { month: 'long' });
}
```

---

### **Step 3: Create Journal Store**

**File:** `src/lib/stores/journal.svelte.ts`

```typescript
import type { JournalEntry } from '$lib/types/journal';
import { storage } from '$lib/utils/storage';

class JournalStore {
  entries = $state<JournalEntry[]>([]);

  constructor() {
    this.entries = this.loadEntries();
  }

  private loadEntries(): JournalEntry[] {
    const stored = localStorage.getItem('threadflow_journal');
    return stored ? JSON.parse(stored) : [];
  }

  private save() {
    localStorage.setItem('threadflow_journal', JSON.stringify(this.entries));
  }

  getEntry(date: string): JournalEntry | undefined {
    return this.entries.find(e => e.date === date);
  }

  createOrUpdate(date: string, data: Partial<JournalEntry>) {
    const existing = this.getEntry(date);
    
    if (existing) {
      // Update existing
      this.entries = this.entries.map(e =>
        e.date === date
          ? { ...e, ...data, updatedAt: Date.now() }
          : e
      );
    } else {
      // Create new
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        date,
        notes: data.notes || '',
        reflection: data.reflection || '',
        mood: data.mood,
        completedTaskIds: data.completedTaskIds || [],
        projectMentions: data.projectMentions || [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.entries = [...this.entries, newEntry];
    }
    
    this.save();
  }

  delete(date: string) {
    this.entries = this.entries.filter(e => e.date !== date);
    this.save();
  }

  getEntriesInRange(startDate: string, endDate: string): JournalEntry[] {
    return this.entries.filter(e => e.date >= startDate && e.date <= endDate);
  }

  search(query: string): JournalEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries.filter(e =>
      e.notes.toLowerCase().includes(lowerQuery) ||
      e.reflection.toLowerCase().includes(lowerQuery)
    );
  }
}

export const journalStore = new JournalStore();
```

---

### **Step 4: Create Calendar Component**

**File:** `src/lib/components/Calendar.svelte`

```svelte
<script lang="ts">
  import { getMonthDays, getMonthName } from '$lib/utils/dateUtils';
  import { journalStore } from '$lib/stores/journal.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  
  let { selectedDate = $bindable(), onDateSelect }: {
    selectedDate: Date;
    onDateSelect?: (date: Date) => void;
  } = $props();
  
  let currentMonth = $state(selectedDate.getMonth());
  let currentYear = $state(selectedDate.getFullYear());
  
  const days = $derived(getMonthDays(currentYear, currentMonth));
  const monthName = $derived(getMonthName(currentMonth));
  
  function prevMonth() {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
  }
  
  function nextMonth() {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
  }
  
  function selectDay(day: CalendarDay) {
    selectedDate = day.date;
    onDateSelect?.(day.date);
  }
  
  function hasEntry(dateString: string): boolean {
    return !!journalStore.getEntry(dateString);
  }
</script>

<div class="calendar-container backdrop-blur-md bg-white/30 rounded-2xl border border-white/40 p-6 shadow-xl">
  <!-- Month Navigation -->
  <div class="flex items-center justify-between mb-6">
    <button
      onclick={prevMonth}
      class="p-2 hover:bg-white/40 rounded-full transition-all"
    >
      <ChevronLeft size={20} class="text-gray-700" />
    </button>
    
    <h2 class="text-2xl font-bold text-gray-800">
      {monthName} {currentYear}
    </h2>
    
    <button
      onclick={nextMonth}
      class="p-2 hover:bg-white/40 rounded-full transition-all"
    >
      <ChevronRight size={20} class="text-gray-700" />
    </button>
  </div>
  
  <!-- Weekday Headers -->
  <div class="grid grid-cols-7 gap-2 mb-2">
    {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
      <div class="text-center text-xs font-semibold text-gray-600 py-2">
        {day}
      </div>
    {/each}
  </div>
  
  <!-- Calendar Grid -->
  <div class="grid grid-cols-7 gap-2">
    {#each days as day}
      <button
        onclick={() => selectDay(day)}
        class="
          relative aspect-square rounded-lg p-2 text-sm font-medium
          transition-all duration-200
          {day.isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
          {day.isToday ? 'bg-pastel-sky/50 ring-2 ring-pastel-sky' : ''}
          {day.date.getTime() === selectedDate.getTime() ? 'bg-pastel-lavender/60 scale-105' : 'hover:bg-white/40'}
        "
      >
        {day.date.getDate()}
        
        <!-- Entry Indicator -->
        {#if hasEntry(day.dateString)}
          <div class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pastel-mint"></div>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .calendar-container {
    animation: fadeIn 0.4s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

---

### **Step 5: Create Day View Component**

**File:** `src/lib/components/DayView.svelte`

```svelte
<script lang="ts">
  import { journalStore } from '$lib/stores/journal.svelte';
  import { tabsStore } from '$lib/stores/tabs.svelte';
  import { formatDate } from '$lib/utils/dateUtils';
  import { Check } from 'lucide-svelte';
  
  let { selectedDate }: { selectedDate: Date } = $props();
  
  const dateString = $derived(formatDate(selectedDate));
  const entry = $derived(journalStore.getEntry(dateString));
  
  let notes = $state(entry?.notes || '');
  let reflection = $state(entry?.reflection || '');
  
  // Get completed tasks for this date
  const completedTasks = $derived(
    tabsStore.tabs.filter(t => 
      t.isCompleted && 
      new Date(t.updatedAt).toDateString() === selectedDate.toDateString()
    )
  );
  
  function saveEntry() {
    journalStore.createOrUpdate(dateString, {
      notes,
      reflection,
      completedTaskIds: completedTasks.map(t => t.id)
    });
  }
  
  // Auto-save on blur
  $effect(() => {
    return () => saveEntry();
  });
</script>

<div class="day-view backdrop-blur-md bg-white/30 rounded-2xl border border-white/40 p-6 shadow-xl">
  <!-- Date Header -->
  <h2 class="text-2xl font-bold text-gray-800 mb-6">
    {selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
  </h2>
  
  <!-- Notes Section -->
  <div class="mb-6">
    <label class="block text-sm font-semibold text-gray-700 mb-2">
      📝 Today's Notes
    </label>
    <textarea
      bind:value={notes}
      onblur={saveEntry}
      placeholder="What happened today?..."
      class="w-full h-32 px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm"
    ></textarea>
  </div>
  
  <!-- Completed Tasks -->
  {#if completedTasks.length > 0}
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        ✅ Completed Today ({completedTasks.length})
      </label>
      <div class="space-y-2">
        {#each completedTasks as task}
          <div class="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-lg">
            <Check size={14} class="text-pastel-mint" />
            <span class="text-sm text-gray-700">{task.content}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Reflection Section -->
  <div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">
      💭 Evening Reflection
    </label>
    <textarea
      bind:value={reflection}
      onblur={saveEntry}
      placeholder="How do you feel about today?..."
      class="w-full h-24 px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm"
    ></textarea>
  </div>
</div>

<style>
  .day-view {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
```

---

### **Step 6: Create Journal Page**

**File:** `src/routes/journal/+page.svelte`

```svelte
<script lang="ts">
  import Calendar from '$lib/components/Calendar.svelte';
  import DayView from '$lib/components/DayView.svelte';
  
  let selectedDate = $state(new Date());
</script>

<div class="min-h-screen p-6 pt-24">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center drop-shadow-md">
      📅 Journal
    </h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Calendar -->
      <div>
        <Calendar bind:selectedDate />
      </div>
      
      <!-- Day View -->
      <div>
        <DayView {selectedDate} />
      </div>
    </div>
  </div>
</div>
```

---

### **Step 7: Add Navigation**

**File:** `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Sparkles, Calendar, Settings, Trash2, LogIn } from 'lucide-svelte';
  import { tabsStore } from '$lib/stores/tabs.svelte';
  import JunkDrawer from '$lib/components/JunkDrawer.svelte';
  import '../app.css';
  
  let { children } = $props();
  let junkDrawerOpen = $state(false);
</script>

<!-- Header with Navigation -->
<header class="fixed top-0 left-0 right-0 z-30 pointer-events-none">
  <div class="mx-auto px-6 py-6 flex items-center justify-between">
    <!-- Left: Navigation -->
    <div class="flex items-center gap-2 pointer-events-auto">
      <a
        href="/"
        class="px-4 py-2 rounded-full transition-all backdrop-blur-sm {$page.url.pathname === '/' ? 'bg-white/60' : 'hover:bg-white/40'}"
      >
        Canvas
      </a>
      <a
        href="/journal"
        class="px-4 py-2 rounded-full transition-all backdrop-blur-sm {$page.url.pathname === '/journal' ? 'bg-white/60' : 'hover:bg-white/40'}"
      >
        <Calendar size={18} class="inline mr-1" />
        Journal
      </a>
    </div>

    <!-- Center: Branding -->
    <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
      <Sparkles class="text-pastel-lilac drop-shadow-md" size={32} />
      <h1 class="text-4xl font-bold text-gray-800 drop-shadow-md tracking-tight">Threadflow</h1>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 pointer-events-auto">
      <button
        onclick={() => (junkDrawerOpen = !junkDrawerOpen)}
        class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm relative"
      >
        <Trash2 size={20} class="text-gray-700" />
        {#if tabsStore.deletedTabs.length > 0}
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {tabsStore.deletedTabs.length}
          </span>
        {/if}
      </button>
      <button class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm">
        <LogIn size={20} class="text-gray-700" />
      </button>
    </div>
  </div>
</header>

{@render children()}

<JunkDrawer bind:isOpen={junkDrawerOpen} />
```

---

## 🎨 Glassmorphism CSS Classes

Add these to your components:

```css
/* Translucent card */
backdrop-blur-md bg-white/30 border border-white/40

/* Hover effect */
hover:bg-white/40 transition-all

/* Input fields */
bg-white/60 backdrop-blur-sm border-2 border-white/40

/* Selected state */
bg-pastel-lavender/60 ring-2 ring-pastel-lavender
```

---

## ✅ Testing Checklist

- [ ] Calendar displays current month correctly
- [ ] Can navigate between months
- [ ] Can select different days
- [ ] Journal entries save to localStorage
- [ ] Completed tasks show up in day view
- [ ] Glassmorphism effects render properly
- [ ] Responsive on mobile
- [ ] Animations are smooth

---

## 🚀 Future Enhancements

1. **Mood tracking** - Add emoji mood selector
2. **Search** - Full-text search across entries
3. **Export** - Download journal as Markdown
4. **Streaks** - Track consecutive journaling days
5. **Templates** - Pre-made journal prompts
6. **Images** - Attach photos to entries

---

## 📝 Notes

- No external calendar library needed - custom implementation
- Uses existing color palette and design system
- Fully integrated with task management
- LocalStorage for persistence
- Mobile-friendly responsive design

---

**Ready to implement? Start with Step 1 and work through sequentially!**
