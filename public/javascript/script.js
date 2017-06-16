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

$('.imgInfo').click(function (e) {
      e.preventDefault();
        var link=$(this).data('url');
$.ajax({
   type: "GET",
   url: link,
   data: {},
   success: function(data){
      like(data[1],data[0].length,data[2]);

   }
 });
});


$(".remove").on("click",function(e) {
  e.preventDefault();
  var id=$(this).attr("data-id");
  var url=$(this).attr("data-url");
  $.ajax({
    type:"Get",
    url:"/remove/"+id,
    success:function(response){
      window.location.href="/profile/"+url;
    }
  });
})
$('.grid').imagesLoaded( function() {
  // images have loaded

$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-item',
});

});
$("#clear").on("click",function(e) {
  e.preventDefault();
 $.ajax({
   type: "GET",
   url: "/clear",
   data: {},
   success: function(data){
   clearNotf(e);
   
   }
 }); 
});

$(document).on("click",".clear",function(e) {
  e.preventDefault();
 $.ajax({
   type: "GET",
   url: "/clear/"+$(".clear").data("id"),
   data: {},
   success: function(dt){
     clearNotf(e);
   }
 }); 
});
});

 function imgError(image) {
    image.onerror = "";
    image.src = "https://res.cloudinary.com/dlvavuuqe/image/upload/v1492273823/image-not-found_im8zkq.jpg";
    return true;
}

function like(id,len,likeClass) {
  
var numberOflikes =len;

  if($("."+id).hasClass("fa-heart-o")) {
    $("."+id).removeClass("fa-heart-o");
    $("."+id).addClass("fa-heart");
    $("#"+id).text("")
    $("#"+id).text(numberOflikes+1)
    $(".fa-thumbs-up").text("")    
    $(".fa-thumbs-up").text(numberOflikes+1)
  }
  else {
    $("."+id).removeClass("fa-heart");
    $("."+id).addClass("fa-heart-o");
    $("#"+id).text("")
    $("#"+id).text(numberOflikes-1)  
        $(".fa-thumbs-up").text("")    
    $(".fa-thumbs-up").text(numberOflikes-1)
  }

}

function clearNotf(e) {
     e.stopPropagation();  
      $(".navbar").load(location.href + " .navbar");
}