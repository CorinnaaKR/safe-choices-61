import {
  Scenario,
  EvidenceCategory,
  EvidenceImportance,
  SceneEnvironment,
} from '@/types/simulation';
import { safeguardingScenario as base } from '@/data/scenario';

/**
 * Jamie's Story — Story / learning mode only.
 *
 * The player is a Year 7 classmate and friend of Jamie, returning from summer
 * break and gradually noticing that something feels wrong. The narrative lives
 * in `data/scenario.ts`; this module adds the engine metadata.
 *
 * Design principles (see memory/safeguarding-restructure-jamie-friend-pov.md):
 *  - NOT a memory/completionism test — gut instinct and emotional resonance
 *  - "Observations" not "Evidence" (soft, subjective, opt-in)
 *  - Ending gated only on whether the player told a trusted adult — never on count
 *  - No scoring, no skill-area mapping, no successCriteria
 */

const evidenceMeta: Record<
  string,
  { category: EvidenceCategory; importance: EvidenceImportance; points: number }
> = {
  'obs-1':         { category: 'behavioural', importance: 'major',    points: 0 },
  'obs-pe-1':      { category: 'physical',    importance: 'major',    points: 0 },
  'obs-2':         { category: 'behavioural', importance: 'major',    points: 0 },
  'vis-1':         { category: 'physical',    importance: 'major',    points: 0 },
  'vis-2':         { category: 'physical',    importance: 'critical', points: 0 },
  'obs-3':         { category: 'verbal',      importance: 'critical', points: 0 },
  'obs-attendance': { category: 'behavioural', importance: 'minor',   points: 0 },
  'obs-control':    { category: 'behavioural', importance: 'major',   points: 0 },
  'obs-home':       { category: 'behavioural', importance: 'major',   points: 0 },
  'obs-4':          { category: 'behavioural', importance: 'minor',   points: 0 },
};

const sceneEnvironments: Record<string, SceneEnvironment> = {
  'scene-1':         'classroom',
  'scene-2':         'playground',
  'scene-3a':        'playground',
  'scene-3b':        'classroom',
  'scene-4':         'home-jamie',
  'scene-4-delayed': 'home-jamie',
  'scene-4-risk':    'home-jamie',
  'scene-4-silence': 'classroom',
  'scene-5':         'classroom',
  'scene-final-good':     'classroom',
  'scene-final-sobering': 'classroom',
};

const defaultEnvironment: SceneEnvironment = 'classroom';

