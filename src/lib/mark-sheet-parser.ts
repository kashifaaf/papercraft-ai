import { MarkSheetData, WeakArea } from './types';

export function parseMarkSheetText(text: string): MarkSheetData[] {
  const subjects = [
    'Physics', 'Chemistry', 'Mathematics', 'Biology',
    'English', 'Hindi', 'History', 'Geography',
    'Economics', 'Political Science', 'Computer Science'
  ];
  
  const results: MarkSheetData[] = [];
  const lines = text.split('\n').map(line => line.trim());
  
  for (const subject of subjects) {
    // Look for patterns like "Physics 78/100" or "Physics: 78 out of 100"
    const patterns = [
      new RegExp(`${subject}[:\\s]*([0-9]+)[/\\s]*([0-9]+)`, 'i'),
      new RegExp(`${subject}[:\\s]*([0-9]+)\\s*out\\s*of\\s*([0-9]+)`, 'i'),
      new RegExp(`${subject}[:\\s]*([0-9]+)\\s*marks?\\s*([0-9]+)`, 'i')
    ];
    
    for (const line of lines) {
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const marks = parseInt(match[1]);
          const maxMarks = parseInt(match[2]);
          const percentage = (marks / maxMarks) * 100;
          
          results.push({
            subject,
            marks,
            maxMarks,
            percentage: Math.round(percentage * 100) / 100
          });
          break;
        }
      }
    }
  }
  
  return results;
}

export function identifyWeakAreas(markSheetData: MarkSheetData[]): WeakArea[] {
  return markSheetData
    .filter(data => data.percentage < 60)
    .map(data => ({
      subject: data.subject,
      percentage: data.percentage
    }))
    .sort((a, b) => a.percentage - b.percentage);
}