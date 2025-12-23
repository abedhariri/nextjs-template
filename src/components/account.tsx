'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Session } from '@/lib/auth';
import { signOut } from '@/lib/auth-client';
import { getInitials } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  session: Session | null;
};

export default function Account({ session }: Props) {
  const router = useRouter();

  if (!session) return null;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto" suppressHydrationWarning>
        {session.user?.image ? (
          <Image className="rounded-full" alt="account image" src={session?.user?.image || ''} width={40} height={40} />
        ) : (
          <div className="rounded-full bg-black w-10 h-10 text-sm text-white flex items-center justify-center">
            {getInitials(session.user?.name || session.user?.email)}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
