const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Character = require('../db/models/Character');

const PERSONALITIES_DIR = path.join(__dirname, '..', 'src', 'agents', 'personalities');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const files = fs.readdirSync(PERSONALITIES_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} personality files`);

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(PERSONALITIES_DIR, file), 'utf8'));

    await Character.findOneAndUpdate(
      { name: data.name },
      {
        name: data.name,
        archetype: data.archetype,
        group: data.group,
        trait: data.trait,
        backstory: data.backstory,
        speechStyle: data.speechStyle,
        lorePublic: data.lorePublic || '',
        llmModel: data.llmModel || 'claude-haiku-4-5',
        color: data.color || '#7c3aed',
        personality: data.personality || { intuition: 50, charisme: 50, audace: 50, sang_froid: 50 },
      },
      { upsert: true, new: true }
    );
    console.log(`  ✓ ${data.name} (${data.archetype})`);
  }

  console.log(`\nSeeded ${files.length} characters`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
