
const addNewFolder = (title) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  .then(response => response.json())
  .then(json => $('.folder-div').append(`<button id=${json.id} class="folder" value="${title}">${title}</button>`))
}

const appendFolders = (json) => {
  json.map(object => {
    $('.folder-div').append(`<button id=${object.id} class="folder" value="${object.title}">${object.title}</button>`)
  })
}

const removeDuplicates = (json) => {
  const foldersArray = $('.folder-div').children('.folder')
  const folderIds = []
  jQuery.each(foldersArray, (i, folder) => folderIds.push(folder.getAttribute("id")) )
  return json.filter(object => !folderIds.includes(object.id.toString()) )
}

const retrieveAllFolders = () => {
  fetch('/api/v1/folders')
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
  $('.folder-section').fadeIn(175)

})

$('.folder-section').on('click', '.close', function () {
  $('.folder-section').fadeOut(175)
})

$('.folder-section').on('click', '.add-icon', function () {
  const title = $('.new-folder').val()
  title && addNewFolder(title)
  $('.new-folder').val('')
})

$('.folder-section').on('click', '.folder', function () {
  const folder_id = $(this).attr('id')

  $('.folder-section').fadeOut(175)
  fetch(`/api/v1/folders/${folder_id}/links`)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      json.map(link => $('.links').append(`<div id=${link.id}>${link.long_url}</div>`))
    })
})
