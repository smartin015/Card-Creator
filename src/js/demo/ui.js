

var UI = function() {
	this.speed = 1500;

	this.textLog = $("#textLog");
	this.textNext = $("#textNext");
	this.abilityDiv = $("#abilities");
	this.endgameButtons = $("#endgameButtons");
	this.actionQueue = [];
};

UI.prototype.nextAction = function() {
	if (this.actionQueue) {
		this.actionQueue.shift()();
	}
}

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

UI.prototype.setText = function(text) {
	var that = this;
	var wasEmpty = (this.actionQueue.length == 0);

	this.actionQueue.push(function() {
		var fadeIn = function() {
			that.textNext.css({ opacity: 0 });
			that.textLog.text(text).transition({ opacity: 1 }, that.speed, function() { 
				that.textNext.transition({ opacity: 1 }, that.speed).one("click", function() {
					that.nextAction();
				});
			});
		};

		if (that.textLog.css("opacity") == 1) {
			that.textLog.transition({ opacity: 0 }, that.speed, fadeIn);
		} else {
			fadeIn();
		}
	});
	console.log(this.actionQueue);

	if (wasEmpty) {
		this.nextAction();
	}
};

UI.prototype.clearAbilities = function() {
	this.abilityDiv.children().remove();
}

UI.prototype.addAbility = function(ab, handler) {
	var ability = $("<div>").text(ab).click(function() {
			handler(ab);
	});

	this.abilityDiv.append(ability);
}