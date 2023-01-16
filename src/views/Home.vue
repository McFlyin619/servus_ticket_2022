<template>
<div class="txt-main">
	<h1>Home</h1>

</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
export default {
	data() {
		return {
			authStore: useAuthStore(),
		}
	},
	created() {
		this.authStore.tryLogin()
	},
}
</script>
