var more = document.getElementsByClassName("more");
var edit_card = document.getElementById("edit-delete");
var plus = document.getElementsByClassName("plus");
var add_card = document.getElementById("add-card");
// var add_button = document.getElementsByClassName("add-button");
var give_button = document.getElementsByClassName("give-up");

var add_title = document.getElementById("add-title");
var add_content = document.getElementById("add-content");
var add_date = document.getElementById("add-date");
var content_box = document.getElementById("content-box");
var alertIcon = document.querySelector("span");
// let recorder = 0;

let thisUpdateCard;
let formStatus = "insert";
const selectedUserList = [];

function edit_hide() {
  if (edit_card.style.display === "none") {
    edit_card.style.display = "flex";
  } else {
    edit_card.style.display = "none";
  }
}

function new_todo() {
  formStatus = "insert";
  add_show();
}
//<------------personel id name img alma----------->
function add_show() {
  userList.forEach((v, i) => {
    let userOption = `<li data-id='${v.user_id}'>
      <img class='user-image' src="image/${v.user_image_path}" />
      <span class='user-name'>${v.user_name}</span>
    </li>`;
    $("#userList").append(userOption);
  });
  $("#addCardModal").removeClass("d-none");
}

function add_hide() {
  $(".alert-icon").addClass("d-none");
  $("#addCardModal").addClass("d-none");
  clear_add();
}

function uyarı() {
  $("#addCardModal .input-form").each((i, v) => {
    let inputValue = $(v).val();
    if (inputValue == "") {
      $(v).siblings(".alert-icon").removeClass("d-none");
    } else {
      $(v).siblings(".alert-icon").addClass("d-none");
    }
  });
}

$("#add-button").on("click", function () {
  var cardTitle = $("#add-title").val().trim();
  var cardContent = $("#add-content").val().trim();
  var cardDate = $("#add-date").val().trim();
  var cardSelcet = $("#add-select").html().trim();

  //<------boş değer kontrol card ekle ekleme ----------->
  if (
    cardTitle == "" ||
    cardContent == "" ||
    cardDate == "" ||
    cardSelcet == ""
  ) {
    uyarı();
    return;
  }
  let diffInDays = dateComparison(cardDate);
  let dateStatus;
  if (diffInDays > 3) {
    dateStatus = "success";
    //warningIcons.style.display = "none";
  } else if (diffInDays <= 3 && diffInDays >= 0) {
    dateStatus = "warning";
    //warningIcons.style.display = "inline";
  } else if (diffInDays < 0) {
    dateStatus = "error";
    //warningIcons.style.display = "inline";
  }

  if (formStatus == "insert") {
    let userItemGroup = "";

    $(selectedUserList).each((i, v) => {
      let userItem = `
        <div class="avatar">
            <img title='${v.user_name}' src='${v.user_img}'/>
          </div>
      `;
      userItemGroup += userItem;
    });

    var card = `
   <div id="cardId" class="card" draggable="true" data-state="todo">
      <div class="card-header">
        <h6 class="card-title">${cardTitle}</h6>
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="ri-more-fill"></i>
          </button>
          <ul class="dropdown-menu">
            <li>
            <a class="dropdown-item edit-card" href="#">Düzenle
             <i class="ri-edit-line"></i>
             </a>
            </li>
            <li >
            <a class="dropdown-item delete-card" href="#">Sil 
            <i class="ri-delete-bin-line"></i>
            </a>
            </li>
          </ul>
        </div>
			</div>
      <div class="card-body">
        <p id="card-text"  data-fulltext="${cardContent}" class="card-content" onclick="toggleText(this)">${
      cardContent.length > 60
        ? cardContent.substring(0, 60) + "..."
        : cardContent
    }</p>
        <div class="avatar-group">
         
                ${userItemGroup}
          <div class="hidden-avatars">
            +10
          </div>
        </div>
        <p href="#" class="card-date ${dateStatus}">
         
          <i class="ri-error-warning-fill warning-icon ${
            dateStatus === "success"
              ? "d-none"
              : dateStatus === "warning"
              ? "d-inline"
              : dateStatus === "error"
              ? "d-inline"
              : ""
          }
              " style="color: red; font-size: 14px;"></i> 
        <span>${cardDate}</span>
        </p>
      </div>
    </div>
    `;

    content_box.innerHTML += card;
    countCard();
  }
  if (formStatus == "update") {
    $(thisUpdateCard).find(".card-title").text(cardTitle);
    $(thisUpdateCard).find(".card-content").text(cardContent);
    $(thisUpdateCard)
      .find(".card-date")
      .removeClass("success error warning")
      .addClass(dateStatus);
    $(thisUpdateCard).find(".card-date span").text(cardDate);

    $(thisUpdateCard)
      .find(".warning-icon")
      .removeClass("d-none d-inline")
      .addClass(dateStatus == "success" ? "d-none" : "d-inline");
  }
  add_hide();
});

