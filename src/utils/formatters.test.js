import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatDeadline,
  getDeadlineStatus,
  formatRelativeTime,
  renderSimpleMarkdown,
} from './formatters';

describe('formatters utility functions', () => {
  describe('formatFileSize', () => {
    it('returns "0 B" for 0 or falsy bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(null)).toBe('0 B');
      expect(formatFileSize(undefined)).toBe('0 B');
    });

    it('formats bytes, KB, and MB accurately', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
  });

  describe('formatDeadline', () => {
    it('returns null for empty or invalid date strings', () => {
      expect(formatDeadline('')).toBeNull();
      expect(formatDeadline(null)).toBeNull();
      expect(formatDeadline('not-a-valid-date')).toBeNull();
    });

    it('formats valid ISO date strings', () => {
      const formatted = formatDeadline('2026-10-25T15:30:00.000Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      expect(formatted).toMatch(/2026/);
    });
  });

  describe('getDeadlineStatus', () => {
    it('returns null if dateString is missing or status is completed/cancel', () => {
      expect(getDeadlineStatus('', 'pending')).toBeNull();
      expect(getDeadlineStatus('2026-10-25T15:30:00', 'completed')).toBeNull();
      expect(getDeadlineStatus('2026-10-25T15:30:00', 'cancel')).toBeNull();
    });

    it('returns overdue status for past deadlines', () => {
      const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const status = getDeadlineStatus(pastDate, 'pending');
      expect(status).not.toBeNull();
      expect(status?.type).toBe('overdue');
      expect(status?.label).toMatch(/overdue/i);
    });

    it('returns due-today for deadline within 24 hours', () => {
      const soonDate = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
      const status = getDeadlineStatus(soonDate, 'pending');
      expect(status).not.toBeNull();
      expect(status?.type).toBe('due-today');
    });

    it('returns due-soon for deadline between 24 and 72 hours', () => {
      const soonDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      const status = getDeadlineStatus(soonDate, 'pending');
      expect(status).not.toBeNull();
      expect(status?.type).toBe('due-soon');
    });

    it('returns normal for deadline farther in the future', () => {
      const futureDate = new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString();
      const status = getDeadlineStatus(futureDate, 'pending');
      expect(status).not.toBeNull();
      expect(status?.type).toBe('normal');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns empty string for falsy or invalid timestamp', () => {
      expect(formatRelativeTime(null)).toBe('');
      expect(formatRelativeTime('')).toBe('');
      expect(formatRelativeTime('invalid-time')).toBe('');
    });

    it('returns "Just now" for recent timestamp', () => {
      expect(formatRelativeTime(Date.now() - 10000)).toBe('Just now');
    });

    it('returns minutes ago for timestamp within an hour', () => {
      expect(formatRelativeTime(Date.now() - 5 * 60 * 1000)).toBe('5m ago');
    });

    it('returns hours ago for timestamp within 24 hours', () => {
      expect(formatRelativeTime(Date.now() - 3 * 60 * 60 * 1000)).toBe('3h ago');
    });

    it('returns days ago for timestamp within a week', () => {
      expect(formatRelativeTime(Date.now() - 2 * 24 * 60 * 60 * 1000)).toBe('2d ago');
    });
  });

  describe('renderSimpleMarkdown', () => {
    it('returns empty string for empty input', () => {
      expect(renderSimpleMarkdown('')).toBe('');
      expect(renderSimpleMarkdown(null)).toBe('');
    });

    it('escapes html entities', () => {
      const result = renderSimpleMarkdown('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('converts bold and italic syntax to HTML', () => {
      const result = renderSimpleMarkdown('This is **bold** and *italic*');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<em>italic</em>');
    });

    it('converts inline code and code blocks', () => {
      const inlineResult = renderSimpleMarkdown('Use `const x = 1` here');
      expect(inlineResult).toContain('<code class="rich-code">const x = 1</code>');

      const blockResult = renderSimpleMarkdown('```\nconsole.log(1);\n```');
      expect(blockResult).toContain('<pre class="rich-pre"><code>');
    });

    it('converts markdown links and list items', () => {
      const linkResult = renderSimpleMarkdown('[Google](https://google.com)');
      expect(linkResult).toContain('<a href="https://google.com"');
      expect(linkResult).toContain('Google</a>');

      const listResult = renderSimpleMarkdown('- Item one');
      expect(listResult).toContain('<li class="rich-li">Item one</li>');
    });
  });
});
