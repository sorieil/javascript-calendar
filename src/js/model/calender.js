import BaseModel from './baseModel'

export default class Calender extends BaseModel {
  /**
   * 2019-01 이런식으로 들어와야 한다.
   * @param date
   */
  constructor(date = 'year-month') {
    super()
    this.schemaName = date
  }

  getCalender() {
    this.dataLoad()
    if (this.schema.dayType) {
      return this.schema.dayType
    } else {
      this.setDayType().then(() => {
        return this.getDayType()
      })
    }
  }

  async setCalender(type = 'month') {
    this.schema = Object.assign(this.schema, {
      dayType: type
    })
    return this.save()
  }
}
