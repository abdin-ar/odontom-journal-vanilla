import { issues, articles } from "./data.js";

/* ++++++++++++++++++++++ preloader ++++++++++++++++++++++ */
/* remove preloader */
window.addEventListener("load", () => {
  const prel = document.querySelector(".preloaderContainer");
  prel.classList.add("hidePreloader");
});
/* +++++++++++++++++++ end of preloader +++++++++++++++++++ */

/* +++++++++++++++++++++++ header +++++++++++++++++++++++ */
let toggleBtn;

let agreed =
  JSON.parse(window.localStorage.getItem("termsAgreementClosed")) || false;
let agreementHTML = `<div class="terms-prompt"><div><p>This is a DEMO WEBSITE. By continuing to use this website, you agree to our <a href="terms.html">Terms of Service</a></p><button type="button" class="btn" id='agreementBtn'>Ok, I got it</button></div></div>`;
if (agreed === true) {
  agreementHTML = "";
}

const headerContent = `      <div class="header-center">
        <button type="button" class="btn header-btn btn-color" title="Toggle navigation menu">
          <i class="fa-solid fa-align-justify"></i>
        </button>
        <a href="index.html" class="header-logo">
          <img src="./images/logo.gif" alt="ODONTOM journal logo">
        </a>
        <div class="headerText text-small">
          <p class="headerText">ISSN: 9999-9999</p>
          <p class="headerText">Edited By: Bobo Brains</p>
          <p class="headerText">Impact Factor (2022): 9.999</p>
        </div>
      </div>`;

populateHTML("header", `${headerContent}${agreementHTML}`, headerFunc);

function headerFunc() {
  toggleBtn = document.querySelector(".header-btn");

  if (!agreed) {
    const agreementBtn = document.getElementById("agreementBtn");
    agreementBtn.addEventListener("click", () => {
      window.localStorage.setItem("termsAgreementClosed", JSON.stringify(true));
      agreed = true;
      populateHTML("header", headerContent, headerFunc);
    });
  }
}
/* ++++++++++++++++++++ end of header ++++++++++++++++++++ */

/* +++++++++++++++++++++++ footer +++++++++++++++++++++++ */
const footerContent = `<p>&copy;<span id="date"></span> SciPub Publishing Ltd. All rights reserved. <a href='terms.html'>Terms of Service</a></p>`;

populateHTML("footer", footerContent, footerFunc);

/* auto date */
function footerFunc() {
  const date = document.getElementById("date");
  const currentYear = new Date().getFullYear();
  date.textContent = currentYear;
}
/* ++++++++++++++++++++ end of footer ++++++++++++++++++++ */

/* ++++++++++++++++++ issue type check ++++++++++++++++++ */
const currentIssue = issues[issues.length - 1];

function issueTypeCheck(volume, issueSerial) {
  if (volume == 0 && issueSerial == 0) {
    return `0#0#articles in press`;
  } else if (
    volume == currentIssue.volume &&
    issueSerial == currentIssue.issueSerial
  ) {
    return `${volume}#${issueSerial}#current issue`;
  } else {
    return `${volume}#${issueSerial}`;
  }
}
/* +++++++++++++++ end of issue type check +++++++++++++++ */

/* +++++++++++++ Recognize current issue link +++++++++++++ */
const currentDatasetIssue = `${currentIssue.volume}#${currentIssue.issueSerial}`;
const currentIssueLink = document.getElementById("currentIssueLink");
if (currentIssueLink) {
  currentIssueLink.dataset.issue = currentDatasetIssue;
  currentIssueLink.classList.add("collectIssueLink");
  currentIssueLink.innerHTML = `<p class="h2">Current Issue</p>
<img src="./covers/v${currentIssue.volume}i${currentIssue.issueSerial}.jpg" alt="Current Issue Cover Image" />
<p>Volume ${currentIssue.volume} - Issue ${currentIssue.issue}</p>
<p>Pages: ${currentIssue.pages}</p>
<p>${currentIssue.printDate}</p>`;
  issueLinkCollector();
}

/* ++++++++++ end of Recognize current issue link ++++++++++ */

