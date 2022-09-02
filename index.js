import {
    saveExpense,
    getExpenses,
    getIncomes,
    onGetExpenses,
    deleteExpense,
    editExpense,
    updateExpense,
    saveIncome,
    onGetIncomes,
    deleteIncome,
    editIncome,
    updateIncome,
    updateBalace,
    onLoginChange
} from './firebase.js'
const container = document.getElementById('Expense-container');
const containerIncome = document.getElementById('Income-container');
const newExpenseForm = document.getElementById('newExpense-form');
const newIncomeForm = document.getElementById('newIncome-form');

let editExpStatus = false;
let editIncStatus = true;
let id = '';
let loggedInUid = '';

window.addEventListener('DOMContentLoaded', async () => {
    //const querySnapshot = await getExpenses();
    onLoginChange(async (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            loggedInUid = user.uid;
            console.log('User sign in ', loggedInUid)
            const querySnapshot = await getExpenses();
            getAllExpenses(querySnapshot);
            const querySnapshotInc = await getIncomes();
            getAllIncomes(querySnapshotInc);

            updateBalace();
        } else {
            // User is signed out
            loggedInUid = '';
            console.log('User sign out')
            container.innerHTML = '<p>Please Login First</p>';
            containerIncome.innerHTML = '<p>Please Login First</p>';

        }
    });

    updateBalace();
    onGetExpenses((querySnapshot) => {
        if (loggedInUid != '') {
            let html = '<div class="row">'
            querySnapshot.forEach(doc => {
                //console.log(doc.data())
                const expense = doc.data();
                html += `
            <div class="col-md-3">
                <div class="card card-body mt-2 border-primary">
                    <h3 class="h5">${expense.title}</h3>
                    <p>EXPENSE</p>
                    <p>${expense.date}</p>
                    <p>${expense.description}</p>
                    <p>${expense.account}</p>
                    <p>${expense.quantity} ${expense.currency}</p>
                    <div class="display-flex">
                        <button class='btn btn-primary btn-delete' data-id='${doc.id}'>Delete</button>
                        <button class='btn btn-secondary btn-edit' data-id='${doc.id}'>Edit</button>
                    </div>
                </div>
            </div>
            `
            });
            html += '</div>'

            container.innerHTML = html;
            const btnsDelete = container.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                /*
                btn.addEventListener('click', (e) => {
                    console.log('Deleting', e.target.dataset.id);
                })
                */
                btn.addEventListener('click', ({ target: { dataset } }) => {
                    //console.log(dataset.id);
                    deleteExpense(dataset.id);
                })
            })
            const btnsEdit = container.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({ target: { dataset } }) => {
                    id = dataset.id;
                    const doc = await editExpense(dataset.id);
                    newExpenseForm['newExpense-title'].value = doc.data().title;
                    newExpenseForm['newExpense-description'].value = doc.data().description;
                    newExpenseForm['newExpense-date'].value = doc.data().date;
                    newExpenseForm['newExpense-account'].value = doc.data().account;
                    newExpenseForm['newExpense-quantity'].value = doc.data().quantity;
                    newExpenseForm['newExpense-currency'].value = doc.data().currency;

                    editExpStatus = true;
                    newExpenseForm['btn-newExpense-save'].innerText = 'Update';
                })
            });
        } else {
            container.innerHTML = '<p>Please Login First</p>';
        }

    });

    onGetIncomes((querySnapshot) => {
        if (loggedInUid != '') {
            let html = '<div class="row">'
            querySnapshot.forEach(doc => {
                const income = doc.data();
                html += `
            <div class="col-md-3">
                <div class="card card-body mt-2 border-primary">
                    <h3>${income.title}</h3>
                    <p>INCOME</p>
                    <p>${income.date}</p>
                    <p>${income.description}</p>
                    <p>${income.account}</p>
                    <p>${income.quantity} ${income.currency}</p>
                    <div>
                        <button class='btn btn-primary btn-delete' data-id='${doc.id}'>Delete</button>
                        <button class='btn btn-secondary btn-edit' data-id='${doc.id}'>Edit</button>
                    </div>
                </div>
            </div>
            `
            });
            html += '</div>'
            containerIncome.innerHTML = html;
            const btnsDelete = containerIncome.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', ({ target: { dataset } }) => {
                    deleteIncome(dataset.id);
                })
            })
            const btnsEdit = containerIncome.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async ({ target: { dataset } }) => {
                    id = dataset.id;
                    const doc = await editIncome(dataset.id);
                    newIncomeForm['newIncome-title'].value = doc.data().title;
                    newIncomeForm['newIncome-description'].value = doc.data().description;
                    newIncomeForm['newIncome-date'].value = doc.data().date;
                    newIncomeForm['newIncome-account'].value = doc.data().account;
                    newIncomeForm['newIncome-quantity'].value = doc.data().quantity;
                    newIncomeForm['newIncome-currency'].value = doc.data().currency;

                    editIncStatus = true;
                    newIncomeForm['btn-newIncome-save'].innerText = 'Update';


                })
            })
        } else {
            containerIncome.innerHTML = '<p>Please Login First</p>';
        }
    });


});

