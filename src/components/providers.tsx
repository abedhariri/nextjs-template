import { signInWithGithub, signInWithGoogle } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function Providers() {
  return (
    <>
      <form className="w-full" action={signInWithGithub}>
        <Button variant="secondary" className="w-full" type="submit">
          <Github />
          <span>Github</span>
        </Button>
      </form>
      <form className="w-full" action={signInWithGoogle}>
        <Button variant="secondary" className="w-full" type="submit">
          <Image src="/google.svg" alt="google icon" width={20} height={20} />
          <span>Google</span>
        </Button>
      </form>
    </>
  );
}

export default Providers;
