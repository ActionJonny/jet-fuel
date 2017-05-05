
const addNewFolder = (title) => {
  console.log(title);
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  })
  .then(response => response.json())
  .then(json => $('.folder-div').append(`<button id=${json.id} class="folder" value="${title}">${title}</button>`))
  .catch(error => console.log(error))
}

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
  console.log(title);
  title && addNewFolder(title)
  $('.new-folder').val('')
})

$('.folder-section').on('click', '.folder', function () {
  $('.folder-section').fadeOut(175)
  addCurrentFolder($(this))

  const folderId = $(this).attr('id')

  $('.links-div').children().remove()

  const result = fetchLinks(folderId)
})

const fetchLinks = (id) => {
  fetch(`/api/v1/folders/${id}/links`)
  .then(response => response.json())
  .then(json => {
    const result = removeDuplicates(json, 'links')
    mapThroughFolderResults(result)
  })
}

const mapThroughFolderResults = (result) => {
  result.map(link => $('.links-div').append(
    `<div id=${link.id} class="links">
    <div class="link-header">
    <a href='/${link.short_url}'><h3>${link.short_url}</h3></a>
    </div>
    <div class="link-body">
    <p>${link.long_url}</p>
    <p>${link.visits}</p>
    <p>${link.created_at}</p>
    </div>
    </div>`
  ))
}

const fetchSortByDate = (category) => {
  const folderId = $('.current').attr('id')
  $('.links-div').children().remove()
  fetch(`/api/v1/folders/${folderId}/links`)
  .then(response => response.json())
  .then(json => {
    const result = removeDuplicates(json, 'links')
    const sorted = result.sort((obj1, obj2) => {
      return obj2[category] - obj1[category]
    })
    mapThroughFolderResults(result)
  })
}

$('.sort-by-pop').on('click', (e) => {
  e.preventDefault()
  fetchSortByDate('visits')
})

$('.sort-by-date').on('click', function(e) {
  e.preventDefault()
  fetchSortByDate('id')
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
  .then(link => $('.links-div').append(
    `<div id=${link.id} class="links">
      <div class="link-header">
        <a href='/${link.short_url}'><h3>${link.short_url}</h3></a>
      </div>
      <div class="link-body">
        <p>${link.long_url}</p>
        <p>${link.visits}</p>
        <p>${link.created_at}</p>
      </div>
    </div>`
  ))
  .catch(error => console.log(error))

  $('.link-input').val('')
})
