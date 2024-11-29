import axios from "axios";

function logger(msg, size) {
  const order = size || 1;
  return `${order}. ${msg}\n`;
}

let msg = "";
try {
  let isError = false;
  
  const gh = axios.create({
    baseURL: "https://api.github.com/repos/elijahducote/trifectshow",
    headers: {
      "Authorization": `Bearer ${process.env.GIT}`,
      "Accept": "application/vnd.github.object+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
      "Referer": "https://example.com/",
      "Connection": "keep-alive"
    },
    withCredentials: false
  });
  
  await Promise.allSettled(
  [
    gh.get("/commits/main"),
    gh.get("/contents/important.json")
  ]).then(vow => {
    const {status: commitStatus} = vow[0].value,
    errlog = [];
        
    if (commitStatus === 200) {
      const {sha: latestCommit} = vow[0].value.data,
      {status: fileStatus} = vow[1].value;
      
      if (latestCommit && fileStatus === 200) {
        const {content: fileContent} = vow[1].value.data;
        fileContent = JSON.parse(fileContent);
        fileContent.hash = latestCommit;
            
        gh.put("/contents/important.json",
        {
          sha: latestCommit,
          content: JSON.stringify(fileContent),
          message: "Update on file contents."
        })
        .catch(err => {
          errlog[errlog.length] = logger(`Couldn't update requested file: "${err}"`, errlog.length);
        });
      }
      else errlog[errlog.length] = logger("File wasn't able to be reached.", errlog.length);
    }
    else errlog[errlog.length] = logger("Unable to fulfill request.", errlog.length);
        
    if (errlog.length) throw errlog.join();
  }).catch(err => {
    msg = msg + err;
    isError = true;
  });
  
  if (isError) throw new Error(msg);
  else msg = "Sucessful!";
}
catch (err) {
  console.error(err);
}
finally {
  console.log(msg);
}