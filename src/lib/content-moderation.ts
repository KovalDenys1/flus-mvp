// Content moderation utilities for filtering inappropriate content

// List of inappropriate words in Norwegian and English
const INAPPROPRIATE_WORDS = [
  // English inappropriate words
  'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock',
  'nigger', 'faggot', 'retard', 'spastic', 'crap', 'bullshit', 'piss', 'tits', 'boobs',
  'whore', 'slut', 'rape', 'kill', 'murder', 'suicide', 'drugs', 'cocaine', 'heroin',
  'meth', 'weed', 'porn', 'sex', 'naked', 'nude',

  // Norwegian inappropriate words
  'faen', 'helvete', 'jævla', 'fitte', 'kuk', 'pikk', 'røvhull', 'hore', 'luder',
  'neger', 'homse', 'svenske', 'jøde', 'jøssing', 'dritt', 'skit', 'piss', 'tiss',
  'drap', 'mord', 'selvmord', 'narkotika', 'kokain', 'heroin', 'hasj', 'pornografi',
  'sex', 'naken', 'nøgen', 'voldtekt', 'drepe', 'myrde',

  // Additional variations and common misspellings
  'fuk', 'fck', 'sh1t', 'b1tch', 'c0ck', 'd1ck', 'puss1', 't1ts', 'b00bs',
  'fæn', 'jævel', 'ræva', 'röv', 'kuken', 'pikken', 'røven', 'røvhullet'
];

// Function to check if text contains inappropriate content
export function containsInappropriateContent(text: string): boolean {
  if (!text) return false;

  const lowerText = text.toLowerCase();

  // Check for exact word matches
  for (const word of INAPPROPRIATE_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return true;
    }
  }

  // Check for common patterns (leetspeak, spacing, etc.)
  const patterns = [
    /\bf+u+c+k+\b/i,  // f*** patterns
    /\bs+h+i+t+\b/i,  // s*** patterns
    /\ba+s+s+h+o+l+e*\b/i,  // ass*** patterns
    /\bb+i+t+c+h+\b/i,  // b**** patterns
    /\bc+u+n+t+\b/i,   // c*** patterns
  ];

  for (const pattern of patterns) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }

  return false;
}

// Function to censor inappropriate words in text
export function censorInappropriateContent(text: string): string {
  if (!text) return text;

  let censoredText = text;

  // Replace inappropriate words with asterisks
  for (const word of INAPPROPRIATE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    censoredText = censoredText.replace(regex, '*'.repeat(word.length));
  }

  return censoredText;
}

// Function to validate content and return result
export interface ContentValidationResult {
  isValid: boolean;
  censoredText?: string;
  violations: string[];
}

export function validateContent(text: string): ContentValidationResult {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push(`Inneholder upassende ord: "${word}"`);
    }
  }

  // Check for patterns
  const patterns = [
    { pattern: /\bf+u+c+k+\b/i, description: 'Uanstendige uttrykk (f*** mønster)' },
    { pattern: /\bs+h+i+t+\b/i, description: 'Uanstendige uttrykk (s*** mønster)' },
    { pattern: /\ba+s+s+h+o+l+e*\b/i, description: 'Uanstendige uttrykk (ass*** mønster)' },
  ];

  for (const { pattern, description } of patterns) {
    if (pattern.test(lowerText)) {
      violations.push(description);
    }
  }

  const isValid = violations.length === 0;

  return {
    isValid,
    censoredText: isValid ? undefined : censorInappropriateContent(text),
    violations
  };
}