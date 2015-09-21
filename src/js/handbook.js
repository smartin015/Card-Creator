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
  var sorted = [];
  $(".cardfront").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    
    // Titles have no "title" column.
    if (id == "Title") { 
      var active = $e.attr('data-active');
      for (var i = 0; i < sheets[id].elements.length; i++) {
        if (sheets[id].elements[i].Active == active) {
          $e.html(renderCardFront(id, sheets[id].elements[i]));
          return;
        }
      }
    } else {
      var title = $e.attr('data-title');
      for (var i = 0; i < sheets[id].elements.length; i++) {
        if (sheets[id].elements[i].Title == title) {
          $e.html(renderCardFront(id, sheets[id].elements[i]));
          return;
        }
      }
    }
  });
  
  $(".cardback").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    var card = sheets[id].elements[5];
    card.Environment = id; //Override Encounter card back
    card.Class = id; //Override ability card back
    $e.html(renderCardBack(id, card));
  });
  
  
  //fronts.append(templates[template](card));
  SVGInjector(document.querySelectorAll('img.svg'), {});

  /*$(".card").click(function() {
    $(this).remove();
  });*/
}