const embeddedCsv = `date,person,amount,currency,category,note
20260611,Yixin,9.6,GBP,Food,yogurt and tomatoes at tesco
20260611,Yixin,6.6,GBP,Food,bread at gails
20260611,Yixin,4.25,GBP,Food,at M&S
20260611,Yixin,45,GBP,Food,at jinshi
20260612,Yifan,2.5,GBP,Transport,dlr from lcy to woolwich on 20260611
20260612,Yifan,64,GBP,Food,old town 97
20260612,Yifan,37.31,GBP,Food,vegetables and meat and fruit
20260612,Yixin,18,GBP,Food,cakes like earl grey
20260612,Yixin,0.87,GBP,Food,bananas at tesco
20260612,Yixin,5.4,GBP,Food,macha latte at gails
20260612,Yixin,5.9,GBP,Food,hey tea`;

const state = {
  expenses: [],
  filters: {
    search: "",
    person: "all",
    category: "all",
  },
};

const elements = {
  grandTotal: document.querySelector("#grand-total"),
  expenseCount: document.querySelector("#expense-count"),
  peopleSummary: document.querySelector("#people-summary"),
  categorySummary: document.querySelector("#category-summary"),
  expenseTable: document.querySelector("#expense-table"),
  visibleCount: document.querySelector("#visible-count"),
  searchInput: document.querySelector("#search-input"),
  personFilter: document.querySelector("#person-filter"),
  categoryFilter: document.querySelector("#category-filter"),
  resetButton: document.querySelector("#reset-button"),
};

init();

async function init() {
  const csvText = await loadCsv();
  state.expenses = parseCsv(csvText);
  populateFilters();
  bindEvents();
  render();
}

async function loadCsv() {
  try {
    const response = await fetch("commen-expense.csv", { cache: "no-store" });
    if (!response.ok) throw new Error("CSV not available");
    return await response.text();
  } catch (error) {
    return embeddedCsv;
  }
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    render();
  });

  elements.personFilter.addEventListener("change", (event) => {
    state.filters.person = event.target.value;
    render();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });

  elements.resetButton.addEventListener("click", () => {
    state.filters = { search: "", person: "all", category: "all" };
    elements.searchInput.value = "";
    elements.personFilter.value = "all";
    elements.categoryFilter.value = "all";
    render();
  });
}

function render() {
  const visibleExpenses = getVisibleExpenses();
  const currencyOrder = unique(state.expenses.map((expense) => expense.currency));
  const allTotals = groupCurrencyTotals(state.expenses);
  const peopleTotals = groupNestedCurrencyTotals(state.expenses, "person");
  const categoryTotals = groupNestedCurrencyTotals(state.expenses, "category");
  const maxCategoryTotal = Math.max(
    0,
    ...Object.values(categoryTotals).map((totals) => sumValues(totals)),
  );

  elements.grandTotal.textContent = formatCurrencyTotals(allTotals, currencyOrder);
  elements.expenseCount.textContent = `${state.expenses.length} expenses recorded`;
  elements.visibleCount.textContent = `${visibleExpenses.length} shown`;

  renderPeople(peopleTotals, currencyOrder);
  renderCategories(categoryTotals, maxCategoryTotal, currencyOrder);
  renderTable(visibleExpenses);
}

function renderPeople(peopleTotals, currencyOrder) {
  elements.peopleSummary.innerHTML = Object.entries(peopleTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([person, totals]) => {
      const count = state.expenses.filter((expense) => expense.person === person).length;
      return `
        <article class="person-card">
          <div class="card-top">
            <span class="person-name">${escapeHtml(person)}</span>
            <span class="badge">${count} items</span>
          </div>
          <div class="person-total">${formatCurrencyTotals(totals, currencyOrder)}</div>
          <p class="person-meta">Paid by ${escapeHtml(person)}</p>
        </article>
      `;
    })
    .join("");
}

function renderCategories(categoryTotals, maxCategoryTotal, currencyOrder) {
  elements.categorySummary.innerHTML = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => sumValues(b) - sumValues(a))
    .map(([category, totals]) => {
      const width = maxCategoryTotal ? (sumValues(totals) / maxCategoryTotal) * 100 : 0;
      return `
        <div class="category-row">
          <span class="category-name">${escapeHtml(category)}</span>
          <div class="bar-track" aria-hidden="true">
            <div class="bar" style="width: ${width}%"></div>
          </div>
          <span class="category-total">${formatCurrencyTotals(totals, currencyOrder)}</span>
        </div>
      `;
    })
    .join("");
}

function renderTable(expenses) {
  if (!expenses.length) {
    elements.expenseTable.innerHTML = `<tr><td class="empty-state" colspan="5">No expenses match the current filters.</td></tr>`;
    return;
  }

  elements.expenseTable.innerHTML = expenses
    .map(
      (expense) => `
        <tr>
          <td>${formatDate(expense.date)}</td>
          <td>${escapeHtml(expense.person)}</td>
          <td><span class="type-pill">${escapeHtml(expense.category)}</span></td>
          <td class="amount-cell">${formatMoney(expense.amount, expense.currency)}</td>
          <td>${escapeHtml(expense.note)}</td>
        </tr>
      `,
    )
    .join("");
}

function populateFilters() {
  addOptions(elements.personFilter, unique(state.expenses.map((expense) => expense.person)));
  addOptions(elements.categoryFilter, unique(state.expenses.map((expense) => expense.category)));
}

function addOptions(select, values) {
  values.sort((a, b) => a.localeCompare(b)).forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getVisibleExpenses() {
  return state.expenses.filter((expense) => {
    const matchesPerson = state.filters.person === "all" || expense.person === state.filters.person;
    const matchesCategory = state.filters.category === "all" || expense.category === state.filters.category;
    const searchableText = `${expense.person} ${expense.category} ${expense.note}`.toLowerCase();
    const matchesSearch = !state.filters.search || searchableText.includes(state.filters.search);
    return matchesPerson && matchesCategory && matchesSearch;
  });
}

function parseCsv(csvText) {
  const rows = csvText
    .trim()
    .split(/\r?\n/)
    .map(parseCsvLine)
    .filter((row) => row.length >= 5);

  const hasHeader = rows[0]?.[0]?.toLowerCase() === "date";
  return rows.slice(hasHeader ? 1 : 0).map(([date, person, amount, currency, category, ...noteParts]) => ({
    date,
    person,
    amount: Number(amount),
    currency,
    category,
    note: noteParts.join(",").trim(),
  }));
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && quoted && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell.trim());
  return cells;
}

function groupCurrencyTotals(expenses) {
  return expenses.reduce((totals, expense) => {
    totals[expense.currency] = (totals[expense.currency] || 0) + expense.amount;
    return totals;
  }, {});
}

function groupNestedCurrencyTotals(expenses, key) {
  return expenses.reduce((groups, expense) => {
    groups[expense[key]] ||= {};
    groups[expense[key]][expense.currency] = (groups[expense[key]][expense.currency] || 0) + expense.amount;
    return groups;
  }, {});
}

function formatCurrencyTotals(totals, currencyOrder) {
  return currencyOrder
    .filter((currency) => totals[currency])
    .map((currency) => formatMoney(totals[currency], currency))
    .join(" + ");
}

function formatMoney(amount, currency) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(roundMoney(amount));
}

function formatDate(value) {
  if (!/^\d{8}$/.test(value)) return escapeHtml(value);
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function sumValues(values) {
  return Object.values(values).reduce((total, value) => total + value, 0);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
    return entities[char];
  });
}
