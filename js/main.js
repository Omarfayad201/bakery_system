//** dark mode **//
 const btn = document.getElementById("darkModeBtn");
 btn.addEventListener("click", () => {
   document.body.classList.toggle("dark-mode");
   btn.innerHTML = document.body.classList.contains("dark-mode")
     ? '<i class="fa-solid fa-sun"></i>'
     : '<i class="fa-solid fa-moon"></i>';
 });


/** login page **/
$("#btnLogin").click(() => {
  let roleVal = $("#roleInp").val().trim().toLowerCase(); // role from input
  let passVal = $("#passInput").val().trim().toLowerCase(); // pass from input

  if (
    !(
      (roleVal === "admin" && passVal === "safe2003") ||
      (roleVal === "user" && passVal === "user1234")
    )
  ) {
    return alert("الباسورد او المسمي الوظيفي خطأ (admin or user)");
  }


  localStorage.setItem("pageRender", "#dashBord");
  localStorage.setItem("role", roleVal);


  $("#dashBord").removeClass("d-none");
  $("#login").addClass("d-none");

 
  if (roleVal === "user") {
    $(".admin").addClass("d-none");
    $("#role").html("User");
  } else {
    $(".admin").removeClass("d-none"); 
    $("#role").html("Admin");
  }
});

$(window).on("load", () => {
  let savedRole = localStorage.getItem("role");
  if (savedRole === "user") {
    $(".admin").addClass("d-none");
  } else if (savedRole === "admin") {
    $(".admin").removeClass("d-none");
  }
});


$(document).ready(() => {
  let pageInLocal = localStorage.getItem("pageRender");
  let savedRole = localStorage.getItem("role");

  if (pageInLocal && savedRole) {
    $(pageInLocal).removeClass("d-none");
    $("#login").addClass("d-none");

    if (savedRole === "user") {
      $(".admin").hide();
      $("#role").html("User");
    } else {
       $(".admin").show();
      $("#role").html("Admin");
    }
  }
});


$(".choosePage li").click(function () {
  $("section").not("#dashBord").addClass("d-none");

  let page = $(this).attr("data-dash");
  $(page).removeClass("d-none");

  if (page === "#login") {
    $("section").not("#login").addClass("d-none");
    localStorage.removeItem("pageRender");
    localStorage.removeItem("role");
    $("#roleInp").val("");
    $("#passInput").val("");
  }
});



  /** merchant page **/ 
  let allMerchant = JSON.parse(localStorage.getItem("merchants")) || [];

$(document).ready(() => {
  let allMerchantsFromLoc = JSON.parse(localStorage.getItem("merchants"));
  if (allMerchantsFromLoc) {
    allMerchant = allMerchantsFromLoc

    displayMerchants();
  }
  })


  let merchantName = $("#merchantName")
let merchantPhone = $("#merchantPhone")
  let merchantAddress = $("#merchantAddress");
 

  // clear value main merchant page
function clearInputValue() {
    merchantName.val("")
  merchantPhone.val("")
  merchantAddress.val("")
  }

$("#addBtnMrc").click(() => {

  if (merchantName.val() !== "" && merchantPhone.val() !== "" && merchantAddress.val() !== "")
  {
    //opject merchants
    let merchantObj = {
      name: merchantName.val(),
      phone: merchantPhone.val(),
      address:merchantAddress.val()
    };
    allMerchant.push(merchantObj);
    
    localStorage.setItem("merchants", JSON.stringify(allMerchant));
   clearInputValue();
    displayMerchants();
    let savedRole = localStorage.getItem("role");
    if (savedRole === "user") {
      $(".admin").hide();
    } else if (savedRole === "admin") {
      $(".admin").show();
    }

    
  } else {
    alert(" برجاء كتابة كل القيم للاضافة")
  }
  
})
 
