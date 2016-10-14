$( document ).on('turbolinks:load', function() {

  $('#lists-column').sortable({
    // connectWith: ".lists-column",
    items: ".list"
  })

  $(".cards").sortable({
    connectWith: ".sortable",
    // items: ".card"
  })

  $( ".cards" ).disableSelection();

  $('.ui.dropdown').dropdown({action:'nothing'});

  $('.ui.sidebar').sidebar({
    context: $('.pushable'),
    dimPage: false
  }).sidebar('setting', 'transition', 'overlay').sidebar('attach events', '.item.sidebar-toggler');

  // $('.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');

  createBoard();
  createList();
  createCard();
  getBoards();

});

// $(function () {

// });

class List {
  constructor(id, title, position, cards) {
    this.title = title
    this.position = position
    this.id = id
    this.cards = cards
  }

  cardsCount() {
    return this.cards.length
  }
}


function increaseWidth(elm, inc) {
  var width = parseInt(elm.style.width)
  elm.style.width = (width + inc) + 'px';
}

// CREATE CARD

function createCard() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $(document).on("submit", "#new_card", function(e) {
    e.preventDefault(); 
    e.stopPropagation()
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();
    var form = $(this)
    $.post('/cards/', params).done(function(card) {
      form.find('input[type=text]').val("")
      // debugger
      form.parent().find('.cards').append($(
        `
        <div class="card">
          <p class="card-content">${card.content}</p>

          <div class="collaborators">
          </div>
        </div>
        `
      ).fadeIn('slow'))
    })

  });
}

// CREATE LIST

function createList() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $("#new_list").on("submit", (function(e) {
    e.preventDefault() 
    e.stopPropagation()
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();

    $.post('/lists/', params).done(function(list) {
      var listObj = new List(list.id, list.title, list.position, list.cards)

      $('#new_list input[type=text]').val("")
      
      var listsColumn = document.getElementById("lists-column");
      
      $('#lists').append($(
        `
        <div class="list">
          <h5>${listObj.title} - ${listObj.cardsCount()} cards</h5>

          <div class="cards sortable">
          </div>

          <form class="new_card" id="new_card" action="/cards" accept-charset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓">
            <input value="${listObj.id}" type="hidden" name="card[list_id]" id="card_list_id">
            <input placeholder="Add a card..." required="required" class="transparent-input card input" type="text" name="card[content]" id="card_content">
          </form>
        </div>
        `
      ).fadeIn('slow'))
      increaseWidth(listsColumn, 228)
    })

  }));
}



// CREATE BOARD

function createBoard() {
  // $("#new_board").off('submit').on("submit", (function(e) {
  $("#new_board").on("submit", (function(e) {
    e.preventDefault() 
    e.stopPropagation()
    // var board_name = $('#board_name').val()
    var params = $(this).serialize();

    $.ajax({
      url: "/boards/create",
      type: "POST",
      data :params,
      success: function(board) {
        $('#board_name').val("")
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


function getBoards() {
  if ($(location).attr('href') === "http://localhost:3000/") {
    
    $.ajax({
      url: "/boards/index", 
      type: 'GET'


    }).done(function(boards){
      var len = boards.length 
      for (var i = 0, len; i < len; i++) {
        var boardObj = new Board(boards[i].id, boards[i].name, boards[i].color, boards[i].user_id)
        $('#boards').prepend($(
          boardObj.boardRender()
        ).fadeIn("slow"))

      } 
    })
  } 
}


class Board {
  constructor(id, name, color, user_id) {
    this.id = id
    this.user_id = user_id
    this.name = name
    this.color = color 
  }

  boardRender() {
    return  `
    <a href="/users/${this.user_id}/boards/${this.id}">
      <div class="board-tile four wide column" style="background: ${this.color}">
        <p> ${this.name} </p>
      </div>
    </a>
    `
  }
}


























