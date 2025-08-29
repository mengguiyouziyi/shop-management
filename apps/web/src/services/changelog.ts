export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'bugfix' | 'security';
  author?: string;
}

export class ChangelogService {
  private static instance: ChangelogService;
  private changelog: ChangelogEntry[];

  private constructor() {
    // 初始化默认的更新日志
    this.changelog = [
      {
        id: '1',
        version: 'v1.0.0',
        date: '2025-08-29',
        title: '多店铺管理系统上线',
        description: '发布完整的多店铺管理系统，支持总部-分店管理模式、资源共享和跨店铺报表分析。',
        category: 'feature',
        author: '系统管理员'
      },
      {
        id: '2',
        version: 'v1.0.0',
        date: '2025-08-29',
        title: '系统帮助文档',
        description: '添加系统帮助文档，详细介绍各个功能模块的使用方法。',
        category: 'feature',
        author: '系统管理员'
      },
      {
        id: '3',
        version: 'v1.0.0',
        date: '2025-08-29',
        title: '系统设置功能',
        description: '实现系统设置功能，支持配置公司信息、货币、打印、税收、库存、会员和多店铺相关参数。',
        category: 'feature',
        author: '系统管理员'
      }
    ];
  }

  public static getInstance(): ChangelogService {
    if (!ChangelogService.instance) {
      ChangelogService.instance = new ChangelogService();
    }
    return ChangelogService.instance;
  }

  // 获取所有更新日志条目
  getChangelog(): ChangelogEntry[] {
    return [...this.changelog].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  // 根据版本获取更新日志
  getChangelogByVersion(version: string): ChangelogEntry[] {
    return this.changelog
      .filter(entry => entry.version === version)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // 添加新的更新日志条目
  addChangelogEntry(entry: Omit<ChangelogEntry, 'id'>): ChangelogEntry {
    const newEntry: ChangelogEntry = {
      ...entry,
      id: `changelog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.changelog.push(newEntry);
    return newEntry;
  }

  // 根据类别获取更新日志
  getChangelogByCategory(category: ChangelogEntry['category']): ChangelogEntry[] {
    return this.changelog
      .filter(entry => entry.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // 获取所有版本
  getVersions(): string[] {
    const versions = new Set(this.changelog.map(entry => entry.version));
    return Array.from(versions).sort((a, b) => {
      // 简单的版本排序，实际项目中可能需要更复杂的版本比较逻辑
      return b.localeCompare(a);
    });
  }
}