export const jamieScenario: Scenario = {
  ...base,
  domain: 'child-safeguarding',
  audience: 'all',
  difficulty: 1,
  durationMinutes: 20,
  status: 'available',
  supportedModes: ['learning'],
  contentWarnings: [
    'This story is about a child who may be being hurt at home.',
    'It mentions bruises and a child being scared.',
    'You can stop at any time.',
  ],
  resources: [
    { title: 'NSPCC — Spotting the signs of child abuse', url: 'https://www.nspcc.org.uk/what-is-child-abuse/spotting-signs-child-abuse/' },
    { title: 'Childline (for under 19s)', url: 'https://www.childline.org.uk/' },
    { title: 'Gov.uk — Report child abuse', url: 'https://www.gov.uk/report-child-abuse' },
  ],
  castOfCharacters: [
    {
      name: 'You',
      role: "Jamie's friend",
      details: "You and Jamie have been close since primary school. You've just come back from six weeks of summer holiday, and you've been looking forward to seeing them.",
    },
    {
      name: 'Jamie',
      role: 'Your friend',
      details: "Jamie is in your form class. They're usually one of the first through the gate and always talking before you've even said hello — but they've come back from the summer different.",
    },
    {
      name: 'Marcus',
      role: "Jamie's neighbour, also your classmate",
      details: "Marcus lives next door to Jamie, so he sometimes sees things from his garden or the street that you wouldn't otherwise know about.",
    },
    {
      name: 'Your mum',
      role: 'Parent',
      details: "You can talk to her about most things. She listens, but she'll also tell you honestly when she thinks you're overthinking something — and when she thinks you should tell someone at school.",
    },
    {
      name: 'Your form tutor',
      role: 'Teacher',
      details: "Approachable and unhurried. If you tell them something's wrong, they won't make you feel like you've done anything wrong by telling.",
    },
    {
      name: 'Mrs Okonkwo',
      role: "The school's designated safeguarding lead",
      details: "You don't know her directly, but she's the person whose job it is to take concerns like this forward properly once they're raised.",
    },
  ],
  knownFacts: [
    { label: 'First day back', detail: "It's the first day of term after six weeks of summer holiday — you haven't seen Jamie all summer." },
  ],
  keyTakeaway:
    'You don\'t need to have all the answers. You just need to tell someone you trust. Noticing is enough.',
  completionFeedback: {
    excellent: 'You trusted your instincts and spoke up. That\'s exactly what makes a difference.',
    good: 'You noticed something was wrong and did something about it. That takes courage.',
    poor: 'It can be hard to know what to do. The most important thing is telling an adult you trust — you don\'t need to be certain first.',
  },
  closingSequence: {
    epilogueGood: [
      'A few weeks later, Jamie\'s seat in form class is filled again.',
      'You notice them walk in on a Tuesday morning — a bit quieter than before, but something has shifted. There\'s a lightness that wasn\'t there in September.',
      'You don\'t know everything that happened. You probably never will. But you know that you said something when it mattered, and that the right people were able to help.',
      'Jamie catches your eye across the classroom and gives you a small nod. That\'s enough.',
    ],
    epilogueSobering: [
      'Weeks go by. Jamie is still in your form class, but you notice things stay the same.',
      'The long sleeves. The way they wince sometimes. The lunches eaten alone.',
      'You think about it a lot — the moments you noticed something and wondered if you should say something.',
      'It\'s not too late. It never is. If something still doesn\'t feel right, telling a trusted adult — a teacher, a parent, a school counsellor — is always the right move.',
    ],
    reflection: {
      manyThreshold: 3,
      manyObservations: [
        'You\'re the kind of person who pays attention.',
        'While others moved on with the start of term, you kept noticing — small things that didn\'t quite add up. That instinct matters more than most people realise.',
        'Here\'s what you picked up on:',
      ],
      fewObservationsToldAnyway: [
        'You didn\'t catch every detail — but you didn\'t need to.',
        'Something felt wrong, and you trusted that feeling enough to say something. That\'s harder than it sounds, and it\'s the most important thing anyone can do.',
        'The signs of abuse aren\'t always obvious. They rarely are. What matters is that you acted on what you felt.',
      ],
      fewObservationsSilent: [
        'Sometimes we notice things and don\'t quite know what to do with them.',
        'That\'s not a failure — it\'s just how it works. These things are hard to name, and even harder to bring to someone else.',
        'If you ever find yourself in this situation again, remember: you don\'t need to be sure. You just need to say "I\'m a bit worried about someone" to a teacher, a parent, or another trusted adult. They take it from there.',
      ],
    },
    commonSigns: {
      title: 'Recognising the signs',
      intro: 'The signs of abuse at home aren\'t always obvious — and they\'re rarely just one thing. What you\'re looking for is a pattern of small changes that don\'t quite fit.',
      signs: [
        {
          title: 'Withdrawal from friends and activities',
          description: 'A child who used to be sociable becoming quiet or isolated — not because of a falling out, but in a more general way. They might stop joining in, stop talking, or seem distracted.',
        },
        {
          title: 'Unexplained bruises or injuries',
          description: 'Marks that don\'t match the explanation, or that a child is reluctant to talk about. On their own, bruises happen — but alongside other changes, they can be significant.',
        },
        {
          title: 'Covering up — long sleeves, reluctance to change',
          description: 'Choosing to hide skin that others wouldn\'t think to cover. Avoiding PE changing rooms, or changing somewhere private, can sometimes be a way of keeping injuries hidden.',
        },
        {
          title: 'Changes in behaviour or mood',
          description: 'Acting differently — more anxious, more jumpy, harder to reach. Sometimes this looks like daydreaming or being "elsewhere." It can also show up in drawings, stories, or play.',
        },
        {
          title: 'Flinching or seeming scared',
          description: 'Reacting to sudden movements or loud noises in a way that feels out of proportion. This can be a sign that a child is living somewhere unpredictable or frightening.',
        },
        {
          title: 'Giving vague or rehearsed explanations',
          description: '"I fell." "I bumped it." These explanations aren\'t always lies — but when they come quickly and without detail, or when the story doesn\'t quite match, it\'s worth paying attention.',
        },
      ],
      closingLine: 'You don\'t need to diagnose anything. If something feels wrong, trust that feeling — and tell someone who can help.',
    },
  },
  scenes: base.scenes.map((scene) => ({
    ...scene,
    environment: sceneEnvironments[scene.id] ?? defaultEnvironment,
    evidence: scene.evidence?.map((ev) => ({ ...ev, ...evidenceMeta[ev.id] })),
    choices: scene.choices?.map((choice) => ({ ...choice })),
  })),
};
