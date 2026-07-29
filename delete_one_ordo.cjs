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

async function removeProject() {
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

  // Remove one-ordo-resort from projects list
  langs.forEach(lang => {
    if (activeTrans[lang]?.projects?.items) {
      activeTrans[lang].projects.items = activeTrans[lang].projects.items.filter(p => p.id !== 'one-ordo-resort');
      console.log(`Removed "one-ordo-resort" from projects in lang ${lang}`);
    }
  });

  // Remove one-ordo-resort from project details
  langs.forEach(lang => {
    if (activeDetails[lang] && activeDetails[lang]['one-ordo-resort']) {
      delete activeDetails[lang]['one-ordo-resort'];
      console.log(`Deleted "one-ordo-resort" details in lang ${lang}`);
    }
  });

  // Upload changes to Supabase
  console.log('Uploading updated tables to Supabase...');
  const { error: transUpdateErr } = await supabase.from('sds_translations').update({ data: activeTrans }).eq('id', 1);
  const { error: detailUpdateErr } = await supabase.from('sds_project_details').update({ data: activeDetails }).eq('id', 1);

  if (transUpdateErr || detailUpdateErr) {
    console.error('Failed to update Supabase:', transUpdateErr || detailUpdateErr);
    process.exit(1);
  }

  console.log('Project "one-ordo-resort" deleted successfully!');
}

removeProject();
