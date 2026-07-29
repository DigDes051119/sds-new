const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read Supabase configuration
const clientCode = fs.readFileSync(path.join(__dirname, 'src', 'app', 'supabaseClient.ts'), 'utf8');
const supabaseUrlMatch = clientCode.match(/SUPABASE_URL\s*=\s*['"`](.*?)['"`]/);
const supabaseKeyMatch = clientCode.match(/SUPABASE_ANON_KEY\s*=\s*['"`](.*?)['"`]/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
  console.error("Could not parse Supabase credentials from supabaseClient.ts");
  process.exit(1);
}

const supabaseUrl = supabaseUrlMatch[1];
const supabaseKey = supabaseKeyMatch[1];
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Read Backup Data (July 27)
const backupDir = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump');
const backupTrans = JSON.parse(fs.readFileSync(path.join(backupDir, 'sds_translations.json'), 'utf8'));
const backupDetails = JSON.parse(fs.readFileSync(path.join(backupDir, 'sds_project_details.json'), 'utf8'));

async function restore() {
  console.log('Fetching active tables from Supabase...');
  const { data: transRows, error: transErr } = await supabase.from('sds_translations').select('*');
  const { data: detailRows, error: detailErr } = await supabase.from('sds_project_details').select('*');

  if (transErr || detailErr) {
    console.error('Error fetching current tables:', transErr || detailErr);
    process.exit(1);
  }

  const activeTrans = JSON.parse(JSON.stringify(transRows[0].data));
  const activeDetails = JSON.parse(JSON.stringify(detailRows[0].data));

  const langs = ['ru', 'en', 'kg'];

  // Step 1: Find the newly created "One Ordo Resort" in webUiUx and rename its ID to "one-ordo-resort-web"
  // to avoid conflicts, and keep it safe for the user.
  let foundWebProject = false;
  langs.forEach(lang => {
    if (activeTrans[lang]?.webUiUx?.items) {
      const item = activeTrans[lang].webUiUx.items.find(p => p.id === 'one-ordo-resort');
      if (item) {
        item.id = 'one-ordo-resort-web';
        foundWebProject = true;
      }
    }
  });

  if (foundWebProject) {
    console.log('Found and renamed the newly created Web project ID to "one-ordo-resort-web" in translations.');
    langs.forEach(lang => {
      if (activeDetails[lang]?.['one-ordo-resort']) {
        // Copy details to the new web namespace
        activeDetails[lang]['one-ordo-resort-web'] = {
          ...activeDetails[lang]['one-ordo-resort'],
          name: activeDetails[lang]['one-ordo-resort'].name || 'One Ordo Resort Web'
        };
        console.log(`Copied active details to "one-ordo-resort-web" for lang ${lang}`);
      }
    });
  }

  // Step 2: Restore the original "One Ordo Resort" project from July 27 backup back into the projects list
  langs.forEach(lang => {
    const backupItem = backupTrans[lang]?.projects?.items?.find(p => p.id === 'one-ordo-resort');
    if (backupItem) {
      // Remove any existing one-ordo-resort in projects to be clean
      activeTrans[lang].projects.items = activeTrans[lang].projects.items.filter(p => p.id !== 'one-ordo-resort');
      // Insert backup item
      activeTrans[lang].projects.items.push(backupItem);
      console.log(`Restored "one-ordo-resort" to general projects in translations for lang ${lang}`);
    }
  });

  // Step 3: Restore the original "one-ordo-resort" project details from July 27 backup
  langs.forEach(lang => {
    const backupDetail = backupDetails[lang]?.['one-ordo-resort'];
    if (backupDetail) {
      activeDetails[lang]['one-ordo-resort'] = backupDetail;
      console.log(`Restored "one-ordo-resort" details for lang ${lang}`);
    }
  });

  // Step 4: Write updated data to Supabase
  console.log('Uploading updated tables to Supabase...');
  const { error: transUpdateErr } = await supabase.from('sds_translations').update({ data: activeTrans }).eq('id', 1);
  const { error: detailUpdateErr } = await supabase.from('sds_project_details').update({ data: activeDetails }).eq('id', 1);

  if (transUpdateErr || detailUpdateErr) {
    console.error('Failed to update Supabase:', transUpdateErr || detailUpdateErr);
    process.exit(1);
  }

  // Step 5: Update Local Storage cache by writing to the files or local settings if applicable
  // Our cmsService will fetch these tables on next load, but we can write them locally too
  console.log('Restoration completed successfully!');
}

restore();
