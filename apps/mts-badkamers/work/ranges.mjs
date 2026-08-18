export const RANGES = {
  'houtlook-inloopdouche': r(0, 8),
  'marmerlook-met-ronde-spiegel': r(9, 20),
  'bruine-tegels-met-hexagon': [21, 22, 23, 24, 30, 34],
  'woonkamer-en-keuken': [25, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 39, 40],
  'travertijn-met-natuursteen-wastafel': r(41, 49),
  'badkamer-met-ligbad-metamorfose': r(50, 59),
  'leidingwerk-cv-en-techniek': [...r(60, 74), 131, 137],
  'chevron-met-messing': r(75, 90),
  'betonlook-met-zwart-staal': r(91, 104),
  'badkamer-met-betegelde-zitbank': r(105, 129),
  'patroontegels-in-de-douche': [132, 133, 134, 140, 141],
  'grijze-badkamer-houten-meubel': [136, 138, 143, 144, 147, 154, 155, 156, 157],
  toiletrenovaties: [135, 139, 142, 145, 146, 148, 149, 150, 151, 152, 153, 158, 159],
  'terrazzo-met-vrijstaand-bad': r(160, 182),
  'hexagon-badkamer-en-dakkapel': r(183, 219),
  'visgraat-badkamer-met-ligbad': [...r(220, 250), 252, 260],
};
function r(a, b) {
  return Array.from({ length: b - a + 1 }, (_, k) => a + k);
}

