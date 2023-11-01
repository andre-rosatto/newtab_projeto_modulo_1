const STORAGE_NAME = 'transaction-history';

let data;

init();

function init() {
	loadData();
	updateList();
}

function saveData() {
	localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
}

function loadData() {
	data = JSON.parse(localStorage.getItem(STORAGE_NAME)) ?? [];
}

function updateList() {
	document.querySelector('table tbody').innerHTML = '';
	if (data.length > 0) {
		addRows();
	} else {
		addEmptyRow();
	}
	saveData();
}

function addRows() {
	const tableBody = document.querySelector('table tbody');
	for (const item of data) {
		tableBody.innerHTML += `
			<tr>
				<td>${item.transaction === 'buy' ? '+' : '-'}</td>
				<td>
					<p>${item.product}</p>
				</td>
				<td>${getFormattedValue(Math.abs(item.value))}</td>
			</tr>
		`;
	}
	const total = data.reduce((acc, item) => { return acc + item.value }, 0);
	let profitText = '';
	if (total > 0) {
		profitText = '[lucro]';
	} else if (total < 0) {
		profitText = '[prejuízo]';
	}
	document.querySelector('#total').innerHTML = `
		${getFormattedValue(Math.abs(total))}
		<span>
			${profitText};
		</span>
	`;
}

function addEmptyRow() {
	document.querySelector('table tbody').innerHTML = `
		<tr>
			<td></td>
			<td>
				<p>Nenhuma transação cadastrada.</p>
			</td>
			<td></td>
		</tr>
	`;
	document.querySelector('#total').innerHTML = getFormattedValue(0);
}

function getRawValue() {
	let value = document.querySelector('#value').value.match(/[0-9]+/g) ?? ['0'];
	value = value.join('');
	return parseFloat(value) / 100;
}

function getFormattedValue(val) {
	const formatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	});
	return formatter.format(val);
}

function onValueInput(e) {
	e.target.value = getFormattedValue(getRawValue());
}

function onAddClick(e) {
	e.preventDefault();
	const transctionType = document.querySelector('#transaction-type').value;
	const newItem = {
		transaction: transctionType,
		product: document.querySelector('#product-name').value,
		value: transctionType === 'buy' ? getRawValue() : -getRawValue()
	};
	data.push(newItem);
	updateList();
	clearForm();
}

function clearForm() {
	document.querySelector('#product-name').value = '';
	document.querySelector('#value').value = getFormattedValue(0);
}

function onClearClick() {
	if (!confirm('Limpar o extrato de transações?')) return;
	data = [];
	updateList();
}

function onMenuClick() {
	document.querySelector('nav').classList.remove('hidden');
}

function onNavClose() {
	document.querySelector('nav').classList.add('hidden');
}