<template>
	<div class="mt-5">
		<ag-charts-vue :options="options"></ag-charts-vue>
	</div>
</template>

<script>
import { cloneDeep } from "lodash";
import { useAuthStore } from "@/stores/auth.js";
export default {
	compnents: {},
	props: ["data", "title"],
	data() {
		return {
			authStore: useAuthStore(),
			options: {
				data: this.data,
				title: {
					text: this.title,
				},
				theme: {
					baseTheme: "ag-default",
					overrides: {
						common: {
							background: {
								fill: "#e5e5e5",
							},
						},
						column: {
							series: {
								highlightStyle: {
									item: {
										fill: "#969FD0",
										stroke: "#969FD0",
										strokeWidth: 2,
									},
									series: {
										dimOpacity: 0.2,
										strokeWidth: 2,
									},
								},
							},
						},
					},
				},
				legend: {
					enabled: false,
				},
				series: [
					{
						// type: 'pie',
						// angleKey: 'Count',
						// calloutLabelKey: 'Model',
						// sectorLabelKey: 'Count',
						// sectorLabel: {
						// 	color: 'white',
						// 	fontWeight: 'bold',
						// },
						fill: ["#004986", "#fff"],
						stroke: "#004986",
						type: "column",
						xKey: "Customer",
						yKey: "Count",
					},
				],
			},
		};
	},
	created() {
		if (this.darkMode) {
			this.applyTheme("ag-default-dark", "#00294E");
		} else {
			this.applyTheme("ag-default", "#D5D8EC");
		}
	},
	watch: {
		darkMode(val) {
			if (val && !this.isLoading) {
				this.applyTheme("ag-default-dark", "#00294E");
			}
			if (!val && !this.isLoading) {
				this.applyTheme("ag-default", "#D5D8EC");
			}
		},
		isLoading(val) {
			if (!val && this.darkMode) {
				this.applyTheme("ag-default-dark", "#00294E");
			}
			if (!val && !this.darkMode) {
				this.applyTheme("ag-default", "#D5D8EC");
			}
		},
	},
	computed: {
		darkMode() {
			return this.authStore.darkModeState;
		},
		isLoading() {
			return this.authStore.loadingState;
		},
	},
	methods: {
		applyTheme(theme, background) {
			const options = cloneDeep(this.options);
			options.theme.baseTheme = theme;
			options.theme.overrides.common.background.fill = background;
			this.options = options;
		},
	},
};
</script>

<style>
.ag-chart-wrapper {
	border-radius: 10px !important;
}
</style>