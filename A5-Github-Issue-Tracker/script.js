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