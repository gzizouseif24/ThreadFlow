import type { Project } from '$lib/types/tab';
import { storage } from '$lib/utils/storage';

class ProjectsStore {
	projects = $state<Project[]>([]);

	constructor() {
		this.projects = storage.getProjects();
	}

	add(name: string, color: string, position?: { x: number; y: number }) {
		const newProject: Project = {
			id: crypto.randomUUID(),
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

	private save() {
		storage.setProjects(this.projects);
	}
}

export const projectsStore = new ProjectsStore();
