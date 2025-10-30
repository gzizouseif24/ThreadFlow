import type { JournalEntry } from '$lib/types/journal';

class JournalStore {
	entries = $state<JournalEntry[]>([]);

	constructor() {
		this.entries = this.loadEntries();
	}

	private loadEntries(): JournalEntry[] {
		if (typeof window === 'undefined') return [];
		const stored = localStorage.getItem('threadflow_journal');
		return stored ? JSON.parse(stored) : [];
	}

	private save() {
		if (typeof window === 'undefined') return;
		localStorage.setItem('threadflow_journal', JSON.stringify(this.entries));
	}

	getEntry(date: string): JournalEntry | undefined {
		return this.entries.find((e) => e.date === date);
	}

	createOrUpdate(date: string, data: Partial<JournalEntry>) {
		const existing = this.getEntry(date);

		if (existing) {
			// Update existing
			this.entries = this.entries.map((e) =>
				e.date === date ? { ...e, ...data, updatedAt: Date.now() } : e
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
		this.entries = this.entries.filter((e) => e.date !== date);
		this.save();
	}

	getEntriesInRange(startDate: string, endDate: string): JournalEntry[] {
		return this.entries.filter((e) => e.date >= startDate && e.date <= endDate);
	}

	search(query: string): JournalEntry[] {
		const lowerQuery = query.toLowerCase();
		return this.entries.filter(
			(e) =>
				e.notes.toLowerCase().includes(lowerQuery) ||
				e.reflection.toLowerCase().includes(lowerQuery)
		);
	}
}

export const journalStore = new JournalStore();
