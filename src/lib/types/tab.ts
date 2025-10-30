export interface Tab {
	id: string;
	content: string;
	parentId: string | null; // null = root task, string = belongs to project
	isPinned: boolean;
	isCompleted: boolean;
	isDeleted: boolean; // Soft delete flag
	deletedAt: number | null; // Deletion timestamp
	createdAt: number;
	updatedAt: number;
	position?: { x: number; y: number };
	imageUrl?: string;
	notes?: string; // Additional notes/details
	tags?: string[]; // Tags for categorization
}

export interface Project {
	id: string;
	name: string;
	color: string; // Hex color from pastel palette
	position: { x: number; y: number };
	width: number; // Resizable width
	height: number; // Resizable height
	imageUrl?: string; // Optional project icon/image
	createdAt: number;
	updatedAt: number;
	
	// Project details
	description?: string; // Project description/notes
	objective?: string; // Main objective/goal
	deadline?: string; // ISO date string (YYYY-MM-DD)
	links?: ProjectLink[]; // External links/resources
	resources?: ProjectResource[]; // Documents, files, etc.
	status?: 'planning' | 'active' | 'paused' | 'completed';
	tags?: string[]; // Project tags
}

export interface ProjectLink {
	id: string;
	title: string;
	url: string;
	type: 'documentation' | 'repository' | 'design' | 'other';
	createdAt: number;
}

export interface ProjectResource {
	id: string;
	title: string;
	description?: string;
	url?: string; // External URL or file path
	type: 'document' | 'image' | 'video' | 'other';
	createdAt: number;
}
