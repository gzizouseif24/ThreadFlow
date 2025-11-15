import type { Event } from '$lib/types/journal';
import { storage } from '$lib/utils/storage';

class EventsStore {
	events = $state<Event[]>([]);

	constructor() {
		this.events = storage.getEvents();
	}

	add(title: string, date: string, time?: string, description?: string) {
		const newEvent: Event = {
			id: crypto.randomUUID(),
			title,
			description,
			date,
			time,
			linkedTaskIds: [],
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		this.events = [...this.events, newEvent];
		this.save();
		return newEvent.id;
	}

	update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) {
		this.events = this.events.map((event) =>
			event.id === id ? { ...event, ...data, updatedAt: Date.now() } : event
		);
		this.save();
	}

	delete(id: string) {
		this.events = this.events.filter((event) => event.id !== id);
		this.save();
	}

	linkTask(eventId: string, taskId: string) {
		this.events = this.events.map((event) => {
			if (event.id === eventId) {
				const linkedIds = new Set(event.linkedTaskIds || []);
				linkedIds.add(taskId);
				return { ...event, linkedTaskIds: Array.from(linkedIds), updatedAt: Date.now() };
			}
			return event;
		});
		this.save();
	}

	unlinkTask(eventId: string, taskId: string) {
		this.events = this.events.map((event) => {
			if (event.id === eventId) {
				const linkedIds = (event.linkedTaskIds || []).filter(id => id !== taskId);
				return { ...event, linkedTaskIds: linkedIds, updatedAt: Date.now() };
			}
			return event;
		});
		this.save();
	}

	getEventsByDate(date: string): Event[] {
		return this.events.filter((event) => event.date === date);
	}

	getEventsInRange(startDate: string, endDate: string): Event[] {
		return this.events.filter((event) => event.date >= startDate && event.date <= endDate);
	}

	private save() {
		storage.setEvents(this.events);
	}
}

export const eventsStore = new EventsStore();
