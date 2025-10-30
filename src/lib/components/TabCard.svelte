<script lang="ts">
	import type { Tab } from '$lib/types/tab';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import confetti from 'canvas-confetti';
	import { Check, Undo2, Pin, MapPin, Edit3, Trash2, Image as ImageIcon, X, FolderPlus } from 'lucide-svelte';

	interface Props {
		tab: Tab;
	}

	let { tab }: Props = $props();
	let isEditing = $state(false);
	let editContent = $state(tab.content);
	let imageInput = $state('');

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
	class="tab-card group relative rounded-xl border-0 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] {tab.isCompleted
		? 'bg-white/40 opacity-70'
		: 'bg-white/60 shadow-md hover:shadow-lg'}"
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
		<div class="mb-2 flex items-start gap-2">
			<!-- Image as Icon/Logo -->
			{#if tab.imageUrl}
				<div class="relative flex-shrink-0">
					<img
						src={tab.imageUrl}
						alt="Icon"
						class="h-10 w-10 rounded-lg object-cover shadow-sm"
					/>
					<button
						onclick={handleRemoveImage}
						class="absolute -right-1 -top-1 rounded-full bg-white/90 p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white"
						title="Remove image"
					>
						<X size={10} class="text-gray-700" />
					</button>
				</div>
			{/if}

			<p class="flex-1 text-sm text-gray-800 {tab.isCompleted ? 'line-through' : ''}">
				{tab.content}
			</p>
		</div>

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
				class="flex items-center justify-center rounded-md bg-pastel-mint p-1.5 transition hover:bg-pastel-mint/80"
				title={tab.isCompleted ? 'Mark incomplete' : 'Mark complete'}
			>
				{#if tab.isCompleted}
					<Undo2 size={14} class="text-gray-700" />
				{:else}
					<Check size={14} class="text-gray-700" />
				{/if}
			</button>
			<div class="relative">
				<button
					onclick={(e) => {
						e.stopPropagation();
						toggleProjectMenu();
					}}
					class="flex items-center justify-center rounded-md bg-pastel-peach p-1.5 transition hover:bg-pastel-peach/80"
					title="Add to project"
				>
					<MapPin size={14} class="text-gray-700" />
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
				class="flex items-center justify-center rounded-md bg-pastel-sky p-1.5 transition hover:bg-pastel-sky/80"
				title="Edit"
			>
				<Edit3 size={14} class="text-gray-700" />
			</button>
			<button
				onclick={() => tabsStore.delete(tab.id)}
				class="flex items-center justify-center rounded-md bg-pastel-pink p-1.5 transition hover:bg-pastel-pink/80"
				title="Delete"
			>
				<Trash2 size={14} class="text-gray-700" />
			</button>
		</div>
	{/if}
</div>

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
