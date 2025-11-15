import type { Tab, Project } from '$lib/types/tab';
import type { Event } from '$lib/types/journal';
import { browser } from '$app/environment';

const STORAGE_KEY_TABS = 'threadflow-tabs';
const STORAGE_KEY_PROJECTS = 'threadflow-projects';
const STORAGE_KEY_EVENTS = 'threadflow-events';

export const storage = {
	// Tab storage
	get(): Tab[] {
		if (!browser) return [];
		const data = localStorage.getItem(STORAGE_KEY_TABS);
		return data ? JSON.parse(data) : [];
	},

	set(tabs: Tab[]): void {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY_TABS, JSON.stringify(tabs));
	},

	clear(): void {
		if (!browser) return;
		localStorage.removeItem(STORAGE_KEY_TABS);
	},

	// Project storage
	getProjects(): Project[] {
		if (!browser) return [];
		const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
		return data ? JSON.parse(data) : [];
	},

	setProjects(projects: Project[]): void {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
	},

	clearProjects(): void {
		if (!browser) return;
		localStorage.removeItem(STORAGE_KEY_PROJECTS);
	},

	// Event storage
	getEvents(): Event[] {
		if (!browser) return [];
		const data = localStorage.getItem(STORAGE_KEY_EVENTS);
		return data ? JSON.parse(data) : [];
	},

	setEvents(events: Event[]): void {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
	},

	clearEvents(): void {
		if (!browser) return;
		localStorage.removeItem(STORAGE_KEY_EVENTS);
	},

	// Cleanup old junk (items deleted more than 30 days ago)
	cleanupOldJunk(tabs: Tab[]): Tab[] {
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
		return tabs.filter((tab) => {
			if (tab.isDeleted && tab.deletedAt && tab.deletedAt < thirtyDaysAgo) {
				return false; // Remove old deleted items
			}
			return true; // Keep everything else
		});
	}
};
