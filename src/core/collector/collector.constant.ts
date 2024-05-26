export const CollectProvidorMap = {
  medium: 'MEDIUM',
  dev: 'DEV',
} as const;

export const CollectProvidorList = Object.values(CollectProvidorMap);
export type CollectProvidor = (typeof CollectProvidorList)[number];
