var tempData = [],
  data = [],
  pagedData = [];
var taskId = 0,
  currentPage = 1,
  noOfTask = 6,
  delIndex,
  from, //starting point of slicing data array
  to, // Ending point of slicing data array
  oldPageAnchor, // current page.
  newPageAnchor; // future current page. Both changes dynamically on clicking
var text = "",
  count = 0;
$(document).ready(() => {
  $("#date").on("click", () => {
    setTimeout(() => {
      $(".start").html(`${$("#date").val()}`);
      console.log($(".start").html());
    }, 3000);
  });
  $("#taskTitle").on("keyup", () => {
    $(".title").html(`${$("#taskTitle").val()}`);

    if ($("#task").val() != "" && $("#taskTitle").val() != "") {
      $(".addeventatc, #date").removeAttr("disabled");
      console.log("dis");
    } else {
      $(".addeventatc, #date").attr("disabled", "disabled");
      console.log("sid");
    }
  });
  $("#task").on("keyup", () => {
    $(".description").html(`${$("#task").val()}`);
    if ($("#task").val() != "" && $("#taskTitle").val() != "") {
      $(".addeventatc, #date").removeAttr("disabled");
      console.log("dis");
    } else {
      $(".addeventatc, #date").attr("disabled", "disabled");
      console.log("sid");
    }
  });

  if ($("#task").val() != "" && $("#taskTitle").val() != "") {
    $(".addeventatc").removeAttr("disabled");
    console.log("dis");
  } else $(".addeventatc").attr("disabled", "disabled");

  $("#add").click(() => {
    if ($("#task").val() != "" && $("#taskTitle").val() != "") {
      data.push({
        id: `${taskId}`,
        date: $("#date").val(),
        name: $("#name").val(),
        taskTitle: $("#taskTitle").val(),
        taskContent: $("#task").val(),
        priority: $("input[type='radio'][name='priority']:checked")
          .val()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        state: "pending",
        isCheck: false,
      });
      for (let i = 0; i < data.length; ++i) tempData[i] = data[i];
      taskId++;
      showPageNav();
      showPage(currentPage);
      newPageAnchor = document.getElementById("pg" + currentPage);
      newPageAnchor.className = "pg-selected";
      $(".addeventatc, #date").attr("disabled", "disabled");
      console.log("Original data");
      console.log(data);
      console.log("Temp data");
      console.log(tempData);
    } else {
      toastr.error("All fields are required");
    }
  });
});

//-------------------------------Function to get index to pass in modal-------------------------------//

function delData(index) {
  delIndex = index;
}

//---------------------------------Delete Details Modal Function-----------------------------------//
function deleteData(index) {
  for (let i = 0; i < data.length; ++i) {
    if (data[i].id == tempData[index].id) {
      data.splice(i, 1);
    }
  }

  tempData.splice(index, 1);
  count--;
  showPageNav();
  if (tempData.length % noOfTask == 0 && pagedData.length == 1)
    showPage(Math.ceil(tempData.length / noOfTask));
  else showPage(currentPage);
  if (data.length == 0) {
    $(".tabContent").html("<h1>No Task Found</h1>");
  }
  console.log("Original data");
  console.log(data);
  console.log("Temp data");
  console.log(tempData);
}

function check(index) {
  $("#date").removeAttr("disabled");
  $(".addeventatc").removeAttr("disabled");
  $("#date").css("color", '"white" !important');
  tempData[index].isCheck = !tempData[index].isCheck;
  console.log(tempData[index].isCheck);
  $(".description").html("");
  text = "";
  fetchText = [];
  count = 0;

  for (let i = 0; i < tempData.length; i++) {
    if (tempData[i].isCheck == true) {
      text += tempData[i].taskContent + "<br>";
      ++count;
    }
  }
  if (count == 0) {
    $("#date").attr("disabled", "disabled");
    $(".addeventatc").attr("disabled", "disabled");
    $("#date").css("color", "rgb(177, 177, 177) !important");
  }
  $(".description").html(text);
}

