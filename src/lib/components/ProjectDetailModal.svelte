<script lang="ts">
	import type { Project } from '$lib/types/tab';
	import { projectsStore } from '$lib/stores/projects.svelte';
	import { tabsStore } from '$lib/stores/tabs.svelte';
	import { parseMarkdown } from '$lib/utils/markdown';
	import {
		X,
		FileText,
		Target,
		Calendar,
		Link as LinkIcon,
		FolderOpen,
		ListTodo,
		Tag,
		Eye,
		Edit,
		Plus,
		Trash2,
		ExternalLink,
		FileCode,
		Github,
		Palette
	} from 'lucide-svelte';

	let {
		project,
		isOpen = $bindable(),
		onClose
	}: { project: Project | null; isOpen: boolean; onClose: () => void } = $props();

	let activeTab = $state<'overview' | 'links' | 'resources' | 'tasks'>('overview');
	let showDescriptionPreview = $state(false);
	let showAddLink = $state(false);
	let showAddResource = $state(false);

	// Local state
	let description = $state('');
	let objective = $state('');
	let deadline = $state('');
	let status = $state<Project['status']>('active');
	let tags = $state<string[]>([]);

	// New item inputs
	let newLinkTitle = $state('');
	let newLinkUrl = $state('');
	let newLinkType = $state<'documentation' | 'repository' | 'design' | 'other'>('other');
	let newResourceTitle = $state('');
	let newResourceUrl = $state('');
	let newResourceDescription = $state('');
	let newResourceType = $state<'document' | 'image' | 'video' | 'other'>('document');
	let newTag = $state('');

	// Update local state when project changes
	$effect(() => {
		if (project) {
			description = project.description || '';
			objective = project.objective || '';
			deadline = project.deadline || '';
			status = project.status || 'active';
			tags = project.tags || [];
		}
	});

	// Get tasks for this project
	const projectTasks = $derived(
		project ? tabsStore.getTasksByProject(project.id) : []
	);

	function saveDescription() {
		if (!project) return;
		projectsStore.updateDescription(project.id, description);
	}

	function saveObjective() {
		if (!project) return;
		projectsStore.updateObjective(project.id, objective);
	}

	function saveDeadline() {
		if (!project) return;
		projectsStore.updateDeadline(project.id, deadline);
	}

	function saveStatus() {
		if (!project) return;
		projectsStore.updateStatus(project.id, status);
	}

	function addLink() {
		if (!project || !newLinkTitle.trim() || !newLinkUrl.trim()) return;
		projectsStore.addLink(project.id, {
			title: newLinkTitle.trim(),
			url: newLinkUrl.trim(),
			type: newLinkType
		});
		newLinkTitle = '';
		newLinkUrl = '';
		newLinkType = 'other';
	}

	function removeLink(linkId: string) {
		if (!project) return;
		projectsStore.removeLink(project.id, linkId);
	}

	function addResource() {
		if (!project || !newResourceTitle.trim()) return;
		projectsStore.addResource(project.id, {
			title: newResourceTitle.trim(),
			url: newResourceUrl.trim() || undefined,
			description: newResourceDescription.trim() || undefined,
			type: newResourceType
		});
		newResourceTitle = '';
		newResourceUrl = '';
		newResourceDescription = '';
		newResourceType = 'document';
	}

	function removeResource(resourceId: string) {
		if (!project) return;
		projectsStore.removeResource(project.id, resourceId);
	}

	function addTag() {
		if (!project || !newTag.trim()) return;
		const updatedTags = [...tags, newTag.trim()];
		projectsStore.updateTags(project.id, updatedTags);
		tags = updatedTags;
		newTag = '';
	}

	function removeTag(index: number) {
		if (!project) return;
		const updatedTags = tags.filter((_, i) => i !== index);
		projectsStore.updateTags(project.id, updatedTags);
		tags = updatedTags;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function getLinkIcon(type: string) {
		switch (type) {
			case 'repository':
				return Github;
			case 'design':
				return Palette;
			case 'documentation':
				return FileCode;
			default:
				return LinkIcon;
		}
	}

	function getStatusColor(s: Project['status']) {
		switch (s) {
			case 'planning':
				return 'bg-blue-100 text-blue-700';
			case 'active':
				return 'bg-green-100 text-green-700';
			case 'paused':
				return 'bg-orange-100 text-orange-700';
			case 'completed':
				return 'bg-purple-100 text-purple-700';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	}

	function getDaysUntilDeadline() {
		if (!deadline) return null;
		const deadlineDate = new Date(deadline);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		deadlineDate.setHours(0, 0, 0, 0);
		const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		return diff;
	}
</script>

{#if isOpen && project}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-[400px] backdrop-blur-md bg-white/80 rounded-2xl border border-white/40 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			<div 
				class="px-6 py-4 border-b border-white/40 flex items-center justify-between rounded-t-2xl"
				style="background-color: {project.color}30;"
			>
				<div class="flex items-center gap-3">
					<div
						class="w-8 h-8 rounded-lg"
						style="background-color: {project.color};"
					></div>
					<h2 class="text-lg font-bold text-gray-800">{project.name}</h2>
				</div>
				<button
					onclick={onClose}
					class="p-1.5 hover:bg-white/40 rounded-full transition"
					aria-label="Close"
				>
					<X size={18} class="text-gray-600" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6 space-y-4">
				<!-- Notes -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<FileText size={16} />
						Notes
					</label>
					<textarea
						bind:value={description}
						onblur={saveDescription}
						placeholder="Project notes..."
						class="w-full h-32 px-4 py-3 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none resize-none text-sm"
					></textarea>
				</div>

				<!-- Deadline -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<Calendar size={16} />
						Deadline
					</label>
					<input
						type="date"
						bind:value={deadline}
						onchange={saveDeadline}
						class="w-full px-4 py-2 rounded-lg border-2 border-white/40 bg-white/60 backdrop-blur-sm focus:border-pastel-lavender focus:outline-none text-sm"
					/>
					{#if deadline}
						{@const daysLeft = getDaysUntilDeadline()}
						{#if daysLeft !== null}
							<p
								class="text-xs mt-1 {daysLeft < 0
									? 'text-red-600'
									: daysLeft < 7
										? 'text-orange-600'
										: 'text-gray-600'}"
							>
								{#if daysLeft < 0}
									Overdue by {Math.abs(daysLeft)} days
								{:else if daysLeft === 0}
									Due today
								{:else}
									{daysLeft} days remaining
								{/if}
							</p>
						{/if}
					{/if}
				</div>

				<!-- Links Section -->
				<div>
					<label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
						<LinkIcon size={16} />
						Links
					</label>
					
					{#if project.links && project.links.length > 0}
						<div class="space-y-2 mb-2">
							{#each project.links as link}
								{@const Icon = getLinkIcon(link.type)}
								<div class="flex items-center justify-between px-3 py-2 bg-white/60 rounded-lg">
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 flex-1 min-w-0 hover:text-blue-600 transition"
									>
										<Icon size={14} class="flex-shrink-0" />
										<span class="text-sm truncate">{link.title}</span>
										<ExternalLink size={10} class="flex-shrink-0" />
									</a>
									<button
										onclick={() => removeLink(link.id)}
										class="p-1 hover:bg-red-100 rounded transition text-red-600"
									>
										<Trash2 size={12} />
									</button>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Add Link Form -->
					{#if showAddLink}
						<div class="space-y-2 mb-2">
							<input
								type="text"
								bind:value={newLinkTitle}
								placeholder="Link title..."
								class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/60 focus:border-pastel-lavender focus:outline-none text-sm"
							/>
							<input
								type="url"
								bind:value={newLinkUrl}
								placeholder="https://..."
								class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/60 focus:border-pastel-lavender focus:outline-none text-sm"
							/>
							<div class="flex gap-2">
								<select
									bind:value={newLinkType}
									class="flex-1 px-3 py-2 rounded-lg border border-white/40 bg-white/60 focus:border-pastel-lavender focus:outline-none text-sm"
								>
									<option value="documentation">Docs</option>
									<option value="repository">Repo</option>
									<option value="design">Design</option>
									<option value="other">Other</option>
								</select>
								<button
									onclick={addLink}
									class="px-4 py-2 rounded-lg bg-pastel-mint/60 hover:bg-pastel-mint/80 text-gray-800 font-medium text-sm transition"
								>
									Add
								</button>
							</div>
						</div>
					{/if}

					<button
						onclick={() => (showAddLink = !showAddLink)}
						class="w-full px-3 py-2 rounded-lg border border-dashed border-gray-300 hover:border-pastel-mint hover:bg-white/40 transition text-sm text-gray-600 flex items-center justify-center gap-2"
					>
						<Plus size={14} />
						{showAddLink ? 'Cancel' : 'Add Link'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

