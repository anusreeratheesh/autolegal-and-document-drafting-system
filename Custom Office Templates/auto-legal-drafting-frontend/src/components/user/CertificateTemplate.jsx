import React, { useState } from 'react';

// Template 1: Navy Blue with Gold Ribbon (Current Design)
const Template1 = ({ titleMain, titleSub, recipient, body, date, issuerName, issuerTitle }) => (
    <div className="relative w-full h-full bg-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-br from-blue-900 to-blue-950"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full overflow-hidden">
            <div className="absolute -top-20 -left-10 w-40 h-full bg-gradient-to-br from-orange-500 to-orange-600 transform -rotate-12"></div>
        </div>
        <div className="absolute inset-6 border-4 border-amber-500 z-10 pointer-events-none"></div>

        <div className="relative z-20 h-full flex">
            <div className="w-1/3 relative flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex gap-1 z-0">
                        <div className="w-8 h-40 bg-gradient-to-b from-amber-400 to-amber-500 transform -rotate-6 shadow-lg"></div>
                        <div className="w-8 h-40 bg-gradient-to-b from-amber-500 to-amber-600 transform rotate-6 shadow-lg"></div>
                    </div>
                    <div className="relative z-10 w-32 h-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                                    <div className="w-8 h-16 bg-gradient-to-b from-amber-300 to-amber-400 mx-auto rounded-full"></div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 shadow-xl border-4 border-amber-300 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-2/3 bg-gradient-to-br from-gray-50 to-white py-16 px-12 flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-serif text-gray-800 tracking-wide mb-2">{titleMain}</h1>
                    <p className="text-sm text-gray-600 tracking-widest">{titleSub}</p>
                </div>
                <p className="text-center text-sm text-gray-600 mb-4">This certificate is presented to</p>
                <div className="text-center mb-8">
                    <h2 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500" style={{ fontFamily: 'Brush Script MT, cursive' }}>{recipient}</h2>
                </div>
                <div className="text-center max-w-lg mx-auto mb-8">
                    <p className="text-gray-700 text-sm leading-relaxed">{body}</p>
                </div>
                <div className="mt-auto pt-8">
                    <p className="text-center text-xs text-gray-600 mb-6">Signed by,</p>
                    <div className="text-center">
                        <div className="inline-block">
                            <div className="border-b-2 border-gray-800 w-64 mb-2"></div>
                            <p className="text-gray-900 font-medium text-base mb-1">{issuerName}</p>
                            <p className="text-gray-600 text-sm">{issuerTitle}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 right-12">
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </div>
        </div>
    </div>
);

// Template 2: Elegant Purple with Gold Border
const Template2 = ({ titleMain, titleSub, recipient, body, date, issuerName, issuerTitle }) => (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl overflow-hidden">
        <div className="absolute inset-8 border-8 border-double border-amber-600"></div>
        <div className="absolute inset-12 border-2 border-amber-400"></div>

        <div className="absolute top-6 left-6 w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 opacity-40">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>
        <div className="absolute top-6 right-6 w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 opacity-40">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center px-20 py-16">
            <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                <span className="text-4xl text-white">⭐</span>
            </div>

            <h1 className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-800 mb-2">{titleMain}</h1>
            <p className="text-lg text-gray-600 tracking-widest uppercase mb-12">{titleSub}</p>

            <p className="text-sm text-gray-600 mb-4">Proudly presented to</p>
            <h2 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 mb-8" style={{ fontFamily: 'Brush Script MT, cursive' }}>{recipient}</h2>

            <div className="max-w-2xl text-center mb-12">
                <p className="text-gray-700 leading-relaxed">{body}</p>
                <p className="text-gray-600 mt-4 font-medium">{date}</p>
            </div>

            <div className="mt-auto text-center">
                <div className="border-b-2 border-gray-800 w-72 mb-2 mx-auto"></div>
                <p className="text-gray-900 font-bold text-lg mb-1">{issuerName}</p>
                <p className="text-gray-600">{issuerTitle}</p>
            </div>
        </div>
    </div>
);

// Template 3: Modern Minimalist with Teal Accent
const Template3 = ({ titleMain, titleSub, recipient, body, date, issuerName, issuerTitle }) => (
    <div className="relative w-full h-full bg-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-500"></div>
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-500"></div>

        <div className="absolute top-8 left-8">
            <div className="w-16 h-16 border-4 border-teal-500 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full"></div>
            </div>
        </div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center px-20 py-16">
            <div className="text-center mb-12">
                <h1 className="text-7xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '2px' }}>{titleMain}</h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent to-teal-500"></div>
                    <p className="text-xl text-teal-600 font-medium uppercase tracking-wider">{titleSub}</p>
                    <div className="h-px w-32 bg-gradient-to-l from-transparent to-teal-500"></div>
                </div>
            </div>

            <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">This is to certify that</p>
            <h2 className="text-6xl font-light text-teal-600 mb-12" style={{ fontFamily: 'Georgia, serif' }}>{recipient}</h2>

            <div className="max-w-2xl text-center mb-16">
                <p className="text-gray-700 text-lg leading-relaxed">{body}</p>
            </div>

            <div className="flex items-center gap-8 mt-auto">
                <div className="text-center">
                    <div className="border-b-2 border-gray-400 w-64 mb-3"></div>
                    <p className="text-gray-900 font-semibold text-lg">{issuerName}</p>
                    <p className="text-gray-600 text-sm">{issuerTitle}</p>
                </div>
                <div className="text-center">
                    <div className="border-b-2 border-gray-400 w-48 mb-3"></div>
                    <p className="text-gray-600 text-sm">{date}</p>
                </div>
            </div>
        </div>
    </div>
);

