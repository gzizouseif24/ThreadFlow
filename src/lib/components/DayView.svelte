<script lang="ts">
	import { journalStore } from '$lib/stores/journal.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { formatDate } from '$lib/utils/dateUtils';
	import { Check, FileText, Lightbulb } from 'lucide-svelte';

	let { selectedDate }: { selectedDate: Date } = $props();

	const dateString = $derived(formatDate(selectedDate));
	const entry = $derived(journalStore.getEntry(dateString));

	let notes = $state(entry?.notes || '');
	let reflection = $state(entry?.reflection || '');

	let notesTextarea: HTMLTextAreaElement;
	let reflectionTextarea: HTMLTextAreaElement;

	// Update local state when entry changes
	$effect(() => {
		notes = entry?.notes || '';
		reflection = entry?.reflection || '';
		// Adjust height after content loads
		setTimeout(() => {
			adjustHeight(notesTextarea);
			adjustHeight(reflectionTextarea);
		}, 0);
	});

	// Get completed tasks for this date
	const completedTasks = $derived(
		tabsStore.tabs.filter((t) => {
			if (!t.isCompleted) return false;
			const taskDate = new Date(t.updatedAt);
			return taskDate.toDateString() === selectedDate.toDateString();
		})
	);

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
			completedTaskIds: completedTasks.map((t) => t.id)
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
		<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
			<FileText size={16} />
			Today's Notes
		</label>
		<textarea
			bind:this={notesTextarea}
			bind:value={notes}
			oninput={handleNotesInput}
			onblur={saveEntry}
			placeholder="What happened today?..."
			class="w-full px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm overflow-hidden"
			style="min-height: 80px;"
		></textarea>
	</div>

	<!-- Completed Tasks -->
	{#if completedTasks.length > 0}
		<div class="mb-6">
			<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
				<Check size={16} />
				Completed Today ({completedTasks.length})
			</label>
			<div class="space-y-2">
				{#each completedTasks as task}
					<div class="flex items-center gap-2 px-3 py-2 bg-white/60 rounded-lg">
						<Check size={14} class="text-pastel-mint" />
						<span class="text-sm text-gray-700">{task.content}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Reflection Section -->
	<div>
		<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
			<Lightbulb size={16} />
			Evening Reflection
		</label>
		<textarea
			bind:value={reflection}
			onblur={saveEntry}
			placeholder="How do you feel about today?..."
			class="w-full h-24 px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm"
		></textarea>
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
