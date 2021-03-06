import Vue from 'vue';
import App from './App.vue';

// Import Plugins
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/es5/util/colors';

// Load Plugins
Vue.use(Vuetify, {
	theme: {
		primary: colors.cyan.base,
		secondary: colors.blueGrey.base,
		accent: colors.deepOrange.base,
		error: colors.red.base,
		warning: colors.amber.base,
		info: colors.lightBlue.base,
		success: colors.green.base,
	},
});

// Import Vuex Store
import store from './store/index';

store.subscribe((mutation: any, state: any) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});

Vue.config.productionTip = false;

new Vue({
	store,
	render: (h) => h(App),
	beforeCreate() {
		this.$store.commit('initialiseStore');
		require('./Apps');
	},
}).$mount('#app');
