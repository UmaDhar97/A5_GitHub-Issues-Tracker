const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
let allIssues = []

// load

async function loadIssues(){
const res = await fetch(API)
const data = await res.json()
allIssues = data.data
displayIssues(allIssues)
updateCount(allIssues)
setActiveTab("all")
}

// display cards

function displayIssues(data){
const container = document.getElementById("issueContainer")
container.innerHTML = ""data.forEach(issue => {
const border = issue.status === "open"
? "border-green-500": "border-purple-500"


// using map in label

const labelsHTML = issue.labels
.map(label => `
<span class="px-2 py-1 text-xs bg-yellow-500 rounded-full">
${label}
</span>
`).join("")

container.innerHTML += `
<div onclick="openModal(${issue.id})"
class="relative bg-white p-5 rounded-lg shadow cursor-pointer border-t-4 ${border} hover:shadow-lg transition">


<span class="absolute top-3 right-3 text-xs px-2 py-1 rounded-full
${issue.priority === "high" ? " bg-red-100 text-red-600 border border-red" :
issue.priority === "medium" ? " bg-yellow-100 text-yellow-600 border border-yellow" :
"bg-gray-100 text-gray-600 border border-gray"}">

${issue.priority}

</span>
<h2 class="font-semibold text-lg mb-2">
${issue.title}
</h2>

<!-- Description -->

<p class="text-sm text-gray-500 mb-3">
${issue.description.slice(0,80)}
</p>
<!-- LABELS -->

<div class="capitalize flex gap-2 flex-wrap mb-3">
${labelsHTML}
</div>
<div class="divider"></div>

<!-- Author-->

<div class="grid grid-cols-2 gap-2 text-sm mb-3">

<p>
Author:
<span class="font-medium">${issue.author}</span>
</p>

<p class="text-xs text-gray-500">
Created:
${new Date(issue.createdAt).toLocaleDateString()}
</p>

<p>
Assign:
<span class="font-medium">${issue.assign || "None"}</span>
</p>

<p class="text-xs text-gray-500">
Updated:
${new Date(issue.updatedAt).toLocaleDateString()}
</p>
</div>
</div>
</div>

`
})
}

// Update TOTAL ISSUE COUNT

function updateCount(data){

document.getElementById("totalCount").innerText = data.length

}

// Filter OPEN / CLOSED

function filterIssues(status){
const filtered = allIssues.filter(
issue => issue.status === status
)

displayIssues(filtered)
updateCount(filtered)
setActiveTab(status)

}

// SEARCH ISSUES

async function searchIssue(){
const text = document.getElementById("searchInput").value

if(text === ""){
loadIssues()
return
}
const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
)

const data = await res.json()

displayIssues(data.data)
updateCount(data.data)
setActiveTab("search")

}

// Active tab

function setActiveTab(tab){

document.querySelectorAll(".tab-btn")
.forEach(btn => btn.classList.remove("btn-primary"))

if(tab === "all")
document.getElementById("tabAll").classList.add("btn-primary")

if(tab === "open")
document.getElementById("tabOpen").classList.add("btn-primary")

if(tab === "closed")
document.getElementById("tabClosed").classList.add("btn-primary")

}
// OPEN ISSUE MODAL

async function openModal(id){

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
const data = await res.json()
const issue = data.data
const labelsHTML = issue.labels
.map(label => `
<span class="px-2 py-1 text-xs bg-yellow-500 rounded">
${label}
</span>
`).join("")

document.getElementById("modalContent").innerHTML = `
<div class="space-y-5">


<!-- TITLE + STATUS -->

<div class="flex items-center gap-2">

<img src="${issue.status === "open"
? "https://cdn-icons-png.flaticon.com/512/190/190411.png"
: "https://cdn-icons-png.flaticon.com/512/463/463612.png"}"
class="w-5 h-5"
/>

<h2 class="text-xl font-bold">
${issue.title}
</h2>

</div>


<!-- DESCRIPTION -->
<p class="text-gray-600">
${issue.description}
</p>
<!-- LABELS -->

<div class="flex flex-wrap gap-2">
${labelsHTML}
</div>


<hr>
<!-- META INFO -->

<div class="grid grid-cols-2 gap-6 text-sm"><div>
<p class="text-gray-400 text-xs">Author</p>
<p class="font-medium">${issue.author}</p>
</div>

<div>
<p class="text-gray-400 text-xs">Assignee</p>
<p>${issue.assignee || "None"}</p>
</div>

<div>
<p class="text-gray-400 text-xs">Priority</p>
<p class="capitalize px-2 py-1 text-xs bg-grey-500 rounded">${issue.priority}</p>
</div>

<div>
<p class="text-gray-400 text-xs">Status</p>
<p class="capitalize">${issue.status}</p>
</div>

<div>
<p class="text-gray-400 text-xs">Created</p>
<p>${new Date(issue.createdAt).toLocaleString()}</p>
</div>

<div>
<p class="text-gray-400 text-xs">Updated</p>
<p>${new Date(issue.updatedAt).toLocaleString()}</p>
</div>

</div>

</div>

`
document.getElementById("issueModal").showModal()
}