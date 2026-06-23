# Lazlo's Story — Editable Choices

> **How to use this file:** Edit the wording in any `text:` field below. When you're happy with the changes, let me know and I'll apply them to the code. Do not change the IDs — those link choices to the game logic.

---

## Pre-visit: SMS conversation with Lilly

### Exchange 1 — "Have you heard from Lazlo at all recently?"

| ID | Text | Trust change |
|----|------|-------------|
| pv-1a | I actually tried him last week. Just got back from abroad. He never came back to me. | +5 |
| pv-1b | Not in a bit, no. Is he alright? | 0 |

**Lilly's replies:**
- pv-1a → "Okay so it's not just me. He's not replying to anyone. I was starting to wonder if it was personal."
- pv-1b → "That's what I'm trying to figure out. He's been really off since Joey died."

---

### Exchange 2 — [After Lilly describes the row and Priya comments]

| ID | Text | Trust change |
|----|------|-------------|
| pv-2a | The stuff about Priya — that really isn't him. Lazlo's never been like that. | +10 |
| pv-2b | Grief makes people say things they don't mean. He's probably mortified. | −5 |

**Lilly's replies:**
- pv-2a → "Exactly. That's what I keep coming back to. He'd never have said that six months ago."
- pv-2b → "Maybe. But he hasn't apologised. Hasn't even acknowledged it. That's not like him either."

---

### Exchange 3 — "Would you go and see him? Today if you can."

| ID | Text | Trust change |
|----|------|-------------|
| pv-3a | Yeah. I'll head over. | +10 |
| pv-3b | I'll be honest — it felt off when he didn't reply to me either. Something in me's been nagging. | +5 |
| pv-3c | If he won't open the door to family, I'm not sure what I can do. | −10 |

**Lilly's replies:**
- pv-3a → "Thank you. Text me after? 💙"
- pv-3b → "Trust that. Please just go and see him."
- pv-3c → "You two were closer than he was to any of us. Please just try."

---

## Scene 1 — Wednesday Afternoon
*Lazlo opens the door. He offers you something to drink.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l1-1 ✓ | "Coffee would be great, cheers." | +10 | → Scene 2 (alone in room) |
| c-l1-2 | "Water's fine, thanks." | +5 | → Scene 2w (Lazlo stays) |
| c-l1-3 | "I'm alright. Don't worry about it." | 0 | → Scene 2w (Lazlo stays) |

---

## Scene 2 — The Living Room (coffee path — alone briefly)
*Lazlo is in the kitchen. You're alone with what's on the walls.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l2-1 ✓ | "How are you doing with everything since Joey? It was a big loss." | +15 | → Scene 3a (he opens up) |
| c-l2-2 | "What is that? On the wall — that symbol." | +10 | → Scene 3a (he opens up) |
| c-l2-3 | Push on the Lilly comment. "What's going on between you two?" | 0 | → Scene 2b (walls up) |

---

## Scene 2w — The Living Room (water path — Lazlo present)
*Lazlo sits across from you. He mentions being "part of something bigger."*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l2w-1 ✓ | "Part of something — what kind of thing?" | +15 | → Scene 3a (he opens up) |
| c-l2w-2 ✓ | "That's good. What happened with Joey hit you hard. Makes sense you'd find something." | +12 | → Scene 3a (he opens up) |
| c-l2w-3 | "I wasn't expecting to hear from your sister before I heard from you. What's the deal there?" | 0 | → Scene 2b (walls up) |

---

## Scene 2b — Walls Up
*Lazlo has shut down. He knows Lilly contacted you.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l2b-1 ✓ | "I'm sorry. That came out wrong. I'm just here because I miss you, mate." | +8 | → Scene 3b (quiet room) |
| c-l2b-2 ✓ | "You're right. I'll just sit here. No agenda." | +8 | → Scene 3b (quiet room) |
| c-l2b-3 | "She's scared, Lazlo. We all are. You have to talk to someone." | 0 | → Scene 4b (limited info) |

---

## Scene 3a — He Starts to Talk
*Lazlo is opening up about the group. Joey. His isolation.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l3a-1 ✓ | "Tell me more about these people. What do they actually talk about?" | +20 | → Scene 4a (full picture) |
| c-l3a-2 ✓ | "That sounds good — it's hard after a loss. Having people who understand." | +15 | → Scene 4a (full picture) |
| c-l3a-3 | "Some online groups aren't what they seem, Laz. You should be careful." | 0 | → Scene 4b (limited info) |

---

## Scene 3b — The Quiet Room
*Lazlo barely speaks. You observe the room.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l3b-1 ✓ | "I'm going to go. But I'm here, Laz. Any time. No questions." | +8 | → Scene 4a (full picture) |
| c-l3b-2 | "Is there anyone you trust that you could talk to? A doctor, anyone?" | +10 | → Scene 4a (full picture) |
| c-l3b-3 | Leave without saying much. Give him time to come to you. | 0 | → Scene 4b (limited info) |

---

## Scene 4a — What You Now Know
*You've seen enough. Time to act.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l4a-1 ✓ | Contact ACT Early — the government programme for reporting radicalisation concerns. | +25 | → Scene 5 (end) |
| c-l4a-2 | Tell a trusted adult — a youth worker, Lazlo's GP, or a teacher he respected. | +15 | → Scene 5 (end) |
| c-l4a-3 | Do nothing for now. Wait and see if things get worse. | 0 | → Scene 5 (end) |

---

## Scene 4b — Left With Questions
*The visit didn't go well but you still saw things.*

| ID | Text | Points | Path |
|----|------|--------|------|
| c-l4b-1 ✓ | Contact ACT Early with what you know — partial information is still information. | +20 | → Scene 5 (end) |
| c-l4b-2 | Tell Lilly what you noticed. Suggest she contacts a professional. | +8 | → Scene 5 (end) |
| c-l4b-3 | Do nothing. You do not have enough to act on. | 0 | → Scene 5 (end) |

---

*✓ = optimal choice | Points = decision score | Trust change affects Lilly's warmth in the pre-visit only*
