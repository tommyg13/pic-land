$(document).ready(function(){
$("#log").click(function(){
  $("#login").show();
  $("#signup").hide();
});

$("#reg").click(function(){
  $("#login").hide();
  $("#signup").show();
});

 $('[data-toggle="tooltip"]').tooltip();   

$("#btn").click(function() {
   
  if($('#span').hasClass('glyphicon-chevron-right')) {
    $("#span").removeClass("glyphicon-chevron-right");
    $("#span").addClass("glyphicon-chevron-down");
  }
  else {
    $("#span").removeClass("glyphicon-chevron-down");
    $("#span").addClass("glyphicon-chevron-right");
  }
});

/**$('.imgInfo').click(function (e) {
        e.preventDefault();
        var link=$(this).attr('href');
        $.ajax({
            url: link,
            data: {},
            processData: false,
            contentType: false,
            type: 'GET',
            success: function(data){
              $("body").val("");
              $("body").html(data);
            }
        });
});
*/

$('.grid').imagesLoaded( function() {
  // images have loaded

$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
});

});
});

 function imgError(image) {
    image.onerror = "";
    image.src = "https://res.cloudinary.com/dlvavuuqe/image/upload/v1492273823/image-not-found_im8zkq.jpg";
    return true;
}

