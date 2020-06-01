const CORS_PROXY_SERVER = "https://cors-anywhere.herokuapp.com/"
const CURRENT_NEWS = "https://api.currentsapi.services/v1/"
const API_KEY = "PVL-fGBmkX0--K3vpp2coEquHGgUFDiszzY2o1wOBz6w3uGV";
const API_URL = `${CORS_PROXY_SERVER}${CURRENT_NEWS}`

function myAjax(url, postMethod, body = null) {
  return new Promise((resolve, reject) => {
    var xmlHttpObj = new XMLHttpRequest();
    xmlHttpObj.onreadystatechange = function () {
      if (xmlHttpObj.readyState === 4) {
        if (xmlHttpObj.status === 200) {
          resolve(xmlHttpObj);
        } else {
          reject(xmlHttpObj)
        }
      }
    }
    xmlHttpObj.open(postMethod, url);
    xmlHttpObj.setRequestHeader("Cache-Control", "no-cache");
    xmlHttpObj.setRequestHeader("Authorization", API_KEY);
    xmlHttpObj.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlHttpObj.send(body);
  })
}
function dateString(date) {
  let newDate = new Date(date);
  let yr = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = newDate.getDate();
  day = day < 10 ? `0${day}` : day;
  return `${yr}-${month}-${day}`
}

function getLatestNews() {
  let latestnewsUrl = `${API_URL}latest-news`;
  return myAjax(latestnewsUrl, "GET")
}
function getFilterNews(language = "", country = "", startDate = "", endDate = "") {
  let url = `${API_URL}search?`;
  if (language !== "") {
    url += `language=${language}&`
  }
  if (country !== "") {
    url += `country=${country}&`
  }
  if (startDate !== "") {
    url += `country=${new Date(startDate).toISOString()}&`
  }
  if (endDate !== "") {
    url += `country=${new Date(endDate).toISOString()}`
  }
  return myAjax(url, "GET")
}
export { getLatestNews, getFilterNews, dateString }
