import React, { useState, useEffect } from 'react';
import { Tabs, Timeline, Tag, Card } from 'tdesign-react';
import { ChangelogService, ChangelogEntry } from '../../services/changelog';

export default function ChangelogPage() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const changelogService = ChangelogService.getInstance();

  useEffect(() => {
    loadChangelog();
  }, []);

  const loadChangelog = () => {
    const allChangelog = changelogService.getChangelog();
    const allVersions = changelogService.getVersions();
    
    setChangelog(allChangelog);
    setVersions(allVersions);
  };

  const getCategoryLabel = (category: ChangelogEntry['category']) => {
    switch (category) {
      case 'feature': return '新功能';
      case 'improvement': return '改进';
      case 'bugfix': return '修复';
      case 'security': return '安全';
      default: return category;
    }
  };

  const getCategoryTheme = (category: ChangelogEntry['category']) => {
    switch (category) {
      case 'feature': return 'success';
      case 'improvement': return 'warning';
      case 'bugfix': return 'danger';
      case 'security': return 'primary';
      default: return 'default';
    }
  };

  const filteredChangelog = changelog.filter(entry => {
    const versionMatch = selectedVersion === 'all' || entry.version === selectedVersion;
    const categoryMatch = selectedCategory === 'all' || entry.category === selectedCategory;
    return versionMatch && categoryMatch;
  });

  // 按版本分组
  const groupedChangelog: Record<string, ChangelogEntry[]> = {};
  filteredChangelog.forEach(entry => {
    if (!groupedChangelog[entry.version]) {
      groupedChangelog[entry.version] = [];
    }
    groupedChangelog[entry.version].push(entry);
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        系统更新日志
      </h1>
      
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '10px' }}>版本:</label>
            <select 
              value={selectedVersion} 
              onChange={(e) => setSelectedVersion(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="all">全部版本</option>
              {versions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ marginRight: '10px' }}>类型:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="all">全部类型</option>
              <option value="feature">新功能</option>
              <option value="improvement">改进</option>
              <option value="bugfix">修复</option>
              <option value="security">安全</option>
            </select>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all">
        <Tabs.TabPanel value="all" label="全部更新">
          {Object.keys(groupedChangelog).map(version => (
            <div key={version} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>
                版本 {version}
              </h2>
              <Timeline>
                {groupedChangelog[version].map(entry => (
                  <Timeline.Item key={entry.id} label={entry.date}>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>{entry.title}</h3>
                        <Tag theme={getCategoryTheme(entry.category)} variant="light">
                          {getCategoryLabel(entry.category)}
                        </Tag>
                      </div>
                      <p style={{ margin: '5px 0', color: '#666' }}>{entry.description}</p>
                      {entry.author && (
                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                          作者: {entry.author}
                        </p>
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          ))}
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="feature" label="新功能">
          <Timeline>
            {changelog
              .filter(entry => entry.category === 'feature')
              .map(entry => (
                <Timeline.Item key={entry.id} label={`${entry.version} - ${entry.date}`}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{entry.title}</h3>
                      <Tag theme={getCategoryTheme(entry.category)} variant="light">
                        {getCategoryLabel(entry.category)}
                      </Tag>
                    </div>
                    <p style={{ margin: '5px 0', color: '#666' }}>{entry.description}</p>
                    {entry.author && (
                      <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                        作者: {entry.author}
                      </p>
                    )}
                  </div>
                </Timeline.Item>
              ))
            }
          </Timeline>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="improvement" label="功能改进">
          <Timeline>
            {changelog
              .filter(entry => entry.category === 'improvement')
              .map(entry => (
                <Timeline.Item key={entry.id} label={`${entry.version} - ${entry.date}`}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{entry.title}</h3>
                      <Tag theme={getCategoryTheme(entry.category)} variant="light">
                        {getCategoryLabel(entry.category)}
                      </Tag>
                    </div>
                    <p style={{ margin: '5px 0', color: '#666' }}>{entry.description}</p>
                    {entry.author && (
                      <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                        作者: {entry.author}
                      </p>
                    )}
                  </div>
                </Timeline.Item>
              ))
            }
          </Timeline>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="bugfix" label="问题修复">
          <Timeline>
            {changelog
              .filter(entry => entry.category === 'bugfix')
              .map(entry => (
                <Timeline.Item key={entry.id} label={`${entry.version} - ${entry.date}`}>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{entry.title}</h3>
                      <Tag theme={getCategoryTheme(entry.category)} variant="light">
                        {getCategoryLabel(entry.category)}
                      </Tag>
                    </div>
                    <p style={{ margin: '5px 0', color: '#666' }}>{entry.description}</p>
                    {entry.author && (
                      <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                        作者: {entry.author}
                      </p>
                    )}
                  </div>
                </Timeline.Item>
              ))
            }
          </Timeline>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
}