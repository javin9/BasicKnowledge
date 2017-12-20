import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

console.log(Vuex);
let store = new Vuex.Store({
  state: {
    count: 16
  },
  getters: {
      filercontent(state) {
    return   state.count>200?200:state.count;
    }
  },
  mutations: {
    add(state) {
      state.count += 1;
    },
    add1(state, num) {
      state.count += num;
    },
    add2(state, obj) {
      state.count += obj.addvalue;
    },
    reduce(state) {
      state.count -= 1;
    }
  },
  actions: {
    addActions(context) {
      setTimeout(() => {
        context.commit("add");
      }, 1000)
    }
  }
});

export default store;
