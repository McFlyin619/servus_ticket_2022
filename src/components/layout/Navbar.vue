<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">ServUs Ticket</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="#">Home</a>
					</li>
				</ul>
				<a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Dropdown </a>
				<ul class="dropdown-menu dropdown-menu-end bg-dark">
					<li>
						<a role="button" class="dropdown-item align-self-center text-decoration-none text-white" @click="changeTheme">
							<i v-if="!darkTheme" class="fas fa-sun text-white me-2"></i>
							<i v-else class="fas fa-moon text-white me-2"></i>
							<small>{{ darkTheme ? 'Go Light' : 'Go Dark' }}</small>
						</a>
					</li>
					<li><a class="dropdown-item text-white" href="#">Another action</a></li>
					<li><hr class="dropdown-divider text-white" /></li>
					<li><a class="dropdown-item text-white" href="#">Something else here</a></li>
				</ul>
			</div>
		</div>
	</nav>
</template>
<script>
export default {
	data() {
		return {
			darkTheme: false
		}
	},
	methods: {
		changeTheme() {
			const theme = document.body.getAttribute('data-theme')
			if (theme === 'light') {
				document.body.setAttribute('data-theme', 'dark')
				this.darkTheme = true
			} else {
				document.body.setAttribute('data-theme', 'light')
				this.darkTheme = false
			}
		}
	}
}
</script>

<style scoped>
.dropdown-item:hover {
	background-color: var(--main-color);
	color: #fff;
}
</style>