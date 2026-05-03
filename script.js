let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let filter = 'All';

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function show() {
    let ul = document.getElementById('list');
    ul.innerHTML = '';
    
    let filtered = [];
    if(filter == 'All') filtered = tasks;
    else if(filter == 'Active') filtered = tasks.filter(t => !t.completed);
    else if(filter == 'Completed') filtered = tasks.filter(t => t.completed);
    
    for(let i = 0; i < filtered.length; i++) {
        let t = filtered[i];
        let li = document.createElement('li');
        if(t.completed) li.className = 'completed';
        
        let cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = t.completed;
        cb.onclick = () => {
            t.completed = !t.completed;
            save();
            show();
        };
        
        let span = document.createElement('span');
        span.innerText = t.text;
        
        let edit = document.createElement('button');
        edit.innerText = 'Редактировать';
        edit.onclick = () => editTask(tasks.indexOf(t));
        
        let del = document.createElement('button');
        del.innerText = 'Удалить';
        del.onclick = () => {
            tasks.splice(tasks.indexOf(t), 1);
            save();
            show();
        };
        
        li.appendChild(cb);
        li.appendChild(span);
        li.appendChild(edit);
        li.appendChild(del);
        ul.appendChild(li);
    }
    
    let btns = document.querySelectorAll('.filter-btn');
    for(let i = 0; i < btns.length; i++) {
        if(btns[i].innerText == filter) btns[i].style.outline = '2px solid blue';
        else btns[i].style.outline = 'none';
    }
}

function editTask(idx) {
    let task = tasks[idx];
    let ul = document.getElementById('list');
    
    let filtered = [];
    if(filter == 'All') filtered = tasks;
    else if(filter == 'Active') filtered = tasks.filter(t => !t.completed);
    else if(filter == 'Completed') filtered = tasks.filter(t => t.completed);
    
    let pos = filtered.indexOf(task);
    let li = ul.children[pos];
    
    let inp = document.createElement('input');
    inp.type = 'text';
    inp.value = task.text;
    
    let btn = document.createElement('button');
    btn.innerText = 'Сохранить';
    
    let cancel = document.createElement('button');
    cancel.innerText = 'Отмена';
    
    li.innerHTML = '';
    li.appendChild(inp);
    li.appendChild(btn);
    li.appendChild(cancel);
    inp.focus();
    
    function saveEdit() {
        let newText = inp.value.trim();
        if(!newText) {
            alert('Не может быть пустым');
            return;
        }
        task.text = newText;
        save();
        show();
    }
    
    btn.onclick = saveEdit;
    cancel.onclick = () => show();
    inp.onkeypress = (e) => {
        if(e.key === 'Enter') saveEdit();
        if(e.key === 'Escape') show();
    };
}

function addTask() {
    let inp = document.getElementById('inp');
    let txt = inp.value.trim();
    if(!txt) {
        alert('Введи задачу');
        return;
    }
    tasks.push({text: txt, completed: false});
    inp.value = '';
    save();
    show();
}

// фильтры
let filterDiv = document.createElement('div');
filterDiv.style.margin = '10px 0';

let allBtn = document.createElement('button');
allBtn.innerText = 'All';
allBtn.className = 'filter-btn';
allBtn.onclick = () => { filter = 'All'; show(); };

let activeBtn = document.createElement('button');
activeBtn.innerText = 'Active';
activeBtn.className = 'filter-btn';
activeBtn.onclick = () => { filter = 'Active'; show(); };

let compBtn = document.createElement('button');
compBtn.innerText = 'Completed';
compBtn.className = 'filter-btn';
compBtn.onclick = () => { filter = 'Completed'; show(); };

filterDiv.appendChild(allBtn);
filterDiv.appendChild(activeBtn);
filterDiv.appendChild(compBtn);

let list = document.getElementById('list');
list.parentNode.insertBefore(filterDiv, list);

document.getElementById('add').onclick = addTask;
document.getElementById('inp').onkeypress = (e) => { if(e.key === 'Enter') addTask(); };

show();