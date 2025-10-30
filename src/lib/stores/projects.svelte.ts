import type { Project, ProjectLink, ProjectResource } from '$lib/types/tab';
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

	updateDescription(id: string, description: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, description, updatedAt: Date.now() } : p
		);
		this.save();
	}

	updateObjective(id: string, objective: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, objective, updatedAt: Date.now() } : p
		);
		this.save();
	}

	updateDeadline(id: string, deadline: string) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, deadline, updatedAt: Date.now() } : p
		);
		this.save();
	}

	updateStatus(id: string, status: Project['status']) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, status, updatedAt: Date.now() } : p
		);
		this.save();
	}

	addLink(projectId: string, link: Omit<ProjectLink, 'id' | 'createdAt'>) {
		this.projects = this.projects.map((p) => {
			if (p.id === projectId) {
				const newLink: ProjectLink = {
					...link,
					id: crypto.randomUUID(),
					createdAt: Date.now()
				};
				return {
					...p,
					links: [...(p.links || []), newLink],
					updatedAt: Date.now()
				};
			}
			return p;
		});
		this.save();
	}

	removeLink(projectId: string, linkId: string) {
		this.projects = this.projects.map((p) => {
			if (p.id === projectId) {
				return {
					...p,
					links: (p.links || []).filter((l) => l.id !== linkId),
					updatedAt: Date.now()
				};
			}
			return p;
		});
		this.save();
	}

	addResource(projectId: string, resource: Omit<ProjectResource, 'id' | 'createdAt'>) {
		this.projects = this.projects.map((p) => {
			if (p.id === projectId) {
				const newResource: ProjectResource = {
					...resource,
					id: crypto.randomUUID(),
					createdAt: Date.now()
				};
				return {
					...p,
					resources: [...(p.resources || []), newResource],
					updatedAt: Date.now()
				};
			}
			return p;
		});
		this.save();
	}

	removeResource(projectId: string, resourceId: string) {
		this.projects = this.projects.map((p) => {
			if (p.id === projectId) {
				return {
					...p,
					resources: (p.resources || []).filter((r) => r.id !== resourceId),
					updatedAt: Date.now()
				};
			}
			return p;
		});
		this.save();
	}

	updateTags(id: string, tags: string[]) {
		this.projects = this.projects.map((p) =>
			p.id === id ? { ...p, tags, updatedAt: Date.now() } : p
		);
		this.save();
	}

	private save() {
		storage.setProjects(this.projects);
	}
}

export const projectsStore = new ProjectsStore();
