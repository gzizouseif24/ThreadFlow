import {
	Code,
	Database,
	Paintbrush,
	FileText,
	Book,
	Coffee,
	Music,
	Camera,
	Plane,
	Heart,
	Star,
	Zap,
	Target,
	TrendingUp,
	Briefcase,
	Users,
	MessageSquare,
	Mail,
	Phone,
	Calendar,
	Clock,
	Bell,
	CheckCircle,
	Settings,
	Wrench,
	Package,
	ShoppingCart,
	DollarSign,
	CreditCard,
	BarChart,
	PieChart,
	Home,
	Building,
	Rocket,
	Lightbulb,
	Cpu,
	Smartphone,
	Monitor,
	Headphones,
	Video,
	Image,
	Folder,
	File,
	Search,
	Globe,
	Map,
	MapPin,
	Navigation,
	Compass,
	Award,
	Trophy,
	Flag,
	Bookmark,
	Tag,
	Paperclip,
	Link,
	Share2,
	Download,
	Upload,
	Send,
	Inbox,
	Archive,
	Trash2,
	Edit,
	Eye,
	Lock,
	Unlock,
	Shield,
	Key,
	User,
	UserPlus,
	Gift,
	Box,
	Layers,
	Layout,
	Grid,
	List,
	Filter,
	Move,
	Copy,
	Scissors,
	CloudRain,
	Sun,
	Moon,
	Flame,
	Droplet,
	Wind,
	Snowflake,
	Umbrella,
	Activity,
	TrendingDown,
	BarChart2,
	GitBranch,
	GitCommit,
	Terminal,
	Codesandbox,
	Figma,
	Chrome,
	Feather,
	Pen,
	Palette,
	Brush
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

interface IconMatch {
	keywords: string[];
	icon: ComponentType;
}

const iconMappings: IconMatch[] = [
	// Development & Tech
	{ keywords: ['code', 'coding', 'program', 'develop', 'software', 'bug', 'debug', 'api', 'frontend', 'backend'], icon: Code },
	{ keywords: ['database', 'sql', 'data', 'storage', 'mongodb', 'postgres'], icon: Database },
	{ keywords: ['git', 'github', 'branch', 'merge', 'commit', 'version'], icon: GitBranch },
	{ keywords: ['deploy', 'deployment', 'ci', 'cd', 'pipeline'], icon: GitCommit },
	{ keywords: ['terminal', 'command', 'cli', 'shell', 'bash'], icon: Terminal },
	{ keywords: ['server', 'host', 'cloud', 'aws', 'infrastructure'], icon: Cpu },
	{ keywords: ['mobile', 'app', 'ios', 'android', 'phone'], icon: Smartphone },
	{ keywords: ['web', 'website', 'site', 'browser', 'online'], icon: Globe },
	{ keywords: ['monitor', 'screen', 'display', 'desktop'], icon: Monitor },

	// Design & Creative
	{ keywords: ['design', 'ui', 'ux', 'interface', 'layout', 'wireframe'], icon: Paintbrush },
	{ keywords: ['figma', 'sketch', 'adobe', 'prototype'], icon: Figma },
	{ keywords: ['art', 'draw', 'paint', 'creative', 'illustration'], icon: Palette },
	{ keywords: ['color', 'theme', 'style', 'palette'], icon: Brush },
	{ keywords: ['logo', 'brand', 'identity', 'graphic'], icon: Feather },
	{ keywords: ['photo', 'image', 'picture', 'visual'], icon: Camera },
	{ keywords: ['video', 'film', 'movie', 'recording'], icon: Video },
	{ keywords: ['music', 'audio', 'sound', 'podcast'], icon: Music },

	// Business & Finance
	{ keywords: ['business', 'company', 'corporate', 'enterprise'], icon: Briefcase },
	{ keywords: ['money', 'payment', 'finance', 'budget', 'salary'], icon: DollarSign },
	{ keywords: ['card', 'credit', 'debit', 'billing'], icon: CreditCard },
	{ keywords: ['shop', 'store', 'ecommerce', 'cart', 'purchase'], icon: ShoppingCart },
	{ keywords: ['invoice', 'receipt', 'transaction'], icon: FileText },
	{ keywords: ['analytics', 'metrics', 'stats', 'chart'], icon: BarChart },
	{ keywords: ['report', 'dashboard', 'insight'], icon: PieChart },
	{ keywords: ['growth', 'increase', 'up', 'profit'], icon: TrendingUp },
	{ keywords: ['loss', 'decrease', 'down', 'decline'], icon: TrendingDown },

	// Communication
	{ keywords: ['meeting', 'call', 'zoom', 'conference', 'discuss'], icon: Users },
	{ keywords: ['message', 'chat', 'conversation', 'talk'], icon: MessageSquare },
	{ keywords: ['email', 'mail', 'inbox', 'send'], icon: Mail },
	{ keywords: ['phone', 'call', 'telephone', 'contact'], icon: Phone },
	{ keywords: ['share', 'social', 'post', 'publish'], icon: Share2 },

	// Organization & Planning
	{ keywords: ['calendar', 'schedule', 'appointment', 'event', 'date'], icon: Calendar },
	{ keywords: ['time', 'clock', 'deadline', 'timer', 'hour'], icon: Clock },
	{ keywords: ['reminder', 'alert', 'notification', 'notify'], icon: Bell },
	{ keywords: ['task', 'todo', 'checklist', 'complete', 'done'], icon: CheckCircle },
	{ keywords: ['goal', 'target', 'objective', 'aim'], icon: Target },
	{ keywords: ['plan', 'strategy', 'roadmap'], icon: Map },
	{ keywords: ['project', 'initiative', 'launch'], icon: Rocket },

	// Documentation & Writing
	{ keywords: ['write', 'writing', 'draft', 'compose', 'author'], icon: Pen },
	{ keywords: ['document', 'doc', 'file', 'paper'], icon: FileText },
	{ keywords: ['book', 'read', 'reading', 'study', 'learn'], icon: Book },
	{ keywords: ['note', 'notes', 'memo', 'journal'], icon: FileText },
	{ keywords: ['article', 'blog', 'post', 'content'], icon: File },

	// Personal & Lifestyle
	{ keywords: ['home', 'house', 'family', 'personal'], icon: Home },
	{ keywords: ['health', 'fitness', 'exercise', 'workout', 'gym'], icon: Activity },
	{ keywords: ['food', 'eat', 'meal', 'cook', 'recipe'], icon: Coffee },
	{ keywords: ['travel', 'trip', 'vacation', 'holiday', 'flight'], icon: Plane },
	{ keywords: ['love', 'favorite', 'like', 'heart'], icon: Heart },
	{ keywords: ['birthday', 'celebration', 'party', 'gift'], icon: Gift },

	// General Actions
	{ keywords: ['search', 'find', 'lookup', 'query'], icon: Search },
	{ keywords: ['download', 'get', 'fetch', 'retrieve'], icon: Download },
	{ keywords: ['upload', 'post', 'submit', 'send'], icon: Upload },
	{ keywords: ['edit', 'modify', 'change', 'update'], icon: Edit },
	{ keywords: ['view', 'see', 'watch', 'preview'], icon: Eye },
	{ keywords: ['settings', 'config', 'preferences', 'options'], icon: Settings },
	{ keywords: ['tool', 'utility', 'helper'], icon: Wrench },
	{ keywords: ['box', 'package', 'container', 'bundle'], icon: Package },
	{ keywords: ['folder', 'directory', 'organize'], icon: Folder },
	{ keywords: ['link', 'url', 'connect', 'attachment'], icon: Link },
	{ keywords: ['tag', 'label', 'category', 'group'], icon: Tag },
	{ keywords: ['bookmark', 'save', 'favorite', 'mark'], icon: Bookmark },
	{ keywords: ['archive', 'old', 'past', 'history'], icon: Archive },
	{ keywords: ['delete', 'remove', 'trash', 'clean'], icon: Trash2 },

	// Security & Access
	{ keywords: ['security', 'secure', 'safe', 'protect'], icon: Shield },
	{ keywords: ['lock', 'locked', 'private', 'restricted'], icon: Lock },
	{ keywords: ['unlock', 'open', 'access', 'public'], icon: Unlock },
	{ keywords: ['key', 'password', 'auth', 'login'], icon: Key },
	{ keywords: ['user', 'account', 'profile', 'member'], icon: User },

	// Achievement & Status
	{ keywords: ['award', 'prize', 'achievement', 'win'], icon: Award },
	{ keywords: ['trophy', 'champion', 'winner', 'victory'], icon: Trophy },
	{ keywords: ['star', 'favorite', 'best', 'top'], icon: Star },
	{ keywords: ['flag', 'milestone', 'marker', 'important'], icon: Flag },
	{ keywords: ['idea', 'brainstorm', 'think', 'innovation'], icon: Lightbulb },
	{ keywords: ['energy', 'power', 'fast', 'quick', 'speed'], icon: Zap },

	// Weather & Nature
	{ keywords: ['rain', 'rainy', 'wet', 'weather'], icon: CloudRain },
	{ keywords: ['sun', 'sunny', 'bright', 'day'], icon: Sun },
	{ keywords: ['moon', 'night', 'dark', 'evening'], icon: Moon },
	{ keywords: ['fire', 'hot', 'heat', 'flame'], icon: Flame },
	{ keywords: ['water', 'liquid', 'drop'], icon: Droplet },
	{ keywords: ['wind', 'air', 'breeze'], icon: Wind },
	{ keywords: ['snow', 'cold', 'winter', 'ice'], icon: Snowflake },

	// Navigation & Location
	{ keywords: ['map', 'navigation', 'direction', 'route'], icon: Map },
	{ keywords: ['location', 'place', 'pin', 'marker'], icon: MapPin },
	{ keywords: ['navigate', 'navigate', 'go'], icon: Navigation },
	{ keywords: ['compass', 'explore', 'discover'], icon: Compass },

	// Organization
	{ keywords: ['building', 'office', 'work', 'workplace'], icon: Building },
	{ keywords: ['layer', 'stack', 'multiple'], icon: Layers },
	{ keywords: ['layout', 'structure', 'format'], icon: Layout },
	{ keywords: ['grid', 'table', 'matrix'], icon: Grid },
	{ keywords: ['list', 'items', 'menu'], icon: List },
];

/**
 * Generates an appropriate icon based on the content text
 * @param text The task or project name/description
 * @returns A Svelte component for the icon
 */
export function generateIcon(text: string): ComponentType {
	if (!text) return Layers; // Default icon

	const lowerText = text.toLowerCase();

	// Find the first matching icon based on keywords
	for (const mapping of iconMappings) {
		for (const keyword of mapping.keywords) {
			if (lowerText.includes(keyword)) {
				return mapping.icon;
			}
		}
	}

	// Default fallback icon
	return Layers;
}

/**
 * Gets a color for the icon based on the text (for visual variety)
 * @param text The task or project name
 * @returns A Tailwind color class
 */
export function getIconColor(text: string): string {
	if (!text) return 'text-gray-600';

	const colors = [
		'text-blue-600',
		'text-purple-600',
		'text-pink-600',
		'text-red-600',
		'text-orange-600',
		'text-yellow-600',
		'text-green-600',
		'text-teal-600',
		'text-cyan-600',
		'text-indigo-600',
	];

	// Use a simple hash to consistently assign colors
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colors.length;

	return colors[index];
}
