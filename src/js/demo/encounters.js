
var Encounter = function(card, health, risk, enter, hit, miss, leave) {
	this.card = card;
	this.max_health = health;
	this.health = 0;
	this.enter = enter;
	this.hit = hit;
	this.miss = miss;
	this.leave = leave;
	this.risk = risk;
	this.modifiers = [];
};

Encounter.prototype.damage = function(game, dmg, nextAction) {
	game.UI.setText("The " + this.card + " takes " + dmg + " damage.", nextAction);
	game.UI.shakeEncounter()

	this.health = Math.max(0, this.health - dmg);

	var that = this;
	setTimeout(function() {
		game.UI.writeEncounterHealth(that.health);
	}, 500);
};

Encounter.prototype.attack = function(game) {	
	if (Math.random() > this.risk/20.0) {
		this.hit(game);
	} else {
		this.miss(game);
	}
};

Encounter.prototype.addModifier = function(modifier) {
	this.modifiers.push(modifier);
	game.UI.setText(modifier.enter);
}

Encounter.prototype.resolveModifier = function(game, idx) {
	// Run the specified modifier function.
	// If it completes, remove it from modifier list.
	console.log(game);
	if (!this.modifiers[idx].run(game)) {
		this.modifiers.splice(idx, 1);
	}
}

Encounter.prototype.isDead = function() {
	return this.health <= 0;
}

Encounter.prototype.reset = function() {
	this.health = this.max_health;
}

var setupEncounters = function() {
	var bandit = new Encounter("bandit", 12, 9, function(game) {
		game.UI.setText([
			"A bandit leaps from the shadows, his blade glinting cold steel.",
			"You see a bandit with a wicked-looking scar running down his face.",
			"A hooded figure approaches you, looking up to no good.",
		]);
		game.UI.showEncounter(this);
	}, function(game) {
		game.UI.setText([
			"The bandit slices you!",
			"The bandit strikes you with his sword!"
		], function() {
			game.player.damageUpTo(game, 2);
		});
		game.UI.shakePlayer(500);
	}, function(game) {
		game.UI.setText([
			"The bandit attacks, but you dodge.",
			"You duck the bandit's blow!",
			"You block the bandit's attack just in time!"
		]);
	}, function(game) {
		game.UI.setText(["The bandit whispers \"Buy... our game...\" as he slowly bleeds to death."]);
	});


	var bear = new Encounter("bear", 10, 10, function(game) {
		game.UI.setText([
			"A wild bear emerges from a nearby cave!",
			"An enraged cave bear blocks your path!",
			"A wild bear approaches. It looks hungry..."
		]);
		game.UI.showEncounter(this);
	}, function(game) {
		game.UI.setText([
			"The bear swipes you with its paw!",
			"The bear retaliates with a vicious bite."
		], function() {
			game.player.damageUpTo(game, 2);
		});
		game.UI.shakePlayer(500);
	}, function(game) {
		game.UI.setText([
			"You duck and roll, escaping the bear's reach.",
			"You step back; the bear's jaws clamp on thin air."
		]);
	}, function(game) {
		game.UI.setText(["The bear collapses with a final growl."])
	})

	return [bandit, bear];
};