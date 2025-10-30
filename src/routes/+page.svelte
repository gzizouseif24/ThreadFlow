<script lang="ts">
	import { onMount } from 'svelte';
	import { runMigration } from '$lib/utils/migration';
	import CanvasBoard from '$lib/components/CanvasBoard.svelte';

	onMount(() => {
		// Run data migration on app load
		runMigration();
	});
</script>

<!-- Canvas Area -->
<main class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden p-6 pt-24 pb-6">
	<div
		class="h-full rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/10"
	>
		<CanvasBoard />
	</div>
</main>

