<template>
	<div class="help-main-wrapper text-center txt-main">
		<h1>Help/Info</h1>
		<div v-if="$route.path.includes('signUp')">
			signup
		</div>
		<div v-if="$route.path.includes('login')">
			login
		</div>
		<div v-if="$route.path.includes('dashboard')">
			dashboard
		</div>
		<div v-if="$route.path.includes('customers')">
			<button class="btn but-main" @click="takeTour('customers')">Take a tour</button>
		</div>
		<div v-if="$route.path.includes('jobsites')">
			<button class="btn but-main" @click="takeTour('jobsites')">Take a tour</button>
		</div>
		<div v-if="$route.path.includes('services')">
			services
		</div>
	</div>
</template>
<script>
export default {
	emits: ['takeTour'],
	methods: {
		takeTour(page) {
			this.$emit('takeTour', page)
		}
	}
}
</script>

<style scoped>
.help-main-wrapper {
	background-color: var(--background);
	height: 100%;
	padding: .5rem;
	border: 1px solid var(--color-lt-grey);
	border-radius:10px;
}
</style>