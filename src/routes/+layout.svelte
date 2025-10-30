<script lang="ts">
	import { page } from '$app/stores';
	import { Sparkles, Calendar, Settings, Trash2, LogIn } from 'lucide-svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import JunkDrawer from '$lib/components/JunkDrawer.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
	let junkDrawerOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Header with Navigation -->
<header class="fixed top-0 left-0 right-0 z-30 pointer-events-none">
	<div class="mx-auto px-6 py-6 flex items-center justify-between">
		<!-- Left: Navigation -->
		<div class="flex items-center gap-2 pointer-events-auto">
			<a
				href="/"
				class="px-4 py-2 rounded-full transition-all backdrop-blur-sm {$page.url.pathname === '/'
					? 'bg-white/60'
					: 'hover:bg-white/40'}"
			>
				Canvas
			</a>
			<a
				href="/journal"
				class="px-4 py-2 rounded-full transition-all backdrop-blur-sm flex items-center gap-1 {$page.url
					.pathname === '/journal'
					? 'bg-white/60'
					: 'hover:bg-white/40'}"
			>
				<Calendar size={18} />
				Journal
			</a>
		</div>

		<!-- Center: Branding -->
		<div class="absolute left-1/2 -translate-x-1/2">
			<h1 class="text-4xl font-bold text-gray-900 drop-shadow-md tracking-tight">Threadflow</h1>
		</div>

		<!-- Right: Actions -->
		<div class="flex items-center gap-2 pointer-events-auto">
			<button
				type="button"
				onclick={() => (junkDrawerOpen = !junkDrawerOpen)}
				class="p-2 hover:bg-white/40 rounded-full transition-all backdrop-blur-sm relative"
				title="Junk"
			>
				<Trash2 size={20} class="text-gray-700" />
				{#if tabsStore.deletedTabs.length > 0}
					<span
						class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
					>
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

{@render children?.()}

<JunkDrawer bind:isOpen={junkDrawerOpen} />
