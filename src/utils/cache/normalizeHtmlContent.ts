import cheerio from 'cheerio';


export const normalizeHtmlContent = (response: string) => {
  const dom = cheerio.load(response);

  dom('head').each((_, script) => {
    dom(script).remove();
  });

  dom('script').each((_, script) => {
    dom(script).remove();
  });

  dom('style').each((_, style) => {
    dom(style).remove();
  });

  dom('link').each((_, link) => {
    dom(link).remove();
  });

  dom('iframe').each((_, iframe) => {
    dom(iframe).remove();
  });

  dom('svg').each((_, svg) => {
    dom(svg).remove();
  });

  return dom.html();
};
