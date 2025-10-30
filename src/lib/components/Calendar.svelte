<script lang="ts">
	import { getMonthDays, getMonthName } from '$lib/utils/dateUtils';
	import { journalStore } from '$lib/stores/journal.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { CalendarDay } from '$lib/types/journal';

	let {
		selectedDate = $bindable(),
		onDateSelect
	}: {
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

<div
	class="calendar-container backdrop-blur-md bg-white/30 rounded-2xl border border-white/40 p-6 shadow-xl"
>
	<!-- Month Navigation -->
	<div class="flex items-center justify-between mb-6">
		<button
			onclick={prevMonth}
			class="p-2 hover:bg-white/40 rounded-full transition-all"
			aria-label="Previous month"
		>
			<ChevronLeft size={20} class="text-gray-700" />
		</button>

		<h2 class="text-2xl font-bold text-gray-800">
			{monthName}
			{currentYear}
		</h2>

		<button
			onclick={nextMonth}
			class="p-2 hover:bg-white/40 rounded-full transition-all"
			aria-label="Next month"
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
          {day.isToday ? 'bg-pastel-sky/60 ring-2 ring-pastel-sky font-bold' : ''}
          {day.date.getTime() === selectedDate.getTime() && !day.isToday ? 'bg-pastel-lavender/60 scale-105' : ''}
          {!day.isToday && day.date.getTime() !== selectedDate.getTime() ? 'hover:bg-white/40' : ''}
        "
			>
				{day.date.getDate()}

				<!-- Entry Indicator -->
				{#if hasEntry(day.dateString)}
					<div
						class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pastel-mint"
					></div>
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
