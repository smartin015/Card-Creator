
var Player = function() {
	this.health = 0;
	this.gold = 0;
	this.loot = [];
}

Player.prototype.reset = function() {
	this.health = 10;
	this.gold = 0;
	this.loot = [];
}

Player.prototype.enter = function(game) {
	game.log([
		"You slowly come to your senses.",
		"You open your eyes.",
		"You awaken in an unfamiliar place.",
	]);
};

Player.prototype.leave = function(game) {
	game.log([
		"You succumb to your wounds.",
		"Your vision fades to black.",
	]);
}

Player.prototype.damage = function(game, n) {
	game.log("You take " + n + " damage.");
	this.health = Math.max(0, this.health - n);
}

Player.prototype.damageUpTo = function(game, n) {
	this.damage(game, randInt(n)+1);
}

Player.prototype.isDead = function() {
	return this.health <= 0;
};