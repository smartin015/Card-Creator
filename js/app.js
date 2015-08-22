/*
TODO:

battle screen defaults to showing "begin battle" button instead of party damage
^^ more generically, might be worth it to have as two different classes or something
  - enables entirely unique styles, ie tap to start as a button & hiding "last:"
  - plus, would be the same across all ways of getting to "start encounter" screen
end battle button that shows modal with "suggested loot and gold" -> closing modal sets party damage = '' and surge text = 'Tap to start encounter'
- total battle time (aka from when you first clicked "begin round"), avg time per round, party damage taken





indicator for party size button when you hit the min / max - a toast that says "max party size" or something

on "mamaging enemies" page, include screenshot of enemy bar

combat rounds -> split into multiple pages, each page should be one interaction with app

also need to add a page for when players are supposed to use abilities / take damage

surge into two steps: 1) here's what it looks like in the app, 2) here's how to resolve it on a card, including images

on "Your First Encounter", include image of a tier 1 enemy card back?

in tutorial mode combat, start with helpers pointing out "don't forget to update your enemy count", then "tap here to start combat", then "tap here to end the round", then "resolve damage", etc

thought: even after first round (while in tutorial), fade in helpers if they stay on a stage for too long




change ALL parts of the app to be page-based, including the battle screen?

add progress indicator based on position in .tutorial list ( do "3 out of 10" or "3 / 10")

flash combat screen when overtime (at all difficulties)

when there's a surge, you must tap through the surge BEFORE you see team damage

"end of combat" button? handy to reset everything, plus also a good way to finish the tutorial
^^ adds pacing to the app, ie starting & ending combat
^^ also good opportunity for post-combat stats

longer term goal: having entire rule set / setup flow in app, so that players technically don't even need to read rules...

*/



// INTRO
var pageSelector = ''; // used to select which pages they'll be going through

$("button.page").click(function() {
  if ($(this).hasClass('disabled')) { return; }

  if ($(this).data('pages')) { // update the page selector
    var selectors = $(this).data('pages').split(' ');
    pageSelector = '';
    for (var i = 0, l = selectors.length; i < l; i++) {
      pageSelector += 'li.page' + selectors[i] + ',';
    }
    pageSelector = pageSelector.slice(0, -1);
  }

  switch($(this).attr('id')) {
    case 'start-tutorial':
      setDifficulty(1);
    break;
  }

  var page = $(this).closest("li.page");
  var nextPages = page.nextAll(pageSelector);
  var prevPages = page.prevAll(pageSelector);
  page.hide();

  if ($(this).hasClass('next')) {
    if (nextPages.length > 0) {
      $(nextPages[0]).fadeIn();
    } else {
      $("#pages").remove();
    }
    if ($(this).attr('id') === 'set-party-size') {
      partySize = +$("#party-size").html(); 
    }

  } else if ($(this).hasClass('previous')) {
    if (prevPages.length > 0) {
      $(prevPages[0]).fadeIn();
    } else {
      $("#pages").remove();
    }
  }
});

$("button.difficulty").click(function() {
  setDifficulty($(this).data('difficulty'));
  $("button.difficulty").removeClass("selected");
  $(this).addClass("selected");
  $(this).closest(".page").find(".next").removeClass("disabled");
});

$(".party-size-button").click(function() {
  var current = +$("#party-size").html();
  if ($(this).hasClass('increase')) { current = Math.min(6, current+1); }
  else { current = Math.max(2, current-1); }
  $("#party-size").html(current);
});

function setDifficulty(input) {
  difficulty = +input;
  switch (difficulty) {
    case 1: // tutorial
      roundSpeed = 60000;
      attackSpeed = 1.5 * roundSpeed;
      surgeSpeed = 3 * roundSpeed;
      overtimePenalty = 0;
    break;
    case 2: // easy
      roundSpeed = 20000;
      attackSpeed = 1.2 * roundSpeed;
      surgeSpeed = 3 * roundSpeed;
      overtimePenalty = 1;
    break;
    case 3: // normal
      roundSpeed = 15000;
      attackSpeed = 1 * roundSpeed;
      surgeSpeed = 2.5 * roundSpeed;
      overtimePenalty = 1.2;
    break;
    case 4: // hard
      roundSpeed = 10000;
      attackSpeed = 1 * roundSpeed;
      surgeSpeed = 2 * roundSpeed;
      overtimePenalty = 1.5;
    break;
    case 5: // impossible
      roundSpeed = 7000;
      attackSpeed = 1 * roundSpeed;
      surgeSpeed = 2 * roundSpeed;
      overtimePenalty = 1.8;
    break; 
  }

  timeTillSurge = surgeSpeed * Math.max(0.5, Math.random());
}


