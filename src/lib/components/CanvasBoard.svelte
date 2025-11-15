<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { onMount } from 'svelte';
	import TabCard from './TabCard.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import type { Tab, Project } from '$lib/types/tab';
	import { Network, Plus, FolderKanban, CheckSquare } from 'lucide-svelte';

	let canvasRef: HTMLDivElement;
	let disabledProjectIds = $state<Set<string>>(new Set());
	let activeProjectId = $state<string | null>(null);
	let showAddMenu = $state(false);

	const projects = $derived(projectsStore.projects);
	const rootTasks = $derived(tabsStore.rootTasks);

	// Calculate project links for SVG rendering
	const projectLinks = $derived.by(() => {
		const links: Array<{
			id: string;
			from: { x: number; y: number };
			to: { x: number; y: number };
			color: string;
		}> = [];

		const processed = new Set<string>();

		projects.forEach((project) => {
			if (project.linkedProjectIds && project.linkedProjectIds.length > 0) {
				project.linkedProjectIds.forEach((linkedId) => {
					// Create unique pair ID to avoid duplicates
					const pairId = [project.id, linkedId].sort().join('-');

					if (!processed.has(pairId)) {
						processed.add(pairId);

						const linkedProject = projects.find(p => p.id === linkedId);
						if (linkedProject) {
							// Calculate center points of both projects
							const fromX = project.position.x + (project.width || 350) / 2;
							const fromY = project.position.y + (project.height || 400) / 2;
							const toX = linkedProject.position.x + (linkedProject.width || 350) / 2;
							const toY = linkedProject.position.y + (linkedProject.height || 400) / 2;

							links.push({
								id: pairId,
								from: { x: fromX, y: fromY },
								to: { x: toX, y: toY },
								color: project.color
							});
						}
					}
				});
			}
		});

		return links;
	});

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

<div class="canvas-board relative h-full w-full overflow-hidden" bind:this={canvasRef}>
	<!-- SVG Layer for Project Links -->
	{#if projectLinks.length > 0}
		<svg class="absolute inset-0 pointer-events-none z-[5]" style="width: 100%; height: 100%;">
			{#each projectLinks as link (link.id)}
				<line
					x1={link.from.x}
					y1={link.from.y}
					x2={link.to.x}
					y2={link.to.y}
					stroke={link.color}
					stroke-width="2"
					stroke-dasharray="8,4"
					opacity="0.4"
					class="transition-all duration-300"
				/>
			{/each}
		</svg>
	{/if}

	<!-- Project Cards - Draggable like Task Cards -->
	{#each projects as project (project.id)}
		<div
			use:draggable={{
				position: project.position || { x: 0, y: 0 },
				bounds: 'parent',
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
				bounds: 'parent',
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
