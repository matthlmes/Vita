 // PROFILE PIC SUBNAV - BILLY
function openCreatePostProfile() {
    document.getElementById("createPostPopUpProfile").style.display = "block";
}
  
function closeCreatePostProfile() {
    document.getElementById("createPostPopUpProfile").style.display = "none";
}

let menuOpen = 0;

function openUserMenu(){
    document.getElementById("userMenu").style.display = "block";
}

function closeUserMenu(){
    document.getElementById("userMenu").style.display = "none";
}

function operateMenu(){
    let menu = document.getElementById("userMenu");

    if(menuOpen == 0){
        openUserMenu();
        menuOpen = 1;
    }else{
        closeUserMenu();
        menuOpen = 0;
    }
}

// CREATE POST POPUP - STUART
function openCreatePost() {
    document.getElementById("createPostPopUp").style.display = "block";
}
  
function closeCreatePost() {
    document.getElementById("createPostPopUp").style.display = "none";
}

// VIEW BLOGS ADMIN DASHBOARD - STUART
function openViewBlogs() {
    document.getElementById("adminNav").style.display = "none";
    document.getElementById("viewBlogTable").style.display = "block";
}
  
function closeViewBlogs() {
    document.getElementById("viewBlogTable").style.display = "none";
    document.getElementById("adminNav").style.display = "flex";
}




