
var Encounter = function(card, health, risk, enter, hit, miss, leave) {
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
	game.UI.setText("The " + this.card + " takes " + dmg + " damage.");
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
		game.UI.setText(["The bandit slices you!"], function() {
			game.player.damageUpTo(game, 2);
		});
		game.UI.shakePlayer(500);
	}, function(game) {
		game.UI.setText([
			"The bandit attacks, but you dodge.",
			"You duck the bandit's blow!",
			"You block the bandit's attack just in time."]);
	}, function(game) {
		game.UI.setText(["As the bandit bleeds to death, he whispers: \"Buy... our game...\""]);
	});

	return [bandit];
};