export function splitIntoSyllables(word: string) {
  // Use a regular expression to match the following patterns:
  // - A vowel followed by any number of consonants followed by another vowel (e.g. "naive" would be matched as "ai" followed by "ve")
  // - A consonant followed by a vowel followed by any number of consonants (e.g. "stop" would be matched as "s" followed by "to" and "p")
  // - A single vowel that is not followed by any consonants (e.g. "a" in "aardvark")
  // - A chain of consonants without any vowels (e.g. "llm" in "Sillmarrs")
  // - A word that ends with a silent "e" (e.g. "dope" would be matched as "dop" followed by "e")
  // - A word that contains a diphthong (e.g. "bright" would be matched as "br" followed by "ight")
  let syllables = word.match(
    /[aeiouy][^aeiouy]*|[^aeiouy][aeiouy]|[aeiouy]|[^aeiouy]+|[^aeiouy]e$|[aeiouy][aeiouy]/g
  );

  // If the word did not contain any vowels, consider the whole word as a single syllable.
  if (syllables == null) syllables = [word];

  return syllables;
}
