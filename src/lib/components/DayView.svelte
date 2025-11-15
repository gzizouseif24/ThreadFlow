<script lang="ts">
	import { journalStore } from '$lib/stores/journal.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { eventsStore } from '$lib/stores/events.svelte';
	import { formatDate } from '$lib/utils/dateUtils';
	import { parseMarkdown } from '$lib/utils/markdown';
	import { ListTodo, FileText, Lightbulb, Eye, Edit, Circle, EyeOff, Calendar, Plus, Trash2, Link2, X } from 'lucide-svelte';

	let { selectedDate }: { selectedDate: Date } = $props();

	const dateString = $derived(formatDate(selectedDate));
	const entry = $derived(journalStore.getEntry(dateString));
	const dayEvents = $derived(eventsStore.getEventsByDate(dateString));

	let showNotesPreview = $state(!!entry?.notes);
	let showReflectionPreview = $state(!!entry?.reflection);
	let showTodoList = $state(true);

	let notes = $state(entry?.notes || '');
	let reflection = $state(entry?.reflection || '');

	// Event creation state
	let showEventForm = $state(false);
	let newEventTitle = $state('');
	let newEventTime = $state('');
	let newEventDescription = $state('');

	// Event editing state
	let editingEventId = $state<string | null>(null);
	let editEventTitle = $state('');
	let editEventTime = $state('');
	let editEventDescription = $state('');

	// Task linking state
	let linkingEventId = $state<string | null>(null);

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
		return projectsStore.projects.find(p => p.id === task.parentId) || null;
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

	function handleCreateEvent() {
		if (!newEventTitle.trim()) return;

		eventsStore.add(newEventTitle, dateString, newEventTime || undefined, newEventDescription || undefined);

		// Reset form
		newEventTitle = '';
		newEventTime = '';
		newEventDescription = '';
		showEventForm = false;
	}

	function startEditEvent(eventId: string) {
		const event = dayEvents.find(e => e.id === eventId);
		if (!event) return;

		editingEventId = eventId;
		editEventTitle = event.title;
		editEventTime = event.time || '';
		editEventDescription = event.description || '';
	}

	function saveEventEdit() {
		if (!editingEventId || !editEventTitle.trim()) return;

		eventsStore.update(editingEventId, {
			title: editEventTitle,
			time: editEventTime || undefined,
			description: editEventDescription || undefined
		});

		// Reset editing state
		editingEventId = null;
		editEventTitle = '';
		editEventTime = '';
		editEventDescription = '';
	}

	function cancelEventEdit() {
		editingEventId = null;
		editEventTitle = '';
		editEventTime = '';
		editEventDescription = '';
	}

	function deleteEvent(eventId: string) {
		if (confirm('Delete this event?')) {
			eventsStore.delete(eventId);
		}
	}

	function toggleTaskLink(eventId: string, taskId: string) {
		const event = dayEvents.find(e => e.id === eventId);
		if (!event) return;

		const isLinked = event.linkedTaskIds?.includes(taskId);
		if (isLinked) {
			eventsStore.unlinkTask(eventId, taskId);
		} else {
			eventsStore.linkTask(eventId, taskId);
		}
	}

	function getLinkedTasks(eventId: string) {
		const event = dayEvents.find(e => e.id === eventId);
		if (!event?.linkedTaskIds) return [];
		return tabsStore.activeTabs.filter(t => event.linkedTaskIds!.includes(t.id));
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

	<!-- Events Section -->
	<div class="mb-6">
		<div class="flex items-center justify-between mb-3">
			<label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
				<Calendar size={16} />
				Events
			</label>
			<button
				onclick={() => (showEventForm = !showEventForm)}
				class="flex items-center gap-1 px-2 py-1 rounded-md bg-pastel-lavender/60 hover:bg-pastel-lavender/80 transition text-xs text-gray-800"
			>
				<Plus size={12} />
				Add Event
			</button>
		</div>

		<!-- New Event Form -->
		{#if showEventForm}
			<div class="mb-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40">
				<input
					type="text"
					bind:value={newEventTitle}
					placeholder="Event title..."
					class="w-full px-3 py-2 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm"
				/>
				<input
					type="time"
					bind:value={newEventTime}
					class="w-full px-3 py-2 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm"
				/>
				<textarea
					bind:value={newEventDescription}
					placeholder="Description (optional)..."
					class="w-full px-3 py-2 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm resize-none"
					rows="2"
				></textarea>
				<div class="flex gap-2">
					<button
						onclick={handleCreateEvent}
						class="px-3 py-1 rounded-md bg-pastel-mint hover:bg-pastel-mint/80 transition text-xs text-gray-800"
					>
						Create
					</button>
					<button
						onclick={() => {
							showEventForm = false;
							newEventTitle = '';
							newEventTime = '';
							newEventDescription = '';
						}}
						class="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition text-xs text-gray-800"
					>
						Cancel
					</button>
				</div>
			</div>
		{/if}

		<!-- Events List -->
		<div class="space-y-2">
			{#each dayEvents as event (event.id)}
				<div class="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40">
					{#if editingEventId === event.id}
						<!-- Edit Mode -->
						<input
							type="text"
							bind:value={editEventTitle}
							class="w-full px-2 py-1 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm font-medium"
						/>
						<input
							type="time"
							bind:value={editEventTime}
							class="w-full px-2 py-1 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm"
						/>
						<textarea
							bind:value={editEventDescription}
							placeholder="Description (optional)..."
							class="w-full px-2 py-1 mb-2 rounded-md border border-gray-300 focus:outline-none focus:border-pastel-lavender text-sm resize-none"
							rows="2"
						></textarea>
						<div class="flex gap-2">
							<button
								onclick={saveEventEdit}
								class="px-2 py-1 rounded-md bg-pastel-mint hover:bg-pastel-mint/80 transition text-xs"
							>
								Save
							</button>
							<button
								onclick={cancelEventEdit}
								class="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition text-xs"
							>
								Cancel
							</button>
						</div>
					{:else}
						<!-- View Mode -->
						<div class="flex items-start justify-between gap-2">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-1">
									{#if event.time}
										<span class="text-xs font-semibold text-pastel-lilac">{event.time}</span>
									{/if}
									<h3 class="text-sm font-semibold text-gray-800">{event.title}</h3>
								</div>
								{#if event.description}
									<p class="text-xs text-gray-600 mb-2">{event.description}</p>
								{/if}

								<!-- Linked Tasks -->
								{#if getLinkedTasks(event.id).length > 0}
									<div class="flex flex-wrap gap-1 mb-2">
										{#each getLinkedTasks(event.id) as task}
											<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-sky/60 text-xs text-gray-700">
												<Link2 size={10} />
												{task.content}
											</span>
										{/each}
									</div>
								{/if}

								<!-- Task Linking Menu -->
								{#if linkingEventId === event.id}
									<div class="mt-2 p-2 rounded-md bg-white/80 border border-gray-200">
										<div class="flex items-center justify-between mb-2">
											<span class="text-xs font-semibold text-gray-700">Link Tasks</span>
											<button
												onclick={() => (linkingEventId = null)}
												class="text-gray-500 hover:text-gray-700"
											>
												<X size={12} />
											</button>
										</div>
										<div class="space-y-1 max-h-40 overflow-y-auto">
											{#each currentTasks as task}
												<label class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer text-xs">
													<input
														type="checkbox"
														checked={event.linkedTaskIds?.includes(task.id)}
														onchange={() => toggleTaskLink(event.id, task.id)}
														class="rounded"
													/>
													<span class="flex-1">{task.content}</span>
													{#if task.parentId}
														{@const project = getProjectForTask(task.id)}
														{#if project}
															<span class="text-xs text-gray-500">({project.name})</span>
														{/if}
													{/if}
												</label>
											{/each}
										</div>
									</div>
								{/if}
							</div>

							<!-- Action Buttons -->
							<div class="flex items-center gap-1">
								<button
									onclick={() => (linkingEventId = linkingEventId === event.id ? null : event.id)}
									class="p-1 rounded hover:bg-white/60 transition"
									title="Link tasks"
								>
									<Link2 size={14} class="text-gray-600" />
								</button>
								<button
									onclick={() => startEditEvent(event.id)}
									class="p-1 rounded hover:bg-white/60 transition"
									title="Edit event"
								>
									<Edit size={14} class="text-gray-600" />
								</button>
								<button
									onclick={() => deleteEvent(event.id)}
									class="p-1 rounded hover:bg-red-200 transition"
									title="Delete event"
								>
									<Trash2 size={14} class="text-red-600" />
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}

			{#if dayEvents.length === 0 && !showEventForm}
				<p class="text-sm text-gray-500 italic text-center py-4">No events scheduled</p>
			{/if}
		</div>
	</div>

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
