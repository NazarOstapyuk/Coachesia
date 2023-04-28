(function ($) {

  // TABS
  $(".gcf-opt-tab").click(function () {
    var section = $(this).attr('data-section');
    $(".gcf-opt-tab").removeClass('nav-tab-active');
    $(this).addClass('nav-tab-active');
    $('.gcf-opt-group').addClass('d-none');
    $('#' + section).removeClass('d-none');
  });
  var active_panel = $('.nav-tab-active').attr('data-section');
  $('#' + active_panel).removeClass('d-none');

  // GCF Section
  $('#gcf .gcf-group-label').click(function () {
    var show = $(this).attr('data-show');
    $('#gcf .gcf-group-label').not(this).removeClass('shown');
    $(this).toggleClass('shown');
    $('#gcf .gcf-group-content').hide();
    if ($(this).hasClass('shown')) {
      $('#gcf .gcf-group-content[data-show=' + show + ']').fadeToggle(200);
    }
    // Codemirror editors init
    $('.gcf-group-content[data-show="'+show+'"]:not(:has(.CodeMirror)) .codemirror-textarea').each(function() {
      var editorSettings = wp.codeEditor.defaultSettings;
      editorSettings.codemirror.lint = false;
      wp.codeEditor.initialize($(this), editorSettings);
    });
  });

  // FIELDS Section
  $('#gcf-fields .gcf-group-label').append("<a class='gcf-group-delete'>X</a>");
  $('#gcf-fields .gcf-group-delete').click(function () {
    var input = $(this).closest('.gcf-form-section').find('input[type="hidden"]').first(),
        group = $(this).closest('.gcf-form-section').attr('data-group'),
        fields = input.val().split(","),
        label = $(this).parent('.gcf-group-label'),
        del = label.attr('value');
    c = confirm('Delete field "' + del + '" from ' + group + ' group?');
    if (c) {
      input.val(fields.filter(e => e !== del).join(','));
      $('#gcf-opt-form').find('#submit').attr({ 'action': 'del'}).trigger('click');
    }
  });

  // SETTINGS Section
  $('#gcf-settings .gcf-group-label').append("<a class='gcf-group-delete'>X</a>");
  $('#gcf-settings .gcf-group-delete').click(function () {
    var groups = $('#gcf-setting-groups').val().split(","),
      label = $(this).parent('.gcf-group-label'),
      del = label.attr('value');
    c = confirm('Delete "' + del + '" group?');
    if (c) {
      $('#gcf-setting-groups').val(groups.filter(e => e !== del).join(','));
      $('#gcf-opt-form').find('#submit').attr({ 'action': 'del'}).trigger('click');
    }
  });

  // Submit GCF Form
  $('#gcf-opt-form').submit(async function (e) {
    var form = $(this),
      submit_btn = form.find('#submit'),
      action = submit_btn.attr('action');
    form.find('.sanitize').each(function () {
      var thisval = gcfSanitize($(this).val());
      $(this).val(thisval)
    });
    if (action !== 'del') {
      // Fields
      $('.add-fields').each(function(){
        var input = $(this).closest('.gcf-form-section').find('input[type="hidden"]').first(),
            fields = input.val().split(","),
            add = $(this).val().split(",").map(x => x.trim()).filter(x => x);
        if (add.length) {
          var new_fields = [...new Set(fields.concat(add))];
          input.val(new_fields);
        }
      });
      // Settings groups
      var groups = $('#gcf-setting-groups').val().split(","),
          add = $('#add-groups').val().split(",").map(x => x.trim()).filter(x => x);
      if (add.length) {
        var new_groups = [...new Set(groups.concat(add))];
        $('#gcf-setting-groups').val(new_groups);
      }
    }
  });

  // Functions
  function gcfSanitize(string) {
    string = string.replace(/[^a-z0-9 \,_-]/gim, "_").replace(/^,|,$/g, '');
    string = string.split(",").map(x => x.trim().split(' ').join('_')).join(', ');
    return string.trim();
  }

})(jQuery);