// SETTINGS & STATE
var difficulty; // scale of 1-5
var roundSpeed; // max combat round length before party starts taking penalties
var overtimePenalty; // multiplier for damage if round runs over
var attackSpeed; // ms between one enemy's attacks; tweaks tier damage output
var surgeSpeed; // ms between global enemy surges; tweaks how often surges happen
var partySize; // party size is an additional multiplier to damage
var partyDamage = 0; // amount of damage shown
var roundStarted; // Date.now() of when current round started
var timeTillSurge; // ms till next surge happens

var audio = { // sounds from Soundbible and https://www.sounddogs.com/results.asp?Type=1&CategoryID=1024&SubcategoryID=62
  reset: [
    'audio/reset-1.mp3'
  ],
  damage: [
    'audio/damage-0.mp3',
    'audio/damage-1.mp3',
    'audio/damage-2.mp3',
    'audio/damage-3.mp3'
  ]
};

// HANDLEBARS
var enemy = Handlebars.compile($("#enemy-template").html());
function romanize(num) { // http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
  if (!+num) return false;
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

// INIT ENEMIES
var tiers = 5,
    enemies = [0]; // tier "0" always blank
for (var i = 1; i <= tiers; i++) {
  enemies.push(0);
  $("#enemies").append(enemy({
    tier: i,
    romanTier: romanize(i)
  }));
}

function addEnemy(tier) {
  enemies[tier]++;
  $(".enemy[data-tier=" + tier +"]").find(".count").html(enemies[tier]);
}

function removeEnemy(tier) {
  enemies[tier] = Math.max(0, enemies[tier]-1);
  $(".enemy[data-tier=" + tier +"]").find(".count").html(enemies[tier]);
}

$(".control").click(function() {
  var tier = +$(this).closest('.enemy').data('tier');
  if ($(this).hasClass("plus")) { addEnemy(tier); }
  else { removeEnemy(tier); }
});

function sumOfTiers() {
  var ret = 0;
  for (var i = 1; i <= tiers; i++) {
    ret += i*enemies[i];
  }
  return ret;
}

function pickRandomTier() {
  var sum = sumOfTiers();
  var counter = Math.round(Math.random() * sum);
  for (var i = 1; i <= tiers; i++) {
    counter -= i*enemies[i];
    if (counter <= 0) {
      return i;
    }
  }
}

// INIT ROUNDS
$("#party").click(startRound);
$("#overlay").click(endRound);

function startRound() {
  $("#partyDamage").html(0);
  $("#surgeText").html("");
  $("#overlay").fadeIn();
  roundStarted = Date.now();
  roundTimer = setInterval(updateTimer, 25);
}

function endRound() {
  clearInterval(updateTimer);
  var duration = Date.now() - roundStarted;
  var penaltyTime = Math.max(0, duration-roundSpeed);
  var standardTime = (duration - penaltyTime);
  var multiplier = 0.5 + 0.5*standardTime/roundSpeed + overtimePenalty*penaltyTime/roundSpeed;
  var damage = Math.round(sumOfTiers()*attackSpeed/roundSpeed * multiplier * (1.2-0.4*Math.random()) * (partySize*0.1+0.6));
    // ^^ enemy attack power, accounting for attack speed, multiplier by round time multiplier, with +/- 20% randomness
    // finally, multiplied by party size (4=1, +/- 10%/player)

  timeTillSurge -= ~~(multiplier * roundSpeed);
  if (timeTillSurge < 0) {
    timeTillSurge = surgeSpeed;
    var tier = pickRandomTier();
    $("#surgeText").html("<h2>Tier " + tier + " Surge</h2><p>Play the surge effect on all non-stunned Tier " + tier + " enemies.</p>");
  }

  $("#timeEllapsed").html(formatTime(duration));
  $("#partyDamage").html(damage);
  console.log('Time ellapsed: ' + duration + 'ms. Sum of tiers: ' + sumOfTiers() + ', damage dealt: ' + damage + ' @' + multiplier + 'x');

  $("#overlay").fadeOut();
}

function updateTimer() {
  var timeLeft = (roundSpeed-(Date.now()-roundStarted));

  if (difficulty <= 2) { timeLeft = Math.max(0, timeLeft); }

  $("#combatTimerValue").html(formatTime(timeLeft));
}

// formats milliseconds into seconds, with trailing 0
function formatTime(t) {
  return (t/1000).toFixed(1).toString();
}