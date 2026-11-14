export const TRIAL_SELECT_EVENT = 'basecase:select-trial';

export interface TrialSelectionDetail {
  preferredCourse: string;
  codingExperience?: string;
}

/**
 * Dispatches a custom browser event to pre-fill the trial enquiry form
 * from course cards or the track recommender.
 */
export function dispatchTrialSelection(detail: TrialSelectionDetail): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<TrialSelectionDetail>(TRIAL_SELECT_EVENT, { detail })
    );
  }
}

/**
 * Subscribes to trial course/experience selection events and returns an unsubscribe handler.
 */
export function subscribeTrialSelection(
  handler: (detail: TrialSelectionDetail) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<TrialSelectionDetail>;
    if (customEvent.detail?.preferredCourse) {
      handler(customEvent.detail);
    }
  };

  window.addEventListener(TRIAL_SELECT_EVENT, listener);
  return () => window.removeEventListener(TRIAL_SELECT_EVENT, listener);
}
