<script lang="ts">
	import type { Project, Tab } from '$lib/types/tab';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import { Trash2, Palette, Pin, MapPin, Edit3, Check, Undo2, Image, Upload, Link, ChevronUp, ChevronDown } from 'lucide-svelte';
	import confetti from 'canvas-confetti';
	import { onMount } from 'svelte';
	// Removed svelte-dnd-action imports - using arrow buttons instead
	import { fileToBase64, cacheRemoteImage, isValidImageFile, compressImage } from '$lib/utils/imageHandler';

let {
		project,
		tasks,
		autoEdit = false,
		parentDisableDrag = () => {},
		parentEnableDrag = () => {}
	}: {
		project: Project;
		tasks: Tab[];
		autoEdit?: boolean;
		parentDisableDrag?: () => void;
		parentEnableDrag?: () => void;
	} = $props();

	let cardElement: HTMLDivElement;

	let isEditing = $state(false);
	let editName = $state(project.name);
	let showColorPicker = $state(false);
	let newTaskContent = $state('');
	let showTaskInput = $state(false);
	let editingTaskId = $state<string | null>(null);
	let editTaskContent = $state('');
	let editingImageTaskId = $state<string | null>(null);
	let editImageUrl = $state('');
	let editingProjectImage = $state(false);
	let editProjectImageUrl = $state('');
	let showMoveMenu = $state<string | null>(null);
	let isResizing = $state(false);
	let resizeStartX = $state(0);
	let resizeStartY = $state(0);
	let resizeStartWidth = $state(0);
	let resizeStartHeight = $state(0);
	
	// svelte-dnd-action setup
	// Deduplicate tasks based on ID to prevent duplicate key errors
	function deduplicateTasks(taskList: Tab[]): Tab[] {
		const seen = new Set<string>();
		return taskList.filter(task => {
			if (seen.has(task.id)) {
				console.warn(`Duplicate task ID found: ${task.id}`);
				return false;
			}
			seen.add(task.id);
			return true;
		});
	}
	
	let localTasksOrder = $state(deduplicateTasks(tasks).map(t => ({ ...t })));
	
	// Sync local order with tasks prop
	$effect(() => {
		localTasksOrder = deduplicateTasks(tasks).map(t => ({ ...t }));
	});
	
	// Move task up in the list
	function moveTaskUp(taskId: string) {
		const index = localTasksOrder.findIndex(t => t.id === taskId);
		if (index > 0) {
			const newOrder = [...localTasksOrder];
			[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
			localTasksOrder = newOrder;
			tabsStore.reorderInProject(project.id, newOrder);
		}
	}
	
	// Move task down in the list
	function moveTaskDown(taskId: string) {
		const index = localTasksOrder.findIndex(t => t.id === taskId);
		if (index < localTasksOrder.length - 1) {
			const newOrder = [...localTasksOrder];
			[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
			localTasksOrder = newOrder;
			tabsStore.reorderInProject(project.id, newOrder);
		}
	}

	function handleNameEdit() {
		isEditing = true;
		editName = project.name;
	}

	function saveName() {
		if (editName.trim()) {
			projectsStore.update(project.id, editName.trim());
		}
		isEditing = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			saveName();
		} else if (e.key === 'Escape') {
			isEditing = false;
		}
	}

	// Auto-trigger edit mode for new projects
	$effect(() => {
		if (autoEdit && !isEditing) {
			handleNameEdit();
		}
	});

	function handleDelete() {
		if (confirm(`Delete project "${project.name}"? Tasks will become standalone.`)) {
			// Move all tasks to root
			tasks.forEach((task) => {
				tabsStore.moveToProject(task.id, null);
			});
			projectsStore.delete(project.id);
		}
	}

	function startEditingTask(taskId: string, currentContent: string) {
		editingTaskId = taskId;
		editTaskContent = currentContent;
	}

	function saveTaskEdit() {
		if (editingTaskId && editTaskContent.trim()) {
			tabsStore.update(editingTaskId, editTaskContent.trim());
		}
		editingTaskId = null;
		editTaskContent = '';
	}

	function cancelTaskEdit() {
		editingTaskId = null;
		editTaskContent = '';
	}

	function handleTaskEditKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			saveTaskEdit();
		} else if (e.key === 'Escape') {
			cancelTaskEdit();
		}
	}

	function handleTaskToggleComplete(taskId: string, isCompleted: boolean) {
		tabsStore.toggleComplete(taskId);
		if (!isCompleted) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ['#FFD6E8', '#E5D4FF', '#D4FFE7', '#FFE5CC', '#D4E5FF']
			});
		}
	}

	function handleTaskDelete(taskId: string) {
		tabsStore.delete(taskId);
	}

	function handleRemoveFromProject(taskId: string) {
		// Unpin task when removing from project
		const task = tabsStore.tabs.find(t => t.id === taskId);
		if (task?.isPinned) {
			tabsStore.togglePin(taskId);
		}
		tabsStore.moveToProject(taskId, null);
	}

	function toggleMoveMenu(taskId: string) {
		showMoveMenu = showMoveMenu === taskId ? null : taskId;
	}

	function moveTaskToProject(taskId: string, targetProjectId: string) {
		tabsStore.moveToProject(taskId, targetProjectId);
		showMoveMenu = null;
	}

	const allProjects = $derived(projectsStore.projects);
	const otherProjects = $derived(allProjects.filter(p => p.id !== project.id));

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.move-menu-container')) {
			showMoveMenu = null;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function startEditingImage(taskId: string, currentImageUrl: string) {
		editingImageTaskId = taskId;
		editImageUrl = currentImageUrl || '';
	}

	async function saveImageEdit() {
		if (editingImageTaskId) {
			const url = editImageUrl.trim();
			if (url) {
				// Cache remote images as base64
				const cachedUrl = await cacheRemoteImage(url);
				tabsStore.updateImage(editingImageTaskId, cachedUrl);
			}
		}
		editingImageTaskId = null;
		editImageUrl = '';
	}

	async function handleTaskImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file && isValidImageFile(file) && editingImageTaskId) {
			let base64 = await fileToBase64(file);
			base64 = await compressImage(base64, 300); // Compress to max 300KB for tasks
			tabsStore.updateImage(editingImageTaskId, base64);
			editingImageTaskId = null;
			editImageUrl = '';
		} else if (file) {
			alert('Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)');
		}
		input.value = ''; // Reset input
	}

	function cancelImageEdit() {
		editingImageTaskId = null;
		editImageUrl = '';
	}

	function handleImageEditKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			saveImageEdit();
		} else if (e.key === 'Escape') {
			cancelImageEdit();
		}
	}

	function startEditingProjectImage() {
		editingProjectImage = true;
		editProjectImageUrl = project.imageUrl || '';
	}

	async function saveProjectImage() {
		const url = editProjectImageUrl.trim();
		if (url) {
			// Cache remote images as base64
			const cachedUrl = await cacheRemoteImage(url);
			projectsStore.updateImage(project.id, cachedUrl);
		}
		editingProjectImage = false;
		editProjectImageUrl = '';
	}

	async function handleProjectImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file && isValidImageFile(file)) {
			let base64 = await fileToBase64(file);
			base64 = await compressImage(base64, 500); // Compress to max 500KB
			projectsStore.updateImage(project.id, base64);
			editingProjectImage = false;
		} else if (file) {
			alert('Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)');
		}
		input.value = ''; // Reset input
	}

	function cancelProjectImageEdit() {
		editingProjectImage = false;
		editProjectImageUrl = '';
	}

	function handleProjectImageKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			saveProjectImage();
		} else if (e.key === 'Escape') {
			cancelProjectImageEdit();
		}
	}


	function handleAddTask() {
		if (newTaskContent.trim()) {
			tabsStore.add(newTaskContent.trim(), undefined, project.id);
			newTaskContent = '';
			showTaskInput = false;
		}
	}

	function handleTaskInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleAddTask();
		} else if (e.key === 'Escape') {
			showTaskInput = false;
			newTaskContent = '';
		}
	}

	function handleResizeStart(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		isResizing = true;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		resizeStartWidth = project.width || 400;
		resizeStartHeight = project.height || 300;
		
		// Add user-select: none to prevent text selection during resize
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'nwse-resize';
	}

	onMount(() => {
		let rafId: number | null = null;
		let currentMouseX = 0;
		let currentMouseY = 0;

		const handleResizeMove = (e: MouseEvent) => {
			if (!isResizing) return;
			
			currentMouseX = e.clientX;
			currentMouseY = e.clientY;
			
			// Cancel any pending animation frame
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
			
			// Schedule update on next frame
			rafId = requestAnimationFrame(() => {
				const deltaX = currentMouseX - resizeStartX;
				const deltaY = currentMouseY - resizeStartY;
				
				const newWidth = Math.max(300, Math.min(800, resizeStartWidth + deltaX));
				const newHeight = Math.max(250, Math.min(800, resizeStartHeight + deltaY));
				
				projectsStore.updateSize(project.id, Math.round(newWidth), Math.round(newHeight));
				rafId = null;
			});
		};

		const handleResizeEnd = () => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			isResizing = false;
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
		};

		window.addEventListener('mousemove', handleResizeMove);
		window.addEventListener('mouseup', handleResizeEnd);

		return () => {
			window.removeEventListener('mousemove', handleResizeMove);
			window.removeEventListener('mouseup', handleResizeEnd);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
			}
		};
	});
