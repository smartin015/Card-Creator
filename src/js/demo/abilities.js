var Ability = function(card, risk, successText, successAction, failureText, failureAction) {
	this.card = card;
	this.risk = risk;
	this.success = successAction;
	this.successText = successText;
	this.failureText = failureText;
	this.failure = failureAction; 
}

Ability.prototype.resolve = function(game) {
	if (Math.random() >= this.risk/20.0) {
		game.log(this.successText);
		this.success(game);
		return true;
	} else {
		game.log(this.failureText);
		if (this.failure) {
			this.failure(game);
		}
		return false;
	}
}

var setupAbilities = function() {
	var shockwave = new Ability("shockwave.png", 7, [
				"Bolts of lightning shoot from your fingertips!",
				"The ground crackles underfoot with electricity.",
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"Your fingertips spark, but fizzle out.",
				"You hear a buzzing hum, and then silence.",
			]);
	
	var fireball = new Ability("fireball.png", 9, [
				"From thin air, you gather a ball of searing flame and hurl it at your enemies!",
			], function(game) {
				game.encounter.damage(game, 2);
			},
			[
				"Your hands catch on fire; you burn yourself.",
			], function(game) {
				game.player.damage(game, 1);
			})

	var iceShard = new Ability("iceshard.png", 8, [
				"Shards of ice materialize from a cold vapour and speed towards your target.",
			], function(game) {
				game.encounter.damage(game, 4);
			},
			[
				"You feel a bit frosty, but otherwise nothing happens.",
			]);


	return [shockwave, fireball, iceShard];
};