/**
 * 클릭중 캡처링, 버블에서 원하는 엘리먼트를 가져온다.
 * @param elementPath
 * @param target
 * @returns {*}
 */
export const clickParser = (elementPath = [], target = []) => {
  return elementPath.filter(v => {
    const className = v.className
    if (typeof className === 'string') {
      return target.filter(v => {
        return className.indexOf(v) > -1 ? true : false
      }).length > 0
        ? true
        : false
    } else {
      return false
    }
  })[0]
}
/**
 * 엘리먼트를 파싱한다.
 * @param uniqueClassName
 * @returns {Element}
 */
export const parsing = (app, uniqueClassName) => {
  return app.querySelector(`.${uniqueClassName}`)
}
