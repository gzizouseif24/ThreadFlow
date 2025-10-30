<script lang="ts">
	import type { Tab } from '$lib/types/tab';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { X, Calendar, Tag, FileText } from 'lucide-svelte';

	let { task, isOpen = $bindable(), onClose }: { task: Tab | null; isOpen: boolean; onClose: () => void } = $props();

	let notes = $state('');
	let tags = $state<string[]>([]);
	let newTag = $state('');

	// Update notes and tags when task changes
	$effect(() => {
		if (task) {
			notes = task.notes || '';
			tags = task.tags || [];
		}
	});

	function saveNotes() {
		if (!task) return;
		tabsStore.updateNotes(task.id, notes);
	}

	function addTag() {
		if (!task || !newTag.trim()) return;
		tags = [...tags, newTag.trim()];
		newTag = '';
		tabsStore.updateTags(task.id, tags);
	}

	function removeTag(index: number) {
		if (!task) return;
		tags = tags.filter((_, i) => i !== index);
		tabsStore.updateTags(task.id, tags);
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

{#if isOpen && task}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-full max-w-2xl mx-4 backdrop-blur-md bg-white/90 rounded-2xl border border-white/40 shadow-2xl max-h-[80vh] overflow-y-auto"
		>
			<!-- Header -->
			<div class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-800">Task Details</h2>
				<button
					onclick={onClose}
					class="p-2 hover:bg-gray-100 rounded-full transition"
					aria-label="Close"
				>
					<X size={20} class="text-gray-600" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6 space-y-6">
				<!-- Task Content -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<FileText size={16} />
						Task
					</label>
					<p class="text-gray-800 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
						{task.content}
					</p>
				</div>

				<!-- Created Date -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<Calendar size={16} />
						Created
					</label>
					<p class="text-gray-600 text-sm">
						{new Date(task.createdAt).toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
				</div>

				<!-- Status -->
				<div>
					<label class="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
					<div class="flex items-center gap-2">
						<span
							class="px-3 py-1 rounded-full text-sm font-medium {task.isCompleted
								? 'bg-green-100 text-green-700'
								: 'bg-blue-100 text-blue-700'}"
						>
							{task.isCompleted ? 'Completed' : 'In Progress'}
						</span>
						{#if task.isPinned}
							<span class="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
								Pinned
							</span>
						{/if}
					</div>
				</div>

				<!-- Notes Section -->
				<div>
					<label class="text-sm font-semibold text-gray-700 mb-2 block">Notes</label>
					<textarea
						bind:value={notes}
						onblur={saveNotes}
						placeholder="Add notes about this task..."
						class="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-200 bg-white focus:border-pastel-lavender focus:outline-none resize-none text-sm"
					></textarea>
				</div>

				<!-- Tags Section -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<Tag size={16} />
						Tags
					</label>
					<div class="flex flex-wrap gap-2 mb-2">
						{#each tags as tag, index}
							<span
								class="px-3 py-1 rounded-full text-sm bg-pastel-lavender/60 text-gray-700 flex items-center gap-1"
							>
								{tag}
								<button onclick={() => removeTag(index)} class="hover:text-red-600">
									<X size={14} />
								</button>
							</span>
						{/each}
					</div>
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={newTag}
							onkeydown={(e) => {
								if (e.key === 'Enter') addTag();
							}}
							placeholder="Add a tag..."
							class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-pastel-lavender focus:outline-none text-sm"
						/>
						<button
							onclick={addTag}
							class="px-4 py-2 rounded-lg bg-pastel-lavender hover:bg-pastel-lilac text-gray-800 font-medium text-sm transition"
						>
							Add
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
