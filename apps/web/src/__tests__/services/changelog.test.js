"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var changelog_1 = require("../../services/changelog");
(0, vitest_1.describe)('ChangelogService', function () {
    var changelogService;
    (0, vitest_1.beforeEach)(function () {
        changelogService = changelog_1.ChangelogService.getInstance();
    });
    (0, vitest_1.it)('should get instance', function () {
        (0, vitest_1.expect)(changelogService).toBeDefined();
        var anotherInstance = changelog_1.ChangelogService.getInstance();
        (0, vitest_1.expect)(anotherInstance).toBe(changelogService);
    });
    (0, vitest_1.it)('should get changelog', function () {
        var changelog = changelogService.getChangelog();
        (0, vitest_1.expect)(changelog).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(changelog)).toBe(true);
        (0, vitest_1.expect)(changelog.length).toBeGreaterThanOrEqual(3); // 至少有3个默认条目
    });
    (0, vitest_1.it)('should get changelog by version', function () {
        var changelog = changelogService.getChangelogByVersion('v1.0.0');
        (0, vitest_1.expect)(changelog).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(changelog)).toBe(true);
        (0, vitest_1.expect)(changelog.length).toBeGreaterThanOrEqual(3);
        (0, vitest_1.expect)(changelog.every(function (entry) { return entry.version === 'v1.0.0'; })).toBe(true);
    });
    (0, vitest_1.it)('should add new changelog entry', function () {
        var newEntry = {
            version: 'v1.0.1',
            date: '2025-08-30',
            title: '新增功能',
            description: '添加了新功能',
            category: 'feature',
            author: '开发者'
        };
        var addedEntry = changelogService.addChangelogEntry(newEntry);
        (0, vitest_1.expect)(addedEntry).toBeDefined();
        (0, vitest_1.expect)(addedEntry.id).toBeDefined();
        (0, vitest_1.expect)(addedEntry.version).toBe(newEntry.version);
        (0, vitest_1.expect)(addedEntry.title).toBe(newEntry.title);
        // 验证新条目已添加到日志中
        var changelog = changelogService.getChangelog();
        var foundEntry = changelog.find(function (entry) { return entry.id === addedEntry.id; });
        (0, vitest_1.expect)(foundEntry).toBeDefined();
        (0, vitest_1.expect)(foundEntry === null || foundEntry === void 0 ? void 0 : foundEntry.version).toBe(newEntry.version);
    });
    (0, vitest_1.it)('should get changelog by category', function () {
        var featureEntries = changelogService.getChangelogByCategory('feature');
        (0, vitest_1.expect)(featureEntries).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(featureEntries)).toBe(true);
        (0, vitest_1.expect)(featureEntries.length).toBeGreaterThanOrEqual(3);
        (0, vitest_1.expect)(featureEntries.every(function (entry) { return entry.category === 'feature'; })).toBe(true);
    });
    (0, vitest_1.it)('should get versions', function () {
        var versions = changelogService.getVersions();
        (0, vitest_1.expect)(versions).toBeDefined();
        (0, vitest_1.expect)(Array.isArray(versions)).toBe(true);
        (0, vitest_1.expect)(versions.includes('v1.0.0')).toBe(true);
    });
    (0, vitest_1.it)('should sort changelog by date', function () {
        // 添加一个更早日期的条目
        var oldEntry = {
            version: 'v0.9.0',
            date: '2025-01-01',
            title: '早期功能',
            description: '早期功能描述',
            category: 'feature'
        };
        changelogService.addChangelogEntry(oldEntry);
        var changelog = changelogService.getChangelog();
        (0, vitest_1.expect)(changelog).toBeDefined();
        (0, vitest_1.expect)(changelog.length).toBeGreaterThanOrEqual(4);
        // 验证排序是否正确（最新的在前）
        var firstEntryDate = new Date(changelog[0].date).getTime();
        var lastEntryDate = new Date(changelog[changelog.length - 1].date).getTime();
        (0, vitest_1.expect)(firstEntryDate).toBeGreaterThanOrEqual(lastEntryDate);
    });
});
