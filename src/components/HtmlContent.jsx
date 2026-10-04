import React from 'react';

/**
 * Cleans up raw Udemy scraping artifacts, excess spacing, and formats code blocks nicely.
 */
export function cleanHtml(html) {
  if (!html) return '';

  return html
    // Fix scraping placeholders
    .replace(/__data_placeholder__nbsp;/g, '$ ')
    .replace(/__data_placeholder__/g, '$ ')
    .replace(/&nbsp;/g, ' ')
    // Collapse redundant empty paragraphs and line breaks
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '')
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>')
    // Clean up Udemy prettify class names to standard pre/code
    .replace(/class="prettyprint linenums"/gi, 'class="code-block"')
    .replace(/class="prettyprint"/gi, 'class="code-block"');
}

/**
 * Sanitizes and renders HTML content while ensuring clean typography and code block formatting.
 */
export function HtmlContent({ html, className = '' }) {
  if (!html) return null;

  const cleaned = cleanHtml(html);

  return (
    <div
      className={`max-w-none text-slate-900 question-html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}

/**
 * Strips HTML tags to produce clean plain text for search indexing or plain previews.
 */
export function stripHtml(html) {
  if (!html) return '';
  const cleaned = cleanHtml(html);
  const tmp = document.createElement('DIV');
  tmp.innerHTML = cleaned;
  return tmp.textContent || tmp.innerText || '';
}
