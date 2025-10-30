// Simple markdown parser for journal entries
export function parseMarkdown(text: string): string {
	if (!text) return '';

	let html = text;

	// Headers
	html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-800 mt-4 mb-2">$1</h3>');
	html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mt-4 mb-2">$1</h2>');
	html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-800 mt-4 mb-2">$1</h1>');

	// Bold
	html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
	html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-gray-900">$1</strong>');

	// Italic
	html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
	html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>');

	// Links
	html = html.replace(
		/\[([^\]]+)\]\(([^)]+)\)/g,
		'<a href="$2" class="text-pastel-sky underline hover:text-pastel-lavender" target="_blank" rel="noopener noreferrer">$1</a>'
	);

	// Lists
	html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-gray-800">$1</li>');
	html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-800">$1</li>');
	html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal text-gray-800">$1</li>');

	// Wrap consecutive list items
	html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-2">$&</ul>');

	// Line breaks
	html = html.replace(/\n\n/g, '<br/><br/>');
	html = html.replace(/\n/g, '<br/>');

	// Code blocks
	html = html.replace(
		/`([^`]+)`/g,
		'<code class="px-1.5 py-0.5 bg-gray-200 rounded text-sm font-mono text-gray-800">$1</code>'
	);

	return html;
}
