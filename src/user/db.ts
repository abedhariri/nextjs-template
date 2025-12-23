import { prisma } from '@/server/db';

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const deleteUser = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) return;

  await prisma.user.delete({
    where: { email },
  });
};
