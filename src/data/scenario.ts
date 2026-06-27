import { Scenario } from '@/types/simulation';

/**
 * Jamie's Story — Story mode, friend POV.
 *
 * Restructured from the original Year 5 Class Teacher framing to a same-age
 * classmate/friend protagonist. See the safeguarding-restructure-jamie-friend-pov
 * memory for the full design rationale — in short: this is not a memory/attention
 * test. There is no "correct" amount of evidence to collect, and the ending is
 * gated only on whether the player tells a trusted adult, never on how much was
 * noticed. Evidence ("Observations" in Story mode) is written to stay genuinely
 * ambiguous — explainable away, the way real signs of abuse usually are.
 */
export const safeguardingScenario: Scenario = {
  id: 'jamie-case',
  title: "Jamie's Story",
  description: "Your friend Jamie has changed since the summer. What you notice — and what you do about it — will shape what happens to them.",
  role: "Jamie's friend",
  learningObjectives: [
    "Recognise signs that a friend might be going through something difficult",
    "Understand why kids often hint at problems rather than say them outright",
    "Know who counts as a trusted adult, and that telling them isn't betrayal",
    "Trust a gut feeling even without proof — noticing is enough to act on"
  ],
  scenes: [
    // Scene 1: Opening
    {
      id: 'scene-1',
      title: 'First Day Back',
      environment: 'classroom',
      narrative: [
        "It's the first day of term. You've been looking forward to seeing Jamie all summer — six weeks apart, and you've got loads to tell them.",
        "Jamie — always one of the first through the gate, always talking before you've even said hello — slips into the form room quietly, just as the bell goes. Their uniform looks slept-in, and there's a faint smell of unwashed clothes.",
        "They don't really look at you. They go straight to their seat, pulling their sleeves down over their hands even though the room's already warm.",
        "You've been friends with Jamie since Year 7 started. Something's different today. You just don't know what yet."
      ],
      evidence: [
        {
          id: 'obs-1',
          type: 'observation',
          title: 'Something felt off',
          description: "First morning back",
          content: "Jamie came in late and quiet — not like them at all. Crumpled uniform, like it hadn't been washed. They wouldn't really look at you, and kept their sleeves pulled down even though it wasn't cold. Could be nothing. Could just be first-day-back tiredness. But it didn't feel like nothing.",
          timestamp: 'Monday, registration'
        }
      ],
      choices: [
        {
          id: 'c1-1',
          text: 'Catch Jamie quietly and ask if they\'re okay',
          consequence: 'You lean over during registration. "You alright?" Jamie winces slightly, then mutters "I\'m fine" without looking up.',
          feedback: 'They brushed it off, but you noticed, and that matters more than you might think.',
          isOptimal: true,
          nextSceneId: 'scene-2',
          points: 10
        },
        {
          id: 'c1-2',
          text: 'Leave it for now and keep an eye on them through the day',
          consequence: 'You decide to give Jamie some space, but you find yourself glancing over more than usual.',
          feedback: 'Watching is a reasonable instinct — just don\'t let "later" quietly become "never."',
          isOptimal: false,
          nextSceneId: 'scene-2',
          points: 5
        },
        {
          id: 'c1-3',
          text: 'Call out loudly: "Someone woke up on the wrong side of the bed this morning!"',
          consequence: 'A couple of people nearby laugh. Jamie goes completely still — not embarrassed, something closer to shut down. They look at the desk and don\'t say anything. The sleeves get tugged down further.',
          feedback: 'That kind of joke would usually get a comeback from Jamie. The fact that it didn\'t land at all is itself a sign that something\'s not right — but right now, they\'re a bit more alone than they were a minute ago.',
          isOptimal: false,
          nextSceneId: 'scene-1b',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 1b: The Apology (only reached via c1-3)
    {
      id: 'scene-1b',
      title: 'A Bit Awkward',
      environment: 'classroom',
      narrative: [
        "First lesson drags. You keep glancing over at Jamie, who is staring at their exercise book and not writing anything in it.",
        "At break, you head over. \"Hey.\" Nothing. Jamie keeps looking at the fence.",
        "You try again. Still nothing.",
        "This is genuinely strange. Jamie is someone who can give as good as they get — you've traded worse than that and both ended up laughing. For a moment you think they're just winding you up.",
        "They're not winding you up.",
        "There's a long pause, and then it clicks: you're going to have to actually apologise. Not in a jokey way. Properly. Which is mildly annoying, because it really did feel like a normal joke.",
        "But Jamie not laughing at it is in itself kind of strange. That's not like them."
      ],
      choices: [
        {
          id: 'c1b-1',
          text: 'Apologise properly — "That was a rubbish thing to say, sorry"',
          consequence: 'Jamie looks at you for the first time all day. "It\'s fine." It\'s not entirely fine yet, but they shift slightly along the bench to make room. You sit down.',
          feedback: 'A proper apology, rather than a deflection, was what was needed. Jamie\'s not someone who usually needs one — which makes it worth paying attention to.',
          isOptimal: true,
          nextSceneId: 'scene-2',
          points: 5
        },
        {
          id: 'c1b-2',
          text: 'Try to smooth it over — "Come on, I was only joking"',
          consequence: 'Jamie shrugs. "Yeah, whatever." They don\'t look up. You pause. "Hey — are you okay?" A beat. "Fine." Still not looking at you.',
          feedback: '"I was only joking" can end up asking someone not to be hurt rather than actually apologising. You did ask if they were okay, which matters — Jamie just didn\'t have anywhere to go with it.',
          isOptimal: false,
          nextSceneId: 'scene-2',
          points: 2
        }
      ],
      isDecisionPoint: true
    },
    // Scene 2: Break Time (PE + playground)
    {
      id: 'scene-2',
      title: 'PE Day',
      environment: 'playground',
      narrative: [
        "It's a PE day. While everyone else gets changed in the usual chaos of the changing room — bags everywhere, someone always losing a trainer — Jamie slips off to use the toilets instead.",
        "You don't think much of it until Jamie comes out in a long-sleeve top, even though the room's thick and humid from forty people getting changed at once. Everyone else is in shorts and t-shirts complaining about the heat. Jamie isn't.",
        "It's probably nothing. Loads of people get weird about changing rooms at this age. But you noticed it, and once you've noticed something, it's hard to unnotice it.",
        "Later, at break, you spot Jamie sitting alone on a bench near the fence, picking at their sleeve. Their usual group is playing football nearby, but Jamie hasn't moved to join in.",
        "Marcus — who lives next door to Jamie — jogs over and tries to pull Jamie up to play. Jamie yanks their arm away sharply — and for a second, before the sleeve drops back down, you catch a glimpse of something dark on their wrist.",
        "Marcus shrugs and jogs back to the game, looking a bit confused."
      ],
      evidence: [
        {
          id: 'obs-pe-1',
          type: 'observation',
          title: 'Changing room, again',
          description: 'PE lesson',
          content: "Jamie changed in the toilets instead of with everyone else, then wore long sleeves on a hot, sweaty day when literally no one else did. Could just be self-conscious about changing in front of people — loads of people are like that. But it's the kind of thing that's easy to explain away one at a time, and hard to explain away all together.",
          timestamp: 'Monday, PE lesson'
        },
        {
          id: 'obs-2',
          type: 'observation',
          title: 'Sitting it out',
          description: 'Behaviour at break',
          content: "Jamie sat alone instead of playing football with their usual group, and pulled away sharply when Marcus tried to get them up. Might just be a mood. People have off days.",
          timestamp: 'Monday, break time'
        },
        {
          id: 'vis-1',
          type: 'visual',
          title: 'Something on their wrist',
          description: 'A glimpse, nothing more',
          content: "A flash of something dark on Jamie's wrist before the sleeve covered it again. Could be a bruise. Could be a smudge of pen, dirt, anything. You didn't get a proper look.",
          timestamp: 'Monday, break time'
        }
      ],
      choices: [
        {
          id: 'c2-1',
          text: 'Go and sit with Jamie, just talk like normal',
          consequence: 'You plonk down next to Jamie. "Budge up, I need a break from all that running around." Jamie shrugs but doesn\'t move away. After a moment, quietly: "My arm hurts."',
          feedback: 'Just being there, without making it a big deal, gave Jamie the opening to say something.',
          isOptimal: true,
          nextSceneId: 'scene-3a',
          points: 15
        },
        {
          id: 'c2-2',
          text: 'Ask Marcus if he knows what\'s going on',
          consequence: 'Marcus shrugs. "Dunno. I live next door so I see them sometimes — from our garden, on the street. They\'ve barely been out since the summer. Said their mum\'s boyfriend doesn\'t want them around after school."',
          feedback: 'Useful, but Jamie\'s the one who actually knows what\'s happening — worth talking to them directly when you can.',
          isOptimal: false,
          nextSceneId: 'scene-3b',
          points: 8
        },
        {
          id: 'c2-3',
          text: 'Keep half an eye on it without saying anything yet',
          consequence: 'You stay near enough to notice if anything else happens, but don\'t go over. Jamie stays on the bench until the bell goes.',
          feedback: 'Watching from a distance feels safe, but it also meant a chance to talk passed by.',
          isOptimal: false,
          nextSceneId: 'scene-3b',
          points: 5
        }
      ],
      isDecisionPoint: true
    },
    // Scene 3a: A Moment of Trust
    {
      id: 'scene-3a',
      title: 'Slept Funny',
      environment: 'classroom',
      narrative: [
        "At break, for a moment, Jamie is almost themselves — laughing at something Marcus said, shoulders relaxed, easy in a way they weren't this morning. You almost talk yourself out of it.",
        "Then their phone lights up. Jamie glances at the screen and something changes — not dramatically, just a door closing behind the eyes. They pocket the phone and the laughter stops.",
        "You plonk down next to them. \"Budge up.\" Jamie shrugs but moves along the bench.",
        "After a moment you notice their hand moving — fingers pressing gently at the top of their forearm, through the sleeve. Rubbing at something.",
        '"What happened to your arm?" you ask, keeping it casual.',
        "Jamie stops. A beat.",
        '"I slept funny. It\'s nothing."',
        "A ball bounces past somewhere nearby. Someone across the field shrieks with laughter.",
        "Their eyes flick to yours for a second, like they're checking if you're going to say anything else. Then they look away.",
        '“You can talk to me, you know,” you say. “Whenever.”',
        "Jamie nods, small. The bell goes. As they stand up, their sleeve shifts — and there's a bruise on their forearm, dark, in an odd spot. Could be from football. Could be a dozen ordinary things. Jamie clocks that you've seen it and tugs the sleeve down without saying anything."
      ],
      evidence: [
        {
          id: 'vis-2',
          type: 'visual',
          title: 'A bruise, probably nothing',
          description: 'Forearm, glimpsed properly this time',
          content: "A dark bruise on Jamie's forearm. On its own this could mean almost anything — kids bruise easily, PE is rough, siblings fight. What stands out isn't the bruise itself, it's how fast Jamie covered it up the second they noticed you'd seen.",
          timestamp: 'Monday, break time'
        },
        {
          id: 'obs-3',
          type: 'observation',
          title: '"Slept funny"',
          description: 'Something said without quite landing',
          content: 'You noticed Jamie rubbing their arm through their sleeve. When you asked about it, the answer came a beat too slow — "I slept funny, it\'s nothing." Maybe they did. But they also looked at you for just a second after they said it, like they were checking something. Maybe they just want it to be that simple too.',
          timestamp: 'Monday, break time'
        }
      ],
      choices: [
        {
          id: 'c3a-1',
          text: 'Decide you need to tell someone today',
          consequence: 'You\'ve been turning it over all afternoon — the changing room, the bruise, the way Jamie covered it up. You don\'t have proof of anything. But you know enough.',
          feedback: 'You don\'t need to be certain to act. You just need to trust what you\'ve noticed.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 20
        },
        {
          id: 'c3a-2',
          text: 'Wait to see if there are more signs first',
          consequence: 'You decide to give it a bit longer before saying anything. But you can\'t stop thinking about that bruise for the rest of the day.',
          feedback: 'Waiting feels safer in the moment — but it also means Jamie\'s carrying this alone a bit longer than they need to.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 5
        },
        {
          id: 'c3a-3',
          text: 'Message the group chat — ask if anyone else has noticed Jamie being off',
          consequence: 'You type it out before you can think too hard about it. A few people reply. "Yeah a bit." "Why, what\'s happened?" You end up saying more than you meant to.',
          feedback: 'Wanting to understand what\'s happening is natural. But telling your mates instead of an adult just makes it spread — it doesn\'t actually get Jamie any help.',
          isOptimal: false,
          nextSceneId: 'scene-4-risk',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 3b: Alternative path
    {
      id: 'scene-3b',
      title: 'The Afternoon',
      environment: 'classroom',
      narrative: [
        "At lunch Jamie is briefly, almost fine — laughing at something, easy for a moment. Then they check their phone and go quiet, slipping away from the group without a word.",
        "Marcus drops into the seat next to you. \"They were off for the last few days of last term — you know that?\" He's not gossiping, just mentioning it. \"I live next door so I noticed. And their mum's boyfriend doesn't want them going out after school, so they just go straight home now.\"",
        "He shrugs and goes back to his lunch. You sit with that for a moment.",
        "The afternoon drags. Jamie sits through lessons barely speaking — so unlike the person who normally can't stop talking.",
        "In art, you notice Jamie drawing instead of doing the actual task. You drift past and catch a glimpse: a small figure standing alone, surrounded by dark scribbly lines. A much bigger figure looms in the corner, coloured in heavy red.",
        "Jamie spots you looking and quickly screws the paper up, shoving it in their bag.",
        '"Just doodling," they mutter.',
        "It's just a drawing. You've scribbled worse in double maths. Probably.",
        "When the bell goes for the end of the day, the corridor fills fast — bags, chairs, the push for the door. You're halfway out before you notice Jamie is still at their desk. Slowly, slowly putting things away. Like there's no particular reason to be anywhere soon.",
        "By the end of the day, you've noticed a few things now, and they're starting to add up to a feeling you can't quite shake."
      ],
      evidence: [
        {
          id: 'vis-3',
          type: 'visual',
          title: 'Just a doodle',
          description: 'Drawing in art',
          content: "A small lonely figure, a much bigger one looming over it in red. On its own it's just a drawing — kids draw dark stuff sometimes and it means nothing. What stuck with you was how fast Jamie hid it the second they noticed you'd seen.",
          timestamp: 'Monday, art lesson'
        },
        {
          id: 'obs-attendance',
          type: 'observation',
          title: 'Missing days',
          description: 'Something Marcus mentioned at lunch',
          content: "Marcus said Jamie missed the last few days of last term. No real explanation, just gone. Missing school on its own doesn't mean much — people get ill, stuff comes up. But it's another thing that lines up with everything else that's felt off since the summer.",
          timestamp: 'Monday, lunchtime'
        },
        {
          id: 'obs-control',
          type: 'observation',
          title: "Can't go out after school",
          description: 'Something Marcus mentioned at lunch',
          content: "Jamie's mum's boyfriend doesn't want them going out after school — so they go straight home. Strict parents are like that sometimes, and most of the time it's nothing more. But it also means Jamie's barely seeing anyone outside school anymore. That's worth remembering, alongside everything else.",
          timestamp: 'Monday, lunchtime'
        },
        {
          id: 'obs-home',
          type: 'observation',
          title: 'Not in a hurry to leave',
          description: 'End of the school day',
          content: "When the bell went, everyone moved. Jamie didn't. Still at their desk, slowly packing up while the corridor emptied around them. If you're not in a hurry to get home, there's usually a reason. Easy to miss, easy to explain away. But you noticed it.",
          timestamp: 'Monday, end of day'
        }
      ],
      choices: [
        {
          id: 'c3b-1',
          text: 'Go over to Jamie — say something before the day ends',
          consequence: 'You catch them by the door. "Hey. You alright?" Jamie looks up — surprised, maybe. "Yeah. Fine." They look at the floor. You stay there for a second. "I\'m just — I\'m fine." It\'s the same word twice. You let them go.',
          feedback: 'They didn\'t say anything useful. But they also didn\'t walk away immediately. You noticed that too.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 12
        },
        {
          id: 'c3b-2',
          text: 'Find Marcus — ask what he actually knows about the home situation',
          consequence: '"Not loads," he says. "I live next door so I see them — through the garden, on the street. They don\'t really come out anymore. I asked once if things were alright and they kind of just changed the subject." He pauses. "You think something\'s actually wrong?"',
          feedback: 'Marcus noticed too — he just didn\'t know what to do with it either. This isn\'t yours to carry on your own.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 12
        },
        {
          id: 'c3b-3',
          text: 'Decide you\'ve seen enough — tell a trusted adult today',
          consequence: 'You keep thinking about the drawing, the missed days, the way Jamie stayed behind when everyone else left. None of it is proof of anything. But it doesn\'t feel like nothing.',
          feedback: 'You don\'t need a complete picture to know something\'s wrong.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 15
        },
        {
          id: 'c3b-4',
          text: 'Give it more time — keep an eye on things',
          consequence: 'You tell yourself you\'ll see how the rest of the week goes. The feeling doesn\'t go anywhere.',
          feedback: 'Every day you wait is a day Jamie\'s carrying this on their own.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 3
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4: Telling Your Mum
    {
      id: 'scene-4',
      title: 'Telling Your Mum',
      environment: 'home',
      narrative: [
        "That evening you bring it up while your mum's making tea. The long sleeves. The way Jamie winced. The bruise you caught a glimpse of. And the image that keeps coming back — Jamie still at their desk when everyone else had gone, not in any hurry to go home.",
        "She's half-listening, stirring something on the hob.",
        '"He\'s probably just having a hard adjustment," she says. "First few weeks back after summer are always tough. Give it a bit."',
        "You're quiet for a moment.",
        '"I really don\'t think it\'s that," you say.',
        "She turns around properly now. Looks at you.",
        '"If you\'re genuinely worried about your friend," she says, "tell your teacher. That\'s what they\'re there for."',
        "She turns back to the hob. You stay where you are, thinking about Jamie's sleeve."
      ],
      choices: [
        {
          id: 'c4-1',
          text: 'Decide to find your form tutor first thing tomorrow',
          consequence: 'You don\'t sleep brilliantly. But you know what you\'re going to do in the morning.',
          feedback: 'A trusted adult doesn\'t have to be a parent. Your form tutor is exactly the right person for this.',
          isOptimal: true,
          nextSceneId: 'scene-4-tutor',
          points: 15
        },
        {
          id: 'c4-2',
          text: 'Leave it for now — maybe your mum\'s right',
          consequence: 'You tell yourself she probably knows best. But you don\'t quite believe it.',
          feedback: 'Doubt is normal. But the feeling that made you bring it up in the first place was there for a reason.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 3
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4-tutor: Before Registration
    {
      id: 'scene-4-tutor',
      title: 'Before Registration',
      environment: 'classroom',
      narrative: [
        "You get in early the next morning. Your form tutor is at their desk, marking something.",
        "You hover in the doorway for a second. They look up and smile. \"Morning. You alright?\"",
        "\"Can I — can I talk to you about something? It's about a friend.\"",
        "They set the pen down. \"Course. Sit down.\""
      ],
      choices: [
        {
          id: 'c4t-1',
          text: '"I feel like I\'m grassing on my friend. But I don\'t know what else to do."',
          consequence: 'You tell them. The sleeves. The wince when Marcus grabbed their arm. The bruise. All the things that have been sitting in your chest since Monday.',
          feedback: 'The guilt you felt walking in is what most people feel. But telling someone and betraying someone aren\'t the same thing — one keeps your friend safe.',
          isOptimal: true,
          nextSceneId: 'scene-4-tutor-resolve',
          points: 20
        },
        {
          id: 'c4t-2',
          text: '"Actually — it\'s probably nothing. Sorry. Forget I said anything."',
          consequence: 'Your tutor smiles, unhurried. "Okay. No pressure." They slide a small card across the desk. "That\'s got my email on it. And I\'m in here at lunch if you change your mind, alright?"',
          feedback: 'The tutor gave you a way back in. The question is whether you take it.',
          isOptimal: false,
          nextSceneId: 'scene-4-tutor-interim',
          points: 5
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4-tutor-interim: Second period — gnawing feeling
    {
      id: 'scene-4-tutor-interim',
      title: 'Second Period',
      environment: 'classroom',
      narrative: [
        "The feeling doesn't go anywhere. If anything it gets heavier.",
        "In second period you see Jamie a few rows ahead — sleeves pulled down, staring at the desk. Someone asks them something and they just shake their head.",
        "This isn't the same person you saw laughing at break yesterday.",
        "You look at the clock. Lunch is forty minutes away."
      ],
      choices: [
        {
          id: 'c4ti-1',
          text: 'Go back to your form tutor at lunch',
          consequence: 'The classroom door is open. Your tutor is eating a sandwich but looks up and waves you in with a smile. "Glad you came back," they say, easy, like it\'s nothing. They push the sandwich aside.',
          feedback: 'You nearly didn\'t come back. But you did. That\'s the part that matters.',
          isOptimal: true,
          nextSceneId: 'scene-4-tutor-resolve',
          points: 15
        },
        {
          id: 'c4ti-2',
          text: 'Leave it. See how the rest of the week goes.',
          consequence: 'You tell yourself you\'ll go back tomorrow if it\'s still bothering you. It still bothers you. But the moment keeps not feeling quite right.',
          feedback: 'Every day of waiting is another day Jamie carries this on their own.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4-tutor-resolve: At lunch — full disclosure
    {
      id: 'scene-4-tutor-resolve',
      title: 'At Lunch',
      environment: 'classroom',
      narrative: [
        "You tell them everything. The sleeves. The bruise. The way Jamie winced when Marcus grabbed their arm. The drawing in art. All the things that have been sitting in your chest.",
        "Your tutor listens without rushing you.",
        '"Thank you for telling me. I mean that." A pause. "I need to speak to Mrs Okonkwo — she\'s our designated safeguarding lead. It\'s her job to take this forward properly. I can\'t keep it between us, but it will be handled carefully. I promise you that."',
        "You nod.",
        '"You haven\'t got Jamie in trouble," they say. "You\'ve made sure someone knows to look out for them. Those are different things."'
      ],
      choices: [
        {
          id: 'c4tr-1',
          text: 'Nod and go to your next lesson',
          consequence: 'You don\'t know exactly what happens next — that part isn\'t yours to know. But you\'re not carrying it alone anymore.',
          feedback: 'The telling was the part that was yours to do. The rest belongs to the people whose job it is.',
          isOptimal: true,
          nextSceneId: 'scene-5',
          points: 10
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4 Delayed Path
    {
      id: 'scene-4-delayed',
      title: 'A Sleepless Night',
      environment: 'home',
      narrative: [
        "That night you can't sleep. Jamie's face keeps surfacing — the wince, the hidden wrist, the screwed-up drawing.",
        "You tell yourself you'll wait, watch a bit longer, be sure before you say anything.",
        "But a question keeps circling: what if waiting means Jamie goes through more of this alone, for nothing?",
        "By morning, you've made up your mind."
      ],
      choices: [
        {
          id: 'c4d-1',
          text: 'Tell your mum everything, first thing',
          consequence: 'You tell her on the way to school. She pulls over for a second to really listen, then says, "Thank you for telling me. I\'ll speak to the school today."',
          feedback: 'A day later than you might have liked, but you still trusted the feeling enough to act on it. That\'s what matters.',
          isOptimal: true,
          nextSceneId: 'scene-5',
          points: 10
        },
        {
          id: 'c4d-2',
          text: 'Decide to keep watching instead',
          consequence: 'You tell yourself you\'ll say something if it gets worse. The days go by. Jamie seems to retreat further, and the moment to say something never quite feels like the right one.',
          feedback: 'Every day of waiting is another day Jamie carries this on their own.',
          isOptimal: false,
          nextSceneId: 'scene-4-silence',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4 Risk Path
    {
      id: 'scene-4-risk',
      title: 'Asking Around',
      environment: 'home',
      narrative: [
        "That evening you open the group chat and type it out: \"hey has anyone noticed jamie being a bit off lately? like really off? kinda worried\"",
        "A few people reply quickly. \"Yeah a bit.\" \"Why, what's happened?\" \"Is everything okay?\"",
        "You end up saying more than you meant to. The long sleeves. The way they winced. The bruise you thought you saw.",
        "You put your phone down and feel slightly better.",
        "Until the next morning.",
        "Jamie doesn't look at you when you walk in — not the not-looking of someone having a bad day, but the not-looking of someone who knows you talked about them.",
        "At break Marcus finds you. \"Jamie's not happy. They know someone's been saying something.\" He looks uncomfortable. \"You know what this lot are like. It got around.\""
      ],
      evidence: [
        {
          id: 'obs-4',
          type: 'observation',
          title: 'Word got around',
          description: 'The morning after the group chat',
          content: 'Jamie knows someone was talking about them — and they\'re taking it as betrayal, not someone caring. Telling your mates instead of a teacher or parent meant it just did the rounds instead of reaching anyone who could actually help. Jamie might be harder to talk to now than before.',
          timestamp: 'Tuesday morning'
        }
      ],
      choices: [
        {
          id: 'c4r-1',
          text: 'Tell your mum what happened — all of it, including the group chat',
          consequence: '"That probably wasn\'t the best move," your mum says, not unkindly. "But the important thing is what you noticed. Tell your form tutor tomorrow — that\'s the right person for this."',
          feedback: 'Owning the part that didn\'t go well is hard. But it opened the right path again.',
          isOptimal: true,
          nextSceneId: 'scene-4-tutor',
          points: 8
        },
        {
          id: 'c4r-2',
          text: 'Say nothing more — hope it dies down',
          consequence: 'You tell yourself Jamie will get over it. The days go by. They don\'t.',
          feedback: 'The group chat made things harder — and now the moment to put it right is passing too.',
          isOptimal: false,
          nextSceneId: 'scene-4-silence',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Bridge scene: didn't tell anyone
    {
      id: 'scene-4-silence',
      title: 'Carrying It Alone',
      environment: 'classroom',
      narrative: [
        "The weeks go on. Jamie's seat is empty more often than not now.",
        "You think about saying something more than once. Each time, it feels like too much, or too late, or not really your business after all.",
        "You don't know what's happening at Jamie's house. You never told anyone enough to find out."
      ],
      choices: [
        {
          id: 'c4s-1',
          text: 'Carry on',
          consequence: 'There\'s no big moment, no dramatic ending. Just the quiet weight of a feeling you didn\'t do anything with.',
          feedback: '',
          isOptimal: false,
          nextSceneId: 'scene-final-sobering',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5: telling someone, leading to the good outcome
    {
      id: 'scene-5',
      title: 'The Days That Follow',
      environment: 'classroom',
      narrative: [
        "You don't hear exactly what happens next — that part isn't really yours to know. But over the next couple of weeks, things shift, quietly.",
        "Jamie's away for a few days. When they come back, something about them is different — lighter, somehow, even if they're still quiet about it.",
        "You don't ask. You just keep being around, the way you always were."
      ],
      choices: [
        {
          id: 'c5-1',
          text: 'Keep being a normal friend',
          consequence: 'You don\'t make it a big thing. You just sit with Jamie at lunch, same as always, and let them set the pace.',
          feedback: 'Consistency matters as much as the original telling did — Jamie needs things to feel normal again.',
          isOptimal: true,
          nextSceneId: 'scene-final-good',
          points: 10
        }
      ],
      isDecisionPoint: true
    },
    // Final scenes — binary, narrative, never scored
    {
      id: 'scene-final-good',
      title: 'Some Weeks Later',
      narrative: [
        "It's a few weeks later, and Jamie's at lunch with the rest of you, actually laughing at something stupid Marcus said.",
        "Walking home, Jamie says, out of nowhere: \"Thanks for not just... ignoring it. The thing in the summer.\"",
        "You don't really know what to say to that, so you just shrug. \"Course.\"",
        "Jamie smiles — a small one, but a real one — and changes the subject."
      ],
      isDecisionPoint: false,
      isFinalScene: true,
      epilogueOutcome: 'good'
    },
    {
      id: 'scene-final-sobering',
      title: 'Some Weeks Later',
      narrative: [
        "It's a few weeks later. Jamie's seat is still empty more often than it used to be.",
        "You still think about that bruise sometimes, the way it disappeared the second you noticed it.",
        "You tell yourself it's probably fine. You're not sure you believe it."
      ],
      isDecisionPoint: false,
      isFinalScene: true,
      epilogueOutcome: 'sobering'
    }
  ]
};
