"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


// functions for when user clicks navbar links

// submit navbar
function youClickedOnSubmitLink (evt){
  console.debug("youClickedOnSubmitLink",evt);

  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
  
}

$navSubmitLink.on("click",youClickedOnSubmitLink);


// favorite navbar
function youClickedOnFavoriteLink(evt){
  console.debug("youClickedOnFavoriteLink",evt);

  hidePageComponents();
  putFavoriteStoryOnPage();
}

$body.on("click", "#nav-favorites", youClickedOnFavoriteLink);

function youClickedOnMyStories(evt){
  console.debug("youClickedOnMyStories",evt);

  hidePageComponents();
  myStoryPage();
  $myStoryList.show();
}

$body.on("click","#nav-my-stories",youClickedOnMyStories);