function displayMerchants() {

  $("#tbodyMerchants").empty();

  $("#tbodyDashboard").empty();

  allMerchant.forEach((merchant, index) => {

    $("#tbodyMerchants").append(`
      <tr>
        <td>${index + 1}</td>
        <td class="merchantName">${merchant.name}</td>
        <td>${merchant.phone}</td>
        <td>${merchant.address}</td>
        <td class="admin"><button id="btnUpdate" data-id="${index}" class="btn btn-warning btn-sm">تعديل</button></td>
        <td class="admin"><button id="btnDelete" data-id="${index}" class="btn btn-danger btn-sm">حذف</button></td>
        <td><button data-id-cli="${index}" class="btn btn-info btn-sm">فتح</button></td>
      </tr>
    `);

    if (index >= allMerchant.length - 3) {
      $("#tbodyDashboard").append(`
        <tr>
          <td>${index + 1}</td>
          <td>${merchant.name}</td>
          <td>${merchant.address}</td>
          <td>—</td>
          <td>—</td>
        </tr>
      `);
    }
  });
}



// update btn
let indexUpdate = null;
$(document).on("click", "#btnUpdate", function () {
   indexUpdate = $(this).attr("data-id");
  
  let merchantUpdate = allMerchant[indexUpdate]
  console.log(merchantUpdate , indexUpdate);
  
  merchantName.val(merchantUpdate.name);

  merchantPhone.val(merchantUpdate.phone);

  merchantAddress.val(merchantUpdate.address);

  $("#updateBtn").removeClass("d-none").prev("button").addClass("d-none");
});

function updateData() {

  if (merchantName.val() !== "" && merchantPhone.val() !== "" && merchantAddress.val() !== "") {
        allMerchant[indexUpdate].name = merchantName.val();
  allMerchant[indexUpdate].phone = merchantPhone.val();
  allMerchant[indexUpdate].address = merchantAddress.val();

  localStorage.setItem("merchants", JSON.stringify(allMerchant));
    displayMerchants();
    clearInputValue();
    $("#addBtnMrc").removeClass("d-none").next("button").addClass("d-none");
  } else {
    alert(" برجاء كتابة كل القيم للتعديل");
  }


}
$("#updateBtn").click(() => {
  updateData();
})


// delete merchant

$(document).on("click", "#btnDelete", function () {
  let deleteIndex = $(this).attr("data-id");

  allMerchant.splice(deleteIndex, 1);
  localStorage.setItem("merchants", JSON.stringify(allMerchant));

  localStorage.removeItem(`merchantData${deleteIndex}`); 
  localStorage.removeItem(`merchantPrice${deleteIndex}`);
  localStorage.removeItem(`spcMerchant_${deleteIndex}`); 

  allMerchant.forEach((mer, i) => {
    let oldData = JSON.parse(localStorage.getItem(`merchantData${i + 1}`));
    if (oldData) {
      localStorage.setItem(`merchantData${i}`, JSON.stringify(oldData));
      localStorage.removeItem(`merchantData${i + 1}`);
    }
  });

  displayMerchants();
});




//** single page to each merchant in th table **//

// put months on li in html

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// index to use in functions
let priceInput;
let currentMonth = ""; 
let spcMonthDataArr = []; // array to every month

function displayMonth() {
  let monthInfo = $("#monthInfo"); // here we hold a ul 
  let boxMonths = ``
  for (let i = 0; i < months.length; i++){ // this loop to put all months in ul 
    boxMonths += `
    <li><button id="spcMonthData" class="bg-transparent border-0">${months[i]}</button></li>
    `;
  }
  monthInfo.html(boxMonths) 
}

// event click to each month

$(document).on("click", "#spcMonthData", function () {
  currentMonth = $(this).text(); // نخزن اسم الشهر
  console.log("Selected month:", currentMonth);

  $(".spcMerchantInputs input").removeAttr("disabled");
  $(".spcMonthOfTable").removeClass("d-none");
  $("#chooseMonth").addClass("d-none");
});



let spcMerchantDataArr = []

$(document).on("click", "#tbodyMerchants button[data-id-cli]", function () {
  spcIndex = $(this).attr("data-id-cli");

  $("#newSpcMerchantPage").removeClass("d-none");
  $("#merchant").addClass("d-none");

  displayMonth(); // يعرض الشهور
  $("#nameOfMerchant").text(allMerchant[spcIndex].name);
});


//////////// function check if find price ////////
function findPriceLoc() {
    if (localStorage.getItem(`merchantPrice${spcIndex}`)) {
      $("#lastPrice").text(localStorage.getItem(`merchantPrice${spcIndex}`));
    } else {
      $("#lastPrice").text("0");
    }
}

