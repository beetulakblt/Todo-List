let stateCounts = [];
function countCard() {
  stateCounts = [];
  $(".box-content .card").each((i, v) => {
    let state = $(v).data("state");
    stateCounts.push(state);
  });
  recordCardValue();
}

function recordCardValue() {
  let todoCount = 0,
    doneCount = 0,
    doingCount = 0;

  for (var i = 0; i < stateCounts.length; i++) {
    if (stateCounts[i] === "todo") {
      todoCount++;
    } else if (stateCounts[i] === "done") {
      doneCount++;
    } else if (stateCounts[i] === "doing") {
      doingCount++;
    }
  }
  $("#todoRecorder").text(todoCount);
  $("#doingRecorder").text(doingCount);
  $("#doneRecorder").text(doneCount);
}
countCard();
