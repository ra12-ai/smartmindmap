function generateMindMap() {
  const input = document.getElementById("inputText").value;
  const ideas = input.split("\n").filter(Boolean);
  const tree = buildTree(ideas);
  const diagram = treeToMermaid(tree);

  const mindmapDiv = document.getElementById("mindmap");
  mindmapDiv.innerHTML = ""; // 🧼 Clear previous diagram
  mindmapDiv.innerHTML = `<pre class="mermaid">${diagram}</pre>`;

  mermaid.run(); // ✅ Works with Mermaid v10.4.0
  updateSummary(tree);
}

function buildTree(lines) {
  const root = { text: "Main Idea", children: [] };
  lines.forEach(line => {
    const node = { text: line.trim(), children: [] };
    root.children.push(node);
  });
  return root;
}

function treeToMermaid(node, parent = null, id = "A", links = []) {
  const thisId = id;
  if (parent) {
    links.push(`${parent}["${escapeText(parent)}"] --> ${thisId}["${escapeText(node.text)}"]`);
  } else {
    links.push(`${thisId}["${escapeText(node.text)}"]`);
  }
  node.children.forEach((child, idx) =>
    treeToMermaid(child, node.text, thisId + String.fromCharCode(66 + idx), links)
  );
  return "graph TD\n" + links.join("\n");
}

function escapeText(text) {
  return text.replace(/"/g, '&quot;').replace(/'/g, "&apos;");
}

function updateSummary(tree) {
  const list = document.getElementById("summaryList");
  list.innerHTML = "";
  tree.children.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    list.appendChild(li);
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function downloadPNG() {
  html2canvas(document.querySelector("#mindmap")).then(canvas => {
    const link = document.createElement("a");
    link.download = "mindmap.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
