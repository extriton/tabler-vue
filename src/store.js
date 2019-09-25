import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

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
      state.schedules = payload
      let tmp = formatSchedulesItems(state.schedules[0].items)
      console.log(tmp)
      tmp = formatSchedulesItems(state.schedules[1].items)
      console.log(tmp)
      tmp = formatSchedulesItems(state.schedules[2].items)
      console.log(tmp)
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

function formatSchedulesItems (items) {
  const daysAbbr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  
  let tmpArr = daysAbbr.map((item, index) => {
    let fmtItem = {}
    let findItem = items.find(item => item.dayOfWeek == index + 1)
    
    fmtItem.index = index
    if (findItem === undefined) {
      fmtItem.textTime = 'выходной'
    } else {
      if (findItem.startAt == '00:00' && findItem.endAt == '23:59') {
        fmtItem.textTime = 'круглосуточно'
      } else {
        fmtItem.textTime = `${findItem.startAt} - ${findItem.endAt}`
      }
    }
    
    return fmtItem
  })
  /*
  let result = [{ daysList:[], textTime: tmpArr[0].textTime }]
  for (let i = 0; i < tmpArr.length; i++) {
    
    if (result.length === 0) {
      result.push({
        daysList: [i],
        textTime: tmpArr[i].textTime
      })
      continue
    }

    for (let j = 0; j < result.length; j++) {

    }
  
  }
  */
  let result = tmpArr


 return result
}
