
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

Encounter.prototype.damage = function(world, dmg) {
	world.log(this.name + " takes " + dmg + " damage.");
	this.health = Math.max(0, this.health - dmg);
};

Encounter.prototype.attack = function(world) {	
	if (Math.random() > this.risk/20.0) {
		this.hit(world);
	} else {
		this.miss(world);
	}
};

Encounter.prototype.isDead = function() {
	return this.health <= 0;
}

Encounter.prototype.reset = function() {
	this.health = this.max_health;
}

var setupEncounters = function() {
	var bandit = new Encounter("Bandit", "bandit.png", 10, 9, function(world) {
		world.log([
			"A bandit leaps from the shadows, his blade glinting cold steel.",
			"You round the corner and see a bandit with a wicked-looking scar running down her face.",
			"A hooded figure approaches you, looking up to no good.",
		]);
	}, function(world) {
		world.log(["The bandit slices you!"]);
		world.player.damageUpTo(world, 2);
	}, function(world) {
		world.log(["You duck the bandit's blow"]);
	}, function(world) {
		world.log(["The bandit bleeds to death."]);
	});

	return [bandit];
};