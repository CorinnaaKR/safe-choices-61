import { Scenario } from '@/types/simulation';
import { jamieScenario } from './jamie';
import { lazloScenario } from './lazlo';

/**
 * Scenario registry. Adding a scenario = add a data module and list it here.
 * 'in-development' entries appear locked on the menu.
 */
const scenarios: Scenario[] = [jamieScenario, lazloScenario];

export function listScenarios(): Scenario[] {
  return scenarios;
}

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export const DEFAULT_SCENARIO_ID = jamieScenario.id;
