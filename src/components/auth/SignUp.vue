<template>
	<div class="container mt-5 d-flex justify-content-center">
		<form class="w-50" @submit.prevent="createAccount">
			<div class="mb-3 txt-main">
				<label for="inputEmail1" class="form-label">Email address</label>
				<input type="email" class="form-control" id="inputEmail1" v-model="email" aria-describedby="emailHelp" />
				<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputUserName" class="form-label">Your Name</label>
				<input type="text" class="form-control" id="inputUserName" v-model="userName" />
				<small>The name that will be displayed across the app. Usually your first and last name</small>
			</div>
			<div class="mb-3 txt-main">
				<label for="inputPassword1" class="form-label">Password</label>
				<input type="password" class="form-control" id="inputPassword1" v-model="password" />
			</div>
			<div class="mb-3 txt-main">
				<label for="inputCompanyName" class="form-label">Company Name</label>
				<input type="text" class="form-control" id="inputCompanyName" v-model="company" @input="verifyCompany" />
				<small v-show="duplicateCompany" class="color-error fw-bold">This company already exists. Please contact your ServUs Ticket admin to be added.</small>
			</div>
			<button type="submit" class="btn bg-main-color txt-on-main" :class="{ 'mt-4': !duplicateCompany}">Create Account</button>
		</form>
	</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js'
import { useCompaniesStore } from '@/stores/companies.js'
export default {
	data() {
		return {
			userName: null,
			email: null,
			password: null,
			company: null,
			duplicateCompany: false,
			authStore: useAuthStore(),
			companiesStore: useCompaniesStore()
		}
	},
	created () {
		this.fetchCompanies()
	},
	computed: {
		allCompanies() {
			return this.companiesStore.allCompanies
		}
	},
	methods: {
		fetchCompanies () {
			this.companiesStore.getCompanies()
		},
		verifyCompany () {
			this.duplicateCompany = false
			for (const i in this.allCompanies) {
				if (this.company === this.allCompanies[i].name) this.duplicateCompany = true
			}
		},
		createAccount () {
			const payload ={
				username: this.userName,
				email: this.email,
				password: this.password,
				newCompany: {
					value: true,
					name: this.company
				},
			}
			this.authStore.signUp(payload)
		}
	}
}
</script>
