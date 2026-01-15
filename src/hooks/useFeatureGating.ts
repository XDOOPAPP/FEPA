import { useCheckFeature } from '../services/queries'

/**
 * Hook to determine if a feature is enabled based on the user's subscription plan.
 * Fetches from backend API: GET /api/v1/subscriptions/check?feature=NAME
 * 
 * @param featureKey The key of the feature to check (e.g., 'unlimited_categories')
 * @returns Boolean indicating if the feature is enabled, or false if loading/error
 * 
 * @example
 * const canUseAdvancedReports = useFeatureGating('advanced_reports')
 * if (canUseAdvancedReports) {
 *   // Show advanced reports feature
 * }
 */
export const useFeatureGating = (featureKey: string): boolean => {
  const { data: featureData, isLoading, error } = useCheckFeature(featureKey)

  // Return false if feature key is empty
  if (!featureKey) return false

  // Return false if loading or error (fail-safe)
  if (isLoading || error) return false

  // Return the feature access status from backend
  // Backend returns: { allowed: boolean }
  return featureData?.allowed ?? false
}