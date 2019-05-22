/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
import Layout from './layout'
import { clickParser, parsing } from './common'
import CurrentDate from '../model/currentDate'
import CommonStatus from '../model/commonStatus'

export default class Calendar {
  constructor(options) {
    this._layoutController = ''
    this._currentDateModel = ''
    this._previous = ''
    this._next = ''
    this._today = ''
    this._modal = ''
    this._modalForm = ''
    this._addSchedule = ''
    this._days = ''
    this._dayType = ''
    this._contents = ''
    this._commonModel = ''

    window.addEventListener('load', event => {
      this._app = document.querySelector(options.el)
      this._userDocument = document
      this._title = options.title || 'No title'
      this.init()
    })
  }

  get app() {
    return this._app
  }

  get userDocument() {
    return this._userDocument
  }

  get title() {
    return this._title
  }

  set title(value) {
    this._title = value
  }

  get layoutController() {
    return this._layoutController
  }

  set layoutController(value) {
    this._layoutController = value
  }

  get previousMonth() {
    return this._previous
  }

  get nextMonth() {
    return this._next
  }

  set today(value) {
    this._today = value
  }

  get today() {
    return this._today
  }

  set modal(value) {
    this._modal = value
  }
  get modal() {
    return this._modal
  }
  set addSchedule(value) {
    this._addSchedule = value
  }
  get addSchedule() {
    return this._addSchedule
  }
  set days(value) {
    this._days = value
  }
  get days() {
    return this._days
  }

  set modalForm(value) {
    this._modalForm = value
  }

  get modalForm() {
    return this._modalForm
  }

  get currentDateModel() {
    return this._currentDateModel
  }

  set currentDateModel(value) {
    this._currentDateModel = value
  }

  get previous() {
    return this._previous
  }

  set previous(value) {
    this._previous = value
  }

  get next() {
    return this._next
  }

  set next(value) {
    this._next = value
  }

  get dayType() {
    return this._dayType
  }

  set dayType(value) {
    this._dayType = value
  }

  get contents() {
    return this._contents
  }

  set contents(value) {
    this._contents = value
  }

  get commonModel() {
    return this._commonModel
  }

  set commonModel(value) {
    this._commonModel = value
  }

  /**
   * 기본적인 레이아웃 그리기/데이터세팅/이벤트 등록
   */
  init() {
    // 캘린더 보기 타입 관련
    this.commonModel = new CommonStatus()
    // 날짜 표현 관련
    this.currentDateModel = new CurrentDate()

    // 버튼 관련
    this.previous = parsing(this.app, '__previous')
    this.next = parsing(this.app, '__next')
    this.today = parsing(this.app, '__today')
    this.dayType = parsing(this.app, '__day-type')

    // 모달 관련
    this.modal = parsing(this.app, 'modal__box')
    this.modal.setAttribute('data-status', 'false')
    this.modalForm = parsing(this.app, '__forms')
    this.addSchedule = parsing(this.app, '__add-schedule')

    // 일(day) 관련
    this.days = parsing(this.app, '__days')

    // 기본 세팅관련 타이틀
    this.userDocument.title = this.title

    //컨테이너 관련 (월별, 일별, 주별)
    this.contents = parsing(this.app, '__contents')

    // 레이아웃 관련
    this.layoutController = new Layout(this.app)
    this.layoutController.init().then(() => {
      this.contentRendering()
      // 다음 버튼
      this.nextMonth.addEventListener('click', e => {
        this.nextButton(e)
      })

      // 이전 버튼
      this.previousMonth.addEventListener('click', e => {
        this.previousButton(e)
      })

      // 오늘 버튼
      this.today.addEventListener('click', e => {
        this.todayButton(e)
      })

      // 모달 관련
      this.modal.addEventListener('click', e => {
        // e.preventDefault()
        const closeModal = clickParser(e.path, ['__close-modal', '__bg'])
        if (closeModal) {
          this.openModalButton()
        }
      })

      // 모달 관련
      this.addSchedule.addEventListener('click', e => {
        e.preventDefault()
        this.openModalButton()
      })

      // 날짜 클릭
      this.days.addEventListener('click', e => {
        const day = clickParser(e.path, ['__day'])
        if (day.dataset.number) {
          console.log('day', day.dataset.number)
          const number = day.dataset.number
          const saveDate = this.currentDateModel
            .getCurrentDate()
            .setDate(parseInt(number, 10))
          this.currentDateModel.set(saveDate).then(() => {
            this.layoutController.renderCurrentDate()
            this.injectDataMonth()
          })
          this.layoutController.renderCurrentDate()
        }
      })
      // 스케쥴 저장
      this.modalForm.addEventListener('submit', e => {
        e.preventDefault()
        // validation check
        console.log('form submit')
      })

      // 캘린더 보기 타입 과련
      const dayType = ['day', 'week', 'month']
      const child = Array.prototype.slice.call(this.dayType.childNodes)
      child
        .filter(v => typeof v.classList === 'object')
        .map((v, index) => {
          if (this.commonModel.getDayType() === dayType[index]) {
            v.classList.add('__active')
          }
          v.setAttribute('data-type', dayType[index])
        })
      // 일별 주별 월별 클릭 할 경우
      this.dayType.addEventListener('click', e => {
        e.preventDefault()
        child.map(v => {
          if (v.classList) {
            v.classList.remove('__active')
          }
        })
        const activeDayType = clickParser(e.path, ['__type'])
        const selectedDayType = activeDayType.dataset.type
        this.commonModel.setDayType(selectedDayType).then(() => {
          activeDayType.classList.add('__active')
          this.contentRendering()
        })
      })
      switch (this.commonModel.getDayType()) {
        case 'month': {
          this.injectDataMonth()
          break
        }
        case 'week': {
          this.injectDataWeek()
          break
        }
        case 'day': {
          this.injectDataDay()
        }
        default: {
          this.injectDataMonth()
        }
      }
    })
  }

