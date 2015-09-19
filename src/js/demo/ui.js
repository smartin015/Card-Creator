

var UI = function() {
	this.speed = 500;

	this.textLog = $("#textLog");
	//this.textNext = $("#textNext");
	this.abilityDiv = $("#abilities");
	this.encounterDiv = $("#encounter");
	this.endgameButtons = $("#endgameButtons");
	this.encounterHealth = $("#healthCounter");
	this.helpText = $("#helpText");

	this.defaultTextNextAction = null;
	this.nextAction = null;

	this.helpTimeout = null;
	this.helpTimeoutMillis = 3000;

	var that = this;

	var userInput = function() {
		clearTimeout(that.helpTimeout);
		that.helpTimeout = null;
		if (that.nextAction) { //Any key
			that.nextAction();
			that.nextAction = null;
		} else {
			console.log("No default action");
		}
	}

	$(window).keydown(userInput);
	$(window).click(userInput);
};

UI.prototype.fadeOut = function($elem, cb) {
	if ($elem.hasClass("transparent")) {
		cb();
		return;
	}
	console.log("fadeOut");
	$elem.addClass("transparent");
	$elem.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {cb});
}

UI.prototype.fadeIn = function($elem, cb) {
	if (!$elem.hasClass("transparent")) {
		cb();
		return;
	}
	console.log("fadeIn");
	$elem.removeClass("transparent");
	$elem.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {cb});
}

UI.prototype.setText = function(textOrList, nextAction, speedMultiplier, helpText) {
	var that = this;

	var text = (typeof(textOrList) == "string") ? textOrList : choose(textOrList);

	if (!nextAction) {
		nextAction = this.defaultTextNextAction;
	}

	if (!helpText) {
		helpText = "Click or press any key to continue...";
	}

	var speed = this.speed;
	if (speedMultiplier) {
		speed *= speedMultiplier;
	}

	var fadeIn = function() {
		//that.textNext.css({ opacity: 0 });
		that.textLog.text(text).transition({ opacity: 1 }, speed, function() {
			if (!nextAction) {
				return;
			} 

			//that.textNext.transition({ opacity: 1 }, speed);
			that.nextAction = nextAction;
		});

		that.helpTimeout = setTimeout(function() {
			that.helpText.text(helpText).transition({ opacity: 1 });
		}, that.helpTimeoutMillis);
	};

	if (this.helpText.css("opacity") != 0) {
		this.helpText.transition({ opacity: 0 }, speed);
	}

	if (this.textLog.css("opacity") != 0) {
		this.clearText(speed, fadeIn);
	} else {
		fadeIn();
	}
};

UI.prototype.clearText = function(speed, callback) {
	//this.textNext.transition({ opacity: 0 }, speed);
	this.textLog.transition({ opacity: 0 }, speed, callback);
	this.helpText.transition({ opacity: 0 }, speed);
}

UI.prototype.clearAbilities = function() {
	this.clearAbilitiesExcept(null);
}

UI.prototype.clearAbilitiesExcept = function(exclude) {
	var abilities = this.abilityDiv.children();
	var $exclude = $(exclude);
	jQuery.each(abilities, function(i, ability) {
		// TODO: Don't remove the chosen ability
		var $ability = $(ability);

		if ($ability.attr("id") != $exclude.attr("id")) {
			$ability.transition({ opacity: 0}, function() { 
				$ability.remove() 
			});
		} else {
			$ability.unbind("mouseenter mouseleave");
			$ability.transition({ x: 0}, 1000, 'ease');
		}
	})
	
}

UI.prototype.loadCard = function(card) {
	return $("<img>").attr("id", card.card).attr("src", "img/demo/" + card.card + ".png");
}

UI.prototype.addAbilities = function(abilities, clickHandler) {
	if (abilities.length != 3) {
		console.log("TODO: Arranging other than 3 abilities");
		return;
	}

	abilities.forEach(function(ability, idx) {
		setTimeout(function() {
			game.UI.addAbility(ability, 260 * (idx - 1), clickHandler);
		}, 300*idx);
	});
}

UI.prototype.addAbility = function(ab, offs, handler) {
	var that = this;

	var ability = this.loadCard(ab).css({ opacity: 0, x: 0, y: 200 })
		.one("click", function() {
			clearTimeout(that.helpTimeout);
			that.helpTimeout = null;
			handler(ab, this);
		})
		.bind("mouseenter", function() { 
			$(this).transition({ y: '-=10' }, 100); 
		})
		.bind("mouseleave", function() {
			$(this).transition({ y: '+=10' }, 100);
		});
	this.abilityDiv.append(ability);
	ability.transition({ opacity: 1, x: offs, y: -400 });
}

UI.prototype.showEncounter = function(card) {
	var that = this;
	var encounter = this.loadCard(card).css({ opacity: 0, rotateY: '-180deg', scale: [0.5, 0.5] });
	this.encounterDiv.append(encounter);
	encounter.transition({ opacity: 1, perspective: '500px', rotateY: '0deg', scale: [1.0, 1.0] }, function() {
		that.writeEncounterHealth(card.health);
	});

}

UI.prototype.shake = function(elem) {
	var spd = 80;
	elem.transition({ x: 10 }, spd)
		.transition({ x: -10 }, spd)
		.transition({ x: 5 }, spd)
		.transition({ x: -5 }, spd)
		.transition({ x: 0 });
}

UI.prototype.shakeEncounter = function() {
	this.shake(this.encounterDiv);
}

UI.prototype.shakePlayer = function(delay) {
	var that = this;
	setTimeout(function() {
		that.shake(that.textLog);
	}, delay);
}

UI.prototype.writeEncounterHealth = function(hp) {
	var health = $("<div>").text(hp).css({ opacity: 0});
	this.encounterHealth.append(health);
	health.transition({ opacity: 1 });
}