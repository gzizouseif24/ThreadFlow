<script lang="ts">
	const PASTEL_COLORS = [
		{ name: 'Hot Pink', hex: '#FF69B4' },
		{ name: 'Purple', hex: '#B57EDC' },
		{ name: 'Mint', hex: '#00E5A0' },
		{ name: 'Peach', hex: '#FFB347' },
		{ name: 'Sky Blue', hex: '#4FC3F7' },
		{ name: 'Orchid', hex: '#DA70D6' }
	];

	let { selectedColor = $bindable(), onSelect }: { selectedColor: string; onSelect?: (color: string) => void } = $props();
</script>

<div class="flex gap-2 flex-wrap">
	{#each PASTEL_COLORS as color}
		<button
			type="button"
			class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95"
			class:ring-2={selectedColor === color.hex}
			class:ring-offset-2={selectedColor === color.hex}
			class:ring-gray-600={selectedColor === color.hex}
			style="background-color: {color.hex};"
			title={color.name}
			onclick={() => {
				selectedColor = color.hex;
				if (onSelect) onSelect(color.hex);
			}}
		>
			{#if selectedColor === color.hex}
				<span class="text-gray-600 text-xs">✓</span>
			{/if}
		</button>
	{/each}
</div>
