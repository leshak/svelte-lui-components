<script>
	export let model;
</script>

<div>
	<div class="mt-4 whitespace-pre-wrap border bg-gray-100 p-2 font-mono text-[10px]">
		{JSON.stringify(model, null, 2)}
	</div>
</div>
