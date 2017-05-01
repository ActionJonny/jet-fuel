console.log("working");
console.log($('.logo').text());


$('.current-folder').on('click', function () {
$('.folders').show()
  // $('.folders').show("slide", "left" , 1000)
  $('.folder-div').show("slide")
})

$('.folders').on('click', '.close', function () {
  $('.folders').hide()

})
