var Ability = function(card, risk, successText, successAction, failureText, failureAction) {
	this.card = card;
	this.risk = risk;
	this.success = successAction;
	this.successText = successText;
	this.failureText = failureText;
	this.failure = failureAction; 
}

Ability.prototype.resolve = function(game, roll) {
	var that = this;

	if (roll >= this.risk) {
		game.UI.setText(this.successText, function() {
			that.success(game);
		});
		return true;
	} else {
		var doFail = null;
		if (this.failure) {
			doFail = function() {
				that.failure(game);
			}
		}
		game.UI.setText(this.failureText, doFail);
		return false;
	}
}

var setupAbilities = function() {
	var shockwave = new Ability("shockwave", 7, [
				"Bolts of lightning shoot from your fingertips!",
				"The ground crackles underfoot with electricity.",
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"Your fingertips spark, but fizzle out.",
				"You hear a buzzing hum, and then silence.",
			]);
	
	var fireball = new Ability("fireball", 9, [
				"You conjure a ball of searing flame and hurl it at the enemy!",
			], function(game) {
				game.encounter.damage(game, 2);
			},
			[
				"Your hands catch on fire; you burn yourself.",
			], function(game) {
				game.player.damage(game, 1);
			})

	var iceshard = new Ability("iceshard", 8, [
				"Shards of ice materialize from a cold vapour and speed towards your target.",
			], function(game) {
				game.encounter.damage(game, 4);
			},
			[
				"You feel a bit frosty, but otherwise nothing happens.",
			]);


	return [shockwave, fireball, iceshard];
};