/* ++++++++++++++++++++++ issue page ++++++++++++++++++++++ */
const sidebar = document.querySelector(".sidebar");
const issueHead = document.querySelector(".issueHead");
const issueContent = document.querySelector(".issueContent");
const titleEl = document.querySelector("title");
const pageH1 = document.getElementById("pageH1");
let toViewVolume = currentIssue.volume;
let toViewIssueSerial = currentIssue.issueSerial;
let toViewDatasetActive = "current issue";

if (issueContent) {
  const issueURL = new URL(window.location.href);
  const toView = issueURL.searchParams.get("issue");
  if (toView) {
    const toViewArr = toView.toString().split("#");
    toViewVolume = toViewArr[0];
    toViewIssueSerial = toViewArr[1];
    if (toViewArr.length == 3) {
      toViewDatasetActive = toViewArr[2];
    } else {
      toViewDatasetActive = ``;
    }
  }
  viewIssueArticles(toViewVolume, toViewIssueSerial, toViewDatasetActive);
}

function viewIssueArticles(vVolume, vIssueSerial, vDatasetActive) {
  sidebar.dataset.active = vDatasetActive;
  let prevIssueAvailable = true;
  let nextIssueAvailable = true;
  let viewedIssueObj;
  for (let m = 0; m < issues.length; m++) {
    if (issues[m].volume == vVolume && issues[m].issueSerial == vIssueSerial) {
      viewedIssueObj = issues[m];
      if (m == 0) {
        prevIssueAvailable = `${currentIssue.volume}#${currentIssue.issueSerial}#current issue`;
      } else if (m < 2) {
        prevIssueAvailable = false;
      } else {
        prevIssueAvailable = issueTypeCheck(
          issues[m - 1].volume,
          issues[m - 1].issueSerial
        );
      }

      if (m == issues.length - 1) {
        nextIssueAvailable = `0#0#articles in press`;
      } else if (m == 0) {
        nextIssueAvailable = false;
      } else {
        nextIssueAvailable = issueTypeCheck(
          issues[m + 1].volume,
          issues[m + 1].issueSerial
        );
      }
    }
  }

  let prevIssueLink = ``;
  let nextIssueLink = ``;

  if (!prevIssueAvailable) {
    prevIssueLink = `<p class="displayNone"></p>`;
  } else {
    prevIssueLink = `<a href="issue.html" data-issue="${prevIssueAvailable}" class="btn btn-issue-head collectIssueLink prevL" title="Previous Issue"><i class="fas fa-chevron-left"></i> Prev</a>`;
  }

  if (!nextIssueAvailable) {
    nextIssueLink = `<p class="displayNone"></p>`;
  } else {
    nextIssueLink = `<a href="issue.html" data-issue="${nextIssueAvailable}" class="btn btn-issue-head collectIssueLink nextL" title="Next Issue">Next <i class="fas fa-chevron-right"></i></a>`;
  }

  let issueHeadDiv;
  if (toViewVolume == 0 && toViewIssueSerial == 0) {
    issueHeadDiv = `<div class="issueHeadP">
<p class="displayNone"></p>
<p class="normal-text">Articles in Press</p>
<p class="displayNone"></p>
</div>`;
    titleEl.textContent = `ODONTOM - In Press`;
    pageH1.textContent = `ODONTOM - In Press`;
  } else {
    issueHeadDiv = `<div class="issueHeadP">
<p class="normal-text">Volume ${toViewVolume} - Issue ${viewedIssueObj.issue}</p>
<p class="normal-text">Pages: ${viewedIssueObj.pages}</p>
<p class="normal-text">${viewedIssueObj.printDate}</p>
</div>`;
    titleEl.textContent = `ODONTOM - Issue ${toViewVolume}(${viewedIssueObj.issue})`;
    pageH1.textContent = `ODONTOM - Issue ${toViewVolume}(${viewedIssueObj.issue})`;
  }

  const issueCoverImageLink = `<a class="issueHeadImgLink" href="./covers/v${toViewVolume}i${toViewIssueSerial}.jpg" target="_blank" title="Cover"><img src="./covers/v${toViewVolume}i${toViewIssueSerial}.jpg" alt="Cover Image" /></a>`;
  const issueHeadHTML = `${prevIssueLink}
<div class="issueHeadImgTxt">
${issueCoverImageLink}
${issueHeadDiv}
</div>
${nextIssueLink}`;

  issueHead.innerHTML = issueHeadHTML;

  populateIssueContent(toViewVolume, toViewIssueSerial, issueContent);
  issueLinkCollector();
  articleLinkCollector();
}

