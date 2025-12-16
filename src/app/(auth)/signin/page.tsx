import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EmailPasswordForm from './components/emailPasswordForm';
import Link from 'next/link';
import Providers from '@/components/providers';

type Props = {
  searchParams: Promise<{
    error: 'OAuthAccountNotLinked' | string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { error } = await searchParams;
  const ErrorMessage = async () => {
    switch (error) {
      case 'OAuthAccountNotLinked':
        return 'You already have an account using another provider';

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="w-full lg:w-2/6">
        <CardHeader>
          <CardTitle>Sign in to create-saas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <p className="text-red-500">{ErrorMessage()}</p>}
          <EmailPasswordForm />
          <p>
            Dont have an account,{' '}
            <Link className="underline text-blue-500" href="/signup">
              sign up here!
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">{/* <Providers /> */}</CardFooter>
      </Card>
    </div>
  );
}
