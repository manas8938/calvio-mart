// scripts/create-admin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Client } = require('pg');

(async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@calviomart.com';
  const plain = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;
  const hashed = await bcrypt.hash(plain, saltRounds);

  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  try {
    await client.connect();
    const text = `
      INSERT INTO users ("fullName", email, password, role, "isEmailVerified", "isDeleted", "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      ON CONFLICT (email) DO UPDATE
      SET password = EXCLUDED.password, role = EXCLUDED.role, "isEmailVerified" = EXCLUDED."isEmailVerified";
    `;
    const values = ['Admin', email, hashed, 'admin', true, false];
    await client.query(text, values);
    console.log('Admin upserted:', email);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
