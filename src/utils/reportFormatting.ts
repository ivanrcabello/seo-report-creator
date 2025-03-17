
export const formatReportContent = (content: string, forPrint: boolean = false) => {
  if (!content) return '';
  
  // Basic or print-specific formatting
  return content
    .replace(/^#{2}\s+(.*?)$/gm, forPrint ? 
      '<h2 class="text-2xl font-bold text-blue-600 mt-6 mb-4">$1</h2>' : 
      '<h2 id="$1" class="text-2xl font-bold text-blue-600 mt-6 mb-4 scroll-mt-20">$1</h2>')
    .replace(/^#{3}\s+(.*?)$/gm, '<h3 class="text-xl font-semibold text-purple-600 mt-5 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\n\n/g, '</p><p class="my-3">')
    .replace(/\n- (.*?)(?=\n|$)/g, '</p><ul class="list-disc pl-6 my-4"><li>$1</li></ul><p>')
    .replace(/<\/ul><p><\/p><ul class="list-disc pl-6 my-4">/g, '')
    .replace(/^<\/p>/, '')
    .replace(/<p>$/, '');
};

export const extractSections = (content: string) => {
  if (!content) return [];
  
  const sectionRegex = /^#{2}\s+(.*)$/gm;
  const matches = [...content.matchAll(sectionRegex)];
  
  // Create sections array with title and ID (add keywords section if not present)
  const sections = matches.map(match => ({
    title: match[1],
    id: match[1].toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Normalize accents
  }));
  
  return sections;
};
