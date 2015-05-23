function randomColors(num) {
  // original, by english names and pruned
  //Colors = ["#000000","#0000ff","#a52a2a","#00008b","#008b8b","#a9a9a9","#006400","#bdb76b","#8b008b","#ff8c00","#8b0000","#e9967a","#9400d3","#008000","#4b0082","#add8e6","#800000","#000080","#808000","#ffa500","#800080","#ff0000","#c0c0c0"];
  // new one, powered by http://tools.medialab.sciences-po.fr/iwanthue/
  var Colors = ["#C14838",
                "#6ACE50",
                "#C059CD",
                "#74A9BC",
                "#50333F",
                "#516538",
                "#BC4A81",
                "#7271BA",
                "#C38C42",
                "#90D1A4",
                "#CBA1A3",
                "#C5CC4D"]
  var len = Colors.length,
      result = [],
      picked = [],
      rand = Math.floor(Math.random() * 8);
  while (result.length < num) {
    rand += Math.floor(Math.random() * len/num);
    if (rand >= len) rand -= len;
    if (picked.indexOf(rand) !== -1) continue;
    result.push(Colors[rand]);
    picked.push(rand);
    console.log(picked);
  }
  console.log(result);
  return result;
}