  /**
   * 데이터 주입관련
   */
  injectDataMonth() {
    const settingDate = this.currentDateModel.getCurrentDate()
    settingDate.setDate(1)
    const month = settingDate.getMonth() + 1
    const week = settingDate.getDay()
    const lastDate = new Date(settingDate.getTime())
    lastDate.setMonth(month)
    lastDate.setDate(0)
    this.layoutController.domDays.forEach((v, index, array) => {
      if (week <= index && lastDate.getDate() > index - week) {
        const number = index - week + 1
        if (this.currentDateModel.getCurrentDate().getDate() === number) {
          v.classList.add('__today')
        } else {
          v.classList.remove('__today')
        }
        const getWeek = new Date(
          this.currentDateModel.getCurrentDate().getTime()
        )
        getWeek.setDate(number)
        if (getWeek.getDay() === 0) {
          v.classList.add('__sunday')
        } else {
          v.classList.remove('__sunday')
        }

        if (getWeek.getDay() === 6) {
          v.classList.add('__saturday')
        } else {
          v.classList.remove('__saturday')
        }
        v.setAttribute('data-number', number)
        v.innerHTML = `<span>${number}</span>`
      } else {
        v.removeAttribute('data-number')
        v.innerHTML = `<span>${''}</span>`
      }
    })
  }
  injectDataWeek() {
    const settingDate = this.currentDateModel.getCurrentDate()
    settingDate.setDate(1)
    const month = settingDate.getMonth() + 1
    const week = settingDate.getDay()
    const lastDate = new Date(settingDate.getTime())
    lastDate.setMonth(month)
    lastDate.setDate(0)
    this.layoutController.domDays.forEach((v, index, array) => {
      if (week <= index && lastDate.getDate() > index - week) {
        const number = index - week + 1
        if (this.currentDateModel.getCurrentDate().getDate() === number) {
          v.classList.add('__today')
        } else {
          v.classList.remove('__today')
        }
        const getWeek = new Date(
          this.currentDateModel.getCurrentDate().getTime()
        )
        getWeek.setDate(number)
        if (getWeek.getDay() === 0) {
          v.classList.add('__sunday')
        } else {
          v.classList.remove('__sunday')
        }

        if (getWeek.getDay() === 6) {
          v.classList.add('__saturday')
        } else {
          v.classList.remove('__saturday')
        }
        v.setAttribute('data-number', number)
        v.innerHTML = `<span>${number}</span>`
      } else {
        v.removeAttribute('data-number')
        v.innerHTML = `<span>${''}</span>`
      }
    })
  }
  injectDataDay() {
    const settingDate = this.currentDateModel.getCurrentDate()
    settingDate.setDate(1)
    const month = settingDate.getMonth() + 1
    const week = settingDate.getDay()
    const lastDate = new Date(settingDate.getTime())
    lastDate.setMonth(month)
    lastDate.setDate(0)
    this.layoutController.domDays.forEach((v, index, array) => {
      if (week <= index && lastDate.getDate() > index - week) {
        const number = index - week + 1
        if (this.currentDateModel.getCurrentDate().getDate() === number) {
          v.classList.add('__today')
        } else {
          v.classList.remove('__today')
        }
        const getWeek = new Date(
          this.currentDateModel.getCurrentDate().getTime()
        )
        getWeek.setDate(number)
        if (getWeek.getDay() === 0) {
          v.classList.add('__sunday')
        } else {
          v.classList.remove('__sunday')
        }

        if (getWeek.getDay() === 6) {
          v.classList.add('__saturday')
        } else {
          v.classList.remove('__saturday')
        }
        v.setAttribute('data-number', number)
        v.innerHTML = `<span>${number}</span>`
      } else {
        v.removeAttribute('data-number')
        v.innerHTML = `<span>${''}</span>`
      }
    })
  }