function populateIssueContent(volume, issueSerial, container) {
  let articlesArr = [];
  let resultHTML = ``;

  for (let k = 0; k < articles.length; k++) {
    if (
      articles[k].volume == volume &&
      articles[k].issueSerial == issueSerial
    ) {
      articlesArr.push(articles[k]);
    }
  }
  for (let b = 0; b < articlesArr.length; b++) {
    let onlineDateData = articlesArr[b].onlineDate.toString();
    let onlineDate = `${onlineDateData.slice(6, 8)}/${onlineDateData.slice(
      4,
      6
    )}/${onlineDateData.slice(0, 4)}`;
    let citation = `${articlesArr[b].volume}(${articlesArr[b].issue})`;
    if (articlesArr[b].volume == 0) {
      citation = `In Press`;
    }

    resultHTML += `<div class="issueArticle" aria-labelledby="ia${
      articlesArr[b].id
    }">
<div class="issueArticleSectionType">
<p class="normal-text">${articlesArr[b].section}</p>
<p class="normal-text">${articlesArr[b].type}</p>
</div>
<h2 id="ia${articlesArr[b].id}" class="h3 normal-title">${
      articlesArr[b].title
    }</h2>
<p class="issueArticleAuthors">${articlesArr[b].authors.join(", ")}</p>
<p class="issueArticleCitation">Odontom ${citation}:${
      articlesArr[b].pages
    }. First Online: ${onlineDate}.</p>
<div>
<a href="article.html" data-issue="${issueTypeCheck(
      volume,
      issueSerial
    )}" data-article="${
      articlesArr[b].id
    }" class="btn collectArticleLink"><i class="fas fa-file-text"></i> Full-Text HTML</a>
</div>
</div>`;
  }
  container.innerHTML = resultHTML;
}

/* +++++++++++++++++++ end of issue page +++++++++++++++++++ */

/* ++++++++++++++++++++++ article page ++++++++++++++++++++++ */
const articleContent = document.querySelector(".articleContent");
let aViewArticle = 0;
let aViewArticleIssue = "1#1";

if (articleContent) {
  const articleURL = new URL(window.location.href);
  const aView = articleURL.searchParams.get("article");
  if (aView) {
    const aViewArr = aView.toString().split("|");
    aViewArticle = aViewArr[0];
    aViewArticleIssue = aViewArr[1];
  }
  viewArticleHTML(aViewArticle, aViewArticleIssue);
}

function viewArticleHTML(aArticle, aIssue) {
  let viewedArticleObj;
  for (let a = 0; a < articles.length; a++) {
    if (articles[a].id == aArticle) {
      viewedArticleObj = articles[a];
    }
  }
  titleEl.textContent = `ODONTOM - Article No ${aArticle}`;
  pageH1.textContent = `ODONTOM - Article No ${aArticle}`;

  populateArticleContent(viewedArticleObj, aIssue, articleContent);
  issueLinkCollector();
}

