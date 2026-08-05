const fs = require('fs');

const trans = JSON.parse(fs.readFileSync('scratch/sds_translations_current.json', 'utf8'));
const details = JSON.parse(fs.readFileSync('scratch/sds_project_details_current.json', 'utf8'));
const archive = JSON.parse(fs.readFileSync('scratch/sds_archive_items_current.json', 'utf8'));

console.log("--- sds_translations structure for bishbench ---");
// let's look at trans[0].data.en.products.items or other languages.
// We want to see how "concepts" are classified.
const enTrans = trans[0].data.en;
console.log("Products in EN:", enTrans.products?.items?.map(i => ({ id: i.id, name: i.name, category: i.category, categoryKey: i.categoryKey })));
console.log("Projects in EN:", enTrans.projects?.items?.map(i => ({ id: i.id, name: i.name, category: i.category, categoryKey: i.categoryKey })));

console.log("Bishbench in trans productDetail.products:", enTrans.productDetail?.products?.bishbench);
console.log("Bishbench in trans projectDetail.projects:", enTrans.projectDetail?.projects?.bishbench);

console.log("\n--- sds_project_details structure for bishbench ---");
const enDetails = details[0].data.en;
console.log("Bishbench details keys in EN:", Object.keys(enDetails.bishbench || {}));
if (enDetails.bishbench) {
    console.log("Bishbench details keys:", Object.keys(enDetails.bishbench));
    console.log("Bishbench name:", enDetails.bishbench.name);
    console.log("Bishbench service:", enDetails.bishbench.service);
}

console.log("\n--- sds_archive_items structure for bishbench ---");
const enArchive = archive[0].data.en;
console.log("Length of enArchive:", enArchive.length);
const bishbenchArchive = enArchive.find(item => item.slug === 'bishbench' || item.id === 'bishbench');
console.log("Bishbench in enArchive:", bishbenchArchive);
