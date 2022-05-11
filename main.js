import cheerio from 'cheerio';
import axios from 'axios'; 
import fs from 'fs';
import readline from 'readline';

const asyncLineReader = async (iterater) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./url_list.txt', { encoding: 'utf8' }),
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      await iterater(line);
    }
}
(async () => { 

    await asyncLineReader(async (lineString) => {    
        const response = await axios.get(lineString);
        const $ = await cheerio.load(response.data);

        let url = new URL(lineString);
        //タイトルの取得
        //cheerioはjqueryライクの記述で使用できる
        let targetdiv = $('.entryHeader__title').html();
        console.log(targetdiv);

        let filename = url.pathname.toString().replace(/\//g,'_').substring(1,url.pathname.toString().length);
        fs.writeFileSync(filename,targetdiv);
    })
    //


})();