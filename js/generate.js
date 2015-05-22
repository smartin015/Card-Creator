Handlebars.registerHelper("romanize", function(num) {
  if (!+num) return false; // http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
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
  Item: Handlebars.compile($("#item-template").html())
};
backTemplate = Handlebars.compile($("#back-template").html());

$(function() {
  Tabletop.init({
    key: '1WvRrQUBRSZS6teOcbnCjAqDr-ubUNIxgiVwWGDcsZYM',
    callback: function(data, tabletop) {
      // We're done loading!
      $("#loading").remove();
      // Sort sheets alphabetically
      var sheets = tabletop.sheets(),
          sorted = [];
      for (var key in templates) {
        sorted[sorted.length] = key;
      }
      for (var i = 0, l = sorted.length; i < l; i++) {
        sorted[i] = sheets[sorted[i]];
      }
      // iterate through and display
      $.each(sorted, function(i, sheet) {
        if (templates[sheet.name]) {
          console.log(sheet.name, sheet.column_names);
          makeToggleButton(sheet.name);
          makeCards(sheet.name, sheet.elements);
        }
      });
      if ($.query.get('filter')) { $("#filter" + $.query.get('filter')).click(); }
    }, simpleSheet: true
  });
    
  // replace all .svg img tags with actual SVG
  // SVGInjector(document.querySelectorAll('img.svg'), {});
  $("#showAll").click(function() {
    $(".card").show();
    history.replaceState({}, document.title, "?");
  });
});

function makeCards(template, cards) {
  var fronts, backs, rendered = 0;
  for (var i = 0, l = cards.length; i < l; i++) {
    var card = cards[i];
    if (card.Comment !== "") { continue; }
    if (rendered % 6 === 0) { // new page
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
    rendered++;
  }
}

function makeToggleButton(title) {
  var b = $("<button>Only " + title + "</button>");
  b.attr('id', 'filter' + title);
  b.click(function(e) {
    $(".card").hide();
    $("." + title).show();
    history.replaceState({}, document.title, $.query.set('filter', title).toString());
  });
  $("#toggleButtons").append(b);
}