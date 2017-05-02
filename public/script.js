console.log("working");
console.log($('.logo').text());


$('.current-folder').on('click', function () {
  retrieveAllFolders()
$('.folder-section').show()
  // $('.folders').show("slide", "left" , 1000)
  $('.folder-div').show("slide")

})

$('.folder-section').on('click', '.close', function () {
  $('.folder-section').hide()
})


const addNewFolder = (title) => {
  fetch('/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  .then(response => response.json())
  .then(json => $('.folder-div').append(`<div>${json.title}</div>`))
}

const appendFolders = (json) => {
  json.length && json.map(object => $('.folder-div').append(`<div>${object.title}</div>`))
}

const retrieveAllFolders = () => {

  fetch('/folders')
    .then(response => response.json())
    .then(json => appendFolders(json))
}

$('.folder-section').on('click', '.add-icon', function () {
  const title = $('.new-folder').val()

  addNewFolder(title)

})
