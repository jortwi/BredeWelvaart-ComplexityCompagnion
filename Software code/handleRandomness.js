let timer_uncertainty = 0;
let timer_vitality = 0;
let frequency_uncertainty;
let frequency_vitality;

let whiteSpots = []; //array to hold all white spots

//function that takes care of unpredictability in the visualization based on vitality and uncertainty knobs
function handleRandomness() {
  let uncertainty = sensorData.knob_uncertainty;
  let vitality = sensorData.knob_vitality;

  // --- Uncertainty --- //
  frequency_uncertainty = 1000 + (1 - uncertainty) * 1000; // 1 to 11 seconds, lower uncertainty = less often
  if (millis() >= frequency_uncertainty + timer_uncertainty) {
    //change the size of one random element based on the uncertainty
    let randomElementIndex = Math.floor(random(elements.length));
    elements[randomElementIndex].r += random(-1, 1) * uncertainty * 10;

    //set relation between each white spot and its closest element to a random type
    for (let whiteSpot of whiteSpots) {
      const closestElement = getClosestElement(whiteSpot, elements);

      // Only update if the closest element has changed
      if (whiteSpot.lastClosestElement !== closestElement) {
        const newRelation = getRelationBetween(whiteSpot, closestElement);

        for (let relation of relations) {
          if (relation.e1 === whiteSpot || relation.e2 === whiteSpot) {
            if (relation === newRelation) {
              relation.type = getRandomRelationType();
            } else {
              relation.type = "null";
            }
          }
        }

        // Remember the last closest element
        whiteSpot.lastClosestElement = closestElement;
      }
    }

    timer_uncertainty = millis();
  }

  // Update amount of white spots
  if (whiteSpots.length < Math.floor(uncertainty * 5)) {
    // 0 - 5 white spots
    addWhiteSpot(
      new Element({
        x: random(width),
        y: random(height),
        r: random(40 * (1 - uncertainty), 70 * uncertainty), //can be very big or small if uncertainty is high
        name: "",
        increment: 0.001,
        c1: color(getColor()),
        c2: color(getColor()),
        type: "whiteSpot", //does nothing so far
      })
    );
  } else if (whiteSpots.length > Math.floor(uncertainty * 5)) {
    removeWhiteSpot(whiteSpots.length - 1);
    console.log("removed white spot");
  }

  // --- Vitality --- //
  frequency_vitality = 3000 + (1 - vitality) * 3000; // 1 to 11 seconds, lower uncertainty = less often
  if (millis() >= frequency_vitality + timer_vitality) {
    //set the speeds of all regular elements (back) to 0
    for (let i = 0; i < elements.length; i++) {
      elements[i].xSpeed = 0;
      elements[i].ySpeed = 0;
    }

    //set the speed of one random element based on the vitality
    let randomElementIndex = Math.floor(random(elements.length));
    elements[randomElementIndex].xSpeed = random(-1, 1) * vitality;
    elements[randomElementIndex].ySpeed = random(-1, 1) * vitality;

    //update white spots speeds
    for (let i = 0; i < whiteSpots.length; i++) {
      whiteSpots[i].xSpeed = (random(1) - 0.5) * 2 * vitality; //move -0.5 - 0.5 px per frame
      whiteSpots[i].ySpeed = (random(1) - 0.5) * 2 * vitality; //move -0.5 - 0.5 px per frame
    }

    timer_vitality = millis();
  }
}

//white spots should not be selectable by the user
function addWhiteSpot(newElement) {
  // Create relations with all existing elements
  for (const existingElement of elements) {
    relations.push(new Relation(existingElement, newElement, "null"));
  }

  // Add the new element to the elements array
  whiteSpots.push(newElement);
}

// Remove an element and all related relations
function removeWhiteSpot(elementToRemove) {
  // Remove all relations involving the element
  for (let i = relations.length - 1; i >= 0; i--) {
    const r = relations[i];
    if (
      r.e2 === whiteSpots[elementToRemove] ||
      r.e1 === whiteSpots[elementToRemove]
    ) {
      relations.splice(i, 1);
    }
  }

  // Remove from elements array
  const index = elementToRemove;
  if (index !== -1) {
    whiteSpots.splice(index, 1);
  }
}

function getClosestElement(whiteSpot, elements) {
  let closest = null;
  let minDist = Infinity;

  for (let element of elements) {
    let d = dist(whiteSpot.x, whiteSpot.y, element.x, element.y);
    if (d < minDist) {
      minDist = d;
      closest = element;
    }
  }

  return closest;
}

function getRelationBetween(whiteSpot, element) {
  for (let relation of relations) {
    if (
      (relation.e1 === whiteSpot && relation.e2 === element) ||
      (relation.e1 === element && relation.e2 === whiteSpot)
    ) {
      return relation;
    }
  }
  return null; // no relation found
}
