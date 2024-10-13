<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLThAttributes;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<th
	class={cn(
		'h-6 border-r bg-slate-200  px-2 text-left align-middle text-xs font-medium text-muted-foreground last:border-r-0 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
		className,
	)}
	{...$$restProps}
>
	<slot />
</th>
