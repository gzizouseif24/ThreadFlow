import type { CalendarDay } from '$lib/types/journal';

export function getMonthDays(year: number, month: number): CalendarDay[] {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

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
	// Reset time to midnight for accurate comparison
	today.setHours(0, 0, 0, 0);
	const compareDate = new Date(date);
	compareDate.setHours(0, 0, 0, 0);
	
	return {
		date,
		dateString: formatDate(date),
		isCurrentMonth,
		isToday: compareDate.getTime() === today.getTime(),
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
