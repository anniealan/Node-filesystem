const fs = require('fs')

const {Writable, Readable, Transform} = require('stream')
const moment = require('moment')
class MyReadable extends Readable {
  _read(size){
    const data = moment()
    setTimeout(() => {
      this.push(data.toString())
    }, 1000);
  }
}

class MyWritable extends Writable {
  constructor(options){
    super(options)
    this.file = fs.openSync('./file.txt', 'w')
  }
  _write(chunk, encoding, done) {
    fs.write(this.file, chunk.toString(), ()=>{
      done()
    })
  }
}

class MyTransform extends Transform {
  _transform(chunk, encoding, done) {
    const data = moment(new Date(chunk.toString())).format('hh:mm:ss');
    this.push(data + "\n");
    done();
  };
};


const rStream = new MyReadable()
const wStream = new MyWritable()
const tStream = new MyTransform()

rStream
  .pipe(tStream)
  .pipe(wStream)
