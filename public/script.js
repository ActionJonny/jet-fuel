const addNewFolder = (title) => {
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

const fetchLinks = (id) => {
  fetch(`/api/v1/folders/${id}/links`)
  .then(response => response.json())
  .then(json => {
    const result = removeDuplicates(json, 'links')
    mapThroughFolderResults(result)
  })
}

const linkHtml = (link) => {
  const dateCreated = link.created_at
  const shortDate = dateCreated.substring(0,10)
  return (`
    <div id=${link.id} class="links">
      <div class="link-header">
        <h3>Your short url: <a href='/${link.short_url}'>${link.short_url}</a></h3>
      </div>
      <div class="link-body">
        <p>Original url: ${link.long_url}</p>
        <p>Visited: ${link.visits} times</p>
        <p>Date created: ${shortDate}</p>
      </div>
    </div>
  `)
}

const mapThroughFolderResults = (result) => {
  result.map(link => $('.links-div').append(linkHtml(link)))
}

const fetchSortByCategory = (category) => {
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

  const result = fetchLinks(folderId)
})

$('.sort-by-pop').on('click', (e) => {
  e.preventDefault()
  fetchSortByCategory('visits')
})

$('.sort-by-date').on('click', function(e) {
  e.preventDefault()
  fetchSortByCategory('id')
})

$('.submit').on('click', function (e) {
  e.preventDefault()
  const folderId = $('.current').attr('id')
  const longUrl = $('.link-input').val()

  fetch('/api/v1/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ long_url: longUrl, folder_id: folderId })
  })
  .then(response => response.json())
  .then(link => $('.links-div').append(linkHtml(link)))
  .catch(error => console.log(error))

  $('.link-input').val('')
})


$('.link-input').on('keyup', function () {
  $('.current').attr('id') && $('.submit').prop('disabled', false)
})
