<template>
	<div class="col">
		<div class="card bg-second mb-3 txt-on-main text-center">
			<div class="card-header">{{ title }}</div>
			<div class="card-body">
				<!-- <h5 class="card-title">Primary card title</h5> -->
				<h1 class="card-text">{{ number }}</h1>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['title', 'number']
}
</script>