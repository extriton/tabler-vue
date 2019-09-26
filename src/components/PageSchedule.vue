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
      <!-- Schedule header -->
      <div class="schedule-header" :class="{ 'main': schedule.isMain}">
        <span v-if="schedule.isMain">Часы работы</span>
        <span v-else>{{ schedule.name }}</span>
        <div class="status" :class="{ 'opened': status(schedule) }">
          <div class="round"></div>
          {{ statusText(schedule) }}
        </div>
      </div>
      <!-- Schedule items -->
      <div v-for="(item, index) in schedule.formattedItems" :key="'it' + index" class="schedule-item">
        {{ item.index }},
        <div class="item-value">
          {{ item.textTime }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/utils'

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
    status (schedule) {
      return utils.getScheduleStatus(schedule)      
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
    padding: 0 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.89);
    .schedules-list-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      &:last-child {
        border-bottom: none;
      }
      .schedule-header {
        position: relative;
        margin: 10px 0 5px 0;
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
          &.opened {
            .round {
              background-color: #EE514A;
            }
          }
        }
        &.main {
          font-size: 18px;
          line-height: 21px;
          margin-bottom: 14px;
          .status {
            position: relative;
            margin-left: 10px;
            &.opened {
              color: #EE514A;
            }
            .round {
              display: none;
            }
          }
        }
      }
      .schedule-item {
        position: relative;
        color:rgba(0, 0, 0, 0.67);
        margin-bottom: 5px;
        .item-value {
          display: inline-block;
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>