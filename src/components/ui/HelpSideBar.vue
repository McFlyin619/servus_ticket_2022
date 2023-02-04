<template>
	<div class="help-main-wrapper text-center txt-main">
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
		<div v-if="$route.path.includes('locations')">
			<button class="btn but-main" @click="takeTour('locations')">Take a tour</button>
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
	height: 100%;
	padding: .5rem;
}
</style>