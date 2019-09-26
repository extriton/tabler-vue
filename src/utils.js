const daysAbbr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default {
    
    // Return schedule status: true - open, false - close
    getScheduleStatus (schedule) {
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

    // Format schedule items array to view array
    formatSchedulesItems (items) {
        
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
}