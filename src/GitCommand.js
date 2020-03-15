const path = require('path');
const nodegit = require("nodegit");

module.exports.getFirstCommit = async (name) => {
    const repProj = name.split('/');
    const pathRep = path.resolve(__dirname, '../repositories/'+repProj[repProj.length-1]);
    
    const repo = await nodegit.Repository.open(path.resolve(pathRep, ".git"));
    const firstCommit = await repo.getBranchCommit(process.conf.mainBranch);
    
    return {
        commitMessage: firstCommit.message(),
        commitHash: firstCommit.sha(), 
        branchName: process.conf.mainBranch, 
        authorName: firstCommit.author().name()
    };

   /* nodegit.Repository.open(path.resolve(pathRep, ".git"))
        .then(function (repo) {
            return repo.getBranchCommit('master');
        })
        .then(function (firstCommit) {
            // History returns an event.
            var history = firstCommit.history(nodegit.Revwalk.SORT.TIME);
console.log(firstCommit.sha());
            // History emits "commit" event for each commit in the branch's history
            history.on("commit", function (commit) {
                console.log("commit " + commit.sha());
                console.log("Author:", commit.author().name() +
                    " <" + commit.author().email() + ">");
                console.log("Date:", commit.date());
                console.log("\n    " + commit.message());
            });

            // Don't forget to call `start()`!
            history.start();
        })
        .done();*/
}

module.exports.clone = async (name) => {
    let result = {
        data: '',
        status: 500,
        statusText: 'Bad request'
    }
    let res;
    const repProj = name.split('/');

    if(repProj.length>1){
        const pathRep = path.resolve(__dirname, '../repositories/'+repProj[repProj.length-1]);

        try {
            res = await nodegit.Clone(`https://github.com/${name}`, pathRep);
        } catch (err) {
            res = err;
        }

        if (res instanceof nodegit.Repository) {
            result.status = 200;
            result.statusText = 'ok';
        }else{
            result.statusText = res.toString();
        }
    }
    
    return result;

};

