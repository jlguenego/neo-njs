import * as fs from 'fs';
import * as path from'path';
import * as es from 'event-stream';
import { configure, client } from './lib/configure-elastic';

async function main() {
    try {
        await configure();
        const csvFilename = path.resolve(__dirname, './toto.csv');
        const readStream = fs.createReadStream(csvFilename);
        readStream
            .pipe(es.split('\n'))
            .pipe(es.map(async (line, cb) => {
                readStream.pause();
                const [id, x, y] = line.split(';');
                const obj = {
                    id: +id,
                    x: +x,
                    y: +y,
                };
                
                readStream.resume();
                await client.index({
                    index: 'hello',
                    id: obj.id,
                    type: 'world',
                    body: obj
                });
                cb(null);
            }));

    } catch (e) {
        console.log('error', e);
    }
}

main();

