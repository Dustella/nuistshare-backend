import * as fs from 'fs';
import ReadLine from 'readline';

const source = JSON.parse(fs.readFileSync('datawork/targetLs.json', 'utf8'));

const data = [];

const choose = {
  1: '习题集、试卷',
  2: '教材',
  3: '课件',
  4: '笔记',
  5: '其他',
};

const rdl = async (promt) => {
  const input = await new Promise((resolve) => {
    const readline = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(`${promt}\n`, (input) => {
      resolve(input);
      readline.close();
    });
  });
  return input;
};

const getInput = async () => {
  const input = await rdl('input');

  const type = choose[input];
  console.log(`${type}, is this ok?`);
  const check = await rdl('enter ok, c to reinput');
  if (check === 'c') {
    return getInput();
  } else {
    return type;
  }
};

for (const item of source) {
  const { l1_title, l2_title, title, href, uploader } = item;
  //   sleep for 1sec
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.clear();

  //   test if this fucking item is dir
  const hash = href.split('/').pop();
  const cloudreveUrl = `https://imon.agentwei.cn/api/v3/share/info/${hash}`;

  const info = await fetch(cloudreveUrl).then(async (a) => await a.json());
  const { is_dir, views, downloads, create_date, size } = info.data;

  //   check if is in alist
  let alist_meta = undefined;

  const alist_resp = await fetch('https://index.dustella.net/api/fs/get', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: `{"path":"/nuistshare/${l1_title}/${l2_title}/${title}","password":""}`,
  }).then((a) => a.json());

  if (alist_resp.code === 200) {
    alist_meta = {
      driver: 'alist',
      target: `https://index.dustella.net/nuistshare/${l1_title}/${l2_title}/${title}`,
      label: 'Dustella的Alist',
      size,
    };
  }

  //   let choose = 5;
  //   read from console

  console.clear();

  console.log(`
title: ${title}
is_dir: ${is_dir}
alist_meta: ${JSON.stringify(alist_meta, null, 2)}
${JSON.stringify(choose, null, 2)}
  `);

  const type = await getInput();

  const arhive_item = {
    name: title,
    l1Class: l1_title,
    l2Class: l2_title,
    tags: [],
    type,
    downloadCount: downloads,
    favCount: 0,
    viewCount: views,
    metadata: {
      createMany: {
        data: [
          {
            target: href,
            driver: 'cloudreve',
            label: 'Infinity的云盘',
            is_dir: is_dir,
            size,
          },
        ],
      },
    },
    public: true,
    uploader: uploader ?? 'Infinity',
    uploadTime: new Date(create_date),
  };

  if (alist_meta) {
    arhive_item.metadata.createMany.data.push(alist_meta);
  }

  data.push(arhive_item);
}

// use fs to write `data` into migration_data.json
fs.writeFileSync('datawork/migration_data.json', JSON.stringify(data, null, 2));
