import { ReactNode } from 'react';
import { Footer, NavBar } from '@/components/molecules';

type Props = {
  children: ReactNode;
};

function BaseTemplate({ children }: Props) {
  return (
    <div className="container flex flex-col mx-auto text-center min-h-screen">
      <NavBar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default BaseTemplate;
