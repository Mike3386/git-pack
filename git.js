var Promise = require('bluebird');
var Needle = require('needle');
Promise.promisifyAll(Needle);

module.exports.GetUserRepositories = GetUserRepositories;
module.exports.GetRepositoriesByLine = GetRepositoriesByLine;
module.exports.GetCommitsForRepositorie = GetCommitsForRepositorie;

function GetUserRepositories(user){
    return new Promise((resolve, reject)=>{
        if(user != null){
            Needle.getAsync("https://api.github.com/users/" + user + "/repos?per_page=10").
            then((data)=>{
                if(data.body.message == "Not Found") resolve([]);
                else resolve(data.body.map(function(elem){
                        return {id:elem.id, name:elem.name, url:elem.url};
                    }));
                
            }).catch(reject);
        } else resolve([]);
    })
}

function GetRepositoriesByLine(line){
    return new Promise((resolve, reject)=>{
        if(line != null){
            Needle.getAsync("https://api.github.com/search/repositories?q=" + line + "&per_page=10").
            then((data)=>{
                resolve(data.body.items.map(function(elem){
                    return {id:elem.id, name:elem.name, owner:elem.owner.login, url:elem.url};
                }));
            }).catch(reject);
        } else resolve([]);
    })
}

function GetCommitsForRepositorie(repos){
    return new Promise((resolve, reject)=>{
        if(repos != null && repos.owner != null && repos.name != null){
            Needle.getAsync("https://api.github.com/repos/"+ repos.owner + "/" + repos.name +"/commits?per_page=10").
            then((data)=>{ 
                if(data.body.message == "Not Found") resolve([]);
                else resolve(data.body.map(function(elem){
                        return {sha:elem.sha, author:elem.author.login, message:elem.commit.message, date:elem.commit.committer.date}
                    }));
            }).catch(reject);
        } else resolve([]);
    })
}