import * as bcrypt from 'bcrypt';

async function advancedBcryptDebug() {
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

  // Test bcrypt.compare with a known hash
  const knownHash = '$2b$10$9h1d0ub3iQzjmBhxU2L49OCUG7sq.8ljkmoJVPG29jgOoGUvck5UW';
  const isKnownHashMatch = await bcrypt.compare(password, knownHash);
  console.log('[DEBUG] Known Hash Compare Result:', isKnownHashMatch);

  // Generate a fresh hash and test comparison
  const freshHash = await bcrypt.hash(password, saltRounds);
  console.log('[DEBUG] Freshly Generated Hash:', freshHash);

  const isFreshHashMatch = await bcrypt.compare(password, freshHash);
  console.log('[DEBUG] Fresh Hash Compare Result:', isFreshHashMatch);
}

advancedBcryptDebug().catch((error) => {
  console.error('[DEBUG ERROR]', error);
});