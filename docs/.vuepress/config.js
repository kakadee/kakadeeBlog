module.exports = {
    title: 'My VuePress',
    description: '种一棵树最好的时间是十年前，其次就是现在。',
    base:'/kakadeeBlog/',
    repo:'https://github.com/kakadee/kakadeeBlog',
    markdown: {
      lineNumbers: true // 代码行数
    },
    themeConfig: {
      // 添加导航栏
      nav: [
        { text: 'vue', link: '/' },
        { text: 'css', link: '/blog/' },
        { text: 'js', link: '/zhihu/' },
        {
          text: 'github',
          // 这里是下拉列表展现形式。
          items: [
            { text: 'focus-outside', link: 'https://github.com/txs1992/focus-outside' },
            { text: 'stylus-converter', link: 'https://github.com/txs1992/stylus-converter' }
          ]
        }
      ]
    },
    
}