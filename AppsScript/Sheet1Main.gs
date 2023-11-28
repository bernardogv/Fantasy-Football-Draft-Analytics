const SHEET = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
const HEADERS = ["NO.", "PLAYER", "NFL TEAM", "POSITION", "FANTASY TEAM", "FPTS", "Player Value", "Quartile Ranking"];
const DRAFT_PICK_COL = 1;
const PLAYER_COL = 2;
const NFL_TEAM_COL = 3;
const POSITION_COL = 4;
const FANTASY_TEAM_COL = 5;
const FPTS_COL = 6;
const PLAYER_VALUE_COL = 7;
const QUARTILE_RANKING_COL = 8;

function main() {
  const allData = retrieveAllData();
  formatAndPopulateHeaders();
  populateData(allData.draftPickData);
  populateFPTS(allData.fantasyPointsPerPlayerData);
  populateTeamFPTS(allData.fantasyPointsPerTeamData);
  replaceInvalidWithZero();
  calculatePlayerValue();
  updateQuartileRankings();
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Open Documentation', 'openDocumentation')
    .addToUi();
}

function openDocumentation() {
  const html = HtmlService.createHtmlOutputFromFile('Documentation')
      .setWidth(800)
      .setHeight(600);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'Documentation');
}


function retrieveAllData() {
  const dataKeys = ['draftPickData', 'fantasyPointsPerPlayerData', 'fantasyPointsPerTeamData'];
  return dataKeys.reduce((acc, key) => {
    const dataString = PropertiesService.getScriptProperties().getProperty(key);
    acc[key] = JSON.parse(dataString);
    return acc;
  }, {});
}

function formatAndPopulateHeaders() {
  const colWidths = [40, 200, 80, 60, 250, 60, 90, 100];
  for (let i = 0; i < colWidths.length; i++) {
    SHEET.setColumnWidth(i + 1, colWidths[i]);
  }

  for (let i = 0; i < HEADERS.length; i++) {
    SHEET.getRange(1, i + 1).setValue(HEADERS[i]);
  }

  SHEET.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");

  var totalRows = 17 * 10;
  var dataRange = SHEET.getRange(2, 1, totalRows, 8);
  dataRange.setBorder(true, true, true, true, true, true);

  for (var i = 1; i <= totalRows; i++) {
    SHEET.getRange(i + 1, 1).setValue(i);
  }
}

function populateData(draftPickData) {
  for (let i = 0; i < draftPickData.length; i++) {
    const row = i + 2;
    let playerName, nflTeam, position;

    if (draftPickData[i][0].includes("D/ST")) {
      const splitData = draftPickData[i][0].split(" ");
      playerName = splitData[0];
      position = "D/ST";
      nflTeam = splitData[2];
    } else {
      const splitData = draftPickData[i][0].split(", ");
      const nameAndTeam = splitData[0].split(" ");
      playerName = nameAndTeam.slice(0, -1).join(" ");
      position = splitData[1];
      nflTeam = nameAndTeam[nameAndTeam.length - 1];
    }

    SHEET.getRange(row, DRAFT_PICK_COL).setValue(i + 1);
    SHEET.getRange(row, PLAYER_COL).setValue(playerName);
    SHEET.getRange(row, NFL_TEAM_COL).setValue(nflTeam);
    SHEET.getRange(row, POSITION_COL).setValue(position);
    SHEET.getRange(row, FANTASY_TEAM_COL).setValue(draftPickData[i][1]);
  }
}


function populateFPTS(fantasyPointsPerPlayerData) {
  const fptsLookup = {};
  for (let i = 0; i < fantasyPointsPerPlayerData.length; i++) {
    const key = fantasyPointsPerPlayerData[i][0].toLowerCase().trim();
    if (!fptsLookup.hasOwnProperty(key)) {
      fptsLookup[key] = fantasyPointsPerPlayerData[i][1];
    }
  }

  const lastRow = SHEET.getLastRow();
  for (let row = 1; row <= lastRow; row++) {
    const playerName = SHEET.getRange(row, PLAYER_COL).getValue().toLowerCase().trim();
    if (fptsLookup.hasOwnProperty(playerName)) {
      SHEET.getRange(row, FPTS_COL).setValue(fptsLookup[playerName]);
    }
  }
}

