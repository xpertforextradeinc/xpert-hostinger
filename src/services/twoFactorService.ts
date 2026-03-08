import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';
import validator from 'validator';

const prisma = new PrismaClient();
const SERVICE_NAME = 'XpertTradeBot'; // The name displayed in the auth app

export const generateTwoFactorSecret = async (userId: string, email: string) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email address');
  }
  const secret = authenticator.generateSecret();
  
  // generate the otpauth URL for the QR code
  const otpauth = authenticator.keyuri(email, SERVICE_NAME, secret);
  
  // Generate QR code data URL
  const qrCodeUrl = await QRCode.toDataURL(otpauth);

  // Save the secret to the user (but don't enable it yet!)
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });

  return { secret, qrCodeUrl };
};

export const verifyTwoFactorToken = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.twoFactorSecret) {
    throw new Error('2FA setup not initiated');
  }

  // Verify the token against the secret
  const isValid = authenticator.check(token, user.twoFactorSecret);

  if (isValid) {
    // If valid, officially enable 2FA for the user
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });
  }

  return isValid;
};
