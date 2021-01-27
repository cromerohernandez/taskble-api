function dateToDays (dateInMilliseconds) {
  const dayInMilliseconds = 24 * 60 * 60 * 1000
  return Math.floor(dateInMilliseconds/dayInMilliseconds)
}

module.exports = {
  dateToDays
}