// A demo encounter example. Include:
// - 3 Single-enemy encounters
// - Gold received on kill
// - Player health
// - 5 kinds of Loot
// - 10 abilities (across 2 classes)
// - Merchants/shopping using retrieved gold
// - MUD-style text.

// Playthrough:
// Page Load -> New enemy encounter
// On player action, 


var Game = function() {
	// DOM locations for cards etc.
	this.UI = new UI();

	this.merchantChance = 0.2; // 20% chance of a merchant appearing

	this.encounters = setupEncounters();
	this.encounter = null;

	this.abilities = setupAbilities();
};

Game.prototype.start = function() {
	// Number of turns before we automatically win. this out to play randomly.
	this.autowin_counter = 3;

	// Enter into a new game!
	this.player = new Player();
	this.player.reset();
	this.player.enter(this);
}

Game.prototype.setupEncounter = function() {
	// Encounter steps onto the stage
	this.encounter = choose(this.encounters);
	this.encounter.reset();
	this.encounter.enter(this);

	// Populate useable Abilities
	this.UI.clearAbilities();
	this.drawAbilities(3);
};

Game.prototype.endScreen = function() {
	this.UI.clearAbilities();
	this.endgameButtons.show();
};

Game.prototype.drawAbilities = function(count) {
	var game = this;
	choose(this.abilities, count).forEach(function(ability) {
		game.UI.addAbility(ability, game.handlePlayerAbility);
	});
}

Game.prototype.handlePlayerAbility = function(ability) {
	if (this.autowin_counter-1 == 0) {
		this.autowin(ability);
	} else {
		this.autowin_counter = Math.max(0, this.autowin_counter-1);
		this.resolveTurnRandom(ability);
	}
}

Game.prototype.autowin = function(ability) {
	game.log(ability.successText);
	this.encounter.damage(this, this.encounter.health);
	this.encounter.leave(this);
	this.endScreen();
}

Game.prototype.resolveTurnRandom = function(ability) {
	ability.resolve(this);

	// Setup the next scene if the encounter is dead. Otherwise, fight back!
	if (this.encounter.isDead()) {
		this.encounter.leave(game);
		this.endScreen();
	} else {
		this.encounter.attack(game);
	}

	// If the player dies, reset and setup the next encounter. 
	// No merchants for newly awakened players, since they have 
	// nothing to spend.
	if (this.player.isDead()) {
		this.player.leave(game);
		this.player.reset();
		this.player.enter(game);
		this.setupEncounter();
	}

	this.UI.clearAbilities();
	this.drawAbilities(3);
}

Game.prototype.log = function(val) {
	if (typeof(val) != "string") {
		// If we're passed an array, choose and log a single element.
		this.UI.setText(choose(val));
	} else {
		this.UI.setText(val);
	}
};
