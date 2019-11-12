module.exports = {
    title: 'kakadee',
    description: '种一棵树最好的时间是十年前，其次就是现在。',
    base:'/kakadeeBlog/',
    repo:'https://github.com/kakadee/kakadeeBlog',
    markdown: {
      lineNumbers: true // 代码行数
    },
    themeConfig: {
      repo: 'kakadee/kakadeeBlog',
      lastUpdated: '最后更新时间', // 最后更新时间
      docsDir: 'docs',
      // 添加导航栏
      nav: [
        { text: 'iOS', link: '/iOS/' },
        { text: 'Project', link: '/Project/' },
        { text: 'Resume', link: '/Resume/' },
        { text: 'Essay', link: '/Essay/' }
      ],
      sidebarDepth : 3,
      sidebar: {
        '/iOS/': [
          '/iOS/',
          {
            title: 'iOS基础',
            children: [
              '/iOS/iOSBasic/Block详解',
              '/iOS/iOSBasic/KVCKVO详解',
              '/iOS/iOSBasic/DesignatedInitializer',
              '/iOS/iOSBasic/Category本质',
            ]
          },
          {
            title: 'Core Animation',
            children: [
              '/iOS/CoreAnimation/CoreAnimation路径规划',
              '/iOS/CoreAnimation/0-视图转场动画',
              '/iOS/CoreAnimation/1-控制器转场动画',
              '/iOS/CoreAnimation/CATransaction',
            ]
          }
        ]
      }
    }
}
