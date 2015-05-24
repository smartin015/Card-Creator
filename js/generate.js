Swag.registerHelpers(); // lots of handlebars helpers: https://github.com/elving/swag
// http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
Handlebars.registerHelper("romanize", function(num) {
  if (+num === 0) return 0;
  if (!+num) return false;
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "", i = 3;
  while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
});

var templates = { // will be rendered into UI in this order
  Character: Handlebars.compile($("#character-template").html()),
  Encounter: Handlebars.compile($("#encounter-template").html()),
  Ability: Handlebars.compile($("#ability-template").html()),
  Passive: Handlebars.compile($("#passive-template").html()),
  Equipment: Handlebars.compile($("#equipment-template").html()),
  Loot: Handlebars.compile($("#loot-template").html())
};
backTemplate = Handlebars.compile($("#back-template").html());
var cardCount, fronts, backs, cardData, tabletop; // vars for rendering cards

$(function() {
  Tabletop.init({
    key: '1WvRrQUBRSZS6teOcbnCjAqDr-ubUNIxgiVwWGDcsZYM',
    callback: function(d, t) {
      cardData = d; // save these in case we need them later (ie re-running rendering)
      tabletop = t;
      render();

      for (var key in templates) {
        makeToggleButton(key);
      }

      // We're done loading!
      $("#loading").remove();
      // replace all .svg img tags with actual SVG
      // SVGInjector(document.querySelectorAll('img.svg'), {});
    }, simpleSheet: true
  });
  $("#showAll").click(function() {
    history.replaceState({}, document.title, $.query.set('filter', '').toString());
    render();
  });
});

function render() {
  $(".page").remove(); // clear out any cards from past renders
  cardCount = 0;

  var filter = getURLParam('filter'),
      sheets = tabletop.sheets(),
      sorted = [];

  for (var key in templates) { // if a filter is applied, limit what we show
    if (!filter || key === filter) {
      sorted[sorted.length] = key;
    }
  }
  for (var i = 0, l = sorted.length; i < l; i++) { // sort by type in order listed in var templates
    sorted[i] = sheets[sorted[i]];
  }
  // iterate through and display
  $.each(sorted, function(i, sheet) {
    makeCards(sheet.name, sheet.elements);
  });
}

function makeCards(template, cards) {
  for (var i = 0, l = cards.length; i < l; i++) {
    var card = cards[i];

    // define filters / skips here
    if (card.Comment !== "") { continue; }

    if (cardCount % 6 === 0) { // new page every 6
      fronts = $('<div class="page fronts"></div>');
      backs = $('<div class="page backs"></div>');
      $("body").append(fronts);
      $("body").append(backs);
    }
    for (var property in card) {
      if (card[property] === '-') { card[property] = ''; }
    }
    card.cardType = template;
    fronts.append(templates[template](card));
    backs.append(backTemplate(card));
    cardCount++;
  }
}

function makeToggleButton(title) {
  var b = $("<button>Only " + title + "</button>");
  b.attr('id', 'filter' + title);
  b.click(function(e) {
    history.replaceState({}, document.title, $.query.set('filter', title).toString());
    render();
  });
  $("#toggleButtons").append(b);
}

function getURLParam(name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href) || 0;
  return results[1] || 0;
}