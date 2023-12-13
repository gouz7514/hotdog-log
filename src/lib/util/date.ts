const parseDate = (date: string) => {
  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month =
    dateObj.getMonth() > 8
      ? dateObj.getMonth() + 1
      : `0${dateObj.getMonth() + 1}`
  const day =
    dateObj.getDate() > 9 ? dateObj.getDate() : `0${dateObj.getDate()}`
  return `${year}.${month}.${day}`
}

export default parseDate
