import React from 'react';
import { useFeatureGating } from '../hooks/useFeatureGating';

interface FeatureGateProps {
  featureKey: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component to conditionally render children based on feature gating.
 * @param featureKey The key of the feature to check.
 * @param fallback Optional fallback content if the feature is disabled.
 * @param children Content to render if the feature is enabled.
 */
const FeatureGate: React.FC<FeatureGateProps> = ({ featureKey, fallback = null, children }) => {
  const isFeatureEnabled = useFeatureGating(featureKey);

  return <>{isFeatureEnabled ? children : fallback}</>;
};

export default FeatureGate;