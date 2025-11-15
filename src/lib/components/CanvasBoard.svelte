<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { onMount } from 'svelte';
	import TabCard from './TabCard.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import type { Tab, Project } from '$lib/types/tab';
	import { Network, Plus, FolderKanban, CheckSquare, ZoomIn, ZoomOut, Maximize2 } from 'lucide-svelte';

	let canvasRef: HTMLDivElement;
	let disabledProjectIds = $state<Set<string>>(new Set());
	let activeProjectId = $state<string | null>(null);
	let showAddMenu = $state(false);
	let zoomLevel = $state(1); // Default zoom level (1 = 100%)

	const projects = $derived(projectsStore.projects);
	const rootTasks = $derived(tabsStore.rootTasks);

	function handleRootTaskDragEnd(tab: Tab, data: { offsetX: number; offsetY: number }) {
		tabsStore.updatePosition(tab.id, {
			x: data.offsetX,
			y: data.offsetY
		});
	}

	function handleProjectDragEnd(project: Project, data: { offsetX: number; offsetY: number }) {
		if (disabledProjectIds.has(project.id)) return; // Ignore drag if disabled
		projectsStore.updatePosition(project.id, {
			x: data.offsetX,
			y: data.offsetY
		});
	}

	function createDisableProjectDrag(projectId: string) {
		return () => {
			disabledProjectIds = new Set([...disabledProjectIds, projectId]);
		};
	}

	function createEnableProjectDrag(projectId: string) {
		return () => {
			const newSet = new Set(disabledProjectIds);
			newSet.delete(projectId);
			disabledProjectIds = newSet;
		};
	}

	function handleProjectToggle(projectId: string) {
		const project = projects.find(p => p.id === projectId);
		// Set as active project when expanding
		if (project && !project.isExpanded) {
			activeProjectId = projectId;
		}
		projectsStore.toggleExpanded(projectId);
	}

	let newProjectId = $state<string | null>(null);

	function handleAddProject() {
		// Expanded color palette with softer, more appealing colors
		const colors = [
			'#FFB6C1', '#FF9999', '#FFB7C5', '#FFA07A', // Pinks & Reds
			'#E6E6FA', '#DDA0DD', '#CCCCFF', '#C8A2C8', // Purples
			'#B0E0E6', '#89CFF0', '#87CEEB', '#7FDBFF', // Blues
			'#98FB98', '#9DC183', '#93E9BE', '#C1FFC1', // Greens
			'#FFFACD', '#FFEB99', '#FFDAB9', '#FBCEB1'  // Yellows & Oranges
		];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		const projectId = crypto.randomUUID();

		// Create project with temp name
		projectsStore.add('New Project', randomColor, undefined, projectId);

		// Store the new project ID to trigger edit mode
		newProjectId = projectId;

		// Reset after a short delay to allow ProjectCard to pick it up
		setTimeout(() => {
			newProjectId = null;
		}, 100);

		// Close menu
		showAddMenu = false;
	}

	function handleAddTask() {
		// Create standalone task with placeholder content
		const position = {
			x: Math.random() * 400 + 100,
			y: Math.random() * 300 + 100
		};

		tabsStore.add('New Task', position, null);

		// Close menu
		showAddMenu = false;
	}

	function toggleAddMenu() {
		showAddMenu = !showAddMenu;
	}

	// Zoom functions
	const MIN_ZOOM = 0.25; // 25%
	const MAX_ZOOM = 2; // 200%
	const ZOOM_STEP = 0.1;

	function zoomIn() {
		zoomLevel = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
	}

	function zoomOut() {
		zoomLevel = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
	}

	function resetZoom() {
		zoomLevel = 1;
	}

	function handleWheel(e: WheelEvent) {
		// Only zoom if Ctrl/Cmd is pressed (standard browser zoom behavior)
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			const delta = -e.deltaY / 1000;
			zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + delta));
		}
	}

	// Close menu when clicking outside
	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('.add-menu-container')) {
				showAddMenu = false;
			}
		}

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="canvas-board relative h-full w-full overflow-hidden" bind:this={canvasRef} onwheel={handleWheel}>
	<!-- Zoomable Content Container -->
	<div
		class="canvas-content absolute transition-all duration-200"
		style="
			width: {100 / zoomLevel}%;
			height: {100 / zoomLevel}%;
			transform: scale({zoomLevel});
			transform-origin: top left;
		"
	>
		<!-- Project Cards - Draggable like Task Cards -->
	{#each projects as project (project.id)}
		<div
			use:draggable={{
				position: project.position || { x: 0, y: 0 },
				onDragEnd: (data) => handleProjectDragEnd(project, data),
				disabled: disabledProjectIds.has(project.id)
			}}
			class="absolute cursor-move {activeProjectId === project.id && project.isExpanded ? 'z-20' : 'z-0'}"
		>
			<ProjectCard
				{project}
				tasks={tabsStore.getTasksByProject(project.id)}
				autoEdit={project.id === newProjectId}
				parentDisableDrag={createDisableProjectDrag(project.id)}
				parentEnableDrag={createEnableProjectDrag(project.id)}
				onToggleExpand={() => handleProjectToggle(project.id)}
			/>
		</div>
	{/each}

	<!-- Root Task Cards (not in any project) -->
	{#each rootTasks as tab (tab.id)}
		<div
			use:draggable={{
				position: tab.position || { x: 0, y: 0 },
				onDragEnd: (data) => handleRootTaskDragEnd(tab, data)
			}}
			class="absolute cursor-move z-10"
		>
			<TabCard {tab} />
		</div>
	{/each}

		<!-- Empty State -->
		{#if rootTasks.length === 0 && projects.length === 0}
			<div class="flex h-full flex-col items-center justify-center text-center">
				<Network class="mb-2 text-pastel-lilac" size={48} />
				<p class="text-xl font-semibold text-gray-700">Canvas is empty</p>
				<p class="text-gray-500">Click the + button to create your first project!</p>
			</div>
		{/if}
	</div>
	<!-- End Zoomable Content Container -->

	<!-- Zoom Controls -->
	<div class="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
		<button
			type="button"
			onclick={zoomIn}
			class="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-md hover:bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-white/40"
			title="Zoom In (Ctrl + Scroll)"
			disabled={zoomLevel >= MAX_ZOOM}
		>
			<ZoomIn size={18} class="text-gray-700" />
		</button>
		<button
			type="button"
			onclick={resetZoom}
			class="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-md hover:bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-white/40 text-xs font-semibold text-gray-700"
			title="Reset Zoom (100%)"
		>
			{Math.round(zoomLevel * 100)}%
		</button>
		<button
			type="button"
			onclick={zoomOut}
			class="w-10 h-10 rounded-lg bg-white/80 backdrop-blur-md hover:bg-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center border border-white/40"
			title="Zoom Out (Ctrl + Scroll)"
			disabled={zoomLevel <= MIN_ZOOM}
		>
			<ZoomOut size={18} class="text-gray-700" />
		</button>
	</div>

	<!-- Floating Add Menu -->
	<div class="add-menu-container fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
		<!-- Add Menu Popup -->
		{#if showAddMenu}
			<div class="backdrop-blur-md bg-white/80 rounded-xl shadow-2xl border border-white/40 overflow-hidden animate-slideUp">
				<button
					type="button"
					onclick={handleAddProject}
					class="w-full px-6 py-3 flex items-center gap-3 bg-transparent hover:bg-pastel-lavender/30 transition-colors text-left"
				>
					<FolderKanban size={20} class="text-pastel-lilac" />
					<div>
						<div class="font-semibold text-gray-800">New Project</div>
						<div class="text-xs text-gray-500">Create a project container</div>
					</div>
				</button>
				<div class="border-t border-white/40"></div>
				<button
					type="button"
					onclick={handleAddTask}
					class="w-full px-6 py-3 flex items-center gap-3 bg-transparent hover:bg-pastel-mint/30 transition-colors text-left"
				>
					<CheckSquare size={20} class="text-pastel-mint" />
					<div>
						<div class="font-semibold text-gray-800">New Task</div>
						<div class="text-xs text-gray-500">Create a standalone task</div>
					</div>
				</button>
			</div>
		{/if}

		<!-- Add Button -->
		<button
			type="button"
			onclick={toggleAddMenu}
			class="w-14 h-14 rounded-full bg-gradient-to-r from-pastel-lavender to-pastel-pink hover:from-pastel-lilac hover:to-pastel-peach shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center {showAddMenu ? 'rotate-45' : ''}"
			title="Add Project or Task"
		>
			<Plus size={28} class="text-gray-800 transition-transform" />
		</button>
	</div>

</div>

<style>
	.canvas-board {
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-slideUp {
		animation: slideUp 0.2s ease-out;
	}

	@keyframes slideUp {
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
