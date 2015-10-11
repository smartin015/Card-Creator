(function init() {
  createView();
})();

function createView() {
  var content = $(".page-content");
  
  var headerTmpl = Handlebars.compile($("#header-template").html());
  var iconTextTmpl = Handlebars.compile($("#icon-text-template").html());
  
  content.append(headerTmpl({id: "welcome", title: "Welcome!"}));
  
  content.append(iconTextTmpl({
    id: "intro",
    title: "Expedition is Different",
    img: "img/d20.svg",
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
    p1: "A standard campaign requires one Guide and three to five Explorers, plus:",
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
      "Pick at least twice the number of Loot from the deck as there are players.",
      "Include one or more weapons for each of the starting ability decks.",
      "Healing loot and other cheap items are also good choices.",
      "Place the cards face up in a grid. Players can take 25 gold worth of items.",
    ],
  }));    
  
  content.append(headerTmpl({id: "trouble", title: "Inventing Trouble"}));
  
  content.append(iconTextTmpl({
    id: "trouble-encounter",
    title: "Plan your Encounters",
    img: "img/encounter.svg",
    p1: "Start thinking about your next encounter early on.",
    list: [
      "It should be as hard or just a bit tougher than your party can currently handle.",
      "Remember your party's health drops as they fight, so weigh the encounter accordingly.",
      "Try combining Encounters (\"spider-dogs\", etc) to combine Health, Tier, and special abilities.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "trouble-mayhem",
    title: "Cause Mayhem",
    img: "img/trap.svg",
    p1: "Look for an excuse to cause mayhem.",
    list: [
      "If you see players getting comfortable with a certain tactic, figure out how to break it!",  
      "You can Ambush the party with an encounter and require them to shuffle their ability decks to disrupt their plans",
      "Make sure there's a good reason in the story for these disruptions to happen, or your party may feel frustrated.", 
    ],
  }));    
  
  content.append(headerTmpl({id: "encounters", title: "Encounters"}));
  
  content.append(iconTextTmpl({
    id: "encounters-app",
    title: "The Expedition App",
    img: "img/logo.svg",
    p1: "The App on your phone calculates damage based on the Threat of enemies in play.",
    list: [
      "When a (non-Trap) Encounter is played, add its Threat to the App.",
      "If an Encounter is prevented from attacking, remove its Threat from the App.",
      "If you're just starting out, follow the App tutorial for a demonstration round.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-rounds",
    title: "Encounter Rounds",
    img: "img/dex-1.svg",
    p1: "Once you're ready to start the round, notify everyone that battle has begun!",
    list: [
      "Tap the app to start the timer.", 
      "Players should draw their three Ability cards and play one, quickly.",
      "Once every player has played, stop the timer by tapping it",
      "Resolve the round, including the damage listed on the app.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-surges",
    title: "Encounter Surges",
    img: "img/class/Defense.svg",
    p1: "Surge events also occur during battle.",
    list: [  
      "When a surge of a given Threat occurs, choose an Encounter with that Threat level and resolve the actions listed under the Surge section.",
      "If no Encounters exist at that level, choose first from higher Threat, and then from low Threat if there are no Encounters with high Threat.",
    ],
  }));  
  
  content.append(iconTextTmpl({
    id: "encounters-storytelling",
    title: "Tell the Story",
    img: "img/cha.svg",
    p1: "Tell the story during the encounter:",
    list: [
      "Describe the enemy formation: who can and can't be hit, whether they call for help, their special attacks, status, etc.",
      "Shake up an Encounter; try introducing a third enemy to the battle, or change the environment with a Trap card.",
      "Multiply encounter cards to create epic battles - 10 guards deal 10X damage and have 10X health.",
      "If your allies are in trouble, try playing encounter cards as “allies” to help attack the enemy.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "encounters-enforcement",
    title: "Be the Referee",
    img: "img/int.svg",
    p1: "Enforce the rules:",
    list: [
      "Make sure people are roleplaying their actions",
      "Keep an eye on everyone's health",
      "Make sure items are discarded after they're used.",
    ],
    p2: "Tracking enemy damage is tough; we recommend that you write enemy "
      + "damage remaining as a number and players track their own damage taken "
      + "using hash marks.",
  }));    
    
  content.append(iconTextTmpl({
    id: "encounters-end",
    title: "Ending Encounters",
    img: "img/loot.svg",
    p1: "If players survive the encounter, reward them with Loot.",
    list: [
      "Hand out Loot roughly equal to the total Threat of all Encounters killed by players.",
      "Enemies that fled or were otherwise taken out of play shouldn't contribute Loot.",
    ],
    p2: "If none survive, something terrible happens to the party while they "
      + "are unconscious. This is a fantastic opportunity to take the story "
      + "in a new direction and catch your players by surprise!",
  }));    
  
  content.append(headerTmpl({id: "environment", title: "You are the Environment"}));
  
  content.append(iconTextTmpl({
    id: "environment-descriptions",
    title: "Cause and Effect",
    img: "img/environment/forest.svg",
    p1: "Use your party's actions to cause interesting things to happen around them.",
    list: [
      "If a mage casts a flame spell and fails, it might catch part of the surrounding area on fire and make some actions more hazardous.",
      "A crafty rogue might cut a rope that leads to the chandelier directly above the last enemy.",
      "Not every ability must affect the surrounding environment - but when they do, the details of these events are up to you.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "environment-houserules",
    title: "House Rules",
    img: "img/environment/underground.svg",
    p1: "You can make up your own cause and effect rules. Here's a few we use:",
    list: [
      "When something is invisible, it can be attacked but takes no damage.",
      "Enemies can take on formations. The rear ranks cannot take melee damage.",
      "Arcane abilities can sometimes imbue weapons or creatures with temporary bonuses.",
      "Poisonous creatures can sometimes poison allies and deal damage over time",
      "Fire or Electric attacks around explosive materials can cause quite a bang!",
      "Burning buildings can create falling wreckage; underground exploration risks a cave-in.",
    ],
  }));    
  
  content.append(headerTmpl({id: "npcs", title: "Merchants and Inns"}));
  
  content.append(iconTextTmpl({
    id: "npcs-merchants",
    title: "Merchants",
    img: "img/class/Alchemy.svg",
    p1: "When players accumulate a lot of Loot, take them to a Merchant to trade items.",
    list: [
      "Search the item pile for beneficial Loot that will definitely help your party.",
      "Include a few random Loot for good measure.",
      "Tie the merchant into the story (e.g. a specialty armorer or local enchanter.)",
      "Loot is bought and sold at its listed value.",
      "Players can record their remaining gold for later use.",
    ],
  }));    
  
  content.append(iconTextTmpl({
    id: "npcs-inns",
    title: "Inns & Taverns",
    img: "img/environment/town.svg",
    p1: "When your party is hurt, they'll need to recover.",
    list: [
      "Players can choose to rest in a paid, \"safe\" location such as an inn",
      "They could also camp outside of town for free.",
      "Safer locations cost money (usually ~10 gold per person) but the party has less risk of being ambushed in the night.",
    ],
  }));    
  
  content.append(headerTmpl({id: "postgame", title: "After Every Game"}));
  
  content.append(iconTextTmpl({
    id: "postgame-cards",
    title: "Abilities and Cleanup",
    img: "img/class/Magic.svg",
    p1: "When you finish an arc of your story (usually, at the end of a play session):",
    list: [
      "Let every player pick a new Ability that they can use next time.",
      "Players should record their spare gold.",
      "Health is restored to full at the start of the next game.",
      "Each player owns their cards, and should take their decks home.",
      "Players may also customize their cards, adding bits of lore or drawings.",
    ],
  }));      
}