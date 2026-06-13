import React, { useState } from 'react';
import { 
  Palette, 
  Rocket, 
  Settings, 
  Download, 
  Copy, 
  CheckCircle,
  Wand2,
  Key,
  Loader2,
  ImagePlus,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

const colorThemes: Record<string, { primary: string, bg: string, text: string, button: string, border: string }> = {
  blue: { primary: 'text-blue-600', bg: 'bg-blue-50', text: 'text-slate-900', button: 'bg-blue-600 hover:bg-blue-700 text-white', border: 'border-blue-200' },
  purple: { primary: 'text-purple-600', bg: 'bg-purple-50', text: 'text-slate-900', button: 'bg-purple-600 hover:bg-purple-700 text-white', border: 'border-purple-200' },
  orange: { primary: 'text-orange-600', bg: 'bg-orange-50', text: 'text-slate-900', button: 'bg-orange-600 hover:bg-orange-700 text-white', border: 'border-orange-200' },
  gray: { primary: 'text-slate-800', bg: 'bg-slate-50', text: 'text-slate-900', button: 'bg-slate-800 hover:bg-slate-900 text-white', border: 'border-slate-200' },
};



export default function LandingPageGenerator() {
  // Core Data States
  const [businessName, setBusinessName] = useState('Empresa Acme');
  const [valueProposition, setValueProposition] = useState('Potencia tu productividad con IA');
  const [heroDescription, setHeroDescription] = useState('Descubre cómo Empresa Acme puede ayudarte a alcanzar tus metas más rápido y fácil que nunca. Únete a miles de clientes satisfechos.');
  const [targetAudience, setTargetAudience] = useState('Profesionales y Equipos');
  const [ctaText, setCtaText] = useState('Comenzar Gratis');
  const [colorPalette, setColorPalette] = useState('blue');

  // Dynamic Content States
  const [featuresTitle, setFeaturesTitle] = useState('Funcionalidades Potentes para Equipos Modernos');
  const [features, setFeatures] = useState([
    { title: 'Velocidad Extrema', description: 'Construido para la velocidad y el rendimiento, ofreciendo la mejor experiencia.' },
    { title: 'Seguro y Confiable', description: 'Tus datos están a salvo con nuestra seguridad de grado empresarial y una infraestructura robusta.' },
    { title: 'Centrado en el Usuario', description: 'Diseñado teniendo en mente a tus usuarios, garantizando un viaje fluido e intuitivo.' }
  ]);
  
  const [testimonialText, setTestimonialText] = useState('Empresa Acme transformó por completo nuestra forma de trabajar. Su diseño intuitivo y funcionalidades potentes son exactamente lo que necesitábamos.');
  const [testimonialAuthor, setTestimonialAuthor] = useState('Sara Jiménez');
  const [testimonialRole, setTestimonialRole] = useState('Directora de Operaciones');

  // Multimedia States
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<{url: string, data: string, mimeType: string}[]>([]);
  const [imageSectionTitle, setImageSectionTitle] = useState('Nuestra Galería');
  const [imageSectionText, setImageSectionText] = useState('Mira de cerca lo que hacemos. Nuestra calidad y atención al detalle saltan a la vista.');

  // AI Enhancer States
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Logo Generator States
  const [logoStyle, setLogoStyle] = useState('shapes');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

  const theme = colorThemes[colorPalette] || colorThemes['blue'];

  const handleGenerateLogo = () => {
    setIsGeneratingLogo(true);
    const seed = Math.floor(Math.random() * 1000000);
    const seedName = encodeURIComponent((businessName || 'Brand') + "-" + seed);
    const url = `https://api.dicebear.com/9.x/${logoStyle}/svg?seed=${seedName}`;
    
    // Simulate slight loading delay for UX
    setTimeout(() => {
      setLogoBase64(url);
      setIsGeneratingLogo(false);
    }, 600);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogoBase64(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const mimeType = result.split(';')[0].split(':')[1];
        const data = result.split(',')[1];
        setProductImages(prev => [...prev, { url: result, data, mimeType }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleEnhanceWithAI = async () => {
    if (!apiKey) {
      alert("Por favor, ingresa tu clave de API de Gemini primero en la sección 'IA Enhancer'.");
      return;
    }

    setIsGenerating(true);
    try {
      let promptText = `Actúa como un Copywriter Senior experto en conversiones y neuroventas. 
Tengo una empresa llamada "${businessName}" orientada a "${targetAudience}".
Mi idea base es: "${valueProposition}".

Quiero que mejores y reescribas los textos de mi Landing Page para que sea "de otro mundo", muy persuasiva, profesional y que genere altas conversiones.`;

      if (productImages.length > 0) {
        promptText += `\n\nATENCIÓN ESPECIAL: Te he adjuntado imágenes de mi producto/servicio. Analízalas cuidadosamente e infiere exactamente de qué trata el negocio. Escribe una sección visual exclusiva basada en lo que ves. Debes completar los campos "imageSectionTitle" y "imageSectionText" en el JSON, describiendo lo que se muestra en las fotos de forma extremadamente atractiva para el cliente.`;
      }

      promptText += `\n\nDebes devolver la respuesta estrictamente en JSON usando la estructura definida.`;

      const parts: any[] = [{ text: promptText }];
      productImages.forEach(img => {
        parts.push({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType
          }
        });
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                valueProposition: { type: "string" },
                heroDescription: { type: "string" },
                ctaText: { type: "string" },
                featuresTitle: { type: "string" },
                features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                testimonialText: { type: "string" },
                testimonialAuthor: { type: "string" },
                testimonialRole: { type: "string" },
                imageSectionTitle: { type: "string" },
                imageSectionText: { type: "string" }
              },
              required: ["valueProposition", "heroDescription", "ctaText", "featuresTitle", "features", "testimonialText", "testimonialAuthor", "testimonialRole"]
            }
          }
        })
      });

      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      const enhancedContent = JSON.parse(resultText);

      setValueProposition(enhancedContent.valueProposition);
      setHeroDescription(enhancedContent.heroDescription);
      setCtaText(enhancedContent.ctaText);
      setFeaturesTitle(enhancedContent.featuresTitle);
      
      const enhancedFeatures = enhancedContent.features.slice(0, 3);
      while(enhancedFeatures.length < 3) {
        enhancedFeatures.push({ title: "Característica", description: "Descripción..."});
      }
      setFeatures(enhancedFeatures);
      
      setTestimonialText(enhancedContent.testimonialText);
      setTestimonialAuthor(enhancedContent.testimonialAuthor);
      setTestimonialRole(enhancedContent.testimonialRole);

      if (enhancedContent.imageSectionTitle) setImageSectionTitle(enhancedContent.imageSectionTitle);
      if (enhancedContent.imageSectionText) setImageSectionText(enhancedContent.imageSectionText);

    } catch (error) {
      console.error(error);
      alert("Hubo un error al conectar con la IA. Por favor, verifica tu API Key y tu conexión.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHTML = () => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${valueProposition}</title>
  <meta name="description" content="${heroDescription}">
  <meta property="og:title" content="${businessName} - ${valueProposition}">
  <meta property="og:description" content="${heroDescription}">
  <meta property="og:type" content="website">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans antialiased text-slate-900 bg-white">
  <!-- Navigation -->
  <header class="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b ${theme.border} bg-white sticky top-0 z-40">
    <div class="flex items-center gap-3">
      ${logoBase64 
        ? `<img src="${logoBase64}" alt="Logo" class="h-10 object-contain logo-img" />`
        : `<div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${theme.button} logo-img">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
           </div>`
      }
      <span class="text-xl md:text-2xl font-bold tracking-tight">${businessName}</span>
    </div>
    <nav class="hidden md:flex gap-8 items-center">
      <a href="#features" class="text-sm font-semibold text-slate-600 hover:${theme.primary} transition-colors">Características</a>
      ${productImages.length > 0 ? `<a href="#gallery" class="text-sm font-semibold text-slate-600 hover:${theme.primary} transition-colors">Galería</a>` : ''}
      <a href="#how-it-works" class="text-sm font-semibold text-slate-600 hover:${theme.primary} transition-colors">Cómo Funciona</a>
      <a href="#testimonials" class="text-sm font-semibold text-slate-600 hover:${theme.primary} transition-colors">Testimonios</a>
      <a href="#faq" class="text-sm font-semibold text-slate-600 hover:${theme.primary} transition-colors">FAQ</a>
      <button onclick="openModal()" class="px-5 py-2.5 text-sm font-bold rounded-full shadow-md transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${theme.button}">${ctaText}</button>
    </nav>
    <button id="mobileMenuBtn" onclick="toggleMenu()" class="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    </button>
  </header>

  <!-- Mobile Menu -->
  <div id="mobileMenu" class="hidden md:hidden fixed inset-0 z-30 bg-white pt-20 px-6 flex-col gap-6 shadow-xl border-b border-slate-200">
    <a href="#features" onclick="toggleMenu()" class="text-lg font-semibold text-slate-800 hover:${theme.primary}">Características</a>
    ${productImages.length > 0 ? `<a href="#gallery" onclick="toggleMenu()" class="text-lg font-semibold text-slate-800 hover:${theme.primary}">Galería</a>` : ''}
    <a href="#how-it-works" onclick="toggleMenu()" class="text-lg font-semibold text-slate-800 hover:${theme.primary}">Cómo Funciona</a>
    <a href="#testimonials" onclick="toggleMenu()" class="text-lg font-semibold text-slate-800 hover:${theme.primary}">Testimonios</a>
    <a href="#faq" onclick="toggleMenu()" class="text-lg font-semibold text-slate-800 hover:${theme.primary}">Preguntas Frecuentes</a>
    <button onclick="openModal(); toggleMenu()" class="mt-4 px-6 py-4 text-base font-bold rounded-xl shadow-lg ${theme.button} w-full">${ctaText}</button>
  </div>

  <!-- Hero Section -->
  <section class="w-full py-24 px-6 md:px-12 md:py-36 flex flex-col items-center text-center ${theme.bg} relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    <div class="relative z-10 flex flex-col items-center">
      <span class="px-4 py-1.5 text-xs font-bold rounded-full bg-white shadow-sm border ${theme.border} mb-8 uppercase tracking-widest ${theme.primary}">Especial para ${targetAudience}</span>
      <h1 class="text-5xl md:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] mb-8 text-slate-900">${valueProposition}</h1>
      <p class="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 font-medium leading-relaxed">${heroDescription}</p>
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button onclick="openModal()" class="px-8 py-4 text-lg font-bold rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-2xl ${theme.button} w-full sm:w-auto">${ctaText}</button>
        <button onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})" class="px-8 py-4 text-lg font-bold rounded-full bg-white text-slate-900 border-2 border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 w-full sm:w-auto">Saber Más</button>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="w-full py-24 px-6 md:px-12 bg-white relative">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-black text-center mb-20 tracking-tight">${featuresTitle}</h2>
      <div class="grid md:grid-cols-3 gap-10">
        <div class="p-10 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white shadow-md group-hover:scale-110 transition-transform ${theme.primary}">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">${features[0].title}</h3>
          <p class="text-lg text-slate-600 leading-relaxed">${features[0].description}</p>
        </div>
        <div class="p-10 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white shadow-md group-hover:scale-110 transition-transform ${theme.primary}">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">${features[1].title}</h3>
          <p class="text-lg text-slate-600 leading-relaxed">${features[1].description}</p>
        </div>
        <div class="p-10 rounded-3xl border border-slate-100 bg-slate-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white shadow-md group-hover:scale-110 transition-transform ${theme.primary}">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-4">${features[2].title}</h3>
          <p class="text-lg text-slate-600 leading-relaxed">${features[2].description}</p>
        </div>
      </div>
    </div>
  </section>

  ${productImages.length > 0 ? `
  <!-- Visual Showcase Section -->
  <section id="gallery" class="w-full py-24 px-6 md:px-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
      <div class="flex-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-slate-200 mb-6 ${theme.primary}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span class="text-xs font-bold uppercase tracking-wide">Descubre Más</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">${imageSectionTitle}</h2>
        <p class="text-xl text-slate-600 mb-10 leading-relaxed">${imageSectionText}</p>
        <ul class="space-y-4 mb-10">
          <li class="flex items-center gap-3">
             <div class="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
             <span class="font-medium text-slate-700">Calidad Superior</span>
          </li>
          <li class="flex items-center gap-3">
             <div class="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
             <span class="font-medium text-slate-700">Diseño Excepcional</span>
          </li>
        </ul>
        <button onclick="openModal()" class="px-8 py-4 text-lg font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl ${theme.button}">${ctaText}</button>
      </div>
      <div class="flex-1 w-full grid grid-cols-2 gap-4">
        ${productImages.map((img, i) => `
          <div class="rounded-3xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-[1.02] transition-all duration-300 ${i === 0 && productImages.length % 2 !== 0 ? 'col-span-2' : ''}">
            <img src="${img.url}" class="w-full h-56 md:h-72 object-cover" alt="Visual Showcase ${i+1}"/>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- How It Works Section -->
  <section id="how-it-works" class="w-full py-24 px-6 md:px-12 bg-white border-t border-slate-100">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight mb-4">¿Cómo Funciona?</h2>
        <p class="text-xl text-slate-600">Un proceso sencillo en 3 pasos para alcanzar tus metas.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 relative">
        <!-- Connecting Line for Desktop -->
        <div class="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        
        <!-- Step 1 -->
        <div class="relative z-10 p-8 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 border-2 border-slate-100 text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-slate-900">Paso 1: Regístrate</h3>
          <p class="text-slate-600">Crea tu cuenta gratuita en menos de 1 minuto y accede a nuestra plataforma sin compromisos.</p>
        </div>

        <!-- Step 2 -->
        <div class="relative z-10 p-8 rounded-3xl border-2 ${theme.border} ${theme.bg} shadow-xl flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${theme.button}">Rápido y Fácil</div>
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm ${theme.primary}">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-slate-900">Paso 2: Configura</h3>
          <p class="text-slate-800">Personaliza tus preferencias y ajusta la herramienta para que se adapte perfectamente a tus necesidades.</p>
        </div>

        <!-- Step 3 -->
        <div class="relative z-10 p-8 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 border-2 border-slate-100 text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 class="text-2xl font-bold mb-3 text-slate-900">Paso 3: Resultados</h3>
          <p class="text-slate-600">Siéntate y observa cómo tu productividad se dispara y alcanzas tus objetivos sin esfuerzo.</p>
        </div>
      </div>
      <div class="mt-16 flex justify-center">
        <button onclick="openModal()" class="px-10 py-5 text-lg font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 ${theme.button}">${ctaText}</button>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="w-full py-24 px-6 md:px-12 ${theme.bg}">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-black mb-16 tracking-tight">Cientos de clientes felices</h2>
      <div class="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100 relative">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 ${theme.primary}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        </div>
        <div class="flex justify-center gap-1.5 mb-8 text-amber-400">
          ${[1,2,3,4,5].map(() => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}
        </div>
        <p class="text-2xl md:text-3xl font-medium text-slate-800 mb-10 leading-relaxed">"${testimonialText}"</p>
        <div class="flex items-center justify-center gap-5">
          <div class="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shadow-inner border-2 border-white">
            <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" class="w-full h-full object-cover">
          </div>
          <div class="text-left">
            <p class="font-bold text-lg text-slate-900">${testimonialAuthor}</p>
            <p class="font-medium ${theme.primary}">${testimonialRole}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section id="faq" class="w-full py-24 px-6 md:px-12 bg-white">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-4xl font-black mb-12 text-center tracking-tight">Preguntas Frecuentes</h2>
      <div id="faq-container" class="space-y-4">
        <!-- Las FAQs se generarán aquí dinámicamente vía JavaScript -->
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="w-full py-24 px-6 md:px-12 bg-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-900 to-slate-900"></div>
    <div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
      <h2 class="text-4xl md:text-5xl font-black mb-6">¿Listo para empezar?</h2>
      <p class="text-xl text-slate-400 mb-10">Únete hoy y descubre el potencial de tu negocio.</p>
      <button onclick="openModal()" class="px-10 py-5 text-xl font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 ${theme.button}">${ctaText}</button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full py-12 px-6 md:px-12 bg-white text-center">
    <div class="flex items-center justify-center gap-3 mb-8">
       ${logoBase64 
        ? `<img src="${logoBase64}" alt="Logo" class="h-8 object-contain grayscale opacity-50 logo-img" />`
        : `<div class="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-200 text-slate-500 logo-img">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
           </div>`
      }
      <span class="text-xl font-bold text-slate-400">${businessName}</span>
    </div>
    <div class="flex flex-wrap justify-center gap-8 mb-10 text-sm font-semibold text-slate-500">
      <a href="#" class="hover:${theme.primary} transition-colors">Política de Privacidad</a>
      <a href="#" class="hover:${theme.primary} transition-colors">Términos de Servicio</a>
      <a href="#" class="hover:${theme.primary} transition-colors">Contáctanos</a>
    </div>
    <p class="text-slate-400 text-sm">© 2026 ${businessName}. Todos los derechos reservados.</p>
  </footer>

  <!-- Lead Capture Modal -->
  <div id="leadModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform scale-95 transition-transform duration-300" id="modalContent">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-black text-slate-900">Crea tu cuenta gratis</h3>
        <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <p class="text-slate-500 mb-8">Únete a cientos de usuarios satisfechos. Toma menos de 1 minuto.</p>
      
      <form id="leadForm" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre completo</label>
          <input type="text" required placeholder="Ej. Juan Pérez" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Correo electrónico profesional</label>
          <input type="email" required placeholder="tu@empresa.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all">
        </div>
        <button type="submit" class="w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 mt-4 flex items-center justify-center gap-2 ${theme.button}">
          Crear mi cuenta gratuita
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </form>
      <div id="successMsg" class="hidden flex-col items-center justify-center py-8 text-center animate-pulse">
        <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h4 class="text-xl font-bold text-slate-900 mb-2">¡Todo listo!</h4>
        <p class="text-slate-500">Revisa tu bandeja de entrada en breve.</p>
      </div>
    </div>
  </div>

  <script>
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobileMenu');
    function toggleMenu() {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }
    }

    // Modal Logic
    const modal = document.getElementById('leadModal');
    const modalContent = document.getElementById('modalContent');
    const leadForm = document.getElementById('leadForm');
    const successMsg = document.getElementById('successMsg');

    function openModal() {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-95');
      modalContent.classList.add('scale-100');
    }

    function closeModal() {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('scale-100');
      modalContent.classList.add('scale-95');
      setTimeout(() => {
        leadForm.reset();
        leadForm.style.display = 'block';
        successMsg.classList.add('hidden');
        successMsg.classList.remove('flex');
      }, 300);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      leadForm.style.display = 'none';
      successMsg.classList.remove('hidden');
      successMsg.classList.add('flex');
      setTimeout(() => {
        closeModal();
      }, 3000);
    });

    // FAQs Accordion Data
    // Para añadir o editar preguntas, simplemente modifica este array:
    const faqs = [
      {
        pregunta: "¿Ofrecen un periodo de prueba gratuito?",
        respuesta: "Sí, ofrecemos una prueba de 14 días completamente gratuita en nuestro plan Pro. No necesitas ingresar tarjeta de crédito para comenzar."
      },
      {
        pregunta: "¿Puedo cancelar mi suscripción en cualquier momento?",
        respuesta: "Absolutamente. Entendemos que las necesidades cambian. Puedes cancelar o pausar tu suscripción directamente desde tu panel de control sin preguntas adicionales."
      },
      {
        pregunta: "¿Qué tipo de soporte técnico incluyen?",
        respuesta: "Todos los planes incluyen soporte por correo electrónico. El plan Pro añade soporte por chat prioritario y el plan Enterprise cuenta con un gerente de cuenta dedicado disponible 24/7."
      }
    ];

    const faqContainer = document.getElementById('faq-container');
    if (faqContainer) {
      // Generar el HTML de las FAQs dinámicamente
      faqContainer.innerHTML = faqs.map(faq => \`
        <div class="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white hover:border-slate-300 shadow-sm">
          <button class="faq-btn w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none">
            <span class="font-bold text-lg text-slate-800">\${faq.pregunta}</span>
            <svg class="faq-icon w-5 h-5 text-slate-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="faq-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-slate-50">
            <p class="px-6 pb-5 pt-2 text-slate-600">\${faq.respuesta}</p>
          </div>
        </div>
      \`).join('');

      // Re-vincular eventos a los nuevos botones
      const faqBtns = document.querySelectorAll('.faq-btn');
      faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const content = btn.nextElementSibling;
          const icon = btn.querySelector('.faq-icon');
          
          faqBtns.forEach(otherBtn => {
            if (otherBtn !== btn) {
              otherBtn.nextElementSibling.style.maxHeight = null;
              otherBtn.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            }
          });

          if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.style.transform = 'rotate(180deg)';
          }
        });
      });
    }
  </script>
</body>
</html>
    `;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHTML());
    alert("¡HTML copiado al portapapeles!");
  };

  const handleDownload = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.replace(/\s+/g, '-').toLowerCase()}-landing-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* LEFT PANEL: Controls */}
      <div className="w-full lg:w-[400px] xl:w-[480px] h-1/2 lg:h-full bg-slate-800 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-700 flex flex-col gap-4 bg-slate-800/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Rocket className="text-blue-400" size={24} />
                RapidGenerator
              </h2>
              <p className="text-xs text-slate-400 mt-1">Constructor de Landing Pages con IA</p>
            </div>
          </div>
          
          <button 
            onClick={handleEnhanceWithAI}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/50"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {isGenerating ? 'IA Analizando y Generando...' : 'Mejorar con IA ✨'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div className="space-y-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Key size={16} /> IA Enhancer Config
            </h3>
            {import.meta.env.VITE_GEMINI_API_KEY ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle size={14} />
                Conectado de forma segura vía Variables de Entorno.
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Pega tu API Key de Gemini aquí..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-purple-200"
                />
                <p className="text-[10px] text-slate-500 mt-1">Tu clave no se guarda, se usa localmente. Gemini 2.5 Flash soporta análisis de imágenes.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-sm font-semibold text-pink-400 uppercase tracking-wider flex items-center gap-2">
              <ImagePlus size={16} /> Multimedia & Visión IA
            </h3>
            
            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Logotipo de la Empresa</label>
              <div className="flex items-center gap-4">
                {logoBase64 ? (
                  <div className="relative w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center border border-slate-600">
                    <img src={logoBase64} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button onClick={() => setLogoBase64(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg hover:border-pink-500 hover:text-pink-500 transition-colors cursor-pointer text-slate-500">
                    <Upload size={16} className="mb-1" />
                    <span className="text-[9px] font-bold">Subir</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}
                <p className="text-[10px] text-slate-500 flex-1">El logo se mostrará en la barra de navegación en lugar del icono predeterminado.</p>
              </div>

              {/* AI Logo Generator UI */}
              <div className="pt-4 border-t border-slate-700/50 mt-4">
                <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-2">
                  <Wand2 size={12} className="text-indigo-400" />
                  ¿No tienes logo? Genéralo con IA
                </label>
                <div className="flex gap-2">
                  <select 
                    value={logoStyle}
                    onChange={(e) => setLogoStyle(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-300"
                  >
                    <option value="shapes">Abstracto / Geométrico</option>
                    <option value="bottts">Robot / Tecnológico</option>
                    <option value="initials">Corporativo (Iniciales)</option>
                    <option value="rings">Retro / Anillos</option>
                    <option value="fun-emoji">Divertido / Emoji</option>
                  </select>
                  <button 
                    onClick={handleGenerateLogo}
                    disabled={isGeneratingLogo}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    {isGeneratingLogo ? <Loader2 size={12} className="animate-spin" /> : 'Generar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Images Upload */}
            <div className="pt-2 border-t border-slate-700/50">
              <label className="block text-xs font-medium text-slate-400 mb-2">Imágenes del Producto/Servicio</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {productImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-600 group">
                    <img src={img.url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg hover:border-pink-500 hover:text-pink-500 transition-colors cursor-pointer text-slate-500 bg-slate-800/50">
                  <ImageIcon size={20} className="mb-1" />
                  <span className="text-[9px] font-bold text-center px-1">Añadir<br/>Fotos</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <p className="text-[10px] text-slate-500">Sube fotos. La IA las "mirará", entenderá tu producto, y creará una sección exclusiva de Galería en la Landing Page describiendo lo que ve.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Settings size={16} /> Contenido Principal
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nombre de la Empresa / Producto</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Propuesta de Valor (Base)</label>
              <textarea 
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-16"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Público Objetivo</label>
              <input 
                type="text" 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Llamado a la Acción (CTA)</label>
              <input 
                type="text" 
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette size={16} /> Estética y Estructura
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-3">Paleta de Colores</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'blue', label: 'Azul Profesional', bg: 'bg-blue-600' },
                  { id: 'purple', label: 'Púrpura Creativo', bg: 'bg-purple-600' },
                  { id: 'orange', label: 'Naranja Enérgico', bg: 'bg-orange-500' },
                  { id: 'gray', label: 'Gris Minimalista', bg: 'bg-slate-600' }
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setColorPalette(c.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${colorPalette === c.id ? 'border-blue-500 bg-slate-700/50' : 'border-slate-700 hover:border-slate-500'}`}
                  >
                    <span className={`w-4 h-4 rounded-full ${c.bg}`}></span>
                    <span className="text-xs">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-800/80 backdrop-blur mt-auto">
          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Copy size={16} /> Copiar HTML
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/50"
            >
              <Download size={16} /> Descargar
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="flex-1 h-1/2 lg:h-full bg-slate-950 overflow-hidden flex flex-col relative">
        <div className="absolute top-4 right-4 bg-slate-800 text-xs px-3 py-1.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 z-50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Vista Previa Activa
        </div>
        
        <div className="flex-1 w-full h-full p-4 lg:p-8 overflow-hidden bg-slate-900">
           <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col transition-all">
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 bg-white text-slate-400 text-xs px-3 py-1 rounded-md border border-slate-200 flex-1 flex items-center gap-2">
                   <Lock size={10} /> {businessName.replace(/\s+/g, '').toLowerCase()}.com
                </div>
              </div>
              <iframe 
                srcDoc={generateHTML()} 
                title="Preview"
                className={`w-full flex-1 bg-white transition-opacity duration-500 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
              />
           </div>
        </div>
      </div>
      
    </div>
  );
}

const Lock = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
