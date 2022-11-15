<template>
	<div class="mt-5 d-flex justify-content-center">
		<form class="form-width" @submit.prevent="createAccount">
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
				<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputfLName" class="form-label">Your Name</label>
				<input
					type="text"
					class="form-control"
					:class="{ 'is-valid': valid.fLName === true, 'is-invalid': valid.fLName === false }"
					@blur="fLName === '' || fLName === null ? (valid.fLName = false) : (valid.fLName = true)"
					@keyup="fLName === '' ? (valid.fLName = false) : (valid.fLName = true)"
					id="inputfLName"
					v-model="fLName"
				/>
				<small>The name that will be displayed across the app. Usually your first and last name</small>
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
			<div class="mb-3 txt-main">
				<label for="inputCompanyName" class="form-label">Company Name</label>
				<input
					type="text"
					class="form-control"
					:class="{ 'is-valid': duplicateCompany === false && duplicateCompany !== null && company !== '', 'is-invalid': duplicateCompany === true || valid.company === false }"
					@blur="duplicateCompany === true || company === null || company === '' ? (valid.company = false) : (valid.company = true)"
					@keyup="company !== '' && duplicateCompany === false ? valid.company = true : valid.company = false"
					id="inputCompanyName"
					v-model="company"
					@input="verifyCompany"
				/>
				<small v-show="duplicateCompany" class="color-error">This company already exists. Please contact your ServUs Ticket admin to be added.</small>
			</div>
			<button v-if="!isSaving && valid.email === true && valid.fLName === true && valid.password === true && valid.company === true" :disabled="duplicateCompany" type="submit" class="btn bg-main-color txt-on-main" :class="{ 'mt-4': !duplicateCompany }">Create Account</button>
			<button v-else-if="isSaving" class="btn bg-main-color txt-on-main mt-4" type="button" disabled>
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
			fLName: null,
			email: null,
			password: null,
			company: null,
			valid: {
				email: null,
				fLName: null,
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
		emailCheck() {
			return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email);
		},
		verifyCompany() {
			this.duplicateCompany = false
			for (const i in this.allCompanies) {
				if (this.company === this.allCompanies[i].name) this.duplicateCompany = true
			}
		},
		checkValidity() {
			if (this.valid.email && this.valid.fLName && this.valid.password && this.valid.company) {
				this.formIsValid = true
			} else {
				if (this.email === '' || this.email === null) this.valid.email = false
				if (this.fLName === '' || this.fLName === null) this.valid.fLName = false
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
				fLName: this.fLName,
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
				this.fLName = null
				this.email = null
				this.userName = null
				this.password = null
				this.company = null
				this.valid.fLName = null
				this.valid.email = null
				this.valid.password = null
				this.valid.company = null
				this.duplicateCompany = null
			}, 1500)
		}
	}
}
</script>
