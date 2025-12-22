export interface Card {
  id: string;
  name: string;
  faction: string;
  rarity: string;
  img: string;
  factionCost: number;
  cost: number;
  banned: boolean;
  isSeal: boolean;
  tags: string[];
  isToken?: boolean;
  isQuickSpell?: boolean;
  isSlowSpell?: boolean;
  isArtifact?: boolean;
  isEstructure?: boolean;
}
