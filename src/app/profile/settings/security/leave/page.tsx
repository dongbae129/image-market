import WithdrawalPage from '@app/profile/settings/security/leave/_component/withdrawal';
import { Suspense } from 'react';

export default function SecurityLeavePage() {
  return (
    <Suspense>
      <WithdrawalPage />
    </Suspense>
  );
}
