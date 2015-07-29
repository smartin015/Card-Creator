var selectOptions = {
  Environment: [],
  Threat: [],
  cardType: [],
  Class: [],
};
var filters, filterList, filterCount;
function fetchFilters() {
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);
  filters = {};
  filterList = [];
  while (match = search.exec(query)) {
    var f = decode(match[1]);
    filters[f] = decode(match[2]);
    filterList.push(f);
  }
  filterCount = filterList.length;
}


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
  return ((num < 0) ? '-' : '') + Array(+digits.join("") + 1).join("M") + roman;
});
Handlebars.registerHelper("dots", function(num) {
  for (var i = 0, ret = ''; i < num; i++) {
    ret += '.';
  }
  return ret;
});
Handlebars.registerHelper("target", function(str) {
  if (isNaN(str)) { return str; }
  if (str === "1") { return "1 Target"; }
  else { return str + " Targets"; }
});
Handlebars.registerHelper("dots", function(num) {
  for (var i = 0, ret = ''; i < num; i++) {
    ret += '.';
  }
  return ret;
});
Handlebars.registerPartial("passiveIndicators", $("#passive-indicator-partial").html());
Handlebars.registerPartial("icon", $("#icon-partial").html());
Handlebars.registerPartial("classIcon", $("#class-icon-partial").html());
Handlebars.registerPartial("footer", $("#footer-partial").html());
var templates = { // will be rendered into UI in this order
  Intro: Handlebars.compile($("#intro-template").html()),
  Explorer: Handlebars.compile($("#explorer-template").html()),
  Encounter: Handlebars.compile($("#encounter-template").html()),
  Trap: Handlebars.compile($("#trap-template").html()),
  Modifier: Handlebars.compile($("#modifier-template").html()),
  Ability: Handlebars.compile($("#ability-template").html()),
  Title: Handlebars.compile($("#title-template").html()),
  Equipment: Handlebars.compile($("#equipment-template").html()),
  Loot: Handlebars.compile($("#loot-template").html())
};
backTemplate = Handlebars.compile($("#back-template").html());
var cardCount, fronts, backs, cardData, tabletop; // vars for rendering cards

$(function() {
  Tabletop.init({
    key: '1WvRrQUBRSZS6teOcbnCjAqDr-ubUNIxgiVwWGDcsZYM',
    callback: function(d, t) {
      console.log('done!')
      console.log(d);

      cardData = d; // save these in case we need them later (ie re-running rendering)
      tabletop = t;
      render();

      for (var field in selectOptions) {
        selectOptions[field] = selectOptions[field].sort();
        makeFilter(field, selectOptions[field]);
      }

      // We're done loading!
      $("#loading").remove();
      // replace all .svg img tags with actual SVG
      // SVGInjector(document.querySelectorAll('img.svg'), {});
    }, simpleSheet: true
  });
  $("#resetFilters").click(function() {
    $("#filters select").find("option[value='']").attr('selected', true);
    history.replaceState({}, document.title, '?');
    render();
  });
});

function render() {
  $(".page").remove(); // clear out any cards from past renders
  cardCount = 0;
  fetchFilters();

  var sheets = tabletop.sheets(),
      sorted = [];

  for (var key in templates) {
    sorted[sorted.length] = key;
  }
  for (var i = 0, l = sorted.length; i < l; i++) { // sort by type in order listed in var templates
    sorted[i] = sheets[sorted[i]];
  }

  // iterate through and display, render IMG as SVG when done
  for (var i = 0, l = sorted.length; i < l; i++) {
    var sheet = sorted[i];
    makeCards(sheet.name, sheet.elements);
  }
  SVGInjector(document.querySelectorAll('img.svg'), {});

  /*$(".card").click(function() {
    $(this).remove();
  });*/
}

function makeCards(template, cards) {
  var templateCount = 0;
  for (var i = 0, l = cards.length; i < l; i++) {
    var card = cards[i], filteredOut = false;
    card.cardType = template;

    if (card.Comment !== "") { continue; }
    for (var field in selectOptions) {
      if (card[field] && selectOptions[field].indexOf(card[field]) === -1) {
        selectOptions[field].push(card[field]);
      }
    }

    // define filters / skips here
    for (var j = 0; j < filterCount; j++) {
      if (card[filterList[j]] !== filters[filterList[j]]) { filteredOut = true; continue; }
    }
    if (filteredOut) { continue; }

// SPLIT CARDS 9 TO A PAGE
// Note: comment this if loop out to do 1 per page
    if (cardCount % 9 === 0) {
      fronts = $('<div class="page fronts"></div>');
      backs = $('<div class="page backs"></div>');
      $("body").append(fronts);
      $("body").append(backs);
    }
    for (var property in card) {
      if (card[property] === '-') { card[property] = ''; }
    }
    fronts.append(templates[template](card));
    backs.append(backTemplate(card));
    cardCount++;
    templateCount++;
  }
  console.log(templateCount + " " + template + " cards, " + cardCount + " total");
}

function makeFilter(title, values) {
  var el = $("<select data-filter='" + title + "'></select>");
  el.append("<option value=''>All " + title + "</option>");
  for (var v in values) {
    el.append("<option value='" + values[v] + "'>" + values[v] + "</option>");
  }
  el.change(function(e) {
    var params = {};
    $("#filters select").each(function(i, elem) {
      if ($(this).val() !== '') {
        params[$(this).data('filter')] = $(this).val();
      }
    }).promise().done(function() {
      history.replaceState({}, document.title, '?' + jQuery.param(params));
    })
    render();
  });
  $("#filters").prepend(el);
  if (filters[title]) {
    $("#filters select[data-filter='" + title + "']").find("option[value='" + filters[title] + "']").attr('selected', true);
  }
}