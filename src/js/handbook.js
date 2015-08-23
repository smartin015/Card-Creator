(function init() {
  Tabletop.init({
    key: '1WvRrQUBRSZS6teOcbnCjAqDr-ubUNIxgiVwWGDcsZYM',
    callback: function(d, t) {
      console.log('sheets loaded');

      cardData = d; // save these in case we need them later (ie re-running rendering)
      tabletop = t;
      sheets = tabletop.sheets();

      // assert load worked
      for (var page in templates) {
        if (!sheets[page]) {
          return alert('Failed to sheet: ' + page);
        }
        if (sheets[page].elements.length <= 1) {
          return alert('No cards loaded for: ' + page);
        }
      }
      render();
    }, simpleSheet: true
  });
})();

function render() {
  console.log(templates);
  
  var sorted = [];
  $(".cardfront").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    console.log(id);
    var card = sheets[id].elements[5];
    
    console.log(card);
    $e.html(renderCardFront(id, sheets[id].elements[5]));
  });
  
  /*
  $(".cardback").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    var card = sheets[id].elements[5];
    $e.html(renderCardBack(templates[id], card));
  });
  */
  
  //fronts.append(templates[template](card));
  SVGInjector(document.querySelectorAll('img.svg'), {});

  /*$(".card").click(function() {
    $(this).remove();
  });*/
}