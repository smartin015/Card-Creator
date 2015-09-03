(function init() {
  createView();

  Tabletop.init({
    key: '1WvRrQUBRSZS6teOcbnCjAqDr-ubUNIxgiVwWGDcsZYM',
    callback: function(d, t) {
      console.log('sheets loaded');

      cardData = d; // save these in case we need them later (ie re-running rendering)
      tabletop = t;
      sheets = tabletop.sheets();

      // assert load worked
      for (var page in templates) {
        if (!sheets[page]) {
          return alert('Failed to sheet: ' + page);
        }
        if (sheets[page].elements.length <= 1) {
          return alert('No cards loaded for: ' + page);
        }
      }
      render();
    }, simpleSheet: true
  });
})();

function createView() {
  var content = $(".page-content");
  
  var headerTmpl = Handlebars.compile($("#header-template").html());
  var iconTextTmpl = Handlebars.compile($("#icon-text-template").html());
  
  content.append(headerTmpl({id: "welcome", title: "Welcome!"}));
  
  content.append(iconTextTmpl({
    id: "intro",
    title: "Expedition is Different",
    img: "img/int.svg",
    p1: "We built it from the ground up to be thoughtful and challenging, but not slow and overwhelming. "
      + "This especially applies to the typical \"dungeon master\" role seen in most roleplaying games.",
    list: [
      "There's less number-crunching, but every decision is just as meaningful and open-ended. You'll have more time to focus on telling the story.",
      "Everything is card-based; for long campaigns, players can (and should) take their decks home and personalize them between games.",
      "Enemy encounters resolve within minutes - you'll be kept on your toes by your party's actions.",
      "Made-up rules (\"House Rules\") are encouraged, and add significant depth to the game.",
    ],
  }));
  
  content.append(iconTextTmpl({
    id: "requirements",
    title: "Requirements",
    img: "img/int.svg",
    p1: "A standard campaign requires one Guide and three to five Explorers, and also:",
    list: [
      "A copy of the cards, either purchased or downloaded and printed.",
      "A phone or tablet running the Expedition App.",
      "A 20-sided die for every player.",
      "A large whiteboard surface, with enough markers for everyone. In a pinch, you can also you pencils and paper (one pencil and sheet of paper for each person, plus one sheet for the center)."
    ],
  }));
  
  content.append(headerTmpl({id: "setup", title: "Setting Up"}));
  
  content.append(iconTextTmpl({
    id: "choose-decks",
    title: "1. Choose your Decks",
    img: "img/title.svg",
    p1: "From your main set and expansions (you have the expansions, right?) select:",
    list: [
      "<strong>6 Encounter</strong> decks, including <strong>1 Trap</strong> deck",
      "<strong>4 Ability</strong> decks",
      "<strong>50-80 Loot</strong> cards.",
      "<strong>1 Explorer</strong> deck.",
      "<strong>1 Title</strong> deck.",
    ],
    p2: "If you don't have any expansions, the main set contains exactly the cards you need.",
  }));
  
  content.append(iconTextTmpl({
    id: "choose-abilities",
    title: "2. Choose Explorers and Abilities",
    img: "img/class/Ranged.svg",
    p1: "Your party should now choose their Explorer and Abilities:",
    list: [
      "Pass the Explorer deck around, allowing everyone to shuffle through and choose their character.",
      "Make sure everyone names their character. Suggest brainstorming a matching backstory, as well.",
      "Direct each player to choose their starting abilities from one of the ability decks.",
    ],
    p2: "Further instructions on choosing explorers and abilities can be found in the "
      + "<a href=\"/handbook.html#setup\" target=\"_blank\">Setting Up</a> section of the Explorer's Handbook.",
  }));    
  
  content.append(iconTextTmpl({
    id: "choose-equipment",
    title: "3. Gear Up",
    img: "img/loot.svg",
    p1: "Your explorers need equipment!",
    list: [
      "",
    ],
  }));    
  
  content.append(headerTmpl({id: "trouble", title: "Inventing Trouble"}));
  
  content.append(iconTextTmpl({
    id: "trouble-encounter",
    title: "Plan your Encounters",
    img: "img/encounter.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "trouble-mayhem",
    title: "Cause Mayhem",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(headerTmpl({id: "encounters", title: "Encounters"}));
  
  content.append(iconTextTmpl({
    id: "encounters-app",
    title: "The Expedition App",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-rounds",
    title: "Encounter Rounds",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-storytelling",
    title: "Tell the Story",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-enforcement",
    title: "Be the Referee",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-damage",
    title: "Damage",
    img: "img/dead.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-end",
    title: "Ending Encounters",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(headerTmpl({id: "environment", title: "You are the Environment"}));
  
  content.append(iconTextTmpl({
    id: "environment-descriptions",
    title: "Encourage Free Thinking",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "environment-houserules",
    title: "Roleplay Game Mechanics",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(headerTmpl({id: "npcs", title: "Merchants and Inns"}));
  
  content.append(iconTextTmpl({
    id: "npcs-merchants",
    title: "Merchants",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "npcs-inns",
    title: "Inns & Taverns",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(headerTmpl({id: "postgame", title: "After Every Game"}));
  
  content.append(iconTextTmpl({
    id: "postgame-cards",
    title: "Players Keep Cards",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "postgame-plan",
    title: "Plan the Next Session",
    img: "img/loot.svg",
    p1: "",
    list: [
      "",
    ],
  }));    
  
}

function render() {
  var sorted = [];
  $(".cardfront").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    var card = sheets[id].elements[6];
    $e.html(renderCardFront(id, card));
  });
  
  $(".cardoffense").html(renderCardFront("Ability", sheets["Ability"].elements[11]));
  $(".carddefense").html(renderCardFront("Ability", sheets["Ability"].elements[8]));
  $(".cardancillary").html(renderCardFront("Ability", sheets["Ability"].elements[5]));
  
  $(".cardback").each(function(i, e) {
    var $e = $(e);
    var id = $e.attr('data-card');
    var card = sheets[id].elements[5];
    card.Environment = id; //Override Encounter card back
    card.Class = id; //Override ability card back
    $e.html(renderCardBack(id, card));
  });
  
  
  //fronts.append(templates[template](card));
  SVGInjector(document.querySelectorAll('img.svg'), {});

  /*$(".card").click(function() {
    $(this).remove();
  });*/
}