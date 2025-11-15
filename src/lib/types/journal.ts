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

export interface Event {
	id: string;
	title: string;
	description?: string;
	date: string; // YYYY-MM-DD format
	time?: string; // HH:MM format (optional)
	linkedTaskIds?: string[]; // Tasks linked to this event
	createdAt: number;
	updatedAt: number;
}
