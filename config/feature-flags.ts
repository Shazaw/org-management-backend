export const featureFlags = {
  CLAUDE_3_5_SONNET_ENABLED: true
};

export const isClaudeSonnetEnabled = (): boolean => {
  return featureFlags.CLAUDE_3_5_SONNET_ENABLED;
};
