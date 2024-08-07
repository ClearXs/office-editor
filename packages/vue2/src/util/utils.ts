/**
 * 判断给定的值是否为空
 * @param value value
 * @returns true or false
 */
export const isEmpty = (value: any): boolean => {
  if (value === undefined || value === null) {
    return true
  }
  if (typeof value === 'string') {
    return <string>value === ''
  }
  if (value instanceof Array) {
    return (<Array<any>>value).length === 0
  }
  if (value instanceof Map) {
    return (<Map<any, any>>value).size === 0
  }
  return true
}

/**
 * 判断给定的值不为空
 * @param value value
 * @returns true or false
 */
export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value)
}
