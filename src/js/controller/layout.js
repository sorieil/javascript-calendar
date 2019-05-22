import { parsing } from './common'
import CurrentDate from '../model/currentDate'

export default class Layout {
  constructor(app) {
    this._app = app
    this._elDays = ''
    this._elCurrentDate = ''
    this._domDays = []
    this._currentDateModel = ''
  }

  get app() {
    return this._app
  }

  get elDays() {
    return this._elDays
  }

  set elDays(value) {
    this._elDays = value
  }

  get elCurrentDate() {
    return this._elCurrentDate
  }

  set elCurrentDate(value) {
    this._elCurrentDate = value
  }

  get domDays() {
    return this._domDays
  }

  set domDays(value) {
    this._domDays = value
  }

  get currentDateModel() {
    return this._currentDateModel
  }

  set currentDateModel(value) {
    this._currentDateModel = value
  }

  async init() {
    this.currentDateModel = new CurrentDate()
    await this.currentDateModel.set(new Date())
    console.log(
      'layoutController init:',
      this.currentDateModel.getCurrentDate()
    )
    const result = await this.setup().then(r => {
      this.generateMonthDays()
      this.renderCurrentDate()
    })
    return result
  }

  /**
   * 날짜 엘리먼트를 타게팅한다.
   * @returns {Promise<any>}
   */
  setup() {
    return new Promise(resolve => {
      this.elCurrentDate = parsing(this.app, '__selected-date')
      this.elDays = parsing(this.app, '__days')
      if (typeof this.elDays === 'object') {
        resolve(this.elDays)
      } else {
        // 못찾을 경우 다시 로딩한다.
        this.setup()
      }
    })
  }

  /**
   * 캘린더 날짜를 그려준다.
   */
  generateMonthDays() {
    const buckets = []
    new Promise(resolve => {
      for (let i = 0; i < 42; i++) {
        const htmlDivElement = document.createElement('div')
        htmlDivElement.classList.add('__day')
        htmlDivElement.innerHTML = '<span></span>'
        buckets.push(htmlDivElement)
      }
      resolve(buckets)
    }).then(r => {
      this.domDays = r
      this.elDays.append(...r)
    })
  }

  generateWeekDays() {
    const buckets = []
    new Promise(resolve => {
      for (let i = 0; i < 7; i++) {
        const htmlDivElement = document.createElement('div')
        htmlDivElement.classList.add('__day')
        htmlDivElement.innerHTML = '<span></span>'
        buckets.push(htmlDivElement)
      }
      resolve(buckets)
    }).then(r => {
      this.domDays = r
      this.elDays.append(...r)
    })
  }

  generateOneDays() {
    const buckets = []
    new Promise(resolve => {
      for (let i = 0; i < 1; i++) {
        const htmlDivElement = document.createElement('div')
        htmlDivElement.classList.add('__day')
        htmlDivElement.innerHTML = '<span></span>'
        buckets.push(htmlDivElement)
      }
      resolve(buckets)
    }).then(r => {
      this.domDays = r
      this.elDays.append(...r)
    })
  }

  renderCurrentDate() {
    const currentDate = this.currentDateModel.getCurrentDate()
    const year = currentDate.getFullYear()
    let month = currentDate.getMonth() + 1
    let day = currentDate.getDate()
    month = month > 9 ? month : `0${month}`
    day = day > 9 ? day : `0${day}`
    this.elCurrentDate.innerText = `${year}-${month}-${day}`
  }
}
