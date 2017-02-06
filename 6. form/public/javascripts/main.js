$(function() {
  var submitBtn = $('.submit');
  var form = $('.order');

  submitBtn.on('click', function() {
    $.post('order', form.serialize()).then(function(){}, function(res) {
      $.each(res.responseJSON, function(key, val){
        var el = $('[name='+ key + ']');
        var errorMsg = val[0];

        el.parents('.form-group').addClass('has-danger').find('.form-control-feedback').text(errorMsg);
      });
    });
  });

  $('input').on('focus', function(e) {
    $(e.target).parents('.form-group').removeClass('has-danger').find('.form-control-feedback').text('');
  });
});