import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './src/app.module';
import { UserService } from './src/user/user.service';

async function updatePassword() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const email = 'luanvan25@gmail.com'; // Replace with the user's email
  const newPassword = 'Abc@12345'; // Replace with the new password

  console.log(`[UPDATE PASSWORD] Generating hash for password: ${newPassword}`);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(`[UPDATE PASSWORD] Generated Hash: ${hashedPassword}`);

  try {
    console.log(`[UPDATE PASSWORD] Updating password for user: ${email}`);
    const user = await userService.findByEmail(email);
    if (!user) {
      console.error(`[UPDATE PASSWORD] User with email ${email} not found`);
      return;
    }

    await userService.updatePassword(user.id, hashedPassword);
    console.log(`[UPDATE PASSWORD] Password updated successfully for user: ${email}`);
  } catch (error) {
    console.error('[UPDATE PASSWORD ERROR]', error);
  } finally {
    await app.close();
  }
}

updatePassword().catch((error) => {
  console.error('[UPDATE PASSWORD SCRIPT ERROR]', error);
});