import { normalizeHtmlContent } from '../normalizeHtmlContent';


describe('normalizeHtmlContent', () => {
  it('should normalize html content with head tags', () => {
    const htmlWithHead = '<html><head></head><body></body></html>';
    expect(normalizeHtmlContent(htmlWithHead)).toEqual('<html><body></body></html>');
  });

  it('should normalize html content with multiple script tags', () => {
    const htmlWithMultipleScripts = '<html><script></script><head><script></script></head><body></body></html>';
    expect(normalizeHtmlContent(htmlWithMultipleScripts)).toEqual('<html><body></body></html>');
  });

  it('should normalize html content with multiple style tags', () => {
    const htmlWithMultipleStyles = '<html><style></style><head><style></style></head><body></body></html>';
    expect(normalizeHtmlContent(htmlWithMultipleStyles)).toEqual('<html><body></body></html>');
  });

  it('should normalize html content with multiple link tags', () => {
    const htmlWithMultipleLinks = '<html><head><link></link></head><body><link></link></body></html>';
    expect(normalizeHtmlContent(htmlWithMultipleLinks)).toEqual('<html><body></body></html>');
  });

  it('should normalize html content with multiple iframe tags', () => {
    const htmlWithMultipleIframe = '<html><body><iframe></iframe><iframe></iframe></body></html>';
    expect(normalizeHtmlContent(htmlWithMultipleIframe)).toEqual('<html><body></body></html>');
  });

  it('should normalize html content with multiple svg tags', () => {
    const htmlWithMultipleSvg = '<html><body><svg></svg><svg></svg></body></html>';
    expect(normalizeHtmlContent(htmlWithMultipleSvg)).toEqual('<html><body></body></html>');
  });

  it('should not remove div tags', () => {
    const htmlWithMultiplDiv = '<html><body><div class="foo"></div></body></html>';
    expect(normalizeHtmlContent(htmlWithMultiplDiv)).toEqual(htmlWithMultiplDiv);
  });

  it('should normalize wrong body', () => {
    const htmlWithMultiplDiv = '<body><div class="foo"></div></body>';
    expect(normalizeHtmlContent(htmlWithMultiplDiv)).toEqual('<html><body><div class="foo"></div></body></html>');
  });
});
