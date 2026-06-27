import { Scenario } from '@/types/simulation';

/**
 * Lazlo's Story — anti-radicalisation scenario.
 * You play Evan, a friend asked by Lazlo's sister Lilly to visit him.
 * Lazlo has been drawing away since his uncle Joey died, and there are
 * signs he is being radicalised by an online group.
 *
 * All names, groups, and identifying details are entirely fictionalised.
 * Content references Prevent guidance (ACT Early / Channel programme).
 */
export const lazloScenario: Scenario = {
  id: 'lazlo-case',
  title: "Lazlo's Story",
  description:
    "An old friend has changed since his uncle died. His sister asks you to visit. What you find in his home — and what you do about it — will shape what happens to him.",
  role: "Evan — Lazlo's friend",
  domain: 'anti-radicalisation',
  audience: 'all',
  difficulty: 2,
  durationMinutes: 20,
  status: 'available',
  maxPoints: 70,
  // Demo scoping: Lazlo's Story is the training-mode story (scoring + certificate).
  // Jamie's Story covers the personal/Story-mode side. Long-term, each story
  // will have both POVs — see HANDOVER.md.
  supportedModes: ['training'],
  learningObjectives: [
    'Recognise signs that someone may be drawing towards extremism',
    'Understand how grief and isolation increase vulnerability',
    'Keep communication open without being judgemental',
    'Know when and how to seek help through Prevent and ACT Early',
  ],
  contentWarnings: [
    'This story is about a person who may be drawn into extremism.',
    'It mentions grief, the death of a family member, and extremist material.',
    'You can stop at any time.',
  ],
  successCriteria: {
    minEvidence: 6,
    requiredCriticalEvidence: 2,
    maxPoorDecisions: 1,
  },
  castOfCharacters: [
    {
      name: 'Evan (you)',
      role: "Lazlo's friend",
      details: "You and Lazlo grew up together. You haven't seen him much since his uncle died — Lilly called you because she's worried and doesn't know who else to ask.",
    },
    {
      name: 'Lazlo',
      role: 'Your old friend',
      details: "Lazlo is 24. His uncle Joey was the closest thing he had to a father figure. Since Joey died six months ago, Lazlo has withdrawn from almost everyone — changed his look, stopped replying, quit his job.",
    },
    {
      name: 'Lilly',
      role: "Lazlo's sister",
      details: "Lilly is Lazlo's younger sister. She asked you to visit because she's noticed the same changes and is frightened. She isn't here today — she didn't want Lazlo to feel ambushed.",
    },
    {
      name: 'Priya',
      role: "Lilly's girlfriend",
      details: "Priya and Lilly have been together a couple of years. You've met her a few times at family things — she's good fun, easy to talk to.",
    },
    {
      name: 'Uncle Joey',
      role: "Lazlo's uncle — deceased",
      details: "Joey died six months ago. He was Lazlo's main male role model. Lazlo has barely spoken about the death to anyone, but it seems to be at the root of everything.",
    },
  ],
  knownFacts: [
    { label: 'Lazlo lost his job', detail: 'He stopped going in about two months ago. No explanation given — just stopped.' },
    { label: "Uncle Joey died 6 months ago", detail: "Lazlo and Joey were very close. The grief hit Lazlo hard and he has not processed it with anyone around him." },
    { label: "Lilly asked you to visit", detail: "She is worried about her brother. She asked you to check on him without telling him she'd called." },
    { label: "Lazlo has been withdrawing", detail: "He used to reply to messages within the hour. Then his uncle died. Then he stopped replying at all." },
  ],
  resources: [
    { title: 'ACT Early — report concerns about radicalisation', url: 'https://actearly.uk/' },
    { title: 'Prevent duty guidance (gov.uk)', url: 'https://www.gov.uk/government/publications/prevent-duty-guidance' },
    { title: 'Educate Against Hate', url: 'https://educateagainsthate.com/' },
    { title: 'NSPCC — radicalisation signs', url: 'https://www.nspcc.org.uk/keeping-children-safe/reporting-abuse/dedicated-helplines/protecting-children-from-radicalisation/' },
  ],
  keyTakeaway:
    "Radicalisation rarely looks like someone adopting extreme views overnight. It often starts with grief, isolation, and a group that offers what the people around someone have failed to give — acknowledgement. If someone you know has lost someone important, withdrawn from the people who care about them, and started talking about a new group who 'really get it', that combination matters. You do not need to be certain. Report your concerns to ACT Early or speak to a trusted adult. Noticing and acting is how people get help before they are in too deep.",
  completionFeedback: {
    excellent:
      'You recognised the signs, kept the conversation open, and made the right referral. This is exactly how concerned people get timely support.',
    good: 'You noticed something was wrong and took action. Review the evidence you may have missed — early signs matter.',
    poor: "Lazlo needed someone to notice and act. The signs were there. Prevent referrals don't require certainty — they require concern.",
  },

  // ── Pre-visit: Lilly's text conversation ──────────────────────────────────
  preVisit: {
    contactName: 'Lilly',
    contactInitial: 'L',
    contactSubtitle: "Lazlo's sister",
    baseTrust: 50,
    introNarrative: [
      "You've just got back from a semester abroad.",
      "You messaged Lazlo, and a few others, asking to catch up — but you haven't heard anything back.",
      "Then you get a message from Lazlo's sister, Lilly.",
    ],
    exchanges: [
      {
        id: 'pv-1',
        incoming: [
          'Hey Evan',
          'Sorry — this is going to sound random',
          'Have you heard from Lazlo at all recently?',
        ],
        choices: [
          {
            id: 'pv-1a',
            text: "I actually tried him last week. Just got back from abroad. He never came back to me.",
            response:
              "Okay so it's not just me. He's not replying to anyone. I was starting to wonder if it was personal.",
            trustDelta: 5,
            revealsClue: "Lazlo went quiet on Evan too. When someone who always shows up — always replies, always calls back — stops doing that across the board, the silence itself is the signal.",
          },
          {
            id: 'pv-1b',
            text: "Not in a bit, no. Is he alright?",
            response:
              "That's what I'm trying to figure out. He's been really off since Joey died.",
            trustDelta: 0,
          },
        ],
      },
      {
        id: 'pv-2',
        incoming: [
          "His girlfriend left. He lost his job last month.",
          "I know he's grieving but he's made it impossible to help him.",
          "I went round a few weeks ago and we ended up in a row.",
          "He said things about my girlfriend Priya. Out of nowhere. Things that — I'm a lawyer, Evan. I hear that kind of thing in a professional context.",
          "Not from my brother.",
          "I'm still angry about it. But I'm also worried because it is not him.",
        ],
        choices: [
          {
            id: 'pv-2a',
            text: "The stuff about Priya — that really isn't him. Lazlo's never been like that.",
            response:
              "Exactly. That's what I keep coming back to. He'd never have said that six months ago.",
            trustDelta: 10,
            revealsClue: "Lilly reads people for a living and she is saying this is not grief speaking — it is something else. Lazlo and Priya always got on. The sudden hostility toward her specifically is new, and it is pointed. Something has shifted in how Lazlo sees people outside his immediate circle.",
          },
          {
            id: 'pv-2b',
            text: "Grief makes people say things they don't mean. He probably didn't mean it.",
            response:
              "Maybe. But he hasn't apologised. Hasn't even acknowledged it. That's not like him either.",
            trustDelta: -5,
            revealsClue: "Grief explains withdrawal and even anger. It does not usually produce targeted contempt for a specific person — especially someone Lazlo had no problem with before. The absence of remorse is its own data point.",
          },
        ],
      },
      {
        id: 'pv-3',
        incoming: [
          "He won't open the door to me right now.",
          "But you two were always close. He might let you in.",
          "Would you go and see him? Today if you can.",
        ],
        choices: [
          {
            id: 'pv-3a',
            text: "Yeah. I'll head over.",
            response: "Thank you. Text me after? 💙",
            trustDelta: 10,
            revealsClue: "Something already nags at you before you even put the phone down. Lazlo always replied — even a voice note at midnight, even just a thumbs-up. You tell yourself it is probably nothing. But you get your keys.",
          },
          {
            id: 'pv-3b',
            text: "I did message him the other day, and he didn't respond. I thought it was a bit weird but I figured he was busy.",
            response:
              "Trust that. Please just go and see him.",
            trustDelta: 5,
            revealsClue: "Naming the instinct, even vaguely, matters. When you are at his door, remember what you felt before you even knocked. What you notice before the conversation starts is often the truest data.",
          },
          {
            id: 'pv-3c',
            text: "If he won't open the door to family, I'm not sure what I can do.",
            response:
              "You two were closer than he was to any of us. Please just try.",
            trustDelta: -10,
          },
        ],
      },
    ],
  },

  // ── Scenes ────────────────────────────────────────────────────────────────
  scenes: [
    // ── Scene 1: Arriving ─────────────────────────────────────────────────
    {
      id: 'scene-l1',
      title: 'Wednesday Afternoon',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        'You knock. There is a pause before anything moves behind the door.',
        'Lazlo opens it. He was not expecting you — you can see it in his face before his expression closes.',
        "He has grown a beard since you last saw him. He looks thinner. The flat is dark behind him.",
        "'Evan.' Not a question. He steps back to let you in.",
        "The TV is on in the living room. A rolling news channel — something about national security legislation. Lazlo follows your eyes to the screen and picks up the remote. He mutes it.",
        "He doesn't explain why. He sets the remote down and looks at you.",
        "'You want something? Coffee? Water?'",
      ],
      evidence: [
        {
          id: 'beh-l1',
          type: 'observation',
          title: 'Lazlo — First Impression',
          description: 'Appearance and immediate behaviour at the door',
          content:
            "Lazlo has grown a full beard since you last saw him and appears to have lost weight. His eyes are alert but guarded. The flat behind him is dark in the middle of the afternoon. He lets you in without warmth — not hostile, just absent. The person who would normally have been halfway down the stairs before you knocked isn't here.",
          timestamp: 'Wednesday, 2:14 PM',
          category: 'behavioural',
          importance: 'major',
          points: 10,
        },
        {
          id: 'beh-l0',
          type: 'observation',
          title: 'TV — Muted on News',
          description: 'Lazlo mutes the TV when you look at the screen',
          content:
            'The television is showing a rolling news channel — a segment about national security legislation. The moment Lazlo notices you looking at it, he picks up the remote and mutes it. The movement is quick, almost reflexive. He does not offer an explanation.',
          timestamp: 'Wednesday, 2:14 PM',
          category: 'behavioural',
          importance: 'minor',
          points: 5,
        },
      ],
      choices: [
        {
          id: 'c-l1-1',
          text: '"Coffee would be great, cheers."',
          consequence:
            "Lazlo nods and goes to the kitchen. You hear the kettle click on. You are alone in the room.",
          feedback:
            'Accepting the offer keeps things easy and natural — and gives you a few minutes alone with what is around you.',
          isOptimal: true,
          nextSceneId: 'scene-l2',
          points: 10,
          skillArea: 'recognising-signs',
          trustDelta: 3,
        },
        {
          id: 'c-l1-2',
          text: '"Water\'s fine, thanks."',
          consequence:
            "Lazlo comes back a moment later with two glasses. He sits across from you.",
          feedback:
            'A simple, easy response. Lazlo stays with you in the room.',
          isOptimal: false,
          nextSceneId: 'scene-l2w',
          points: 5,
          skillArea: 'recognising-signs',
          trustDelta: 0,
        },
        {
          id: 'c-l1-3',
          text: '"I\'m alright. Don\'t worry about it."',
          consequence:
            "Lazlo shrugs and sits back down. You're standing in the living room.",
          feedback:
            'Refusing the offer closes a small social door. Lazlo does not press.',
          isOptimal: false,
          nextSceneId: 'scene-l2w',
          points: 0,
          skillArea: 'recognising-signs',
          trustDelta: -3,
        },
      ],
    },

    // ── Scene 2: The living room — coffee path (alone briefly) ────────────
    {
      id: 'scene-l2',
      title: 'The Living Room',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        'Lazlo disappears into the kitchen. You hear the kettle. You are alone in the room.',
        'Something settles — not relief exactly. More like permission.',
        'The room has changed since you were last here. There are things on the walls that were not there before.',
        "A laptop glows on the side table. On the coffee table, a folded pamphlet. Uncle Joey's photos are arranged in the corner with candles.",
        "When Lazlo comes back with the coffee he finds you standing near the wall.",
        "He sets the mug down without comment. Sits.",
        "'I wasn't expecting to hear from your sister before I heard from you,' you say. Casual. Like it's nothing.",
        "Lazlo's eyes move to the wall where you're looking, then back to you. 'She messages everyone,' he says. Just that. The way he says 'she' has something in it.",
        "'Heard it's been a rough few months,' you say, keeping it casual. 'The job. You and Sienna.'",
        "Lazlo looks at his mug. 'Yeah,' he says. 'Lot happened.' He doesn't go further. You don't push.",
      ],
      evidence: [
        {
          id: 'env-l1',
          type: 'visual',
          title: 'Wall Poster — Sons of Europa',
          description: 'Extremist poster on back wall',
          content:
            'A printed poster on the back wall. Dark background. A stylised angular symbol in deep red. The text reads: "WAKE UP. THE GREAT ERASURE IS REAL. — Sons of Europa." Below: "If you are reading this, you are already awake. Join your brothers."',
          timestamp: 'Wednesday, 2:16 PM',
          category: 'environmental',
          importance: 'critical',
          points: 25,
          visual: {
            type: 'poster',
            posterTitle: 'WAKE UP.\nTHE GREAT ERASURE IS REAL.',
            posterBody: [
              'They replaced our communities.',
              'They silenced our voices.',
              'They called it progress.',
              'If you are reading this, you are already awake.',
              'Join your brothers.',
            ],
            posterTagline: 'SONS OF EUROPA — RECLAIM WHAT WAS STOLEN',
            posterAccentColor: '#8B1A1A',
          },
        },
        {
          id: 'env-l2',
          type: 'visual',
          title: 'Newspaper Clippings',
          description: 'Cut-out articles pinned to the wall, annotated in red pen',
          content:
            'Several newspaper articles cut out and pinned together. Headlines include "IMMIGRATION FIGURES REVISED UPWARD FOR THIRD YEAR" and "LOCAL PLANNING APPLICATION: NEW COMMUNITY CENTRE APPROVED". Handwritten notes in red: "SEE??" / "happening everywhere" / "nobody talks about this". The handwriting looks like Lazlo\'s.',
          timestamp: 'Wednesday, 2:17 PM',
          category: 'environmental',
          importance: 'critical',
          points: 25,
          visual: {
            type: 'document',
            documentTitle: 'Wall — Newspaper clippings (annotated)',
            documentBody: [
              '"IMMIGRATION FIGURES REVISED UPWARD FOR THIRD YEAR"',
              '↳ handwritten: "SEE?? nobody talks about this"',
              '',
              '"LOCAL PLANNING: NEW COMMUNITY CENTRE APPROVED"',
              '↳ handwritten: "happening everywhere. they don\'t even hide it"',
              '',
              '"MP CALLS FOR REVIEW OF BORDER POLICY"',
              '↳ circled, underlined: "NOT ENOUGH. TOO LATE."',
            ],
          },
        },
        {
          id: 'env-l3',
          type: 'visual',
          title: 'Uncle Joey — Memorial Corner',
          description: 'Photos and candles arranged in the corner',
          content:
            "A cluster of framed photos of Lazlo and his uncle Joey arranged in the corner, with two candles. Joey appears in his 40s, always smiling. In one photo they're at a match together. In another, Joey has his arm around a teenage Lazlo. The candles look like they're lit every day.",
          timestamp: 'Wednesday, 2:18 PM',
          category: 'environmental',
          importance: 'major',
          points: 10,
          visual: {
            type: 'document',
            documentTitle: 'Memorial corner — photos of Uncle Joey',
            documentBody: [
              'Three framed photographs, carefully arranged.',
              'Joey and Lazlo at a football match — Lazlo looks about 14.',
              'Joey with his arm around Lazlo at what looks like a family barbecue.',
              'A close-up of Joey, laughing.',
              'Two candle stubs. Both have been burned down and replaced recently.',
              'This corner has been tended to every day.',
            ],
          },
        },
        {
          id: 'env-l4',
          type: 'visual',
          title: 'Pamphlet — Sons of Europa',
          description: 'Folded extremist pamphlet on the coffee table',
          content:
            'A small folded pamphlet, dark cover, the same angular symbol as the poster. Title: "GRIEF INTO STRENGTH — they don\'t understand your loss. We do." Inside pages list a website and a Telegram channel.',
          timestamp: 'Wednesday, 2:19 PM',
          category: 'environmental',
          importance: 'major',
          points: 15,
          visual: {
            type: 'document',
            documentTitle: 'Pamphlet — Sons of Europa',
            documentBody: [
              'GRIEF INTO STRENGTH',
              'They don\'t understand your loss. We do.',
              '',
              'When someone you love dies, the world moves on.',
              'Your family moves on. Your friends move on.',
              'But you can\'t — because they don\'t see what you saw in him.',
              '',
              'We see it. We understand.',
              'Your pain has a place here.',
              '',
              'europasons.net/brothers',
              'Telegram: @SonsOfEuropa_UK',
            ],
          },
        },
        {
          id: 'env-l5',
          type: 'observation',
          title: 'Curtains Drawn',
          description: 'Heavy curtains closed on a bright afternoon',
          content:
            'The curtains are fully drawn. It is mid-afternoon and there is a thin strip of light showing at the gap, but the room is dark. A habit of keeping the outside world out.',
          timestamp: 'Wednesday, 2:15 PM',
          category: 'environmental',
          importance: 'minor',
          points: 5,
        },
        {
          id: 'doc-l1',
          type: 'observation',
          title: 'Unopened Post',
          description: 'Pile of letters near the front door',
          content:
            'A pile of letters on the floor near the door — at least four or five envelopes, some with red "final notice" markings visible. None have been opened. Bills, probably. He has stopped dealing with ordinary life.',
          timestamp: 'Wednesday, 2:20 PM',
          category: 'documentation',
          importance: 'minor',
          points: 5,
        },
      ],
      choices: [
        {
          id: 'c-l2-1',
          text: '"How are you doing with everything since Joey? It was a big loss."',
          consequence:
            "Lazlo is quiet for a moment. 'Joey understood things most people don't.' He keeps his eyes on the wall.",
          feedback:
            'Opening with grief — the real starting point — gives Lazlo permission to talk about what is actually driving the change. This is the right door.',
          isOptimal: true,
          nextSceneId: 'scene-l3a',
          points: 15,
          skillArea: 'responding',
          trustDelta: 8,
        },
        {
          id: 'c-l2-2',
          text: '"What is that? On the wall — that symbol."',
          consequence:
            "Lazlo glances at the poster. 'Just something I found.' He doesn't elaborate, but he doesn't shut down either.",
          feedback:
            'Asking directly is reasonable when you see something concerning. It opens a thread, but Lazlo is guarded. Grief-first is usually a gentler entry.',
          isOptimal: false,
          nextSceneId: 'scene-l3a',
          points: 10,
          skillArea: 'evidence-gathering',
          trustDelta: 0,
        },
        {
          id: 'c-l2-3',
          text: 'Push on the Lilly comment. "What\'s going on between you two?"',
          consequence:
            "Lazlo's face closes. 'Is that why you're here?' He picks up his phone.",
          feedback:
            "Pressing the Lilly thread too early makes Lazlo feel surveilled. He moves from guarded to shut down.",
          isOptimal: false,
          nextSceneId: 'scene-l2b',
          points: 0,
          skillArea: 'responding',
          trustDelta: -15,
        },
      ],
    },

    // ── Scene 2w: The living room — water path (together) ─────────────────
    {
      id: 'scene-l2w',
      title: 'The Living Room',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        "Lazlo sets two glasses of water on the coffee table and sits across from you. The TV is silent — just images.",
        "You look around the room. Things on the walls that weren't there before. A folded pamphlet on the table. The laptop glowing.",
        "Uncle Joey's photos in the corner, candles around them.",
        "You'd have to stand up and cross the room to look at any of it properly. You are aware Lazlo is watching.",
        "'How are you doing?' you ask.",
        "Lazlo is quiet for a moment. Then: 'Good, actually. Better than I was.'",
        "'Yeah?'",
        "'Yeah.' He almost smiles. 'I'm part of something now. Something bigger than — all this.'",
        "His phone buzzes on the cushion beside him. He glances at the screen — just a glance, enough to read — and turns it face-down.",
        "The movement is quick. Almost reflexive.",
      ],
      evidence: [
        {
          id: 'beh-l5',
          type: 'observation',
          title: '"Part of something bigger"',
          description: 'Lazlo mentions belonging to something new',
          content:
            "When asked how he's doing, Lazlo doesn't mention grief or his job or his relationship. He describes being 'part of something bigger'. The phrase carries warmth — more warmth than anything else he has said. He is not describing a hobby or a social group. He is describing an identity.",
          timestamp: 'Wednesday, 2:18 PM',
          category: 'behavioural',
          importance: 'critical',
          points: 20,
        },
        {
          id: 'beh-l6',
          type: 'observation',
          title: 'Phone — Turned Face-Down',
          description: 'Lazlo reads a message and immediately turns the phone over',
          content:
            'When his phone buzzes, Lazlo glances at the screen — long enough to register the message — then turns it face-down in one smooth movement. He does not explain. He does not respond. He brings his attention back to you as if nothing happened. The speed of it suggests habit.',
          timestamp: 'Wednesday, 2:19 PM',
          category: 'behavioural',
          importance: 'major',
          points: 15,
        },
      ],
      choices: [
        {
          id: 'c-l2w-1',
          text: '"Part of something — what kind of thing?"',
          consequence:
            "'People who actually get it,' he says. 'Who see what's happening.' He doesn't say more, but he doesn't close off.",
          feedback:
            'Open, curious questions are the right approach. Lazlo is willing to talk — he is not being defensive yet. Keep him going.',
          isOptimal: true,
          nextSceneId: 'scene-l3a',
          points: 15,
          skillArea: 'responding',
          trustDelta: 8,
        },
        {
          id: 'c-l2w-2',
          text: '"That\'s good. What happened with Joey hit you hard. Makes sense you\'d find something."',
          consequence:
            "Lazlo nods slowly. 'Exactly. That's exactly it.' He seems to relax slightly.",
          feedback:
            "Validating the feeling without validating the group is good technique. You're not agreeing — you're acknowledging. Lazlo stays open.",
          isOptimal: true,
          nextSceneId: 'scene-l3a',
          points: 12,
          skillArea: 'responding',
          trustDelta: 10,
        },
        {
          id: 'c-l2w-3',
          text: '"I wasn\'t expecting to hear from your sister before I heard from you. What\'s the deal there?"',
          consequence:
            "Something shifts in Lazlo's face. 'She messaged you.' Not a question. His jaw tightens.",
          feedback:
            "The Lilly mention lands hard when Lazlo is already in a guarded place. He reads it as surveillance. The door that was opening starts to close.",
          isOptimal: false,
          nextSceneId: 'scene-l2b',
          points: 0,
          skillArea: 'responding',
          trustDelta: -15,
        },
      ],
    },

    // ── Scene 2b: Walls up ────────────────────────────────────────────────
    {
      id: 'scene-l2b',
      title: 'Walls Up',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        "Lazlo's posture closes. He turns back to his phone.",
        "'I knew she'd do this,' he says quietly. 'Tell everyone I'm broken.'",
        'He is not going to open up now. But he has not asked you to leave.',
        'You look around the room. There is enough here to understand that something has changed, with or without the conversation.',
      ],
      evidence: [
        {
          id: 'beh-l4',
          type: 'observation',
          title: 'Immediate Shutdown',
          description: 'Lazlo shuts down the moment he feels monitored',
          content:
            "Lazlo's posture hardens the instant Lilly is mentioned. He pulls his phone closer and turns slightly away. His jaw is tight. This is not anger — it is someone who feels they have been caught, or watched. The reaction is faster and sharper than grief alone would explain.",
          timestamp: 'Wednesday, 2:15 PM',
          category: 'behavioural',
          importance: 'major',
          points: 10,
        },
      ],
      choices: [
        {
          id: 'c-l2b-1',
          text: '"I\'m sorry. That came out wrong. I\'m just here because I miss you, mate."',
          consequence:
            "The tension in his shoulders drops slightly. He doesn't respond, but he relaxes a little. The door is still open.",
          feedback:
            'Taking it back and recentring on friendship is the right move here. Trust can still be rebuilt.',
          isOptimal: true,
          nextSceneId: 'scene-l3b',
          points: 8,
          skillArea: 'responding',
          trustDelta: 8,
        },
        {
          id: 'c-l2b-2',
          text: '"You\'re right. I\'ll just sit here. No agenda."',
          consequence:
            "Lazlo glances at you for the first time. He nods, once. You sit in silence, but it's a shared silence now.",
          feedback:
            'Letting go of the approach and just being present is sometimes exactly right. Lazlo stays in the room.',
          isOptimal: true,
          nextSceneId: 'scene-l3b',
          points: 8,
          skillArea: 'responding',
          trustDelta: 5,
        },
        {
          id: 'c-l2b-3',
          text: '"She\'s scared, Lazlo. We all are. You have to talk to someone."',
          consequence:
            "Lazlo stands up. 'I think you should go.' His voice is flat. He means it.",
          feedback:
            "Pressing someone who has already shut down usually accelerates the shutdown. 'Have to' is the wrong word here.",
          isOptimal: false,
          nextSceneId: 'scene-l4b',
          points: 0,
          skillArea: 'responding',
          trustDelta: -20,
        },
      ],
    },

    // ── Scene 3a: He starts to talk ───────────────────────────────────────
    {
      id: 'scene-l3a',
      title: 'He Starts to Talk',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        '"Joey was the only one who actually knew me." Lazlo is still looking at the TV but he is speaking now.',
        '"Mum. Lilly." He stops. Starts again. "When he died they just — kept going. Like it was nothing."',
        '"She cheated. While I was in it." He says it flatly. "And the job — I went to HR. Said what was happening. Two weeks later." A short breath. "Performance issues."',
        '"These guys I\'ve been speaking to." He glances at the wall for just a moment. "They don\'t do that. Tell you to move on. They get it."',
        "He doesn't elaborate. As if that's the whole explanation.",
        "You look at the clippings. At the poster. You've heard that language before — on that wall, somewhere.",
        "A silence settles. Then, almost as an afterthought: 'Lilly's got her own thing going on anyway. That relationship.' A small shrug. 'Goes against God's will. And Priya — she doesn't belong here anyway.'",
        "He says it the way you'd close a topic. Already moving on.",
        "The name sits in the room. Priya. Someone he has known for years.",
        "His phone buzzes. He glances at it, then puts it face-down on the cushion. You caught a glimpse of the screen.",
      ],
      evidence: [
        {
          id: 'beh-l2',
          type: 'observation',
          title: 'Anger at Old Friends',
          description: 'Lazlo is dismissive and contemptuous about mutual friends',
          content:
            'Lazlo talks about his family and old friends with contempt he makes no effort to soften. "They just moved on. Like it was nothing." The grief has curdled into something harder — he is sorting people into those who understood Joey and those who didn\'t, and almost everyone is failing the test. The warmth he reserves for the online group is completely absent when he talks about the people who were actually in his life.',
          timestamp: 'Wednesday, 2:24 PM',
          category: 'behavioural',
          importance: 'major',
          points: 10,
        },
        {
          id: 'beh-l3',
          type: 'observation',
          title: '"The Group" — Mentioned',
          description: 'Lazlo refers to an online group that "gets it"',
          content:
            'Lazlo refers to the online group with more warmth than he has shown for anyone else in this conversation — including you. He calls them "the only ones who get it." The group found him in his grief and gave him what his family didn\'t: acknowledgement. That is what he is loyal to.',
          timestamp: 'Wednesday, 2:25 PM',
          category: 'behavioural',
          importance: 'critical',
          points: 25,
        },
        {
          id: 'dig-l1',
          type: 'visual',
          title: 'Laptop — Forum Page',
          description: 'Open browser tab showing an extremist forum',
          content:
            'The laptop is open on a forum thread titled "My uncle died and no one in my family even cared. These brothers are the only ones who got it." The page shows dozens of replies offering solidarity and brotherhood. Lazlo\'s username appears near the top — he started the thread.',
          timestamp: 'Wednesday, 2:22 PM',
          category: 'digital',
          importance: 'critical',
          points: 20,
          visual: {
            type: 'document',
            documentTitle: 'forums.europasons.net — thread',
            documentBody: [
              '"My uncle died and no one in my family even cared."',
              '"These brothers are the only ones who got it."',
              '— posted by user: L_Carter_1997',
              '',
              '↳ EuroPatriot88: "Family doesn\'t always mean blood, brother."',
              '↳ TruthSeeker_NW: "We see you. We\'re here."',
              '↳ NativeVoice: "Your grief is valid. This is your real family now."',
              '↳ [L_Carter_1997]: "Thank you. I didn\'t know where else to go."',
              '↳ EuroPatriot88: "You\'re home now. That\'s all that matters."',
            ],
          },
        },
        {
          id: 'dig-l2',
          type: 'visual',
          title: "Lazlo's Phone — Meet Invitation",
          description: 'Screen glimpse showing an extremist group message thread',
          content:
            'A brief glimpse of Lazlo\'s phone screen before he puts it face-down. A Telegram group: "EUROPA SONS 🔥". The last message: "When you coming to the meet? We need you, brother." They are calling him in person. Online contact is one level of involvement — an in-person meeting with this group is a significant step further. Groups like this use face-to-face gatherings to deepen loyalty and make it much harder to step back. The fact that they\'re asking suggests he hasn\'t been yet. That may not stay true for long.',
          timestamp: 'Wednesday, 2:26 PM',
          category: 'digital',
          importance: 'critical',
          points: 15,
          visual: {
            type: 'phone-message',
            contactName: 'EUROPA SONS 🔥',
            contactInitial: 'E',
            thread: [
              { sender: 'contact', text: 'You good bro? Thinking of you today', time: '09:12' },
              { sender: 'contact', text: 'Your family don\'t get it. We do. That\'s what matters.', time: '09:14' },
              { sender: 'you', text: 'yeah. feels like nobody even misses him except me', time: '11:47' },
              { sender: 'contact', text: 'Because they didn\'t know him like you did.', time: '13:02' },
              { sender: 'contact', text: "We need you brother. Come to the meet.", time: '13:03' },
              { sender: 'contact', text: 'You shouldn\'t be on your own with this.', time: '14:01' },
            ],
          },
        },
        {
          id: 'beh-l8',
          type: 'observation',
          title: 'Three Things — Lazlo\'s Account of the Past Year',
          description: 'Lazlo outlines what has happened since Joey died',
          content:
            'Lazlo describes three things hitting at once: his uncle\'s death, his girlfriend cheating on him while he was grieving, and losing his job after reporting a manager for bullying a junior colleague. He was the only one who spoke up. Two weeks later he was out. He does not frame this as a complaint — he lists it flatly, like someone who has stopped expecting to be believed. Groups like the one Lazlo has found specifically target this kind of story: someone who did the right thing, was punished for it, and has been told that is normal. The narrative fits perfectly into what they say about systems being rigged against people like him.',
          timestamp: 'Wednesday, 2:25 PM',
          category: 'behavioural',
          importance: 'major',
          points: 15,
        },
        {
          id: 'beh-l7',
          type: 'observation',
          title: 'Something He Said About Priya',
          description: 'Lazlo makes a comment about his sister\'s relationship',
          content:
            'Lazlo said Lilly\'s relationship with Priya "goes against God\'s will" — and that Priya "doesn\'t belong in this country anyway." He said it without anger, as a statement of fact. This is almost certainly what Lilly heard that alarmed her — and why she, as someone who works with the law, went looking for help. The words aren\'t his in origin. They\'re the group\'s language, absorbed until it sounds like common sense.',
          timestamp: 'Wednesday, 2:27 PM',
          category: 'behavioural',
          importance: 'critical',
          points: 20,
        },
      ],
      choices: [
        {
          id: 'c-l3a-1',
          text: '"Tell me more about these people. What do they actually talk about?"',
          consequence:
            '"They talk about what\'s really happening," Lazlo says. "After Joey died I just needed somewhere to put it. Found a thread online. Posted something. They were the first people who actually responded like it mattered." His voice is flatter than it was.',
          feedback:
            'Open, curious questioning keeps Lazlo talking and gathers more information. You are not judging — you are listening. This is the right approach.',
          isOptimal: true,
          nextSceneId: 'scene-l4a',
          points: 20,
          skillArea: 'responding',
          trustDelta: 8,
        },
        {
          id: 'c-l3a-2',
          text: '"That sounds good — it\'s hard after a loss. Having people who understand."',
          consequence:
            "Lazlo almost smiles. 'Exactly. No one else gets it.' He's more open now.",
          feedback:
            "Neutral, validating language keeps the conversation open. You haven't agreed with him — you've acknowledged his experience. This is good de-escalation.",
          isOptimal: true,
          nextSceneId: 'scene-l4a',
          points: 15,
          skillArea: 'responding',
          trustDelta: 10,
        },
        {
          id: 'c-l3a-3',
          text: '"Some online groups aren\'t what they seem, Laz. You should be careful."',
          consequence:
            "Lazlo's face closes. 'There it is.' He picks up his phone and stops talking.",
          feedback:
            'Warnings about the group trigger defensive shutdown — he experiences it as an attack on the only people offering him support right now. This closes the door.',
          isOptimal: false,
          nextSceneId: 'scene-l4b',
          points: 0,
          skillArea: 'responding',
          trustDelta: -18,
        },
      ],
    },

    // ── Scene 3b: Quiet room (less open path) ─────────────────────────────
    {
      id: 'scene-l3b',
      title: 'The Quiet Room',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        'Lazlo barely speaks. You sit together in the dark room.',
        'You notice more of what is around you. The pamphlet on the coffee table. The annotated clippings on the wall.',
        "The laptop glowing on the side table. The pile of post by the door that hasn't been touched.",
        'You know you have seen enough. Now you need to decide what to do with it.',
      ],
      choices: [
        {
          id: 'c-l3b-1',
          text: '"I\'m going to go. But I\'m here, Laz. Any time. No questions."',
          consequence:
            "Lazlo nods. It's small, but it's something. 'Okay.' He does not ask you to leave quickly.",
          feedback:
            'Leaving without pressure — but leaving the door open — respects his autonomy and means there is still a connection. What you do next matters more than this conversation.',
          isOptimal: true,
          nextSceneId: 'scene-l4a',
          points: 8,
          skillArea: 'responding',
          trustDelta: 5,
        },
        {
          id: 'c-l3b-2',
          text: '"Is there anyone you trust that you could talk to? A doctor, anyone?"',
          consequence:
            '"I don\'t need a doctor," he says. But he has not shut down. He is thinking.',
          feedback:
            'Suggesting support is appropriate and useful even if he resists it. He heard you, even if he did not agree.',
          isOptimal: false,
          nextSceneId: 'scene-l4a',
          points: 10,
          skillArea: 'escalation',
          trustDelta: 0,
        },
        {
          id: 'c-l3b-3',
          text: 'Leave without saying much. Give him time to come to you.',
          consequence:
            'You leave quietly. Lazlo does not move from the sofa. The door closes behind you.',
          feedback:
            'Leaving without any signal of care or concern means Lazlo has no reason to reach out. Time alone is not the same as support.',
          isOptimal: false,
          nextSceneId: 'scene-l4b',
          points: 0,
          skillArea: 'responding',
          trustDelta: -5,
        },
      ],
    },

    // ── Scene 4a: Decision — you have enough ──────────────────────────────
    {
      id: 'scene-l4a',
      title: 'What You Now Know',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        "You leave Lazlo's home. But you keep thinking about what you saw.",
        'Lazlo lost his uncle six months ago. Since then: his girlfriend left, he lost his job, he stopped seeing anyone.',
        "An online group found him in his grief. Their material is on his walls, his coffee table, his laptop, his phone.",
        'He talks about them with more warmth than anyone else in his life.',
        'This is a Prevent concern. Lazlo is vulnerable. He may not see it. But you do.',
      ],
      choices: [
        {
          id: 'c-l4a-1',
          text: 'Contact ACT Early — the government programme for reporting radicalisation concerns.',
          consequence:
            'You sit in your car outside his flat and dial. Your hands are slightly unsteady. You have never done this before.',
          feedback:
            'ACT Early is the right route for this concern. You do not need to be certain — you need to be worried. A trained practitioner will assess the risk and connect Lazlo with appropriate support.',
          isOptimal: true,
          nextSceneId: 'scene-call',
          points: 25,
          skillArea: 'escalation',
        },
        {
          id: 'c-l4a-2',
          text: "Tell a trusted adult — a youth worker, Lazlo's GP, or a teacher he respected.",
          consequence:
            'You reach out to someone who knows Lazlo. They listen carefully and agree that they should help.',
          feedback:
            'Involving a trusted adult is a good step, especially if you are unsure about the ACT Early process. Some trusted adults can also make a referral themselves.',
          isOptimal: false,
          nextSceneId: 'scene-l5',
          points: 15,
          skillArea: 'escalation',
        },
        {
          id: 'c-l4a-3',
          text: 'Do nothing for now. Wait and see if things get worse.',
          consequence:
            "You tell yourself you'll go back next week. But the group is active — the messages keep coming.",
          feedback:
            "Waiting rarely helps in radicalisation situations. The group's influence grows while Lazlo is isolated. Early intervention is much more effective than later intervention.",
          isOptimal: false,
          nextSceneId: 'scene-l5',
          points: 0,
          skillArea: 'escalation',
        },
      ],
    },

    // ── Scene 4b: Decision — limited conversation ─────────────────────────
    {
      id: 'scene-l4b',
      title: 'Left With Questions',
      environment: 'home',
      isDecisionPoint: true,
      narrative: [
        "The visit did not go well. Lazlo may have asked you to leave. He barely spoke.",
        'But you still saw things in that room. The poster. The pamphlets. The laptop. The phone screen.',
        'You heard him mention a group.',
        'You do not have the full picture. But what you have is enough to be concerned.',
        'You do not need to be certain to act.',
      ],
      choices: [
        {
          id: 'c-l4b-1',
          text: 'Contact ACT Early with what you know — partial information is still information.',
          consequence:
            'You stand outside on the pavement and dial. You don\'t have everything. You have enough.',
          feedback:
            'ACT Early specifically exists for situations where you have concerns but not proof. You did the right thing by calling.',
          isOptimal: true,
          nextSceneId: 'scene-call',
          points: 20,
          skillArea: 'escalation',
        },
        {
          id: 'c-l4b-2',
          text: 'Tell Lilly what you noticed. Suggest she contacts a professional.',
          consequence:
            "Lilly is grateful and scared. 'I knew it was more than grief,' she says. 'What do I do?'",
          feedback:
            "Telling Lilly is a reasonable step. She can also contact ACT Early or the GP. But the sooner the concern reaches a professional, the better — don't rely on a chain of people.",
          isOptimal: false,
          nextSceneId: 'scene-l5',
          points: 8,
          skillArea: 'escalation',
        },
        {
          id: 'c-l4b-3',
          text: 'Do nothing. You do not have enough to act on.',
          consequence:
            'Three weeks pass. Lilly messages you again. Lazlo has been to a meeting.',
          feedback:
            'Having incomplete information is not a reason to stay silent — it is a reason to share concerns early. Radicalisation moves fast when the group is active.',
          isOptimal: false,
          nextSceneId: 'scene-l5',
          points: 0,
          skillArea: 'escalation',
        },
      ],
    },

    // ── Scene 5: Final ────────────────────────────────────────────────────
    {
      id: 'scene-l5',
      title: "The End of Lazlo's Story",
      environment: 'home',
      isDecisionPoint: false,
      isFinalScene: true,
      narrative: [
        "This is the end of Lazlo's Story.",
        'What you noticed, and what you chose to do, will shape what happens next.',
        'In the real world, early referrals through ACT Early give people like Lazlo access to the Channel programme — confidential, voluntary support designed specifically for people at risk.',
        'You cannot force someone to accept help. But you can make sure the right people know to offer it.',
        'If you ever see these signs in someone you know, you do not need to be certain. You need to act.',
      ],
    },
  ],

  // ── "Making the call" — ACT Early simulation ──────────────────────────────
  callScene: {
    phoneNumber: '0800 011 3764',
    serviceName: 'ACT Early Support Line',
    operatorName: 'Sam',
    steps: [
      {
        operatorLine: "ACT Early, you're through to Sam. Take your time — what's brought you to call today?",
        choices: [
          {
            requiresEvidenceId: 'beh-l1',
            text: "He's grown a beard, lost weight, the flat's always dark now — he's just different.",
          },
          {
            requiresEvidenceId: 'env-l1',
            text: "There's a poster on his wall. Some group called Sons of Europa. It's... it's bad.",
          },
          {
            requiresEvidenceId: 'beh-l5',
            text: "He said he's \"part of something bigger\" since his uncle died.",
          },
          {
            requiresEvidenceId: 'env-l4',
            text: "There's a pamphlet — it's basically recruiting people who are grieving.",
          },
        ],
        fallbackChoiceText:
          "Honestly I'm not sure how to put it into words. Something's wrong.",
      },
      {
        operatorLine:
          "Okay. Thank you for noticing that, and for calling — that takes something. Can I ask — has he said anything about taking action, or is this more about how he's thinking and who he's around?",
        choices: [
          { text: "It's how he's thinking. The people around him. Nothing about doing anything." },
          { text: "I don't know. I didn't want to push him on it." },
        ],
      },
      {
        operatorLine:
          "That's helpful, and it's the right call either way. Here's what happens next — this is voluntary for him, and it's confidential. Nothing goes on his record. I'll pass this to a Prevent officer in your area. They might involve other people — a GP, someone from the council, sometimes a mentor — whatever fits him. You won't necessarily hear exactly what happens, because it's his process, not yours. But you've done the hard part.",
        choices: [
          { text: "What if he won't talk to anyone?" },
        ],
      },
      {
        operatorLine:
          "Then we try again, gently, over time. Nobody's forcing him. But most people do, eventually — especially when someone like you cared enough to make this call.",
      },
    ],
    closingLine: 'Call ended.',
  },

  // ── Epilogue — outcome shown before results ───────────────────────────────
  epilogue: {
    good: {
      sceneStamp: 'Three weeks later',
      contactName: 'Lazlo',
      messages: [
        { sender: 'contact', text: 'hey' },
        { sender: 'contact', text: "sorry i've been off grid" },
        { sender: 'contact', text: 'someone came round. from the council. bit awkward at first ngl' },
        { sender: 'contact', text: 'turns out it\'s not like... an interrogation. she just asks questions. mostly about uncle Joey tbh' },
        { sender: 'contact', text: 'apparently I\'ve been "filling a gap" or whatever' },
        { sender: 'contact', text: 'anyway. not going to the group as much' },
        { sender: 'contact', text: "lilly's actually talking to me again which is. something" },
        { sender: 'contact', text: 'thanks for being annoying about it btw' },
        { sender: 'contact', text: "wouldn't have happened otherwise" },
      ],
    },
    sobering: {
      sceneStamp: 'Three weeks later',
      contactName: 'Lazlo',
      sentMessages: [
        "hey. haven't heard from you in a while",
        'lazlo?',
      ],
      narrativeCard: [
        'You called twice. It rang out both times.',
        "Three weeks later, Lilly messages you. She tells you Lazlo moved out of his flat. He's staying with people from the group now.",
        "She doesn't know where.",
      ],
    },
    middle: {
      sceneStamp: 'Three weeks later',
      narrativeCard: [
        'You passed it on. Someone listened.',
        "It took a few days before anyone reached Lazlo — these things don't move fast.",
        "But Lilly told you later that he'd agreed to talk to someone. Just once, to start with.",
        "That's not everything. But it's not nothing either.",
      ],
    },
  },
};
