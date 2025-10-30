<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import DayView from '$lib/components/DayView.svelte';

	let selectedDate = $state(new Date());
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
