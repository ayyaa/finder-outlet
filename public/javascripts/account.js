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


$(document).ready(function(){
  $("#editname").hide()
  $("#editnamebutton").click(function(){
      $("#editname").toggle();
      $("#editemail").hide();
      $("#editcp").hide()
  });

  $("#editemail").hide()
  $("#editemailbutton").click(function(){
      $("#editemail").toggle();
      $("#editname").hide();
      $("#editcp").hide()
  });

  $("#editcp").hide()
  $("#editcpbutton").click(function(){
      $("#editcp").toggle();
      $("#editemail").hide();
      $("#editname").hide()
  });

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
      url:'/admin/updatepass',
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
  $('button[name="close1"], button[name="close2"]').click(function(){
    $( "#check1" ).prop( "checked", false ); 
    $("#p").replaceWith("<p id='p'> </p>")
    $("#token").val('')
    var id = $('#id').val();
    $.ajax({
      url:'/admin/refresh_sk/'+id,
      type:'POST',
      success : function (respon) {
        window.location.reload(true)
      }
    })
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

$(function(){
  var hash = window.location.hash;
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('#nav-tab a').click(function (e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});

$('#form1').submit(function () {

  // Get the Login Name value and trim it
  var up = $.trim($('#upload_value').val());

  // Check if empty of not
  if (up === '') {
      alert('choose file first');
      return false;
  }
});

// $('#formeditname').submit(function () {

//   // Get the Login Name value and trim it
//   var up = $.trim($('#name').val());

//   // Check if empty of not
//   if (up === '') {
//       alert('choose file first');
//       return false;
//   }
// });

jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-z .'-]+$/i.test(value);
}, "Letters only please"); 

$(document).ready(function(){
  $("#formeditname").validate({ // initialize the plugin
    rules: {
        name: {
          required: true,
          minlength: 3,
          lettersonly: true
        }

    },
    messages: {
      name: {
        required: 'name must be required',
        minlength: 'at least 3 character',
        lettersonly: 'Letters only please'
      }
    },
    submitHandler: function (form) { // for demo
        $('#formeditname').get(0).submit();
    }
  });
});


$(document).ready(function(){

  $("#formeditemail").validate({ // initialize the plugin
    rules: {
        email: {
          required: true,
          email: true
        }

    },
    messages: {
      email: {
        required: 'name must be required',
        email: 'input valid email'
      }
    },
    submitHandler: function (form) {
      $.ajax({
        url: '/admin/checkemail',
        type: 'POST',
        data: $(form).serialize(),
        success: function(response) {
            if(response === true) {
              $('#formeditemail').get(0).submit();
            } else {
              alert('email already exist')
            }
          }            
      }); 
    }
  });
});



$(document).ready(function(){
  $("#formeditcp").validate({ // initialize the plugin
    rules: {
        phone: {
          digits: true
        }

    },
    messages: {
      phone: {
        digits: 'input valid number'
      }
    },
    submitHandler: function (form) { // for demo
        $('#formeditcp').get(0).submit();
    }
  });
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