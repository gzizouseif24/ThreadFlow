import type { Tab } from '$lib/types/tab';
import { storage } from '$lib/utils/storage';

class TabsStore {
	tabs = $state<Tab[]>([]);

	constructor() {
		// Load tabs and cleanup old junk
		let loadedTabs = storage.get();
		const initialLength = loadedTabs.length;
		loadedTabs = storage.cleanupOldJunk(loadedTabs);

		// Remove duplicate tasks based on ID
		const seen = new Set<string>();
		const deduplicatedTabs = loadedTabs.filter(tab => {
			if (seen.has(tab.id)) {
				console.warn(`Removing duplicate task with ID: ${tab.id}`);
				return false;
			}
			seen.add(tab.id);
			return true;
		});

		this.tabs = deduplicatedTabs;

		// Save cleaned data if any duplicates or junk were removed
		if (deduplicatedTabs.length !== initialLength) {
			this.save();
		}
	}

	add(content: string, position?: { x: number; y: number }, parentId: string | null = null) {
		const newTab: Tab = {
			id: crypto.randomUUID(),
			content,
			parentId,
			isPinned: false,
			isCompleted: false,
			isDeleted: false,
			deletedAt: null,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			position: position || { x: Math.random() * 400, y: Math.random() * 300 }
		};
		this.tabs = [...this.tabs, newTab];
		this.save();
	}

	update(id: string, content: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, content, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	togglePin(id: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, isPinned: !tab.isPinned, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	toggleComplete(id: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, isCompleted: !tab.isCompleted, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	// Soft delete - move to junk
	delete(id: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id
				? { ...tab, isDeleted: true, deletedAt: Date.now(), updatedAt: Date.now() }
				: tab
		);
		this.save();
	}

	// Restore from junk
	restore(id: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, isDeleted: false, deletedAt: null, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	// Permanent delete
	permanentDelete(id: string) {
		this.tabs = this.tabs.filter((tab) => tab.id !== id);
		this.save();
	}

	// Empty junk - permanently delete all deleted items
	emptyJunk() {
		this.tabs = this.tabs.filter((tab) => !tab.isDeleted);
		this.save();
	}

	// Move task to project
	moveToProject(taskId: string, projectId: string | null) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === taskId ? { ...tab, parentId: projectId, updatedAt: Date.now() } : tab
		);
		this.save();
	}

reorder(newOrder: Tab[]) {
		this.tabs = newOrder;
		this.save();
	}

	// Reorder tasks within a project
	reorderInProject(projectId: string | null, newOrder: Tab[]) {
		// Get all tasks NOT in this project
		const otherTasks = this.tabs.filter(tab => tab.parentId !== projectId);
		// Combine: other tasks first, then reordered project tasks
		this.tabs = [...otherTasks, ...newOrder];
		this.save();
	}

	updatePosition(id: string, position: { x: number; y: number }) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, position, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	updateImage(id: string, imageUrl: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, imageUrl, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	updateNotes(id: string, notes: string) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, notes, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	updateTags(id: string, tags: string[]) {
		this.tabs = this.tabs.map((tab) =>
			tab.id === id ? { ...tab, tags, updatedAt: Date.now() } : tab
		);
		this.save();
	}

	// Derived getters
	get activeTabs(): Tab[] {
		return this.tabs.filter((tab) => !tab.isDeleted);
	}

	get deletedTabs(): Tab[] {
		return this.tabs.filter((tab) => tab.isDeleted);
	}

	get rootTasks(): Tab[] {
		return this.tabs.filter((tab) => tab.parentId === null && !tab.isDeleted);
	}

	getTasksByProject(projectId: string): Tab[] {
		return this.tabs.filter((tab) => tab.parentId === projectId && !tab.isDeleted);
	}

	private save() {
		storage.set(this.tabs);
	}
}

export const tabsStore = new TabsStore();
