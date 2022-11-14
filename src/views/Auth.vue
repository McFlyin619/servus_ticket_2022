<template>
	<div>
		<div v-if="$route.params.signUp === 'signUp'">
			<sign-up></sign-up>
		</div>
		<div v-else>
			login
		</div>
	</div>
</template>

<script>
import SignUp from '@/components/auth/SignUp.vue'

export default {
	components: {
		SignUp
	},
	data() {
		return {
		}
	},
	computed: {
	}

}
</script>