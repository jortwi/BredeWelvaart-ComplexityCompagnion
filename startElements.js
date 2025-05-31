//in order to make using this file easier for the user, the following changes must be made:
// 1. get the array with startElements out of the function and in a separate file
// 2. remove the color() function and juse let them pass a string()
// 3. probably remove the x, y, and increment variables

function getStartElements(index = 0) {
  const screenSize = {
    x: 1440,
    y: 720,
  };
  const startElements = [
    [
      {
        x: screenSize.x / 2,
        y: screenSize.y / 2,
        r: 50,
        increment: 0.001,
        c1: color(getColor()),
        c2: color(getColor()),
        name: "Transforming Practices",
      },
      {
        x: screenSize.x / 5,
        y: screenSize.y / 5,
        r: 50,
        increment: 0.001,
        c1: color(getColor()),
        c2: color(getColor()),
        name: "Algemene Rekenkamer",
      },
      {
        x: random(screenSize.x),
        y: random(screenSize.y),
        r: 50,
        increment: 0.001,
        c1: color(getColor()),
        c2: color(getColor()),
        name: "Eindhoven",
      },
    ],
  ];

  return startElements[index];
}

const colorScheme = [
  "#FFD400", //yellow
  "#FF6600", //orange
  "#FF0000", //red
  "#C300FF", //purple
  "#1100FF", //blue
  //white removed due to bad visibility --> original: f0eae0
  "#282828", //black
  "#00fa04", //green
];

function getColor() {
  //return random color from the color scheme
  return colorScheme[Math.floor(random(colorScheme.length))];
}
