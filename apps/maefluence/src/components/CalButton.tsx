import { useEffect, type ReactNode } from 'react';
import { getCalApi } from '@calcom/embed-react';

type Props = {
  children: ReactNode;
  className?: string;
};

const CAL_LINK = 'jouw-ideale-website-ut6jew/30min';
const CAL_NAMESPACE = '30min';

let calInitPromise: Promise<void> | null = null;

function initCal(): Promise<void> {
  if (!calInitPromise) {
    calInitPromise = (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }
  return calInitPromise;
}

export default function CalButton({ children, className }: Props) {
  useEffect(() => {
    void initCal();
  }, []);

  return (
    <button
      type="button"
      className={className ?? 'btn-primary'}
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      {children}
    </button>
  );
}
