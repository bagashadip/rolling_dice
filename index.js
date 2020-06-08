function initGame(inputPlayers, totalDice) {
  let playersWithDice = [];
  for (let i = 0; i < inputPlayers; i++) {
    let rollDice = [];
    for (let j = 0; j < totalDice; j++) {
      rollDice.push(0);
    }
    playersWithDice.push({
      playerName: "Player" + (i + 1),
      dice: rollDice,
      points: 0,
    });
  }

  return playersWithDice;
}

function rollDice(playersWithDice) {
  for (let i = 0; i < playersWithDice.length; i++) {
    let diceRoll = [];
    for (let j = 0; j < playersWithDice[i]["dice"].length; j++) {
      diceRoll.push(Math.floor(Math.random() * 6) + 1);
    }
    playersWithDice[i]["dice"] = diceRoll;
  }

  return playersWithDice;
}

function checkGameOver(data) {
  let countDicePlayer = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i]["dice"].length > 0) {
      countDicePlayer++;
    }
  }
  return countDicePlayer;
}

function startGame(inputPlayers, totalDice) {
  let gameOver = false;
  let totalRoll = 0;
  let rollDelay = 0;
  let countRoll = 0;
  let playersWithDice = initGame(inputPlayers, totalDice);

  while (gameOver == false) {
    let countDice = checkGameOver(playersWithDice);
    if (countDice == 1) {
      return;
    }

    playersWithDice = rollDice(playersWithDice);
    let tempDice = JSON.parse(JSON.stringify(playersWithDice));

    for (let i = 0; i < playersWithDice.length; i++) {
      for (let j = 0; j < playersWithDice[i]["dice"].length; j++) {
        if (playersWithDice[i]["dice"][j] === 6) {
          playersWithDice[i]["dice"][j] = null;
          playersWithDice[i]["points"]++;
        }
        if (playersWithDice[i]["dice"][j] === 1) {
          if (i === playersWithDice.length - 1) {
            for (let x = 0; x < playersWithDice.length; x++) {
              if (playersWithDice[x]["dice"].length !== 0) {
                playersWithDice[x]["dice"].push("s1");
                playersWithDice[i]["dice"][j] = null;
                break;
              }
            }
          } else {
            for (let x = i + 1; x < playersWithDice.length; x++) {
              if (playersWithDice[x]["dice"].length !== 0) {
                playersWithDice[x]["dice"].push("s1");
                playersWithDice[i]["dice"][j] = null;
                break;
              }

              if (
                x === playersWithDice.length - 1 &&
                playersWithDice[x]["dice"].length === 0
              ) {
                x = -1;
              }
            }
          }
        }
      }
    }

    for (let i = 0; i < playersWithDice.length; i++) {
      for (let j = 0; j < playersWithDice[i]["dice"].length; j++) {
        if (playersWithDice[i]["dice"][j] === "s1") {
          playersWithDice[i]["dice"][j] = 1;
        }
        if (playersWithDice[i]["dice"][j] === null) {
          playersWithDice[i]["dice"].splice(j, 1);
          j--;
        }
      }
    }
    countRoll++;
    let tempPlayersWithDice = JSON.parse(JSON.stringify(playersWithDice));

    (function (rollDelay) {
      setTimeout(function () {
        try {
          totalRoll++;

          console.log();
          console.log(`Giliran ${totalRoll} lempar dadu:`);

          for (let i = 0; i < tempDice.length; i++) {
            console.log(
              `${tempDice[i]["playerName"]} (${tempDice[i]["points"]}): ${tempDice[i]["dice"]}`
            );
          }

          console.log();
          console.log(`Hasil Evaluasi:`);

          for (let j = 0; j < tempPlayersWithDice.length; j++) {
            console.log(
              `${tempPlayersWithDice[j]["playerName"]} (${tempPlayersWithDice[j]["points"]}): ${tempPlayersWithDice[j]["dice"]}`
            );
          }

          console.log();
          console.log("###############################");
        } finally {
          if (totalRoll === countRoll) {
            console.log("========== Game Over ==========");
            let largestPoint = 0;
            for (let i = 0; i < playersWithDice.length; i++) {
              if (playersWithDice[i]["points"] > largestPoint) {
                largestPoint = playersWithDice[i]["points"];
              }
            }

            let countLargestPoint = 0;
            let playersWin = [];
            for (let j = 0; j < playersWithDice.length; j++) {
              if (playersWithDice[j]["points"] === largestPoint) {
                countLargestPoint++;
                playersWin.push(playersWithDice[j]["playerName"]);
              }
            }

            if (countLargestPoint === 1) {
              console.log(
                `Game dimenangkan oleh ${playersWin} dengan point tertinggi = ${largestPoint}`
              );
            } else {
              console.log(
                `Permainan seri, player dengan nilai point tertinggi: ${playersWin}`
              );
              console.log(`Perolehan point masing-masing = ${largestPoint}`);
            }
            console.log("========== Game Over ==========");
          }
        }
      }, 1000 * rollDelay);
    })(rollDelay++);
  }
}

var prompt = require("prompt");
prompt.start();

prompt.get(["players", "totalDice"], function (err, result) {
  startGame(result.players, result.totalDice);
});
