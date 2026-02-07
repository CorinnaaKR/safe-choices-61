import { Scenario } from '@/types/simulation';

export const safeguardingScenario: Scenario = {
  id: 'jamie-case',
  title: "Jamie's Story",
  description: "A concerning pattern emerges around a Year 5 pupil. Your decisions will shape the outcome.",
  role: "Year 5 Class Teacher",
  learningObjectives: [
    "Recognise signs of potential abuse and neglect",
    "Understand when and how to escalate concerns",
    "Practice evidence gathering and documentation",
    "Learn appropriate professional boundaries",
    "Understand multi-agency working"
  ],
  scenes: [
    // Scene 1: Opening
    {
      id: 'scene-1',
      title: 'Monday Morning',
      narrative: [
        "It's a crisp Monday morning in late October. You arrive at Riverside Primary School, coffee in hand, ready to start another week with your Year 5 class.",
        "As children file into the classroom, you notice Jamie—usually one of the first to arrive, chatty and eager—slipping in quietly after the bell. Their uniform looks crumpled, as if slept in, and there's a faint smell of unwashed clothes.",
        "Jamie avoids eye contact and heads straight to their seat at the back, pulling their sleeves down over their hands despite the warm classroom.",
        "You've known Jamie for two months now. Bright, creative, usually full of energy. But something feels different today."
      ],
      evidence: [
        {
          id: 'obs-1',
          type: 'observation',
          title: 'Initial Appearance',
          description: 'Observations from Monday morning',
          content: 'Jamie arrived late, wearing crumpled uniform that appeared unwashed. Avoided eye contact and sat at the back. Sleeves pulled down over hands. Noticeable change from usual bright demeanor.',
          timestamp: 'Monday, 9:05 AM'
        }
      ],
      choices: [
        {
          id: 'c1-1',
          text: 'Approach Jamie quietly and ask if everything is okay',
          consequence: 'You walk over to Jamie\'s desk during registration. They flinch slightly as you approach, then mumble "I\'m fine, miss" without looking up.',
          feedback: 'Good instinct to check in, but be mindful of approaching gently and not putting pressure on the child to disclose in front of peers.',
          isOptimal: true,
          nextSceneId: 'scene-2',
          points: 10
        },
        {
          id: 'c1-2',
          text: 'Make a mental note and observe throughout the day',
          consequence: 'You decide to watch Jamie throughout the morning, giving them space while staying alert to any other concerning signs.',
          feedback: 'Observation is important, but an initial gentle check-in shows the child you\'ve noticed and care.',
          isOptimal: false,
          nextSceneId: 'scene-2',
          points: 5
        },
        {
          id: 'c1-3',
          text: 'Ask Jamie loudly if they forgot to wash their uniform',
          consequence: 'Jamie\'s face flushes red. Other children giggle. Jamie shrinks further into their seat, and you notice their hands trembling slightly.',
          feedback: 'This approach risks humiliating the child and may damage trust. Always maintain dignity and speak privately about sensitive matters.',
          isOptimal: false,
          nextSceneId: 'scene-2',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 2: The Playground
    {
      id: 'scene-2',
      title: 'Break Time',
      narrative: [
        "During morning break, you're on playground duty. The October sun is weak but the children are energetic, running and playing as usual.",
        "You spot Jamie sitting alone on a bench near the fence, picking at a sleeve. Their usual group of friends are playing football nearby, but Jamie makes no move to join them.",
        "As you watch, one of Jamie's friends—Marcus—runs over and tries to pull Jamie up to join the game. Jamie yanks their arm away sharply and you catch a glimpse of something dark on their wrist before the sleeve is quickly pulled down.",
        "Marcus looks confused and walks back to the game, shrugging at his friends."
      ],
      evidence: [
        {
          id: 'obs-2',
          type: 'observation',
          title: 'Playground Observation',
          description: 'Behaviour during break time',
          content: 'Jamie sat alone, avoiding friends. When Marcus tried to pull them up, Jamie reacted sharply. Glimpse of dark mark on wrist before sleeve pulled down. Social withdrawal from usual friend group.',
          timestamp: 'Monday, 10:45 AM'
        },
        {
          id: 'vis-1',
          type: 'visual',
          title: 'Possible Injury',
          description: 'Mark observed on wrist',
          content: 'Brief glimpse of dark mark on Jamie\'s wrist. Could not determine nature of mark. Jamie quickly concealed it by pulling down sleeve.',
          timestamp: 'Monday, 10:47 AM'
        }
      ],
      choices: [
        {
          id: 'c2-1',
          text: 'Go over and sit with Jamie, making casual conversation',
          consequence: 'You sit beside Jamie on the bench. "Mind if I join you? I needed a rest from all that running around." Jamie shrugs but doesn\'t move away. After a moment, they quietly say, "My arm hurts."',
          feedback: 'Excellent approach. Creating a safe, low-pressure opportunity for the child to share shows good safeguarding practice.',
          isOptimal: true,
          nextSceneId: 'scene-3a',
          points: 15
        },
        {
          id: 'c2-2',
          text: 'Ask Marcus what happened with Jamie',
          consequence: 'Marcus says Jamie has been "weird" lately and won\'t play anymore. "They said their mum\'s boyfriend doesn\'t like them going out after school."',
          feedback: 'Gathering information from peers can be helpful, but be careful not to encourage gossip. Direct engagement with the child is usually better.',
          isOptimal: false,
          nextSceneId: 'scene-3b',
          points: 8
        },
        {
          id: 'c2-3',
          text: 'Write down what you saw and continue monitoring',
          consequence: 'You note down your observations but remain at a distance. Jamie stays on the bench until the bell rings, walking back to class alone.',
          feedback: 'Documentation is important, but this was an opportunity for gentle engagement that was missed.',
          isOptimal: false,
          nextSceneId: 'scene-3b',
          points: 5
        }
      ],
      isDecisionPoint: true
    },
    // Scene 3a: After Approaching Jamie
    {
      id: 'scene-3a',
      title: 'A Moment of Trust',
      narrative: [
        '"My arm hurts." Jamie\'s voice is small, almost a whisper.',
        "You keep your voice calm and gentle. \"I'm sorry to hear that. What happened?\"",
        "Jamie is quiet for a long moment. A football bounces past. Children shriek with laughter somewhere across the playground.",
        "\"I fell,\" Jamie says finally. But their eyes tell a different story—they dart to yours for just a second, searching for something. Permission, perhaps. Or trust.",
        "\"Sometimes,\" you say carefully, \"it can be hard to talk about things. But I want you to know I'm here if you ever want to.\"",
        "Jamie nods. The bell rings. As they stand up, their sleeve rides up again and you see it more clearly now—a distinct bruise, finger-shaped, wrapped around their forearm."
      ],
      evidence: [
        {
          id: 'vis-2',
          type: 'visual',
          title: 'Confirmed Bruising',
          description: 'Finger-shaped bruise on forearm',
          content: 'Clear finger-shaped bruising visible on Jamie\'s forearm when sleeve rode up. Consistent with grabbing injury. Jamie claimed they "fell" but explanation does not match injury pattern.',
          timestamp: 'Monday, 10:55 AM'
        },
        {
          id: 'obs-3',
          type: 'observation',
          title: 'Verbal Disclosure Attempt',
          description: 'Possible disclosure during conversation',
          content: 'Jamie stated "my arm hurts" unprompted. When asked what happened, gave unconvincing explanation of falling. Eye contact suggested they wanted to share more but felt unable to.',
          timestamp: 'Monday, 10:52 AM'
        }
      ],
      choices: [
        {
          id: 'c3a-1',
          text: 'Report to the Designated Safeguarding Lead immediately',
          consequence: 'You find Ms. Patterson, the DSL, at lunchtime and share everything you\'ve observed. She thanks you for reporting and says she\'ll begin the appropriate procedures.',
          feedback: 'This is the correct response. A physical injury that doesn\'t match the explanation given should always be reported to the DSL promptly.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 20
        },
        {
          id: 'c3a-2',
          text: 'Wait to see if there are more signs before reporting',
          consequence: 'You decide to gather more evidence before escalating. But as the day goes on, you can\'t stop thinking about that bruise.',
          feedback: 'Waiting for "more evidence" can delay protection for a child at risk. One clear indicator with concerning context is enough to report.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 5
        },
        {
          id: 'c3a-3',
          text: 'Speak to Jamie\'s parents first to get their side',
          consequence: 'You resolve to call Jamie\'s home that evening to discuss your concerns with the family.',
          feedback: 'Never contact parents before speaking with the DSL when abuse is suspected. This could put the child at further risk and compromise any investigation.',
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
      narrative: [
        "The afternoon passes with a heavy feeling. Jamie sits through lessons, barely participating—so unlike the child who usually has their hand up for every question.",
        "During art class, you notice Jamie drawing while others work on their assigned project. You drift over casually and catch a glimpse of the picture: a small figure, alone, surrounded by dark, scratchy lines. A larger figure looms in the corner, colored in angry red.",
        "Jamie sees you looking and quickly crumples the paper, shoving it into their bag.",
        "\"Just doodling,\" they mutter.",
        "By the end of the day, you've accumulated several concerning observations. The question is: what do you do with them?"
      ],
      evidence: [
        {
          id: 'vis-3',
          type: 'visual',
          title: 'Concerning Drawing',
          description: 'Art created during class',
          content: 'Drawing showed small isolated figure surrounded by dark scribbles. Larger figure colored in red in corner - appeared threatening. Jamie crumpled and hid the drawing when noticed.',
          timestamp: 'Monday, 2:15 PM'
        }
      ],
      choices: [
        {
          id: 'c3b-1',
          text: 'Report all observations to the Designated Safeguarding Lead',
          consequence: 'You compile your notes and speak to Ms. Patterson before leaving for the day. She listens carefully and thanks you for your thoroughness.',
          feedback: 'Good decision. Multiple concerning signs should always be reported. The DSL can assess the full picture and decide on next steps.',
          isOptimal: true,
          nextSceneId: 'scene-4',
          points: 15
        },
        {
          id: 'c3b-2',
          text: 'Discuss concerns with a colleague first',
          consequence: 'You mention your worries to Mr. Evans in the staff room. He says, "Kids have off days. Probably just tired."',
          feedback: 'While peer support is valuable, concerns should go to the DSL rather than being discussed informally. Colleagues may inadvertently minimize or dismiss valid concerns.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 5
        },
        {
          id: 'c3b-3',
          text: 'Keep monitoring for the rest of the week',
          consequence: 'You decide to watch and wait, keeping detailed notes of anything concerning.',
          feedback: 'Every day of delay is a day a child might remain at risk. When you have multiple indicators, report promptly.',
          isOptimal: false,
          nextSceneId: 'scene-4-delayed',
          points: 3
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4: The Report
    {
      id: 'scene-4',
      title: 'The Right Response',
      narrative: [
        "Ms. Patterson, the Designated Safeguarding Lead, closes her office door and gestures for you to sit.",
        "\"Tell me everything,\" she says, notepad ready.",
        "You walk through the morning: Jamie's late arrival, the crumpled uniform, the smell of unwashed clothes, the social withdrawal. Then the playground—the flinch, the glimpse of the bruise, the unconvincing explanation.",
        "Ms. Patterson nods, making notes. \"You've done exactly the right thing by coming to me. I'll need you to write this up formally—stick to facts, what you observed, exact words used.\"",
        "\"What happens now?\" you ask.",
        "\"I'll review our records for Jamie, speak with other staff, and make a decision about whether this meets the threshold for a referral to Children's Services. You may be asked to provide your written account if it goes further.\""
      ],
      evidence: [
        {
          id: 'msg-1',
          type: 'message',
          title: 'DSL Meeting Notes',
          description: 'Record of safeguarding meeting',
          content: 'Met with DSL Ms. Patterson. Provided verbal account of all observations. Asked to complete formal written record. DSL to review records and assess threshold for Children\'s Services referral.',
          timestamp: 'Monday, 3:45 PM'
        }
      ],
      choices: [
        {
          id: 'c4-1',
          text: 'Complete the written record immediately, using only factual observations',
          consequence: 'You stay late to write up your account, being careful to separate what you observed from your interpretations. You submit it to Ms. Patterson before leaving.',
          feedback: 'Excellent practice. Prompt, factual documentation is crucial. Distinguishing observations from opinions ensures the record is useful for any investigation.',
          isOptimal: true,
          nextSceneId: 'scene-5',
          points: 15
        },
        {
          id: 'c4-2',
          text: 'Write the report but include your theory about what\'s happening at home',
          consequence: 'Your report includes detailed speculation about possible abuse scenarios based on what you\'ve observed.',
          feedback: 'While your instincts may be correct, records should contain observations, not theories. Speculation can compromise investigations and is not your role to determine.',
          isOptimal: false,
          nextSceneId: 'scene-5',
          points: 8
        },
        {
          id: 'c4-3',
          text: 'Promise to write the report but leave it for tomorrow',
          consequence: 'The busyness of the day catches up with you. You\'ll definitely do it first thing tomorrow.',
          feedback: 'Delays in documentation can mean details are forgotten or the urgency is lost. Complete records promptly while events are fresh.',
          isOptimal: false,
          nextSceneId: 'scene-5',
          points: 5
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4 Delayed Path
    {
      id: 'scene-4-delayed',
      title: 'A Sleepless Night',
      narrative: [
        "That night, you can't sleep. Jamie's face keeps appearing—the flinch, the hidden wrist, the crumpled drawing stuffed into a bag.",
        "You tell yourself you'll keep watching. Gather more evidence. Be sure before you escalate.",
        "But a question keeps circling: What if tonight is the night something worse happens? What if your hesitation costs Jamie something you can't take back?",
        "By morning, you've made your decision."
      ],
      choices: [
        {
          id: 'c4d-1',
          text: 'Go straight to the DSL first thing in the morning',
          consequence: 'You arrive early and catch Ms. Patterson before the school day starts. She listens intently and thanks you for reporting.',
          feedback: 'Better late than never. You recognized the weight of what you observed and took action. In future, report on the same day when possible.',
          isOptimal: true,
          nextSceneId: 'scene-5-late',
          points: 10
        },
        {
          id: 'c4d-2',
          text: 'Continue monitoring for a few more days',
          consequence: 'You watch Jamie closely for the next two days. On Wednesday, Jamie doesn\'t come to school at all.',
          feedback: 'Delays can have serious consequences. By the time you act, the situation may have escalated beyond what early intervention could have prevented.',
          isOptimal: false,
          nextSceneId: 'scene-5-crisis',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 4 Risk Path - Parent Contact
    {
      id: 'scene-4-risk',
      title: 'A Dangerous Decision',
      narrative: [
        "That evening, you call Jamie's home number from the school records.",
        "A man's voice answers—gruff, suspicious. \"Who's this?\"",
        "You explain you're Jamie's teacher, that you noticed some things today and wanted to check in.",
        "There's a long pause. \"Jamie's fine. Mind your own business.\" The line goes dead.",
        "The next morning, Jamie arrives at school even more withdrawn than before. They won't look at you at all now. During break, you overhear them whisper to Marcus: \"I'm in so much trouble. Someone told.\""
      ],
      evidence: [
        {
          id: 'obs-4',
          type: 'observation',
          title: 'Increased Withdrawal',
          description: 'Change after parent contact',
          content: 'Following phone call to home, Jamie significantly more withdrawn. Avoiding all eye contact with teacher. Heard saying "I\'m in so much trouble. Someone told." Suggests child may be at increased risk.',
          timestamp: 'Tuesday, 9:15 AM'
        }
      ],
      choices: [
        {
          id: 'c4r-1',
          text: 'Report everything to the DSL immediately, including your phone call',
          consequence: 'You find Ms. Patterson and tell her everything—including your mistake in calling home. Her expression is serious but she thanks you for your honesty.',
          feedback: 'You made an error in contacting the family, but you recognized it and reported immediately. Honesty about mistakes is essential in safeguarding.',
          isOptimal: true,
          nextSceneId: 'scene-5-urgent',
          points: 10
        },
        {
          id: 'c4r-2',
          text: 'Don\'t mention the phone call—just report the original concerns',
          consequence: 'You tell the DSL about Jamie\'s appearance and the bruise but leave out your phone call home.',
          feedback: 'Withholding information compromises the safeguarding process. The DSL needs the full picture to protect the child—including any actions that may have escalated risk.',
          isOptimal: false,
          nextSceneId: 'scene-5-incomplete',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5: Following Up
    {
      id: 'scene-5',
      title: 'The Days That Follow',
      narrative: [
        "The wheels of safeguarding turn. Ms. Patterson makes a referral to Children's Services. A social worker is assigned to assess Jamie's situation.",
        "You continue to be a calm, consistent presence for Jamie in school. Some days they seem brighter; others, they retreat again. But you notice small things—they sit a little closer to the front now. Once, they stayed behind to show you a story they wrote.",
        "Two weeks later, Ms. Patterson calls you into her office.",
        "\"I wanted to update you,\" she says. \"Children's Services have completed their initial assessment. Jamie has been placed with their grandmother while things are investigated further. They wanted me to tell you—your report was the first piece of the puzzle. It may have changed everything for that child.\"",
        "You think about that first Monday morning. The crumpled uniform. The covered wrists. The small voice saying, 'I'm fine.'"
      ],
      evidence: [
        {
          id: 'msg-2',
          type: 'message',
          title: 'Case Outcome Update',
          description: 'Feedback from DSL',
          content: 'Children\'s Services completed assessment. Jamie placed with grandmother during investigation. Teacher\'s initial report cited as crucial first indicator that prompted action.',
          timestamp: 'Two weeks later'
        }
      ],
      choices: [
        {
          id: 'c5-1',
          text: 'Reflect on the experience and continue supporting Jamie\'s learning',
          consequence: 'You focus on making your classroom a safe, supportive space. Jamie begins to flourish again, their creative light slowly returning.',
          feedback: 'The best follow-up is continued care. Children need stability and normalcy. Your ongoing support is as important as your initial report.',
          isOptimal: true,
          nextSceneId: 'scene-final-good',
          points: 10
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5 Late Path
    {
      id: 'scene-5-late',
      title: 'Acting on Your Instinct',
      narrative: [
        "Ms. Patterson listens carefully to everything you share. When you finish, she's quiet for a moment.",
        "\"Thank you for bringing this to me,\" she says. \"I wish you'd come yesterday—but I understand. It's not always easy to know when to escalate. That's why we have these conversations.\"",
        "She makes a referral that morning. Children's Services respond quickly. By the end of the week, a social worker has made contact with Jamie's family.",
        "The outcome is good, but you can't help wondering: what if you'd waited longer? What if that one extra day had mattered?"
      ],
      choices: [
        {
          id: 'c5l-1',
          text: 'Commit to reporting concerns on the same day in future',
          consequence: 'You learn from this experience. Next time, you won\'t wait. A child\'s safety is worth an uncomfortable conversation.',
          feedback: 'This is professional growth. Reflecting on what you could have done differently prepares you to act faster when it matters.',
          isOptimal: true,
          nextSceneId: 'scene-final-mixed',
          points: 10
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5 Crisis Path
    {
      id: 'scene-5-crisis',
      title: 'The Empty Seat',
      narrative: [
        "Wednesday morning arrives and Jamie's seat is empty.",
        "At lunch, the headteacher calls an emergency staff meeting. Jamie was taken to hospital last night with serious injuries. The police are involved.",
        "\"If anyone has any information about concerns prior to this incident,\" the head says, \"please speak to me or Ms. Patterson immediately.\"",
        "Your stomach drops. You had information. You had concerns. And you waited.",
        "After the meeting, you go straight to Ms. Patterson and tell her everything you observed over the past two days."
      ],
      choices: [
        {
          id: 'c5c-1',
          text: 'Provide your account and commit to learning from this',
          consequence: 'You give a full statement. The guilt is heavy, but you vow that no concern will ever go unreported again.',
          feedback: 'This is a painful but important lesson. Early intervention might have prevented escalation. Your future vigilance can help other children.',
          isOptimal: true,
          nextSceneId: 'scene-final-poor',
          points: 5
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5 Urgent Path (after parent contact)
    {
      id: 'scene-5-urgent',
      title: 'Swift Response',
      narrative: [
        "Ms. Patterson's expression is grave as she listens about the phone call.",
        "\"We need to act immediately,\" she says. \"Your call may have increased the risk at home. I'm going to escalate this as urgent.\"",
        "Within hours, Children's Services and police are involved. Jamie is spoken to by a trained interviewer that afternoon. By evening, they're safe with a relative.",
        "It wasn't the smoothest path. Your well-intentioned call complicated things. But ultimately, Jamie is protected.",
        "Ms. Patterson debriefs with you the next day. \"Your honesty about the phone call was crucial. We could plan our response knowing the family was alerted. In future—always come to me first.\""
      ],
      choices: [
        {
          id: 'c5u-1',
          text: 'Accept the feedback and learn from the experience',
          consequence: 'You understand now why the protocols exist. The DSL is the coordinator. Your role is to report, not investigate.',
          feedback: 'Mistakes happen. What matters is honesty and learning. You\'ve now internalized a key principle of safeguarding practice.',
          isOptimal: true,
          nextSceneId: 'scene-final-mixed',
          points: 10
        }
      ],
      isDecisionPoint: true
    },
    // Scene 5 Incomplete Path
    {
      id: 'scene-5-incomplete',
      title: 'An Incomplete Picture',
      narrative: [
        "Ms. Patterson proceeds with a referral based on what you've told her—Jamie's appearance, the bruise, the withdrawal.",
        "But the social worker's visit takes the family by surprise. Or so it seems. They're prepared, polished, presenting a calm household. \"We're just going through a rough patch,\" Jamie's mother says. \"The school has been very... attentive.\"",
        "The case is closed as 'no further action.' Jamie returns to school, quiet as ever. They still flinch when adults approach. They still hide their arms.",
        "You know something is wrong. But you've also hidden the truth about your phone call—the reason the family was ready for that visit.",
        "The weight of what you didn't say sits heavy in your chest."
      ],
      choices: [
        {
          id: 'c5i-1',
          text: 'Come clean to the DSL about your phone call',
          consequence: 'You tell Ms. Patterson everything. It\'s humiliating, but necessary. She reopens the case with the new information.',
          feedback: 'It took courage to admit your mistake. Transparency, even late, can still help. The safeguarding system can only work with complete information.',
          isOptimal: true,
          nextSceneId: 'scene-final-poor',
          points: 5
        },
        {
          id: 'c5i-2',
          text: 'Stay silent and hope the situation improves',
          consequence: 'Weeks pass. Jamie becomes more withdrawn. Then one day, they stop coming to school altogether.',
          feedback: 'Covering up mistakes puts children at risk. Your discomfort matters far less than a child\'s safety.',
          isOptimal: false,
          nextSceneId: 'scene-final-very-poor',
          points: 0
        }
      ],
      isDecisionPoint: true
    },
    // Final Scenes
    {
      id: 'scene-final-good',
      title: 'Best Outcome',
      narrative: [
        "Months later, you're tidying the classroom at the end of the day when Jamie appears at the door.",
        "\"I just wanted to say thank you,\" they say quietly. \"For noticing. For telling someone. Nan says you helped save me.\"",
        "You smile, blinking back tears. \"I just did what any teacher should do.\"",
        "\"But you actually did it,\" Jamie says. \"That's different.\"",
        "They leave, backpack bouncing, heading to their grandmother's car. A child with a future stretching out before them—a future that might not have existed without that first report.",
        "You did your job. You followed the procedures. You trusted the system.",
        "And it worked."
      ],
      isDecisionPoint: false,
      isFinalScene: true
    },
    {
      id: 'scene-final-mixed',
      title: 'A Difficult Lesson',
      narrative: [
        "Jamie is safe now, living with their grandmother while the investigation continues. But the road was bumpier than it needed to be.",
        "Looking back, you see the moments where things could have gone differently—faster, smoother, with less risk along the way.",
        "In the staff training session a month later, you share your experience (with details anonymized). \"I learned that trusting my instincts isn't enough,\" you tell your colleagues. \"I had to trust the process too. Report early. Report to the right person. Let the DSL coordinate.\"",
        "You'll carry these lessons forward. The next time a child needs help, you'll be ready.",
        "Jamie's story could have had a worse ending. But it didn't—because eventually, the right actions were taken.",
        "That knowledge will have to be enough."
      ],
      isDecisionPoint: false,
      isFinalScene: true
    },
    {
      id: 'scene-final-poor',
      title: 'Hard Lessons Learned',
      narrative: [
        "Jamie eventually found safety—but not as quickly as they should have. The delays, the missteps, the incomplete information—all of it meant more days at risk.",
        "In the formal debrief that follows, you sit with the weight of what could have been done differently. The DSL is kind but clear: \"Early reporting saves lives. Complete information is essential. And we never contact parents when abuse is suspected.\"",
        "You nod, these lessons branded into your memory now.",
        "Jamie is recovering, slowly. Their grandmother reports progress. The creative light is returning.",
        "You didn't handle this perfectly. But you learned. And that learning might protect the next child—might ensure they get help faster, sooner, before things escalate.",
        "In safeguarding, we don't always get second chances. But we can always do better next time."
      ],
      isDecisionPoint: false,
      isFinalScene: true
    },
    {
      id: 'scene-final-very-poor',
      title: 'The Cost of Silence',
      narrative: [
        "Jamie didn't come back to school. You heard through whispers in the staff room that they'd been hospitalized, then moved far away to live with relatives in another county.",
        "The investigation that followed was thorough. Your name came up—the teacher who noticed things early. Who called the house. Who then said nothing about it.",
        "There's a formal review. Questions about what you knew and when. About why information was withheld.",
        "In the end, Jamie survived. They're getting help now, far from Riverside Primary. But the months of additional suffering—the silence that protected you more than them—that's something you'll carry forever.",
        "The training manual says it clearly: 'It could happen here.'",
        "It did happen here. And you could have done more.",
        "That's the hardest lesson of all."
      ],
      isDecisionPoint: false,
      isFinalScene: true
    }
  ]
};
