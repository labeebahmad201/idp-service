import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class PasswordHasherService {
  hash(plainTextPassword: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(plainTextPassword, salt, 64).toString('hex');
    return `scrypt$${salt}$${derivedKey}`;
  }

  verify(plainTextPassword: string, storedHash: string): boolean {
    const [algorithm, salt, hash] = storedHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !hash) {
      return false;
    }

    const derivedKey = scryptSync(plainTextPassword, salt, 64);
    const storedKey = Buffer.from(hash, 'hex');
    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
  }
}