  contentRendering() {
    const contentsChild = Array.prototype.slice
      .call(this.contents.childNodes)
      .filter(v => typeof v.classList === 'object')
    console.log('contentsChild:', contentsChild)
    contentsChild.map(v => {
      if (this.commonModel.getDayType() === v.dataset.type) {
        v.classList.add('__active')
      } else {
        v.classList.remove('__active')
      }
    })
  }

  nextButton(e) {
    e.preventDefault()
    let saveDate = ''
    switch (this.commonModel.getDayType()) {
      case 'month': {
        const month = this.currentDateModel.getCurrentDate().getMonth() + 1
        saveDate = this.currentDateModel.getCurrentDate().setMonth(month)
        break
      }
      case 'week': {
        const day = this.currentDateModel.getCurrentDate().getDate() + 6
        saveDate = this.currentDateModel.getCurrentDate().setDate(day)
        break
      }
      case 'day': {
        const day = this.currentDateModel.getCurrentDate().getDate() + 1
        saveDate = this.currentDateModel.getCurrentDate().setDate(day)
        break
      }
      default: {
        const month = this.currentDateModel.getCurrentDate().getMonth() + 1
        saveDate = this.currentDateModel.getCurrentDate().setMonth(month)
      }
    }

    this.currentDateModel.set(saveDate).then(() => {
      this.layoutController.renderCurrentDate()
      this.injectDataMonth()
    })
  }

  previousButton(e) {
    let saveDate = ''
    /*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
    switch (this.commonModel.getDayType()) {
      case 'month': {
        const month = this.currentDateModel.getCurrentDate().getMonth() - 1
        saveDate = this.currentDateModel.getCurrentDate().setMonth(month)
        break
      }
      case 'week': {
        const day = this.currentDateModel.getCurrentDate().getDate() - 6
        saveDate = this.currentDateModel.getCurrentDate().setDate(day)
        break
      }
      case 'day': {
        const day = this.currentDateModel.getCurrentDate().getDate() - 1
        saveDate = this.currentDateModel.getCurrentDate().setDate(day)
        break
      }
      default: {
        const month = this.currentDateModel.getCurrentDate().getMonth() - 1
        saveDate = this.currentDateModel.getCurrentDate().setMonth(month)
      }
    }

    this.currentDateModel.set(saveDate).then(() => {
      this.layoutController.renderCurrentDate()
      this.injectDataMonth()
    })
  }

  todayButton(e) {
    e.preventDefault()
    this.currentDateModel.set().then(() => {
      this.layoutController.renderCurrentDate()
      this.injectDataMonth()
    })
  }

  openModalButton() {
    const modalStatus = this.modal.dataset.status
    if (modalStatus === 'false') {
      this.modal.setAttribute('data-status', 'true')
      this.modal.classList.add('__active')
    } else {
      this.modal.setAttribute('data-status', 'false')
      this.modal.classList.remove('__active')
      Object.keys(this.modalForm).map(v => {
        this.modalForm[v].value = ''
      })
    }
  }
}
