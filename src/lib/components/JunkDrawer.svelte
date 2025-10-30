<script lang="ts">
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { Trash2, RotateCcw, X, Trash } from 'lucide-svelte';

	let { isOpen = $bindable() }: { isOpen: boolean } = $props();

	const deletedTasks = $derived(tabsStore.deletedTabs);

	function handleRestore(id: string) {
		tabsStore.restore(id);
	}

	function handlePermanentDelete(id: string, content: string) {
		if (confirm(`Permanently delete "${content}"? This cannot be undone.`)) {
			tabsStore.permanentDelete(id);
		}
	}

	function handleEmptyJunk() {
		if (
			confirm(`Empty all junk? This will permanently delete ${deletedTasks.length} items. This cannot be undone.`)
		) {
			tabsStore.emptyJunk();
		}
	}

	function getTimeAgo(deletedAt: number | null): string {
		if (!deletedAt) return 'Unknown';

		const now = Date.now();
		const diff = now - deletedAt;

		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		return `${days} day${days > 1 ? 's' : ''} ago`;
	}
</script>

<!-- Overlay -->
{#if isOpen}
	<div
		class="fixed inset-0 bg-black/20 z-40 transition-opacity"
		onclick={() => (isOpen = false)}
	></div>
{/if}

<!-- Drawer -->
<div
	class="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
	class:translate-x-0={isOpen}
	class:translate-x-full={!isOpen}
>
	<!-- Header -->
	<div class="p-6 border-b border-gray-200 flex items-center justify-between bg-pastel-lilac/30">
		<div class="flex items-center gap-2">
			<Trash2 class="w-6 h-6 text-gray-700" />
			<h2 class="text-2xl font-bold text-gray-800">Junk</h2>
		</div>

		<button
			type="button"
			onclick={() => (isOpen = false)}
			class="p-2 hover:bg-white/50 rounded-full transition-colors"
			title="Close"
		>
			<X class="w-5 h-5 text-gray-700" />
		</button>
	</div>

	<!-- Info Banner -->
	<div class="p-4 bg-yellow-50 border-b border-yellow-100">
		<p class="text-xs text-yellow-800">
			<strong>Auto-cleanup:</strong> Items are permanently deleted after 30 days
		</p>
	</div>

	<!-- Action Bar -->
	{#if deletedTasks.length > 0}
		<div class="p-4 border-b border-gray-200">
			<button
				type="button"
				onclick={handleEmptyJunk}
				class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
			>
				<Trash class="w-4 h-4" />
				Empty Junk ({deletedTasks.length})
			</button>
		</div>
	{/if}

	<!-- Task List -->
	<div class="flex-1 overflow-y-auto p-4 space-y-3">
		{#if deletedTasks.length === 0}
			<div class="flex flex-col items-center justify-center h-full text-center text-gray-400">
				<Trash2 class="w-16 h-16 mb-4 opacity-50" />
				<p class="text-lg font-semibold">Junk is empty</p>
				<p class="text-sm mt-1">Deleted tasks will appear here</p>
			</div>
		{:else}
			{#each deletedTasks as task (task.id)}
				<div
					class="group bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-all"
				>
					<div class="flex items-start gap-3">
						{#if task.imageUrl}
							<img
								src={task.imageUrl}
								alt="Icon"
								class="w-8 h-8 rounded object-cover opacity-50"
							/>
						{/if}

						<div class="flex-1 min-w-0">
							<p class="text-sm text-gray-600 line-through break-words">
								{task.content}
							</p>
							<p class="text-xs text-gray-400 mt-1">
								Deleted {getTimeAgo(task.deletedAt)}
							</p>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							type="button"
							onclick={() => handleRestore(task.id)}
							class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-pastel-mint text-gray-700 rounded-md hover:bg-pastel-mint/80 transition-colors text-sm font-medium"
							title="Restore task"
						>
							<RotateCcw class="w-3 h-3" />
							Restore
						</button>
						<button
							type="button"
							onclick={() => handlePermanentDelete(task.id, task.content)}
							class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-pastel-pink text-gray-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
							title="Delete forever"
						>
							<Trash class="w-3 h-3" />
							Delete Forever
						</button>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