//--------------------------------------------- Printing Tasks ---------------------------------------------//
function showTask(array) {
  $(".tabContent").html("");
  for (let i = 0; i < array.length; ++i) {
    $(".tabContent").append(
      `<div
        class=" col-md-4 taskWrapper"
        id="task${(currentPage - 1) * noOfTask + i + 1}"
      >
        <div class="task h-100 w-100 row mx-0">
          <div class="taskHeading row mx-0 w-100">
            <div class=" operations thTaskTitle col-8 text-white" data-toggle="tooltip" data-placement="top">
              <span>${array[(currentPage - 1) * noOfTask + i].taskTitle}</span>
            </div>
            <div class=" operations taskReminder col-3 text-white">
              <input type="checkbox" class="check" onclick="check(${
                (currentPage - 1) * noOfTask + i
              })">
            </div>
            
            <div class="operations thEllipsis col-1 text-white"> 
              <div class="btn-group">
                <button
                  type="button"
                  class="ellipsisBtn"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-ellipsis-vertical w-100"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right">
                  <!-- <a
                    class="dropdown-item"
                    id="check${(currentPage - 1) * noOfTask + i}"
                    class="check" onclick="check(${
                      (currentPage - 1) * noOfTask + i
                    })"
                  >
                    <i class="fa-solid fa-square-check"></i> Select
                  </a> -->
                  <a
                    class="dropdown-item"
                    id="remove${(currentPage - 1) * noOfTask + i}"
                    onclick="delData(${(currentPage - 1) * noOfTask + i})"
                    data-toggle="modal"
                    data-target="#removeModal"
                  >
                    <i class="fa-solid fa-trash"></i> Delete
                  </a>
                  <a
                    class="dropdown-item"
                    id="done${(currentPage - 1) * noOfTask + i}"
                    onclick="done(${(currentPage - 1) * noOfTask + i})"
                  >
                    <i class="fa-solid fa-check "></i> Done
                  </a>
                  <a
                    class="dropdown-item"
                    id="edit${(currentPage - 1) * noOfTask + i + 1}"
                    onclick="editData(${(currentPage - 1) * noOfTask + i})"
                    data-toggle="modal"
                    data-target="#editModal"
                  >
                    <i class="fa-solid fa-edit"></i> Edit
                  </a>

                </div>
              </div>
            </div>
          </div>
          <div class="row taskContent w-100 mx-0" onclick="viewDetails(${
            (currentPage - 1) * noOfTask + i
          })" data-toggle="modal"
          data-target="#infoModal"
          data-toggle="tooltip"
          data-placement="left"
          >
            <span>${array[i].taskContent}</span>
          </div>
        </div>
      </div>`
    );
    $(`#task${i + 1} .thTaskTitle`).attr(
      "title",
      $(`#task${i + 1} .thTaskTitle`).text() +
        " " +
        $(`#task${i + 1} .thPriority`).text()
    );
    $(".thTaskTitle").tooltip();
    $(`#task${i + 1} .taskContent`).attr(
      "title",
      $(`#task${i + 1} .taskContent`).text()
    );
    $(".taskContent").tooltip();

    if (array[i].state == "completed")
      $(`#task${(currentPage - 1) * noOfTask + i + 1} .taskHeading`).css(
        "background-image",
        "linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%)"
      );
    else
      $(`#task${(currentPage - 1) * noOfTask + i + 1} .taskHeading`).css(
        "background-image",
        "linear-gradient(315deg, #ffac93 0%, #e58484 74%)"
      );
  }
}

