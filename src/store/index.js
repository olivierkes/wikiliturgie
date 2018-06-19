import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
 state: {
  tags: [
   {
    id: 0,
    name: "Accueil"
   }
  ],
  tagGroups: [
   {
    id: 0,
    name: "Temps liturgique",
    tags: [0, 4, 7, 2]
   },
   {
    id: 0,
    name: "Temps liturgique",
    tags: [0, 4, 7, 2]
   }
  ],
  user: null
 },
 mutations: {},
 actions: {},
 getters: {}
});