// Template 4: Classic Formal with Maroon Border
const Template4 = ({ titleMain, titleSub, recipient, body, date, issuerName, issuerTitle }) => (
    <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl overflow-hidden">
        <div className="absolute inset-6 border-8 border-maroon-800" style={{ borderColor: '#7f1d1d' }}></div>
        <div className="absolute inset-10 border-4 border-amber-600"></div>
        <div className="absolute inset-12 border border-maroon-600" style={{ borderColor: '#991b1b' }}></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#7f1d1d" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#7f1d1d" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="#7f1d1d" strokeWidth="0.5" />
            </svg>
        </div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center px-20 py-16">
            <div className="w-20 h-20 mb-8 border-4 rounded-full flex items-center justify-center" style={{ borderColor: '#7f1d1d' }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
                    <span className="text-2xl text-amber-400">★</span>
                </div>
            </div>

            <h1 className="text-6xl font-serif text-gray-900 mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>{titleMain}</h1>
            <p className="text-base text-gray-700 tracking-widest uppercase mb-12" style={{ borderTop: '2px solid #7f1d1d', borderBottom: '2px solid #7f1d1d', padding: '8px 40px' }}>{titleSub}</p>

            <p className="text-sm text-gray-600 italic mb-4">This certificate is hereby awarded to</p>
            <h2 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-red-700 mb-10" style={{ fontFamily: 'Brush Script MT, cursive' }}>{recipient}</h2>

            <div className="max-w-2xl text-center mb-12 px-8 py-6 bg-white bg-opacity-50 rounded-lg border border-maroon-200" style={{ borderColor: '#fecaca' }}>
                <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{body}</p>
            </div>

            <div className="flex items-center justify-between w-full max-w-2xl mt-auto">
                <div className="text-left">
                    <p className="text-xs text-gray-500 mb-2">Date</p>
                    <p className="text-gray-700 font-medium">{date}</p>
                </div>
                <div className="text-right">
                    <div className="border-b-2 border-gray-800 w-64 mb-2"></div>
                    <p className="text-gray-900 font-bold">{issuerName}</p>
                    <p className="text-gray-600 text-sm">{issuerTitle}</p>
                </div>
            </div>
        </div>
    </div>
);

function CertificateTemplate({ content, templateId = 1 }) {
    const [selectedTemplate, setSelectedTemplate] = useState(templateId);

    const parseContent = (text) => {
        if (!text) return {};

        let plainText = text;
        if (text.includes('<') && text.includes('>')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            plainText = tempDiv.textContent || tempDiv.innerText || '';
        }

        const lines = plainText.split('\n').filter(line => line.trim() !== '');
        const titleLine = lines[0] || 'CERTIFICATE';
        const titleMain = "Certificate";
        const titleSub = titleLine.replace('CERTIFICATE', '').replace('OF', 'of').trim() || 'of Recognition';
        const recipient = lines[2] || '';
        const dateLineIndex = lines.findIndex(line => line.trim().startsWith('GIVEN THIS'));
        const body = lines.slice(3, dateLineIndex > -1 ? dateLineIndex : lines.length - 4).join(' ');

        let date = '';
        if (dateLineIndex > -1) {
            date = lines[dateLineIndex].replace('GIVEN THIS', '').trim();
        } else {
            date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        const issuerName = lines[lines.length - 3] || '';
        const issuerTitle = lines[lines.length - 2] || '';

        return { titleMain, titleSub, recipient, body, date, issuerName, issuerTitle };
    };

    const data = parseContent(content);

    const templates = {
        1: <Template1 {...data} />,
        2: <Template2 {...data} />,
        3: <Template3 {...data} />,
        4: <Template4 {...data} />
    };

    return (
        <div className="w-full">
            {/* Template Selector */}
            <div className="mb-6 flex items-center justify-center gap-4">
                <span className="text-sm font-medium text-gray-700">Choose Template:</span>
                {[1, 2, 3, 4].map(id => (
                    <button
                        key={id}
                        onClick={() => setSelectedTemplate(id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTemplate === id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Template {id}
                    </button>
                ))}
            </div>

            {/* Certificate Display */}
            <div className="w-full max-w-5xl mx-auto" style={{ aspectRatio: '1.5/1', minHeight: '600px' }}>
                {templates[selectedTemplate]}
            </div>
        </div>
    );
}

export default CertificateTemplate;