//////////////// button add price to specific merchant ///////////////
 
$(document).on("click", "#btnAddPrice", function () {
  priceInput = $("#priceInput").val().trim();
  if (priceInput !== "") {
    localStorage.setItem(`merchantPrice${spcIndex}`, Number(priceInput)); // spc price in LOCAL
    findPriceLoc();

    $("#lastPrice").text(priceInput);
  } else {
    window.alert("برجاء اضافة سعر العيش");
  }
});


/////////////////////////// add spc merchant to table //////////////////////////////////

$("#addSpcMerData").click(() => {
  const dateInput = $("#dateOfTransaction");
  const numberOfBreadInput = $("#countOfBread");
  const paidInput = $("#amountPaid");
  const currentPrice = localStorage.getItem(`merchantPrice${spcIndex}`);

  if (!currentMonth) return alert("برجاء اختيار الشهر أولاً");
  if (!currentPrice) return alert("برجاء الرجوع إلى admin لإضافة سعر الرغيف");

  if (
    dateInput.val() !== "" &&
    numberOfBreadInput.val() !== "" &&
    paidInput.val() !== ""
  ) {
    const objMerchantData = {
      date: dateInput.val(),
      numberBread: Number(numberOfBreadInput.val()),
      paid: Number(paidInput.val()),
      breadPriceAtTime: Number(currentPrice),
    };

    let allData =
      JSON.parse(localStorage.getItem(`merchantData${spcIndex}`)) || {};
    if (!allData[currentMonth]) allData[currentMonth] = [];
    allData[currentMonth].push(objMerchantData);
    localStorage.setItem(`merchantData${spcIndex}`, JSON.stringify(allData));

    dateInput.val("");
    numberOfBreadInput.val("");
    paidInput.val("");

    loadMonthData();

    alert("تمت الإضافة بنجاح ");
  } else {
    alert("برجاء إدخال جميع القيم");
  }
});



let selectedMonth = ""; 
let spcIndex; // index to use in functions


$(document).on("click", "#spcMonthData", function () {
  selectedMonth = $(this).text();
  $(".spcMerchantInputs input").removeAttr("disabled");
  $(".spcMonthOfTable").removeClass("d-none");
  $("#chooseMonth").addClass("d-none");


  loadMonthData();
});


function loadMonthData() {

  let currentPrice = localStorage.getItem(`merchantPrice${spcIndex}`) || 0;
  $("#lastPrice").text(currentPrice);

  $("#tbodySpc").empty();

  let merchantKey = `merchantData${spcIndex}`;
  let merchantData = JSON.parse(localStorage.getItem(merchantKey)) || {};

  let monthData = merchantData[selectedMonth] || [];

  if (monthData.length === 0) {
    $("#tbodySpc").html(
      `<tr><td colspan="8" class="text-center text-danger">لا توجد بيانات لهذا الشهر بعد</td></tr>`
    );
    return;
  }

  let rows = "";
  for (let i = 0; i < monthData.length; i++) {
    let d = monthData[i];
    let totalPrice =
      Number(d.numberBread) * Number(d.breadPriceAtTime || d.price);
    let remaining = totalPrice - Number(d.paid);
    let priceAtTime = d.breadPriceAtTime || d.price || 0;

    rows += `
      <tr>
        <td>${i + 1}</td>
        <td>${allMerchant[spcIndex].name}</td>
        <td>${d.date}</td>
        <td>${d.numberBread}</td>
        <td>${priceAtTime}</td>
        <td>${totalPrice}</td>
        <td>${d.paid}</td>
        <td>${remaining}</td>
        <td class="admin"><button class="btn btn-warning btn-sm btnEdit" data-id="${i}">تعديل</button></td>
        <td class="admin"><button class="btn btn-danger btn-sm btnDelete" data-id="${i}">حذف</button></td>
      </tr>
    `;
  }

  $("#tbodySpc").html(rows);
  let currentRole = localStorage.getItem("role");
  if (currentRole === "user") {
    $(".admin").hide(); 
  } else {
    $(".admin").show();
  }
    calcMonthTotals();
}

