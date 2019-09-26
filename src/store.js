import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import utils from '@/utils'

Vue.use(Vuex)

const API_URL_SCHEDULES = 'https://tabler.ru/api/v1/places/'

export default new Vuex.Store({
  state: {
    schedules: null
  },
  getters: {
    SCHEDULES: state => {
      return state.schedules
    }
  },
  mutations: {
    SET_SCHEDULES: (state, payload) => {
      payload.forEach(schedule => {
        schedule.formattedItems = utils.formatSchedulesItems(schedule.items)
      })
      state.schedules = payload
    }
  },
  actions: {
    GET_SCHEDULES: async ({ commit }, payload) => {
      if (!payload) {
        commit('SET_SCHEDULES', null)
        return
      }
      let url = `${API_URL_SCHEDULES}${payload}`
      let res = null
      try {
        res = await axios.get(url)
      } catch (e) {
        commit('SET_SCHEDULES', null)
        return
      }

      if (res.data.status !== 'Success') {
        commit('SET_SCHEDULES', null)
        return
      }
      
      commit('SET_SCHEDULES', res.data.data.place.schedules)
    },
  }
})