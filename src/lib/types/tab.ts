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
	objective?: string; // Main objective/goal
}
