function storeFantasyPointsPerTeamData() {
  var fantasyPointsPerTeamData = [
  [
    "Dallas Cowboys",
    94.0
  ],
  [
    "Buffalo Bills",
    78.0
  ],
  [
    "Baltimore Ravens",
    75.0
  ],
  [
    "Jacksonville Jaguars",
    72.0
  ],
  [
    "Pittsburgh Steelers",
    71.0
  ],
  [
    "Seattle Seahawks",
    69.0
  ],
  [
    "Kansas City Chiefs",
    68.0
  ],
  [
    "New York Jets",
    68.0
  ],
  [
    "Minnesota Vikings",
    67.0
  ],
  [
    "New Orleans Saints",
    67.0
  ],
  [
    "Cincinnati Bengals",
    66.0
  ],
  [
    "Detroit Lions",
    62.0
  ],
  [
    "Philadelphia Eagles",
    59.0
  ],
  [
    "Tampa Bay Buccaneers",
    58.0
  ],
  [
    "Cleveland Browns",
    57.0
  ],
  [
    "San Francisco 49ers",
    57.0
  ],
  [
    "Houston Texans",
    51.0
  ],
  [
    "Denver Broncos",
    51.0
  ],
  [
    "Miami Dolphins",
    51.0
  ],
  [
    "Los Angeles Chargers",
    48.0
  ],
  [
    "Arizona Cardinals",
    46.0
  ],
  [
    "Washington Commanders",
    44.0
  ],
  [
    "New York Giants",
    43.0
  ],
  [
    "Las Vegas Raiders",
    42.0
  ],
  [
    "Indianapolis Colts",
    41.0
  ],
  [
    "Tennessee Titans",
    41.0
  ],
  [
    "Green Bay Packers",
    40.0
  ],
  [
    "Atlanta Falcons",
    39.0
  ],
  [
    "Chicago Bears",
    37.0
  ],
  [
    "Carolina Panthers",
    36.0
  ],
  [
    "New England Patriots",
    35.0
  ],
  [
    "Los Angeles Rams",
    31.0
  ]
];

  PropertiesService.getScriptProperties().setProperty('fantasyPointsPerTeamData', JSON.stringify(fantasyPointsPerTeamData));
}
