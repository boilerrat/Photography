import matter from 'gray-matter';
import { RollDoc, RollMeta, Shot } from '@/types';

/**
 * Converts a RollDoc to Markdown format with YAML front matter
 */
export function toMarkdown(doc: RollDoc): string {
  const { meta, shots } = doc;
  
  // Create YAML front matter
  const frontMatter = {
    rollId: meta.rollId,
    date: meta.date,
    camera: meta.camera,
    lens: meta.lens,
    filmStock: meta.filmStock,
    ratedISO: meta.ratedISO,
    meterISO: meta.meterISO,
    exposures: meta.exposures,
  };

  // Create shots content
  let shotsContent = '# Shots\n\n';
  
  shots.forEach((shot) => {
    shotsContent += `## Shot ${shot.shotNumber}\n`;
    
    if (shot.date) {
      shotsContent += `Date: ${shot.date}\n`;
    }
    if (shot.filmSpeed) {
      shotsContent += `Film Speed: ${shot.filmSpeed}\n`;
    }
    if (shot.aperture) {
      shotsContent += `Aperture: ${shot.aperture}\n`;
    }
    if (shot.exposureAdjustments) {
      shotsContent += `Exposure Adjustments: ${shot.exposureAdjustments}\n`;
    }
    if (shot.notes) {
      shotsContent += `Notes: ${shot.notes}\n`;
    }
    if (shot.imageUrl) {
      shotsContent += `Image: ${shot.imageUrl}\n`;
    }
    
    shotsContent += '\n';
  });

  return matter.stringify(shotsContent, frontMatter);
}

/**
 * Parses Markdown content to extract RollDoc
 */
export function parseMarkdown(content: string): RollDoc {
  const { data, content: body } = matter(content);
  
  // Extract metadata
  const meta: RollMeta = {
    rollId: data.rollId || '',
    date: data.date || '',
    camera: data.camera || '',
    lens: data.lens || '',
    filmStock: data.filmStock || '',
    ratedISO: data.ratedISO || '',
    meterISO: data.meterISO || '',
    exposures: data.exposures || 36,
  };

  // Parse shots from markdown body
  const shots: Shot[] = [];
  const shotSections = body.split(/^## Shot \d+$/gm);
  
  shotSections.forEach((section, index) => {
    if (index === 0) return; // Skip the first section (before any shots)
    
    const lines = section.trim().split('\n');
    const shotNumber = index; // Shot numbers start from 1
    
    const shot: Shot = { shotNumber };
    
    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      switch (key.trim()) {
        case 'Date':
          shot.date = value;
          break;
        case 'Film Speed':
          shot.filmSpeed = value;
          break;
        case 'Aperture':
          shot.aperture = value;
          break;
        case 'Exposure Adjustments':
          shot.exposureAdjustments = value;
          break;
        case 'Notes':
          shot.notes = value;
          break;
        case 'Image':
          shot.imageUrl = value;
          break;
      }
    });
    
    shots.push(shot);
  });

  return { meta, shots };
}
