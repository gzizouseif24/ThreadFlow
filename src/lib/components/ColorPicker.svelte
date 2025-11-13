<script lang="ts">
	import { Pipette } from 'lucide-svelte';

	const PASTEL_COLORS = [
		// Pinks & Reds
		{ name: 'Rose', hex: '#FFB6C1' },
		{ name: 'Coral', hex: '#FF9999' },
		{ name: 'Cherry Blossom', hex: '#FFB7C5' },
		{ name: 'Salmon', hex: '#FFA07A' },

		// Purples & Violets
		{ name: 'Lavender', hex: '#E6E6FA' },
		{ name: 'Lilac', hex: '#DDA0DD' },
		{ name: 'Periwinkle', hex: '#CCCCFF' },
		{ name: 'Amethyst', hex: '#C8A2C8' },

		// Blues & Cyans
		{ name: 'Powder Blue', hex: '#B0E0E6' },
		{ name: 'Baby Blue', hex: '#89CFF0' },
		{ name: 'Sky', hex: '#87CEEB' },
		{ name: 'Aqua', hex: '#7FDBFF' },

		// Greens & Mints
		{ name: 'Mint', hex: '#98FB98' },
		{ name: 'Sage', hex: '#9DC183' },
		{ name: 'Seafoam', hex: '#93E9BE' },
		{ name: 'Pistachio', hex: '#C1FFC1' },

		// Yellows & Oranges
		{ name: 'Lemon', hex: '#FFFACD' },
		{ name: 'Buttercup', hex: '#FFEB99' },
		{ name: 'Peach', hex: '#FFDAB9' },
		{ name: 'Apricot', hex: '#FBCEB1' }
	];

	const GRADIENT_COLORS = [
		{ name: 'Sunset', gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFA07A 100%)' },
		{ name: 'Ocean', gradient: 'linear-gradient(135deg, #89CFF0 0%, #7FDBFF 100%)' },
		{ name: 'Forest', gradient: 'linear-gradient(135deg, #93E9BE 0%, #98FB98 100%)' },
		{ name: 'Twilight', gradient: 'linear-gradient(135deg, #DDA0DD 0%, #FFB6C1 100%)' },
		{ name: 'Sunrise', gradient: 'linear-gradient(135deg, #FFA07A 0%, #FFFACD 100%)' },
		{ name: 'Mint Breeze', gradient: 'linear-gradient(135deg, #98FB98 0%, #7FDBFF 100%)' },
		{ name: 'Berry', gradient: 'linear-gradient(135deg, #C8A2C8 0%, #FF9999 100%)' },
		{ name: 'Peachy', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFB7C5 100%)' }
	];

	let { selectedColor = $bindable(), onSelect }: { selectedColor: string; onSelect?: (color: string) => void } = $props();
	let customColor = $state('#FF69B4');
	let showCustomPicker = $state(false);

	function handleCustomColorSelect() {
		selectedColor = customColor;
		if (onSelect) onSelect(customColor);
		showCustomPicker = false;
	}

	function isGradient(color: string): boolean {
		return color.startsWith('linear-gradient');
	}
</script>

<div class="space-y-4">
	<!-- Solid Colors -->
	<div>
		<h4 class="text-xs font-semibold text-gray-600 mb-2">Solid Colors</h4>
		<div class="flex gap-2 flex-wrap">
			{#each PASTEL_COLORS as color}
				<button
					type="button"
					class="w-8 h-8 rounded-full border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-sm"
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
						<span class="text-white text-xs drop-shadow">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Gradients -->
	<div>
		<h4 class="text-xs font-semibold text-gray-600 mb-2">Gradients</h4>
		<div class="flex gap-2 flex-wrap">
			{#each GRADIENT_COLORS as color}
				<button
					type="button"
					class="w-12 h-8 rounded-lg border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-sm"
					class:ring-2={selectedColor === color.gradient}
					class:ring-offset-2={selectedColor === color.gradient}
					class:ring-gray-600={selectedColor === color.gradient}
					style="background: {color.gradient};"
					title={color.name}
					onclick={() => {
						selectedColor = color.gradient;
						if (onSelect) onSelect(color.gradient);
					}}
				>
					{#if selectedColor === color.gradient}
						<span class="text-white text-xs drop-shadow">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Custom Color Picker -->
	<div>
		<h4 class="text-xs font-semibold text-gray-600 mb-2">Custom</h4>
		{#if showCustomPicker}
			<div class="flex gap-2 items-center">
				<input
					type="color"
					bind:value={customColor}
					class="w-12 h-8 rounded-lg border-2 border-white/60 cursor-pointer"
				/>
				<button
					onclick={handleCustomColorSelect}
					class="px-3 py-1.5 text-xs rounded-lg bg-pastel-mint hover:bg-pastel-mint/80 font-semibold transition"
				>
					Apply
				</button>
				<button
					onclick={() => showCustomPicker = false}
					class="px-3 py-1.5 text-xs rounded-lg bg-pastel-pink hover:bg-pastel-pink/80 font-semibold transition"
				>
					Cancel
				</button>
			</div>
		{:else}
			<button
				onclick={() => showCustomPicker = true}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 hover:bg-white/80 border-2 border-white/60 transition-all hover:scale-105"
			>
				<Pipette size={16} class="text-gray-600" />
				<span class="text-xs font-semibold text-gray-700">Pick Custom Color</span>
			</button>
		{/if}
	</div>
</div>
