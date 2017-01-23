const logger = new require('simple-node-logger').createSimpleLogger();
const fileman = require('fi-fileman');
const fs = require('fs');
const _ = require('underscore');

module.exports = {
  save(file, cb) {
    fs.stat(file.path, (err, stats) => {
      this.check(file, stats, (data) => {
        if (_.isNull(data)) {
          return cb({message: 'File already exist'});
        }

        fileman.save(file, '', (err, fileinfo) => {
          if(err) return logger.error(err);

          this.write(fileinfo, data);
          cb({message: 'File already saved'})
        });
      });
    });
  },

  check(fileinfo, stats, cb) {
    fs.readFile('./files.json', 'utf8', (err, data) => {
      if(err) return logger.error(err);

      if(!data) return cb([]);

      const files = JSON.parse(data) || [];
      const match = _.find(files, (file) => {
        return file.name == fileinfo.name &&
          file.type == fileinfo.type &&
          stats.size == stats.size;
      });

      if (match) return cb(null);

      return cb(files);
    });
  },

  write(fileinfo, files=[]) {
    files.push(fileinfo);

    fs.writeFile('./files.json', JSON.stringify(files), (err) => {
      if(err) return logger.error(err);
    });
  }
};