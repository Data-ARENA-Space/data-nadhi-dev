const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const config = {
  user: 'postgres',
  password: 'postgres',
  host: 'postgres',
  port: 5432,
  database: 'datanadhi_dev'
};

async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function getExecutedMigrations(pool) {
  const result = await pool.query('SELECT name FROM migrations ORDER BY id DESC');
  return result.rows.map(row => row.name);
}

async function executeMigration(pool, migrationPath, isUp = true) {
  const migrationName = path.basename(migrationPath);
  const baseName = migrationName.replace(/\.(up|down)\.sql$/, '');
  
  // For rollback, check if the migration exists in the migrations table
  if (!isUp) {
    const exists = await pool.query(
      'SELECT 1 FROM migrations WHERE name = $1',
      [baseName + '.up.sql']
    );
    if (exists.rows.length === 0) {
      console.log(`⏭️  Skipping rollback of ${baseName} - not previously applied`);
      return;
    }
  }

  const sql = await fs.readFile(migrationPath, 'utf8');

  await pool.query('BEGIN');
  try {
    // Execute the migration
    await pool.query(sql);
    
    // Record or remove the migration
    if (isUp) {
      await pool.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [baseName + '.up.sql']
      );
    } else {
      await pool.query(
        'DELETE FROM migrations WHERE name = $1',
        [baseName + '.up.sql']
      );
    }
    
    await pool.query('COMMIT');
    console.log(`✅ ${isUp ? 'Applied' : 'Rolled back'} migration ${baseName}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(`❌ Error ${isUp ? 'applying' : 'rolling back'} migration ${baseName}:`, error);
    throw error;
  }
}

async function main() {
  const command = process.argv[2] || 'up';
  const steps = parseInt(process.argv[3]) || Infinity;
  const pool = new Pool(config);

  try {
    // Ensure migrations table exists
    await ensureMigrationsTable(pool);

    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations(pool);

    // Read migration files
    const migrationsDir = path.join(__dirname, '..', 'pg-migrations');
    const files = await fs.readdir(migrationsDir);

    if (command === 'up') {
      // Filter for .up.sql files that haven't been executed
      const pendingMigrations = files
        .filter(f => f.endsWith('.up.sql'))
        .filter(f => !executedMigrations.includes(f))
        .sort()
        .slice(0, steps);

      if (pendingMigrations.length === 0) {
        console.log('No pending migrations');
        return;
      }

      console.log(`Found ${pendingMigrations.length} pending migrations`);

      // Execute pending migrations
      for (const migration of pendingMigrations) {
        const migrationPath = path.join(migrationsDir, migration);
        await executeMigration(pool, migrationPath, true);
      }
    } else if (command === 'down') {
      // Get the most recent migrations to roll back
      const migrationsToRollback = executedMigrations
        .slice(0, steps)
        .map(f => f.replace('.up.sql', '.down.sql'));

      if (migrationsToRollback.length === 0) {
        console.log('No migrations to roll back');
        return;
      }

      console.log(`Rolling back ${migrationsToRollback.length} migration(s)`);

      // Execute rollbacks in reverse order
      for (const migration of migrationsToRollback) {
        const migrationPath = path.join(migrationsDir, migration);
        await executeMigration(pool, migrationPath, false);
      }
    }

    console.log('✨ All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);