import { signInWithGithub } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
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
    </>
  );
}

export default Providers;
