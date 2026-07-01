const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

const filesToUpload = [
  {
    localPath: "C:\\Users\\Akimkhan\\.gemini\\antigravity-ide\\brain\\07a96865-b649-432d-b059-a80ccf3adab5\\brand_art_1782888494260.png",
    remotePath: "services/brand.png"
  },
  {
    localPath: "C:\\Users\\Akimkhan\\.gemini\\antigravity-ide\\brain\\07a96865-b649-432d-b059-a80ccf3adab5\\industrial_art_1782888509629.png",
    remotePath: "services/industrial.png"
  },
  {
    localPath: "C:\\Users\\Akimkhan\\.gemini\\antigravity-ide\\brain\\07a96865-b649-432d-b059-a80ccf3adab5\\marketing_art_1782888520865.png",
    remotePath: "services/marketing.png"
  },
  {
    localPath: "C:\\Users\\Akimkhan\\.gemini\\antigravity-ide\\brain\\07a96865-b649-432d-b059-a80ccf3adab5\\concept_art_1782888575330.png",
    remotePath: "services/concept.png"
  }
];

async function uploadFile(bucketName, remotePath, filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${remotePath}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "image/png"
    },
    body: fileBuffer
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (data.message && (data.message.includes("already exists") || data.error === "Duplicate")) {
      // Overwrite using PUT
      const overwriteResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucketName}/${remotePath}`, {
        method: "PUT",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "image/png"
        },
        body: fileBuffer
      });
      
      if (!overwriteResponse.ok) {
        const err = await overwriteResponse.json();
        throw new Error(err.message || "Failed to overwrite");
      }
      return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${remotePath}`;
    }
    throw new Error(data.message || "Failed to upload");
  }
  
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${remotePath}`;
}

async function run() {
  console.log("Starting image upload to Supabase...");
  for (const item of filesToUpload) {
    console.log(`Uploading ${item.remotePath}...`);
    try {
      const url = await uploadFile("assets", item.remotePath, item.localPath);
      console.log(`✓ Uploaded successfully! Public URL: ${url}`);
    } catch (e) {
      console.error(`✗ Failed to upload ${item.remotePath}:`, e.message);
    }
  }
}

run();
