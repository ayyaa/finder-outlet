$('#check1').on('change', function(e){
  if(e.target.checked){
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    });
  } else {
    $('#myModal1').modal({
        backdrop: 'static',
        keyboard: false
    }); 
  }
});

  function disable(){
    var id = $('#id').val();
    $.ajax({
      url:'/admin/disable/'+id,
      type:'POST',
      success : function (respon) {
        $('#myModal1').modal('hide')
        $( "#check1" ).prop( "checked", false); 
      }
    })
  }  


  function check(){
    var token = $('#token').val();
    console.log(token);
    $.ajax({
      url:'/admin/check/'+token,
      type:'GET',
      success : function (respon) {
        if(respon === true) {
          $('#submit').attr('disabled' , false);
          $("#p").replaceWith("<p id='p' class= 'mt-2' style='color: green;'><i>true token</i></p>");
        } else {
          $('#submit').attr('disabled' , true);
          $("#p").replaceWith("<p id='p' class= 'mt-2' style='color: red;'><i>wrong token!</i></p>");
        }
      }
    })
  }   


  function enable(){
    var id = $('#id').val();
    $.ajax({
      url:'/admin/enable/'+id,
      type:'POST',
      success : function (respon) {
        $('#myModal').modal('hide')
        $( "#check1" ).prop( "checked", true); 
      }
    })
  }  

  function update(){
    var name= $('#name').val()
    var username= $('#username').val()
    var email= $('#name').val()
    var phone= $('#phone').val()
    $.ajax({
      url:'/admin/update',
      type:'POST',
      data: {
        name: $('#name').val(),
        username: $('#username').val(),
        email: $('#email').val(),
        phone: $('#phone').val()
      },
      success : function (respon) {
        var user = JSON.parse(respon);
        // console.log(data)
        alert('success updateprofile')
        $('#save1').attr('disabled' , true);
        // $('#name').val('dfvdfvsdfvsdv')
      }
    })
  }  


  $(document).ready(function(){
      $('button[name="close1"]').click(function(){
          $( "#check1" ).prop( "checked", false ); 
          $("#p").replaceWith("<p id='p'> </p>")
          $("#token").val('')
      });
  });    


  $(document).ready(function(){
      $('button[name="close2"]').click(function(){
          $( "#check1" ).prop( "checked", true ); 
      });
  });  

$('#nav-basic-info input').on('input',function(e){
  $('#save1').attr('disabled' , false);
});

// $(document).ready(function(){
//   $('#nav-tab a').click(function(e){
//       if($("#save1").is(":enabled")) {
//         confirm('do u want to save the change?')
//       }
//   });
// });  