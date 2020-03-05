#!/usr/bin/env node
const cheerio = require('cheerio')
const superagent = require('superagent')
const Table = require('easy-table')
const ProgressBar = require('progress')
const program = require('commander')
const country = process.argv[2]
const url = `https://soccer.hupu.com/${country}/`
// 进度条
const bar = new ProgressBar('进度 [:bar] :percent :info', {
  complete: '️⚽️ ',
  incomplete: ' ',
  total: 20
})
const main = async () => {
  // 1. 开始
  bar.tick(5, {
    info: '开始...'
  })
  // 2. 请求网页
  const html = await superagent.get(url)
  bar.tick(5, {
    info: '请求网页成功'
  })
  // 3. 获取网页内容
  getMatch(html.text)
  bar.tick(5, {
    info: '成功获取比赛信息'
  })
  // 4. 完成
  bar.tick(5, {
    info: '完成'
  })
  console.log('比赛信息如下：' + '\r\n' + t.toString())
}

program
  .command('*')
  .action(() => {
    main()
  })
program.parse(process.argv)

const t = new Table()

function getMatch(html) {
  let $ = cheerio.load(html)
  const matchList = $('.england-match-item .england-match-child-list')
  const time = matchList.find('dt')
  const apponent = matchList.find('.england-match-infor')
  for (let i = 0; i < matchList.length; i++) {
    const matchTime = $(time[i]).text().trim()
    const front = matchTime.slice(0, 5)
    const end = matchTime.slice(5)
    const newTime = front + ' ' + end
    const matchApponent = $(apponent[i]).text().trim().replace(/\s+/g, '⚔')
    const info = {
      date: newTime,
      people: matchApponent
    }
    const list = []
    list.push(info)
    list.forEach(function (soccer) {
      t.cell('比赛日期', soccer.date)
      t.cell('对阵双方', soccer.people)
      t.newRow()
    })
  }
}