export default class BaseModel {
  /**
   * schema = {} 로컬에서 불러온 데이터를 플래쉬로 담는 공간
   * schemaName = '' 로컬 스토리지에서 불러올 데이터 키 네임
   */
  constructor() {
    this._schema = {}
    this._schemaName = ''
  }

  set schema(value) {
    this._schema = Object.assign(this.schema, value)
  }
  get schema() {
    return this._schema
  }

  get schemaName() {
    return this._schemaName
  }

  set schemaName(value) {
    this._schemaName = value
  }

  dataLoad() {
    this.schema = JSON.parse(localStorage.getItem(this.schemaName))
  }

  save() {
    localStorage.setItem(this.schemaName, JSON.stringify(this.schema))
  }
}
const calender = {
  '2018-01': {
    month: 1,
    days: {
      1: {
        title: 'title',
        startDate: new Date(),
        endDate: new Date(),
        memo: 'Some memo',
        color: 'red'
      }
    }
  }
}