function viewDetails(index) {
  $("#showInfo").html(
    `<div class="container">
      <div class="viewDate row mx-0 w-100"><p>Date : ${tempData[index].date}</p></div>
      <div class="viewName row mx-0 w-100"><p>Title : ${tempData[index].taskTitle}</p></div>
      <div class="viewTask row mx-0 w-100"><p>Task : ${tempData[index].taskContent}</p></div>
      <div class="viewPriority row mx-0 w-100"><p>Priority : ${tempData[index].priority}</p></div>
    </div>`
  );
  if (tempData[index].state == "completed")
    $("#showInfo").css("border", "3px solid #00FFC6 !important");
  else $("#showInfo").css("border", "3px solid #F94C66 !important");
}
function editData(index) {
  delIndex = index;
  if (tempData[index].priority == "regular")
    $("edRegular").prop("checked", "checked");
  else $("edImportant").attr("checked", "checked");
  $("#editInfo").html(
    `<div class="container">
      <form class="p-3 pb-0 text-white">
                        <div class="form-group">
                        <label for="date">Date : </label>
                            <input type="datetime-local" id="date" class="form-control edDate" value="${tempData[index].date}" disabled />
                        </div>
                        <div class="form-group">
                        <label for="taskTitle">Task</label>
                        <input type="text" id="taskTitle" class="form-control edTaskTitle" placeholder="Enter Title Here" value="${tempData[index].taskTitle}"/>
                        </div>
                        <div class="form-group">
                            <label for="task" class="form-label">Task :</label>
                            <input type="text" id="task" class="form-control edTask " placeholder="Enter Task/Event Here" value="${tempData[index].taskContent}" />
                        </div>
                    </form>
    </div>`
  );
}

function updateData(index) {
  //modal will not close unless you fill all data
  tempData[index].date = $(".edDate").val();
  tempData[index].taskTitle = $(".edTaskTitle").val();
  tempData[index].taskContent = $(".edTask").val();
  showRecords(from, to);
}
var comp;
function done(index) {
  data[index].state = "completed";
  tempData[index].state = "completed";

  tempData.push({
    id: tempData[index].id,
    date: tempData[index].date,
    name: tempData[index].name,
    taskTitle: tempData[index].taskTitle,
    taskContent: tempData[index].taskContent,
    priority: tempData[index].priority,
    state: tempData[index].state,
    isCheck: tempData[index].isCheck,
  });
  tempData.splice(index, 1);
  for (let i = 0; i < tempData.length; i++) {
    data[i] = tempData[i];
  }
  // tempData[tempData.length]=comp;
  showPageNav();
  showPage(currentPage);
  console.log("original data after done");
  console.log(data);
  console.log("Temp data after done");
  console.log(tempData);
}

function remindedTask() {
  $(".tabContent").html("");
  $("#reminder").css({
    "background-image":
      "linear-gradient(90deg, rgba(248,141,255,1) 0%, rgba(255,242,88,1) 100%)",
    color: "white",
  });
  $("#all, #completed,#pending").css({
    background: "rgba(93, 73, 84, .3)",
  });
  $(".tabContent").html(
    `<pre id="content" style="white-space: pre-wrap; color:white; font-size:18px;"></pre>`
  );
  handleAuthClick();
  // tempData = [];
}
function pendingTask() {
  $(".tabContent").html("");
  $("#pending").css({
    "background-image": "linear-gradient(315deg, #feae96 0%, #fe0944 74%)",
    color: "white",
  });
  $("#all, #completed, #reminder").css({
    background: "rgba(93, 73, 84, .3)",
  });
  tempData = data.filter((item) => {
    return item.state.includes("pending");
  });
  if (tempData.length == 0) {
    $(".tabContent").html("No Task Pending");
    $("#paginationWrapper").css("visibility", "hidden"); 

    // return false;
  } else {
    $("#paginationWrapper").css("visibility", "visible"); 

    showPageNav();
    showPage(1);
  }
  console.log("original data after pending");
  console.log(data);
  console.log("Temp data after pending");
  console.log(tempData);
  //   task = [];
  //   for (let i = 0; i < allTask.length; ++i){
  //     if (allTask[i].state == "pending")
  //       task.push(allTask[i]);
  //   }
  //   printTask(task);
  //   console.log("pending");
}
function completedTask() {
  $("#completed").css({
    "background-image": "linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%)",
    color: "white",
  });
  $("#all, #pending, #reminder").css({
    background: "rgba(93, 73, 84, .3)",
  });
  tempData = data.filter((item) => {
    return item.state.includes("completed");
  });
  if (tempData.length == 0) {
    $(".tabContent").html("No Task Completed");
    $('#paginationWrapper').css("visibility","hidden"); 
    // return false;
  } else {
    $("#paginationWrapper").css("visibility", "visible"); 

    showPageNav();
    showPage(1);
  }
  console.log("original data after complete");
  console.log(data);
  console.log("Temp data complete");
  console.log(tempData);
  //   task = [];
  //   for (let i = 0; i < allTask.length; ++i) {
  //     if (allTask[i].state == "completed") task.push(allTask[i]);
  //   }
  //   printTask(task);
  //   console.log("pending");
}
function allTask() {
  $("#all").css({
    "background-image": "linear-gradient(315deg, #7f53ac 0%, #647dee 74%)",
    color: "white",
  });
  $("#pending, #completed, #reminder").css({
    background: "rgba(93, 73, 84, .3)",
  });
  for (let i = 0; i < data.length; ++i) tempData[i] = data[i];
  if (tempData.length == 0) {
    $(".tabContent").html("No task here");
    $("#paginationWrapper").css("visibility", "hidden"); 

  } else {
    $("#paginationWrapper").css("visibility", "visible"); 

    showPageNav();
    showPage(1);
  }
  console.log("original data after all");
  console.log(data);
  console.log("Temp data after all");
  console.log(tempData);
}

