import * as bcrypt from 'bcrypt';

async function debugBcrypt() {
  const password = 'Abc@12345';
  const saltRounds = 10;

  console.log('[DEBUG] Raw Password:', password);

  // Hash the password
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('[DEBUG] Generated Hash:', hash);

  // Compare the password with the hash
  const isMatch = await bcrypt.compare(password, hash);
  console.log('[DEBUG] Bcrypt Compare Result:', isMatch);

  // Extract the salt from the hash
  const extractedSalt = hash.substring(0, 29);
  console.log('[DEBUG] Extracted Salt:', extractedSalt);

  // Rehash the password with the extracted salt
  const rehashedPassword = await bcrypt.hash(password, extractedSalt);
  console.log('[DEBUG] Rehashed Password with Extracted Salt:', rehashedPassword);

  // Compare the rehashed password with the original hash
  const isRehashMatch = rehashedPassword === hash;
  console.log('[DEBUG] Rehash Match Result:', isRehashMatch);
}

debugBcrypt().catch((error) => {
  console.error('[DEBUG ERROR]', error);
});