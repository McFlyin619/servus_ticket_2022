<template>
	<div class="mt-5 d-flex justify-content-center">
		<ConfirmModal v-if="authError" @close="clearError" :title="'Error'" :message="authError" :page="'error'" :typeOfConfirm="'error'"></ConfirmModal>
		<form class="form-width" @submit.prevent="loginAccount">
			<h5 v-if="valid.email === false || valid.fLName === false || valid.password === false || valid.company === false" class="color-error mb-4 mt-0">Please correct mistakes below</h5>
			<div class="mb-3 txt-main" :class="{ 'mt-5': valid.email !== false && valid.fLName !== false && valid.password !== false && valid.company !== false }">
				<label for="inputEmail1" class="form-label">Email address</label>
				<input
					type="email"
					class="form-control"
					:class="{ 'is-valid': valid.email === true, 'is-invalid': valid.email === false }"
					@keyup="!emailCheck() ? valid.email = false : valid.email = true"
					@blur="email === '' || email === null ? (valid.email = false) : (valid.email = true)"
					id="inputEmail1"
					v-model="email"
					aria-describedby="emailHelp"
				/>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputPassword1" class="form-label">Password</label>
				<input
					type="password"
					class="form-control"
					:class="{ 'is-valid': valid.password === true, 'is-invalid': valid.password === false }"
					@blur="password === '' ? (valid.password = false) : (valid.password = true)"
					id="inputPassword1"
					v-model="password"
				/>
			</div>
			<button v-if="!isSaving && valid.email === true && valid.password === true" type="submit" class="btn bg-main-color text-white">Login</button>
			<button v-else-if="isSaving" class="btn bg-main-color text-white mt-4" type="button" disabled>
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				logging in...
			</button>
		</form>
	</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import ConfirmModal from '../ui/ConfirmModal.vue'
export default {
	components: {
		ConfirmModal
	},
	data() {
		return {
			email: null,
			password: null,
			valid: {
				email: null,
				password: null
			},
			formIsValid: false,
			authStore: useAuthStore(),
			isSaving: false
		}
	},
	computed: {
		authError() {
			return this.authStore.getAuthError
		}
	},
	methods: {
		emailCheck() {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email);
		},
		checkValidity() {
			if (this.valid.email && this.valid.password ) {
				this.formIsValid = true
			} else {
				if (this.email === '' || this.email === null) this.valid.email = false
				if (this.password === '' || this.password === null) this.valid.password = false
				this.formIsValid = false
				this.isSaving = false
			}
		},
		async loginAccount() {
			this.isSaving = true
			this.formErrors = false
			this.checkValidity()
			if (!this.formIsValid) return

			const payload = {
				email: this.email,
				password: this.password,
			}
			try {
				await this.authStore.login(payload)
				if (this.authError)	{
					this.isSaving = false
					return
				}
				setTimeout(() => {
					this.isSaving = false
					this.email = null
					this.password = null
					this.valid.email = null
					this.valid.password = null
					this.$router.push('/')
				}, 1500)
			} catch (err) {
				console.log(err)
			}
		},
		clearError() {
			this.authStore.clearAuthError()
		}
	}
}
</script>

<style scoped>
.form-width {
	width: 50%;
}

@media only screen and (max-width: 780px) {
	.form-width {
		margin: 0 1rem 0 1rem;
		width: 100%;
	}
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	-webkit-box-shadow: 0 0 0 30px var(--background) inset !important;
	-webkit-text-fill-color: var(--txt-on-back);
}

input {
	background-color:var(--background) !important;
	color: var(--txt-on-back) !important;
}

input:focus {
	background-color:var(--background) !important;
	color: var(--txt-on-back) !important;
}

input.is-valid {
	border-color: #004ba0;
}
</style>