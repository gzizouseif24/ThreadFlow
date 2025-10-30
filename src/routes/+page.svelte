<script lang="ts">
	import { onMount } from 'svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { runMigration } from '$lib/utils/migration';
	import CanvasBoard from '$lib/components/CanvasBoard.svelte';
	import JunkDrawer from '$lib/components/JunkDrawer.svelte';
	import { Sparkles, Plus, Trash2, LogIn, Settings, User } from 'lucide-svelte';

	let junkDrawerOpen = $state(false);

	onMount(() => {
		// Run data migration on app load
		runMigration();
	});
</script>

<!-- Minimalist Header -->
<header class="fixed top-0 left-0 right-0 z-30 pointer-events-none">
	<div class="mx-auto px-6 py-6 flex items-center justify-between">
		<!-- Left: Empty spacer -->
		<div class="flex items-center gap-2 pointer-events-auto">
			<button
				type="button"
				class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm"
				title="Settings"
			>
				<Settings size={20} class="text-gray-700" />
			</button>
		</div>

		<!-- Center: Branding -->
		<div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
			<Sparkles class="text-pastel-lilac drop-shadow-md" size={32} />
			<h1 class="text-4xl font-bold text-gray-800 drop-shadow-md tracking-tight">Threadflow</h1>
		</div>

		<!-- Right: Actions -->
		<div class="flex items-center gap-2 pointer-events-auto">
			<button
				type="button"
				onclick={() => (junkDrawerOpen = !junkDrawerOpen)}
				class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm relative"
				title="Junk (Ctrl+Shift+J)"
			>
				<Trash2 size={20} class="text-gray-700" />
				{#if tabsStore.deletedTabs.length > 0}
					<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
						{tabsStore.deletedTabs.length}
					</span>
				{/if}
			</button>
			<button
				type="button"
				class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm"
				title="Login"
			>
				<LogIn size={20} class="text-gray-700" />
			</button>
		</div>
	</div>
</header>

<!-- Canvas Area -->
<main class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden p-6 pt-24 pb-6">
	<div class="h-full rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/10">
		<CanvasBoard />
	</div>
</main>

<!-- Junk Drawer -->
<JunkDrawer bind:isOpen={junkDrawerOpen} />

