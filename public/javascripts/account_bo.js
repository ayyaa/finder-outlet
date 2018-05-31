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
    url:'/business-owner/disable/'+id,
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
    url:'/business-owner/check/'+token,
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
    url:'/business-owner/enable/'+id,
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
    url:'/business-owner/update',
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
      alert('success update your profile')
      $('#save1').attr('disabled' , true);
      // $('#name').val('dfvdfvsdfvsdv')
    }
  })
}  

function updatepw(){
  var newpass = $('#newpass').val()
  var oldpass = $('#oldpass').val()
  var conpass = $('#conpass').val()
  if(newpass === '') {
    alert('password cannot be empty')
  } else if (newpass !== conpass) {
    alert('password must be match')
  } else {  
    $.ajax({
      url:'/business-owner/updatepass',
      type:'POST',
      data: {
        newpass: $('#newpass').val(),
        oldpass: $('#oldpass').val()
      },
      success : function (respon) {
        if(respon === true) {
          alert('Success change your password')
        } else {
          alert('Invalid input password')
        }
      }
    })
  }
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


$(document).ready(function(){
  $('#gridCheck').on('click',function(){
    if ($('#gridCheck').is(':checked')) {
      $('#deactive').attr('disabled' , false);
    } else {
      $('#deactive').attr('disabled' , true);
    }
  });
});  

// $(document).ready(function(){
//   $('#nav-tab a').click(function(e){
//       if($("#save1").is(":enabled")) {
//         confirm('do u want to save the change?')
//       }
//   });
// });  

var check1 = function() {
  if (document.getElementById('newpass').value ==
    document.getElementById('conpass').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'matching';
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'not matching';
  }
}

// $(document).ready(function(){
//   activeTab('nav-basic-info');
// });

$(function () {
  var activeTab = $('[href=' + location.hash + ']');
  activeTab && activeTab.tab('show');
});


// $(document).ready(function(){
//   $('#message').on('DOMSubtreeModified',function(){
//     var msg = $(this).html();
//     if(msg ==='matching') {
//       $('#save2').attr('disabled' , false);
//     }
//   });
// });  

// $("#conpass").blur(function() {
//   var user_pass = $("#newpass").val();
//   var user_pass2 = $("#conpass").val();
//   //var enter = $("#enter").val();

//   if (user_pass.length == 0) {
//     alert("please fill password first");
//     $("#save2").prop('disabled',true)//use prop()
//   } else if (user_pass == user_pass2) {
//     $("#save2").prop('disabled',false)//use prop()
//   } else {
//     $("#save2").prop('disabled',true)//use prop()
//     alert("Your password doesn't same");
//   }

// });
// if($('#message').html().is('matching')) {
//   $('#save2').attr('disabled' , false);
// }