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
        //分割してURLとIDに分ける
        const lineText = lineString.split(',');
        const response = await axios.get(lineText[1]);
        const $ = await cheerio.load(response.data);

        let url = new URL(lineText[1]);
        const id = lineText[0];
        //取得したい要素の指定と追加HTML
        //cheerioはjqueryライクの記述で使用できる
        let targetdiv = $('.entry-content').html() + "\n<style>.c-entry__content.p-entry-content p {margin:0}</style>";
        //console.log(targetdiv);

        let filename = id + ".txt";
        fs.writeFileSync(filename,targetdiv);
    })
    //


})();