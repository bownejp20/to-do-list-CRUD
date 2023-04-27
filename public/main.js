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

function makeAListItem(e) {
  console.log('trigger')
e.preventDefault()
  if (itemsInput.value.trim() === '') {
    return alert('Do you not know what you need to do?')
  }


  count++
  if (count === 1) {
    taskCountP.innerText = `There is ${count} thing left to do`
  } else if (count >= 2) {
    taskCountP.innerText = `There are ${count} things left to do`
  } else if (count === 0) {
    taskCountP.innerText = "Nothing on the list"
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
    .then(({_id, tasksLeft}) => { // destrcutred data from response object ops[0] from server curly bracket = ops from server
      console.log(_id, tasksLeft)
      const listItem = document.createElement('li')
      const insideListItem = document.createElement('span')
      insideListItem.addEventListener('click', crossOffList)
      insideListItem.dataset.id = _id
      insideListItem.innerText = tasksLeft
      listItem.appendChild(insideListItem)
      showItems.appendChild(listItem)
      itemsInput.value = ''

      // window.location.reload(true)
    })
}



function crossOffList(e) {
  e.target.classList.toggle('strike')
  if (e.target.classList.contains('strike')) {
    count--
  } else {
    count++
  }
  if (count === 1) {
    taskCountP.innerText = `There is ${count} thing left to do`
  } else if (count >= 2) {
    taskCountP.innerText = `There are ${count} things left to do`
  } else if (count === 0) {
    taskCountP.innerText = "Nothing on the list"
  }
  console.log(this)
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
    .then(data => {
      console.log(data, `this is data`)
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

//  Array.from(allListItems).forEach(function (li) {
//     li.addEventListener('click', clearAll) 
//     console.log(li.children[0].dataset.id)
//  });





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

// task.addEventListener('click', crossOffList)
btnClearAll.addEventListener('click', clearAll)
btnRemove.addEventListener('click', removeStrike)





//when you click clear all print out all the id's of the tasks 
//click remove print out all the ids that have strike through, put all in an array need completed 




// skhdfkslakdflkshdfkhsdlkfhlksdhflkshdlkjfhsdfhlksjhfljksdhflkjsdh


// const makeAListItem = (e) => {
//   console.log(makeAListItem)
//   e.preventDefault()

//   function makeAListItem(e) {
//   e.preventDefault()
//   if (itemsInput.value.trim() === '') {
//     return alert('Do you not know what you need to do?')
//   }
//   const listItem = document.createElement('li')
//   listItem.innerText = itemsInput.value

//   showItems.appendChild(listItem)
//   itemsInput.value = ""

//   count++
//   if (count === 1) {
//     taskCountP.innerText = `There is ${count} thing left to do`
//   } else if (count >= 2) {
//     taskCountP.innerText = `There are ${count} things left to do`
//   } else if (count === 0) {
//     taskCountP.innerText = "Nothing on the list"
//   }
// }


//   fetch('tasksLeftToDo', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       task: itemsInput.value,

//     })
//   })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
// }

// const subtractMoney = () => {
//   // e.preventDefault()
//   fetch('transactions/withdrawl', {
//     method: 'post',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       type: 'withdrawl',
//       amount: + (inputAmount.value) * -1,
//       comment: inputComment.value

//     })
//   })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(`data: ${data}`)
//       window.location.reload(true)
//     })
// }


// Array.from(saveBttns).forEach(function (element) {
//   element.addEventListener('click', function () {
//     const comment = this.parentNode.parentNode.childNodes[5].value
//     console.log(this.dataset.id)
//     fetch('transactions', {
//       method: 'put',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         comment: comment,
//         id: this.dataset.id
//       })
//     })
//       .then(response => {
//         if (response.ok) return response.json()
//       })
//       .then(data => {
//         console.log(data, `this is data`)
//         // window.location.reload(true)
//         const comment = this.parentNode.parentNode.childNodes[3]
//         comment.innerText = data.value.comment
//         const floppyDIsk = this.parentNode
//         const pencil = this.parentNode.parentNode.childNodes[7]
//         const editInput = this.parentNode.parentNode.childNodes[5]
//         pencil.classList.remove('hide')
//         comment.classList.remove('hide')
//         floppyDIsk.classList.add('hide')
//         editInput.classList.add('hide')

//       })
//   });
// });

// Array.from(editBttns).forEach(function (element) {
//   element.addEventListener('click', function () {
//     const comment = this.parentNode.parentNode.childNodes[3]
//     const pencil = this.parentNode
//     const floppyDIsk = this.parentNode.parentNode.childNodes[9]
//     const editInput = this.parentNode.parentNode.childNodes[5]
//     pencil.classList.add('hide')
//     comment.classList.add('hide')
//     floppyDIsk.classList.remove('hide')
//     editInput.classList.remove('hide')

//     console.log(this.dataset)

//   });
// });


// Array.from(TrashBttns).forEach(function (element) {
//   element.addEventListener('click', function () {
//     fetch('transactions', {
//       method: 'delete',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         id: this.dataset.id
//       })
//     }).then(function (response) {
//       window.location.reload()
//     })
//   });
// });



// addBtn.addEventListener('click', makeAListItem)
// depositBttn.addEventListener('click', addMoney)


