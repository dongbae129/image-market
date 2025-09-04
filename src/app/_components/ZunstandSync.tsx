import React from 'react';

type Props = {
  accessToken: string;
  children: React.ReactNode;
};
export default function ZunstandWrapper({ accessToken, children }: Props) {
  return { children };
}
