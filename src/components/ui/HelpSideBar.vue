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
			customers
		</div>
		<div v-if="$route.path.includes('jobsites')">
			jobsites
		</div>
		<div v-if="$route.path.includes('services')">
			services
		</div>
	</div>
</template>
<script>
export default {

}
</script>

<style scoped>
.help-main-wrapper {
	background-color: var(--background);
	height: 100%;
	padding: .5rem;
}
</style>