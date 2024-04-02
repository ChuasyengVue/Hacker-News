"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);


  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      <div> 
      ${showDeleteBtn ? deleteBtn(): ""}
      ${showStar ? makeStar(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Navbar links ***********************************

// When users hit submit form

async function userSubmittedForm(evt){
  console.debug("userSubmittedForm");
  evt.preventDefault();

  const title = $("#creating-title").val();
  const url = $("#creating-url").val();
  const author = $("#creating-author").val();
  const username = currentUser.username;
  const storyData = {title, author, url, username};

  const story = await storyList.addStory(currentUser, storyData);

  const newStory = generateStoryMarkup(story);
  $allStoriesList.prepend(newStory);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", userSubmittedForm);


// When users click Favorite link to add to page **********************

function putFavoriteStoryOnPage(){
  console.debug("putFavoriteStoryOnPage");

  $favoriteStoriesList.empty();

  if(currentUser.favorites.length === 0){
    $favoriteStoriesList.append("<h5>No Favorite Stories </h5>");
  }
  else{
    for(let story of currentUser.favorites){
      const newStory = generateStoryMarkup(story);
      $favoriteStoriesList.append(newStory);
    }
  }
  $favoriteStoriesList.show();
}

// adding the switch for favoriting and unfavoriting story

async function switchForFavoriteStory(evt){
  console.debug("switchForFavoriteStory");

  const trget = $(evt.target);
  const nextToLi = trget.closest("li");
  const storyId = nextToLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if(trget.hasClass("fas")){
    await currentUser.removingFavorite(story);
    trget.closest("i").toggleClass("fas far");
  }
  else{
    await currentUser.addingFavorite(story);
    trget.closest("i").toggleClass("fas far");
  }
}

$storyList.on("click",".star",switchForFavoriteStory);

// add the star image

function makeStar (story,user){
  const starFavorite = user.starFavorite(story);
  const starType = starFavorite ? "fas" : "far";
  return `
  <span class="star"> 
    <i class="${starType} fa-star"></i>
    </span>`;
}

// When user click my stories*************************************

function myStoryPage(){
  console.debug("myStoryPage");

  $myStoryList.empty();
  
  if(currentUser.ownStories.length === 0){
    $myStoryList.append("<h5> No Stories Added! </h5>");
  }
  else{
    for(let story of currentUser.ownStories){
      const newStory = generateStoryMarkup(story,true);
      $myStoryList.append(newStory);
    }
  }
  $myStoryList.show();
}

function addingStoriesToPage(){
  console.debug("addingStoriesToPage");

  $myStoryList.empty();
  
  for(let story of storyList.stories){
    const newStory = generateStoryMarkup(story);
    $allStoriesList.append(newStory);
  }
  $myStoryList.show();
}

function deleteBtn(){
  return `<span class="trash-can">
  <i class=" fas fa-trash-alt"></i>
  </span>`;
}

async function deletingStory(evt){
  console.debug("deletingStory");

  const nextToLi = $(evt.target).closest("li");
  const storyId = nextToLi.attr("id");

  await storyList.removingStory(currentUser, storyId);

  await myStoryPage();
}

$myStoryList.on("click", ".trash-can", deletingStory);

