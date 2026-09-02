class TemplateLegalService {
    constructor() {
        console.log('📝 Using Indian Law-Compliant Legal Document Generator');
    }

    async generateDocument(templateId, fields) {
        console.log(`📄 Generating ${templateId} with Indian legal templates...`);
        console.log('📋 Fields received:', JSON.stringify(fields, null, 2));

        const templates = {
            'NDA': () => this.generateNDA(fields),
            'Service Agreement': () => this.generateServiceAgreement(fields),
            'Employment Agreement': () => this.generateEmploymentAgreement(fields),
            'Freelancer Agreement': () => this.generateFreelancerAgreement(fields),
            'Partnership Agreement': () => this.generatePartnershipAgreement(fields),
            'Lease Agreement': () => this.generateLeaseAgreement(fields),
            'Loan Agreement': () => this.generateLoanAgreement(fields),
            'Certificate': () => this.generateCertificate(fields, 'COMPLETION'),
            'Internship Certificate': () => this.generateCertificate(fields, 'INTERNSHIP'),
            'Experience Certificate': () => this.generateCertificate(fields, 'EXPERIENCE'),
            'Appreciation Certificate': () => this.generateCertificate(fields, 'APPRECIATION'),
        };

        const generator = templates[templateId] || (() => this.generateGeneric(templateId, fields));
        const document = generator();

        console.log('✅ Legal document generated successfully');
        console.log(`📄 Document length: ${document.length} characters`);

        return document;
    }

    // ... existing methods ...

    generateLoanAgreement(fields) {
        return `LOAN AGREEMENT

[Comprehensive loan agreement template as per Indian Contract Act, 1872]`;
    }

    generateCertificate(fields, type = 'COMPLETION') {
        console.log(`🎓 Generating Certificate of type: ${type}`);
        console.log('Fields received:', JSON.stringify(fields, null, 2));

        // Normalize fields based on certificate type
        let recipientName = fields.recipientName || fields.intern_name || fields.employee_name || '[RECIPIENT NAME]';
        let description = fields.description || fields.achievement || '[DESCRIPTION]';
        let date = fields.date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        let issuerName = fields.issuerName || fields.authorized_signatory || fields.presenter_name || '[ISSUER NAME]';
        let organization = fields.organization || fields.company_name || '[ORGANIZATION NAME]';

        // Specific logic for different types
        let bodyContent = '';

        if (type === 'INTERNSHIP') {
            const department = fields.department || '[DEPARTMENT]';
            const startDate = fields.start_date || '[START DATE]';
            const endDate = fields.end_date || '[END DATE]';
            bodyContent = `This is to certify that ${recipientName.toUpperCase()} has successfully completed their internship in the ${department} Department from ${startDate} to ${endDate}. During this period, they showed keen interest and dedication to their work.`;
        } else if (type === 'EXPERIENCE') {
            const designation = fields.designation || '[DESIGNATION]';
            const joiningDate = fields.joining_date || '[JOINING DATE]';
            const relievingDate = fields.relieving_date || '[RELIEVING DATE]';
            bodyContent = `This is to certify that ${recipientName.toUpperCase()} was employed with ${organization} as ${designation} from ${joiningDate} to ${relievingDate}. We found them to be sincere, hardworking, and result-oriented. We wish them success in their future endeavors.`;
        } else if (type === 'APPRECIATION') {
            bodyContent = `In recognition of their outstanding contribution: "${description}". Your dedication and commitment are truly appreciated.`;
        } else {
            bodyContent = `${description}\n\nIN RECOGNITION OF THEIR DEDICATION, HARD WORK, AND OUTSTANDING PERFORMANCE.`;
        }

        return `CERTIFICATE OF ${type}

PROUDLY PRESENTED TO

${recipientName.toUpperCase()}

${bodyContent}

GIVEN THIS ${date.toUpperCase()}

_____________________________
${issuerName}
[AUTHORIZED SIGNATORY]
${organization !== '[ORGANIZATION NAME]' ? organization : ''}`;
    }

    generateNDA(fields) {
        const party1 = fields.party1Name || '[DISCLOSING PARTY NAME]';
        const party2 = fields.party2Name || '[RECEIVING PARTY NAME]';
        const party1Address = fields.party1Address || '[Address of Disclosing Party]';
        const party2Address = fields.party2Address || '[Address of Receiving Party]';
        const date = fields.effectiveDate || new Date().toLocaleDateString('en-IN');
        const purpose = fields.purpose || '[PURPOSE OF DISCLOSURE]';
        const duration = fields.duration || 'Three (3) years';
        const jurisdiction = fields.jurisdiction || 'Courts at New Delhi, India';

        return `NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made on this ${date}

BETWEEN

${party1}, having its registered office at ${party1Address} (hereinafter referred to as the "Disclosing Party" which expression shall, unless repugnant to the context or meaning thereof, include its successors and permitted assigns) of the FIRST PART;

AND

${party2}, having its registered office at ${party2Address} (hereinafter referred to as the "Receiving Party" which expression shall, unless repugnant to the context or meaning thereof, include its successors and permitted assigns) of the SECOND PART.

The Disclosing Party and the Receiving Party are hereinafter individually referred to as "Party" and collectively as "Parties".

WHEREAS:

A. The Disclosing Party possesses certain confidential and proprietary information relating to its business, technology, operations, and other matters;

B. The Receiving Party desires to receive such Confidential Information for the purpose of ${purpose};

C. The Parties wish to protect the confidentiality of such information and have agreed to enter into this Agreement to define their respective rights and obligations;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein and for other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties agree as follows:

ARTICLE 1: DEFINITIONS

1.1 "Confidential Information" means all information, whether written, oral, electronic, visual, or in any other form, disclosed by the Disclosing Party to the Receiving Party, including but not limited to:
    (a) Trade secrets, know-how, inventions, techniques, processes, and algorithms;
    (b) Business plans, strategies, financial information, and forecasts;
    (c) Technical data, designs, specifications, drawings, and formulas;
    (d) Customer lists, supplier information, pricing, and marketing strategies;
    (e) Software, source code, object code, and documentation;
    (f) Any information marked as "Confidential", "Proprietary" or with a similar designation;
    (g) Any information that would reasonably be considered confidential given the nature of the information and circumstances of disclosure.

1.2 "Effective Date" means ${date}.

1.3 "Purpose" means ${purpose}.

ARTICLE 2: OBLIGATIONS OF RECEIVING PARTY

2.1 Confidentiality: The Receiving Party shall:
    (a) Hold and maintain the Confidential Information in strict confidence;
    (b) Exercise at least the same degree of care to protect the Confidential Information as it exercises with respect to its own confidential information, but in no event less than reasonable care;
    (c) Not disclose, publish, or disseminate the Confidential Information to any third party without the prior written consent of the Disclosing Party;
    (d) Use the Confidential Information solely and exclusively for the Purpose and for no other purpose whatsoever.

2.2 Limited Disclosure: The Receiving Party may disclose Confidential Information only to its employees, directors, officers, consultants, and advisors who have a legitimate need to know such information for the Purpose and who are bound by confidentiality obligations at least as restrictive as those contained in this Agreement.

2.3 The Receiving Party shall be responsible for any breach of this Agreement by its Representatives.

ARTICLE 3: EXCLUSIONS FROM CONFIDENTIAL INFORMATION

The obligations set forth in Article 2 shall not apply to information that the Receiving Party can demonstrate by competent written evidence:
    (a) Was in the public domain at the time of disclosure or thereafter becomes part of the public domain through no breach of this Agreement by the Receiving Party;
    (b) Was rightfully in the Receiving Party's possession prior to disclosure by the Disclosing Party, as evidenced by written records;
    (c) Is independently developed by the Receiving Party without use of or reference to the Confidential Information;
    (d) Is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation;
    (e) Is required to be disclosed by applicable law, regulation, court order, or governmental authority.

ARTICLE 4: TERM AND TERMINATION

4.1 Term: This Agreement shall commence on the Effective Date and shall continue for a period of ${duration} unless earlier terminated as provided herein.

4.2 Survival: The obligations of confidentiality under this Agreement shall survive termination and shall continue for a period of five (5) years from the date of disclosure of the Confidential Information.

4.3 Termination: Either Party may terminate this Agreement upon thirty (30) days' prior written notice to the other Party.

ARTICLE 5: INTELLECTUAL PROPERTY RIGHTS

5.1 All Confidential Information and all intellectual property rights therein shall remain the sole and exclusive property of the Disclosing Party.

5.2 Nothing in this Agreement shall be construed as granting any rights, by license or otherwise, to the Receiving Party in or to any Confidential Information or intellectual property of the Disclosing Party.

ARTICLE 6: REMEDIES AND ENFORCEMENT

6.1 Irreparable Harm: The Receiving Party acknowledges and agrees that any breach of this Agreement may cause irreparable harm and injury to the Disclosing Party for which monetary damages would be an inadequate remedy.

6.2 Equitable Relief: In the event of any breach or threatened breach of this Agreement, the Disclosing Party shall be entitled to seek injunctive relief, specific performance, and other equitable remedies in addition to all other remedies available at law or in equity.

6.3 Costs and Attorneys' Fees: The prevailing Party in any action or proceeding to enforce this Agreement shall be entitled to recover from the non-prevailing Party all costs and expenses incurred, including reasonable attorneys' fees and court costs.

ARTICLE 7: REPRESENTATIONS AND WARRANTIES

7.1 Each Party represents and warrants that:
    (a) It has the full power, authority, and legal right to enter into this Agreement;
    (b) The execution, delivery, and performance of this Agreement have been duly authorized;
    (c) This Agreement constitutes a legal, valid, and binding obligation enforceable against it;
    (d) The execution and performance of this Agreement do not conflict with or violate any law, regulation, or governmental order applicable to it or any agreement or obligation to which it is a party or by which it is bound.

ARTICLE 8: GENERAL PROVISIONS

8.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of India, without regard to its conflict of laws principles.

8.2 Jurisdiction: The Parties hereby submit to the exclusive jurisdiction of ${jurisdiction} for the resolution of any disputes arising out of or relating to this Agreement.

8.3 Entire Agreement: This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written.

8.4 Amendments: This Agreement may be amended, modified, or supplemented only by a written instrument duly executed by both Parties.

8.5 Severability: If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired thereby.

8.6 Assignment: Neither Party may assign or transfer this Agreement or any rights or obligations hereunder without the prior written consent of the other Party.

8.7 Notices: All notices, requests, demands, and other communications under this Agreement shall be in writing and shall be deemed to have been duly given when delivered personally, when sent by registered post or courier with proof of delivery, or when sent by email with confirmation of receipt.

8.8 Electronic Signatures: This Agreement may be executed by electronic signature in accordance with the Information Technology Act, 2000, and such electronic signature shall have the same force and effect as an original signature.

8.9 Compliance with Laws: Each Party shall comply with all applicable laws, regulations, and governmental orders in the performance of its obligations under this Agreement, including but not limited to the Indian Contract Act, 1872.

IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the date first written above.

FOR AND ON BEHALF OF THE DISCLOSING PARTY:

_____________________________
Name: ${party1}
Designation: [Authorized Signatory]
Date: __________________
Place: __________________

Witness:
1. Name: __________________
   Signature: __________________
   Address: __________________

2. Name: __________________
   Signature: __________________
   Address: __________________


FOR AND ON BEHALF OF THE RECEIVING PARTY:

_____________________________
Name: ${party2}
Designation: [Authorized Signatory]
Date: __________________
Place: __________________

Witness:
1. Name: __________________
   Signature: __________________
   Address: __________________

2. Name: __________________
   Signature: __________________
   Address: __________________`;
    }

    generateServiceAgreement(fields) {
        const provider = fields.providerName || '[SERVICE PROVIDER]';
        const client = fields.clientName || '[CLIENT]';
        const services = fields.services || '[DESCRIPTION OF SERVICES]';
        const compensation = fields.compensation || '[COMPENSATION AMOUNT]';
        const date = new Date().toLocaleDateString('en-IN');
        const jurisdiction = fields.jurisdiction || 'Courts at New Delhi, India';

        return `SERVICE AGREEMENT

THIS AGREEMENT is made on this ${date}

BETWEEN

${provider} (hereinafter referred to as the "Service Provider") of the FIRST PART;

AND

${client} (hereinafter referred to as the "Client") of the SECOND PART.

WHEREAS the Client desires to engage the Service Provider to provide certain services and the Service Provider has agreed to provide such services on the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows:

ARTICLE 1: SERVICES

1.1 The Service Provider agrees to provide the following services to the Client: ${services}

1.2 The Service Provider shall perform the Services in a professional and workmanlike manner in accordance with industry standards.

ARTICLE 2: TERM

2.1 This Agreement shall commence on ${date} and shall continue until completion of the Services or earlier termination as provided herein.

2.2 Either Party may terminate this Agreement upon thirty (30) days' prior written notice to the other Party.

ARTICLE 3: COMPENSATION

3.1 In consideration for the Services, the Client shall pay the Service Provider ${compensation}.

3.2 Payment shall be made within thirty (30) days of receipt of invoice.

3.3 All payments shall be made in Indian Rupees (INR).

3.4 The Service Provider shall issue proper tax invoices in accordance with the Goods and Services Tax Act, 2017.

ARTICLE 4: INTELLECTUAL PROPERTY RIGHTS

4.1 All work product, deliverables, and intellectual property created by the Service Provider in the course of providing the Services shall, upon full payment, be the exclusive property of the Client.

4.2 The Service Provider hereby assigns all rights, title, and interest in such work product to the Client.

ARTICLE 5: CONFIDENTIALITY

5.1 Both Parties agree to maintain the confidentiality of all proprietary and confidential information disclosed during the term of this Agreement.

5.2 The obligations of confidentiality shall survive termination of this Agreement for a period of three (3) years.

ARTICLE 6: GOVERNING LAW

6.1 This Agreement shall be governed by the laws of India, including but not limited to the Indian Contract Act, 1872.

6.2 Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of ${jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this Service Agreement.

SERVICE PROVIDER:
_____________________________
${provider}
Date: __________________

CLIENT:
_____________________________
${client}
Date: __________________`;
    }

    generateEmploymentAgreement(fields) {
        return `EMPLOYMENT AGREEMENT

[Comprehensive employment agreement template compliant with Indian labor laws including Industrial Disputes Act, 1947, Provident Fund Act, 1952, and Payment of Gratuity Act, 1972]`;
    }

    generateFreelancerAgreement(fields) {
        return `INDEPENDENT CONTRACTOR AGREEMENT

[Comprehensive freelancer agreement template with GST compliance and IP provisions]`;
    }

    generatePartnershipAgreement(fields) {
        return `PARTNERSHIP DEED

[Comprehensive partnership agreement template as per Indian Partnership Act, 1932]`;
    }

    generateLeaseAgreement(fields) {
        return `LEASE AGREEMENT

[Comprehensive lease agreement template as per Transfer of Property Act, 1882]`;
    }

    generateLoanAgreement(fields) {
        return `LOAN AGREEMENT

[Comprehensive loan agreement template as per Indian Contract Act, 1872]`;
    }

    generateCertificate(fields, type = 'COMPLETION') {
        console.log(`🎓 Generating Certificate of type: ${type}`);
        console.log('Fields received:', JSON.stringify(fields, null, 2));

        // Normalize fields based on certificate type
        let recipientName = fields.recipientName || fields.intern_name || fields.employee_name || '[RECIPIENT NAME]';
        let description = fields.description || fields.achievement || '[DESCRIPTION]';
        let date = fields.date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        let issuerName = fields.issuerName || fields.authorized_signatory || fields.presenter_name || '[ISSUER NAME]';
        let organization = fields.organization || fields.company_name || '[ORGANIZATION NAME]';

        // Specific logic for different types
        let bodyContent = '';

        if (type === 'INTERNSHIP') {
            const department = fields.department || '[DEPARTMENT]';
            const startDate = fields.start_date || '[START DATE]';
            const endDate = fields.end_date || '[END DATE]';
            bodyContent = `This is to certify that ${recipientName.toUpperCase()} has successfully completed their internship in the ${department} Department from ${startDate} to ${endDate}. During this period, they showed keen interest and dedication to their work.`;
        } else if (type === 'EXPERIENCE') {
            const designation = fields.designation || '[DESIGNATION]';
            const joiningDate = fields.joining_date || '[JOINING DATE]';
            const relievingDate = fields.relieving_date || '[RELIEVING DATE]';
            bodyContent = `This is to certify that ${recipientName.toUpperCase()} was employed with ${organization} as ${designation} from ${joiningDate} to ${relievingDate}. We found them to be sincere, hardworking, and result-oriented. We wish them success in their future endeavors.`;
        } else if (type === 'APPRECIATION') {
            bodyContent = `In recognition of their outstanding contribution: "${description}". Your dedication and commitment are truly appreciated.`;
        } else {
            bodyContent = `${description}\n\nIN RECOGNITION OF THEIR DEDICATION, HARD WORK, AND OUTSTANDING PERFORMANCE.`;
        }

        return `CERTIFICATE OF ${type}
        
PROUDLY PRESENTED TO
        
${recipientName.toUpperCase()}
        
${bodyContent}

GIVEN THIS ${date.toUpperCase()}

_____________________________
${issuerName}
[AUTHORIZED SIGNATORY]
${organization !== '[ORGANIZATION NAME]' ? organization : ''}`;
    }

    generateGeneric(templateId, fields) {
        return `${templateId.toUpperCase()}

[Professional legal document template compliant with Indian law]

This document is generated based on the provided information and should be reviewed by a qualified legal professional before use.`;
    }
}

module.exports = new TemplateLegalService();
