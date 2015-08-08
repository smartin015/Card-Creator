// INTRO
$("button.page").click(function() {
  if ($(this).hasClass('disabled')) { return; }

  if ($(this).hasClass('next')) {
    $(this).closest("li.page").hide();
    var next = $(this).closest("li.page").next("li.page");

    if (next.length > 0) {
      next.fadeIn();
    } else {
      $("#pages").remove();
    }

    if ($(this).attr('id') === 'set-party-size') {
      partySize = +$("#party-size").html(); 
    }

  } else if ($(this).hasClass('previous')) {
    $(this).closest("li.page").hide();
    var prev = $(this).closest("li.page").prev("li.page");

    if (prev.length > 0) {
      prev.fadeIn();
    } else {
      $("#pages").remove();
    }
  } else if ($(this).hasClass('exit')) {
    $("#pages").remove();
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
  var duration = Date.now() - roundStarted,
    penaltyTime = Math.max(0, duration-roundSpeed),
    standardTime = (duration - penaltyTime),
    multiplier = 0.5 + 0.5*standardTime/roundSpeed + overtimePenalty*penaltyTime/roundSpeed,
    damage = Math.round(sumOfTiers()*attackSpeed/roundSpeed * multiplier * (1.1-0.2*Math.random()) * (partySize*0.1+0.6));
    // ^^ enemy attack power, accounting for attack speed, multiplier by round time multiplier, with +/- 10% randomness
    // finally, multiplied by party size (4=1, +/- 10%/player)

  timeTillSurge -= ~~(multiplier * roundSpeed);
  if (timeTillSurge < 0) {
    timeTillSurge = surgeSpeed;
    $("#surgeText").html("Tier " + pickRandomTier() + " Surge");
  }
  console.log(duration, penaltyTime, standardTime, timeTillSurge);

  $("#partyDamage").html(damage);
  console.log('Time ellapsed: ' + duration + 'ms. Sum of tiers: ' + sumOfTiers() + ', damage dealt: ' + damage + ' @' + multiplier + 'x');

  $("#overlay").fadeOut();
}

function updateTimer() {
  var timeLeft = ((roundSpeed-(Date.now()-roundStarted))/1000);

  if (difficulty <= 2) { timeLeft = Math.max(0, timeLeft); }

  $("#combatTimerValue").html(timeLeft.toFixed(1).toString());
}