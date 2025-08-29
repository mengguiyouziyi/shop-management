import { describe, it, expect, beforeEach } from 'vitest';
import { ChangelogService, ChangelogEntry } from '../../services/changelog';

describe('ChangelogService', () => {
  let changelogService: ChangelogService;

  beforeEach(() => {
    changelogService = ChangelogService.getInstance();
  });

  it('should get instance', () => {
    expect(changelogService).toBeDefined();
    const anotherInstance = ChangelogService.getInstance();
    expect(anotherInstance).toBe(changelogService);
  });

  it('should get changelog', () => {
    const changelog = changelogService.getChangelog();
    expect(changelog).toBeDefined();
    expect(Array.isArray(changelog)).toBe(true);
    expect(changelog.length).toBeGreaterThanOrEqual(3); // 至少有3个默认条目
  });

  it('should get changelog by version', () => {
    const changelog = changelogService.getChangelogByVersion('v1.0.0');
    expect(changelog).toBeDefined();
    expect(Array.isArray(changelog)).toBe(true);
    expect(changelog.length).toBeGreaterThanOrEqual(3);
    expect(changelog.every(entry => entry.version === 'v1.0.0')).toBe(true);
  });

  it('should add new changelog entry', () => {
    const newEntry = {
      version: 'v1.0.1',
      date: '2025-08-30',
      title: '新增功能',
      description: '添加了新功能',
      category: 'feature' as const,
      author: '开发者'
    };

    const addedEntry = changelogService.addChangelogEntry(newEntry);
    expect(addedEntry).toBeDefined();
    expect(addedEntry.id).toBeDefined();
    expect(addedEntry.version).toBe(newEntry.version);
    expect(addedEntry.title).toBe(newEntry.title);

    // 验证新条目已添加到日志中
    const changelog = changelogService.getChangelog();
    const foundEntry = changelog.find(entry => entry.id === addedEntry.id);
    expect(foundEntry).toBeDefined();
    expect(foundEntry?.version).toBe(newEntry.version);
  });

  it('should get changelog by category', () => {
    const featureEntries = changelogService.getChangelogByCategory('feature');
    expect(featureEntries).toBeDefined();
    expect(Array.isArray(featureEntries)).toBe(true);
    expect(featureEntries.length).toBeGreaterThanOrEqual(3);
    expect(featureEntries.every(entry => entry.category === 'feature')).toBe(true);
  });

  it('should get versions', () => {
    const versions = changelogService.getVersions();
    expect(versions).toBeDefined();
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.includes('v1.0.0')).toBe(true);
  });

  it('should sort changelog by date', () => {
    // 添加一个更早日期的条目
    const oldEntry = {
      version: 'v0.9.0',
      date: '2025-01-01',
      title: '早期功能',
      description: '早期功能描述',
      category: 'feature' as const
    };

    changelogService.addChangelogEntry(oldEntry);

    const changelog = changelogService.getChangelog();
    expect(changelog).toBeDefined();
    expect(changelog.length).toBeGreaterThanOrEqual(4);

    // 验证排序是否正确（最新的在前）
    const firstEntryDate = new Date(changelog[0].date).getTime();
    const lastEntryDate = new Date(changelog[changelog.length - 1].date).getTime();
    expect(firstEntryDate).toBeGreaterThanOrEqual(lastEntryDate);
  });
});