<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import DayView from '$lib/components/DayView.svelte';

	// Initialize with today's date at midnight for proper calendar selection
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	let selectedDate = $state(today);
</script>

<div class="min-h-screen p-6 pt-24">
	<div class="max-w-7xl mx-auto">
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
