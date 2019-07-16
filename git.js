var Promise = require('bluebird');
var Needle = require('needle');
Promise.promisifyAll(Needle);

module.exports.GetUserRepositories = GetUserRepositories;
module.exports.GetRepositoriesByLine = GetRepositoriesByLine;
module.exports.GetCommitsForRepositorie = GetCommitsForRepositorie;

function GetUserRepositories(user) {
  if (!user) return Promise.resolve([]);

  return Needle.getAsync(`https://api.github.com/users/${user}/repos?per_page=10`)
  .then(data => {
    if (data.body.message === "Not Found") return [];

    return data.body.map(elem => ({
      id: elem.id,
      name: elem.name,
      url: elem.url
    }));
  });
}

function GetRepositoriesByLine(line) {
  if (!line) return Promise.resolve([]);

  return Needle.getAsync(`https://api.github.com/search/repositories?q=${line}&per_page=10`)
  .then(data =>
    data.body.items.map(elem => ({
      id:elem.id,
      name:elem.name,
      owner:elem.owner.login,
      url:elem.url
    }));
  )
}

function GetCommitsForRepositorie(repos) {
  if (!repos && !repos.owner && !repos.name) return Promise.resolve([]);

  return Needle.getAsync(`https://api.github.com/repos/${repos.owner}/${repos.name}/commits?per_page=10`)
  .then(data => { 
      if (data.body.message === "Not Found") return [];
      
      return data.body.map(elem => ({
        sha:elem.sha,
        author:elem.author.login,
        message:elem.commit.message,
        date:elem.commit.committer.date
      });
  });
}
