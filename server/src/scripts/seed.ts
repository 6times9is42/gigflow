import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { config } from '../config/env';
import { User } from '../models/User.model';
import { Lead } from '../models/Lead.model';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const SOURCES = ['Website', 'Instagram', 'Referral'] as const;

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'David', 'Eve',
  'Frank', 'Grace', 'Hank', 'Iris', 'Jack',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
  'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore',
];

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io', 'startup.co'];

async function seed(): Promise<void> {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected.');

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});
  console.log('Cleared existing users and leads.');

  // Create admin user (password hashed by pre-save hook)
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@gigflow.dev',
    password: 'Admin123!',
    role: 'admin',
  });

  // Create sales user
  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@gigflow.dev',
    password: 'Sales123!',
    role: 'sales',
  });

  // Generate 50 sample leads (25 per user)
  const leads = Array.from({ length: 50 }, (_, i) => {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length] ?? 'Alice';
    const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length] ?? 'Smith';
    const domain = DOMAINS[i % DOMAINS.length] ?? 'gmail.com';
    const owner = i < 25 ? admin : sales;

    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`,
      status: STATUSES[i % STATUSES.length],
      source: SOURCES[i % SOURCES.length],
      ownerId: owner._id,
    };
  });

  await Lead.insertMany(leads);

  console.log('');
  console.log('Seed complete:');
  console.log('  Users : 2 (1 admin, 1 sales)');
  console.log('  Leads : 50 (25 per user)');
  console.log('');
  console.log('Test credentials:');
  console.log('  Admin : admin@gigflow.dev  /  Admin123!');
  console.log('  Sales : sales@gigflow.dev  /  Sales123!');

  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
