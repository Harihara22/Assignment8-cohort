if (localStorage.getItem("isLoggedIn") != "true") {
  window.location.replace("index.html");
}

let curentuserId = JSON.parse(localStorage.getItem("curentuserId"));
let userData = JSON.parse(localStorage.getItem("registerdUsers")) || [];
let userName = "";
// to dispay the name of user
const displayName = document.querySelector(".userName");

userData.forEach((e) => {
  if (e.id === curentuserId) {
    userName = e.username;
    displayName.textContent = `${userName}`;
  }
});

// for logout button
const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  window.location.replace("index.html");
});

// add and remove trsnsaction box
const addBtn = document.querySelector(".add-btn");
const transactionBox = document.querySelector("#transactionBox");
const closeModal = document.querySelector(".close-modal");

const showTransactionForm = () => {
  transactionBox.style.display = "flex";
};
const disableTransactionForm = () => {
  transactionBox.style.display = "none";
};

addBtn.addEventListener("click", showTransactionForm);
closeModal.addEventListener("click", disableTransactionForm);
transactionBox.addEventListener("click", (e) => {
  if (e.target === transactionBox) {
    disableTransactionForm();
  }
});

// form Functionality
// selection of form elements
const formT = document.querySelector("#transactionForm");
const typeE = document.querySelector("#txType");
const descriptionE = document.querySelector("#txDescription");
const amountE = document.querySelector("#txAmount");
const dateE = document.querySelector("#txDate");
const categoryE = document.querySelector("#txCategory");
const txId=document.querySelector("#txId");

(function () {
  dateE.value = new Date().toISOString().split("T")[0];
})();

// selection of cards elemnts for display
const displayTotalBalance = document.querySelector("#displayTotalBalance");
const displayBalance = document.querySelector("#displayBalance");
const displayExpense = document.querySelector("#displayExpense");
const displayCount = document.querySelector("#displayCount");

let userTransactionData =
  JSON.parse(localStorage.getItem(`userTransactionData_${userName}`)) || [];
let numberOfTransaction = userTransactionData.length || 0;
let totallIncome = 0;
let totallExpenses = 0;
let curentBalance = 0;

const transactionTableBody=document.querySelector("#transactionTableBody")



const calculateTotalAmount = () => {
  transactionTableBody.innerHTML =``
  let amountData =
    JSON.parse(localStorage.getItem(`userTransactionData_${userName}`)) || [];

  numberOfTransaction = amountData.length;
  totallIncome = 0;
  totallExpenses = 0;
  curentBalance = 0;

  amountData.forEach((e) => {
    if (e.type === "income") {
      totallIncome += e.amount;
      curentBalance += e.amount;
      transactionTableBody.innerHTML += `<tr>
                        <td>${e.date}</td>
                        <td><strong>${e.description}</strong></td>
                        <td><span class="tag">${e.category}</span></td>
                        <td class="text-green">${e.amount}</td>
                        <td>
                          <button
                            class="action-btn btn-edit"
                            onclick="editTransaction(${e.id})"
                          >
                            <i class="fa-solid fa-pen"></i>
                          </button>
                          <button
                            class="action-btn btn-delete"
                            onclick="deleteTransaction(${e.id})"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>`
    } else {
      totallExpenses += e.amount;
      curentBalance -= e.amount;
      transactionTableBody.innerHTML += `<tr>
                        <td>${e.date}</td>
                        <td><strong>${e.description}</strong></td>
                        <td><span class="tag">${e.category}</span></td>
                        <td class="text-red">-${e.amount}</td>
                        <td>
                          <button
                            class="action-btn btn-edit"
                            onclick="editTransaction(${e.id})"
                          >
                            <i class="fa-solid fa-pen"></i>
                          </button>
                          <button
                            class="action-btn btn-delete"
                            onclick="deleteTransaction(${e.id})"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>`
    }
    
    
  });
};

calculateTotalAmount();


  const ctx = document.getElementById("cashFlowChart");
let cashFlowChart;
let updateChart=()=>{
  if (!cashFlowChart) {

    cashFlowChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Income vs Expenses"],
        datasets: [
          {
            label: "Income",
            data: [totallIncome],
            backgroundColor: "green",
          },
          {
            label: "Expenses",
            data: [totallExpenses],
            backgroundColor: "firebrick",
          },
        ],
      },
    });

  } else {

    cashFlowChart.data.datasets[0].data = [totallIncome];
    cashFlowChart.data.datasets[1].data = [totallExpenses];
    cashFlowChart.update();

  }
}


const updateDashboard = () => {
  calculateTotalAmount()

  displayTotalBalance.innerText = `${curentBalance}`;
  displayBalance.innerText = `${totallIncome}`;
  displayExpense.innerText = `${totallExpenses}`;
  displayCount.innerText = `${numberOfTransaction}`;

  updateChart()
};
updateDashboard();

const deleteTransaction = (transactionId) => {

  userTransactionData = userTransactionData.filter(
    item => item.id !== transactionId
  );

  localStorage.setItem(
    `userTransactionData_${userName}`,
    JSON.stringify(userTransactionData)
  );

updateDashboard();
}

let editMode=false;

const editTransaction = (transactionId) => {

  showTransactionForm()

  const transaction = userTransactionData.find(
  item => item.id === transactionId
);

descriptionE.value = transaction.description;
amountE.value = transaction.amount;
typeE.value = transaction.type;
dateE.value = transaction.date;
categoryE.value = transaction.category;
txId.value=transactionId

editMode=true;

updateDashboard();
}




// for deleate and update transaction table




formT.addEventListener("submit", (e) => {
  e.preventDefault();

  userTransactionData =
  JSON.parse(localStorage.getItem(`userTransactionData_${userName}`)) || [];

  let type = typeE.value;
  let description = descriptionE.value;
  let amount = Number(amountE.value);
  let date = dateE.value;
  let category = categoryE.value;

  if(editMode){

  userTransactionData = userTransactionData.map((item)=>{

    if(item.id == Number(txId.value)){
      return {
        ...item,
        amount,
        category,
        date,
        description,
        type
      }
    }

    return item;
  })

  editMode=false;

}
else{

  let id = Date.now();

  userTransactionData.push({
    amount,
    category,
    date,
    description,
    id,
    type,
  });

}

  localStorage.setItem(
    `userTransactionData_${userName}`,
    JSON.stringify(userTransactionData),
  );

  updateDashboard();


  formT.reset();

dateE.value = new Date().toISOString().split("T")[0];
  


  disableTransactionForm();
});

// reset all data
const resetDataBtn=document.querySelector("#resetDataBtn");
resetDataBtn.addEventListener("click",()=>{
  userTransactionData=[]
   localStorage.setItem(
    `userTransactionData_${userName}`,
    JSON.stringify(userTransactionData),
  );
  updateDashboard();
})

// dashboardBox and settingsBox display
const navItems = document.querySelectorAll(".nav-item");
const dashboardBox = document.querySelector("#dashboardBox");
const settingsBox = document.querySelector("#settingsBox");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Sabse active remove karo
    navItems.forEach((nav) => nav.classList.remove("active"));

    // Jispe click hua usme active add karo
    item.classList.add("active");

    if (item.innerText.trim() === "Dashboard") {
      dashboardBox.style.display = "block";
      settingsBox.style.display = "none";
    } else if (item.innerText.trim() === "Settings") {
      dashboardBox.style.display = "none";
      settingsBox.style.display = "block";
    }
  });
});



// DarkMood and Reset button functionality
const dlMood = document.querySelector("#dlMood");

dlMood.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme", dlMood.checked);
});


