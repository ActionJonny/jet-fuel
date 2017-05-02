console.log("working");
console.log($('.logo').text());


$('.current-folder').on('click', function () {
  retrieveAllFolders()
  $('.folder-section').show()
  // $('.folders').show("slide", "left" , 1000)
  // $('.folder-div').show("slide")

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
  .then(json => $('.folder-div').append(`<div id=${json.id} class="folder">${json.title}</div>`))
}

const appendFolders = (json) => {
  json.length && json.map(object => {
    $('.folder-div').append(`<div id=${object.id} class="folder">${object.title}</div>`)
  })
}

const retrieveAllFolders = () => {
  const foldersArray = $('.folder-div').find('.folder').attr('id')

  // const folderIds = foldersArray.each(folder => console.log(folder))
  // console.log(folderIds);
  fetch('/folders')
    .then(response => response.json())
    .then(json => appendFolders(json))
}

$('.folder-section').on('click', '.add-icon', function () {
  const title = $('.new-folder').val()
  addNewFolder(title)
  $('.new-folder').val('')
})