function populateArticleContent(articleObj, issueA, containerA) {
  let resultHTMLA = ``;

  let onlineDateDataA = articleObj.onlineDate.toString();
  let onlineDateA = `${onlineDateDataA.slice(6, 8)}/${onlineDateDataA.slice(
    4,
    6
  )}/${onlineDateDataA.slice(0, 4)}`;
  let citationA = `${articleObj.volume}(${articleObj.issue})`;
  if (articleObj.volume == 0) {
    citationA = `In Press`;
  }

  let aAbstract = ``;
  if (articleObj.abstract) {
    aAbstract = `<h3 class="h3 normal-title">Abstract</h3>
<p class="normal-text">${articleObj.abstract}</p><br>`;
  }

  let aIntroduction = ``;
  if (articleObj.introduction) {
    aIntroduction = `<h3 class="h3 normal-title">Introduction</h3>
<p class="normal-text">${articleObj.introduction}</p><br>`;
  }

  let aMaterials = ``;
  if (articleObj.methods) {
    aMaterials = `<h3 class="h3 normal-title">Materials and Methods</h3>
<p class="normal-text">${articleObj.methods}</p><br>`;
  }

  let aResults = ``;
  if (articleObj.results) {
    aResults = `<h3 class="h3 normal-title">Results</h3>
<p class="normal-text">${articleObj.results}</p><br>`;
  }

  let aDiscussion = ``;
  if (articleObj.discussion) {
    aDiscussion = `<h3 class="h3 normal-title">Discussion</h3>
<p class="normal-text">${articleObj.discussion}</p><br>`;
  }

  let aConclusions = ``;
  if (articleObj.conclusion) {
    aConclusions = `<h3 class="h3 normal-title">Conclusions</h3>
<p class="normal-text">${articleObj.conclusion}</p><br>`;
  }

  let printedDate = ``;
  if (articleObj.printDate && articleObj.printDate != "in press") {
    printedDate = ` ${articleObj.printDate}.`;
  }

  let citedDate = ``;
  if (articleObj.printDate && articleObj.printDate == "in press") {
    citedDate = articleObj.printDate;
  } else {
    citedDate = `${articleObj.printDate.split(" ")[1]}; ${articleObj.volume}(${
      articleObj.issue
    })`;
  }

  resultHTMLA += `<section class="issueArticle" aria-labelledby="ia${
    articleObj.id
  }">
<div class="issueArticleSectionType">
<p class="normal-text">${articleObj.section}</p>
<p class="normal-text">${articleObj.type}</p>
</div>
<h2 id="ia${articleObj.id}" class="h3 normal-title">${articleObj.title}</h2>
<p class="issueArticleAuthors">${articleObj.authors.join(", ")}</p>
<p class="issueArticleCitation">Odontom ${citationA}:${
    articleObj.pages
  }.${printedDate} First Online: ${onlineDateA}.</p>
<p class="issueArticleCitation">Article ID: ${articleObj.aid}. DOI: ${
    articleObj.doi
  }.</p>
<div>
<a href="issue.html" data-issue="${issueA}" class="btn collectIssueLink"><i class="fas fa-book"></i> Go to Issue</a>
</div>
</section>
<div class="title-underline-p"></div>
<br>
<section class="issueArticle" aria-label="Article full-text">
${aAbstract}
${aIntroduction}
${aMaterials}
${aResults}
${aDiscussion}
${aConclusions}
</section>
<section class="issueArticleHowToCite" aria-labelledby="htcta">
<h3 id="htcta" class="h3">How to cite this article</h3>
<p>${articleObj.authors.join(", ")}. ${
    articleObj.title
  }. Odontom ${citedDate}:${articleObj.pages}. DOI: ${
    articleObj.doi
  }. <button class="btn btn-copy" title="Copy citation to clipboard" id="copyToClipboard" data-copy="${articleObj.authors.join(
    ", "
  )}. ${articleObj.title}. Odontom ${citedDate}:${articleObj.pages}. DOI: ${
    articleObj.doi
  }."><i class="far fa-copy"></i></button></p>
</section>`;

  containerA.innerHTML = resultHTMLA;
}

/* +++++++++++++++++++ end of article page +++++++++++++++++++ */

