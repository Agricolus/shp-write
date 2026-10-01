import { describe, it, expect } from 'vitest';
import * as extent from '../src/extent';

describe('extent', () => {
  describe('#blank', () => {
    it('creates an ext', () => {
      const ext = extent.blank();
      expect(ext.xmin).toBeDefined();
      expect(ext.ymin).toBeDefined();
      expect(ext.xmax).toBeDefined();
      expect(ext.ymax).toBeDefined();
    });
  });

  describe('#enlarge', () => {
    it('encloses a point', () => {
      const ext = extent.blank();
      extent.enlarge(ext, [0, 0]);
      expect(ext.xmin).toBe(0);
      expect(ext.ymin).toBe(0);
      expect(ext.xmax).toBe(0);
      expect(ext.ymax).toBe(0);
    });
  });

  describe('#enlargeExtent', () => {
    it('encloses an extent', () => {
      const ext = extent.blank();
      const extB = extent.blank();
      extent.enlarge(ext, [0, 0]);
      extent.enlarge(ext, [10, 10]);
      extent.enlargeExtent(extB, ext);
      expect(ext.xmin).toBe(0);
      expect(ext.ymin).toBe(0);
      expect(ext.xmax).toBe(10);
      expect(ext.ymax).toBe(10);
    });
  });
});
