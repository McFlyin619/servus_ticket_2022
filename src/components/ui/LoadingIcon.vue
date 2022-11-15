<template>
	<teleport to="body">
		<div class="backdrop"></div>
		<span class="loader"></span>
	</teleport>
</template>

<style scoped>
.backdrop {
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.85);
	z-index: 100;
}

.loader {
	width: 48px;
	height: 48px;
	display: inline-block;
	position: absolute;
	transform: rotate(45deg);
	z-index: 100;
	left: 50%;
	top: 50%;
}
.loader::before {
	content: '';
	box-sizing: border-box;
	width: 24px;
	height: 24px;
	position: absolute;
	left: 0;
	top: -24px;
	animation: animloader 4s ease infinite;
}
.loader::after {
	content: '';
	box-sizing: border-box;
	position: absolute;
	left: 0;
	top: 0;
	width: 24px;
	height: 24px;
	background: #fff;
	/* box-shadow: 0 0 10px var(--main-color); */
	animation: animloader2 2s ease infinite;
}

@keyframes animloader {
	0% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
	12% {
		box-shadow: 0 24px var(--main-color), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
	25% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
	}
	37% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px rgba(255, 255, 255, 0);
	}
	50% {
		box-shadow: 0 24px var(--main-color), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	62% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px var(--main-color), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	75% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px var(--main-color), 0px 48px var(--main-color);
	}
	87% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px var(--main-color);
	}
	100% {
		box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0),
			0px 48px rgba(255, 255, 255, 0);
	}
}

@keyframes animloader2 {
	0% {
		transform: translate(0, 0) rotateX(0) rotateY(0);
	}
	25% {
		transform: translate(100%, 0) rotateX(0) rotateY(180deg);
	}
	50% {
		transform: translate(100%, 100%) rotateX(-180deg) rotateY(180deg);
	}
	75% {
		transform: translate(0, 100%) rotateX(-180deg) rotateY(360deg);
	}
	100% {
		transform: translate(0, 0) rotateX(0) rotateY(360deg);
	}
}
</style>
