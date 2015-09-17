var Ability = function(card, risk, success, failure) {
	this.card = card;
	this.risk = risk;
	this.success = success;
	this.failure = failure;
}

Ability.prototype.resolve = function(enemy, log) {
	if (Math.random() >= this.risk/20.0) {
		this.success(enemy, log);
	} else {
		this.failure(enemy, log);
	}
}

var setupAbilities = function() {
	var shockwave = new Ability("shockwave.png", 12, function(world) {
			world.log([
				"Bolts of lightning shoot from your fingertips!",
				"The ground crackles underfoot with electricity.",
			]);
			world.encounter.damage(world, 3);
		}, function(world) {
			world.log([
				"Your fingertips spark, but fizzle out.",
				"You hear a buzzing hum, and then silence.",
			]);
		});
	

	return [shockwave, shockwave, shockwave];
};