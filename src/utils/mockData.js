export const TEAMS = [
  'India',
  'Australia',
  'England',
  'South Africa',
  'New Zealand',
  'Pakistan',
  'West Indies',
  'Sri Lanka',
  'Bangladesh',
  'Afghanistan',
]

export const VENUES = [
  'Wankhede Stadium, Mumbai',
  'Eden Gardens, Kolkata',
  'M. Chinnaswamy, Bengaluru',
  'MA Chidambaram, Chennai',
  'Arun Jaitley Stadium, Delhi',
  'Rajiv Gandhi Stadium, Hyderabad',
  'Narendra Modi Stadium, Ahmedabad',
  'MCG, Melbourne',
  'SCG, Sydney',
  "Lord's, London",
  'The Oval, London',
  'Newlands, Cape Town',
]

export const PLAYING_XI = {
  India: [
    { name: 'Rohit Sharma',       role: 'Opener',   type: 'bat' },
    { name: 'Shubman Gill',       role: 'Opener',   type: 'bat' },
    { name: 'Virat Kohli',        role: 'Anchor',   type: 'bat' },
    { name: 'Suryakumar Yadav',   role: 'Finisher', type: 'bat' },
    { name: 'Hardik Pandya',      role: 'All-rounder', type: 'all' },
    { name: 'Rinku Singh',        role: 'Finisher', type: 'bat' },
    { name: 'Ravindra Jadeja',    role: 'All-rounder', type: 'all' },
    { name: 'Axar Patel',         role: 'Spinner',  type: 'bowl' },
    { name: 'Kuldeep Yadav',      role: 'Spinner',  type: 'bowl' },
    { name: 'Jasprit Bumrah',     role: 'Pacer',    type: 'bowl' },
    { name: 'Mohammed Siraj',     role: 'Pacer',    type: 'bowl' },
  ],
  Australia: [
    { name: 'David Warner',       role: 'Opener',   type: 'bat' },
    { name: 'Travis Head',        role: 'Opener',   type: 'bat' },
    { name: 'Mitchell Marsh',     role: 'All-rounder', type: 'all' },
    { name: 'Glenn Maxwell',      role: 'Finisher', type: 'bat' },
    { name: 'Marcus Stoinis',     role: 'All-rounder', type: 'all' },
    { name: 'Matthew Wade',       role: 'Finisher', type: 'bat' },
    { name: 'Tim David',          role: 'Finisher', type: 'bat' },
    { name: 'Pat Cummins',        role: 'Pacer',    type: 'bowl' },
    { name: 'Mitchell Starc',     role: 'Pacer',    type: 'bowl' },
    { name: 'Josh Hazlewood',     role: 'Pacer',    type: 'bowl' },
    { name: 'Adam Zampa',         role: 'Spinner',  type: 'bowl' },
  ],
  England: [
    { name: 'Jos Buttler',        role: 'Opener',   type: 'bat' },
    { name: 'Phil Salt',          role: 'Opener',   type: 'bat' },
    { name: 'Dawid Malan',        role: 'Anchor',   type: 'bat' },
    { name: 'Ben Duckett',        role: 'Anchor',   type: 'bat' },
    { name: 'Harry Brook',        role: 'Finisher', type: 'bat' },
    { name: 'Moeen Ali',          role: 'All-rounder', type: 'all' },
    { name: 'Sam Curran',         role: 'All-rounder', type: 'all' },
    { name: 'Liam Livingstone',   role: 'Finisher', type: 'bat' },
    { name: 'Jofra Archer',       role: 'Pacer',    type: 'bowl' },
    { name: 'Mark Wood',          role: 'Pacer',    type: 'bowl' },
    { name: 'Adil Rashid',        role: 'Spinner',  type: 'bowl' },
  ],
}