function calcMonthTotals() {
  let merchantKey = `merchantData${spcIndex}`;
  let merchantData = JSON.parse(localStorage.getItem(merchantKey)) || {};
  let monthData = merchantData[selectedMonth] || [];

  let totalAll = 0; 
  let totalPaid = 0;
  let totalRemaining = 0; 

  for (let i = 0; i < monthData.length; i++) {
    let d = monthData[i];
    let totalPrice =
      Number(d.numberBread) * Number(d.breadPriceAtTime || d.price);
    totalAll += totalPrice;
    totalPaid += Number(d.paid);
    totalRemaining += totalPrice - Number(d.paid);
  }


  $(".prices .col-md-4:eq(0) h4").text(totalAll);
  $(".prices .col-md-4:eq(1) h4").text(totalPaid);
  $(".prices .col-md-4:eq(2) h4").text(totalRemaining);
}


$(document).on("click", ".btnEdit", function () {
  let index = $(this).attr("data-id");
  let allData = JSON.parse(localStorage.getItem(`merchantData${spcIndex}`)) || {};

  if (!allData[selectedMonth]) allData[selectedMonth] = [];

  let item = allData[selectedMonth][index];
  if (!item) return alert("حدث خطأ في تحميل البيانات ");

  $("#dateOfTransaction").val(item.date);
  $("#countOfBread").val(item.numberBread);
  $("#amountPaid").val(item.paid);

  window.updateIndex = index;

  $("#addSpcMerData").addClass("d-none");
  $("#updateSpcMerData").removeClass("d-none");
});

$("#updateSpcMerData").off("click").on("click", () => {
  let allData = JSON.parse(localStorage.getItem(`merchantData${spcIndex}`)) || {};
  if (!allData[selectedMonth]) allData[selectedMonth] = [];

  let item = allData[selectedMonth][window.updateIndex];
  if (!item) return alert("لم يتم العثور على العملية المطلوبة ");

  item.date = $("#dateOfTransaction").val();
  item.numberBread = Number($("#countOfBread").val());
  item.paid = Number($("#amountPaid").val());

  localStorage.setItem(`merchantData${spcIndex}`, JSON.stringify(allData));

  alert("تم التعديل بنجاح ");

  $("#updateSpcMerData").addClass("d-none");
  $("#addSpcMerData").removeClass("d-none");


  loadMonthData();
});


$(document).on("click", ".btnDelete", function () {
  let index = $(this).attr("data-id");
  let allData = JSON.parse(localStorage.getItem(`merchantData${spcIndex}`)) || {};
  if (!allData[selectedMonth]) return;

  allData[selectedMonth].splice(index, 1);

  localStorage.setItem(`merchantData${spcIndex}`, JSON.stringify(allData));

  alert("تم الحذف بنجاح ");

  loadMonthData();
});


//** report month page**//

$("#selectMonth").on("change", function () {
  let selectedMonth = $(this).val();
  if (!selectedMonth) return;

  let totalAll = 0;
  let totalPaid = 0;
  let totalRemaining = 0;
  let totalPaidAllMonths = 0;


  for (let i = 0; i < allMerchant.length; i++) {
    let merchantKey = `merchantData${i}`;
    let merchantData = JSON.parse(localStorage.getItem(merchantKey)) || {};

  
    let monthData = merchantData[selectedMonth] || [];

  
    for (let j = 0; j < monthData.length; j++) {
      let d = monthData[j];
      let totalPrice =
        Number(d.numberBread) * Number(d.breadPriceAtTime || d.price);
      totalAll += totalPrice;
      totalPaid += Number(d.paid);
      totalRemaining += totalPrice - Number(d.paid);
    }

   
    for (let month in merchantData) {
      merchantData[month].forEach((d) => {
        totalPaidAllMonths += Number(d.paid);
      });
    }
  }

  
  $("#totalAllMerchants").text(totalAll);
  $("#totalPaidMerchants").text(totalPaid);
  $("#totalRemainingMerchants").text(totalRemaining);
  $("#totalPaidAllMonths").text(totalPaidAllMonths);
});

//// the hight paid month

