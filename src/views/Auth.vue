<template>
	<div>
		<div v-if="$route.params.signUp === 'signUp'">
			<sign-up></sign-up>
		</div>
		<div v-else>
			<login-form></login-form>
		</div>
	</div>
</template>

<script>
import SignUp from '@/components/auth/SignUp.vue'
import LoginForm from '@/components/auth/Login.vue'

export default {
	components: {
		SignUp,
		LoginForm
	},
	data() {
		return {
		}
	},
	computed: {
	}

}
</script>