/* +++++++++++++++++++++++ sidebar +++++++++++++++++++++++ */
const sidebarContent = `        <div class="sidebar-content">
          <form id="journal-search" aria-label="Search Journal" title="Search Journal">
            <input type="text" name="searchJournal" id="searchJournal" autocomplete="off" placeholder="Search Journal..." />
            <button type="submit" class="btn" title="Search"><i class="fas fa-search"></i></button>
          </form>

          <section class="sidebar-main" aria-label="Navigation links">

            <a href="index.html" title="Home Page" class="sidebar-link btn-color">home</a>

            <a href="#" title="About the Journal" class="sidebar-link btn-color open-sublinks" data-type="about">about&nbsp;<span class="linkArrowDown"><i class="fas fa-chevron-down"></i></span><span class="linkArrowUp"><i class="fas fa-chevron-up"></i></span></a>
            <a href="overview.html" title="Journal Overview" class="sidebar-sublink btn-color" data-type="about">overview</a>
            <a href="society.html" title="Society Information" class="sidebar-sublink btn-color" data-type="about">society information</a>
            <a href="board.html" title="Editorial Board" class="sidebar-sublink btn-color" data-type="about">editorial board</a>
            <a href="contact.html" title="Contact Us" class="sidebar-sublink btn-color" data-type="about">contact us</a>

            <a href="#" title="Publish your Research in this Journal" class="sidebar-link btn-color open-sublinks" data-type="publish">publish&nbsp;<span class="linkArrowDown"><i class="fas fa-chevron-down"></i></span><span class="linkArrowUp"><i class="fas fa-chevron-up"></i></span></a>
            <a href="authors.html" title="Author Guidelines" class="sidebar-sublink btn-color" data-type="publish">author guidelines</a>
            <a href="referees.html" title="Referee Guidelines" class="sidebar-sublink btn-color" data-type="publish">referee guidelines</a>
            <a href="#" title="Submit your Manuscript for Publication" class="sidebar-sublink btn-color" data-type="publish">submit a manuscript <i class="fas fa-external-link-alt"></i></a>

            <a href="#" title="Browse Journal's Articles" class="sidebar-link btn-color open-sublinks" data-type="articles">articles&nbsp;<span class="linkArrowDown"><i class="fas fa-chevron-down"></i></span><span class="linkArrowUp"><i class="fas fa-chevron-up"></i></span></a>
            <a href="issue.html" title="Articles in Press" class="sidebar-sublink btn-color collectIssueLink" data-type="articles" data-issue="0#0">articles in press</a>
            <a href="issue.html" title="Current Issue" class="sidebar-sublink btn-color collectIssueLink" data-issue="${currentDatasetIssue}" data-type="articles">current issue</a>
            <a href="issues.html" title="All Journal Issues" class="sidebar-sublink btn-color" data-type="articles">all issues</a>
            <a href="special.html" title="Special Issues" class="sidebar-sublink btn-color" data-type="articles">special issues</a>
          </section>

          <section class="sidebar-bottom-links" aria-label="Social links">
            <div class="sidebar-social-links">
              <a href="#.html" title="Visit our Page on Facebook" class="sidebar-social-link btn-color"><i class="fab fa-facebook"></i></a>
              <a href="#.html" title="Visit our Page on Twitter" class="sidebar-social-link btn-color"><i class="fab fa-twitter"></i></a>
              <a href="contact.html" title="Contact Us" class="sidebar-social-link btn-color"><i class="fas fa-envelope"></i></a>
            </div>
            <a href="#"  title="SciPub Publishing Ltd." class="sidebar-social-link sidebar-logo">
              <img src="./images/scipub.gif" alt="SciPub">
            </a>
          </section>
<a href="search.html" id="searchPageHref" style="visibility: hidden; z-index: -5000; width: 1px; height: 1px; position: fixed; top:-2px; left: -2px; opacity: 0;"></a>
        </div>`;

populateHTML("sidebar", sidebarContent, sidebarFunc);

