import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import EmailPasswordForm from './components/emailPasswordForm';
import Providers from './components/providers';

export default async function Page() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="w-full lg:w-2/6">
        <CardHeader>
          <CardTitle>Sign in to create-saas</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailPasswordForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Providers />
        </CardFooter>
      </Card>
    </div>
  );
}
