<template>
<div class="schedule-wrapper">
  <p>Слаг заведения</p>
  <input type="text" v-model="slug" />
  <div class="schedule-wrapper__update-button" @click="onUpdate()">Обновить</div>
  <div class="schedules-list" v-if="SCHEDULES !== null">
    <div class="schedules-list-item"
         v-for="(schedule, index) in SCHEDULES"
         :key="'sc' + index"
    >
      <div class="schedule-header">
        <span v-if="schedule.isMain" class="is-main">Часы работы</span>
        <span v-else class="is-child">{{ schedule.name }}</span>
        <div class="status" :class="{ 'is-main': schedule.isMain, 'opened': status(schedule) }">
          <div class="round"></div>
          {{ statusText(schedule) }}
        </div>
      </div>

    </div>
    

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageSchedule',
  data () {
    return {
      slug: ''
    }
  },
  computed: {
    ...mapGetters(['SCHEDULES'])
  },
  methods: {
    onUpdate () {
      this.$store.dispatch('GET_SCHEDULES', this.slug)
    },
    status (schedule) {                                 // true - opened, false - closed
      // Init
      let now = new Date()
      let startAt = new Date()
      let endAt = new Date()

      // Check current day of week in items
      let nowDow = now.getDay()
      if (nowDow === 0) nowDow = 7

      let item = schedule.items.find(item => item.dayOfWeek == nowDow)
      if (item == undefined) return false

      // Check time range
      let tmpArr = item.startAt.split(':')
      startAt.setHours(parseInt(tmpArr[0]))
      startAt.setMinutes(parseInt(tmpArr[1]))

      tmpArr = item.endAt.split(':')
      endAt.setHours(parseInt(tmpArr[0]))
      endAt.setMinutes(parseInt(tmpArr[1]))

      if (startAt > endAt) endAt.setDate(endAt.getDate() + 1)
      if (now >= startAt && now <= endAt) return true
      else return false
      
    },
    statusText (schedule) {
      let text = ''
      
      if (this.status(schedule)) text = 'открыто'
      else text = 'закрыто'

      return text
    }

  }
}
</script>

<style scoped lang="scss">
.schedule-wrapper {
  margin: 45px 0 0 41px;
  width: 610px;
  max-width: 610px;
  min-height: 100px;
  font-family: 'Rubik', 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  line-height: 17px;
  text-align: left;
  background-color: #fff;
  & > p {
    margin: 0 0 4px 0;
  }
  & > input {
    width: 300px;
    padding: 7px 10px 8px 10px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  &__update-button {
    width: 260px;
    height: 50px;
    box-sizing: border-box;
    text-align: center;
    background-color: #EE514A;
    border-radius: 3px;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
    padding-top: 15px;
    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }
  .schedules-list {
    margin-top: 40px;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: #fff;
    min-height: 100px;
    color: rgba(0, 0, 0, 0.89);
    .schedule-header {
      position: relative;
      .is-main {
        font-size: 18px;
        line-height: 21px;
      }
      .status {
        display: inline-block;
        position: absolute;
        right: 0;
        text-align: right;
        margin-left: 10px;
        color: rgba(0, 0, 0, 0.67);
        .round {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 8px;
          background-color: #737373;
        }
        &.is-main {
          position: relative;
          margin-left: 10px;
          font-size: 18px;
          line-height: 21px;
          &.opened {
            color: #EE514A;
          }
          .round {
            display: none;
          }
        }
        &.opened {
          .round {
            background-color: #EE514A;
          }
        }
      }
    }
  }
}

</style>