function sidebarFunc() {
  const sidebarMain = document.querySelector(".sidebar-main");
  const mainLinks = document.querySelectorAll(".open-sublinks");
  const subLinks = document.querySelectorAll(".sidebar-sublink");
  issueLinkCollector();
  searchActivator();
  /* add active class to active link */
  const activeLinkName = sidebar.dataset.active;
  const allLinks = sidebarMain.querySelectorAll("a");
  for (let l = 0; l < allLinks.length; l++) {
    if (allLinks[l].textContent === activeLinkName) {
      allLinks[l].classList.add("btn-color-active");
      if (allLinks[l].dataset.type) {
        const activeLinkType = allLinks[l].dataset.type;
        openLinkType(activeLinkType, true);
        allLinks[l].focus();
        allLinks[l].blur();
      }
    }
  }
  /* toggle sidebar */
  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show-sidebar");
  });

  /* toggle sublinks in sidebar */
  mainLinks.forEach(function (mainLink) {
    mainLink.addEventListener("click", function (e) {
      e.preventDefault();
      const linkType = e.currentTarget.dataset.type;
      openLinkType(linkType);
    });
  });

  function openLinkType(selectedLinkType, isActive) {
    mainLinks.forEach(function (mainLink) {
      if (mainLink.dataset.type === selectedLinkType) {
        mainLink.classList.toggle("opened-link");
        if (isActive) {
          mainLink.classList.add("btn-color-active");
        }
      }
      if (mainLink.dataset.type !== selectedLinkType) {
        mainLink.classList.remove("opened-link");
      }
    });
    subLinks.forEach(function (subLink) {
      if (subLink.dataset.type === selectedLinkType) {
        subLink.classList.toggle("show-sublink");
      }
      if (subLink.dataset.type !== selectedLinkType) {
        subLink.classList.remove("show-sublink");
      }
    });
  }
}
/* ++++++++++++++++++++ end of sidebar ++++++++++++++++++++ */

/* ++++++++++++++++++++ populate HTML ++++++++++++++++++++ */
function populateHTML(parentClass, contentHTML, cb) {
  const parentItem = document.querySelector(`.${parentClass}`);
  parentItem.innerHTML = contentHTML;
  if (cb) {
    cb();
  }
}
/* +++++++++++++++++ end of populate HTML +++++++++++++++++ */

/* ++++++++++++++++++++++ Contact Us ++++++++++++++++++++++ */
const contactUsForm = document.getElementById("contactUsForm");
const fName = document.getElementById("fName");
const lName = document.getElementById("lName");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const desc = document.querySelectorAll(".desc");
let descValue;
const textmessage = document.getElementById("textmessage");
const contactUsFormAlert = document.getElementById("contactUsFormAlert");

if (contactUsForm) {
  contactUsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });
}

function sendMessage() {
  if (checkContents() == true) {
    const timeSent = new Date();
    console.log(`Time Sent: ${timeSent}
First Name: ${fName.value}
Last Name: ${lName.value}
Email: ${email.value}
Description: ${descValue}
Subject: ${subject.value}
Message: ${textmessage.value}`);
    formAlert("success", "Your message was sent successfully");
    fName.value = "";
    lName.value = "";
    email.value = "";
    subject.value = "";
    textmessage.value = "";
    desc.forEach(function (item) {
      item.checked = false;
    });
  } else {
    formAlert("danger", "Some fields are not filled!");
  }
}

function checkContents() {
  descValue = null;
  desc.forEach(function (item) {
    if (item.checked) {
      descValue = item.id;
    }
  });
  if (
    !fName.value ||
    !lName.value ||
    !email.value ||
    !subject.value ||
    !textmessage.value ||
    !descValue
  ) {
    return false;
  } else {
    return true;
  }
}

function formAlert(state, text) {
  contactUsFormAlert.classList = `alert alert-${state}`;
  contactUsFormAlert.textContent = text;
  setTimeout(() => {
    contactUsFormAlert.classList = "displayNone";
    contactUsFormAlert.textContent = "";
  }, 10000);
}
/* +++++++++++++++++++ end of Contact Us +++++++++++++++++++ */

/* ++++++++++++++++++++++ List Issues ++++++++++++++++++++++ */
const issuesContainer = document.getElementById("issues-container");
const issuesContainerTitle = document.getElementById("issues-container-title");
let issuesHTML = ``;
if (issuesContainer) {
  const dataIssues = issuesContainer.dataset.issues;
  let displayIssuesArr = [];

  if (dataIssues == "all") {
    issuesContainerTitle.textContent = "All Issues";
    for (let r = 0; r < issues.length; r++) {
      if (issues[r].volume) {
        displayIssuesArr.push(issues[r]);
      }
    }
  } else if (dataIssues == "recent") {
    issuesContainerTitle.textContent = "Recent Issues";
    for (let r = 0; r < issues.length; r++) {
      if (issues[r].volume) {
        displayIssuesArr.push(issues[r]);
      }
    }
    while (displayIssuesArr.length > 4) {
      displayIssuesArr.shift();
    }
  } else if (dataIssues == "special") {
    issuesContainerTitle.textContent = "Special Issues";
    for (let r = 0; r < issues.length; r++) {
      if (issues[r].issue.split("")[0] == "S") {
        displayIssuesArr.push(issues[r]);
      }
    }
  }

  issuesHTML = displayIssues(displayIssuesArr);
  issuesContainer.innerHTML = issuesHTML;
  issueLinkCollector();
}

