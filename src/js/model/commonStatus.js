import BaseModel from './baseModel'

export default class CommonStatus extends BaseModel {
  constructor() {
    super()
    this.schemaName = 'commonStatus'
  }

  getDayType() {
    this.dataLoad()
    if (this.schema.dayType) {
      return this.schema.dayType
    } else {
      this.setDayType().then(() => {
        return this.getDayType()
      })
    }
  }

  async setDayType(type = 'month') {
    this.schema = Object.assign(this.schema, {
      dayType: type
    })
    return this.save()
  }
}