function findTopMonth() {
  let monthPayments = {};


  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("merchantData")) {
      let merchantData = JSON.parse(localStorage.getItem(key)) || {};

     
      $.each(merchantData, function (monthName, operations) {
        $.each(operations, function (index, op) {
          let paid = Number(op.paid) || 0;
          if (!monthPayments[monthName]) monthPayments[monthName] = 0;
          monthPayments[monthName] += paid;
        });
      });
    }
  }

 
  let topMonth = "-";
  let maxValue = 0;

  $.each(monthPayments, function (month, value) {
    if (value > maxValue) {
      maxValue = value;
      topMonth = month;
    }
  });


  $("#topMonthName").text(topMonth);
  $("#topMonthValue").text(maxValue.toLocaleString());
}

function updateDashboard() {
  updateTotals();
  findTopMonth();
}


$(document).ready(function () {
  updateDashboard();
});


$(document).on(
  "click",
  "#addSpcMerData, #updateSpcMerData, .btnDelete",
  function () {
    setTimeout(updateDashboard, 200);
  }
);


//** set info in home page allamount allpaid allremaining **//


function updateTotals() {
  let totalAll = 0;
  let paidAll = 0;
  let remainingAll = 0;


  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith("merchantData")) {
      let merchantData = JSON.parse(localStorage.getItem(key)) || {};

      $.each(merchantData, function (monthName, operations) {
        $.each(operations, function (index, op) {

          let price = op.breadPriceAtTime || op.price || 0;
          let totalPrice = Number(op.numberBread) * Number(price);

          totalAll += totalPrice;
          paidAll += Number(op.paid);
        });
      });
    }
  }

  remainingAll = totalAll - paidAll;


  $("#totalAll").text(totalAll.toLocaleString());
  $("#paidAll").text(paidAll.toLocaleString());
  $("#remainingAll").text(remainingAll.toLocaleString());
}


$(document).ready(function () {
  updateTotals();
});


$(document).on(
  "click",
  "#addSpcMerData, #updateSpcMerData, .btnDelete",
  function () {
    setTimeout(updateTotals, 200); 
  }
);

//** fees section **//

$(document).ready(function () {
  let selectedMonth = "";
  let expensesData = JSON.parse(localStorage.getItem("expensesData")) || {};


  $("#monthSelect").on("change", function () {
    selectedMonth = $(this).val();
    if (!selectedMonth) return;

    let totalPaid = calcTotalPaid(selectedMonth);

    $("#monthTotal").text(totalPaid);
    $("#afterExpensesTotal").text(totalPaid);

    renderExpenses(selectedMonth, totalPaid);
  });


 function calcTotalPaid(monthName) {
   let total = 0;

   for (let i = 0; i < localStorage.length; i++) {
     let key = localStorage.key(i);
     if (key.startsWith("merchantData")) {
       let merchantData = JSON.parse(localStorage.getItem(key)) || {};
       let monthData = merchantData[monthName] || [];

       monthData.forEach((entry) => {
         total += Number(entry.paid) || 0;
       });
     }
   }

   let expensesData = JSON.parse(localStorage.getItem("expensesData")) || {};
   let monthExpenses = expensesData[monthName] || [];
   if (monthExpenses.length > 0) {
     $("#afterExpensesTotal").text(
       monthExpenses[monthExpenses.length - 1].afterAmount
     );
   } else {
     $("#afterExpensesTotal").text(total);
   }

   return total;
 }



  $("#addExpense").on("click", function () {
    if (!selectedMonth) {
      alert("اختر الشهر أولاً");
      return;
    }

    const date = $("#expenseDate").val();
    const amount = Number($("#expenseAmount").val());
    const details = $("#expenseDetails").val();

    if (!date || !amount || !details) {
      alert("املأ جميع الحقول");
      return;
    }

    let totalPaid = calcTotalPaid(selectedMonth);
    let monthExpenses = expensesData[selectedMonth] || [];

    let lastAfter = monthExpenses.length
      ? monthExpenses[monthExpenses.length - 1].afterAmount
      : totalPaid;

    let afterExpense = lastAfter - amount;

    const newExpense = {
      date,
      amount,
      details,
      beforeAmount: lastAfter,
      afterAmount: afterExpense,
    };

    monthExpenses.push(newExpense);
    expensesData[selectedMonth] = monthExpenses;

    localStorage.setItem("expensesData", JSON.stringify(expensesData));

    renderExpenses(selectedMonth, totalPaid);

    $("#expenseDate").val("");
    $("#expenseAmount").val("");
    $("#expenseDetails").val("");
  });


function renderExpenses(month, totalPaid) {
  let monthExpenses = expensesData[month] || [];
  let tableBody = $("#expensesTableBody");
  tableBody.empty();

  let totalMonthExpenses = 0;

  monthExpenses.forEach((item, index) => {
    totalMonthExpenses += Number(item.amount) || 0;

    tableBody.append(`
      <tr data-index="${index}">
        <td>${item.date}</td>
        <td>${item.amount}</td>
        <td>${item.details}</td>
        <td>${item.beforeAmount}</td>
        <td>${item.afterAmount}</td>
        <td><button class="btn btn-danger delete-expense">مسح</button></td>
      </tr>
    `);
  });

  let netAfterExpenses = totalPaid - totalMonthExpenses;
  $("#afterExpensesTotal").text(netAfterExpenses);
}


  $(document).on("click", ".delete-expense", function () {
    let index = $(this).closest("tr").data("index");
    let monthExpenses = expensesData[selectedMonth] || [];

  
    monthExpenses.splice(index, 1);

    
    let totalPaid = calcTotalPaid(selectedMonth);
    let lastAfter = totalPaid;
    monthExpenses = monthExpenses.map((exp) => {
      exp.beforeAmount = lastAfter;
      exp.afterAmount = lastAfter - exp.amount;
      lastAfter = exp.afterAmount;
      return exp;
    });

    expensesData[selectedMonth] = monthExpenses;
    localStorage.setItem("expensesData", JSON.stringify(expensesData));

    renderExpenses(selectedMonth, totalPaid);
  });
});