function displayIssues(issuesArr) {
  let returnHTML = ``;
  for (let q = issuesArr.length - 1; q > -1; q--) {
    let issuePages = issuesArr[q].pages;
    if (issuePages) {
      issuePages = `                <p>Pages: ${issuesArr[q].pages}</p>`;
    } else {
      issuePages = ``;
    }
    let issueNo = issuesArr[q].issue;
    if (issueNo != 0) {
      issueNo = `                <p>Volume ${issuesArr[q].volume} - Issue ${issuesArr[q].issue}</p>`;
    } else {
      issueNo = ``;
    }
    let issueSpacer = ``;
    if (issueNo == ``) {
      issueSpacer += `<br>`;
    }
    if (issuePages == ``) {
      issueSpacer += `<br>`;
    }
    returnHTML += `              <a href="issue.html" data-issue="${issuesArr[q].volume}#${issuesArr[q].issueSerial}" class="normal-issue-link collectIssueLink">
                <img src="./covers/v${issuesArr[q].volume}i${issuesArr[q].issueSerial}.jpg" alt="Issue Cover Image" />
${issueNo}
${issuePages}
                <p>${issuesArr[q].printDate}</p>
${issueSpacer}
              </a>`;
  }
  return returnHTML;
}
/* +++++++++++++++++++ end of List Issues +++++++++++++++++++ */

/* ++++++++++++++++++++++ issue Links ++++++++++++++++++++++ */
function issueLinkCollector() {
  const collectIssueLink = document.querySelectorAll(".collectIssueLink");
  collectIssueLink.forEach(function (link) {
    issueLinkSaver(link);
  });
}

function issueLinkSaver(link) {
  const clickedId = link;
  let writeId = clickedId.dataset.issue.split("#");
  writeId = issueTypeCheck(writeId[0], writeId[1]);
  const linkHref = clickedId.href;
  const ilsURL = new URL(window.location.href);
  ilsURL.href = linkHref;
  ilsURL.searchParams.set("issue", writeId);
  link.href = ilsURL;
}
/* +++++++++++++++++++ end of issue Links +++++++++++++++++++ */

/* ++++++++++++++++++++++ article Links ++++++++++++++++++++++ */
function articleLinkCollector() {
  const collectArticleLink = document.querySelectorAll(".collectArticleLink");
  collectArticleLink.forEach(function (link) {
    articleLinkSaver(link);
  });
}

function articleLinkSaver(link) {
  const clickedAId = link;
  let writeAId = `${clickedAId.dataset.article}|${clickedAId.dataset.issue}`;
  const linkAHref = clickedAId.href;
  const ilaURL = new URL(window.location.href);
  ilaURL.href = linkAHref;
  ilaURL.searchParams.set("article", writeAId);
  link.href = ilaURL;
}
/* +++++++++++++++++++ end of article Links +++++++++++++++++++ */

/* ++++++++++++++++++++++++++ search ++++++++++++++++++++++++++ */
function searchActivator() {
  const searchPageHref = document.getElementById("searchPageHref").href;
  const searchForm = document.getElementById("journal-search");
  const searchInput = document.getElementById("searchJournal");
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let searchResults = [];
    const originalSearchfor = searchInput.value;
    let searchfor = originalSearchfor;
    searchfor = searchfor.toLowerCase().split(" ");
    if (typeof searchfor == "text") {
      searchfor = [searchfor];
    }
    searchInput.value = "";

    for (let v = 0; v < articles.length; v++) {
      searchResults.push({ id: articles[v].id, match: 0 });
    }

    for (let s = 0; s < articles.length; s++) {
      for (let xx in articles[s]) {
        for (let t = 0; t < searchfor.length; t++) {
          if (typeof articles[s][xx] == "number") {
            if (articles[s][xx] == searchfor[t]) {
              searchResults[s].match += 1;
            }
          } else if (typeof articles[s][xx] == "string") {
            if (articles[s][xx].toLowerCase().includes(searchfor[t])) {
              searchResults[s].match += 1;
            }
          } else {
            if (
              articles[s][xx].join(", ").toLowerCase().includes(searchfor[t])
            ) {
              searchResults[s].match += 1;
            }
          }
        }
      }
    }
    searchResults = sortSearchResults(searchResults);
    openSearchResults(searchResults, originalSearchfor, searchPageHref);
  });
}

