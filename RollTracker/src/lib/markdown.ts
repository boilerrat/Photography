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
 * Converts a RollDoc to a roll entry for the consolidated file
 */
export function toRollEntry(doc: RollDoc): string {
  const { meta, shots } = doc;
  
  let entry = `# Roll: ${meta.rollId || 'Untitled'}\n`;
  entry += `**Date:** ${meta.date || 'Not specified'}\n`;
  entry += `**Camera:** ${meta.camera || 'Not specified'}\n`;
  entry += `**Lens:** ${meta.lens || 'Not specified'}\n`;
  entry += `**Film Stock:** ${meta.filmStock || 'Not specified'}\n`;
  entry += `**Rated ISO:** ${meta.ratedISO || 'Not specified'}\n`;
  entry += `**Meter ISO:** ${meta.meterISO || 'Not specified'}\n`;
  entry += `**Exposures:** ${meta.exposures || 36}\n\n`;
  
  if (shots.length > 0) {
    entry += `## Shots (${shots.length})\n\n`;
    
    shots.forEach((shot) => {
      entry += `### Shot ${shot.shotNumber}\n`;
      
      if (shot.date) {
        entry += `- **Date:** ${shot.date}\n`;
      }
      if (shot.filmSpeed) {
        entry += `- **Film Speed:** ${shot.filmSpeed}\n`;
      }
      if (shot.aperture) {
        entry += `- **Aperture:** ${shot.aperture}\n`;
      }
      if (shot.exposureAdjustments) {
        entry += `- **Exposure Adjustments:** ${shot.exposureAdjustments}\n`;
      }
      if (shot.notes) {
        entry += `- **Notes:** ${shot.notes}\n`;
      }
      if (shot.imageUrl) {
        entry += `- **Image:** [View Image](${shot.imageUrl})\n`;
      }
      
      entry += '\n';
    });
  } else {
    entry += `## Shots (0)\n\n*No shots logged yet*\n\n`;
  }
  
  entry += '---\n\n';
  
  return entry;
}

/**
 * Appends a roll entry to existing content
 */
export function appendRollToContent(existingContent: string, newRoll: RollDoc): string {
  const rollEntry = toRollEntry(newRoll);
  
  // If content is empty, start with a header
  if (!existingContent.trim()) {
    return `# Film Shot Log\n\n*Generated on ${new Date().toLocaleDateString()}*\n\n${rollEntry}`;
  }
  
  // Append the new roll entry
  return existingContent + rollEntry;
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
  const shotRegex = /^## Shot (\d+)$/gm;
  const shotSections = body.split(shotRegex);
  
  // Process sections in pairs: [header, content, header, content, ...]
  for (let i = 1; i < shotSections.length; i += 2) {
    const shotNumber = parseInt(shotSections[i], 10);
    const section = shotSections[i + 1];
    
    if (isNaN(shotNumber) || !section) continue;
    
    const lines = section.trim().split('\n');
    
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
  }

  return { meta, shots };
}
