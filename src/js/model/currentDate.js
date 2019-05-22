import baseModel from './baseModel'

export default class CurrentDate extends baseModel {
  constructor() {
    super()
    this.schemaName = 'currentDate'
  }

  /**
   * 로컬 내용을 다이렉트로 삭제한경우 다시 생성
   * @returns {Date}
   */
  getCurrentDate() {
    this.dataLoad()
    if (this.schema.value) {
      return new Date(this.schema.value)
    } else {
      return this.set().then(() => {
        return this.getCurrentDate()
      })
    }
  }

  async set(value = new Date()) {
    this.schema = {
      value: new Date(value)
    }
    return this.save()
  }
}

// 저장을 하게 되면, schema에 넣어두었던 오브젝트를 로컬 스토리지에 저장을 한다.