function sortSearchResults(resultsArr) {
  resultsArr.sort(function (a, b) {
    return b.match - a.match;
  });
  const finalArr = [];
  for (let u = 0; u < resultsArr.length; u++) {
    if (resultsArr[u].match > 0) {
      finalArr.push(resultsArr[u].id);
    }
  }
  return finalArr;
}

function openSearchResults(results, term, searchPath) {
  results = results.join(",");
  const searchURL = new URL(searchPath);
  searchURL.searchParams.set("term", term);
  searchURL.searchParams.set("results", results);
  const searchLink = document.createElement("a");
  searchLink.href = searchURL.href;
  document.body.appendChild(searchLink);
  searchLink.click();
  document.body.removeChild(searchLink);
}

const searchHead = document.querySelector(".searchHead");
const searchResultsEl = document.querySelector(".searchResults");
if (searchHead) {
  let sURL = new URL(window.location.href);
  let sResults = sURL.searchParams.get("results").toString().split(",");
  if (sResults.length == 1 && sResults[0] == "") {
    sResults = [];
  }
  const sTerm = sURL.searchParams.get("term");
  searchHead.innerHTML = `<p>Searching for: ${sTerm}</p>
<p>Your search returned ${sResults.length} result(s)</p>`;

  populateSearchResults(sResults, searchResultsEl);
  issueLinkCollector();
  articleLinkCollector();
}

function populateSearchResults(results, container) {
  let resultHTML = ``;

  for (let b = 0; b < results.length; b++) {
    let onlineDateData = articles[results[b]].onlineDate.toString();
    let onlineDate = `${onlineDateData.slice(6, 8)}/${onlineDateData.slice(
      4,
      6
    )}/${onlineDateData.slice(0, 4)}`;
    let citation = `${articles[results[b]].volume}(${
      articles[results[b]].issue
    })`;
    if (articles[results[b]].volume == 0) {
      citation = `In Press`;
    }

    resultHTML += `<div class="issueArticle" aria-labelledby="ia${
      articles[results[b]].id
    }">
<div class="issueArticleSectionType">
<p class="normal-text">${articles[results[b]].section}</p>
<p class="normal-text">${articles[results[b]].type}</p>
</div>
<h2 id="ia${articles[results[b]].id}" class="h3 normal-title">${
      articles[results[b]].title
    }</h2>
<p class="issueArticleAuthors">${articles[results[b]].authors.join(", ")}</p>
<p class="issueArticleCitation">Odontom ${citation}:${
      articles[results[b]].pages
    }. First Online: ${onlineDate}.</p>
<div>
<a href="article.html" data-issue="${issueTypeCheck(
      articles[results[b]].volume,
      articles[results[b]].issueSerial
    )}" data-article="${
      articles[results[b]].id
    }" class="btn collectArticleLink"><i class="fas fa-file-text"></i> Full-Text HTML</a>
</div>
</div>`;
  }
  container.innerHTML = resultHTML;
}

/* +++++++++++++++++++++++ end of search +++++++++++++++++++++++ */

/* +++++++++++++++++++ copy to clipboard +++++++++++++++++++ */
const copyBtns = document.querySelectorAll("#copyToClipboard");
if (copyBtns) {
  if (copyBtns.length > 0) {
    for (let d = 0; d < copyBtns.length; d++) {
      copyBtns[d].addEventListener("click", function () {
        navigator.clipboard.writeText(copyBtns[d].dataset.copy);
      });
    }
  }
}
/* +++++++++++++++ end of copy to clipboard +++++++++++++++ */