function clear_add() {
  $("#add-title").val("");
  $("#add-content").val("");
  $("#add-date").val("");
  $("#add-select").empty();
  $(".selected-placeholder").removeClass("d-none");
  selectedUserList.splice(0, selectedUserList.length); // diziyi temizler
}

function toggleText(element) {
  let dataText = $(element).data("fulltext");
  if (dataText.length > 60) {
    $("#todoDetail .modal-body p").text(dataText);
    $("#todoDetail").modal("show");
  }
}
//<-------card silme--------------->
let $thisBtn;
$("body").on("click", ".delete-card", function () {
  let $this = $(this);
  let $thisParentEl = $this.parents().eq(4);
  deleteCard($thisParentEl);
});

function deleteCard(card) {
  $(card).remove();
  dateComparison();
}

$("body").on("click", ".edit-card", function () {
  thisUpdateCard = $(this).parents().eq(4);
  let card_title = $(thisUpdateCard).find(".card-title").text();
  let card_content = $(thisUpdateCard).find(".card-content").text();
  let card_date = $(thisUpdateCard).find(".card-date").text();

  setUpdateModal(card_title, card_content, card_date);
  formStatus = "update";
});

//<----------- Tarih formatını Dönüştürme -------------->
function setUpdateModal(param1, param2, param3) {
  $(add_title).val(param1);
  $(add_content).val(param2);
  var yeniTarih = new Date(param3); // Örnek bir tarih
  var formatliTarih = formatDate(yeniTarih);

  $(add_date).val(formatliTarih);
  add_show();
  //dateComparison();
}
function formatDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0"); // Ayı iki haneli olarak al
  var day = String(date.getDate()).padStart(2, "0"); // Günü iki haneli olarak al
  return year + "-" + month + "-" + day;
}

//---------SÜRÜKLEME İŞLEMİ---------------->
var cards = document.querySelectorAll(".card");
cards.ondragstart = "event.dataTransfer.setData('text/plain',null)";
var selected;
document.addEventListener("dragstart", function (e) {
  selected = e.target;
});
document.addEventListener("dragover", function (e) {
  e.preventDefault();
});
document.addEventListener("drop", function (e) {
  e.preventDefault();

  if (e.target.className == "box-content") {
    let parentEl = e.target;
    let parentElState = $(parentEl).prop("id");

    if (parentElState === "content-box") {
      $(selected).data("state", "todo");
    }
    if (parentElState === "boxDoing") {
      $(selected).data("state", "doing");
    }
    if (parentElState === "boxDone") {
      $(selected).data("state", "done");
    }
    countCard();
    selected.parentNode.removeChild(selected);
    e.target.appendChild(selected);
  }
});

//<----------- Personel listesi SELECT-OPTİON ------------->
const selector = document.getElementById("selector");
const list = document.getElementById("userlist");
const option = document.getElementById("option");
const selectText = document.getElementById("select-text");
const options = document.querySelectorAll("#list li");

$("body").on("click", "#userList li", function () {
  let userName = $(this).find(".user-name").text();
  let userImage = $(this).find(".user-image").prop("src");
  let userId = $(this).data("id");

  const isUserIdInArray = selectedUserList.some(
    (item) => item.user_id === userId
  );
  if (!isUserIdInArray) {
    $(".selected-placeholder").addClass("d-none");
    let userObj = { user_id: userId, user_name: userName, user_img: userImage };
    let writeUserOption = `<span>${userObj.user_name}</span>`;

    $(".selected-options").removeClass("d-none");
    $(".selected-options").append(writeUserOption + ",");

    selectedUserList.push(userObj);
  } else {
    alert("seçildi!");
    return;
  }
});

$(".selected").on("click", function () {
  let $selectedMenu = $(".selected-menu");
  if (formStatus == "update") {
  }
  $selectedMenu.toggleClass("d-none");
});

//<---------icone popever eklme-------->
$(document).ready(function () {
  $(".alert-icon").hover(
    function () {
      $(this).find(".popover").fadeIn();
    },
    function () {
      $(this).find(".popover").fadeOut();
    }
  );
});

function dateComparison(card_date) {
  var currentDate = new Date();
  var cardDate = new Date(card_date);

  return Math.floor((cardDate - currentDate) / (1000 * 60 * 60 * 24) + 1);

  //var warningIcons = document.querySelector(".warning-icon");
  // var cardDates = document.querySelector(".card-date");
}