</script>

<div
	bind:this={cardElement}
	class="project-card group relative rounded-xl border-0 backdrop-blur-sm shadow-md hover:shadow-lg overflow-hidden flex flex-col {isResizing ? '' : 'transition-all duration-300 hover:scale-[1.01]'}"
	style="background-color: {project.color}30; width: {project.width}px; height: {project.height}px;"
>
	<!-- Project Header -->
	<div class="mb-3 px-4 pt-4 flex-shrink-0">
		{#if isEditing}
			<input
				type="text"
				bind:value={editName}
				onkeydown={handleKeydown}
				onblur={saveName}
				class="w-full px-3 py-1.5 text-lg font-bold bg-white/80 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
				autofocus
			/>
		{:else if editingProjectImage}
			<!-- Project Image Edit Mode -->
			<div class="space-y-2">
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={editProjectImageUrl}
						onkeydown={handleProjectImageKeydown}
						placeholder="Image URL..."
						class="flex-1 px-3 py-1.5 text-sm border-2 border-pastel-lavender rounded-lg focus:outline-none focus:border-pastel-lilac bg-white/80"
					/>
					<label class="px-3 py-1.5 text-sm rounded-lg bg-pastel-sky hover:bg-pastel-sky/80 font-semibold cursor-pointer flex items-center gap-1">
						<Upload size={14} />
						<input
							type="file"
							accept="image/*"
							onchange={handleProjectImageUpload}
							class="hidden"
						/>
					</label>
				</div>
				<div class="flex gap-2">
					<button
						onclick={saveProjectImage}
						class="px-3 py-1.5 text-sm rounded-lg bg-pastel-mint hover:bg-pastel-mint/80 font-semibold flex items-center gap-1"
					>
						<Link size={14} />
						Save URL
					</button>
					<button
						onclick={cancelProjectImageEdit}
						class="px-3 py-1.5 text-sm rounded-lg bg-pastel-pink hover:bg-pastel-pink/80 font-semibold"
					>
						Cancel
					</button>
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2 flex-1">
					<button
						onclick={startEditingProjectImage}
						class="flex-shrink-0"
						title="Click to edit project icon"
					>
						{#if project.imageUrl}
							<img src={project.imageUrl} alt="Project icon" class="w-12 h-12 rounded-lg object-cover shadow-sm hover:opacity-80 transition" />
						{:else}
							<div class="w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center hover:opacity-80 transition">
								<Image size={24} class="text-gray-500" />
							</div>
						{/if}
					</button>
					<button
						onclick={handleNameEdit}
						class="flex-1 text-left hover:bg-white/30 rounded-lg px-2 py-1 transition"
						title="Click to edit project name"
					>
						<h3 class="text-lg font-bold text-gray-800">{project.name}</h3>
						{#if project.objective}
							<p class="text-xs text-gray-600 line-clamp-1">{project.objective}</p>
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Tasks Container with svelte-dnd-action -->
	<div class="space-y-2 min-h-[120px] overflow-y-auto pr-1 px-4 flex-1">
		{#if localTasksOrder.length === 0 && !showTaskInput}
			<div class="flex items-center justify-center py-10 text-center">
				<p class="text-gray-400 text-sm">No tasks yet</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each localTasksOrder as task, index (task.id)}
					<div class="task-item bg-white/60 rounded-lg p-2 text-sm group/task hover:bg-white/80 transition-all">
						{#if editingTaskId === task.id}
							<!-- Edit Mode -->
							<input
								type="text"
								bind:value={editTaskContent}
								onkeydown={handleTaskEditKeydown}
								onblur={saveTaskEdit}
								class="w-full px-2 py-1 text-sm border border-pastel-lavender rounded focus:outline-none focus:border-pastel-lilac"
								autofocus
							/>
						{:else if editingImageTaskId === task.id}
							<!-- Image Edit Mode -->
							<div class="space-y-1">
								<div class="flex gap-1">
									<input
										type="text"
										bind:value={editImageUrl}
										onkeydown={handleImageEditKeydown}
										placeholder="Image URL..."
										class="flex-1 px-2 py-1 text-xs border border-pastel-lavender rounded focus:outline-none focus:border-pastel-lilac"
									/>
									<label class="px-2 py-1 text-xs rounded bg-pastel-sky hover:bg-pastel-sky/80 cursor-pointer flex items-center">
										<Upload size={10} />
										<input
											type="file"
											accept="image/*"
											onchange={handleTaskImageUpload}
											class="hidden"
										/>
									</label>
								</div>
								<div class="flex gap-1">
									<button onclick={saveImageEdit} class="px-2 py-1 text-xs rounded bg-pastel-mint hover:bg-pastel-mint/80 flex items-center gap-1">
										<Link size={10} />URL
									</button>
									<button onclick={cancelImageEdit} class="px-2 py-1 text-xs rounded bg-pastel-pink hover:bg-pastel-pink/80">Cancel</button>
								</div>
							</div>
						{:else}
							<!-- Display Mode -->
							<div class="flex items-start gap-2">
								<!-- Arrow buttons for reordering -->
								<div class="flex flex-col flex-shrink-0 opacity-0 group-hover/task:opacity-100 transition-opacity">
									<button 
										onclick={() => moveTaskUp(task.id)} 
										disabled={index === 0}
										class="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
										title="Move up"
									>
										<ChevronUp size={14} class="text-gray-600" />
									</button>
									<button 
										onclick={() => moveTaskDown(task.id)} 
										disabled={index === localTasksOrder.length - 1}
										class="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
										title="Move down"
									>
										<ChevronDown size={14} class="text-gray-600" />
									</button>
								</div>
								{#if task.imageUrl}
									<button onclick={() => startEditingImage(task.id, task.imageUrl || '')} class="flex-shrink-0 hover:opacity-70 transition-opacity">
										<img src={task.imageUrl} alt="Icon" class="w-6 h-6 rounded object-cover" />
									</button>
								{/if}
								<p class="flex-1 text-gray-800 {task.isCompleted ? 'line-through opacity-60' : ''}">{task.content}</p>
							</div>

							<!-- Mini Actions -->
							<div class="flex gap-1 mt-1.5 opacity-0 group-hover/task:opacity-100 transition-opacity">
								<button onclick={() => handleTaskToggleComplete(task.id, task.isCompleted)} class="p-1 rounded bg-pastel-mint hover:bg-pastel-mint/80">
									{#if task.isCompleted}<Undo2 size={12} class="text-gray-700" />{:else}<Check size={12} class="text-gray-700" />{/if}
								</button>
								<button onclick={() => startEditingTask(task.id, task.content)} class="p-1 rounded bg-pastel-sky hover:bg-pastel-sky/80"><Edit3 size={12} class="text-gray-700" /></button>
								{#if !task.imageUrl}<button onclick={() => startEditingImage(task.id, '')} class="p-1 rounded bg-pastel-peach hover:bg-pastel-peach/80"><Image size={12} class="text-gray-700" /></button>{/if}
								<div class="relative move-menu-container">
									<button onclick={(e) => { e.stopPropagation(); toggleMoveMenu(task.id); }} class="p-1 rounded bg-pastel-lavender hover:bg-pastel-lavender/80"><MapPin size={12} class="text-gray-700" /></button>
									{#if showMoveMenu === task.id}
										<div class="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[150px]">
											{#if otherProjects.length > 0}
												<div class="px-2 py-1 text-xs font-semibold text-gray-500 border-b border-gray-200">Move to:</div>
												{#each otherProjects as otherProject}
													<button onclick={(e) => { e.stopPropagation(); moveTaskToProject(task.id, otherProject.id); }} class="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 flex items-center gap-2">
														<div class="w-3 h-3 rounded-full" style="background-color: {otherProject.color};"></div>{otherProject.name}
													</button>
												{/each}
											{:else}<div class="px-3 py-2 text-xs text-gray-500">No other projects</div>{/if}
											<button onclick={(e) => { e.stopPropagation(); handleRemoveFromProject(task.id); showMoveMenu = null; }} class="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-100 text-gray-600 border-t border-gray-200">Remove from project</button>
										</div>
									{/if}
								</div>
								<button onclick={() => handleTaskDelete(task.id)} class="p-1 rounded bg-pastel-pink hover:bg-pastel-pink/80"><Trash2 size={12} class="text-gray-700" /></button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Add Task Input -->
		{#if showTaskInput}
			<div class="bg-white/80 rounded-lg p-2">
				<input
					type="text"
					bind:value={newTaskContent}
					onkeydown={handleTaskInputKeydown}
					placeholder="New task..."
					class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-pastel-lilac"
					autofocus
				/>
			</div>
		{/if}

		<!-- Add Task Button -->
		{#if !showTaskInput}
			<button
				type="button"
				onclick={() => (showTaskInput = true)}
				class="w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-white/40 rounded-lg transition-all border border-dashed border-gray-300 hover:border-gray-400"
			>
				+ Add Task
			</button>
		{/if}
	</div>

	<!-- Action Buttons (show on hover) - Fixed at bottom -->
	<div class="flex gap-1.5 mt-3 pt-3 px-4 pb-4 border-t border-white/30 opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0">
		<div class="relative flex-1">
			<button
				type="button"
				onclick={() => (showColorPicker = !showColorPicker)}
				class="w-full flex items-center justify-center gap-1 rounded-md bg-white/60 p-1.5 transition hover:bg-white/80"
				title="Change color"
			>
				<Palette class="w-4 h-4 text-gray-700" />
			</button>

			{#if showColorPicker}
				<div
					class="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
				>
					<ColorPicker
						bind:selectedColor={project.color}
						onSelect={(color) => {
							projectsStore.updateColor(project.id, color);
							showColorPicker = false;
						}}
					/>
				</div>
			{/if}
		</div>

		<button
			type="button"
			onclick={handleDelete}
			class="flex-1 flex items-center justify-center gap-1 rounded-md bg-pastel-pink p-1.5 transition hover:bg-pastel-pink/80"
			title="Delete project"
		>
			<Trash2 class="w-4 h-4 text-gray-700" />
		</button>
	</div>

	<!-- Resize Handle -->
	<div
		class="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
		onmousedown={handleResizeStart}
		role="button"
		tabindex="-1"
	>
		<svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<path d="M21 15l-6 6M21 9l-12 12M21 3l-18 18" />
		</svg>
	</div>
</div>

<style>
	.project-card {
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

	/* Minimalist scrollbar - only visible on hover */
	.project-card ::-webkit-scrollbar {
		width: 4px;
	}

	.project-card ::-webkit-scrollbar-track {
		background: transparent;
	}

	.project-card ::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.15);
		border-radius: 2px;
	}

	.project-card:hover ::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.25);
	}

	.project-card ::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.35);
	}

	/* Clean task item styling */
	div.task-item {
		position: relative;
	}
</style>
