import type { Tab } from '$lib/types/tab';
import { browser } from '$app/environment';

const MIGRATION_VERSION_KEY = 'threadflow-migration-version';
const CURRENT_VERSION = 2;

interface OldTab {
	id: string;
	content: string;
	isPinned: boolean;
	isCompleted: boolean;
	createdAt: number;
	updatedAt: number;
	position?: { x: number; y: number };
	imageUrl?: string;
	connectedTo?: string[];
}

export function getMigrationVersion(): number {
	if (!browser) return CURRENT_VERSION;
	const version = localStorage.getItem(MIGRATION_VERSION_KEY);
	return version ? parseInt(version, 10) : 0;
}

export function setMigrationVersion(version: number): void {
	if (!browser) return;
	localStorage.setItem(MIGRATION_VERSION_KEY, version.toString());
}

export function migrateTabData(oldTabs: OldTab[]): Tab[] {
	return oldTabs.map((tab) => {
		const { connectedTo, ...rest } = tab;
		return {
			...rest,
			parentId: null,
			isDeleted: false,
			deletedAt: null,
			position: tab.position || { x: Math.random() * 400, y: Math.random() * 300 }
		};
	});
}

export function runMigration(): void {
	if (!browser) return;

	const currentVersion = getMigrationVersion();

	if (currentVersion < CURRENT_VERSION) {
		console.log(`Running migration from version ${currentVersion} to ${CURRENT_VERSION}`);

		// Get old data
		const oldData = localStorage.getItem('threadflow-tabs');
		if (oldData) {
			try {
				const oldTabs: OldTab[] = JSON.parse(oldData);
				const migratedTabs = migrateTabData(oldTabs);

				// Save migrated data
				localStorage.setItem('threadflow-tabs', JSON.stringify(migratedTabs));

				console.log(`Successfully migrated ${migratedTabs.length} tasks`);
			} catch (error) {
				console.error('Migration failed:', error);
			}
		}

		// Update migration version
		setMigrationVersion(CURRENT_VERSION);
	}
}
