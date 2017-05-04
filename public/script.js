
const addNewFolder = (title) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  .then(response => response.json())
  .then(json => console.log(json))
}
// $('.folder-div').append(`<button id=${json.id} class="folder" value="${title}">${title}</button>`)

const appendFolders = (json) => {
  json.map(object => {
    $('.folder-div').append(`<button id=${object.id} class="folder" value="${object.title}">${object.title}</button>`)
  })
}

const removeDuplicates = (json, thing) => {
  const thingArray = $(`.${thing}-div`).children(`.${thing}`)
  const arrayIds = []
  jQuery.each(thingArray, (i, thing) => arrayIds.push(thing.getAttribute("id")) )
  return json.filter(object => !arrayIds.includes(object.id.toString()) )
}

const retrieveAllFolders = () => {
  fetch('/api/v1/folders')
  .then(response => response.json())
  .then(json => {
    if (json.length) {
      const result = removeDuplicates(json, 'folder')
      appendFolders(result)
    }
  })
}

const addCurrentFolder = (folder) => {
  const currentFolder = folder.text()
  const folderId = folder.attr('id')
  $('.current').text(`${currentFolder}`)
  $('.current').attr('id', folderId)
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
  $('.folder-section').fadeOut(175)
  addCurrentFolder($(this))

  const folderId = $(this).attr('id')

  $('.links-div').children().remove()

  fetch(`/api/v1/folders/${folderId}/links`)
    .then(response => response.json())
    .then(json => {
      const result = removeDuplicates(json, 'links')
      console.log(result);
      result.map(link => $('.links-div').append(
             `<div id=${link.id} class="links">
               <div class="link-header">
                 <a href=${link.short_url}><h3>${link.short_url}</h3></a>
               </div>
               <div class="link-body">
                 <p>${link.long_url}</p>
                 <p>${link.visits}</p>
                 <p>${link.created_at}</p>
               </div>
             </div>`
      ))
    })
})

$('.submit').on('click', function (e) {
  e.preventDefault()
  const folderId = $('.current').attr('id')
  const longUrl = $('.link-input').val()
  console.log(longUrl, folderId);

  fetch('/api/v1/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ long_url: longUrl, folder_id: folderId })
  })
  .then(response => response.json())
  .then(json => $('.links-div').append(
    `<div id=${json.id} class="links">${longUrl}</div>
    <div>${json.short_url}</div>`
  ))
  .catch(error => console.log(error))

  $('.link-input').val('')
})
