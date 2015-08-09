(function() {
  loadOptions();
  submitHandler();
})();

function submitHandler() {
  var $submitButton = $('#submitButton');
  $submitButton.on('click', function() {
    console.log('Submit');

    // Set the return URL depending on the runtime environment
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
  });
}

// Get query variables
function getQueryParam(variable, defaultValue) {
  // Find all URL parameters
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    // If the query variable parameter is found, decode it to use and return it for use
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

function loadOptions() {
  console.log('load options' + JSON.stringify(localStorage));
  var $darkModeCheckBox = $('#darkModeCheckBox');
  $darkModeCheckBox[0].checked = localStorage.darkMode === 'true';
}

function getAndStoreConfigData() {
  var $darkModeCheckBox = $('#darkModeCheckBox');

  var options = {
    darkMode : $darkModeCheckBox[0].checked
  };

  localStorage.darkMode = options.darkMode;

  console.log('Got options: ' + JSON.stringify(options));
  return options;
}

// extend pebble slate dynamic list with autocomplete for our purposes
(function($) {
    $.extend($.fn, {
      itemDynamicAutocompleteList: function() {
      this.each(function() {
        var $list = $(this);

        $list.children('label').each(function() {
          var $deleteButton = $('<div class="delete-item"></div>');

          $deleteButton.click(function() {
            $(this).parent().remove();
          });

          $(this).append($deleteButton);
        });

        var $addButton = $('<div class="item add-item">Add one more...</div>');

        $list.append($addButton);

        $addButton.click(function() {
          $(this).hide();
          var $inbox = $('<div class="item item-autocomplete">'
                        + '<div class="item-input-wrapper">'
                          + '<input class="item-input" id="autocomplete-0" type="text" name="autocomplete-0" />'
                        + '</div>'
                      + '</div>');

          $inbox.insertBefore($list.children().last());
          $('#autocomplete-0').tinyAutocomplete({
            url: '/stations',
            maxItems: 7,
            showNoResults: true,
            scrollOnFocus: false,
            itemTemplate:'<li class="autocomplete-item">{{id}}: {{name}}</li>',
            onSelect: function(el, val) {
              stopEditing(val.name, $inbox);
              window.scrollTo(0, 0);
            }
          });

          var $input = $inbox.find('input');
          var h = $input.offset().top-10;
          setTimeout(function(){
            window.scrollTo(0, h);
          }, 0);
          $input.focus();

          function stopEditing(input, inbox) {
            $addButton.show();
            inbox.text(input);

            var deletebutton = $('<div class="delete-item"></div>');

            deletebutton.click(function(){
              $(this).parent().remove();
            });

            inbox.append(deletebutton);
          }
        });
      });
    }
    });
  $(function() {
    $('.item-dynamic-autocomplete-list').itemDynamicAutocompleteList();
  });
}(Zepto));
