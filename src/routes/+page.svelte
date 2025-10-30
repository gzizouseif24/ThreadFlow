<script lang="ts">
	import { onMount } from 'svelte';
	import { runMigration } from '$lib/utils/migration';
	import CanvasBoard from '$lib/components/CanvasBoard.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { Search, X } from 'lucide-svelte';

	import TaskDetailModal from '$lib/components/TaskDetailModal.svelte';
	import type { Tab } from '$lib/types/tab';

	let searchQuery = $state('');
	let showSearch = $state(false);
	let selectedTask = $state<Tab | null>(null);
	let showTaskModal = $state(false);

	const searchResults = $derived(() => {
		if (!searchQuery.trim()) return { tasks: [], projects: [] };

		const query = searchQuery.toLowerCase();
		const tasks = tabsStore.activeTabs.filter((t) => t.content.toLowerCase().includes(query));
		const projects = projectsStore.projects.filter((p) => p.name.toLowerCase().includes(query));

		return { tasks, projects };
	});

	function openTaskDetail(task: Tab) {
		selectedTask = task;
		showTaskModal = true;
		searchQuery = '';
		showSearch = false;
	}

	function focusOnProject(projectId: string) {
		// Find the project element and scroll to it
		const projectElement = document.querySelector(`[data-project-id="${projectId}"]`);
		if (projectElement) {
			projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
		searchQuery = '';
		showSearch = false;
	}

	onMount(() => {
		// Run data migration on app load
		runMigration();
	});
</script>

<!-- Search Bar -->
{#if showSearch}
	<div class="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-6">
		<div class="relative">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search tasks and projects..."
				class="w-full px-4 py-3 pr-10 rounded-xl backdrop-blur-md bg-white/80 border border-white/40 focus:outline-none focus:border-pastel-lavender shadow-xl"
				autofocus
			/>
			<button
				onclick={() => {
					showSearch = false;
					searchQuery = '';
				}}
				class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/40 rounded-full transition"
			>
				<X size={18} class="text-gray-600" />
			</button>

			<!-- Search Results Dropdown -->
			{#if searchQuery.trim() && (searchResults().tasks.length > 0 || searchResults().projects.length > 0)}
				<div
					class="absolute top-full mt-2 w-full backdrop-blur-md bg-white/95 rounded-xl border border-white/40 shadow-xl max-h-96 overflow-y-auto"
				>
					{#if searchResults().projects.length > 0}
						<div class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-white/30">
							Projects ({searchResults().projects.length})
						</div>
						{#each searchResults().projects as project}
							<button
								onclick={() => focusOnProject(project.id)}
								class="w-full px-4 py-3 text-left hover:bg-white/60 transition border-b border-white/20 flex items-center gap-3"
							>
								<div
									class="w-4 h-4 rounded-full flex-shrink-0"
									style="background-color: {project.color};"
								></div>
								<span class="text-sm font-medium text-gray-800">{project.name}</span>
							</button>
						{/each}
					{/if}

					{#if searchResults().tasks.length > 0}
						<div class="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-white/30">
							Tasks ({searchResults().tasks.length})
						</div>
						{#each searchResults().tasks as task}
							<button
								onclick={() => openTaskDetail(task)}
								class="w-full px-4 py-3 text-left hover:bg-white/60 transition border-b border-white/20 last:border-b-0"
							>
								<div class="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{task.content}</div>
								{#if task.notes}
									<div class="text-xs text-gray-500 line-clamp-1">{task.notes}</div>
								{/if}
								<div class="flex items-center gap-2 mt-1">
									{#if task.isCompleted}
										<span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Completed</span>
									{/if}
									{#if task.isPinned}
										<span class="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Pinned</span>
									{/if}
									{#if task.tags && task.tags.length > 0}
										<span class="text-xs text-gray-400">+{task.tags.length} tags</span>
									{/if}
								</div>
							</button>
						{/each}
					{/if}
				</div>
			{:else if searchQuery.trim()}
				<div
					class="absolute top-full mt-2 w-full backdrop-blur-md bg-white/95 rounded-xl border border-white/40 shadow-xl p-4 text-center text-sm text-gray-500"
				>
					No tasks or projects found
				</div>
			{/if}
		</div>
	</div>
{:else}
	<button
		onclick={() => (showSearch = true)}
		class="fixed top-20 right-6 z-40 px-4 py-2 rounded-full backdrop-blur-md bg-white/70 hover:bg-white/80 border border-white/40 transition flex items-center gap-2 shadow-lg"
	>
		<Search size={16} class="text-gray-700" />
		<span class="text-sm font-medium text-gray-700">Search</span>
	</button>
{/if}

<!-- Canvas Area -->
<main class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden p-6 pt-24 pb-6">
	<div
		class="h-full rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/10"
	>
		<CanvasBoard />
	</div>
</main>

<!-- Task Detail Modal -->
{#if selectedTask}
	<TaskDetailModal task={selectedTask} bind:isOpen={showTaskModal} onClose={() => (showTaskModal = false)} />
{/if}

