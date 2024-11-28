import axios from "axios";

const gh = axios.create({
  baseURL: "https://api.github.com/repos/alendrone/trifect-show"
  headers: {
    "Accept": "application/vnd.github.object+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Referer": "https://example.com/",
    "Connection": "keep-alive"
  },
  withCredentials: false
});


var {data} = await gh.get("/contents/convoy/shipment");