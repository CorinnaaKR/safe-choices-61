/**
 * Central registry mapping character roles to their GLB model paths.
 * Place downloaded .glb files in /public/models/ and update paths here.
 *
 * Getting models (ReadyPlayerMe — recommended, free):
 *   1. Go to https://readyplayer.me/
 *   2. Create a free account → "Create Avatar"
 *   3. Customise the character (age, clothes, skin tone)
 *   4. Dashboard → "Download" → choose GLB format
 *   5. Save into public/models/ with the filename below
 *
 * For best results:
 *   - Jamie: young face, school uniform / hoodie, neutral expression
 *   - Student: similar age, different colour top
 *   - Teacher/Adult: older face, professional clothes
 */
export const CHARACTER_MODELS: Record<string, string | null> = {
  jamie:   null,   // → '/models/jamie.glb'   once downloaded
  student: null,   // → '/models/student.glb'
  teacher: null,   // → '/models/teacher.glb'
  adult:   null,   // → '/models/adult.glb'
};

/** Returns true only when all required models are present */
export function modelsReady(): boolean {
  return Object.values(CHARACTER_MODELS).every(v => v !== null);
}
