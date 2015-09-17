
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

Player.prototype.enter = function(world) {
	world.log([
		"You slowly come to your senses.",
		"You open your eyes.",
		"You awaken in an unfamiliar place.",
	]);
};

Player.prototype.leave = function(world) {
	world.log([
		"You succumb to your wounds.",
		"Your vision fades to black.",
	]);
}

Player.prototype.damageUpTo = function(world, n) {
	var dmg = randInt(n)+1;
	world.log("You take " + dmg + " damage.");
	this.health = Math.max(0, this.health - dmg);
}

Player.prototype.isDead = function() {
	return this.health <= 0;
};

Player.prototype.playAbility = function() {

}