newExpenseForm.addEventListener('submit', e => {
    e.preventDefault();
    const newExpenseTitle = newExpenseForm['newExpense-title']
    const newExpenseDate = newExpenseForm['newExpense-date']
    const newExpenseDescription = newExpenseForm['newExpense-description']
    const newExpenseAccount = newExpenseForm['newExpense-account']
    const newExpenseQuantity = newExpenseForm['newExpense-quantity']
    const newExpenseCurrency = newExpenseForm['newExpense-currency']

    if (editExpStatus) {
        updateExpense(id, {
            title: newExpenseTitle.value,
            date: newExpenseDate.value,
            description: newExpenseDescription.value,
            account: newExpenseAccount.value,
            quantity: newExpenseQuantity.value,
            currency: newExpenseCurrency.value
        });
        updateBalace();
    } else {
        saveExpense(
            newExpenseTitle.value,
            newExpenseDate.value,
            newExpenseDescription.value,
            newExpenseAccount.value,
            newExpenseQuantity.value,
            newExpenseCurrency.value
        );
    }

    newExpenseForm.reset();
    editExpStatus = false;
    newExpenseForm['btn-newExpense-save'].innerText = 'Save';
});

newIncomeForm.addEventListener('submit', e => {
    e.preventDefault();
    const newIncomeTitle = newIncomeForm['newIncome-title']
    const newIncomeDate = newIncomeForm['newIncome-date']
    const newIncomeDescription = newIncomeForm['newIncome-description']
    const newIncomeAccount = newIncomeForm['newIncome-account']
    const newIncomeQuantity = newIncomeForm['newIncome-quantity']
    const newIncomeCurrency = newIncomeForm['newIncome-currency']

    if (editIncStatus) {
        updateIncome(id, {
            title: newIncomeTitle.value,
            date: newIncomeDate.value,
            description: newIncomeDescription.value,
            account: newIncomeAccount.value,
            quantity: newIncomeQuantity.value,
            currency: newIncomeCurrency.value
        });
        updateBalace();
    } else {
        saveIncome(
            newIncomeTitle.value,
            newIncomeDate.value,
            newIncomeDescription.value,
            newIncomeAccount.value,
            newIncomeQuantity.value,
            newIncomeCurrency.value
        );
    }

    newIncomeForm.reset();
    editIncStatus = false;
});

