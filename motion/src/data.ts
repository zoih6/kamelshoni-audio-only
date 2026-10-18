export const FPS = 30;
export const DURATION_S = 127.63;
export const TOTAL_FRAMES = Math.round(DURATION_S * FPS); // 3829

export const LINES = [
  'عَادْ فِي قَلْبِي حْسَابَاتْ الْمَحَبَّهْ',
  'كِلّْهَا تِحْسِبْ غَلَاتَكْ فِي عْيُونِي',
  'إِنْ جَمَعْتْ الْحُبّ فِينِي أَوْ طَرَحْتَهْ',
  'مَا يْسَاوِي غِيرْ حَبَّكْ فِي جْفُونِي',
  'وَالله مَا غِيرَكْ دَوَا قَلْبِي وْطَبَّهْ',
  'يَا هَوَا قَلْبِي وْيَا كَامِلْ شْجُونِي',
  'آهْ مِنْ بَعْدَكْ ذَبَحْ عُمْرِي بْسَبَّهْ',
  'رِيتْ أَضُمَّكْ وْأَرْتْوِي مِنْ ثَغْرَكْ حَنِينِي',
  'إِنْتَ مَنْ أَوْدَعْتَهَا رُوحِي وْعِشْقَهْ',
  'يَا أَمَانِي يَا مُنَايَ لِكْ جْنُونِي',
  'أَعْشَقَكْ وِالْعِشْقْ فِي جَوْفِي تْرَكْتَهْ',
  'يِرْسِمْ الْأَحْلَامْ فِي مِهْجَةْ سْنِينِي',
  'عَادْ فِي قَلْبِي حْسَابَاتْ الْمَحَبَّهْ',
  'كِلّْهَا تِحْسِبْ غَلَاتَكْ فِي عْيُونِي',
  'وَالله مَا غِيرَكْ دَوَا قَلْبِي وْطَبَّهْ',
  'يَا هَوَا قَلْبِي وْيَا كَامِلْ شْجُونِي',
];

export type SceneKind =
  | 'intro' | 'heartCalc' | 'numbersEyes' | 'equations' | 'stamp'
  | 'apothecary' | 'bottle' | 'crash' | 'desert' | 'book'
  | 'inkMap' | 'stars' | 'ecgDreams' | 'rHeart' | 'rEyes'
  | 'rBottle' | 'bigPulse' | 'bridge' | 'logoA' | 'logoB';

export type SceneDef = {
  id: number;
  kind: SceneKind;
  start: number;
  end: number;
  lineIdx: number; // -1 none
  cam: 'dolly' | 'panR' | 'panL' | 'orbit' | 'crash' | 'pull' | 'push' | 'lock' | 'up';
  transition: 'heart' | 'flash' | 'slide' | 'iris' | 'beat' | 'none';
  layout: string;
};

const s = (id: number, kind: SceneKind, start: number, end: number, lineIdx: number,
  cam: SceneDef['cam'], transition: SceneDef['transition'], layout: string): SceneDef =>
  ({id, kind, start, end, lineIdx, cam, transition, layout});

// 20 scenes — تايم لاين على إيقاغ 91 BPM
export const SCENES: SceneDef[] = [
  s(1, 'intro', 0.0, 3.40, -1, 'push', 'none', 'radial-cycle'),
  s(2, 'heartCalc', 3.40, 10.35, 0, 'dolly', 'iris', 'asymmetric-stage'),
  s(3, 'numbersEyes', 10.35, 17.30, 1, 'orbit', 'heart', 'radial-cycle'),
  s(4, 'equations', 17.30, 24.25, 2, 'pull', 'flash', 'depth-tunnel'),
  s(5, 'stamp', 24.25, 31.20, 3, 'push', 'beat', 'full-frame-data'),
  s(6, 'apothecary', 31.20, 38.15, 4, 'panL', 'slide', 'diagonal-cascade'),
  s(7, 'bottle', 38.15, 45.10, 5, 'dolly', 'heart', 'asymmetric-stage'),
  s(8, 'crash', 45.10, 52.05, 6, 'crash', 'flash', 'depth-tunnel'),
  s(9, 'desert', 52.05, 59.00, 7, 'panR', 'slide', 'stacked-consequence'),
  s(10, 'book', 59.00, 65.95, 8, 'dolly', 'iris', 'asymmetric-stage'),
  s(11, 'inkMap', 65.95, 72.90, 9, 'orbit', 'beat', 'radial-cycle'),
  s(12, 'stars', 72.90, 79.85, 10, 'up', 'flash', 'depth-tunnel'),
  s(13, 'ecgDreams', 79.85, 86.80, 11, 'pull', 'heart', 'full-frame-data'),
  s(14, 'rHeart', 86.80, 93.75, 12, 'dolly', 'beat', 'asymmetric-stage'),
  s(15, 'rEyes', 93.75, 100.70, 13, 'orbit', 'flash', 'radial-cycle'),
  s(16, 'rBottle', 100.70, 107.65, 14, 'push', 'heart', 'diagonal-cascade'),
  s(17, 'bigPulse', 107.65, 114.60, 15, 'crash', 'beat', 'full-frame-data'),
  s(18, 'bridge', 114.60, 117.60, -1, 'lock', 'iris', 'radial-cycle'),
  s(19, 'logoA', 117.60, 123.00, -1, 'push', 'none', 'radial-cycle'),
  s(20, 'logoB', 123.00, 127.63, -1, 'lock', 'none', 'radial-cycle'),
];

export const F_OF = (sec: number) => Math.round(sec * FPS);
