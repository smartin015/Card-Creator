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
	var shockwave = new Ability("shockwave", 10, [
				"You release a blast of electricity!"
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"You hear a buzzing sound, and then silence."
			]);
	
	var fireball = new Ability("fireball", 11, [
				"You conjure a ball of searing flame and hurl it at the enemy!",
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"Your hands catch on fire; you burn yourself.",
			], function(game) {
				game.player.damage(game, 2);
			})

	var iceshard = new Ability("iceshard", 8, [
				"Shards of ice materialize from a cold vapour and speed towards your target!",
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"You feel a bit frosty, but otherwise nothing happens.",
			]);

	var phantomsword = new Ability("phantomsword", 8, [
				"You shout a hurried incantation...",
			], function(game) {
				game.player.damage(game, -3, function() { game.encounter.addModifier(newPhantomSwordModifier())});
				game.disableAbility(this);
			},
			[
				"You mumble a few syllables; nothing happens."
			]);

	var magicmissile = new Ability("magicmissile", 8, [
				"A many-hued orb of light rockets towards the enemy!",
				"Ptcheww! You fire a magical missile at the enemy.",
			], function(game) {
				game.encounter.damage(game, 3);
			},
			[
				"Your missile was insufficiently magical.",
				"The missile fizzles out."
			]);



	return [shockwave, magicmissile, fireball, phantomsword, iceshard];
};