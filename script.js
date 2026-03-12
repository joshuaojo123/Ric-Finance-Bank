// Initialize user info, balance, pending transfers
if(!localStorage.getItem("userName")) localStorage.setItem("userName","Demo User");
if(!localStorage.getItem("balance")) localStorage.setItem("balance",3000000);
if(!localStorage.getItem("pending") || JSON.parse(localStorage.getItem("pending")).length===0){
    let demoPending = [
        {name:"John Doe", account:"123456789", amount:150, note:"Rent", status:"Pending"},
        {name:"Alice Smith", account:"987654321", amount:200, note:"Gift", status:"Pending"}
    ];
    localStorage.setItem("pending", JSON.stringify(demoPending));
}

// LOGIN
function login(){
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("password").value.trim();

    if(name && email && pass){
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
if(!localStorage.getItem("balance")) localStorage.setItem("balance",3000000);
        if(!localStorage.getItem("pending")) localStorage.setItem("pending",JSON.stringify([]));
        window.location.href = "dashboard.html";
    } else { alert("Please fill all fields"); }
}

// DASHBOARD
let welcomeName = document.getElementById("welcomeName");
let bal = document.getElementById("balance");
if(welcomeName) welcomeName.innerText = "Good Morning, "+localStorage.getItem("userName");
if(bal) bal.innerText = "$" + Number(localStorage.getItem("balance")).toLocaleString();

// SPENDING CHART
const ctx = document.getElementById('spendChart');
if(ctx){
    new Chart(ctx,{
        type:'line',
        data:{
            labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets:[{label:'Spending',data:[120,90,150,80,200,75,60],borderWidth:2}]
        },
        options:{responsive:true}
    });
}

// SEND MONEY
function sendMoney(){
    let name = document.getElementById("name").value;
    let account = document.getElementById("account").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let note = document.getElementById("note").value;
    let balance = parseFloat(localStorage.getItem("balance"));

    if(name && account && amount){
        if(amount>balance){ alert("Insufficient Balance"); return; }

        document.getElementById("msg").innerHTML = "Processing Transfer...";
        setTimeout(()=>{
            balance -= amount;
            localStorage.setItem("balance", balance);

            // save pending transfer
            let pending = JSON.parse(localStorage.getItem("pending"));
            pending.push({name, account, amount, note, status:"Pending"});
            localStorage.setItem("pending", JSON.stringify(pending));

            // redirect to pending page
            window.location.href = "pending.html";
        }, 1500);

    } else { alert("Fill all fields"); }
}

// PENDING PAGE
let pendingList = document.getElementById("pendingList");
if(pendingList){
    let pending = JSON.parse(localStorage.getItem("pending"));
    if(pending.length===0) pendingList.innerHTML="<p class='text-muted'>No pending transfers</p>";
    else{
        pendingList.innerHTML = "";
        pending.forEach((t,i)=>{
            pendingList.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div><b>${t.name}</b><br><small>${t.account} | ${t.note||""}</small></div>
                <span class="badge bg-warning">${t.status}</span>
            </div>`;
        });
    }
}