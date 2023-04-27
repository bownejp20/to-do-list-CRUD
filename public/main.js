const itemsInput = document.querySelector('#items')
const addBtn = document.querySelector('#add')
const showItems = document.querySelector('#list')
const btnClearAll = document.querySelector('#clearAll')
const btnRemove = document.querySelector('#itemRemove')
let taskCountP = document.querySelector('.totalCount')
const task = document.querySelectorAll('.task')
const removeDone = document.querySelectorAll('.strike')
const allListItems = document.querySelectorAll('li')
const hittingEnter = document.querySelector('.hittingEnter')
let count = 0


const countComment = (tasks) => {
  const count = tasks.filter(({ completed }) => !completed).length //destructured tasks.completed, curly braces is the tasks
  if (count === 1) {
    taskCountP.innerText = `There is ${count} thing left to do`
  } else if (count >= 2) {
    taskCountP.innerText = `There are ${count} things left to do`
  } else if (count === 0) {
    taskCountP.innerText = "Tasks all completed"
  }
}



function makeAListItem(e) {
  e.preventDefault()
  if (itemsInput.value.trim() === '') {
    return alert('Do you not know what you need to do?')
  }
  fetch('tasksLeftToDo', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tasksLeft: itemsInput.value,
      completed: false
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(({ tasksLeft: tasks, newTask: { _id, tasksLeft } }) => { // destrcutred data from response object ops[0] from server curly bracket = ops from server
      console.log(_id, tasksLeft)
      const listItem = document.createElement('li')
      const insideListItem = document.createElement('span')
      insideListItem.addEventListener('click', crossOffList)
      insideListItem.dataset.id = _id
      insideListItem.innerText = tasksLeft
      listItem.appendChild(insideListItem)
      showItems.appendChild(listItem)
      itemsInput.value = ''
      countComment(tasks)

      // window.location.reload(true)
    })
}


function crossOffList(e) {
  e.target.classList.toggle('strike')
  fetch('tasksLeftToDo', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      completed: e.target.classList.contains('strike'),
      id: this.dataset.id
    })
  })
    .then(response => {
      if (response.ok) return response.json()

    })
    .then(({ tasksLeft: tasks }) => {
      console.log(tasks, `this is data`)
      countComment(tasks)
      // window.location.reload(true)
    })
}



function clearAll() {
  taskCountP.innerText = "Nothing on the list"
  count = 0
  const clearAllIds = Array.from(document.querySelectorAll('li')).map(({ children }) => children[0].dataset.id); // we destructured li chidren.dataset.id 
  fetch('tasksLeftToDo', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: clearAllIds
    })
  }).then(function (response) {
    document.querySelectorAll('li').forEach(li => li.remove())
    // window.location.reload()
  })
    ;
}


function removeStrike() {
  // removeDone.forEach(li => li.remove())
  console.log('trigger')
  const strikedIds = Array.from(document.querySelectorAll('.strike')).map(({ dataset }) => dataset.id); // we destructured element.dataset.id 
  fetch('tasksLeftToDo', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: strikedIds
    })
  }).then(function (response) {
    countComment(tasks)
    window.location.reload()
  })
    ;
}

Array.from(task).forEach(function (element) {
  element.addEventListener('click', crossOffList);
});

addBtn.addEventListener("click", makeAListItem)
hittingEnter.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('submit')
})

btnClearAll.addEventListener('click', clearAll)
btnRemove.addEventListener('click', removeStrike)

