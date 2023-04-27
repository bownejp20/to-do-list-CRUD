const countComment = (tasks) => {
  const count = tasks.filter(({ completed }) => !completed).length //destructured tasks.completed, curly braces is the tasks
  let message = ''
  if (count === 1) {
    message = `There is ${count} thing left to do`
  } else if (count >= 2) {
    message = `There are ${count} things left to do`
  } else if (count === 0) {
    message = "Tasks all completed"
  }
  return message
}

module.exports = {
  countComment
}
