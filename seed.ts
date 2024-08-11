// src/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Добавление записей о пользователях
    await prisma.user.createMany({
        data: [
          {
            email: 'john.doe@example.com',
            password: 'hashedpassword123', // В реальном приложении пароли должны быть хэшированы
            role: UserRole.DEVELOPER, // Пример значения
          },
          {
            email: 'jane.smith@example.com',
            password: 'hashedpassword456',
            role: UserRole.ADMIN, // Пример значения
          },
        ],
      });
      

    console.log('Database seeded successfully');
  } catch (e) {
    console.error('Error seeding database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
