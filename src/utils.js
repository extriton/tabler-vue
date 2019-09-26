const daysAbbr = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const SEC_IN_MINUTE = 60                                        // 60
const SEC_IN_HOUR = 60 * 60                                     // 3 600
const SEC_IN_DAY = 24 * 60 * 60                                 // 86 400

export default {
    
    // Return schedule status: true - open, false - close
    getScheduleStatus (schedule) {
        
        // Create time range Array
        let rangeArr = []
        schedule.items.forEach(item => {
            let tmpArr = []
            let obj = { 
                min: item.dayOfWeek * SEC_IN_DAY, 
                max: item.dayOfWeek * SEC_IN_DAY
            }

            tmpArr = item.startAt.split(':')
            obj.min = obj.min + (parseInt(tmpArr[0]) * SEC_IN_HOUR) + (parseInt(tmpArr[1]) * SEC_IN_MINUTE)

            tmpArr = item.endAt.split(':')
            obj.max = obj.max + (parseInt(tmpArr[0]) * SEC_IN_HOUR) + (parseInt(tmpArr[1]) * SEC_IN_MINUTE + SEC_IN_MINUTE)

            if (obj.min > obj.max) obj.max += SEC_IN_DAY
            
            rangeArr.push(obj)

        })

        // Calculate current time of week in seconds
        let now = new Date()
        let nowDow = now.getDay()
        if (nowDow === 0) nowDow = 7
        let currentTime = (nowDow * SEC_IN_DAY) + (now.getHours() * SEC_IN_HOUR) + (now.getMinutes() * SEC_IN_MINUTE)

        // Check range
        for (let i = 0; i < rangeArr.length; i++)
            if (currentTime >= rangeArr[i].min && currentTime <= rangeArr[i].max)
                return true

        return false

    },

    // Format schedule items array to view array
    formatSchedulesItems (items) {
        
        let tmpArr = daysAbbr.map((item, index) => {
            let fmtItem = {}
            let findItem = items.find(item => item.dayOfWeek == index + 1)
          
            fmtItem.dayIndex = index
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
        
        let result = tmpArr.reduce((prevArr, currentItem) => {

            let findTextTime = prevArr.find(item => item.textTime == currentItem.textTime)
            if (findTextTime === undefined) {
                let obj = {
                    daysArr:  [currentItem.dayIndex],
                    textTime: currentItem.textTime
                }
                prevArr.push(obj)
            } else {
                findTextTime.daysArr.push(currentItem.dayIndex)
            }
            
            return prevArr
        }, [])

        result.forEach(item => {
            
            let shortStr = true
            let tmpStr = ''
            for (let i = 0; i < item.daysArr.length; i++) {
                tmpStr = tmpStr + daysAbbr[item.daysArr[i]]
                if (i < item.daysArr.length - 1) tmpStr = tmpStr + ', '

                if (i > 0 && item.daysArr[i] - item.daysArr[i - 1] > 1) shortStr = false
            }

            if (!shortStr || item.daysArr.length <= 2) {
                item.daysStr = tmpStr
            } else {
                item.daysStr = daysAbbr[item.daysArr[0]] + ' - ' + daysAbbr[item.daysArr[item.daysArr.length - 1]]
            }

        })
      
        return result
    }
}