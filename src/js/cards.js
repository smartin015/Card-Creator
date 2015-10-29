// Insert cards via: (returns rendered HTML)

function renderCardFront (template, card) {
  card = cleanCardData(template, card);
  return templates[template](card);
}


function renderCardBack (template, card) { 
  card = cleanCardData(template, card);
  return backTemplate(card);
}


// Register helpers and partials

Swag.registerHelpers(); // lots of handlebars helpers: https://github.com/elving/swag

Handlebars.registerHelper("romanize", function(num) { // http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
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

for (var key in this.Expedition.partials) {
  Handlebars.registerPartial(key, this.Expedition.partials[key]);
}

// register card templates

var templates = { // will be rendered into UI in this order
  Adventurer: this.Expedition.templates.Adventurer,
  Encounter: this.Expedition.templates.Encounter,
  Ability: this.Expedition.templates.Ability,
  Title: this.Expedition.templates.Title,
  Loot: this.Expedition.templates.Loot,
  Helper: this.Expedition.templates.Helper,
};
var backTemplate = this.Expedition.templates.Back;


// Helper functions

function cleanCardData(template_id, card) {
  card.cardType = template_id;

  if (card.abilitytext) { // bold ability STATEMENTS:
    card.abilitytext = card.abilitytext.replace(/(.*:)/g, boldCapture);
  }

  Object.keys(card).forEach(function(property) {
    if (card[property] === '-') { card[property] = ''; } // remove '-' proprties
    else {
      card[property] = card[property].replace(/(?:\r\n|\r|\n)/g, '<br />'); // turn linebreaks into BR's

      // Replace #ability with the icon image
      card[property] = card[property].replace(/#\w*/mg, function replacer(match) {
        var src = "/img/icon/"+match.substring(1)
        if (card.Threat != undefined) {
          src += "_white";
        }
        return "<img class=\"inline_icon svg\" src=\""+src+".svg\"></img>"
      });
    }
  });

  if (card.Effect) { // put ORs in divs
    card.Effect = card.Effect.replace(/OR<br \/>/g, function (whole, capture, match) {
      return '<div class="or"><span>OR</span></div>';
    });
  }

  return card;
}

function boldCapture (whole, capture, match) {
  return '<strong>' + capture + '</strong>';
}