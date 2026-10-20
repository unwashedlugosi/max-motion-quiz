/* Max's Motion Test Prep - question bank.
   Defines window.TOPICS and window.QUESTION_BANK. See SPEC.md for the contract. */
(function () {
  /* The teacher's official wording, character for character (capitalization included, no trailing period).
     Wherever a definition is shown as the official or correct one, it is "<Term>: <Definition>" or the bare
     definition, using these strings unchanged. */
  window.OFFICIAL_DEFINITIONS = [
    { id: 'motion',                term: 'Motion',                def: 'Change in position' },
    { id: 'acceleration',          term: 'Acceleration',          def: 'The rate of change in velocity/speed' },
    { id: 'reference-point',       term: 'Reference Point',       def: 'The location of the observer of motion' },
    { id: 'velocity',              term: 'Velocity',              def: 'Describing a moving object using speed and direction' },
    { id: 'constant-speed',        term: 'Constant Speed',        def: 'A speed that does not vary or change' },
    { id: 'negative-acceleration', term: 'Negative Acceleration', def: 'When an object\'s speed decreases' },
    { id: 'positive-acceleration', term: 'Positive Acceleration', def: 'When an object\'s speed increases' }
  ];
  window.TOPICS = [
    { id: 'defs',     name: 'The 7 key definitions' },
    { id: 'motion',   name: 'Motion & reference point' },
    { id: 'speed',    name: 'Speed & average speed' },
    { id: 'math',     name: 'Speed math (s = d ÷ t)' },
    { id: 'velocity', name: 'Velocity' },
    { id: 'accel',    name: 'Acceleration' },
    { id: 'graphs',   name: 'Distance-time graphs' },
    { id: 'mission',  name: 'The Motion Mission robot' }
  ];

  var Q = [];

  /* Robot hallway data from the Motion Mission handout: [time (s), distance (m)] */
  var ROBOT = [[0,0],[2,4],[4,8],[6,12],[8,16],[10,20],[12,20],[14,20],[16,24],[18,32],[20,44],[22,52],[24,56],[26,58],[28,58]];

  function dg(type, params, interactive) {
    return { type: type, params: params || {}, interactive: !!interactive };
  }
  /* dtgraph showing the robot data */
  function robotGraph(extra) {
    var p = { points: ROBOT, xMax: 28, yMax: 60, xStep: 4, yStep: 10 };
    for (var k in (extra || {})) { p[k] = extra[k]; }
    return dg('dtgraph', p, false);
  }

  /* ============================================================
     TOPIC 1: MOTION & REFERENCE POINT
     ============================================================ */
  Q.push(
    {
      id: 'motion-01', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'Which is the best definition of **motion**?',
      choices: [
        'Change in position',
        'How fast an object is going',
        'Being pushed or pulled by a force',
        'The total distance an object travels'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Motion: Change in position',
        'That is speed. Speed tells how fast the position changes.',
        'A push or pull is a force. A force can start motion, but it is not the definition of motion.',
        'That is distance. Distance is how far something moved. Motion: Change in position'
      ],
      explain: 'Your teacher\'s definition: **Motion: Change in position**\nIf something is in a different place than before, it moved.',
      example: 'A soccer ball rolling from the midfield line to the goal is in motion.',
      hint: 'Think about the word position.'
    },
    {
      id: 'motion-02', topic: 'motion', type: 'short', difficulty: 1,
      prompt: 'Explain **motion** in your own words.',
      short: {
        modelAnswer: 'Motion: Change in position\nA moving object ends up in a different place than before.',
        keyIdeas: [
          { id: 'change', text: 'says it is a change (something is changing or moving)', keywords: ['change','changing','changes','changed','different','moves from','goes from','move from','one place to another','switch','shift'] },
          { id: 'position', text: 'mentions position, place, or location', keywords: ['position','place','location','spot','where','somewhere','somewhere else'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Motion: Change in position**\nSay what is changing: the place where the object is.',
      hint: 'Use the words change and position.'
    },
    {
      id: 'motion-03', topic: 'motion', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of **motion**. Say what moves and where it goes.',
      short: {
        modelAnswer: 'A school bus drives from the school to my street. Its position changes, so it is in motion.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','bike','bicycle','bus','ball','soccer','football','basketball','run','running','walk','walking','swim','swimming','roll','rolling','fly','flying','train','plane','airplane','skate','skateboard','kick','throw','thrown','drive','driving','roller coaster','coaster','elevator','merry','horse','dog','cat','bird','boat','person','kid','runner','scooter','rocket'] },
          { id: 'place', text: 'says it goes from one place to another', keywords: ['from','to','across','down','up','toward','towards','past','around','position','place','moves','moved','went','goes','going','travel'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'Any moving thing works. It is **motion** because its position changes.',
      example: 'A swimmer going from one end of the pool to the other.'
    },
    {
      id: 'motion-04', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'What is the **position** of an object?',
      choices: [
        'Where the object is, compared to a reference point',
        'How fast the object is moving',
        'The total distance the object has traveled',
        'The direction the object is facing'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Position is a location, and you describe it by comparing it to a reference point.',
        'That is speed, not position.',
        'That is distance. An object can travel far and still end up at a position close to where it began.',
        'Facing a direction is not the same as being at a place.'
      ],
      explain: '**Position** is where an object is. We describe it by comparing it to a reference point.',
      example: 'My desk is 2 meters east of the classroom door.'
    },
    {
      id: 'motion-05', topic: 'motion', type: 'short', difficulty: 1,
      prompt: 'Explain **position** in your own words.',
      short: {
        modelAnswer: 'Position is where an object is. You say it by comparing the spot to something else, like a door or a tree.',
        keyIdeas: [
          { id: 'where', text: 'says position is where something is (its location or place)', keywords: ['where','location','place','spot','located','area','situated'] },
          { id: 'compare', text: 'says it is described compared to another thing (a reference point)', keywords: ['compare','compared','from','away','reference','relative','next to','near','far from','distance from','starting point','landmark','point'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: '**Position** means where an object is, described by comparing it to a reference point.',
      hint: 'Where is it?'
    },
    {
      id: 'motion-06', topic: 'motion', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of a **position**. Use a number and a direction or a landmark.',
      short: {
        modelAnswer: 'The soccer ball is 10 meters in front of the goal. The goal is the reference point.',
        keyIdeas: [
          { id: 'landmark', text: 'compares the place to something (a door, goal, tree, school, start line)', keywords: ['from','of the','in front','behind','next to','near','away','north','south','east','west','left','right','door','goal','tree','school','house','home','line','start','desk','wall','corner','across','top','bottom'] },
          { id: 'measure', text: 'gives a distance or number', keywords: ['meter','meters','metre','feet','foot','ft','yard','yards','mile','miles','km','kilometer','step','steps','cm','inch','inches','10','5','3','2','20','100','far'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'A good **position** says where something is compared to a landmark, like 3 meters east of the door.'
    },
    {
      id: 'motion-07', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'What is a **reference point**?',
      choices: [
        'The location of the observer of motion',
        'The starting line of a race',
        'The fastest object in the picture',
        'The place where an object stops'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Reference Point: The location of the observer of motion\nYou compare the object to it to see if it moves.',
        'A starting line is not where the observer is. Reference Point: The location of the observer of motion',
        'Speed has nothing to do with it. A reference point does not have to move at all.',
        'The stopping place is a position, not the thing you measure from.'
      ],
      explain: 'Your teacher\'s definition: **Reference Point: The location of the observer of motion**\nYou compare an object to it to see if it moves.',
      example: 'You stand on the sidewalk and watch a bike go by. You are the reference point.'
    },
    {
      id: 'motion-08', topic: 'motion', type: 'short', difficulty: 2,
      prompt: 'Explain what a **reference point** is, in your own words.',
      short: {
        modelAnswer: 'Reference Point: The location of the observer of motion\nIt is where the person watching is.',
        keyIdeas: [
          { id: 'observer', text: 'says it is the observer, or the place where the person watching is', keywords: ['observer','observers','observing','watching','watcher','person who','who is watching','who watches','looking','looker','viewer','where you are','where they are','where the person','person standing','point of view','sees','seeing'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Reference Point: The location of the observer of motion**\nIt is where the person watching is.',
      hint: 'Who is watching, and from where?'
    },
    {
      id: 'motion-09', topic: 'motion', type: 'short', difficulty: 2,
      prompt: 'Give a real-life example that includes a **reference point**. Say what the reference point is.',
      short: {
        modelAnswer: 'I stand on the sidewalk and a bike rides past. I am the reference point, so the bike is moving compared to me.',
        keyIdeas: [
          { id: 'ref', text: 'names who or what is watching or measuring from', keywords: ['i am','i was','me','my','standing','sitting','sidewalk','platform','tree','building','house','school','desk','wall','pole','sign','ground','bus stop','station','seat','observer','watching','looking','view','from'] },
          { id: 'obj', text: 'names a thing that moves or stays still compared to it', keywords: ['bike','car','bus','train','ball','runner','person','plane','dog','boat','moving','moves','still','passes','past','goes by','rides','drives','walks','walking','running'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'A good example names the watcher (the **reference point**) and what moves compared to them.',
      example: 'You sit on a school bus. The tree outside looks like it moves backward compared to you.'
    },
    {
      id: 'motion-10', topic: 'motion', type: 'blank', difficulty: 1, source: 'review-1',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'Motion is a change in ___. The rate of change of motion is ___.',
      bank: ['position', 'speed', 'time', 'direction', 'distance'],
      answer: ['position', 'speed'],
      explain: 'Your teacher\'s definition: **Motion: Change in position**\nHow fast the position changes is **speed**.',
      hint: 'The first word starts with p. The second starts with s.'
    },
    {
      id: 'motion-11', topic: 'motion', type: 'blank', difficulty: 1, source: 'review-2',
      prompt: 'Fill in the blank from the word bank.',
      text: 'The location of the observer of motion is the ___ point.',
      bank: ['reference', 'starting', 'finish', 'position'],
      answer: ['reference'],
      explain: 'Your teacher\'s definition: **Reference Point: The location of the observer of motion**\nYou compare the moving object to it.',
      hint: 'It starts with r.'
    },
    {
      id: 'motion-12', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'Compared with the school building, which is an example of **motion**?',
      choices: [
        'A soccer ball rolling toward the goal',
        'A backpack hanging on a hook',
        'A bike locked to the rack',
        'A closed classroom door'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The ball\'s position is changing, so it is in motion.',
        'The backpack stays in the same place. No change in position.',
        'The bike stays in the same place. No change in position.',
        'The door stays in the same place. No change in position.'
      ],
      explain: 'Only the rolling ball changes its position, so only the ball is in **motion**.'
    },
    {
      id: 'motion-13', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'Compared with the ground, which is **NOT** an example of motion?',
      choices: [
        'A skateboard rolling down a ramp',
        'A bird flying over the park',
        'A swimmer doing laps',
        'A school bus parked in the lot'
      ],
      answer: 3,
      choiceFeedback: [
        'The skateboard\'s position is changing. That is motion.',
        'The bird\'s position is changing. That is motion.',
        'The swimmer\'s position is changing. That is motion.',
        'Right. The parked bus stays in the same position, so it is not in motion compared with the ground.'
      ],
      explain: 'The parked bus does not change position. No change in position means no **motion**.'
    },
    {
      id: 'motion-14', topic: 'motion', type: 'mc', difficulty: 2,
      prompt: 'A train rolls past a station. You are standing on the platform. From the platform, what is moving?',
      diagram: dg('reference', { viewpoint: 'platform', trainSpeed: 1 }, false),
      choices: [
        'The train',
        'The tree',
        'The person standing on the platform',
        'Nothing is moving'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The platform is the reference point, and the train changes position compared to it.',
        'The tree stays in the same place compared to the platform.',
        'The person on the platform stays in the same place compared to the platform.',
        'The train is clearly moving compared to the platform.'
      ],
      explain: 'The platform is the **reference point**, and the train changes position compared to it. Now the view switches to the train, and the reference point changes.'
    },
    {
      id: 'motion-15', topic: 'motion', type: 'manipulate', difficulty: 1,
      prompt: 'Use the switch below the picture.',
      goalText: 'Switch the view so the passenger looks still.',
      diagram: dg('reference', { viewpoint: 'platform', trainSpeed: 1 }, true),
      goal: { key: 'viewpoint', op: 'eq', value: 'train' },
      explain: 'From inside the train, the passenger does not change position compared to the train. The scenery slides by instead. The **reference point** decides what looks like it is moving.'
    },
    {
      id: 'motion-16', topic: 'motion', type: 'manipulate', difficulty: 2,
      prompt: 'Use the switch below the picture.',
      goalText: 'Switch the view so the person on the platform looks still.',
      diagram: dg('reference', { viewpoint: 'train', trainSpeed: 1 }, true),
      goal: { key: 'viewpoint', op: 'eq', value: 'platform' },
      explain: 'When you watch from the platform, the person on the platform stays in one place. The train is the thing that moves. Change the **reference point** and the motion changes.'
    },
    {
      id: 'motion-17', topic: 'motion', type: 'tf', difficulty: 2,
      prompt: 'True or false: Whether an object looks like it is moving can depend on who is watching.',
      answer: true,
      falseFeedback: 'It is true. A passenger on a train sees the platform slide by, but a person on the platform sees it stay still.',
      explain: 'Motion is measured from a **reference point**. Different observers can use different reference points and see different motion.',
      example: 'Your friend sitting next to you on the bus looks still to you, but moves fast compared to a house outside.'
    },
    {
      id: 'motion-18', topic: 'motion', type: 'multi', difficulty: 2,
      prompt: 'Maya sits in her seat on a moving school bus. Select ALL the true statements.',
      choices: [
        'Maya is moving compared with the road.',
        'Maya is still compared with the bus driver.',
        'Maya is still compared with the road.',
        'Maya is moving compared with her own seat.'
      ],
      answers: [0, 1],
      explain: 'Maya moves compared with the road. She does not change position compared with the driver or her seat, because they move with her. The answer depends on the **reference point**.'
    },
    {
      id: 'motion-19', topic: 'motion', type: 'mc', difficulty: 1,
      prompt: 'Which sentence tells a **position**?',
      choices: [
        'The ball is 10 meters in front of the goal.',
        'The ball is going very fast.',
        'The ball rolled for 5 seconds.',
        'The ball is round and orange.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. It says where the ball is, compared to the goal.',
        'That is about speed, not where the ball is.',
        'That is a time, not a place.',
        'That describes the ball, not where it is.'
      ],
      explain: 'A **position** says where something is compared to a reference point. Here the goal is the reference point.'
    },
    {
      id: 'motion-20', topic: 'motion', type: 'short', difficulty: 3,
      prompt: 'A passenger on a moving train says, \'The tree is moving past me.\' A person at the station says, \'That tree is not moving.\' Explain how both can be right.',
      short: {
        modelAnswer: 'They use different reference points. Compared with the train the tree moves, but compared with the ground the tree stays still.',
        keyIdeas: [
          { id: 'ref', text: 'says they have different reference points or points of view', keywords: ['reference','point of view','perspective','viewpoint','who is watching','who is looking','where they are','where they stand','observer','depends','different place','different spot','different view','relative','from their'] },
          { id: 'compare', text: 'says the tree moves compared to the train but not compared to the ground', keywords: ['compared','compare','train is moving','train moves','moving train','ground','station','platform','tree stays','tree is still','tree does not move','tree doesn\'t move','not moving','standing still','stays in place','same place'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Each person uses a different **reference point**. The tree changes position compared to the train. It does not change position compared to the ground.'
    }
  );

  /* ============================================================
     TOPIC 2: SPEED & AVERAGE SPEED
     ============================================================ */
  Q.push(
    {
      id: 'speed-01', topic: 'speed', type: 'mc', difficulty: 1,
      prompt: 'Which is the best definition of **speed**?',
      choices: [
        'How far an object moves in a certain amount of time',
        'The total distance an object has traveled',
        'How fast an object moves and which way it goes',
        'How hard an object is pushed'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Speed is distance compared to time, like 5 meters every second. It is the rate of change of position.',
        'That is distance. Speed also needs time.',
        'That is velocity.\nVelocity: Describing a moving object using speed and direction',
        'That is a force. A push can start motion, but speed is how far an object moves in a given time.'
      ],
      explain: '**Speed** tells how far an object moves in a given time. It is the rate of change of position.',
      example: 'A cyclist who rides 10 meters every second has a speed of 10 m/s.'
    },
    {
      id: 'speed-02', topic: 'speed', type: 'short', difficulty: 1,
      prompt: 'Explain **speed** in your own words.',
      short: {
        modelAnswer: 'Speed is how fast something moves. It tells how much distance it covers in a certain time.',
        keyIdeas: [
          { id: 'fast', text: 'says how fast something moves (or how quickly it goes)', keywords: ['how fast','fast','quick','quickly','rate','how slow','slow','pace'] },
          { id: 'dt', text: 'mentions distance and time (how far in how long)', keywords: ['distance','how far','time','per','each','every','in a','divided','hour','second','minute','amount of time','length of time'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: '**Speed** is distance over time. It tells how far you go in one hour, one second, or another unit of time.',
      hint: 'How far in how long?'
    },
    {
      id: 'speed-03', topic: 'speed', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of **speed**. Use a number and a unit, like \'a bike goes ___ per ___\'.',
      short: {
        modelAnswer: 'A runner goes 5 meters per second. That is her speed.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','bike','bicycle','bus','ball','soccer','run','runner','running','walk','walking','swim','swimmer','train','plane','skate','skateboard','cheetah','horse','dog','boat','person','kid','scooter','jogger','rocket','snail','turtle'] },
          { id: 'rate', text: 'gives a speed with a unit (like per hour, mph, m/s)', keywords: ['per','mph','km/h','kph','m/s','meters','metres','miles','feet','ft/s','kilometers','every','each','hour','second','minute','/'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'A speed always has a distance unit over a time unit, like 12 miles per hour or 3 m/s.'
    },
    {
      id: 'speed-04', topic: 'speed', type: 'mc', difficulty: 2,
      prompt: 'What is **average speed**?',
      choices: [
        'Total distance divided by total time',
        'The average of the fastest speed and the slowest speed',
        'How fast an object is going at one exact moment',
        'Total time divided by total distance'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Average speed = total distance ÷ total time.',
        'Not quite. You do not average the speeds. You use the whole trip: all the distance and all the time.',
        'That is a speed at one instant, like what a speedometer shows. Average speed covers the whole trip.',
        'This one is upside down. Speed is distance over time, not time over distance.'
      ],
      explain: '**Average speed** is total distance divided by total time. It is one speed that describes the whole trip.',
      example: 'A family drives 200 miles in 4 hours. Their average speed is 50 miles per hour.'
    },
    {
      id: 'speed-05', topic: 'speed', type: 'short', difficulty: 2,
      prompt: 'Explain **average speed** in your own words. How do you find it?',
      short: {
        modelAnswer: 'Average speed is the total distance divided by the total time of the whole trip.',
        keyIdeas: [
          { id: 'total', text: 'says total (or whole, entire, all) distance and time', keywords: ['total','whole','entire','all the','all of','altogether','overall','everything','complete','full'] },
          { id: 'divide', text: 'says divide distance by time', keywords: ['divide','divided','÷','/','over','per','distance by time','distance over time','distance and time','distance and the time'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: '**Average speed** is total distance ÷ total time. Use the whole trip, not just one part.',
      hint: 'Total ÷ total.'
    },
    {
      id: 'speed-06', topic: 'speed', type: 'short', difficulty: 2,
      prompt: 'Give a real-life example of **average speed**. Include the total distance, the total time, and the answer.',
      short: {
        modelAnswer: 'We drove 120 miles to the lake in 3 hours. Our average speed was 120 ÷ 3 = 40 miles per hour.',
        keyIdeas: [
          { id: 'trip', text: 'describes a whole trip with a distance and a time', keywords: ['trip','drove','drive','rode','ride','walked','ran','run','biked','flew','miles','km','kilometers','meters','hours','minutes','seconds','total','whole','lap','race','to school','to the','from'] },
          { id: 'calc', text: 'divides distance by time or gives an average speed', keywords: ['divide','divided','÷','/','per hour','mph','km/h','m/s','per second','average speed','per minute','speed was','speed is'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'An average-speed example has a total distance and a total time. Divide them to get the **average speed**.'
    },
    {
      id: 'speed-07', topic: 'speed', type: 'mc', difficulty: 1,
      prompt: 'What is **constant speed**?',
      choices: [
        'A speed that does not vary or change',
        'Speed that is very fast',
        'Moving in a straight line',
        'Not moving at all'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Constant Speed: A speed that does not vary or change\nThe object is not speeding up or slowing down.',
        'Constant does not mean fast. A slow walk can be a constant speed.',
        'Direction does not matter for speed. A car can go in a circle at constant speed.',
        'Standing still is a speed of zero. Constant speed is usually used for things that are moving steadily.'
      ],
      explain: 'Your teacher\'s definition: **Constant Speed: A speed that does not vary or change**\nThe object is not speeding up or slowing down.',
      example: 'A moving walkway at the airport carries you at the same speed the whole way.'
    },
    {
      id: 'speed-08', topic: 'speed', type: 'short', difficulty: 1,
      prompt: 'Explain **constant speed** in your own words.',
      short: {
        modelAnswer: 'Constant Speed: A speed that does not vary or change\nThe object is not speeding up or slowing down.',
        keyIdeas: [
          { id: 'same', text: 'says the speed stays the same or does not change', keywords: ['same','steady','steadily','not change','does not change','doesn\'t change','doesnt change','never change','never changes','not vary','does not vary','doesn\'t vary','never varies','unchanging','stays','stay','keeps','consistent','stable','no change','not changing','not going up or down'] },
          { id: 'nospeed', text: 'says it is not speeding up or slowing down', keywords: ['not speeding','no speeding','not slowing','not speed','not slow','doesn\'t speed','does not speed','doesn\'t slow','does not slow','not faster','not slower','without speeding','without slowing','neither speeding','neither speed','no faster or slower','not faster or slower'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Constant Speed: A speed that does not vary or change**\nNo speeding up and no slowing down.'
    },
    {
      id: 'speed-09', topic: 'speed', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of **constant speed**.',
      short: {
        modelAnswer: 'A car on cruise control stays at exactly 60 miles per hour on a long highway.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','cruise','highway','escalator','walkway','conveyor','belt','treadmill','bike','bicycle','train','plane','merry','carousel','ferris','wheel','clock','minute hand','elevator','bus','runner','jogger','walk','boat','ride'] },
          { id: 'steady', text: 'says it keeps the same speed (or names something that always moves steadily)', keywords: ['same','steady','steadily','constant','not changing','doesn\'t change','does not change','doesnt change','keeps','stays','cruise','even','at a steady','60','50','55','5 mph','per hour','escalator','walkway','conveyor','treadmill','minute hand','whole time','whole way'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'A good example moves at the same speed the whole time, like an escalator or a car on cruise control.'
    },
    {
      id: 'speed-10', topic: 'speed', type: 'blank', difficulty: 1, source: 'review-3',
      prompt: 'Fill in the blank from the word bank.',
      text: 'Total distance ÷ total time = ___ speed.',
      bank: ['average', 'constant', 'maximum', 'final'],
      answer: ['average'],
      explain: 'Total distance divided by total time gives the **average** speed for the whole trip.',
      hint: 'It starts with a.'
    },
    {
      id: 'speed-11', topic: 'speed', type: 'blank', difficulty: 1, source: 'review-8',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'A constant speed is a speed that does ___ vary or change. The object is not speeding ___ or slowing ___.',
      bank: ['not', 'up', 'down', 'always', 'fast'],
      answer: ['not', 'up', 'down'],
      explain: 'Your teacher\'s definition: **Constant Speed: A speed that does not vary or change**\nThe object is not speeding up and not slowing down.'
    },
    {
      id: 'speed-12', topic: 'speed', type: 'mc', difficulty: 1,
      prompt: 'Which is the best example of **constant speed**?',
      choices: [
        'A car on cruise control, holding exactly 60 miles per hour',
        'A school bus that stops at every corner',
        'A sprinter leaving the starting blocks',
        'A ball rolling to a stop'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The speed stays the same, so there is no speeding up or slowing down.',
        'The bus slows down and speeds up at each stop. Its speed keeps changing.',
        'The sprinter is speeding up. Speed is changing.',
        'The ball is slowing down. Speed is changing.'
      ],
      explain: 'Cruise control keeps the car\'s speed from changing. That is **constant speed**.'
    },
    {
      id: 'speed-13', topic: 'speed', type: 'mc', difficulty: 1,
      prompt: 'Which one does **NOT** have constant speed?',
      choices: [
        'A moving walkway',
        'A skateboard slowing down to a stop',
        'The minute hand of a clock',
        'An escalator carrying people up'
      ],
      answer: 1,
      choiceFeedback: [
        'A walkway moves at a steady speed, so it is constant.',
        'Right. The skateboard\'s speed is getting smaller. That is not constant.',
        'The minute hand turns at a steady rate. That is constant.',
        'An escalator carries people at a steady speed. That is constant.'
      ],
      explain: 'A skateboard that is slowing down changes its speed. **Constant speed** means the speed stays the same.'
    },
    {
      id: 'speed-14', topic: 'speed', type: 'mc', difficulty: 1,
      prompt: 'Which one is a unit of **speed**?',
      choices: ['meters per second (m/s)', 'meters (m)', 'seconds (s)', 'kilograms (kg)'],
      answer: 0,
      choiceFeedback: [
        'Right. A speed unit is a distance unit divided by a time unit.',
        'Meters measure distance, not speed.',
        'Seconds measure time, not speed.',
        'Kilograms measure mass, not speed.'
      ],
      explain: 'A speed unit is distance ÷ time, so it has a distance unit over a time unit, like m/s or km/h.'
    },
    {
      id: 'speed-15', topic: 'speed', type: 'multi', difficulty: 1,
      prompt: 'Select ALL the units that can be used for **speed**.',
      choices: ['km/h', 'cm/s', 'kilometers', 'miles per hour', 'minutes', 'ft/s'],
      answers: [0, 1, 3, 5],
      explain: 'Speed units are distance over time. Kilometers and minutes are only a distance and a time by themselves.'
    },
    {
      id: 'speed-16', topic: 'speed', type: 'tf', difficulty: 2,
      prompt: 'True or false: To find average speed, add the speeds and divide by 2.',
      answer: false,
      falseFeedback: 'False. **Average speed** is total distance ÷ total time. You cannot just average two speeds, because the time spent at each speed may be different.',
      explain: '**Average speed** uses the whole trip: total distance ÷ total time. Averaging the speeds ignores how long you spent at each one.'
    },
    {
      id: 'speed-17', topic: 'speed', type: 'mc', difficulty: 3,
      prompt: 'A ball rolls 60 ft to a wall in 1 s, then bounces back 60 ft in 3 s. What is its **average speed** for the whole trip?',
      diagram: dg('bounce', { d1: 60, t1: 1, d2: 60, t2: 3, unit: 'ft', hide: ['totalD', 'totalT', 'avgS'] }, false),
      after: { hide: [] },
      choices: ['30 ft/s', '40 ft/s', '60 ft/s', '120 ft/s'],
      answer: 0,
      choiceFeedback: [
        'Right. Total distance is 120 ft and total time is 4 s. 120 ÷ 4 = 30 ft/s.',
        'This is the trap. The two leg speeds are 60 and 20 ft/s, and (60 + 20) ÷ 2 = 40. But more time was spent going slowly, so the average is lower.',
        '60 ft/s is just the speed of the first leg.',
        '120 ft is the total distance. You still need to divide by the time.'
      ],
      explain: '**Average speed** = total distance ÷ total time = 120 ÷ 4 = 30 ft/s. It is not the average of the two speeds.',
      hint: 'Find the total distance and total time first.'
    },
    {
      id: 'speed-18', topic: 'speed', type: 'numeric', difficulty: 1, source: 'review-17',
      prompt: 'A ball rolls 100 ft to a wall in 4 s, bounces back, and rolls 50 ft in 2 s. What is the **total distance** the ball traveled?',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft', hide: ['totalD', 'totalT', 'avgS'] }, false),
      after: { hide: ['avgS'] },
      numeric: { answer: 150, tolerance: 0.01, unit: 'ft', unitChoices: ['ft', 'ft/s', 's', 'ft·s'] },
      steps: ['Leg 1 = 100 ft', 'Leg 2 = 50 ft', 'Total distance = 100 + 50 = 150 ft'],
      explain: 'Add both legs. The ball went out and came back, and both count as distance.'
    },
    {
      id: 'speed-19', topic: 'speed', type: 'numeric', difficulty: 1, source: 'review-17',
      prompt: 'The ball rolls 100 ft in 4 s, then 50 ft in 2 s. What is the **total time**?',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft', hide: ['totalD', 'totalT', 'avgS'] }, false),
      after: { hide: ['avgS'] },
      numeric: { answer: 6, tolerance: 0.01, unit: 's', unitChoices: ['s', 'ft', 'ft/s', 'min'] },
      steps: ['Leg 1 = 4 s', 'Leg 2 = 2 s', 'Total time = 4 + 2 = 6 s'],
      explain: 'Add the time for both legs.'
    },
    {
      id: 'speed-20', topic: 'speed', type: 'numeric', difficulty: 2, source: 'review-17',
      prompt: 'The ball rolls 150 ft in total, and it takes 6 s in total. What is its **average speed**?',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft', hide: ['totalD', 'totalT', 'avgS'] }, false),
      after: { hide: [] },
      numeric: { answer: 25, tolerance: 0.01, unit: 'ft/s', unitChoices: ['ft/s', 'ft', 's', 'ft·s'] },
      steps: ['average speed = total distance ÷ total time', 'average speed = 150 ÷ 6', 'average speed = 25 ft/s'],
      explain: '**Average speed** = total distance ÷ total time = 150 ÷ 6 = 25 ft/s.'
    },
    {
      id: 'speed-21', topic: 'speed', type: 'manipulate', difficulty: 2,
      prompt: 'The ball starts with an average speed of 25 ft/s. Use the sliders.',
      goalText: 'Make the average speed 20 ft/s or less.',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft' }, true),
      goal: { key: 'avgS', op: 'lte', value: 20 },
      explain: 'Average speed is total distance ÷ total time. More time for the same distance gives a smaller **average speed**.'
    },
    {
      id: 'speed-22', topic: 'speed', type: 'bins', difficulty: 1,
      prompt: 'Tap each card into the right bin.',
      bins: {
        categories: [{ id: 'C', label: 'Constant speed' }, { id: 'N', label: 'Speed keeps changing' }],
        items: [
          { text: 'An escalator moving steadily', answer: 'C' },
          { text: 'A bus stopping at every corner', answer: 'N' },
          { text: 'A bike rolling to a stop at the bottom of a hill', answer: 'N' },
          { text: 'A car on cruise control', answer: 'C' },
          { text: 'A sprinter leaving the starting blocks', answer: 'N' },
          { text: 'A merry-go-round spinning at a steady rate', answer: 'C' }
        ]
      },
      explain: '**Constant speed** means the speed does not change. If something speeds up or slows down, its speed is changing.'
    },
    {
      id: 'speed-23', topic: 'speed', type: 'tf', difficulty: 2,
      prompt: 'True or false: An object with constant speed must be moving in a straight line.',
      answer: false,
      falseFeedback: 'False. A car can go around a circle at a steady 20 mph. Its speed is constant even though it keeps turning.',
      explain: '**Constant speed** only says the speed does not change. It says nothing about direction. A merry-go-round horse has constant speed while it goes in a circle.'
    }
  );

  /* ============================================================
     TOPIC 3: SPEED MATH
     ============================================================ */
  Q.push(
    {
      id: 'math-01', topic: 'math', type: 'numeric', difficulty: 2, source: 'review-4',
      prompt: 'A car travels 180 km in 4.5 hours. What is its speed?',
      diagram: dg('race', { d: 180, t: 4.5, dUnit: 'km', tUnit: 'h', hide: ['s'] }, false),
      after: { hide: [] },
      numeric: { answer: 40, tolerance: 0.01, unit: 'km/h', unitChoices: ['km/h', 'km', 'h', 'km·h'] },
      steps: ['s = d ÷ t', 's = 180 ÷ 4.5', 's = 40 km/h'],
      explain: 'Speed = distance ÷ time. 180 ÷ 4.5 = 40, and the unit is distance over time, so km/h.',
      hint: 'Dividing by a decimal is easier if you double both numbers: 180 ÷ 4.5 is the same as 360 ÷ 9.'
    },
    {
      id: 'math-02', topic: 'math', type: 'numeric', difficulty: 1,
      prompt: 'A bus travels 150 km in 3 hours at a steady rate. What is its speed?',
      diagram: dg('race', { d: 150, t: 3, dUnit: 'km', tUnit: 'h', hide: ['s'] }, false),
      after: { hide: [] },
      numeric: { answer: 50, tolerance: 0.01, unit: 'km/h', unitChoices: ['km/h', 'km', 'h', 'km·h'] },
      steps: ['s = d ÷ t', 's = 150 ÷ 3', 's = 50 km/h'],
      explain: 'Divide the distance by the time. 150 ÷ 3 = 50 km/h.'
    },
    {
      id: 'math-03', topic: 'math', type: 'numeric', difficulty: 1,
      prompt: 'A soccer ball rolls 45 meters in 9 seconds. What is its speed?',
      numeric: { answer: 5, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['s = d ÷ t', 's = 45 ÷ 9', 's = 5 m/s'],
      explain: 'Speed = distance ÷ time = 45 ÷ 9 = 5. Meters over seconds gives m/s.'
    },
    {
      id: 'math-04', topic: 'math', type: 'numeric', difficulty: 3,
      prompt: 'A skateboarder rolls 7.2 meters in 0.8 seconds. What is her speed?',
      numeric: { answer: 9, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['s = d ÷ t', 's = 7.2 ÷ 0.8', 'Multiply both by 10: 72 ÷ 8 = 9', 's = 9 m/s'],
      explain: 'To divide by a decimal, multiply both numbers by 10 so the number you divide by is whole. 7.2 ÷ 0.8 is the same as 72 ÷ 8 = 9.',
      hint: 'Make 0.8 into 8 by multiplying both numbers by 10.'
    },
    {
      id: 'math-05', topic: 'math', type: 'numeric', difficulty: 2,
      prompt: 'A bike travels at 12 km/h for 2.5 hours. How far does it go?',
      diagram: dg('formula', { cover: null }, false),
      after: { cover: 'd', values: { s: 12, t: 2.5 } },
      numeric: { answer: 30, tolerance: 0.01, unit: 'km', unitChoices: ['km', 'km/h', 'h', 'km·h'] },
      steps: ['d = s × t', 'd = 12 × 2.5', 'd = 30 km'],
      explain: 'To find distance, multiply speed by time. 12 × 2.5 = 30 km.',
      hint: 'Cover d in the triangle.'
    },
    {
      id: 'math-06', topic: 'math', type: 'numeric', difficulty: 2,
      prompt: 'A train travels 90 km at a steady 45 km/h. How long does the trip take?',
      diagram: dg('formula', { cover: null }, false),
      after: { cover: 't', values: { d: 90, s: 45 } },
      numeric: { answer: 2, tolerance: 0.01, unit: 'h', unitChoices: ['h', 'km', 'km/h', 'km·h'] },
      steps: ['t = d ÷ s', 't = 90 ÷ 45', 't = 2 h'],
      explain: 'To find time, divide distance by speed. 90 ÷ 45 = 2 hours.',
      hint: 'Cover t in the triangle.'
    },
    {
      id: 'math-07', topic: 'math', type: 'numeric', difficulty: 2,
      prompt: 'A car goes 90 km/h for half an hour (0.5 h). How far does it go?',
      numeric: { answer: 45, tolerance: 0.01, unit: 'km', unitChoices: ['km', 'km/h', 'h', 'km·h'] },
      steps: ['d = s × t', 'd = 90 × 0.5', 'd = 45 km'],
      explain: 'Distance = speed × time. Half of 90 is 45, so 45 km.'
    },
    {
      id: 'math-08', topic: 'math', type: 'numeric', difficulty: 3,
      prompt: 'A robot rolls at 4.5 m/s. How long does it take to go 18 meters?',
      numeric: { answer: 4, tolerance: 0.01, unit: 's', unitChoices: ['s', 'm', 'm/s', 'm·s'] },
      steps: ['t = d ÷ s', 't = 18 ÷ 4.5', 't = 4 s'],
      explain: 'Time = distance ÷ speed. 18 ÷ 4.5 = 4, because 4.5 × 4 = 18.'
    },
    {
      id: 'math-09', topic: 'math', type: 'numeric', difficulty: 2,
      prompt: 'A toy car goes 3 meters in 0.5 seconds. What is its speed?',
      numeric: { answer: 6, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['s = d ÷ t', 's = 3 ÷ 0.5', 's = 6 m/s'],
      explain: 'There are two halves in every second, so in 1 second it goes twice as far: 6 m. Speed = 3 ÷ 0.5 = 6 m/s.'
    },
    {
      id: 'math-10', topic: 'math', type: 'numeric', difficulty: 3,
      prompt: 'A bike rides 12 km at 6 km/h, then 12 km at 12 km/h. What is the **average speed** for the whole ride?',
      numeric: { answer: 8, tolerance: 0.01, unit: 'km/h', unitChoices: ['km/h', 'km', 'h', 'km·h'] },
      steps: ['Time 1 = 12 ÷ 6 = 2 h', 'Time 2 = 12 ÷ 12 = 1 h', 'Total distance = 24 km, total time = 3 h', 'average speed = 24 ÷ 3 = 8 km/h'],
      explain: '**Average speed** is total distance ÷ total time. The bike spent more time going slowly, so the answer is 8, not the 9 you get by averaging 6 and 12.',
      hint: 'Find the time for each part first.'
    },
    {
      id: 'math-11', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'Before, the car went 100 km in 2 hours. Now it goes the same 100 km but takes 4 hours. Compared with before, its speed is:',
      diagram: dg('race', { d: 100, t: 4, dUnit: 'km', tUnit: 'h', ghost: { d: 100, t: 2 } }, false),
      choices: ['Half as fast', 'Twice as fast', 'The same', 'Four times as fast'],
      answer: 0,
      choiceFeedback: [
        'Right. Same distance, double the time. Speed goes from 50 km/h to 25 km/h.',
        'It is the other way around. More time for the same distance means slower.',
        'The distance stayed the same, but the time changed, so the speed changed too.',
        'Doubling the time does not make the car faster.'
      ],
      explain: 'Speed = d ÷ t. If the distance stays the same and the time doubles, the speed is cut in half.'
    },
    {
      id: 'math-12', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'Before, the car went 100 km in 2 hours. Now it goes 200 km in the same 2 hours. Compared with before, its speed is:',
      diagram: dg('race', { d: 200, t: 2, dUnit: 'km', tUnit: 'h', ghost: { d: 100, t: 2 } }, false),
      choices: ['Twice as fast', 'Half as fast', 'The same', 'It cannot be told'],
      answer: 0,
      choiceFeedback: [
        'Right. Double the distance in the same time means double the speed: 100 km/h instead of 50 km/h.',
        'More distance in the same time is faster, not slower.',
        'The distance changed, so the speed changed.',
        'We can tell. Speed = d ÷ t, and both numbers are given.'
      ],
      explain: 'Same time, more distance means a faster speed. Double the distance doubles the speed.'
    },
    {
      id: 'math-13', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'Before, the car went 100 km in 2 hours. Now it goes 200 km in 4 hours. Compared with before, its speed is:',
      diagram: dg('race', { d: 200, t: 4, dUnit: 'km', tUnit: 'h', ghost: { d: 100, t: 2 } }, false),
      choices: ['The same', 'Twice as fast', 'Half as fast', 'Four times as fast'],
      answer: 0,
      choiceFeedback: [
        'Right. Both are 50 km/h. The distance doubled and the time doubled, so they cancel out.',
        'Doubling the distance would double the speed, but the time also doubled.',
        'Doubling the time would halve the speed, but the distance also doubled.',
        'Multiplying the numbers is not how it works. Speed is d ÷ t.'
      ],
      explain: 'When distance and time both double, the speed stays the same. 100 ÷ 2 = 50 and 200 ÷ 4 = 50.'
    },
    {
      id: 'math-14', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'Before, the car went 120 km in 4 hours. Now it goes the same 120 km but in only 2 hours. Compared with before, its speed is:',
      diagram: dg('race', { d: 120, t: 2, dUnit: 'km', tUnit: 'h', ghost: { d: 120, t: 4 } }, false),
      choices: ['Twice as fast', 'Half as fast', 'The same', 'Two hours faster'],
      answer: 0,
      choiceFeedback: [
        'Right. Half the time for the same distance means double the speed: 60 km/h instead of 30 km/h.',
        'Less time for the same distance is faster, not slower.',
        'The time changed, so the speed changed.',
        'Speed is not measured in hours. It is distance over time.'
      ],
      explain: 'Cutting the time in half doubles the speed. 120 ÷ 4 = 30 and 120 ÷ 2 = 60.'
    },
    {
      id: 'math-15', topic: 'math', type: 'multi', difficulty: 2,
      prompt: 'A car goes 60 km in 2 hours. Which new trips would make its speed LARGER? Select all that apply.',
      choices: ['60 km in 1 hour', '120 km in 2 hours', '60 km in 4 hours', '90 km in 3 hours'],
      answers: [0, 1],
      explain: 'The first car goes 30 km/h. Both 60 km in 1 h and 120 km in 2 h are 60 km/h, so they are faster. 60 km in 4 h is 15 km/h, and 90 km in 3 h is 30 km/h, the same.'
    },
    {
      id: 'math-16', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'Which runner has the greatest **speed**?',
      choices: [
        'Runner A: 60 m in 10 s',
        'Runner B: 45 m in 5 s',
        'Runner C: 100 m in 20 s',
        'Runner D: 24 m in 4 s'
      ],
      answer: 1,
      choiceFeedback: [
        'A goes 60 ÷ 10 = 6 m/s. That is not the fastest.',
        'Right. B goes 45 ÷ 5 = 9 m/s, which is the greatest.',
        'C goes 100 ÷ 20 = 5 m/s. The longest distance does not mean the fastest speed.',
        'D goes 24 ÷ 4 = 6 m/s.'
      ],
      explain: 'Divide each distance by its time. The speeds are 6, 9, 5, and 6 m/s. Runner B is fastest even though C went the farthest.'
    },
    {
      id: 'math-17', topic: 'math', type: 'manipulate', difficulty: 2,
      prompt: 'Use both sliders.',
      goalText: 'Make the car\'s speed 40 km/h.',
      diagram: dg('race', { d: 20, t: 2, dUnit: 'km', tUnit: 'h', sliders: ['d', 't'], range: { d: [0, 100, 5], t: [0.5, 5, 0.5] } }, true),
      goal: { key: 's', op: 'eq', value: 40, tol: 0.01 },
      explain: 'Speed = distance ÷ time. Many pairs work: 80 km in 2 h, 120 km in 3 h, or 160 km in 4 h are all 40 km/h.'
    },
    {
      id: 'math-18', topic: 'math', type: 'manipulate', difficulty: 2,
      prompt: 'The time is stuck at 2 hours. Use the distance slider.',
      goalText: 'Make the speed 50 km/h.',
      diagram: dg('race', { d: 20, t: 2, dUnit: 'km', tUnit: 'h', sliders: ['d'], range: { d: [0, 120, 5], t: [0.5, 5, 0.5] } }, true),
      goal: { key: 's', op: 'eq', value: 50, tol: 0.01 },
      explain: 'Speed = d ÷ t, so d = s × t = 50 × 2 = 100 km. A longer distance in the same time means a faster speed.'
    },
    {
      id: 'math-19', topic: 'math', type: 'manipulate', difficulty: 3,
      prompt: 'The car now goes 40 km in 2 hours (20 km/h). Use both sliders.',
      goalText: 'Keep the speed at 20 km/h, but make the trip take 4 hours.',
      diagram: dg('race', { d: 40, t: 2, dUnit: 'km', tUnit: 'h', sliders: ['d', 't'], range: { d: [0, 100, 5], t: [0.5, 5, 0.5] } }, true),
      goal: [{ key: 's', op: 'eq', value: 20, tol: 0.01 }, { key: 't', op: 'eq', value: 4, tol: 0.01 }],
      explain: 'If the time doubles, the distance must double too to keep the speed the same. 80 km in 4 h is still 20 km/h.'
    },
    {
      id: 'math-20', topic: 'math', type: 'manipulate', difficulty: 2,
      prompt: 'The distance is stuck at 60 km. Use the time slider.',
      goalText: 'Make the car at least 30 km/h.',
      diagram: dg('race', { d: 60, t: 4, dUnit: 'km', tUnit: 'h', sliders: ['t'], range: { d: [0, 100, 5], t: [0.5, 5, 0.5] } }, true),
      goal: { key: 's', op: 'gte', value: 30 },
      explain: 'For the same distance, less time means a faster speed. 60 km in 2 h is 30 km/h. Even less time is even faster.'
    },
    {
      id: 'math-21', topic: 'math', type: 'manipulate', difficulty: 2,
      prompt: 'The distance is stuck at 60 km. Use the time slider.',
      goalText: 'Make the car slow, 10 km/h or less.',
      diagram: dg('race', { d: 60, t: 2, dUnit: 'km', tUnit: 'h', sliders: ['t'], range: { d: [0, 100, 5], t: [0.5, 10, 0.5] } }, true),
      goal: { key: 's', op: 'lte', value: 10 },
      explain: 'More time for the same distance means a slower speed. 60 km in 6 h is 10 km/h.'
    },
    {
      id: 'math-22', topic: 'math', type: 'manipulate', difficulty: 1,
      prompt: 'You know the distance and the speed. You want the time.',
      goalText: 'Tap the letter to cover so the triangle shows the formula for time.',
      diagram: dg('formula', { cover: null }, true),
      goal: { key: 'cover', op: 'eq', value: 't' },
      explain: 'Cover t and what is left is d over s. So **t = d ÷ s**.'
    },
    {
      id: 'math-23', topic: 'math', type: 'manipulate', difficulty: 1,
      prompt: 'You know the speed and the time. You want the distance.',
      goalText: 'Tap the letter to cover so the triangle shows the formula for distance.',
      diagram: dg('formula', { cover: null }, true),
      goal: { key: 'cover', op: 'eq', value: 'd' },
      explain: 'Cover d and what is left is s next to t. So **d = s × t**.'
    },
    {
      id: 'math-24', topic: 'math', type: 'mc', difficulty: 2,
      prompt: 'You know that s = d ÷ t. Which formula finds the **time**?',
      diagram: dg('formula', { cover: null }, false),
      after: { cover: 't' },
      choices: ['t = d ÷ s', 't = s ÷ d', 't = d × s', 't = d − s'],
      answer: 0,
      choiceFeedback: [
        'Right. Divide the distance by the speed to get the time.',
        'This is upside down. Check units: m/s ÷ m does not give seconds.',
        'Multiplying distance and speed does not give a time. Speed times time gives distance.',
        'You cannot subtract a speed from a distance. They are different kinds of measurements.'
      ],
      explain: 'Rearrange s = d ÷ t. Swap s and t to get **t = d ÷ s**.',
      hint: 'Use the triangle. Cover t.'
    },
    {
      id: 'math-25', topic: 'math', type: 'mc', difficulty: 1,
      prompt: 'Which formula finds **distance** when you know speed and time?',
      choices: ['d = s × t', 'd = s ÷ t', 'd = t ÷ s', 'd = s + t'],
      answer: 0,
      choiceFeedback: [
        'Right. Speed times time gives distance. 10 m/s for 5 s is 50 m.',
        'Dividing speed by time does not give a distance.',
        'Dividing time by speed does not give a distance.',
        'You cannot add a speed and a time. They are different kinds of measurements.'
      ],
      explain: 'Speed tells how far you go each second. Multiply by the number of seconds to get **d = s × t**.'
    },
    {
      id: 'math-26', topic: 'math', type: 'mc', difficulty: 1,
      prompt: 'A car goes 150 km in 3 hours. Which is the correct answer for its speed?',
      choices: ['50 km/h', '50 km', '50 h', '450 km/h'],
      answer: 0,
      choiceFeedback: [
        'Right. 150 ÷ 3 = 50, and a speed unit is distance over time.',
        'A km alone is a distance, not a speed.',
        'An h alone is a time, not a speed.',
        '450 is 150 × 3. For speed, divide instead.'
      ],
      explain: 'Speed = distance ÷ time = 150 ÷ 3 = 50. The unit is km/h because it is km divided by h.'
    },
    {
      id: 'math-27', topic: 'math', type: 'bins', difficulty: 1,
      prompt: 'Tap each unit into the right bin.',
      bins: {
        categories: [{ id: 'D', label: 'Distance' }, { id: 'T', label: 'Time' }, { id: 'S', label: 'Speed' }],
        items: [
          { text: 'kilometers', answer: 'D' },
          { text: 'm/s', answer: 'S' },
          { text: 'hours', answer: 'T' },
          { text: 'centimeters', answer: 'D' },
          { text: 'miles per hour', answer: 'S' },
          { text: 'seconds', answer: 'T' },
          { text: 'ft/s', answer: 'S' },
          { text: 'minutes', answer: 'T' }
        ]
      },
      explain: 'A speed unit is always a distance unit divided by a time unit, like m/s or miles per hour.'
    },
    {
      id: 'math-28', topic: 'math', type: 'short', difficulty: 3,
      prompt: 'Car A goes 100 km in 2 hours. Car B goes 200 km in 4 hours. Explain why they have the same speed.',
      short: {
        modelAnswer: 'Car B goes twice as far but also takes twice as long. Both are 50 km per hour, because 100 ÷ 2 and 200 ÷ 4 are both 50.',
        keyIdeas: [
          { id: 'double', text: 'says B has double the distance and double the time (they cancel out)', keywords: ['double','twice','2 times','two times','cancel','2x','times as','ratio','proportional','same ratio','as far','as long'] },
          { id: 'calc', text: 'divides to get 50 km/h for both', keywords: ['50','fifty','divide','divided','÷','/','per hour','km/h','kph','same rate'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Doubling the distance and the time together leaves the **speed** unchanged. Both cars go 50 km/h.'
    },
    {
      id: 'math-29', topic: 'math', type: 'tf', difficulty: 1,
      prompt: 'True or false: If you travel at the same speed for more time, you go farther.',
      answer: true,
      falseFeedback: 'It is true. d = s × t, so more time at the same speed means more distance.',
      explain: 'Distance = speed × time. At 5 m/s you go 50 m in 10 s but 100 m in 20 s.'
    }
  );

  /* ============================================================
     TOPIC 4: VELOCITY
     ============================================================ */
  Q.push(
    {
      id: 'velocity-01', topic: 'velocity', type: 'mc', difficulty: 1,
      prompt: 'Which is the best definition of **velocity**?',
      choices: [
        'Describing a moving object using speed and direction',
        'How fast an object moves',
        'How far an object has moved from its start',
        'How hard an object is pushed'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Velocity: Describing a moving object using speed and direction',
        'That is only speed. Velocity needs the direction too.',
        'That is a distance or displacement. Velocity is about speed and direction.',
        'That is a force, not velocity. Velocity: Describing a moving object using speed and direction'
      ],
      explain: 'Your teacher\'s definition: **Velocity: Describing a moving object using speed and direction**\nSaying 20 mph is a speed. Saying 20 mph north is a velocity.',
      example: 'A plane flying 500 mph toward the east has a velocity.'
    },
    {
      id: 'velocity-02', topic: 'velocity', type: 'short', difficulty: 1,
      prompt: 'Explain **velocity** in your own words. How is it different from speed?',
      short: {
        modelAnswer: 'Velocity: Describing a moving object using speed and direction\nSpeed only tells how fast, but velocity also tells which way.',
        keyIdeas: [
          { id: 'dir', text: 'says velocity includes direction (which way it goes)', keywords: ['direction','which way','way','north','south','east','west','heading','where it is going','where it\'s going','toward','towards','turn','path'] },
          { id: 'speed', text: 'says velocity includes speed (how fast)', keywords: ['speed','how fast','fast','rate','quick'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Velocity: Describing a moving object using speed and direction**\nIf you leave out the direction, you only have speed.',
      hint: 'Speed plus what?'
    },
    {
      id: 'velocity-03', topic: 'velocity', type: 'short', difficulty: 2,
      prompt: 'Give a real-life example of a **velocity**. Include a speed, a unit, and a direction.',
      short: {
        modelAnswer: 'A bike rides 10 miles per hour toward the north. That is a velocity because it has speed and direction.',
        keyIdeas: [
          { id: 'speed', text: 'gives a speed with a unit', keywords: ['mph','km/h','m/s','per hour','per second','miles','meters','kilometers','feet','ft/s','fast','kph','/'] },
          { id: 'dir', text: 'gives a direction', keywords: ['north','south','east','west','northeast','southwest','northwest','southeast','up','down','left','right','toward','towards','forward','backward','away','home','school','ne','nw','se','sw','heading'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'A velocity example must have both parts: a speed with a unit, like 5 m/s, and a direction, like east.'
    },
    {
      id: 'velocity-04', topic: 'velocity', type: 'blank', difficulty: 1, source: 'review-5',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'Velocity is describing a moving object using ___ and ___.',
      bank: ['speed', 'direction', 'distance', 'time', 'mass'],
      answer: ['speed', 'direction'],
      explain: 'Your teacher\'s definition: **Velocity: Describing a moving object using speed and direction**\nBoth parts matter.',
      hint: 'The words start with s and d.'
    },
    {
      id: 'velocity-05', topic: 'velocity', type: 'blank', difficulty: 1, source: 'review-6',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'Velocity changes if there is a change in either its ___ or its ___.',
      bank: ['speed', 'direction', 'distance', 'time', 'mass'],
      answer: ['speed', 'direction'],
      explain: 'If the speed changes, the velocity changes. If the direction changes, the **velocity** changes too. Only one of them has to change.'
    },
    {
      id: 'velocity-06', topic: 'velocity', type: 'bins', difficulty: 2, source: 'review-7',
      prompt: 'Is each one a **speed** (S) or a **velocity** (V)? Tap each card into a bin.',
      bins: {
        categories: [{ id: 'S', label: 'Speed (S)' }, { id: 'V', label: 'Velocity (V)' }],
        items: [
          { text: '20 inches per second', answer: 'S' },
          { text: '12 cm/s', answer: 'S' },
          { text: '5 km/hr', answer: 'S' },
          { text: '3 m/s North', answer: 'V' },
          { text: '55 mph Southwest', answer: 'V' },
          { text: '500 mph', answer: 'S' },
          { text: '2 cm/s W', answer: 'V' }
        ]
      },
      explain: 'A number and a unit alone is only a **speed**. If there is also a direction (North, Southwest, W), it is a **velocity**.'
    },
    {
      id: 'velocity-07', topic: 'velocity', type: 'mc', difficulty: 1,
      prompt: 'Which one is a **velocity**?',
      choices: ['55 mph Southwest', '55 mph', '55 miles', '55 seconds'],
      answer: 0,
      choiceFeedback: [
        'Right. It has a speed and a direction.',
        'This has a speed but no direction, so it is only a speed.',
        'Miles are a distance.',
        'Seconds are a time.'
      ],
      explain: 'Velocity needs a speed and a direction. Only 55 mph Southwest has both.'
    },
    {
      id: 'velocity-08', topic: 'velocity', type: 'mc', difficulty: 2, source: 'review-9',
      prompt: 'A car keeps a constant speed of 30 mph but turns onto a different street. Does its **velocity** change?',
      choices: [
        'Yes, because its direction changed',
        'No, because its speed stayed the same',
        'No, because only speed matters',
        'Only if it also slows down'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Velocity: Describing a moving object using speed and direction\nIf either changes, velocity changes.',
        'The speed stayed the same, but velocity also includes direction, and that changed.',
        'Velocity is not only about speed. Direction matters too.',
        'It does not have to slow down. A change in direction alone is enough.'
      ],
      explain: 'Velocity changes if the speed OR the direction changes. A turn changes the direction, so the **velocity** changes.'
    },
    {
      id: 'velocity-09', topic: 'velocity', type: 'blank', difficulty: 2, source: 'review-10',
      prompt: 'Fill in the blank from the word bank.',
      text: 'A runner goes around a circle at constant speed. Her velocity is constantly changing because her ___ is constantly changing.',
      diagram: dg('velocity', { path: 'circle', speed: 6, unit: 'ft/s', showChecklist: true }, false),
      bank: ['direction', 'speed', 'distance', 'time'],
      answer: ['direction'],
      explain: 'On a circle the speed stays the same, but the direction changes every moment. So the **velocity** is always changing.',
      hint: 'Watch the arrow.'
    },
    {
      id: 'velocity-10', topic: 'velocity', type: 'blank', difficulty: 2, source: 'review-11',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'He walked at 6 ft/s and turned corners without speeding up or slowing down. His speed ___ constant. His velocity ___ constant.',
      diagram: dg('velocity', { path: 'corners', speed: 6, unit: 'ft/s', showChecklist: true }, false),
      bank: ['was', 'was not', 'did', 'did not'],
      answer: ['was', 'was not'],
      explain: 'His speed never changed, so the speed **was** constant. But he changed direction at each corner, so his velocity **was not** constant.'
    },
    {
      id: 'velocity-11', topic: 'velocity', type: 'manipulate', difficulty: 2,
      prompt: 'Look at the checklist under the picture while you choose a path.',
      goalText: 'Pick the path where the runner keeps the same speed but the direction keeps changing all the way around.',
      diagram: dg('velocity', { path: 'straight', speed: 6, unit: 'ft/s', heading: 'E', showChecklist: true }, true),
      goal: { key: 'path', op: 'eq', value: 'circle' },
      explain: 'On a circle the speed stays constant, but the direction changes constantly. So the **velocity** is always changing.'
    },
    {
      id: 'velocity-12', topic: 'velocity', type: 'manipulate', difficulty: 2,
      prompt: 'Use the path buttons and the speed slider.',
      goalText: 'Make the runner go straight at a speed of at least 9 ft/s. Then both speed and velocity are constant.',
      diagram: dg('velocity', { path: 'circle', speed: 6, unit: 'ft/s', showChecklist: true, range: { speed: [0, 12, 1] } }, true),
      goal: [{ key: 'path', op: 'eq', value: 'straight' }, { key: 'speed', op: 'gte', value: 9 }],
      explain: 'Going straight at a steady speed means neither the speed nor the direction changes. That is a **constant velocity**.'
    },
    {
      id: 'velocity-13', topic: 'velocity', type: 'manipulate', difficulty: 3,
      prompt: 'A jogger runs at a steady speed. Choose the path.',
      goalText: 'Pick the path where she jogs back and forth along a straight line.',
      diagram: dg('velocity', { path: 'straight', speed: 6, unit: 'ft/s', heading: 'E', showChecklist: true }, true),
      goal: { key: 'path', op: 'eq', value: 'backforth' },
      explain: 'Even on a straight line, turning around flips the direction. The speed is constant, but the **velocity** changes each time she turns.'
    },
    {
      id: 'velocity-14', topic: 'velocity', type: 'tf', difficulty: 1,
      prompt: 'True or false: Speed and velocity mean exactly the same thing.',
      answer: false,
      falseFeedback: 'False. Speed alone has no direction.\nVelocity: Describing a moving object using speed and direction',
      explain: '**Speed** is how fast. **Velocity** is how fast and which way. A car going 50 mph north and a car going 50 mph south have the same speed but different velocities.'
    },
    {
      id: 'velocity-15', topic: 'velocity', type: 'mc', difficulty: 2,
      prompt: 'A car drives around a roundabout at a steady speed. Which statement is true?',
      diagram: dg('velocity', { path: 'circle', speed: 6, unit: 'mph', showChecklist: true }, false),
      choices: [
        'Its speed is constant, but its velocity is changing.',
        'Its speed and its velocity are both constant.',
        'Its speed is changing, but its velocity is constant.',
        'Its speed and its velocity are both changing.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The speed stays the same. The direction keeps changing, so the velocity keeps changing.',
        'The direction keeps changing around the circle, so the velocity cannot be constant.',
        'It is the other way around. The speed is the part that is steady.',
        'The speed is steady. Only the velocity is changing.'
      ],
      explain: 'Constant speed does not mean constant velocity. Going around a circle changes the direction every moment, so the **velocity** changes.'
    },
    {
      id: 'velocity-16', topic: 'velocity', type: 'tf', difficulty: 2,
      prompt: 'True or false: A runner who jogs in a straight line toward the east at a steady 3 m/s has a constant velocity.',
      answer: true,
      falseFeedback: 'It is true. Her speed is steady and her direction is steady, so the velocity does not change.',
      explain: '**Constant velocity** needs both a constant speed and a constant direction. East at 3 m/s the whole way has both.'
    },
    {
      id: 'velocity-17', topic: 'velocity', type: 'multi', difficulty: 2,
      prompt: 'Which of these have a **constant velocity**? Select all that apply.',
      choices: [
        'A car on cruise control driving straight down a long highway',
        'A child on a merry-go-round spinning at a steady rate',
        'A skater gliding straight at a steady speed',
        'A bus slowing down for a red light'
      ],
      answers: [0, 2],
      explain: 'Constant velocity means steady speed in a straight line. The merry-go-round keeps changing direction. The bus is changing its speed.'
    },
    {
      id: 'velocity-18', topic: 'velocity', type: 'multi', difficulty: 2,
      prompt: 'Which of these make an object\'s **velocity** change? Select all that apply.',
      choices: [
        'Speeding up',
        'Slowing down',
        'Turning to go a different way',
        'Moving straight at a steady speed'
      ],
      answers: [0, 1, 2],
      explain: 'Velocity changes when the speed changes or the direction changes. Steady speed in a straight line is the only one that keeps velocity the same.'
    },
    {
      id: 'velocity-19', topic: 'velocity', type: 'blank', difficulty: 3, source: 'review-17',
      prompt: 'A ball rolls 100 ft to a wall in 4 s, bounces, and rolls back 50 ft in 2 s. Fill in the blanks from the word bank.',
      text: 'The ball ___ have a constant velocity, because its ___ changed at the wall.',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft' }, false),
      bank: ['did not', 'did', 'direction', 'speed'],
      answer: ['did not', 'direction'],
      explain: 'The ball turned around at the wall, so its direction changed. That means its **velocity** was not constant.'
    },
    {
      id: 'velocity-20', topic: 'velocity', type: 'mc', difficulty: 3, source: 'review-17',
      prompt: 'The ball rolls out at 25 ft/s and rolls back at 25 ft/s. Which statement is true?',
      diagram: dg('bounce', { d1: 100, t1: 4, d2: 50, t2: 2, unit: 'ft' }, false),
      choices: [
        'The speed was the same on both legs, but the velocity changed.',
        'The speed and velocity were both the same on both legs.',
        'The speed changed, but the velocity stayed the same.',
        'Neither the speed nor the velocity can be known.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. 100 ÷ 4 and 50 ÷ 2 are both 25 ft/s. But the ball went one way, then the opposite way.',
        'The direction flipped at the wall, so the velocity was not the same.',
        'Both legs were 25 ft/s, so the speed did not change.',
        'We can tell. Both speeds are 25 ft/s, and the direction reversed.'
      ],
      explain: 'Same speed, opposite direction. Velocity includes direction, so the **velocity** changed even though the speed did not.'
    },
    {
      id: 'velocity-21', topic: 'velocity', type: 'mc', difficulty: 2,
      prompt: 'Car A drives 50 km/h north. Car B drives 50 km/h south. Which statement is true?',
      choices: [
        'They have the same speed but different velocities.',
        'They have the same speed and the same velocity.',
        'They have different speeds and different velocities.',
        'They have different speeds but the same velocity.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Both go 50 km/h, but in opposite directions.',
        'The directions are opposite, so the velocities are different.',
        'Both cars go 50 km/h, so the speeds are the same.',
        'The speeds are equal, and the velocities are different. This is the reverse.'
      ],
      explain: 'Speed ignores direction, so both cars have the same speed. **Velocity** includes direction, so they are different.'
    },
    {
      id: 'velocity-22', topic: 'velocity', type: 'short', difficulty: 2,
      prompt: 'A weather report says, \'The storm is moving at 500 mph.\' Why is that not a velocity? What would you add?',
      short: {
        modelAnswer: 'It only gives a speed. To make it a velocity you need to add a direction, like 500 mph northeast.',
        keyIdeas: [
          { id: 'nodir', text: 'says there is no direction', keywords: ['direction','which way','no direction','only a speed','just a speed','just speed','only speed','north','south','east','west','heading'] },
          { id: 'add', text: 'says add a direction to make it a velocity', keywords: ['add a direction','add direction','add the direction','include a direction','include direction','say which way','say the direction','tell which way','tell the direction','give a direction','give the direction','needs a direction','need a direction','north','south','east','west','northeast','northwest','southeast','southwest','toward','towards'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'A number with a unit is only a **speed**. Add a direction, and you have a velocity.'
    },
    {
      id: 'velocity-23', topic: 'velocity', type: 'short', difficulty: 3,
      prompt: 'Explain how a car can have a constant speed but a changing velocity.',
      short: {
        modelAnswer: 'The car keeps the same speed but changes direction, like going around a curve. Velocity includes direction, so it changes.',
        keyIdeas: [
          { id: 'dir', text: 'says the direction changes (turns, curves, circle)', keywords: ['direction','turn','turns','turning','curve','circle','corner','round','around','bend','different way','changes way','which way','switch'] },
          { id: 'vel', text: 'says velocity includes direction, or that speed is the same', keywords: ['speed and direction','speed plus direction','includes direction','has direction','direction matters','direction counts','part of velocity','speed stays','same speed','speed is the same','speed does not change','speed doesn\'t change','speed doesnt change','constant speed','steady speed','not speeding up'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Velocity = speed + direction. If the car turns, its direction changes, so the **velocity** changes even when the speed is steady.',
      example: 'A car going around a roundabout at a steady 20 mph.'
    },
    {
      id: 'velocity-24', topic: 'velocity', type: 'tf', difficulty: 2,
      prompt: 'True or false: A car turning a corner at a steady 20 mph has a constant velocity.',
      answer: false,
      falseFeedback: 'False. The speed is steady, but the direction changes in the turn. So the velocity changes.',
      explain: 'Constant speed is not enough. Turning changes the direction, so the **velocity** is not constant.'
    },
    {
      id: 'velocity-25', topic: 'velocity', type: 'short', difficulty: 2,
      prompt: 'Explain the difference between **speed** and **velocity**. Give an example of each.',
      short: {
        modelAnswer: 'Speed is how fast something moves, like a car going 30 mph.\nVelocity: Describing a moving object using speed and direction\nFor example, a car going 30 mph north.',
        keyIdeas: [
          { id: 'dir', text: 'says velocity has a direction and speed does not', keywords: ['direction','which way','velocity has','velocity includes','velocity tells','speed does not','speed doesn\'t','speed doesnt','speed only','only how fast','just how fast','speed plus','speed and direction'] },
          { id: 'exspeed', text: 'gives a speed example (a number with a unit)', keywords: ['mph','km/h','kph','m/s','ft/s','per hour','per second','miles an hour','miles per','meters per','feet per'] },
          { id: 'exvel', text: 'gives a velocity example (a speed with a direction word)', keywords: ['north','south','east','west','northeast','northwest','southeast','southwest','toward','towards','left','right','forward','up','down','to the'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: '**Speed** is how fast. **Velocity** is how fast and which way. 30 mph is a speed. 30 mph north is a velocity.',
      hint: 'Which one needs a direction?'
    }
  );

  /* ============================================================
     TOPIC 5: ACCELERATION
     ============================================================ */
  Q.push(
    {
      id: 'accel-01', topic: 'accel', type: 'mc', difficulty: 1,
      prompt: 'Which is the best definition of **acceleration**?',
      choices: [
        'The rate of change in velocity/speed',
        'How fast an object is going',
        'Only the act of speeding up',
        'The distance an object travels each second'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Acceleration: The rate of change in velocity/speed\nSpeeding up, slowing down and turning all count.',
        'That is speed. Acceleration is about how the velocity changes.',
        'Speeding up is one kind of acceleration. Slowing down and turning count too.',
        'That describes speed. A steady 5 m/s covers 5 m each second, with no acceleration at all.'
      ],
      explain: 'Your teacher\'s definition: **Acceleration: The rate of change in velocity/speed**\nVelocity changes when the speed changes or the direction changes.',
      example: 'A car pulling away from a stop sign is accelerating.'
    },
    {
      id: 'accel-02', topic: 'accel', type: 'short', difficulty: 1,
      prompt: 'Explain **acceleration** in your own words.',
      short: {
        modelAnswer: 'Acceleration: The rate of change in velocity/speed\nIt happens when something speeds up, slows down, or turns.',
        keyIdeas: [
          { id: 'change', text: 'says velocity or speed changes (speeds up, slows down, or turns)', keywords: ['change','changes','changing','changed','how quickly','how fast it changes','varies','speeds up','speeding up','slows down','slowing down','gets faster','gets slower','faster','slower','turns','turning'] },
          { id: 'vel', text: 'mentions velocity, speed, or direction', keywords: ['velocity','speed','speeds','speeding','slows','slowing','fast','slow','direction','turn','turning','which way'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Acceleration: The rate of change in velocity/speed**\nIf velocity is not changing, there is no acceleration.',
      hint: 'Rate of change of what?'
    },
    {
      id: 'accel-03', topic: 'accel', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of **acceleration**.',
      short: {
        modelAnswer: 'A car speeds up when the light turns green. Its velocity is changing, so it is accelerating.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','bike','bicycle','bus','ball','roller coaster','coaster','skateboard','plane','airplane','rocket','train','runner','sprinter','elevator','swing','merry','boat','scooter','truck','person','kick','throw'] },
          { id: 'change', text: 'says it speeds up, slows down, or turns', keywords: ['speed','speeds','speeding','faster','slow','slows','slowing','slower','brake','braking','stop','stops','turn','turns','turning','curve','corner','start','starts','begins','light turns','green','takes off','change'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'Any example where the velocity changes works: speeding up, slowing down, or turning.'
    },
    {
      id: 'accel-04', topic: 'accel', type: 'mc', difficulty: 1,
      prompt: 'When does an object have **positive acceleration**?',
      choices: [
        'When an object\'s speed increases',
        'When it is moving to the right or north',
        'When it is moving very fast at a steady speed',
        'When it is moving forward'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Positive Acceleration: When an object\'s speed increases',
        'Positive here does not mean a direction on the map. It means the speed is increasing.',
        'Moving fast at a steady speed has zero acceleration, because the velocity is not changing.',
        'Moving forward does not tell you if it is speeding up. It could be slowing down.'
      ],
      explain: 'Your teacher\'s definition: **Positive Acceleration: When an object\'s speed increases**\nThe object is speeding up.',
      example: 'A sprinter leaving the starting blocks.'
    },
    {
      id: 'accel-05', topic: 'accel', type: 'short', difficulty: 1,
      prompt: 'Explain **positive acceleration** and give an example.',
      short: {
        modelAnswer: 'Positive Acceleration: When an object\'s speed increases\nFor example, a bike gets faster when you start pedaling.',
        keyIdeas: [
          { id: 'speedup', text: 'says the speed goes up (speeding up, getting faster)', keywords: ['speeds up','speeding up','faster','gets faster','getting faster','increase','increasing','increases','quicker','higher','gains speed','picks up speed','goes faster','rises','rising','grows','bigger','goes up','going up','go up','gets higher'] },
          { id: 'ex', text: 'gives an example', keywords: ['car','bike','bicycle','bus','ball','roller coaster','coaster','skateboard','plane','rocket','train','runner','sprinter','example','like','elevator','start','starts','takes off','green light'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'Your teacher\'s definition: **Positive Acceleration: When an object\'s speed increases**\nA rocket lifting off is a strong example.'
    },
    {
      id: 'accel-06', topic: 'accel', type: 'mc', difficulty: 1,
      prompt: 'What is **negative acceleration**, also called deceleration?',
      choices: [
        'When an object\'s speed decreases',
        'Moving backward',
        'Stopped and not moving',
        'Moving at a steady speed'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Negative Acceleration: When an object\'s speed decreases\nThe object is slowing down.',
        'Deceleration is not about going backward. A car can slow down while still moving forward.',
        'Stopped is a speed of zero. Negative acceleration is the slowing down before it stops.',
        'A steady speed means zero acceleration.'
      ],
      explain: 'Your teacher\'s definition: **Negative Acceleration: When an object\'s speed decreases**\nIt is also called deceleration.',
      example: 'A bus braking as it comes to a stop sign.'
    },
    {
      id: 'accel-07', topic: 'accel', type: 'short', difficulty: 2,
      prompt: 'Explain **deceleration** (negative acceleration) in your own words.',
      short: {
        modelAnswer: 'Negative Acceleration: When an object\'s speed decreases\nIt is also called deceleration. The object is slowing down.',
        keyIdeas: [
          { id: 'slow', text: 'says the speed goes down (slowing down, getting slower)', keywords: ['slow','slows','slowing','slower','decrease','decreasing','decreases','loses speed','losing speed','brake','braking','lower','drops','dropping','reduces','reducing','smaller','goes slower','gets slower','goes down','going down','go down','gets lower'] }
        ],
        need: 1, exampleRequired: false
      },
      explain: 'Your teacher\'s definition: **Negative Acceleration: When an object\'s speed decreases**\nIt means slowing down, not moving backward.'
    },
    {
      id: 'accel-08', topic: 'accel', type: 'short', difficulty: 1,
      prompt: 'Give a real-life example of **deceleration**.',
      short: {
        modelAnswer: 'A bike slows down and stops when I squeeze the brakes.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','bike','bicycle','bus','ball','roller coaster','coaster','skateboard','plane','airplane','train','runner','elevator','boat','scooter','truck','person','swing','sled'] },
          { id: 'slow', text: 'says it slows down or stops', keywords: ['slow','slows','slowing','slower','brake','brakes','braking','stop','stops','stopping','red light','stop sign','coast','coasting','lands','landing','rolls to','comes to'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'Anything that is slowing down is **decelerating**: a braking car, a ball rolling to a stop, a plane landing.'
    },
    {
      id: 'accel-09', topic: 'accel', type: 'blank', difficulty: 1, source: 'review-12',
      prompt: 'Fill in the blank from the word bank.',
      text: 'Acceleration is the rate of change in ___/speed.',
      bank: ['velocity', 'distance', 'position', 'time'],
      answer: ['velocity'],
      explain: 'Your teacher\'s definition: **Acceleration: The rate of change in velocity/speed**\nVelocity includes both speed and direction.',
      hint: 'It starts with v.'
    },
    {
      id: 'accel-10', topic: 'accel', type: 'blank', difficulty: 1, source: 'review-13',
      prompt: 'Fill in the blank from the word bank.',
      text: 'If an object\'s velocity does not change, its acceleration is ___.',
      bank: ['zero', 'positive', 'negative', 'increasing'],
      answer: ['zero'],
      explain: 'No change in velocity means **zero acceleration**. This is true even if the object is moving fast.'
    },
    {
      id: 'accel-11', topic: 'accel', type: 'blank', difficulty: 1, source: 'review-14',
      prompt: 'Fill in the blank from the word bank.',
      text: 'When an object\'s speed increases, it has ___ acceleration.',
      bank: ['positive', 'negative', 'zero', 'no'],
      answer: ['positive'],
      explain: 'Your teacher\'s definition: **Positive Acceleration: When an object\'s speed increases**'
    },
    {
      id: 'accel-12', topic: 'accel', type: 'blank', difficulty: 1, source: 'review-15',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'When an object\'s speed decreases, it has ___ acceleration. It is also called ___.',
      bank: ['negative', 'deceleration', 'positive', 'zero', 'reverse'],
      answer: ['negative', 'deceleration'],
      explain: 'Your teacher\'s definition: **Negative Acceleration: When an object\'s speed decreases**\nIt is also called deceleration.',
      hint: 'The words start with n and d.'
    },
    {
      id: 'accel-13', topic: 'accel', type: 'tf', difficulty: 1, source: 'review-16',
      prompt: 'A driver slows down from 35 mph to a stop at a stop sign. True or false: His velocity changed.',
      diagram: dg('accel', { v0: 35, a: -5, seconds: 7, unit: 'mph', stopSign: true }, false),
      answer: true,
      falseFeedback: 'It is true. He went from 35 mph to 0 mph. The speed changed, so the velocity changed.',
      explain: 'His speed went from 35 to 0, so his **velocity** changed.'
    },
    {
      id: 'accel-14', topic: 'accel', type: 'tf', difficulty: 1, source: 'review-16',
      prompt: 'A driver slows down from 35 mph to a stop at a stop sign. True or false: The driver had an acceleration.',
      diagram: dg('accel', { v0: 35, a: -5, seconds: 7, unit: 'mph', stopSign: true }, false),
      answer: true,
      falseFeedback: 'It is true. Slowing down is a change in velocity.\nAcceleration: The rate of change in velocity/speed',
      explain: 'Velocity changed, so he had an **acceleration**. It was a negative acceleration.'
    },
    {
      id: 'accel-15', topic: 'accel', type: 'blank', difficulty: 2, source: 'review-16',
      prompt: 'The same driver slows from 35 mph to a stop. Fill in the blanks from the word bank.',
      text: 'His acceleration was ___, which is also called ___.',
      diagram: dg('accel', { v0: 35, a: -5, seconds: 7, unit: 'mph', stopSign: true }, false),
      bank: ['negative', 'deceleration', 'positive', 'zero'],
      answer: ['negative', 'deceleration'],
      explain: 'He slowed down, so it was **negative acceleration**, also called **deceleration**.'
    },
    {
      id: 'accel-16', topic: 'accel', type: 'mc', difficulty: 2,
      prompt: 'A car cruises on a straight highway at a steady 60 mph. What is its acceleration?',
      diagram: dg('accel', { v0: 60, a: 0, seconds: 6, unit: 'mph' }, false),
      choices: [
        'Zero',
        'Positive, because it is going fast',
        'Negative, because it is not speeding up',
        'It cannot have an acceleration while moving'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Its velocity is not changing, so the acceleration is zero. Zero acceleration does not mean stopped.',
        'Going fast does not mean positive acceleration. Only speeding up does.',
        'Negative acceleration means slowing down. This car keeps the same speed.',
        'Moving things can have zero acceleration. They just keep the same velocity.'
      ],
      explain: 'The car\'s velocity is constant, so it has **zero acceleration**. Zero acceleration does not mean zero speed.'
    },
    {
      id: 'accel-17', topic: 'accel', type: 'tf', difficulty: 2,
      prompt: 'True or false: Acceleration only means speeding up.',
      answer: false,
      falseFeedback: 'False. Speeding up, slowing down, or changing direction all count.\nAcceleration: The rate of change in velocity/speed',
      explain: '**Acceleration** includes speeding up (positive), slowing down (negative), and turning, because turning changes the direction.'
    },
    {
      id: 'accel-18', topic: 'accel', type: 'mc', difficulty: 3,
      prompt: 'A car goes around a curve at a steady 30 mph. Is the car accelerating?',
      choices: [
        'Yes, because its direction is changing',
        'No, because its speed is not changing',
        'No, because it is not slowing down',
        'Only if it is going faster than 30 mph'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Acceleration is a change in velocity, and velocity includes direction. A turn is an acceleration.',
        'Speed is steady, but velocity also includes direction, and that is changing.',
        'It does not have to slow down. A change of direction alone counts.',
        'The size of the speed does not decide it. The change in direction does.'
      ],
      explain: 'Turning changes the direction, so the **velocity** changes. A change in velocity is an acceleration.'
    },
    {
      id: 'accel-19', topic: 'accel', type: 'manipulate', difficulty: 1,
      prompt: 'The car is driving at a steady speed. Use the slider.',
      goalText: 'Set the acceleration so the car is slowing down.',
      diagram: dg('accel', { v0: 10, a: 0, seconds: 6, unit: 'm/s' }, true),
      goal: { key: 'a', op: 'lte', value: -1 },
      explain: 'A negative acceleration means slowing down. Watch the dots get closer together.'
    },
    {
      id: 'accel-20', topic: 'accel', type: 'manipulate', difficulty: 1,
      prompt: 'The car is driving at a steady speed. Use the slider.',
      goalText: 'Set the acceleration so the car is speeding up.',
      diagram: dg('accel', { v0: 10, a: 0, seconds: 6, unit: 'm/s' }, true),
      goal: { key: 'a', op: 'gte', value: 1 },
      explain: 'A positive acceleration means speeding up. The dots spread farther apart each second.'
    },
    {
      id: 'accel-21', topic: 'accel', type: 'manipulate', difficulty: 2,
      prompt: 'The car is speeding up right now. Use the slider.',
      goalText: 'Set the acceleration so the car keeps a constant velocity.',
      diagram: dg('accel', { v0: 10, a: 3, seconds: 6, unit: 'm/s' }, true),
      goal: { key: 'a', op: 'eq', value: 0, tol: 0.01 },
      explain: 'Zero acceleration means the velocity does not change. The dots are evenly spaced.'
    },
    {
      id: 'accel-22', topic: 'accel', type: 'manipulate', difficulty: 3,
      prompt: 'The car starts at 20 m/s and has 5 seconds to reach the stop sign.',
      goalText: 'Set the acceleration so the car\'s speed at the end is exactly 0 and it stops right at the sign.',
      diagram: dg('accel', { v0: 20, a: 0, seconds: 5, unit: 'm/s', stopSign: true }, true),
      goal: [{ key: 'vEnd', op: 'eq', value: 0, tol: 0.01 }, { key: 'a', op: 'gte', value: -4 }],
      explain: 'The speed drops 4 m/s every second: 20, 16, 12, 8, 4, 0. That is a negative acceleration of -4 m/s each second.'
    },
    {
      id: 'accel-23', topic: 'accel', type: 'mc', difficulty: 2,
      prompt: 'This picture shows a dot for where the car is each second. The dots are getting closer together. What is the car doing?',
      diagram: dg('accel', { v0: 12, a: -2, seconds: 6, unit: 'm/s' }, false),
      choices: [
        'Slowing down (negative acceleration)',
        'Speeding up (positive acceleration)',
        'Moving at a constant velocity',
        'Moving backward'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. In one second the car goes a shorter distance each time, so it is slowing down.',
        'If it were speeding up, the gaps would grow.',
        'At a constant velocity the gaps would stay equal.',
        'The car keeps going forward. It just covers less distance each second.'
      ],
      explain: 'Shrinking gaps between dots mean slowing down. That is **negative acceleration**, or deceleration.'
    },
    {
      id: 'accel-24', topic: 'accel', type: 'mc', difficulty: 2,
      prompt: 'The dots in this picture are evenly spaced. What does that tell you about the car?',
      diagram: dg('accel', { v0: 8, a: 0, seconds: 6, unit: 'm/s' }, false),
      choices: [
        'It has constant velocity and zero acceleration.',
        'It is stopped.',
        'It is speeding up.',
        'It is slowing down.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. Equal gaps mean the car covers the same distance each second, so the velocity is not changing.',
        'A stopped car would not leave new dots in new places.',
        'If it were speeding up, the gaps would grow.',
        'If it were slowing down, the gaps would shrink.'
      ],
      explain: 'Equal gaps mean steady motion. The velocity is constant, so the **acceleration** is zero.'
    },
    {
      id: 'accel-25', topic: 'accel', type: 'bins', difficulty: 2,
      prompt: 'Tap each card into the right bin.',
      bins: {
        categories: [{ id: 'P', label: 'Positive acceleration' }, { id: 'N', label: 'Negative acceleration' }, { id: 'Z', label: 'Zero acceleration' }],
        items: [
          { text: 'A sprinter leaving the starting blocks', answer: 'P' },
          { text: 'A bus braking for a red light', answer: 'N' },
          { text: 'A cyclist cruising straight at a steady 15 km/h', answer: 'Z' },
          { text: 'A skateboard rolling to a stop', answer: 'N' },
          { text: 'A rocket lifting off and getting faster', answer: 'P' },
          { text: 'A car holding 55 mph on a straight highway', answer: 'Z' }
        ]
      },
      explain: 'Speeding up is **positive**. Slowing down is **negative**. A steady velocity is **zero**.'
    },
    {
      id: 'accel-26', topic: 'accel', type: 'tf', difficulty: 2,
      prompt: 'True or false: Deceleration means an object is moving backward.',
      answer: false,
      falseFeedback: 'False. **Deceleration** means slowing down. A car can decelerate while still driving forward.',
      explain: '**Deceleration** is negative acceleration. It describes the speed getting smaller, not the direction.'
    },
    {
      id: 'accel-27', topic: 'accel', type: 'tf', difficulty: 2,
      prompt: 'True or false: An object with zero acceleration must be standing still.',
      answer: false,
      falseFeedback: 'False. A car cruising at a steady 60 mph in a straight line has zero acceleration but is moving fast.',
      explain: 'Zero acceleration only means the velocity is not changing. The object can be at rest or moving at a constant velocity.'
    },
    {
      id: 'accel-28', topic: 'accel', type: 'mc', difficulty: 1,
      prompt: 'Which one is an example of **deceleration**?',
      choices: [
        'A bike coasting to a stop at the bottom of a hill',
        'A bike speeding up down a hill',
        'A bike traveling at a steady 10 mph on a straight path',
        'A bike parked at the rack'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The bike is slowing down, so it has negative acceleration.',
        'Speeding up is positive acceleration, the opposite of deceleration.',
        'A steady speed in a straight line is zero acceleration.',
        'A parked bike is not changing its velocity, so there is no acceleration.'
      ],
      explain: '**Deceleration** is slowing down. Only the bike coasting to a stop is getting slower.'
    },
    {
      id: 'accel-29', topic: 'accel', type: 'mc', difficulty: 2,
      prompt: 'Which one is **NOT** an example of acceleration?',
      choices: [
        'A train traveling straight at a steady 80 km/h',
        'A runner speeding up at the start of a race',
        'A car braking to a stop',
        'A skater going around a curve at a steady speed'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The velocity does not change, so there is no acceleration.',
        'Speeding up changes velocity, so it is acceleration.',
        'Slowing down changes velocity, so it is acceleration.',
        'The direction changes in the curve, so the velocity changes. That is acceleration too.'
      ],
      explain: 'Your teacher\'s definition: **Acceleration: The rate of change in velocity/speed**\nThe train keeps both its speed and its direction, so its velocity does not change.'
    },
    {
      id: 'accel-30', topic: 'accel', type: 'tf', difficulty: 3,
      prompt: 'True or false: An object can keep a constant speed and still be accelerating.',
      diagram: dg('velocity', { path: 'circle', speed: 6, unit: 'm/s', showChecklist: true }, false),
      answer: true,
      falseFeedback: 'It is true. A car going around a curve at a steady 30 mph keeps its speed, but its direction changes. A change in direction is a change in velocity, and that is an acceleration.',
      explain: 'Your teacher\'s definition: **Acceleration: The rate of change in velocity/speed**\nVelocity includes direction, so turning at a steady speed changes the velocity. That counts as acceleration.',
      example: 'A horse on a merry-go-round moves at a steady speed but is always changing direction, so it is accelerating.'
    },
    {
      id: 'accel-31', topic: 'accel', type: 'short', difficulty: 2,
      prompt: 'A car drives on a straight highway at a steady 60 mph. What is its acceleration? Explain why.',
      diagram: dg('accel', { v0: 60, a: 0, seconds: 6, unit: 'mph' }, false),
      short: {
        modelAnswer: 'Its acceleration is zero. Its velocity is not changing, because the speed stays at 60 mph and the direction stays the same.',
        keyIdeas: [
          { id: 'zero', text: 'says the acceleration is zero (none)', keywords: ['zero','0','none','no acceleration','not accelerating','isn\'t accelerating','is not accelerating','doesn\'t have','does not have','nothing'] },
          { id: 'why', text: 'says the velocity (speed and direction) is not changing', keywords: ['not changing','does not change','doesn\'t change','doesnt change','same speed','steady','constant','stays','straight','not speeding up','not slowing down','velocity','same direction'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'If the velocity does not change, the acceleration is **zero**. Going fast is not the same as speeding up.',
      hint: 'Is the velocity changing?'
    }
  );

  /* ============================================================
     TOPIC 6: DISTANCE-TIME GRAPHS
     ============================================================ */
  Q.push(
    {
      id: 'graphs-01', topic: 'graphs', type: 'mc', difficulty: 1,
      prompt: 'On a distance-time graph, what does the **slope** (steepness) of the line tell you?',
      diagram: dg('dtgraph', { speed: 3, xMax: 10, yMax: 40, xStep: 2, yStep: 10, highlight: [2, 6] }, false),
      choices: [
        'The speed of the object',
        'How far the object is from the start',
        'How long the trip took',
        'The direction of the object'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. A steeper line covers more distance in less time. The slope is the speed.',
        'That is the height of the line, not the steepness.',
        'Time is the bottom axis. The slope compares distance and time.',
        'A distance-time graph does not show direction.'
      ],
      explain: 'The **slope** of a distance-time graph is the speed. Rise ÷ run = distance ÷ time.',
      example: 'On a graph, a cheetah\'s line is much steeper than a turtle\'s line.'
    },
    {
      id: 'graphs-02', topic: 'graphs', type: 'blank', difficulty: 1, source: 'mission-8',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'The slope (steepness) of a distance-time graph is the ___. A steeper line means the object is ___, and a flat line means the object is ___.',
      bank: ['speed', 'faster', 'stopped', 'distance', 'slower', 'time'],
      answer: ['speed', 'faster', 'stopped'],
      explain: 'The slope is the **speed**. Steeper means faster. A flat (horizontal) line means the object is stopped.'
    },
    {
      id: 'graphs-03', topic: 'graphs', type: 'short', difficulty: 2,
      prompt: 'Explain what the **slope** of a distance-time graph is and what it tells you.',
      short: {
        modelAnswer: 'The slope is how steep the line is. It tells you the speed of the object. A steeper line means a faster object.',
        keyIdeas: [
          { id: 'steep', text: 'says slope is the steepness of the line (how steep, rise over run)', keywords: ['steep','steepness','rise','run','slant','slanted','incline','tilt','angle','how up','how much it goes up','up and over','the line','line is','line goes'] },
          { id: 'speed', text: 'says it tells the speed (steeper means faster)', keywords: ['speed','fast','faster','quick','velocity','how fast','rate'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'The **slope** is the steepness of the line. On a distance-time graph, it is the speed.'
    },
    {
      id: 'graphs-04', topic: 'graphs', type: 'short', difficulty: 2,
      prompt: 'Give a real-life example of the **slope** of a distance-time graph. Describe a trip and say how steep its line would be.',
      short: {
        modelAnswer: 'A runner sprints very fast, so her line is steep. A person who walks slowly has a flatter line.',
        keyIdeas: [
          { id: 'thing', text: 'names something that moves', keywords: ['car','bike','bicycle','bus','runner','sprinter','walker','walk','walking','run','running','cheetah','turtle','snail','train','plane','swimmer','skateboard','person','kid','dog','horse'] },
          { id: 'steep', text: 'says how steep or flat the line is, or fast or slow', keywords: ['steep','steeper','flat','flatter','slant','faster','slower','fast','slow','stopped','level','horizontal','curve','bends'] }
        ],
        need: 2, exampleRequired: true
      },
      explain: 'Steeper line means faster. A flat line means stopped. A good example connects what the person does to the shape of the line.'
    },
    {
      id: 'graphs-05', topic: 'graphs', type: 'blank', difficulty: 2, source: 'mission-9',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'When an object speeds up (accelerates), the line on a distance-time graph curves ___ and gets ___.',
      diagram: dg('dtgraph', { shape: 'accelerate', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      bank: ['up', 'steeper', 'down', 'flatter', 'straight'],
      answer: ['up', 'steeper'],
      explain: 'Speeding up means more distance in each new second. The line curves **up** and gets steeper.'
    },
    {
      id: 'graphs-06', topic: 'graphs', type: 'blank', difficulty: 2, source: 'mission-9',
      prompt: 'Fill in the blanks from the word bank.',
      text: 'When an object slows down (decelerates), the line on a distance-time graph ___ out and gets ___ steep.',
      diagram: dg('dtgraph', { shape: 'decelerate', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      bank: ['flattens', 'less', 'more', 'curves up', 'straightens'],
      answer: ['flattens', 'less'],
      explain: 'Slowing down means less distance in each new second. The line **flattens out** and gets less steep.'
    },
    {
      id: 'graphs-07', topic: 'graphs', type: 'mc', difficulty: 2, source: 'mission-10',
      prompt: 'A distance-time graph shows a horizontal line at 40 m. What is the object doing?',
      diagram: dg('dtgraph', { shape: 'stopped', atDistance: 40, xMax: 10, yMax: 60, xStep: 2, yStep: 10 }, false),
      choices: [
        'It is stopped, 40 m away from the start.',
        'It is stopped at the starting point.',
        'It is moving at a steady 40 m/s.',
        'It is moving at a steady speed for 40 m.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The distance does not change, so it is not moving. The height 40 m means it is 40 m from the start.',
        'The starting point would be at 0 m. This line is at 40 m.',
        'A moving object has a slanted line. This line is flat.',
        'A flat line means the distance is not changing, so it is not moving.'
      ],
      explain: 'A flat line means the distance is not changing, so the object is stopped. The height of the line tells where: 40 m from the start.'
    },
    {
      id: 'graphs-08', topic: 'graphs', type: 'tf', difficulty: 2, source: 'mission-10',
      prompt: 'True or false: A flat line at 40 m on a distance-time graph means the object is back at the starting point.',
      answer: false,
      falseFeedback: 'False. The start is at 0 m. A flat line at 40 m means it stopped 40 m away from the start.',
      explain: 'The height of the line is the distance from the start. At 40 m the object is not at the start. A flat line only means it is not moving.'
    },
    {
      id: 'graphs-09', topic: 'graphs', type: 'numeric', difficulty: 1,
      prompt: 'Look at the graph. How far from the start is the object at 4 seconds?',
      diagram: dg('dtgraph', { speed: 3, xMax: 10, yMax: 30, xStep: 2, yStep: 5 }, false),
      numeric: { answer: 12, tolerance: 0.01, unit: 'm', unitChoices: ['m', 'm/s', 's', 'm·s'] },
      steps: ['Find 4 s on the bottom axis.', 'Go up to the line.', 'Read across: the height is 12 m.'],
      explain: 'The height of the line at a time is the distance from the start. At 4 s the line is at 12 m.'
    },
    {
      id: 'graphs-10', topic: 'graphs', type: 'numeric', difficulty: 2,
      prompt: 'Look at the graph. The line goes through 0 m at 0 s and 20 m at 5 s. What is the object\'s speed?',
      diagram: dg('dtgraph', { points: [[0, 0], [5, 20]], xMax: 10, yMax: 30, xStep: 2, yStep: 5, highlight: [0, 5], hide: ['slope'] }, false),
      after: { hide: [] },
      numeric: { answer: 4, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['speed = slope = rise ÷ run', 'rise = 20 m, run = 5 s', 'speed = 20 ÷ 5 = 4 m/s'],
      explain: 'The **slope** is the speed. Rise is the distance (20 m) and run is the time (5 s). 20 ÷ 5 = 4 m/s.'
    },
    {
      id: 'graphs-11', topic: 'graphs', type: 'numeric', difficulty: 3,
      prompt: 'The robot goes 0 m at 0 s, 4 m at 2 s, stays at 4 m until 4 s, then reaches 20 m at 8 s. What is its speed between 4 s and 8 s?',
      diagram: dg('dtgraph', { points: [[0, 0], [2, 4], [4, 4], [8, 20]], xMax: 10, yMax: 24, xStep: 2, yStep: 4, highlight: [4, 8], hide: ['slope'] }, false),
      after: { hide: [] },
      numeric: { answer: 4, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['rise = 20 - 4 = 16 m', 'run = 8 - 4 = 4 s', 'speed = 16 ÷ 4 = 4 m/s'],
      explain: 'Use only the part you are asked about. The distance went from 4 m to 20 m, which is 16 m, in 4 s. 16 ÷ 4 = 4 m/s.'
    },
    {
      id: 'graphs-12', topic: 'graphs', type: 'manipulate', difficulty: 1,
      prompt: 'Use the speed slider under the graph.',
      goalText: 'Make the line show a speed of 3 m/s.',
      diagram: dg('dtgraph', { speed: 1, xMax: 10, yMax: 50, xStep: 2, yStep: 10, range: { speed: [0, 10, 0.5] } }, true),
      goal: { key: 'speed', op: 'eq', value: 3, tol: 0.01 },
      explain: 'At 3 m/s the object goes 3 m every second, so after 10 s it is at 30 m. The line gets steeper as the speed goes up.'
    },
    {
      id: 'graphs-13', topic: 'graphs', type: 'manipulate', difficulty: 2,
      prompt: 'Use the speed slider under the graph.',
      goalText: 'Make the line show a speed between 6 and 8 m/s.',
      diagram: dg('dtgraph', { speed: 2, xMax: 10, yMax: 80, xStep: 2, yStep: 10, range: { speed: [0, 10, 0.5] } }, true),
      goal: { key: 'speed', op: 'between', value: 6, value2: 8, tol: 0.01 },
      explain: 'A faster object covers more distance each second, so its line is steeper.'
    },
    {
      id: 'graphs-14', topic: 'graphs', type: 'manipulate', difficulty: 2,
      prompt: 'The dashed line is a runner going 4 m/s. Use the slider to change the solid line.',
      goalText: 'Make the solid line steeper than the dashed line, so it is the faster runner.',
      diagram: dg('dtgraph', { speed: 2, compare: { speed: 4 }, xMax: 10, yMax: 80, xStep: 2, yStep: 10, range: { speed: [0, 10, 0.5] } }, true),
      goal: { key: 'speed', op: 'gte', value: 4.5 },
      explain: 'The steeper line belongs to the faster object. A steeper **slope** means a greater speed.'
    },
    {
      id: 'graphs-15', topic: 'graphs', type: 'manipulate', difficulty: 2,
      prompt: 'Tap the graph shapes.',
      goalText: 'Pick the graph for a car that is slowing down.',
      diagram: dg('dtgraph', { shape: 'constant', shapePicker: true, xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, true),
      goal: { key: 'shape', op: 'eq', value: 'decelerate' },
      explain: 'A car that slows down covers less distance each second. The line flattens out and gets less steep.'
    },
    {
      id: 'graphs-16', topic: 'graphs', type: 'manipulate', difficulty: 2,
      prompt: 'Tap the graph shapes.',
      goalText: 'Pick the graph for a bike that is speeding up.',
      diagram: dg('dtgraph', { shape: 'constant', shapePicker: true, xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, true),
      goal: { key: 'shape', op: 'eq', value: 'accelerate' },
      explain: 'A bike that speeds up covers more distance each second. The line curves upward and gets steeper.'
    },
    {
      id: 'graphs-17', topic: 'graphs', type: 'manipulate', difficulty: 2,
      prompt: 'Tap the graph shapes.',
      goalText: 'Pick the graph for a skateboarder who is standing still, 20 m from the start.',
      diagram: dg('dtgraph', { shape: 'constant', shapePicker: true, atDistance: 20, xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, true),
      goal: { key: 'shape', op: 'eq', value: 'stopped' },
      explain: 'A stopped object does not change its distance. The line is flat.'
    },
    {
      id: 'graphs-18', topic: 'graphs', type: 'manipulate', difficulty: 3,
      prompt: 'Tap the graph shapes.',
      goalText: 'Pick the graph for a runner who speeds up, and then slows down before the finish.',
      diagram: dg('dtgraph', { shape: 'constant', shapePicker: true, xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, true),
      goal: { key: 'shape', op: 'eq', value: 'scurve' },
      explain: 'The line gets steeper while she speeds up, then flatter while she slows down.'
    },
    {
      id: 'graphs-19', topic: 'graphs', type: 'mc', difficulty: 2,
      prompt: 'Which story matches this graph?',
      diagram: dg('dtgraph', { points: [[0, 0], [4, 12], [8, 12], [12, 24]], xMax: 12, yMax: 30, xStep: 2, yStep: 6 }, false),
      choices: [
        'Walks, stops for a while, then walks again at the same speed',
        'Walks, stops, then walks faster',
        'Walks, then turns around and walks back',
        'Speeds up the whole time'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. The first and last parts are both 3 m/s, with a flat part in between.',
        'The last part has the same steepness as the first, so the speed is the same, not faster.',
        'The line never goes down, so the object never goes back. The flat part means it stopped.',
        'The parts are straight lines, so the speed is steady in each part. It is not speeding up the whole time.'
      ],
      explain: 'Straight slanted line is steady speed, flat part is stopped, and the last part has the same steepness as the first, so the same speed.'
    },
    {
      id: 'graphs-20', topic: 'graphs', type: 'mc', difficulty: 2,
      prompt: 'The solid line is Ava. The dashed line is Ben. Who is faster?',
      diagram: dg('dtgraph', { speed: 6, label: 'Ava', compare: { speed: 2, label: 'Ben' }, xMax: 10, yMax: 60, xStep: 2, yStep: 10 }, false),
      choices: ['Ava, because her line is steeper', 'Ben, because his line is lower', 'They are the same speed', 'It cannot be told'],
      answer: 0,
      choiceFeedback: [
        'Right. Ava\'s line is steeper, so she covers more distance each second.',
        'A low line only means he is nearer the start. The steepness tells the speed.',
        'The lines have different steepness, so the speeds are different.',
        'The slope of each line tells the speed, so you can tell.'
      ],
      explain: 'Steeper means faster. Ava\'s **slope** is greater, so her speed is greater.'
    },
    {
      id: 'graphs-21', topic: 'graphs', type: 'tf', difficulty: 2,
      prompt: 'True or false: If a distance-time graph curves upward, the object is going up a hill.',
      answer: false,
      falseFeedback: 'False. The graph is not a picture of the path. Curving upward means the object is speeding up.',
      explain: 'A distance-time graph shows distance against time. A line that curves up and gets steeper means the object is speeding up, on flat ground or anywhere else.'
    },
    {
      id: 'graphs-22', topic: 'graphs', type: 'mc', difficulty: 1,
      prompt: 'A distance-time graph has a line that gets steeper and steeper. What is the object doing?',
      diagram: dg('dtgraph', { shape: 'accelerate', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      choices: ['Speeding up', 'Slowing down', 'Moving at a constant speed', 'Stopped'],
      answer: 0,
      choiceFeedback: [
        'Right. A steeper slope means a greater speed, so the speed keeps increasing.',
        'Slowing down would make the line flatter.',
        'Constant speed is a straight line with the same steepness.',
        'Stopped is a flat line.'
      ],
      explain: 'A steeper slope means a greater speed. If the line gets steeper and steeper, the object is speeding up.'
    },
    {
      id: 'graphs-23', topic: 'graphs', type: 'bins', difficulty: 2,
      prompt: 'Tap each description of a graph line into the motion it shows.',
      bins: {
        categories: [
          { id: 'C', label: 'Constant speed' }, { id: 'A', label: 'Speeding up' },
          { id: 'D', label: 'Slowing down' }, { id: 'S', label: 'Stopped' }
        ],
        items: [
          { text: 'A straight slanted line', answer: 'C' },
          { text: 'A line that curves up and gets steeper', answer: 'A' },
          { text: 'A line that flattens out and gets less steep', answer: 'D' },
          { text: 'A flat, horizontal line', answer: 'S' },
          { text: 'A straight line with the same steepness the whole way', answer: 'C' },
          { text: 'A line that bends upward like a ski jump', answer: 'A' }
        ]
      },
      explain: 'Straight slanted is steady speed, curving up is speeding up, flattening out is slowing down, and flat is stopped.'
    },
    {
      id: 'graphs-24', topic: 'graphs', type: 'short', difficulty: 3, source: 'mission-10',
      prompt: 'A distance-time graph shows a flat line at 40 m. Explain what the object is doing and where it is.',
      diagram: dg('dtgraph', { shape: 'stopped', atDistance: 40, xMax: 10, yMax: 60, xStep: 2, yStep: 10 }, false),
      short: {
        modelAnswer: 'The object is not moving because its distance is not changing. It is stopped 40 m away from the start.',
        keyIdeas: [
          { id: 'stopped', text: 'says it is stopped or not moving (distance not changing)', keywords: ['stopped','not moving','stopping','stands','standing','still','rest','not changing','does not change','doesn\'t change','same distance','stays','no motion','isn\'t moving','paused','waiting'] },
          { id: 'away', text: 'says it is 40 m from the start, not at the start', keywords: ['40','away','from the start','not at the start','not at start','not back','far','from where it started','forty','distance from'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'Flat means the distance is not changing, so the object is stopped. The height of the line says it is 40 m from the start.'
    }
  );

  /* ============================================================
     TOPIC 7: THE MOTION MISSION ROBOT
     Data (t s, d m): (0,0) (2,4) (4,8) (6,12) (8,16) (10,20) (12,20) (14,20)
     (16,24) (18,32) (20,44) (22,52) (24,56) (26,58) (28,58)
     ============================================================ */
  Q.push(
    {
      id: 'mission-01', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-1',
      prompt: 'A robot rolled down a hallway. The graph shows its distance from the start. During which time did the robot move at a **constant speed**?',
      diagram: robotGraph(),
      after: { highlight: [0, 10] },
      choices: ['0–10 s', '14–20 s', '20–26 s', '16–22 s'],
      answer: 0,
      choiceFeedback: [
        'Right. It moved 4 m every 2 s. The line is straight and the speed is 2 m/s.',
        'In this part the distance gaps grow (4, 8, 12 m), so the robot is speeding up.',
        'In this part the gaps shrink, so the robot is slowing down.',
        'This part has gaps of different sizes, so the speed is changing.'
      ],
      explain: 'From 0 to 10 s the robot went 4 m every 2 s. The same distance in equal times is a **constant speed** of 2 m/s.'
    },
    {
      id: 'mission-02', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-2',
      prompt: 'During which time was the robot **stopped**?',
      diagram: robotGraph(),
      after: { highlight: [10, 14] },
      choices: ['0–10 s', '10–14 s', '14–20 s', '20–26 s'],
      answer: 1,
      choiceFeedback: [
        'The robot was moving 4 m every 2 s here.',
        'Right. The distance stayed at 20 m, so the line is flat. The robot did not move.',
        'The robot was moving, and speeding up.',
        'The robot was moving, and slowing down.'
      ],
      explain: 'The distance stayed at 20 m from 10 s to 14 s. A flat line means the robot was **stopped**.'
    },
    {
      id: 'mission-03', topic: 'mission', type: 'multi', difficulty: 2, source: 'mission-2',
      prompt: 'The robot stopped more than once. Select ALL the time intervals when it was stopped.',
      diagram: robotGraph(),
      choices: ['0–10 s', '10–14 s', '20–26 s', '26–28 s'],
      answers: [1, 3],
      explain: 'The robot was stopped from 10 to 14 s (flat at 20 m) and from 26 to 28 s (flat at 58 m). A flat line can happen at different heights.'
    },
    {
      id: 'mission-04', topic: 'mission', type: 'mc', difficulty: 2, source: 'mission-3',
      prompt: 'At what time did the robot **begin accelerating** (speeding up)?',
      diagram: robotGraph(),
      after: { highlight: [14, 20] },
      choices: ['10 s', '14 s', '20 s', '26 s'],
      answer: 1,
      choiceFeedback: [
        'At 10 s the robot stopped. It did not start speeding up until later.',
        'Right. After 14 s the gaps grow from 4 to 8 to 12 m per 2 s. The robot is speeding up.',
        'At 20 s the robot started to slow down.',
        'At 26 s the robot was almost stopped.'
      ],
      explain: 'The robot starts moving again after 14 s, and each 2-second step is longer than the one before: 4, 8, 12 m. That is **acceleration**.'
    },
    {
      id: 'mission-05', topic: 'mission', type: 'mc', difficulty: 2, source: 'mission-4',
      prompt: 'At what time did the robot **begin decelerating** (slowing down)?',
      diagram: robotGraph(),
      after: { highlight: [20, 26] },
      choices: ['14 s', '18 s', '20 s', '26 s'],
      answer: 2,
      choiceFeedback: [
        'At 14 s the robot began speeding up.',
        'At 18 s the robot was still speeding up.',
        'Right. After 20 s the gaps shrink: 12, 8, 4, 2, 0 m per 2 s. The robot is slowing down.',
        'By 26 s the robot was nearly stopped. It started slowing much earlier.'
      ],
      explain: 'The fastest step was 12 m. After 20 s each 2-second step is shorter, so the robot is decelerating.'
    },
    {
      id: 'mission-06', topic: 'mission', type: 'mc', difficulty: 2, source: 'mission-5',
      prompt: 'During which 2-second interval was the robot going the **fastest**?',
      diagram: robotGraph(),
      after: { highlight: [18, 20] },
      choices: ['2–4 s', '16–18 s', '18–20 s', '20–22 s'],
      answer: 2,
      choiceFeedback: [
        'In 2–4 s it moved only 4 m.',
        'In 16–18 s it moved 8 m, but there is a bigger step.',
        'Right. From 18 to 20 s it moved 12 m, the biggest step. That is the steepest part of the line.',
        'In 20–22 s it moved 8 m.'
      ],
      explain: 'All the intervals are 2 seconds long, so the biggest distance is the fastest. The biggest distance was 12 m from 18 to 20 s.'
    },
    {
      id: 'mission-07', topic: 'mission', type: 'numeric', difficulty: 1, source: 'mission-5',
      prompt: 'How many meters did the robot travel during its fastest interval, 18 s to 20 s?',
      diagram: robotGraph(),
      after: { highlight: [18, 20] },
      numeric: { answer: 12, tolerance: 0.01, unit: 'm', unitChoices: ['m', 'm/s', 's', 'm·s'] },
      steps: ['At 18 s the distance is 32 m.', 'At 20 s the distance is 44 m.', '44 - 32 = 12 m'],
      explain: 'Subtract the two distances: 44 m - 32 m = 12 m.'
    },
    {
      id: 'mission-08', topic: 'mission', type: 'numeric', difficulty: 2, source: 'mission-5',
      prompt: 'What was the robot\'s speed from 18 s to 20 s?',
      diagram: robotGraph(),
      after: { highlight: [18, 20] },
      numeric: { answer: 6, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['distance = 44 - 32 = 12 m', 'time = 20 - 18 = 2 s', 'speed = 12 ÷ 2 = 6 m/s'],
      explain: 'Speed = distance ÷ time = 12 ÷ 2 = 6 m/s. That is three times faster than its first 10 seconds.'
    },
    {
      id: 'mission-09', topic: 'mission', type: 'numeric', difficulty: 2, source: 'mission-6',
      prompt: 'What was the robot\'s **average speed** during the first 10 seconds?',
      diagram: robotGraph(),
      after: { highlight: [0, 10] },
      numeric: { answer: 2, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['total distance = 20 m', 'total time = 10 s', 'average speed = 20 ÷ 10 = 2 m/s'],
      explain: '**Average speed** = total distance ÷ total time = 20 ÷ 10 = 2 m/s.'
    },
    {
      id: 'mission-10', topic: 'mission', type: 'numeric', difficulty: 1, source: 'mission-7',
      prompt: 'How many meters did the robot travel between 26 s and 28 s?',
      diagram: robotGraph(),
      after: { highlight: [26, 28] },
      numeric: { answer: 0, tolerance: 0.01, unit: 'm', unitChoices: ['m', 'm/s', 's', 'm·s'] },
      steps: ['At 26 s the distance is 58 m.', 'At 28 s the distance is 58 m.', '58 - 58 = 0 m'],
      explain: 'The distance did not change, so the robot traveled 0 m. Its speed was 0 m/s.'
    },
    {
      id: 'mission-11', topic: 'mission', type: 'mc', difficulty: 2, source: 'mission-7',
      prompt: 'Between 26 s and 28 s the robot traveled 0 meters. What does that tell you?',
      diagram: robotGraph(),
      after: { highlight: [26, 28] },
      choices: [
        'The robot was stopped at the end of its journey.',
        'The robot was back at the starting point.',
        'The robot was moving at a constant 58 m/s.',
        'The robot was speeding up.'
      ],
      answer: 0,
      choiceFeedback: [
        'Right. No distance covered means a speed of 0 m/s. The robot stopped 58 m from the start.',
        'The start is at 0 m. The robot was at 58 m.',
        'It traveled 0 m, so its speed was 0 m/s.',
        'Speeding up would make the line steeper. This line is flat.'
      ],
      explain: 'Traveling 0 m in 2 s means a speed of 0 m/s. The robot was **stopped**, 58 m from the start.'
    },
    {
      id: 'mission-12', topic: 'mission', type: 'blank', difficulty: 2, source: 'mission-3',
      prompt: 'From 14 s to 20 s the robot moved 4 m, then 8 m, then 12 m in each 2-second step. Fill in the blanks from the word bank.',
      text: 'The steps are ___, so the robot is ___.',
      diagram: robotGraph({ highlight: [14, 20] }),
      bank: ['getting bigger', 'getting smaller', 'speeding up', 'slowing down', 'stopped'],
      answer: ['getting bigger', 'speeding up'],
      explain: 'More distance in each equal time step means the speed is going up. The robot is accelerating.'
    },
    {
      id: 'mission-13', topic: 'mission', type: 'blank', difficulty: 2, source: 'mission-4',
      prompt: 'From 20 s to 26 s the robot moved 12 m, 8 m, 4 m, then 2 m, then 0 m in each 2-second step. Fill in the blanks from the word bank.',
      text: 'The steps are ___, so the robot is ___.',
      diagram: robotGraph({ highlight: [20, 26] }),
      bank: ['getting bigger', 'getting smaller', 'speeding up', 'slowing down', 'stopped'],
      answer: ['getting smaller', 'slowing down'],
      explain: 'Less distance in each equal time step means the speed is going down. The robot is decelerating.'
    },
    {
      id: 'mission-14', topic: 'mission', type: 'numeric', difficulty: 3, source: 'mission-6',
      prompt: 'What was the robot\'s **average speed** from 14 s to 20 s? Use the distances at 14 s and at 20 s.',
      diagram: robotGraph(),
      after: { highlight: [14, 20] },
      numeric: { answer: 4, tolerance: 0.01, unit: 'm/s', unitChoices: ['m/s', 'm', 's', 'm·s'] },
      steps: ['distance = 44 - 20 = 24 m', 'time = 20 - 14 = 6 s', 'average speed = 24 ÷ 6 = 4 m/s'],
      explain: 'Use total distance ÷ total time for the whole interval: 24 ÷ 6 = 4 m/s. The robot was speeding up the whole time, so this is an **average**.'
    },
    {
      id: 'mission-15', topic: 'mission', type: 'numeric', difficulty: 1,
      prompt: 'Read the graph. How far from the start was the robot at the end of its journey, at 28 s?',
      diagram: robotGraph(),
      numeric: { answer: 58, tolerance: 0.01, unit: 'm', unitChoices: ['m', 'm/s', 's', 'm·s'] },
      steps: ['Find 28 s on the bottom axis.', 'Read the height of the line.', 'It is 58 m.'],
      explain: 'The height of the line is the distance from the start. At 28 s it is 58 m.'
    },
    {
      id: 'mission-16', topic: 'mission', type: 'manipulate', difficulty: 2,
      prompt: 'The robot moved at a constant speed for its first 10 seconds. Use the slider.',
      goalText: 'Make a line with the same speed as the robot\'s first 10 seconds, 2 m/s.',
      diagram: dg('dtgraph', { speed: 5, xMax: 10, yMax: 50, xStep: 2, yStep: 10, range: { speed: [0, 10, 0.5] } }, true),
      goal: { key: 'speed', op: 'eq', value: 2, tol: 0.01 },
      explain: 'At 2 m/s the object goes 2 m each second, so it reaches 20 m after 10 s. That matches the robot\'s first 10 seconds.'
    },
    {
      id: 'mission-match-1', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-match',
      prompt: 'Graph 1 is a straight diagonal line. Which kind of motion does it show?',
      diagram: dg('dtgraph', { shape: 'constant', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      choices: ['Constant speed', 'Accelerating', 'Decelerating', 'Stopped'],
      answer: 0,
      choiceFeedback: [
        'Right. A straight slanted line has the same steepness all the way. The speed is constant.',
        'Accelerating would curve upward and get steeper.',
        'Decelerating would flatten out.',
        'Stopped would be a flat line.'
      ],
      explain: 'A straight diagonal line means the same distance in every equal time. That is **constant speed**.'
    },
    {
      id: 'mission-match-2', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-match',
      prompt: 'Graph 2 curves upward and gets steeper. Which kind of motion does it show?',
      diagram: dg('dtgraph', { shape: 'accelerate', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      choices: ['Constant speed', 'Accelerating', 'Decelerating', 'Stopped'],
      answer: 1,
      choiceFeedback: [
        'Constant speed would be a straight line.',
        'Right. The line gets steeper, so the speed keeps increasing.',
        'Decelerating would flatten out, not get steeper.',
        'Stopped would be a flat line.'
      ],
      explain: 'A line that gets steeper means the object covers more and more distance each second. That is **accelerating**.'
    },
    {
      id: 'mission-match-3', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-match',
      prompt: 'Graph 3 starts steep and then gets less steep and levels off. Which kind of motion does it show?',
      diagram: dg('dtgraph', { shape: 'decelerate', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      choices: ['Constant speed', 'Accelerating', 'Decelerating', 'Stopped'],
      answer: 2,
      choiceFeedback: [
        'Constant speed would be a straight line.',
        'Accelerating would get steeper, not flatter.',
        'Right. The line gets less steep, so the speed keeps going down.',
        'The object moved at the beginning. A flat line the whole way would be stopped.'
      ],
      explain: 'A line that flattens out means less distance each second. That is **decelerating**.'
    },
    {
      id: 'mission-match-4', topic: 'mission', type: 'mc', difficulty: 1, source: 'mission-match',
      prompt: 'Graph 4 is a horizontal line. Which kind of motion does it show?',
      diagram: dg('dtgraph', { shape: 'stopped', atDistance: 30, xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false),
      choices: ['Constant speed', 'Accelerating', 'Decelerating', 'Stopped'],
      answer: 3,
      choiceFeedback: [
        'A constant speed above zero makes a slanted line.',
        'Accelerating makes a line that curves upward.',
        'Decelerating makes a line that flattens, but it started moving first.',
        'Right. The distance does not change, so the object is stopped.'
      ],
      explain: 'A flat line means the distance does not change. The object is **stopped**.'
    },
    {
      id: 'mission-17', topic: 'mission', type: 'tf', difficulty: 2,
      prompt: 'True or false: During the robot\'s first 10 seconds, its acceleration was zero.',
      diagram: robotGraph(),
      after: { highlight: [0, 10] },
      answer: true,
      falseFeedback: 'It is true. A constant speed in a straight line means the velocity does not change, so the acceleration is zero.',
      explain: 'The robot went 4 m every 2 s. Its speed was steady, so its velocity did not change and its acceleration was zero.'
    },
    {
      id: 'mission-18', topic: 'mission', type: 'multi', difficulty: 3,
      prompt: 'Select ALL the true statements about the robot\'s journey.',
      diagram: robotGraph(),
      choices: [
        'The robot moved at a steady speed from 0 to 10 s.',
        'The robot never stopped.',
        'The robot sped up between 14 s and 20 s.',
        'The robot slowed down between 20 s and 26 s.',
        'The robot was fastest at the very start.'
      ],
      answers: [0, 2, 3],
      explain: 'The robot stopped twice, so it did stop. It was fastest at 18–20 s, not at the start.'
    },
    {
      id: 'mission-levelup', topic: 'mission', type: 'short', difficulty: 3, source: 'mission-levelup',
      prompt: 'Level up. Invent a journey for a robot that includes a constant speed, a stop, and acceleration. Write at least four (time, distance) data points that show it, and say what happens.',
      short: {
        modelAnswer: 'Data: (0 s, 0 m), (2 s, 4 m), (4 s, 8 m), (6 s, 8 m), (8 s, 16 m). The robot moves 4 m every 2 s at a constant speed. Then it stops for 2 s. Then it speeds up because it moves 8 m in the next 2 s.',
        keyIdeas: [
          { id: 'const', text: 'has a part with the same distance gained each equal time (constant speed)', keywords: ['constant','steady','same','even','equal','each 2','every 2','4 m','4 meters','same amount','same speed'] },
          { id: 'stop', text: 'has a part where the distance does not change (stopped)', keywords: ['stop','stopped','stops','pause','rest','not moving','does not move','doesn\'t move','same distance','no change','didn\'t move','wait','0 m'] },
          { id: 'acc', text: 'has a part where the distance gained gets bigger (accelerating)', keywords: ['accelerat','speeds up','speed up','speeding up','faster','bigger','more each','grows','increasing','increase','gets larger','farther each'] }
        ],
        need: 2, exampleRequired: false
      },
      explain: 'Constant speed: the same distance every equal time. Stopped: the distance does not change. Accelerating: the distance gained each time step gets bigger.'
    },
    {
      id: 'mission-19', topic: 'mission', type: 'short', difficulty: 3,
      prompt: 'Describe the robot\'s whole journey in words. Use the words speed, stopped, accelerate, and decelerate.',
      diagram: robotGraph(),
      short: {
        modelAnswer: 'The robot first moved at a constant speed of 2 m/s. Then it stopped for a few seconds. Then it accelerated, reaching its fastest speed at 18–20 s. Then it decelerated until it stopped again at the end.',
        keyIdeas: [
          { id: 'start', text: 'says it began at a constant (steady) speed', keywords: ['constant','steady','same speed','even','2 m/s','at first','started','began','first'] },
          { id: 'stopped', text: 'says it stopped', keywords: ['stop','stopped','stops','paused','not moving','rest','wait'] },
          { id: 'acc', text: 'says it sped up (accelerated)', keywords: ['accelerat','speeds up','sped up','speed up','speeding up','faster'] },
          { id: 'dec', text: 'says it slowed down (decelerated)', keywords: ['decelerat','slows','slowed','slowing','slower','negative'] }
        ],
        need: 3, exampleRequired: false
      },
      explain: 'The story in order: constant speed, stopped, accelerating, decelerating, stopped at the end.'
    }
  );

  /* ============================================================
     TOPIC 0: THE 7 KEY DEFINITIONS (the teacher's official wording)
     Per term: mc-def, mc-term, blank, short, see  (ids def-<term>-<fmt>)
     Plus two bins "match" questions that cover all 7 terms.
     Each term question carries term + fmt so the app can work out which terms are known cold.
     ============================================================ */
  (function () {
    var OBY = {};
    window.OFFICIAL_DEFINITIONS.forEach(function (o) { OBY[o.id] = o; });
    /* "**Velocity: Describing a moving object using speed and direction**": the teacher's words, no period added */
    var plainDef = function (id) { return OBY[id].term + ': ' + OBY[id].def; };
    var boldDef = function (id) { return '**' + plainDef(id) + '**'; };
    var DEFSRC = 'teacher-defs';

    /* Names used for wrong-answer feedback */
    var NAME = {
      'motion': 'Motion', 'acceleration': 'Acceleration', 'reference-point': 'Reference Point', 'velocity': 'Velocity',
      'constant-speed': 'Constant Speed', 'negative-acceleration': 'Negative Acceleration', 'positive-acceleration': 'Positive Acceleration',
      'speed': 'Speed', 'position': 'Position'
    };

    function base(termId, fmt, type, difficulty) {
      return { id: 'def-' + termId + '-' + fmt, topic: 'defs', type: type, difficulty: difficulty, source: DEFSRC, term: termId, fmt: fmt };
    }

    /* ---- mc-def: choices are definitions. spec: {term: id, fb: '...'} for another official definition,
       or {text, fb} for one common misconception. ---- */
    function mcDef(termId, specs, answerAt, hint) {
      var q = base(termId, 'mc-def', 'mc', 1);
      var choices = [], fbs = [];
      var wrong = specs.slice();
      for (var i = 0; i < specs.length + 1; i++) {
        if (i === answerAt) {
          choices.push(OBY[termId].def);
          fbs.push('Right. ' + plainDef(termId));
        } else {
          var sp = wrong.shift();
          if (sp.term) {
            choices.push(OBY[sp.term].def);
            /* another term's definition: say whose it is, then give the one that was asked for, in the teacher's words */
            fbs.push('That is the definition of ' + OBY[sp.term].term + '.' + (sp.fb ? ' ' + sp.fb : '') + '\n' + plainDef(termId));
          } else {
            choices.push(sp.text);
            fbs.push(sp.fb);
          }
        }
      }
      q.prompt = 'What is the definition of **' + OBY[termId].term + '**?';
      q.choices = choices; q.answer = answerAt; q.choiceFeedback = fbs;
      q.explain = 'Each term has its own definition, so learn them as a set. ' + boldDef(termId);
      if (hint) q.hint = hint;
      return q;
    }

    /* ---- mc-term: the definition is in the prompt, choices are terms. spec: [name, feedback] ---- */
    function mcTerm(termId, specs, answerAt, hint) {
      var q = base(termId, 'mc-term', 'mc', 1);
      var choices = [], fbs = [];
      var wrong = specs.slice();
      for (var i = 0; i < specs.length + 1; i++) {
        if (i === answerAt) {
          choices.push(OBY[termId].term);
          fbs.push('Right. ' + boldDef(termId));
        } else {
          var sp = wrong.shift();
          choices.push(sp[0]); fbs.push(sp[1]);
        }
      }
      q.prompt = '"' + OBY[termId].def + '" is the definition of which term?';
      q.choices = choices; q.answer = answerAt; q.choiceFeedback = fbs;
      q.explain = 'Match the words of the definition to the right term. ' + boldDef(termId);
      if (hint) q.hint = hint;
      return q;
    }

    function blank(termId, text, bank, answer, hint) {
      var q = base(termId, 'blank', 'blank', 1);
      q.prompt = 'Fill in the blank' + (answer.length > 1 ? 's' : '') + ' from the word bank.';
      q.text = text; q.bank = bank; q.answer = answer;
      q.explain = 'Say it out loud with the missing word' + (answer.length > 1 ? 's' : '') + ' in place. ' + boldDef(termId);
      if (hint) q.hint = hint;
      return q;
    }

    function shortQ(termId, ideas, need, hint) {
      var q = base(termId, 'short', 'short', 2);
      q.exactDef = true;   /* the teacher's exact wording is the target: the app grades and shows it that way */
      q.prompt = 'Write the definition of **' + OBY[termId].term + '** from memory, in the teacher\'s words.';
      q.short = { modelAnswer: OBY[termId].def, keyIdeas: ideas, need: need, exampleRequired: false };
      q.explain = 'Learn the teacher\'s exact words. Spelling does not count. ' + boldDef(termId);
      if (hint) q.hint = hint;
      return q;
    }

    function seeMc(termId, prompt, diagram, after, choices, answer, fbs, why) {
      var q = base(termId, 'see', 'mc', 2);
      q.prompt = prompt; q.diagram = diagram;
      if (after) q.after = after;
      q.choices = choices; q.answer = answer; q.choiceFeedback = fbs;
      q.explain = why + ' ' + boldDef(termId);
      return q;
    }
    function seeDo(termId, prompt, goalText, diagram, goal, why) {
      var q = base(termId, 'see', 'manipulate', 2);
      q.prompt = prompt; q.goalText = goalText; q.diagram = diagram; q.goal = goal;
      q.explain = why + ' ' + boldDef(termId);
      return q;
    }

    var D = [];

    /* ---------------- 1. Motion ---------------- */
    D.push(
      mcDef('motion', [
        { term: 'reference-point' },
        { term: 'velocity' },
        { text: 'The distance an object travels', fb: 'That is distance, how far something went.\n' + 'Motion: Change in position' }
      ], 2, 'Two words about where something is: change in what?'),
      mcTerm('motion', [
        ['Reference Point', 'Reference Point: The location of the observer of motion'],
        ['Position', 'Position is where an object is.\nMotion: Change in position'],
        ['Velocity', 'Velocity: Describing a moving object using speed and direction']
      ], 1),
      blank('motion', 'Motion: ___ in ___', ['change', 'position', 'speed', 'distance', 'direction'], ['change', 'position'], 'The words start with c and p.'),
      shortQ('motion', [
        { id: 'change', text: 'says the word change', keywords: ['change','changes','changing','changed'] },
        { id: 'position', text: 'says the word position', keywords: ['position','positions'] }
      ], 2, 'Use the words change and position.'),
      seeMc('motion', 'Watch the car. It starts at the start flag and ends at the finish flag. Which term names what happened to its position?',
        dg('race', { d: 40, t: 4, dUnit: 'm', tUnit: 's', hide: ['s'] }, false), null,
        ['Reference Point', 'Acceleration', 'Motion', 'Velocity'], 2,
        ['Reference Point: The location of the observer of motion',
         'Acceleration: The rate of change in velocity/speed',
         'Right. The car\'s position changed from the start flag to the finish flag.',
         'Velocity: Describing a moving object using speed and direction'],
        'The car ended up in a different place than where it began.')
    );

    /* ---------------- 2. Acceleration ---------------- */
    D.push(
      mcDef('acceleration', [
        { term: 'motion' },
        { text: 'How fast an object is moving', fb: 'That is speed.\nAcceleration: The rate of change in velocity/speed' },
        { term: 'constant-speed', fb: 'A constant speed does not change at all, so there is no acceleration.' }
      ], 0, 'It is a rate of change. Change in what?'),
      mcTerm('acceleration', [
        ['Velocity', 'Velocity: Describing a moving object using speed and direction'],
        ['Speed', 'Speed is how fast an object moves.\nAcceleration: The rate of change in velocity/speed'],
        ['Constant Speed', 'A constant speed does not change, so it has no acceleration.']
      ], 0),
      blank('acceleration', 'Acceleration: The ___ of change in ___/speed', ['rate', 'velocity', 'distance', 'position', 'time', 'amount'], ['rate', 'velocity'], 'The words start with r and v.'),
      shortQ('acceleration', [
        { id: 'rate', text: 'says rate of change', keywords: ['rate of change','rate of changes'] },
        { id: 'vel', text: 'says velocity or speed', keywords: ['velocity','speed'] }
      ], 2, 'A rate of change. Change in what?'),
      seeMc('acceleration', 'Watch the speedometer needle and the dots. Which term names how quickly this car\'s speed is changing?',
        dg('accel', { v0: 5, a: 2, seconds: 6, unit: 'm/s', hide: ['label', 'a'] }, false), { hide: [] },
        ['Acceleration', 'Velocity', 'Motion', 'Reference Point'], 0,
        ['Right. The speed keeps changing, and acceleration is the rate of that change.',
         'Velocity: Describing a moving object using speed and direction',
         'Motion: Change in position',
         'Reference Point: The location of the observer of motion'],
        'The needle keeps moving because the speed keeps changing.')
    );

    /* ---------------- 3. Reference point ---------------- */
    D.push(
      mcDef('reference-point', [
        { term: 'motion' },
        { term: 'velocity' },
        { term: 'constant-speed' }
      ], 3, 'Who is watching, and where?'),
      mcTerm('reference-point', [
        ['Motion', 'Motion: Change in position'],
        ['Position', 'Position is where an object is.\nReference Point: The location of the observer of motion'],
        ['Velocity', 'Velocity: Describing a moving object using speed and direction']
      ], 2),
      blank('reference-point', 'Reference Point: The ___ of the ___ of motion', ['location', 'observer', 'object', 'speed', 'direction'], ['location', 'observer'], 'The words start with l and o.'),
      shortQ('reference-point', [
        { id: 'loc', text: 'says location (or where)', keywords: ['location','locations','where'] },
        { id: 'observer', text: 'says observer (or watching)', keywords: ['observer','observers','watching','watcher'] }
      ], 2, 'Who is watching the motion?'),
      seeDo('reference-point', 'The observer is standing on the platform, so the platform is the reference point. Use the switch below the picture.',
        'Move the reference point into the train. Make the observer the passenger.',
        dg('reference', { viewpoint: 'platform', trainSpeed: 1 }, true), { key: 'viewpoint', op: 'eq', value: 'train' },
        'From the passenger\'s seat, the passenger is the observer. The train seat becomes the reference point, and the scenery looks like it slides by.')
    );

    /* ---------------- 4. Velocity ---------------- */
    D.push(
      mcDef('velocity', [
        { term: 'acceleration' },
        { term: 'constant-speed', fb: 'A constant speed has no direction in it.' },
        { text: 'How fast an object is moving', fb: 'That is only speed.\nVelocity: Describing a moving object using speed and direction' }
      ], 1, 'Speed plus what?'),
      mcTerm('velocity', [
        ['Speed', 'Speed only tells how fast. Velocity also has a direction.'],
        ['Constant Speed', 'Constant Speed: A speed that does not vary or change'],
        ['Acceleration', 'Acceleration: The rate of change in velocity/speed']
      ], 3),
      blank('velocity', 'Velocity: Describing a moving object using ___ and ___', ['speed', 'direction', 'distance', 'time', 'position'], ['speed', 'direction'], 'The words start with s and d.'),
      shortQ('velocity', [
        { id: 'speed', text: 'says speed', keywords: ['speed','speeds'] },
        { id: 'dir', text: 'says direction', keywords: ['direction','directions'] }
      ], 2, 'Speed and what else?'),
      seeMc('velocity', 'The arrow on the runner shows how fast the runner goes and which way. Which term names this?',
        dg('velocity', { path: 'circle', speed: 6, unit: 'ft/s', hide: ['legend'] }, false), { hide: [] },
        ['Constant Speed', 'Acceleration', 'Velocity', 'Reference Point'], 2,
        ['The runner\'s speed is steady, but the arrow also shows the direction.\nVelocity: Describing a moving object using speed and direction',
         'Acceleration: The rate of change in velocity/speed\nThe arrow itself shows the velocity.',
         'Right. The arrow length shows the speed and the arrow points the way, so it shows the velocity.',
         'Reference Point: The location of the observer of motion'],
        'The arrow is long when the runner is fast and points the way the runner goes.')
    );

    /* ---------------- 5. Constant speed ---------------- */
    D.push(
      mcDef('constant-speed', [
        { term: 'positive-acceleration', fb: 'Positive acceleration means the speed is changing.' },
        { term: 'negative-acceleration', fb: 'Negative acceleration means the speed is changing.' },
        { term: 'velocity' }
      ], 2, 'Not speeding up and not slowing down.'),
      mcTerm('constant-speed', [
        ['Velocity', 'Velocity: Describing a moving object using speed and direction'],
        ['Speed', 'Speed can change. The word constant means it does not.'],
        ['Acceleration', 'Acceleration: The rate of change in velocity/speed']
      ], 1),
      blank('constant-speed', 'Constant Speed: A ___ that does not vary or change', ['speed', 'velocity', 'direction', 'distance', 'position'], ['speed'], 'It starts with s.'),
      shortQ('constant-speed', [
        { id: 'same', text: 'says it does not vary or change', keywords: ['does not vary','does not change','doesn\'t vary','doesn\'t change','doesnt vary','doesnt change','do not vary','do not change','not vary','not change','never varies','never changes'] }
      ], 1, 'What does the speed not do?'),
      seeMc('constant-speed', 'The robot rolls down the hallway. The line is straight, so it goes the same distance every second. Which term describes its speed?',
        dg('dtgraph', { shape: 'constant', xMax: 10, yMax: 50, xStep: 2, yStep: 10 }, false), null,
        ['Positive Acceleration', 'Negative Acceleration', 'Constant Speed', 'Reference Point'], 2,
        ['Positive Acceleration: When an object\'s speed increases\nThis line has the same steepness all the way.',
         'Negative Acceleration: When an object\'s speed decreases\nThis line has the same steepness all the way.',
         'Right. The same distance every second.\nConstant Speed: A speed that does not vary or change',
         'Reference Point: The location of the observer of motion'],
        'A straight slanted line has the same steepness all the way, so the speed never changes.')
    );

    /* ---------------- 6. Negative acceleration ---------------- */
    D.push(
      mcDef('negative-acceleration', [
        { term: 'positive-acceleration', fb: 'It is the opposite.' },
        { term: 'constant-speed', fb: 'A constant speed does not change.' },
        { term: 'acceleration', fb: 'It is the general idea.' }
      ], 3, 'The speed goes which way?'),
      mcTerm('negative-acceleration', [
        ['Positive Acceleration', 'Positive Acceleration: When an object\'s speed increases'],
        ['Constant Speed', 'Constant Speed: A speed that does not vary or change'],
        ['Velocity', 'Velocity: Describing a moving object using speed and direction']
      ], 2),
      blank('negative-acceleration', 'Negative Acceleration: When an object\'s ___ ___', ['speed', 'decreases', 'velocity', 'increases', 'position'], ['speed', 'decreases'], 'The words start with s and d.'),
      shortQ('negative-acceleration', [
        { id: 'speed', text: 'says speed', keywords: ['speed','speeds'] },
        { id: 'down', text: 'says it decreases (or goes down, slows)', keywords: ['decreases','decrease','decreasing','goes down','going down','go down','slows','slow','slows down','slowing down','slowing'] }
      ], 2, 'What happens to the speed?'),
      seeMc('negative-acceleration', 'Look at the car and the dots. Which term describes what this car is doing?',
        dg('accel', { v0: 12, a: -2, seconds: 6, unit: 'm/s', hide: ['label', 'a'] }, false), { hide: [] },
        ['Constant Speed', 'Negative Acceleration', 'Positive Acceleration', 'Reference Point'], 1,
        ['A constant speed would leave dots that are evenly spaced. These dots get closer together.',
         'Right. The dots get closer together.\nNegative Acceleration: When an object\'s speed decreases',
         'Positive acceleration would spread the dots farther apart each second.',
         'Reference Point: The location of the observer of motion'],
        'The gaps between the dots shrink, so the car covers less distance each second.')
    );

    /* ---------------- 7. Positive acceleration ---------------- */
    D.push(
      mcDef('positive-acceleration', [
        { term: 'negative-acceleration', fb: 'It is the opposite.' },
        { term: 'acceleration', fb: 'It is the general idea.' },
        { term: 'constant-speed', fb: 'A constant speed does not change.' }
      ], 0, 'The speed goes which way?'),
      mcTerm('positive-acceleration', [
        ['Negative Acceleration', 'Negative Acceleration: When an object\'s speed decreases'],
        ['Constant Speed', 'Constant Speed: A speed that does not vary or change'],
        ['Velocity', 'Velocity: Describing a moving object using speed and direction']
      ], 3),
      blank('positive-acceleration', 'Positive Acceleration: When an object\'s ___ ___', ['speed', 'increases', 'velocity', 'decreases', 'position'], ['speed', 'increases'], 'The words start with s and i.'),
      shortQ('positive-acceleration', [
        { id: 'speed', text: 'says speed', keywords: ['speed','speeds'] },
        { id: 'up', text: 'says it increases (or goes up, speeds up)', keywords: ['increases','increase','increasing','goes up','going up','go up','speeds up','speeding up'] }
      ], 2, 'What happens to the speed?'),
      seeDo('positive-acceleration', 'The car is driving at a steady speed. Use the slider.',
        'Make the car show positive acceleration.',
        dg('accel', { v0: 10, a: 0, seconds: 6, unit: 'm/s' }, true), { key: 'a', op: 'gte', value: 1 },
        'Positive acceleration spreads the dots farther apart each second, because the car keeps getting faster.')
    );

    /* ---------------- match: two bins questions covering all 7 ---------------- */
    var match1 = {
      id: 'def-match-1', topic: 'defs', type: 'bins', difficulty: 2, source: DEFSRC,
      prompt: 'Tap each definition into the term it belongs to.',
      bins: {
        categories: [{ id: 'M', label: 'Motion' }, { id: 'R', label: 'Reference Point' }, { id: 'V', label: 'Velocity' }, { id: 'C', label: 'Constant Speed' }],
        items: [
          { text: OBY['velocity'].def, answer: 'V' },
          { text: OBY['motion'].def, answer: 'M' },
          { text: OBY['constant-speed'].def, answer: 'C' },
          { text: OBY['reference-point'].def, answer: 'R' }
        ]
      },
      explain: 'Four terms, four definitions.\n' + ['motion', 'reference-point', 'velocity', 'constant-speed'].map(boldDef).join('\n')
    };
    var match2 = {
      id: 'def-match-2', topic: 'defs', type: 'bins', difficulty: 2, source: DEFSRC,
      prompt: 'Tap each definition into the term it belongs to.',
      bins: {
        categories: [{ id: 'A', label: 'Acceleration' }, { id: 'N', label: 'Negative Acceleration' }, { id: 'P', label: 'Positive Acceleration' }],
        items: [
          { text: OBY['positive-acceleration'].def, answer: 'P' },
          { text: OBY['acceleration'].def, answer: 'A' },
          { text: OBY['negative-acceleration'].def, answer: 'N' }
        ]
      },
      explain: 'The three acceleration terms. Look at what happens to the speed.\n' + ['acceleration', 'negative-acceleration', 'positive-acceleration'].map(boldDef).join('\n')
    };

    /* order: motion first, bins at the end */
    D.push(match1, match2);
    D.forEach(function (q) { Q.push(q); });
  })();

  window.QUESTION_BANK = Q;
})();