const getAllExpenses = (querySnapshot) => {
    if (loggedInUid != '') {
        let html = '<div class="row">'
        querySnapshot.forEach(doc => {
            //console.log(doc.data())
            const expense = doc.data();
            html += `
        <div class="col-md-3">
            <div class="card card-body mt-2 border-primary">
                <h3 class="h5">${expense.title}</h3>
                <p>EXPENSE</p>
                <p>${expense.date}</p>
                <p>${expense.description}</p>
                <p>${expense.account}</p>
                <p>${expense.quantity} ${expense.currency}</p>
                <div class="display-flex">
                    <button class='btn btn-primary btn-delete' data-id='${doc.id}'>Delete</button>
                    <button class='btn btn-secondary btn-edit' data-id='${doc.id}'>Edit</button>
                </div>
            </div>
        </div>
        `
        });
        html += '</div>'

        container.innerHTML = html;
        const btnsDelete = container.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            /*
            btn.addEventListener('click', (e) => {
                console.log('Deleting', e.target.dataset.id);
            })
            */
            btn.addEventListener('click', ({ target: { dataset } }) => {
                //console.log(dataset.id);
                deleteExpense(dataset.id);
            })
        })
        const btnsEdit = container.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async ({ target: { dataset } }) => {
                id = dataset.id;
                const doc = await editExpense(dataset.id);
                newExpenseForm['newExpense-title'].value = doc.data().title;
                newExpenseForm['newExpense-description'].value = doc.data().description;
                newExpenseForm['newExpense-date'].value = doc.data().date;
                newExpenseForm['newExpense-account'].value = doc.data().account;
                newExpenseForm['newExpense-quantity'].value = doc.data().quantity;
                newExpenseForm['newExpense-currency'].value = doc.data().currency;

                editExpStatus = true;
                newExpenseForm['btn-newExpense-save'].innerText = 'Update';
            })
        });
    } else {
        container.innerHTML = '<p>Please Login First</p>';
    }

}

const getAllIncomes = (querySnapshot) => {
    if (loggedInUid != '') {
        let html = '<div class="row">'
        querySnapshot.forEach(doc => {
            const income = doc.data();
            html += `
        <div class="col-md-3">
            <div class="card card-body mt-2 border-primary">
                <h3>${income.title}</h3>
                <p>INCOME</p>
                <p>${income.date}</p>
                <p>${income.description}</p>
                <p>${income.account}</p>
                <p>${income.quantity} ${income.currency}</p>
                <div>
                    <button class='btn btn-primary btn-delete' data-id='${doc.id}'>Delete</button>
                    <button class='btn btn-secondary btn-edit' data-id='${doc.id}'>Edit</button>
                </div>
            </div>
        </div>
        `
        });
        html += '</div>'
        containerIncome.innerHTML = html;
        const btnsDelete = containerIncome.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({ target: { dataset } }) => {
                deleteIncome(dataset.id);
            })
        })
        const btnsEdit = containerIncome.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async ({ target: { dataset } }) => {
                id = dataset.id;
                const doc = await editIncome(dataset.id);
                newIncomeForm['newIncome-title'].value = doc.data().title;
                newIncomeForm['newIncome-description'].value = doc.data().description;
                newIncomeForm['newIncome-date'].value = doc.data().date;
                newIncomeForm['newIncome-account'].value = doc.data().account;
                newIncomeForm['newIncome-quantity'].value = doc.data().quantity;
                newIncomeForm['newIncome-currency'].value = doc.data().currency;

                editIncStatus = true;
                newIncomeForm['btn-newIncome-save'].innerText = 'Update';


            })
        })
    } else {
        containerIncome.innerHTML = '<p>Please Login First</p>';
    }
}

/*

const divExp = document.getElementById('divExpenses');
const divInc = document.getElementById('divIncomes');
const tabExpensesBtn = document.getElementById('expenses-tab');
const tabIncomesBtn = document.getElementById('incomes-tab');

divInc.style.visibility = 'hidden';
divExp.style.visibility = 'visible';


tabExpensesBtn.addEventListener('click', e => {
    e.preventDefault();
    //console.log('CLICKED expenses');
    divInc.style.visibility = 'hidden';
    divExp.style.visibility = 'visible';
    tabIncomesBtn.classList.remove('active');
    tabExpensesBtn.classList.add('active');
});

tabIncomesBtn.addEventListener('click', e => {
    e.preventDefault();
    //console.log('CLICKED incomes');
    divInc.style.visibility = 'visible';
    divExp.style.visibility = 'hidden';
    tabIncomesBtn.classList.add('active');
    tabExpensesBtn.classList.remove('active');

});

*/
