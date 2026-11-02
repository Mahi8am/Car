/**
 * lib/serviceEvents.ts
 * ────────────────────
 * Event dispatcher and listener helper for opening specific service panels (Buy · Sell).
 * Allows Navbar, HeroContent, and ServiceIndex to switch the active panel in Services.
 */

export type ServicePanelId = 'buy' | 'sell';

export function openServicePanel(panelId: ServicePanelId) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('garirmela:open-service-panel', {
      detail: { panelId },
    })
  );
}

export function subscribeServicePanel(callback: (panelId: ServicePanelId) => void) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ panelId: ServicePanelId }>;
    if (customEvent.detail && (customEvent.detail.panelId === 'buy' || customEvent.detail.panelId === 'sell')) {
      callback(customEvent.detail.panelId);
    }
  };

  window.addEventListener('garirmela:open-service-panel', handler);
  return () => {
    window.removeEventListener('garirmela:open-service-panel', handler);
  };
}
