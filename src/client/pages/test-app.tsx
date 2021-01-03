import { TestLayout } from 'components/Layout/TestLayout';
import { WSTestContainer } from 'components/WSTest';
import { useEffect, useState } from 'react';

export default function WSTest() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  if (!isClient) return null;

  return (
    <TestLayout>
      <WSTestContainer />
    </TestLayout>
  );
}
