'use client';

import { useMutation } from '@tanstack/react-query';

export default function LogoutButton() {
  const {} = useMutation({
    mutationFn: async () => {}
  });
  return (
    <div className="atest cursor-pointer profile_selection before:left-[-9px] block text-center relative text-sm">
      로그아웃
    </div>
  );
}
