<script lang="ts">
	import type { Tab } from '$lib/types/tab';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import TaskDetailModal from './TaskDetailModal.svelte';
	import confetti from 'canvas-confetti';
	import { Check, Undo2, Pin, MapPin, Edit3, Trash2, Image as ImageIcon, X, FolderPlus } from 'lucide-svelte';

	interface Props {
		tab: Tab;
	}

	let { tab }: Props = $props();
	let showDetailModal = $state(false);
	let isEditing = $state(false);
	let editContent = $state(tab.content);
	let imageInput = $state('');

	// Calculate card width based on content length - more granular
	const cardWidth = $derived(() => {
		const contentLength = tab.content.length;
		// Base width + proportional increase
		const baseWidth = 160;
		const charWidth = 2.5; // pixels per character
		const calculatedWidth = baseWidth + (contentLength * charWidth);
		// Clamp between min and max
		return Math.min(Math.max(calculatedWidth, 180), 400);
	});

	function handleEdit() {
		isEditing = true;
		editContent = tab.content;
	}

	function handleSave() {
		if (editContent.trim()) {
			tabsStore.update(tab.id, editContent.trim());
		}
		isEditing = false;
	}

	function handleCancel() {
		isEditing = false;
		editContent = tab.content;
	}

	function handleToggleComplete() {
		tabsStore.toggleComplete(tab.id);
		if (!tab.isCompleted) {
			triggerConfetti();
		}
	}

	function triggerConfetti() {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#FFD6E8', '#E5D4FF', '#D4FFE7', '#FFE5CC', '#D4E5FF']
		});
	}

	function handleAddImage() {
		if (imageInput.trim()) {
			tabsStore.updateImage(tab.id, imageInput.trim());
			imageInput = '';
		}
	}

	function handleRemoveImage() {
		tabsStore.updateImage(tab.id, '');
	}

	let showProjectMenu = $state(false);
	const allProjects = $derived(projectsStore.projects);

	function toggleProjectMenu() {
		showProjectMenu = !showProjectMenu;
	}

	function addToProject(projectId: string) {
		tabsStore.moveToProject(tab.id, projectId);
		showProjectMenu = false;
	}
</script>

<div
	class="tab-card group relative rounded-xl border border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 {tab.isCompleted
		? 'bg-white/20 opacity-70 shadow-sm'
		: 'bg-white/30 shadow-lg hover:shadow-2xl hover:bg-white/40'}"
	style="width: {cardWidth()}px; padding: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
>
	<!-- Pin Badge -->
	{#if tab.isPinned}
		<div class="absolute -right-1 -top-1 rounded-full bg-pastel-peach p-1.5">
			<Pin size={14} class="text-gray-700" />
		</div>
	{/if}

	<!-- Content -->
	{#if isEditing}
		<textarea
			bind:value={editContent}
			class="w-full resize-none rounded-lg border-2 border-pastel-lavender bg-white/80 p-2 text-sm focus:border-pastel-lilac focus:outline-none"
			rows="2"
			onkeydown={(e) => {
				if (e.key === 'Escape') handleCancel();
				if (e.key === 'Enter' && e.ctrlKey) handleSave();
			}}
		></textarea>
		<div class="mt-2 flex gap-2">
			<button
				onclick={handleSave}
				class="rounded-lg bg-pastel-mint px-3 py-1 text-xs font-semibold transition hover:bg-pastel-mint/80"
			>
				Save
			</button>
			<button
				onclick={handleCancel}
				class="rounded-lg bg-pastel-pink px-3 py-1 text-xs font-semibold transition hover:bg-pastel-pink/80"
			>
				Cancel
			</button>
		</div>
	{:else}
		<!-- Content with optional icon/logo -->
		<button
			onclick={() => (showDetailModal = true)}
			class="mb-2 flex items-start gap-2 w-full text-left hover:opacity-80 transition"
		>
			<!-- Image as Icon/Logo -->
			{#if tab.imageUrl}
				<div class="relative flex-shrink-0">
					<img
						src={tab.imageUrl}
						alt="Icon"
						class="h-10 w-10 rounded-lg object-cover shadow-sm"
					/>
					<button
						onclick={(e) => {
							e.stopPropagation();
							handleRemoveImage();
						}}
						class="absolute -right-1 -top-1 rounded-full bg-white/90 p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white"
						title="Remove image"
					>
						<X size={10} class="text-gray-700" />
					</button>
				</div>
			{/if}

			<div class="flex-1">
				<p class="text-sm text-gray-800 break-words {tab.isCompleted ? 'line-through' : ''}">
					{tab.content}
				</p>
				{#if tab.notes}
					<p class="text-xs text-gray-500 mt-1 line-clamp-1">{tab.notes}</p>
				{/if}
			</div>
		</button>

		<!-- Image Input (only show when no image) -->
		{#if !tab.imageUrl}
			<div class="mb-2 opacity-0 transition-opacity group-hover:opacity-100">
				<input
					type="text"
					bind:value={imageInput}
					placeholder="Image URL..."
					class="w-full rounded border border-pastel-lavender bg-white/60 px-2 py-1 text-xs focus:border-pastel-lilac focus:outline-none"
					onkeydown={(e) => {
						if (e.key === 'Enter') handleAddImage();
					}}
				/>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
			<button
				onclick={handleToggleComplete}
				class="flex items-center justify-center rounded-md bg-green-400 p-1.5 transition hover:bg-green-500 hover:scale-110 shadow-sm"
				title={tab.isCompleted ? 'Mark incomplete' : 'Mark complete'}
			>
				{#if tab.isCompleted}
					<Undo2 size={14} class="text-white" />
				{:else}
					<Check size={14} class="text-white" />
				{/if}
			</button>
			<div class="relative">
				<button
					onclick={(e) => {
						e.stopPropagation();
						toggleProjectMenu();
					}}
					class="flex items-center justify-center rounded-md bg-orange-400 p-1.5 transition hover:bg-orange-500 hover:scale-110 shadow-sm"
					title="Add to project"
				>
					<MapPin size={14} class="text-white" />
				</button>
				{#if showProjectMenu}
					<div class="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[9999] min-w-[180px]">
						{#if allProjects.length > 0}
							<div class="px-2 py-1 text-xs font-semibold text-gray-500 border-b border-gray-200">Add to project:</div>
							{#each allProjects as project}
								<button
									onclick={(e) => {
										e.stopPropagation();
										addToProject(project.id);
									}}
									class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
								>
									<div class="w-4 h-4 rounded-full" style="background-color: {project.color};"></div>
									{project.name}
								</button>
							{/each}
						{:else}
							<div class="px-3 py-2 text-xs text-gray-500">No projects yet</div>
						{/if}
					</div>
				{/if}
			</div>
			<button
				onclick={handleEdit}
				class="flex items-center justify-center rounded-md bg-blue-400 p-1.5 transition hover:bg-blue-500 hover:scale-110 shadow-sm"
				title="Edit"
			>
				<Edit3 size={14} class="text-white" />
			</button>
			<button
				onclick={() => tabsStore.delete(tab.id)}
				class="flex items-center justify-center rounded-md bg-red-400 p-1.5 transition hover:bg-red-500 hover:scale-110 shadow-sm"
				title="Delete"
			>
				<Trash2 size={14} class="text-white" />
			</button>
		</div>
	{/if}
</div>

<!-- Task Detail Modal -->
<TaskDetailModal {tab} bind:isOpen={showDetailModal} onClose={() => (showDetailModal = false)} />

<style>
	.tab-card {
		animation: fadeIn 0.3s ease-out;
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
