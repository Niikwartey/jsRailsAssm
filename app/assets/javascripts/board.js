// $(document).on('page:fetch', function() { 
$(document).on('ready', function() {
  createBoard();
  createList();
  createCard();
  getBoards();
});

  var AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');
function increaseWidth(elm, inc) {
  var width = parseInt(elm.style.width)
  elm.style.width = (width + inc) + 'px';
}

// CREATE CARD
function createCard() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $('#lists').on("submit", "#new_card", function(e) {
  // $(document).on("submit", "#new_card", function(e) {
  // $(".list.ui-sortable-handle").on("submit", "#new_card", function(e) {
    e.preventDefault(); 
    e.stopPropagation();
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();
    var form = $(this);
    $.post('/cards/', params).done(function(card) {
      form.find('input[type=text]').val("");
      // debugger
      //
      form.parent().find('.cards.sortable.ui-sortable').append($(
        `
          <div class="card ui-sortable-handle"> 
            <p class="card-content">${card.content}</p>
            <div class="collaborators">
            </div>
          </div>
        `
      ))
    })
  });
}

// CREATE LIST
class List {
  constructor(list) {
    this.title = list.title
    this.position = list.position
    this.id = list.id
    this.cards = list.cards
  }

  cardsCount() {
    return this.cards.length;
  }
}

function createList() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $("#new_list").on("submit", (function(e) {
    e.preventDefault();
    e.stopPropagation();
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();


    $.post('/lists/', params).done(function(list) {
      var listObj = new List(list);
      $('#new_list input[type=text]').val("");
      
      var listsColumn = document.getElementById("lists-column");
      
      $('#lists').append($(
        `<div class="list ui-sortable-handle">
          <h5>${listObj.title}</h5>
          <div class="cards sortable ui-sortable">
          </div>
          <form class="new_card" id="new_card" action="/cards" accept-charset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓">
            <input value="${listObj.id}" type="hidden" name="card[list_id]" id="card_list_id">
            <input placeholder="Add a card..." required="required" class="transparent-input card input" type="text" name="card[content]" id="card_content"></form></div>`
      ));
      increaseWidth(listsColumn, 228);
    })
  }));
}

// CREATE BOARD
function createBoard() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $("#new_board").on("submit", (function(e) {
    e.preventDefault();
    e.stopPropagation();
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();

    $.ajax({
      url: "/boards/create",
      type: "POST",
      data :params,
      success: function(board) {
        $('#board_name').val("");
        $('#boards').prepend($(
        `<a href="/users/${board.user_id}/boards/${board.id}">
          <div class="board-tile four wide column" style="background: ${board.color}">
            <p>${board.name}</p>
          </div>
        </a>`).fadeIn('slow'))
      },
      error: function() {
       alert('error');
      }
    });

  }));
}

// GET BOARDS
class Board {
  constructor(id, name, color, user_id) {
    this.id = id
    this.user_id = user_id
    this.name = name
    this.color = color 
  }

  boardRender() {
    return `
    <a href="/users/${this.user_id}/boards/${this.id}">
      <div class="board-tile four wide column" style="background: ${this.color}">
        <p> ${this.name} </p>
      </div>
    </a>
    `
  }
}

function getBoards() {
  if (($(location).attr('href') === "http://localhost:3000/") || ($(location).attr('href') === "https://protected-coast-18057.herokuapp.com/")) {
    
    $.ajax({
      url: "/boards/index", 
      type: 'GET'
    }).done(function(boards){
      var len = boards.length;
      for (var i = 0, len; i < len; i++) {
        var boardObj = new Board(boards[i].id, boards[i].name, boards[i].color, boards[i].user_id)
        $('#boards').prepend($(
          boardObj.boardRender()
        ).fadeIn("slow"))
      } 
    })
  } 
}
