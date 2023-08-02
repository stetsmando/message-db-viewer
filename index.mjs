const categoriesList = document.getElementById('categorySelection');
const messagesTable = document.getElementById('messagesTable');
const traceSearchField = document.getElementById('traceSearch');
const traceSearchButton = document.getElementById('submitTraceSearch');

const baseUrl = 'http://localhost:8000'

// Define event handlers

// Handle the dropdown change
const debounceTimeMS = 1000;
let debounce = null;
async function handleCategoryChange(event) {
  const now = Date.now();
  const inDebounce = (debounce && debounce + debounceTimeMS > now);
  if (inDebounce)
    return; // Noop
  debounce = now;

  clearMessagesTable();
  const category = event.target.value;

  // Get all the streams
  const { streams } = await fetch(`${baseUrl}/category/${category}/streams`).then(res => res.json());

  // Get all the messages for those streams and
  // put them in the table
  for (const stream of streams) {
    const { messages } = await fetch(`${baseUrl}/stream/${stream}`).then(res => res.json());

    for (const message of messages) {
      messagesTable.appendChild(createMessageTableRow(message))
    }
  }
}

// Handle the searching for a trace id
async function handleTraceSearch() {
  const traceId = traceSearchField.value;

  if (!traceId) {
    alert('Please provide a trace id');
    return;
  }

  const { messages } = await fetch(`${baseUrl}/trace/${traceId}`).then(res => res.json());

  renderMessagesGraph(messages);
}

// Define element creators/resets
function createCategoryOption(category) {
  const categoryOption = document.createElement('option');
  categoryOption.innerText = category;
  categoryOption.value = category;

  return categoryOption
}

function createMessageTableRow(message) {
  const tr = document.createElement('tr');
  const {
    id,
    stream_name,
    type,
    position,
    global_position,
    data,
    metadata,
    time
  } = message;
  tr.innerHTML = 
  `<td>${id}</td>
  <td>${stream_name}</td>
  <td>${type}</td>
  <td>${position}</td>
  <td>${global_position}</td>
  <td>
    <code>
      ${data}
    </code>
  </td>
  <td>
    <code>
      ${metadata}
    </code>
  </td>
  <td>${new Date(time).toLocaleString()}</td>`

  return tr;
}

function clearMessagesTable() {
  const rows = Array.from(document.querySelectorAll('#messagesTable tr'));
  rows.shift(); // Removes the header rows

  for (const row of rows) {
    row.remove();
  }
}

setTimeout(async () => {
  categoriesList.addEventListener('change', handleCategoryChange);
  traceSearchButton.addEventListener('click', handleTraceSearch);

  const categories = await fetch('http://localhost:8000/categories')
    .then(res => res.json())
    .then(res => res.categories);

  for (const category of categories) {
    const option = createCategoryOption(category);
    categoriesList.appendChild(option);
  }
}, 0);