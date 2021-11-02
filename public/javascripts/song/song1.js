import { verse_1 } from './be_kind/verse_1';
import { bridge } from './be_kind/bridge';
import { bridge_2 } from './be_kind/bridge_2';
import { verse_2 } from './be_kind/verse_2';
import { chorus } from './be_kind/chorus';
import { chorus_2 } from './be_kind/chorus_2';
import { ending } from './be_kind/ending';

export const song1 = {
  notes: [].concat(verse_1, bridge, chorus, verse_2, bridge, chorus, bridge_2, chorus_2, ending),
  introDelay: 3604,
  tempo: 319,
  dy: 8,
  totalNotes: 360
}
