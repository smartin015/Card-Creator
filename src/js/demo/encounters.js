
var Encounter = function(name, card, health, risk, enter, hit, miss, leave) {
	this.name = name;
	this.card = card;
	this.max_health = health;
	this.health = 0;
	this.enter = enter;
	this.hit = hit;
	this.miss = miss;
	this.leave = leave;
	this.risk = risk;
};

Encounter.prototype.damage = function(game, dmg) {
	game.log(this.name + " takes " + dmg + " damage.");
	this.health = Math.max(0, this.health - dmg);
};

Encounter.prototype.attack = function(game) {	
	if (Math.random() > this.risk/20.0) {
		this.hit(game);
	} else {
		this.miss(game);
	}
};

Encounter.prototype.isDead = function() {
	return this.health <= 0;
}

Encounter.prototype.reset = function() {
	this.health = this.max_health;
}

var setupEncounters = function() {
	var bandit = new Encounter("Bandit", "bandit.png", 10, 9, function(game) {
		game.log([
			"A bandit leaps from the shadows, his blade glinting cold steel.",
			"You round the corner and see a bandit with a wicked-looking scar running down her face.",
			"A hooded figure approaches you, looking up to no good.",
		]);
	}, function(game) {
		game.log(["The bandit slices you!"]);
		game.player.damageUpTo(game, 2);
	}, function(game) {
		game.log(["You duck the bandit's blow"]);
	}, function(game) {
		game.log(["The bandit bleeds to death."]);
	});

	return [bandit];
};