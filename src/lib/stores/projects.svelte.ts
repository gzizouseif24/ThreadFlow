import type { Project } from '$lib/types/tab';
import { storage } from '$lib/utils/storage';

class ProjectsStore {
	projects = $state<Project[]>([]);

	constructor() {
		this.projects = storage.getProjects();
	}

	add(name: string, color: string, position?: { x: number; y: number }, id?: string) {
		const newProject: Project = {
			id: id || crypto.randomUUID(),
			name,
			color,
			position: position || { x: Math.random() * 400, y: Math.random() * 300 },
			width: 350, // Default width
			height: 400, // Default height
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		this.projects = [...this.projects, newProject];
		this.save();
		return newProject.id;
	}

	update(id: string, name: string) {
		this.projects = this.projects.map((project) =>
			project.id === id ? { ...project, name, updatedAt: Date.now() } : project
		);
		this.save();
	}

	updateColor(id: string, color: string) {
		this.projects = this.projects.map((project) =>
			project.id === id ? { ...project, color, updatedAt: Date.now() } : project
		);
		this.save();
	}

	updatePosition(id: string, position: { x: number; y: number }) {
		this.projects = this.projects.map((project) =>
			project.id === id ? { ...project, position, updatedAt: Date.now() } : project
		);
		this.save();
	}

	updateSize(id: string, width: number, height: number) {
		this.projects = this.projects.map((project) =>
			project.id === id ? { ...project, width, height, updatedAt: Date.now() } : project
		);
		this.save();
	}

	updateImage(id: string, imageUrl: string) {
		this.projects = this.projects.map((project) =>
			project.id === id ? { ...project, imageUrl, updatedAt: Date.now() } : project
		);
		this.save();
	}

	delete(id: string) {
		this.projects = this.projects.filter((project) => project.id !== id);
		this.save();
	}

	updateObjective(id: string, objective: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, objective, updatedAt: Date.now() } : p
		);
		this.save();
	}

	toggleExpanded(id: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, isExpanded: !p.isExpanded, updatedAt: Date.now() } : p
		);
		this.save();
	}

	togglePin(id: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, isPinned: !p.isPinned, updatedAt: Date.now() } : p
		);
		this.save();
	}

	linkProjects(projectId1: string, projectId2: string) {
		// Bi-directional linking
		this.projects = this.projects.map((p) => {
			if (p.id === projectId1) {
				const linkedIds = new Set(p.linkedProjectIds || []);
				linkedIds.add(projectId2);
				return { ...p, linkedProjectIds: Array.from(linkedIds), updatedAt: Date.now() };
			}
			if (p.id === projectId2) {
				const linkedIds = new Set(p.linkedProjectIds || []);
				linkedIds.add(projectId1);
				return { ...p, linkedProjectIds: Array.from(linkedIds), updatedAt: Date.now() };
			}
			return p;
		});
		this.save();
	}

	unlinkProjects(projectId1: string, projectId2: string) {
		this.projects = this.projects.map((p) => {
			if (p.id === projectId1 || p.id === projectId2) {
				const linkedIds = (p.linkedProjectIds || []).filter(
					id => id !== (p.id === projectId1 ? projectId2 : projectId1)
				);
				return { ...p, linkedProjectIds: linkedIds, updatedAt: Date.now() };
			}
			return p;
		});
		this.save();
	}

	getLinkedProjects(projectId: string): Project[] {
		const project = this.projects.find(p => p.id === projectId);
		if (!project?.linkedProjectIds) return [];
		return this.projects.filter(p => project.linkedProjectIds!.includes(p.id));
	}

	get pinnedProjects(): Project[] {
		return this.projects.filter((p) => p.isPinned);
	}

	private save() {
		storage.setProjects(this.projects);
	}
}

export const projectsStore = new ProjectsStore();
