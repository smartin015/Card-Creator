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
    var card = sheets[id].elements[6];
    $e.html(renderCardFront(id, card));
  });
  
  $(".cardoffense").html(renderCardFront("Ability", sheets["Ability"].elements[11]));
  $(".carddefense").html(renderCardFront("Ability", sheets["Ability"].elements[8]));
  $(".cardancillary").html(renderCardFront("Ability", sheets["Ability"].elements[5]));
  
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