<script lang="ts">
	import { journalStore } from '$lib/stores/journal.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { formatDate } from '$lib/utils/dateUtils';
	import { parseMarkdown } from '$lib/utils/markdown';
	import { ListTodo, FileText, Lightbulb, Eye, Edit, Circle, EyeOff } from 'lucide-svelte';

	let { selectedDate }: { selectedDate: Date } = $props();

	const dateString = $derived(formatDate(selectedDate));
	const entry = $derived(journalStore.getEntry(dateString));

	let showNotesPreview = $state(!!entry?.notes);
	let showReflectionPreview = $state(!!entry?.reflection);
	let showTodoList = $state(true);

	let notes = $state(entry?.notes || '');
	let reflection = $state(entry?.reflection || '');

	let notesTextarea: HTMLTextAreaElement;
	let reflectionTextarea: HTMLTextAreaElement;

	// Update local state when entry changes
	$effect(() => {
		notes = entry?.notes || '';
		reflection = entry?.reflection || '';
		// Set preview mode based on whether content exists
		showNotesPreview = !!entry?.notes;
		showReflectionPreview = !!entry?.reflection;
		// Adjust height after content loads
		setTimeout(() => {
			adjustHeight(notesTextarea);
			adjustHeight(reflectionTextarea);
		}, 0);
	});

	// Get current tasks to do (not completed, not deleted)
	const currentTasks = $derived(
		tabsStore.activeTabs.filter((t) => !t.isCompleted)
	);

	// Get project for a task
	function getProjectForTask(taskId: string) {
		const task = tabsStore.tabs.find(t => t.id === taskId);
		if (!task?.parentId) return null;
		return projectsStore.projects.find(p => p.id === task.parentId);
	}

	function adjustHeight(textarea: HTMLTextAreaElement) {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = Math.max(textarea.scrollHeight, 80) + 'px';
	}

	function handleNotesInput(e: Event) {
		adjustHeight(e.target as HTMLTextAreaElement);
	}

	function handleReflectionInput(e: Event) {
		adjustHeight(e.target as HTMLTextAreaElement);
	}

	function saveEntry() {
		journalStore.createOrUpdate(dateString, {
			notes,
			reflection,
			completedTaskIds: []
		});
	}
</script>

<div
	class="day-view backdrop-blur-md bg-white/30 rounded-2xl border border-white/40 p-6 shadow-xl"
>
	<!-- Date Header -->
	<h2 class="text-2xl font-bold text-gray-800 mb-6">
		{selectedDate.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
	</h2>

	<!-- Notes Section -->
	<div class="mb-6">
		<div class="flex items-center justify-between mb-2">
			<label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
				<FileText size={16} />
				Today's Notes
			</label>
			<button
				onclick={() => (showNotesPreview = !showNotesPreview)}
				class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/40 transition text-xs text-gray-600"
				title={showNotesPreview ? 'Edit' : 'Preview'}
			>
				{#if showNotesPreview}
					<Edit size={12} />
					Edit
				{:else}
					<Eye size={12} />
					Preview
				{/if}
			</button>
		</div>
		{#if showNotesPreview}
			<div
				class="w-full min-h-[80px] px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm text-sm prose prose-sm max-w-none"
			>
				{@html parseMarkdown(notes)}
			</div>
		{:else}
			<textarea
				bind:this={notesTextarea}
				bind:value={notes}
				oninput={handleNotesInput}
				onblur={saveEntry}
				placeholder="What happened today? (Markdown: **bold**, *italic*, # headers, - lists)"
				class="w-full px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm overflow-hidden"
				style="min-height: 80px;"
			></textarea>
		{/if}
	</div>

	<!-- Current Tasks To Do -->
	{#if currentTasks.length > 0}
		<div class="mb-6">
			<div class="flex items-center justify-between mb-2">
				<label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
					<ListTodo size={16} />
					Tasks To Do ({currentTasks.length})
				</label>
				<button
					onclick={() => (showTodoList = !showTodoList)}
					class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/40 transition text-xs text-gray-600"
					title={showTodoList ? 'Hide' : 'Show'}
				>
					{#if showTodoList}
						<Eye size={12} />
						Hide
					{:else}
						<Eye size={12} />
						Show
					{/if}
				</button>
			</div>
			{#if showTodoList}
				<div class="space-y-2 max-h-64 overflow-y-auto">
					{#each currentTasks as task}
						{@const project = getProjectForTask(task.id)}
						<div class="flex items-start gap-2 px-3 py-2 bg-white/60 rounded-lg hover:bg-white/70 transition">
							<Circle size={14} class="text-gray-400 mt-0.5 flex-shrink-0" />
							<div class="flex-1 min-w-0">
								<p class="text-sm text-gray-800 break-words">{task.content}</p>
								{#if project}
									<div class="flex items-center gap-1 mt-1">
										<div 
											class="w-2 h-2 rounded-full" 
											style="background-color: {project.color};"
										></div>
										<span class="text-xs text-gray-500">{project.name}</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Reflection Section -->
	<div>
		<div class="flex items-center justify-between mb-2">
			<label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
				<Lightbulb size={16} />
				Evening Reflection
			</label>
			<button
				onclick={() => (showReflectionPreview = !showReflectionPreview)}
				class="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/40 transition text-xs text-gray-600"
				title={showReflectionPreview ? 'Edit' : 'Preview'}
			>
				{#if showReflectionPreview}
					<Edit size={12} />
					Edit
				{:else}
					<Eye size={12} />
					Preview
				{/if}
			</button>
		</div>
		{#if showReflectionPreview}
			<div
				class="w-full min-h-24 px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm text-sm prose prose-sm max-w-none"
			>
				{@html parseMarkdown(reflection)}
			</div>
		{:else}
			<textarea
				bind:this={reflectionTextarea}
				bind:value={reflection}
				oninput={handleReflectionInput}
				onblur={saveEntry}
				placeholder="How do you feel about today? (Markdown supported)"
				class="w-full px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm overflow-hidden"
				style="min-height: 96px;"
			></textarea>
		{/if}
	</div>
</div>

<style>
	.day-view {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