// Fallback XI for teams without specific data
export const GENERIC_XI = [
  { name: 'Player 1',  role: 'Opener',   type: 'bat' },
  { name: 'Player 2',  role: 'Opener',   type: 'bat' },
  { name: 'Player 3',  role: 'Anchor',   type: 'bat' },
  { name: 'Player 4',  role: 'Finisher', type: 'bat' },
  { name: 'Player 5',  role: 'All-rounder', type: 'all' },
  { name: 'Player 6',  role: 'All-rounder', type: 'all' },
  { name: 'Player 7',  role: 'Spinner',  type: 'bowl' },
  { name: 'Player 8',  role: 'Spinner',  type: 'bowl' },
  { name: 'Player 9',  role: 'Pacer',    type: 'bowl' },
  { name: 'Player 10', role: 'Pacer',    type: 'bowl' },
  { name: 'Player 11', role: 'Pacer',    type: 'bowl' },
]

export function getXI(team) {
  return PLAYING_XI[team] || GENERIC_XI
}

export const MOCK_RECOMMENDATION = {
  batting_recommendation: {
    title: 'Promote Suryakumar Yadav to #3',
    player: 'Suryakumar Yadav',
    score: 84,
    confidence: 82,
    risk_note: 'High variance player — can fall early or dominate',
    reasoning: [
      'Excels against spin in middle overs (SR: 178)',
      'Higher acceleration upside than current option at #3',
      'Chennai pitch historically favors 360° strokeplay',
      'Maxwell vulnerable to pace; SKY can exploit gap',
    ],
  },
  bowling_plan: [
    {
      over_slot: 1,
      bowler: 'Kuldeep Yadav',
      target_batter: 'Glenn Maxwell',
      confidence: 79,
      reason: 'Opponent weakness vs wrist spin in middle overs — Maxwell averages 14 vs googly',
    },
    {
      over_slot: 2,
      bowler: 'Axar Patel',
      target_batter: 'Marcus Stoinis',
      confidence: 75,
      reason: 'Left-arm containment angle restricts Stoinis to on-side only',
    },
  ],
  fielding_changes: [
    {
      title: 'Protect Deep Midwicket',
      reason: "Batter's boundary zone concentrated on leg side — man the rope early",
    },
    {
      title: 'Bring Point Slightly In',
      reason: 'Encourage risky aerial off-side stroke — forces aerial risk',
    },
    {
      title: 'Slip Cordon for First 2 Balls',
      reason: 'Kuldeep generates significant edge probability early in spell',
    },
  ],
  next_2_over_decisions: [
    {
      over: '8.1 – 9.0',
      mode: 'Attack',
      decision: 'Use wrist spin with slip in. Force aerial shot or edge. Do not concede easy singles.',
    },
    {
      over: '9.1 – 10.0',
      mode: 'Contain',
      decision: 'Shift to boundary protection if batter survives. Rotate strike away from Maxwell.',
    },
  ],
  favorable_matchups: [
    {
      batter: 'Suryakumar Yadav',
      bowler: 'Adam Zampa',
      edge: 'SKY averages 62 vs leg-spin. Strike rate 212.',
      metric: 'SR: 212 | Avg: 62',
      why: 'Zampa concedes 10+ per over to SKY historically',
    },
    {
      batter: 'Hardik Pandya',
      bowler: 'Josh Hazlewood',
      edge: 'Hardik SR of 188 in death vs seam-up delivery',
      metric: 'SR: 188 | 6s: 7',
      why: 'Hazlewood short-ball plan backfires vs strong Hardik pull',
    },
    {
      batter: 'Virat Kohli',
      bowler: 'Mitchell Starc',
      edge: 'Kohli averages 54 vs left-arm pace. Reads swing early.',
      metric: 'Avg: 54 | Dots: 28%',
      why: 'Kohli consistently gets into rhythm vs Starc lengths',
    },
  ],
  dangerous_matchups: [
    {
      batter: 'Rohit Sharma',
      bowler: 'Pat Cummins',
      risk: 'Rohit dismissed 4 of 7 times vs Cummins cross-seam',
      metric: 'Dismissals: 4/7',
      why: 'Cummins angles in to right-hander, Rohit covers outside off too early',
    },
    {
      batter: 'Shubman Gill',
      bowler: 'Josh Hazlewood',
      risk: 'Gill averages 12 in powerplay vs full-length seam',
      metric: 'Avg: 12 | Outs: 3',
      why: 'Hazlewood full-length delivery consistently finds Gill outside off',
    },
    {
      batter: 'Virat Kohli',
      bowler: 'Adam Zampa',
      risk: 'Kohli averages 18 vs leg-spin. Plays around line.',
      metric: 'Avg: 18 | SR: 88',
      why: 'Zampa leg-spin from around-the-wicket restricts Kohli severely',
    },
  ],
  captain_summary:
    'Use spin pressure aggressively in the middle overs and promote SKY if acceleration is required. Kuldeep must bowl to Maxwell before he settles. Protect deep midwicket boundary. Shift to pace containment if SKY falls early.',
  signals: {
    pressure_stability: 81,
    acceleration_upside: 92,
    opposition_vulnerability: 76,
    matchup_strength: 84,
    context_fit: 88,
    injury_risk: 18,
    confidence: 82,
  },
  context: {
    venue: 'MA Chidambaram, Chennai',
    weather: 'Hot / Dry',
    pitch_type: 'Spin-Friendly',
    match_phase: 'Middle Overs',
    tactical_mode: 'Spin Pressure Mode',
  },
  simulation: {
    field_setup: [
      { role: 'Wicket-keeper',   x: 50, y: 58, color: '#00e5a0' },
      { role: 'Slip',            x: 56, y: 54, color: '#00e5a0' },
      { role: 'Point',           x: 70, y: 48, color: '#38bdf8' },
      { role: 'Cover',           x: 65, y: 38, color: '#38bdf8' },
      { role: 'Mid-off',         x: 55, y: 26, color: '#38bdf8' },
      { role: 'Mid-on',          x: 45, y: 26, color: '#38bdf8' },
      { role: 'Mid-wicket',      x: 33, y: 38, color: '#38bdf8' },
      { role: 'Square Leg',      x: 30, y: 50, color: '#38bdf8' },
      { role: 'Fine Leg',        x: 40, y: 72, color: '#fbbf24' },
      { role: 'Deep Midwicket',  x: 22, y: 70, color: '#fbbf24' },
      { role: 'Long Off',        x: 60, y: 14, color: '#fbbf24' },
    ],
    timeline: [
      { over: '8.1', action: 'Attack with wrist spin — slip in place', mode: 'Attack' },
      { over: '8.3', action: 'Maxwell plays across line — near edge caught', mode: 'Attack' },
      { over: '8.5', action: 'Dot ball — contain and build pressure', mode: 'Contain' },
      { over: '9.0', action: 'Promote aggressor if wicket falls next ball', mode: 'Attack' },
      { over: '9.2', action: 'Shift to boundary protection — long-on back', mode: 'Contain' },
      { over: '9.6', action: 'Rotate strike — deny Maxwell strike', mode: 'Contain' },
      { over: '10.0', action: 'Switch to full containment field + pace option', mode: 'Contain' },
    ],
  },
}

export const MOCK_PLAYER_INSIGHT = {
  'Suryakumar Yadav': {
    name: 'Suryakumar Yadav',
    role: 'Finisher / 360° Batter',
    team: 'India',
    form_trend: [
      { innings: 1, runs: 46, sr: 162 },
      { innings: 2, runs: 72, sr: 220 },
      { innings: 3, runs: 18, sr: 138 },
      { innings: 4, runs: 91, sr: 234 },
      { innings: 5, runs: 56, sr: 186 },
    ],
    phase_performance: [
      { phase: 'Powerplay', sr: 148, avg: 32 },
      { phase: 'Middle',    sr: 178, avg: 48 },
      { phase: 'Death',     sr: 212, avg: 38 },
    ],
    signals: {
      pressure_stability: 78,
      acceleration_upside: 96,
      injury_risk: 12,
      matchup_strength: 88,
    },
    tactical_summary:
      'SKY is most dangerous in middle overs vs spin. His 360° game makes boundary-setting nearly impossible. Best deployed when chase pressure demands acceleration. Avoid overexposure to pace in powerplay.',
  },
}
