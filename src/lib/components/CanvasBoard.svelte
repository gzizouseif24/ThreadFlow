<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import TabCard from './TabCard.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import type { Tab, Project } from '$lib/types/tab';
	import { Network, Plus } from 'lucide-svelte';

	let canvasRef: HTMLDivElement;

	const projects = $derived(projectsStore.projects);
	const rootTasks = $derived(tabsStore.rootTasks);

	function handleRootTaskDragEnd(tab: Tab, data: { offsetX: number; offsetY: number }) {
		tabsStore.updatePosition(tab.id, {
			x: data.offsetX,
			y: data.offsetY
		});
	}

	function handleProjectDragEnd(project: Project, data: { offsetX: number; offsetY: number }) {
		projectsStore.updatePosition(project.id, {
			x: data.offsetX,
			y: data.offsetY
		});
	}



	function handleAddProject() {
		const colors = ['#FF69B4', '#B57EDC', '#00E5A0', '#FFB347', '#4FC3F7', '#DA70D6'];
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		projectsStore.add('New Project', randomColor);
	}
</script>

<div class="canvas-board relative h-full w-full overflow-hidden" bind:this={canvasRef}>
	<!-- Textured Background -->
	<div class="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-pastel-sky/30 to-pastel-lavender/40"></div>
	
	<!-- Dot Pattern Texture -->
	<div class="absolute inset-0 pointer-events-none opacity-30" style="background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
	
	<!-- Subtle Shadow Overlay -->
	<div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/5"></div>
	<!-- Project Cards - Draggable like Task Cards -->
	{#each projects as project (project.id)}
		<div
			use:draggable={{
				position: project.position || { x: 0, y: 0 },
				bounds: 'parent',
				onDragEnd: (data) => handleProjectDragEnd(project, data)
			}}
			class="absolute cursor-move z-0"
		>
			<ProjectCard 
				{project} 
				tasks={tabsStore.getTasksByProject(project.id)}
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

	<!-- Floating Add Project Button -->
	<button
		type="button"
		onclick={handleAddProject}
		class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-pastel-lavender to-pastel-pink hover:from-pastel-lilac hover:to-pastel-peach shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
		title="Add Project"
	>
		<Plus size={28} class="text-gray-800" />
	</button>

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
</style>
