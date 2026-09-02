const path = require('path');
// Ensure paths resolve correctly when running from project root
const gemini = require(path.join(__dirname, '..', 'src', 'services', 'geminiLegalService'));

(async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set. Set it in your environment before running.');
      console.error('On PowerShell: $env:GEMINI_API_KEY = "your_key"');
      console.error('Then run: node scripts/run-geminiLegalService.js');
      // Continue anyway to show helpful error if missing
    }

    const templateId = 'NDA';
    const fields = {
      partyA_name: 'Alice Pvt Ltd',
      partyB_name: 'Bob LLC',
      effective_date: new Date().toISOString().split('T')[0],
      purpose: 'Confidential discussions regarding potential partnership',
      term_of_confidentiality: '2 years',
      governing_law: 'India'
    };

    console.log(`Generating document for template: ${templateId}...\n`);
    const doc = await gemini.generateDocument(templateId, fields);

    console.log('\n--- GENERATED DOCUMENT START ---\n');
    console.log(doc);
    console.log('\n--- GENERATED DOCUMENT END ---');
  } catch (err) {
    console.error('Error running geminiLegalService:', err.message || err);
    process.exitCode = 1;
  }
})();
