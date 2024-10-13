<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLThAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<th
	class={cn(
		'h-8 border-r last:border-r-0 bg-slate-100 px-2 text-left align-middle font-medium text-slate-600 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
		className,
	)}
	{...$$restProps}
>
	<slot />
</th>
