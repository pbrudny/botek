const handleHelp = require('./help');
const handleEcho = require('./echo');
const handleGrade = require('./grade');
const handleGive = require('./give');

module.exports = {
  help: handleHelp,
  echo: handleEcho,
  grade: handleGrade,
  give: handleGive
}; 