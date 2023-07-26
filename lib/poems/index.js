var songciData = require('chinese-poetry/chinese-poetry/ci/宋词三百首.json');
var tangshiData = require('chinese-poetry/chinese-poetry/json/唐诗三百首.json');
var songAuthorData = require('chinese-poetry/chinese-poetry/json/authors.song.json');
var tangAuthorData = require('chinese-poetry/chinese-poetry/json/authors.tang.json');
const cnchar = require('cnchar');
const trad = require('cnchar-trad');
var _ = require('loadsh')
var n = require('nanoid')
var nanoid = n.nanoid
cnchar.use(trad);
// cnchar.convert.simpleToTrad(string); // 简体 => 繁体
// cnchar.convert.simpleToSpark(string); // 简体 => 火星文
// cnchar.convert.tradToSimple(string); // 繁体 => 简体
// cnchar.convert.tradToSpark(string); // 繁体 => 火星文
// cnchar.convert.sparkToSimple(string); // 火星文 => 简体
// cnchar.convert.sparkToTrad(string); // 火星文 => 繁体
// string.convertSimpleToTrad();
// string.convertSimpleToSpark();
// string.convertTradToSimple();
// string.convertTradToSpark();
// string.convertSparkToSimple();
// string.convertSparkToTrad();
const songcis = _.cloneDeep(songciData);
const tangshis = _.cloneDeep(tangshiData);
const songciAuthors = _.cloneDeep(songAuthorData);
const tangsiAuthors = _.cloneDeep(tangAuthorData);
const songciList = [...songcis].map(item => {
  const author = [...songciAuthors].filter(aItem => aItem.name.convertTradToSimple() === item.author)
  item.info = author.length ? author[0]: {
    desc: '信息不详，未采集到',
    name: item.author,
    id: nanoid()
  }
  const pgIndex = _.random(item.paragraphs.length - 1)
  item.daySentence = item.paragraphs.filter((pg, pi) => pgIndex === pi)[0]
  return item
})

const tangshiList = [...tangshis].map(item => {
  const author = [...tangsiAuthors].filter(aItem => aItem.name.convertTradToSimple() === item.author.convertTradToSimple())
  item.info = author.length ? author[0]: {
    desc: '信息不详，未采集到',
    name: item.author,
    id: nanoid()
  }
  const pgIndex = _.random(item.paragraphs.length - 1)
  item.daySentence = item.paragraphs.filter((pg, pi) => pgIndex === pi)[0]
  return item
})

const TradToSimpleFn = (data) => {
  if (typeof data !== 'object') {
    return data.convertTradToSimple()
  }
  if (!_.isArray(data)) {
    for (const key in data) {
      const val = data[key];
      if (key!=='id') {
        data[key] = TradToSimpleFn(val)
      }
    }
  } else {
    data = data.map(item => {
      return TradToSimpleFn(item)
    })
  }
  return data
}

const SimpleToTradFn = (data) => {
  if (typeof data !== 'object') {
    return data.convertSimpleToTrad()
  }
  if (!_.isArray(data)) {
    for (const key in data) {
      const val = data[key];
      if (key!=='id') {
        data[key] = SimpleToTradFn(val)
      }
    }
  } else {
    data = data.map(item => {
      return SimpleToTradFn(item)
    })
  }
  return data
}

const tangshiSimpleList = TradToSimpleFn(_.cloneDeep(tangshiList));
const tangshiTradList = SimpleToTradFn(_.cloneDeep(tangshiList));
const songciTradList = SimpleToTradFn(_.cloneDeep(songciList));

const getRandomItems = (arr, n = 10) => {
  const shuffled = _.cloneDeep(arr); 
  let i = shuffled.length;
  const result = [];
  while (i-- && n > 0) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    result.push(shuffled[i]);
    n--;
  }
  return result;
}

const songciRandomList = (n) => {
  return getRandomItems(songciList, n)
}

const tangshiRandomList = (n) => {
  return getRandomItems(tangshiSimpleList, n)
}

var info = {
  songciAuthors,
  tangsiAuthors,
  songciList,
  songciTradList,
  tangshiList,
  tangshiSimpleList,
  tangshiTradList,
  getRandomItems,
  songciRandomList,
  tangshiRandomList,
}

module.exports = info;