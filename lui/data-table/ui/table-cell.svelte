<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLTdAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<td
	class={cn(
		'border-r px-2 py-1.5 align-middle last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] cursor-pointer',
		className,
	)}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</td>
