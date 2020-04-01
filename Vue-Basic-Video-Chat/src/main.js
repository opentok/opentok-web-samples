import Vue from "vue";
import Session from "@/components/Session.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(Session)
}).$mount("#app");