function populateTeamFPTS(fantasyPointsPerTeamData) {
  const fptsLookup = {};
  for (let i = 0; i < fantasyPointsPerTeamData.length; i++) {
    fptsLookup[fantasyPointsPerTeamData[i][0]] = fantasyPointsPerTeamData[i][1];
  }

  const lastRow = SHEET.getLastRow();
  for (let row = 1; row <= lastRow; row++) {
    const cellValue = SHEET.getRange(row, PLAYER_COL).getValue();
    for (const key in fptsLookup) {
      if (key.includes(cellValue)) {
        SHEET.getRange(row, FPTS_COL).setValue(fptsLookup[key]);
        break;
      }
    }
  }
}


function replaceInvalidWithZero() {
  const lastRow = SHEET.getLastRow();
  const range = SHEET.getRange(2, FPTS_COL, lastRow - 1);
  const values = range.getValues();

  for (let i = 0; i < values.length; i++) {
    if (isNaN(values[i][0]) || values[i][0] === undefined || values[i][0] === "") {
      values[i][0] = 0;
    }
  }

  range.setValues(values);
}


function calculatePlayerValue() {
  const lastRow = SHEET.getLastRow();
  const positionData = {};

  for (let row = 2; row <= lastRow; row++) {
    const draftPick = SHEET.getRange(row, DRAFT_PICK_COL).getValue();
    const position = SHEET.getRange(row, POSITION_COL).getValue();
    const fpts = SHEET.getRange(row, FPTS_COL).getValue();

    if (!positionData[position]) {
      positionData[position] = { draftPicks: [], fpts: [] };
    }

    positionData[position].draftPicks.push(draftPick);
    positionData[position].fpts.push(fpts);
  }

  for (const position in positionData) {
    const meanDraftPick = mean(positionData[position].draftPicks);
    const stdDevDraftPick = stdDev(positionData[position].draftPicks, meanDraftPick);

    const meanFPTS = mean(positionData[position].fpts);
    const stdDevFPTS = stdDev(positionData[position].fpts, meanFPTS);

    positionData[position].meanDraftPick = meanDraftPick;
    positionData[position].stdDevDraftPick = stdDevDraftPick;
    positionData[position].meanFPTS = meanFPTS;
    positionData[position].stdDevFPTS = stdDevFPTS;
  }

  for (let row = 2; row <= lastRow; row++) {
    const draftPick = SHEET.getRange(row, DRAFT_PICK_COL).getValue();
    const position = SHEET.getRange(row, POSITION_COL).getValue();
    const fpts = SHEET.getRange(row, FPTS_COL).getValue();

    const zScoreDraftPick = (draftPick - positionData[position].meanDraftPick) / positionData[position].stdDevDraftPick;
    const zScoreFPTS = (fpts - positionData[position].meanFPTS) / positionData[position].stdDevFPTS;

    const valueScore = zScoreDraftPick * 0.5 + zScoreFPTS * 0.5;
    const roundedValueScore = parseFloat(valueScore.toFixed(2));

    SHEET.getRange(row, PLAYER_VALUE_COL).setValue(roundedValueScore);
  }
}

function updateQuartileRankings() {
  const lastRow = SHEET.getLastRow();
  const playerValues = [];

  for (let row = 2; row <= lastRow; row++) {
    const value = SHEET.getRange(row, PLAYER_VALUE_COL).getValue();
    playerValues.push(value);
  }

  playerValues.sort((a, b) => a - b);
  const q1 = playerValues[Math.floor((playerValues.length * 0.25) - 1)];
  const q2 = playerValues[Math.floor((playerValues.length * 0.5) - 1)];
  const q3 = playerValues[Math.floor((playerValues.length * 0.75) - 1)];

  for (let row = 2; row <= lastRow; row++) {
    const value = SHEET.getRange(row, PLAYER_VALUE_COL).getValue();
    let quartileRank;

    if (value < q1) {
      quartileRank = 'Bottom 25%';
    } else if (value < q2) {
      quartileRank = '25-50%';
    } else if (value < q3) {
      quartileRank = '50-75%';
    } else {
      quartileRank = 'Top 25%';
    }

    SHEET.getRange(row, QUARTILE_RANKING_COL).setValue(quartileRank);
  }
}

function mean(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total / arr.length;
}

function stdDev(arr, mean) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += Math.pow(arr[i] - mean, 2);
  }
  return Math.sqrt(total / arr.length);
}

