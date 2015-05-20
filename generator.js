

  function parse(csv) {
    lines = csv.split('\n');
    entries = [];
    
    // Split first line into keys
    var keys = lines[0].toLowerCase().split('\t');
    console.log("Keys: "+keys);
    for (var i in lines.slice(1)) {
      var entry = {};
      var line = lines[i];
      cells = line.split('\t');
      for (var i = 0; i < cells.length; i++) {
        if (keys[i] == "") continue;
        entry[keys[i]] = cells[i];
      }
      entries.push(entry);
    }
    
    return entries;
  }
  
  function filterColumnIfValued(cards, i) {
    // Strip all cards with values in a given column
    var result = [];
    
    for (var c in cards) {
      var card = cards[c];
      if (card[i] != "") {continue;}
      result[c] = card;
    }
    
    return result;
  }
  
  function filterEmpty(cards) {
    var result = [];
    for (var c in cards) {
      var card = cards[c];
      
      var isEmpty = true;
      for (var i in card) {
        if (card[i]) {
          isEmpty = false;
          break;
        }
      }
      
      if (isEmpty) {
        continue;
      }
      result.push(card);
    }
    return result;
  }
  
  function makeActionCards(cards, $dest) {
    
    for (var c in cards) {
      var data = cards[c];
      var card = $("<div style='float: left; width: 200px; height: 400px; border: 1px black solid;'>")
                    .append($("<h2>").text(data["title"]));
      
      $dest.append(card);
    }
  }