//** paid page **/ //


$(document).ready(function () {
  
  function calcTotalPaidAllMonths() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("merchantData")) {
        let merchantData = JSON.parse(localStorage.getItem(key)) || {};
        for (let month in merchantData) {
          merchantData[month].forEach((entry) => {
            total += Number(entry.paid) || 0;
          });
        }
      }
    }
    return total;
  }

  
  function calcTotalExpenses() {
    let totalExpenses = 0;
    let expensesData = JSON.parse(localStorage.getItem("expensesData")) || {};
    for (let month in expensesData) {
      expensesData[month].forEach((exp) => {
        totalExpenses += Number(exp.amount) || 0;
      });
    }
    return totalExpenses;
  }

  
  function calcNetProfit() {
    let totalPaid = calcTotalPaidAllMonths();
    let totalExpenses = calcTotalExpenses();
    let netProfit = totalPaid - totalExpenses;

    $("#totalPaidAll").text(totalPaid.toLocaleString());
    $("#totalExpensesAll").text(totalExpenses.toLocaleString());
    $("#netProfit").text(netProfit.toLocaleString());
  }

  
  calcNetProfit();

  
  calcNetProfit();
});



//** clear all data from localstorage**//

$("#deleteAll").click(() => {
  localStorage.clear()
})



// Recovering old data
document.getElementById("backupBtn").addEventListener("click", function () {
  const allData = {};


  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    allData[key] = value;
  }


  const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "backup.json";
  link.click();
});


$(document).ready(function () {

  $("#backupBtn").on("click", function () {
    let allData = {};


    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
      allData[key] = value;
    }


    let blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    let link = $("<a>");
    link.attr("href", URL.createObjectURL(blob));
    link.attr("download", "backup.json");
    link[0].click();

    alert(" تم حفظ نسخة احتياطية بنجاح!");
  });


  $("#restoreBtn").on("click", function () {
    $("#restoreFile").click();
  });

  $("#restoreFile").on("change", function (event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();

    reader.onload = function (e) {
      try {
        let data = JSON.parse(e.target.result);


        $.each(data, function (key, value) {
          localStorage.setItem(key, value);
        });

        alert(" تم استرجاع البيانات بنجاح! أعد تحميل الصفحة لتحديث النظام.");
      } catch (error) {
        alert(" الملف غير صالح أو به خطأ في التنسيق.");
      }
    };

    reader.readAsText(file);
  });
});
