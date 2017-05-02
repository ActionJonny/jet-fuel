console.log("working");
console.log($('.logo').text());


$('.current-folder').on('click', function () {
$('.folder-section').show()
  // $('.folders').show("slide", "left" , 1000)
  $('.folder-div').show("slide")
})

$('.folder-section').on('click', '.close', function () {
  $('.folder-section').hide()

})
