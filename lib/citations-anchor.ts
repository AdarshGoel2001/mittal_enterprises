export function anchorForCitation(doi: string): string {
  return 'cite-' + doi.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
