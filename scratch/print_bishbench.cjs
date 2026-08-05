const fs = require('fs');
const trans = JSON.parse(fs.readFileSync('scratch/sds_translations_current.json', 'utf8'))[0].data;

console.log("=== BISHBENCH IN TRANSLATIONS ===");
for (const lang of ["ru", "en", "kg"]) {
    console.log(`\n--- Language: ${lang} ---`);
    const langData = trans[lang];
    
    // Check products
    const prodItems = langData.products?.items || [];
    const bishProduct = prodItems.find(p => p.id === 'bishbench');
    console.log("In products.items:", bishProduct);
    
    // Check concepts
    const concItems = langData.concepts?.items || [];
    const bishConcept = concItems.find(c => c.id === 'bishbench');
    console.log("In concepts.items:", bishConcept);
    
    // Check productDetail.products
    const prodDetail = langData.productDetail?.products?.bishbench;
    console.log("In productDetail.products:", prodDetail ? { name: prodDetail.name, service: prodDetail.service, results: prodDetail.results } : "Not found");
}
