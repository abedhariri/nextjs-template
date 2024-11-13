import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';

type Props = {
  session: Session | null;
};

export default function Account({ session }: Props) {
  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto">
        {session.user?.image ? (
          <Image className="rounded-full" alt="account image" src={session?.user?.image || ''} width={40} height={40} />
        ) : (
          <div className="rounded-full bg-black p-2 text-sm text-white">
            {getInitials(session.user?.name || session.user?.email)}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            'use server';
            await signOut({
              redirectTo: '/signin',
            });
          }}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
