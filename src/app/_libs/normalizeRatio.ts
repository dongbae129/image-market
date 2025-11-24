/**1.0,자율,2.1 */
export function normalizeRatio(ratio: number) {
  if (ratio <= 1.0) return 1.0;
  else if (ratio >= 2.1) return 2.1;
  return ratio;
}
export function ratioTest(ratio: number) {
  if (ratio <= 1.2) return 'card_small'; //정사각형
  if (ratio <= 1.5) return 'card_medium'; //4:3
  if (ratio <= 2.0) return 'card_large'; //3:2
  return 'card_large'; //롱
}