function showRecords(from, to) {
  // Changing cursor to blocked on next prev first last button according to current page.
  if (Math.ceil(tempData.length / noOfTask) > 1) {
    if (from == 0) {
      $("#pg-prev").css("cursor", "not-allowed");
      $("#pg-first").css("cursor", "not-allowed");
      $("#pg-next").css("cursor", "pointer");
      $("#pg-last").css("cursor", "pointer");
    } else if (tempData.length <= to) {
      $("#pg-next").css("cursor", "not-allowed");
      $("#pg-last").css("cursor", "not-allowed");
      $("#pg-prev").css("cursor", "pointer");
      $("#pg-first").css("cursor", "pointer");
    } else {
      $("#pg-prev").css("cursor", "pointer");
      $("#pg-first").css("cursor", "pointer");
      $("#pg-next").css("cursor", "pointer");
      $("#pg-last").css("cursor", "pointer");
    }
  } else {
    $("#pg-prev").css("cursor", "not-allowed");
    $("#pg-first").css("cursor", "not-allowed");
    $("#pg-next").css("cursor", "not-allowed");
    $("#pg-last").css("cursor", "not-allowed");
  }

  //Data that will be on page.
  pagedData = tempData.slice(from, to);
  console.log("paged data");
  console.log(pagedData);
  //calling showTable function to print table data.
  showTask(pagedData);
  console.log("helo");
}
//------------------------------------------ For Current page OR switching pages ------------------------------------//
function showPage(pageNumber) {
  if (tempData.length != 0) {
    //checking if oldPageAnchor becomes null.
    //For search cases where no.of searched pages are less than total pages.
    if (currentPage <= Math.ceil(tempData.length / noOfTask)) {
      oldPageAnchor = document.getElementById("pg" + currentPage);
      oldPageAnchor.className = "pg-normal";
    }
    currentPage = pageNumber; //changing current page.
    //Updating pagination bar
    showPageNav();
    newPageAnchor = document.getElementById("pg" + currentPage);
    newPageAnchor.className = "pg-selected";
    from = (pageNumber - 1) * noOfTask;
    to = parseInt((pageNumber - 1) * noOfTask) + parseInt(noOfTask);

    // Showing data in array
    showRecords(from, to);
  }
}

// For jumping directly on First page | << |
function firstPage() {
  showPage(1);
}

// For previous page
function prev() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}

// For next page
function next() {
  if (currentPage < tempData.length / noOfTask) {
    showPage(currentPage + 1);
  }
}

// For jumping directly on Last page | >> |
function lastPage() {
  showPage(Math.ceil(tempData.length / noOfTask));
}

