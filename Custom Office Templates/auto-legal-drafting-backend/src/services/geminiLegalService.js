const { GoogleGenerativeAI } = require('@google/generative-ai');
const ragService = require('./ragService');

class GeminiLegalService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        if (!this.apiKey) {
            console.warn('⚠️  GEMINI_API_KEY not found. AI features will not work.');
            return;
        }
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    }

    parseQuotaError(errorMessage) {
        const retryMatch = errorMessage.match(/retry in ([\d.]+)s/);
        const retrySeconds = retryMatch ? parseFloat(retryMatch[1]) : null;
        const isQuotaError = errorMessage.includes('429') &&
            (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED'));
        return { isQuotaError, retrySeconds };
    }

    async retryOperation(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                const { isQuotaError, retrySeconds } = this.parseQuotaError(error.message);

                if (isQuotaError) {
                    const waitTime = retrySeconds ? Math.ceil(retrySeconds) : 60;
                    throw new Error(
                        `API quota limit exceeded. Please wait ${waitTime} seconds and try again, ` +
                        `or upgrade your Gemini API key at https://aistudio.google.com/app/apikey for higher limits.`
                    );
                }

                // Retry on network/overload errors
                const isRetryable = error.message.includes('503') ||
                    error.message.includes('ECONNRESET') ||
                    error.message.includes('ECONNREFUSED') ||
                    error.message.includes('socket hang up');

                if (isRetryable && i < maxRetries - 1) {
                    const delay = Math.pow(2, i) * 2000 + Math.random() * 1000;
                    console.log(`⚠️ Network error (attempt ${i + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }

    async generateDocument(templateId, fields) {
        if (!this.apiKey || !this.model) {
            throw new Error('Gemini API key not configured');
        }

        // Retrieve relevant legal context
        let legalContext = '';
        try {
            console.log(`🔍 Retrieving legal context for ${templateId}...`);
            const query = `${templateId} ${JSON.stringify(fields)}`;
            legalContext = await ragService.retrieve(query);
            if (legalContext) {
                console.log('✅ Legal context retrieved successfully');
            }
        } catch (error) {
            console.warn('⚠️ RAG retrieval failed, proceeding without context:', error.message);
        }

        const prompt = this.buildLegalPrompt(templateId, fields, legalContext);

        try {
            return await this.retryOperation(async () => {
                console.log(`🤖 Generating ${templateId} with Gemini AI (gemini-3.6-flash)...`);

                const result = await this.model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                    }
                });

                const text = result.response.text();

                console.log('✅ Legal document generated successfully');
                console.log(`📄 Document length: ${text.length} characters`);
                return text;
            });
        } catch (error) {
            const { isQuotaError } = this.parseQuotaError(error.message);
            if (isQuotaError) {
                console.error('❌ Gemini API Quota Exceeded');
            } else {
                console.error('❌ Gemini API Error:', error.message);
            }
            throw new Error(`Failed to generate document: ${error.message}`);
        }
    }

    buildLegalPrompt(templateId, fields, legalContext = '') {
        const templates = {
            'NDA': this.getNDATemplate(fields),
            'Service Agreement': this.getServiceAgreementTemplate(fields),
            'Employment Agreement': this.getEmploymentAgreementTemplate(fields),
            'Freelancer Agreement': this.getFreelancerAgreementTemplate(fields),
            'Partnership Agreement': this.getPartnershipAgreementTemplate(fields),
            'Lease Agreement': this.getLeaseAgreementTemplate(fields),
            'Loan Agreement': this.getLoanAgreementTemplate(fields),
            'Certificate': this.getCertificateTemplate(fields),
            'Internship Certificate': this.getCertificateTemplate(fields),
            'Experience Certificate': this.getCertificateTemplate(fields),
            'Appreciation Certificate': this.getCertificateTemplate(fields),
        };

        let basePrompt = templates[templateId] || this.getGenericTemplate(templateId, fields);

        if (legalContext) {
            basePrompt += `\n\nIMPORTANT LEGAL CONTEXT (INDIAN LAW):\nThe following legal clauses and definitions from Indian Law MUST be incorporated where relevant:\n\n${legalContext}`;
        }

        return basePrompt;
    }

    getNDATemplate(fields) {
        return `You are an expert legal document drafter. Generate a comprehensive, legally binding Non-Disclosure Agreement (NDA) with the following information:

PARTIES:
- Disclosing Party: ${fields.partyA_name || fields.party1Name || '[DISCLOSING PARTY NAME]'}
- Receiving Party: ${fields.partyB_name || fields.party2Name || '[RECEIVING PARTY NAME]'}
- Effective Date: ${fields.effective_date || fields.effectiveDate || '[DATE]'}
- Purpose: ${fields.purpose || '[PURPOSE OF DISCLOSURE]'}
- Term of Confidentiality: ${fields.term_of_confidentiality || fields.term || '2 years'}
- Jurisdiction: ${fields.governing_law || fields.jurisdiction || '[JURISDICTION]'}
- Confidential Information Definition: ${fields.definition_of_confidential_information || 'Standard definition'}
- Exceptions: ${fields.exceptions || 'Standard exceptions'}
- Permitted Recipients: ${fields.permitted_disclosure_recipients || 'Employees and advisors on need-to-know basis'}

Generate a complete NDA with: Title, Recitals, Definitions, Obligations, Exclusions, Term, Remedies, Warranties, Miscellaneous Provisions, and Signature Blocks. Use proper legal formatting with numbered articles.`;
    }

    getServiceAgreementTemplate(fields) {
        return `Generate a comprehensive Service Agreement for:
Provider: ${fields.service_provider || fields.providerName || '[PROVIDER]'}
Client: ${fields.service_client || fields.clientName || '[CLIENT]'}
Services: ${fields.service_description || fields.services || '[SERVICES]'}
Fee: ${fields.service_fee || '[FEE]'}
Payment Terms: ${fields.payment_terms || '[PAYMENT TERMS]'}
Term: ${fields.service_term || '[TERM]'} months
Termination Notice: ${fields.termination_clause || '30'} days
Effective Date: ${fields.effective_date || '[DATE]'}

Include: Services, Term, Compensation, IP Rights, Confidentiality, Warranties, Liability, Indemnification, General Provisions, and Signature Blocks.`;
    }

    getEmploymentAgreementTemplate(fields) {
        return `Generate a comprehensive Employment Agreement for:
Employer: ${fields.company_name || fields.employerName || '[EMPLOYER]'}
Employee: ${fields.employee_name || fields.employeeName || '[EMPLOYEE]'}
Position: ${fields.job_title || fields.position || '[POSITION]'}
Salary: ${fields.salary || '[SALARY]'}
Probation: ${fields.probation_period || '3'} months
Notice Period: ${fields.notice_period || '30'} days
Benefits: ${fields.benefits || 'Standard benefits'}
Confidentiality: ${fields.confidentiality_clause ? 'Yes' : 'Standard'}
Non-Compete: ${fields.non_compete ? 'Yes' : 'No'}
Effective Date: ${fields.effective_date || '[DATE]'}

Include: Position, Compensation, Benefits, Hours, Confidentiality, IP, Non-Compete, Termination, and General Provisions.`;
    }

    getFreelancerAgreementTemplate(fields) {
        return `Generate a Freelancer Agreement for:
Client: ${fields.clientName || '[CLIENT]'}
Contractor: ${fields.contractorName || '[CONTRACTOR]'}
Project: ${fields.projectDescription || '[PROJECT]'}

Include: Services, Compensation, IP, Confidentiality, Independent Contractor Status, Term, and General Provisions.`;
    }

    getPartnershipAgreementTemplate(fields) {
        return `Generate a Partnership Agreement for:
Partners: ${fields.partners || '[PARTNERS]'}
Business: ${fields.businessName || '[BUSINESS]'}

Include: Formation, Capital, Profit/Loss, Management, Transfer, Dissolution, and General Provisions.`;
    }

    getLeaseAgreementTemplate(fields) {
        return `Generate a Lease Agreement for:
Landlord: ${fields.landlord_name || fields.landlordName || '[LANDLORD]'}
Tenant: ${fields.tenant_name || fields.tenantName || '[TENANT]'}
Property: ${fields.property_address || fields.propertyAddress || '[PROPERTY]'}
Rent: ${fields.rent_amount || fields.rent || '[RENT]'}
Security Deposit: ${fields.security_deposit || '[DEPOSIT]'}
Term: ${fields.lease_term || '[TERM]'} months
Maintenance: ${fields.maintenance_responsibility || 'Shared'}
Effective Date: ${fields.effective_date || '[DATE]'}

Include: Property, Term, Rent, Deposit, Use, Maintenance, Utilities, Rules, Default, and General Provisions.`;
    }

    getLoanAgreementTemplate(fields) {
        return `Generate a Loan Agreement for:
Lender: ${fields.lenderName || '[LENDER]'}
Borrower: ${fields.borrowerName || '[BORROWER]'}
Amount: ${fields.loanAmount || '[AMOUNT]'}
Rate: ${fields.interestRate || '[RATE]'}

Include: Loan Terms, Repayment, Security, Representations, Covenants, Default, and General Provisions.`;
    }

    getCertificateTemplate(fields) {
        return `You are an expert certificate designer. Generate the text content for a professional ${fields.template_id || 'Certificate'}.

INFORMATION:
Recipient: ${fields.recipientName || fields.intern_name || fields.employee_name || '[NAME]'}
Date: ${fields.date || new Date().toLocaleDateString()}
Issuer: ${fields.issuerName || fields.authorized_signatory || '[ISSUER]'}
Details: ${JSON.stringify(fields)}

FORMAT REQUIREMENTS:
The output MUST be strictly formatted as follows for parsing:
Line 1: CERTIFICATE OF [TYPE] (e.g. INTERNSHIP, APPRECIATION)
Line 2: PROUDLY PRESENTED TO
Line 3: [RECIPIENT NAME]
Line 4+: [Body of the certificate - 2-3 sentences describing the achievement, dates, and contribution. Be professional and specific.]
Last Line - 2: GIVEN THIS [DATE]
Last Line - 1: [ISSUER NAME]
Last Line: [ISSUER TITLE/ORGANIZATION]

Do not include any markdown formatting like **bold** or # headers. Just plain text lines.`;
    }

    getGenericTemplate(templateId, fields) {
        const fieldsList = Object.entries(fields)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        return `Generate a comprehensive ${templateId} with:

${fieldsList}

Include all standard legal clauses, proper formatting, numbered sections, and signature blocks.`;
    }
}

module.exports = new GeminiLegalService();
