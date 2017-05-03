
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
  json.map(object => {
    $('.folder-div').append(`<div id=${object.id} class="folder">${object.title}</div>`)
  })
}

const removeDuplicates = (json) => {
  const foldersArray = $('.folder-div').children('.folder')
  const folderIds = []

  jQuery.each(foldersArray, (i, folder) => folderIds.push(folder.getAttribute("id")) )
  return json.filter(object => !folderIds.includes(object.id))
}

const retrieveAllFolders = () => {
  fetch('/folders')
  .then(response => response.json())
  .then(json => {
    if (json.length) {
      const result = removeDuplicates(json)
      appendFolders(result)
    }
  })
}


$('.current-folder').on('click', function () {
  retrieveAllFolders()
  $('.folder-section').show()
})

$('.folder-section').on('click', '.close', function () {
  $('.folder-section').hide()
})


$('.folder-section').on('click', '.add-icon', function () {
  const title = $('.new-folder').val()
  title && addNewFolder(title)
  $('.new-folder').val('')
})