//------------------------------------------------- For pagination bar ---------------------------------------//
function showPageNav() {
  var pagerHtml =
    '<span onclick="firstPage()" id="pg-first" class="pg-normal"><<</span>' + // | << |
    '<span onclick="prev()" id="pg-prev" class="pg-normal">Prev</span>'; // | Prev |
  if (Math.ceil(tempData.length / noOfTask) > 5) {
    if (currentPage >= 4) {
      pagerHtml +=
        '<span id="pg1"' +
        'class="pg-normal"' +
        'onclick="showPage(1)">' +
        "1" +
        "</span> " +
        '<span id="other"' +
        'class="pg-normal">' +
        "..." +
        "</span> ";
      if (currentPage <= Math.ceil(tempData.length / noOfTask) - 4) {
        for (var page = currentPage - 1; page <= currentPage + 1; page++) {
          pagerHtml +=
            '<span id="pg' +
            page +
            '" class="pg-normal" onclick="showPage(' +
            page +
            ')">' +
            page +
            "</span> ";
        }
        pagerHtml +=
          '<span id="other"' + 'class="pg-normal">' + "..." + "</span> "; // | ... |
        pagerHtml +=
          '<span id="pg' +
          Math.ceil(tempData.length / noOfTask) +
          '" class="pg-normal" onclick="showPage(' +
          Math.ceil(tempData.length / noOfTask) +
          ')">' +
          Math.ceil(tempData.length / noOfTask) +
          "</span> ";
      } else {
        for (
          var page = Math.ceil(tempData.length / noOfTask) - 4;
          page <= Math.ceil(tempData.length / noOfTask);
          page++
        ) {
          pagerHtml +=
            '<span id="pg' +
            page +
            '" class="pg-normal" onclick="showPage(' +
            page +
            ')">' +
            page +
            "</span> ";
        }
      }
    } else {
      for (var page = 1; page <= 3; page++) {
        pagerHtml +=
          '<span id="pg' +
          page +
          '" class="pg-normal" onclick="showPage(' +
          page +
          ')">' +
          page +
          "</span> ";
      }
      pagerHtml +=
        '<span id="other"' + 'class="pg-normal">' + "..." + "</span> ";
      pagerHtml +=
        '<span id="pg' +
        Math.ceil(tempData.length / noOfTask) +
        '" class="pg-normal" onclick="showPage(' +
        Math.ceil(tempData.length / noOfTask) +
        ')">' +
        Math.ceil(tempData.length / noOfTask) +
        "</span> ";
    }
  } else {
    for (var page = 1; page <= Math.ceil(tempData.length / noOfTask); page++) {
      pagerHtml +=
        '<span id="pg' +
        page +
        '" class="pg-normal" onclick="showPage(' +
        page +
        ')">' +
        page +
        "</span> ";
    }
  }

  pagerHtml +=
    '<span onclick="next()" class="pg-normal" id="pg-next"> Next</span>' + //  | Next |
    '<span onclick="lastPage()" id="pg-last" class="pg-normal">>></span>'; //   | >> |
  $("#paginationWrapper").html(pagerHtml);
  $("#other").css("cursor", "not-allowed"); //changing cursor type of | ... | button to blocked.
}
//---------------------------------------css for toastr---------------------------------//
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

function showRemTask(array) {
  $(".tabContent").html("");
  for (let i = 0; i < array.length; ++i) {
    $(".tabContent").append(
      `<div
        class=" col-md-4 taskWrapper"
        id="task${(currentPage - 1) * noOfTask + i + 1}"
      >
        <div class="task h-100 w-100 row mx-0">
          <div class="taskHeading row mx-0 w-100">
            <div class=" operations thTaskTitle col-8 text-white" data-toggle="tooltip" data-placement="top">
              <span>${array[(currentPage - 1) * noOfTask + i].summary}</span>
            </div>
          </div>
          <div class="row taskContent w-100 mx-0" onclick="viewDetails(${
            (currentPage - 1) * noOfTask + i
          })" data-toggle="modal"
          data-target="#infoModal"
          data-toggle="tooltip"
          data-placement="left"
          >
            <span>${array[i].description}</span>
          </div>
        </div>
      </div>`
    );
    $(`#task${i + 1} .thTaskTitle`).attr(
      "title",
      $(`#task${i + 1} .thTaskTitle`).text() +
        " " +
        $(`#task${i + 1} .thPriority`).text()
    );
    $(".thTaskTitle").tooltip();
    $(`#task${i + 1} .taskContent`).attr(
      "title",
      $(`#task${i + 1} .taskContent`).text()
    );
    $(".taskContent").tooltip();
    $(`#task${(currentPage - 1) * noOfTask + i + 1} .taskHeading`).css(
      "background-image",
      "linear-gradient(315deg, #ffac93 0%, #e58484 74%)"
    );
  }
}
