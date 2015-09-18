// Make a playtestable game example. The playtest will include:
// - 10 Single-enemy encounters
// - Gold received on kill
// - Player health
// - 5 kinds of Loot
// - 10 abilities (across 2 classes)
// - Merchants/shopping using retrieved gold
// - MUD-style text.

// Playthrough:
// Page Load -> New enemy encounter
// On player action, 


var World = function() {
	// DOM locations for cards etc.
	this.textLog = $("#textLog");
	this.abilityDiv = $("#abilities");
	this.endgameButtons = $("#endgameButtons");

	this.merchantChance = 0.2; // 20% chance of a merchant appearing

	this.encounters = setupEncounters();
	this.encounter = null;

	this.abilities = setupAbilities();

	// Enter into a new world!
	this.player = new Player();
	this.player.reset();
	this.player.enter(this);
	this.setupEncounter();

	// Number of turns before we automatically win. this out to play randomly.
	this.autowin_counter = 3;
};

World.prototype.setupEncounter = function() {
	// Encounter steps onto the stage
	this.encounter = choose(this.encounters);
	this.encounter.reset();
	this.encounter.enter(this);

	// Populate useable Abilities
	this.drawAbilities();
};

World.prototype.nextScene = function() {
	// Randomly select an event, with entry text.
	// TODO: Add merchant setup here.
	//this.setupEncounter();

	// This will just show a continue button for now.
	this.endgameButtons.show();
};

World.prototype.drawAbilities = function() {
	this.abilityDiv.children().remove();

	var world = this;
	choose(this.abilities, 3).forEach(function(ability) {
		world.abilityDiv.append($("<div>").text(ability.card).click(function() {
			world.handlePlayerAbility(ability);
		}));
	});
}

World.prototype.handlePlayerAbility = function(ability) {
	if (this.autowin_counter-1 == 0) {
		this.autowin(ability);
	} else {
		this.autowin_counter = Math.max(0, this.autowin_counter-1);
		this.resolveTurnRandom(ability);
	}
}

World.prototype.autowin = function(ability) {
	world.log(ability.successText);
	this.encounter.damage(this, this.encounter.health);
	this.encounter.leave(this);
	this.nextScene();
}

World.prototype.resolveTurnRandom = function(ability) {
	ability.resolve(this);

	// Setup the next scene if the encounter is dead. Otherwise, fight back!
	if (this.encounter.isDead()) {
		this.encounter.leave(world);
		this.nextScene();
	} else {
		this.encounter.attack(world);
	}

	// If the player dies, reset and setup the next encounter. 
	// No merchants for newly awakened players, since they have 
	// nothing to spend.
	if (this.player.isDead()) {
		this.player.leave(world);
		this.player.reset();
		this.player.enter(world);
		this.setupEncounter();
	}
}

World.prototype.log = function(val) {
	var line = $("<div>");

	if (typeof(val) != "string") {
		// If we're passed an array, choose and log a single element.
		line.text(choose(val));
	} else {
		line.text(val);
	}

	this.textLog.append(line);
};
