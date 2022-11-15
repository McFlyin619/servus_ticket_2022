<template>
	<div class="container mt-5 d-flex justify-content-center">
		<form class="w-50" @submit.prevent="createAccount">
			<h4 v-show="formErrors" class="color-error mb-3">Please correct mistakes below</h4>
			<div class="mb-3 txt-main" :class="{ 'mt-5': !formErrors }">
				<label for="inputEmail1" class="form-label">Email address</label>
				<input
					type="email"
					class="form-control"
					:class="{ 'is-valid': valid.email === true, 'is-invalid': valid.email === false }"
					@blur="email === '' || email === null ? (valid.email = false) : (valid.email = true)"
					id="inputEmail1"
					v-model="email"
					aria-describedby="emailHelp"
				/>
				<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputUserName" class="form-label">Your Name</label>
				<input
					type="text"
					class="form-control"
					:class="{ 'is-valid': valid.name === true, 'is-invalid': valid.name === false }"
					@blur="name === '' || name === null ? (valid.name = false) : (valid.name = true)"
					id="inputName"
					v-model="name"
				/>
				<small>The name that will be displayed across the app. Usually your first and last name</small>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputPassword1" class="form-label">Password</label>
				<input
					type="password"
					class="form-control"
					:class="{ 'is-valid': valid.password === true, 'is-invalid': valid.password === false }"
					@blur="password === '' || password === null ? (valid.password = false) : (valid.password = true)"
					id="inputPassword1"
					v-model="password"
				/>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputCompanyName" class="form-label">Company Name</label>
				<input type="text" class="form-control" :class="{ 'is-valid' : !duplicateCompany && duplicateCompany !== null, 'is-invalid' : duplicateCompany || valid.company === false }" id="inputCompanyName" v-model="company" @input="verifyCompany" />
				<small v-show="duplicateCompany" class="color-error fw-bold">This company already exists. Please contact your ServUs Ticket admin to be added.</small>
			</div>
			<button v-if="!isSaving" :disabled="duplicateCompany" type="submit" class="btn bg-main-color txt-on-main" :class="{ 'mt-4': !duplicateCompany }">Create Account</button>
			<button v-else class="btn bg-main-color txt-on-main mt-4" type="button" disabled>
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
				Saving...
			</button>
		</form>
	</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useCompaniesStore } from '@/stores/companies.js'
export default {
	data() {
		return {
			name: null,
			email: null,
			password: null,
			company: null,
			valid: {
				email: null,
				name: null,
				password: null,
				company: null
			},
			formIsValid: false,
			formErrors: false,
			duplicateCompany: null,
			authStore: useAuthStore(),
			companiesStore: useCompaniesStore(),
			isSaving: false
		}
	},
	created() {
		this.fetchCompanies()
	},
	computed: {
		allCompanies() {
			return this.companiesStore.allCompanies
		}
	},
	methods: {
		fetchCompanies() {
			this.companiesStore.getCompanies()
		},
		verifyCompany() {
			this.duplicateCompany = false
			for (const i in this.allCompanies) {
				if (this.company === this.allCompanies[i].name) this.duplicateCompany = true
			}
		},
		checkValidity() {
			if (this.valid.email && this.valid.name && this.valid.password) {
				this.formIsValid = true
			} else {
				if (this.email === '' || this.email === null) this.valid.email = false
				if (this.name === '' || this.name === null) this.valid.name = false
				if (this.password === '' || this.password === null) this.valid.password = false
				if (this.company === '' || this.company === null) this.valid.company = false
				this.formIsValid = false
				this.formErrors = true
				this.isSaving = false
			}
		},
		createAccount() {
			this.isSaving = true
			this.formErrors = false
			this.checkValidity()
			if (!this.formIsValid) return

			const payload = {
				name: this.name,
				email: this.email,
				userName: this.email,
				password: this.password,
				newCompany: {
					value: true,
					name: this.company
				}
			}
			this.authStore.signUp(payload)
			setTimeout(() => {
				this.isSaving = false
				this.email = null
				this.userName = null
				this.password = null
				this.company = null
				this.valid.email = null
				this.valid.userName = null
				this.valid.password = null
				this.valid.company = null
				this.duplicateCompany = null
			}, 1500)
		}
	}
}
</script>
