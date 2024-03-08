// seleção de elementos

const todoForm=document.querySelector("#todo-form");
const todoInput=document.querySelector("#todo-input");
const todoList=document.querySelector("#todo-list");
const editForm=document.querySelector("#edit-form");
const editInput=document.querySelector("#edit-input");
const cancelbutton=document.querySelector("#cancel-edite-btn");
const searchInput=document.querySelector("#search-input");
const eraseBt=document.querySelector("#erase-button");
const filterBtn=document.querySelector("#filter-select");

let OldInputValue;

//funçoes

const saveTodo =(text,done=0,save=1)=>{
    const todo=document.createElement("div")
    todo.classList.add('todo')

    const todoTitle=document.createElement("h3")
    todoTitle.innerText=text
    todo.appendChild(todoTitle)

    const doneBtn=document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML=`<i class="fa-solid fa-check"></i>`
    doneBtn.setAttribute("data-text","finish")

    todo.appendChild(doneBtn)


    const editBtn=document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML=`<i class="fa-solid fa-pen"></i>`
    editBtn.setAttribute("data-text","edit")

    todo.appendChild(editBtn)


    const deleteBtn=document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML=`<i class="fa-solid fa-xmark"></i>`
    deleteBtn.setAttribute("data-text","mark")

    todo.appendChild(deleteBtn)

    //utilizando dados LocalStorage

    if(done){
        todo.classList.add("done")

        updateTodoStatusLocalStorage(todoTitle)
    }

    if(save){
        saveTodoLocalStorage({text,done})
    }

    todoList.appendChild(todo)

    todoInput.value=""
    todoInput.focus()
   
}


const toggleForms =()=>{
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}


const updateTodo=(text)=>{
    const todos=document.querySelectorAll(".todo")

    todos.forEach(e=>{
        let todoTitle=e.querySelector("h3")
        console.log(todoTitle,text)

        if(todoTitle.innerText=== OldInputValue){
            todoTitle.innerText=text
        }
    })
}



const getSearchTodos=(search)=>{
   const todos = document.querySelectorAll(".todo")

    todos.forEach(e=>{
        let todoTitle=e.querySelector("h3").innerText.toLowerCase()

        const normalize=search.toLowerCase()

        e.style.display="flex"

        if(!todoTitle.includes(normalize)){
            e.style.display="none"
        }
       

    })
}


const filterTodos=(filterValue)=>{
    const todos = document.querySelectorAll(".todo")

    switch(filterValue){
        case"all":
        todos.forEach((todo)=>{
            todo.style.display="flex"
        })
        break
        case"done":
        todos.forEach((todo)=>todo.classList.contains("done")
        ?todo.style.display="flex" 
        :todo.style.display="none"
        )
        break
        case"todo":
        todos.forEach((todo)=>!todo.classList.contains("done")
        ?todo.style.display="flex" 
        :todo.style.display="none"
        )
        break
        default:break;
    }
}

//eventos


todoForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    const inputValue=todoInput.value
    if(inputValue){
        saveTodo(inputValue)
    }

})

document.addEventListener("click",(e)=>{
    const targetEl= e.target

    const parentEl=targetEl.closest("div")
    let todoTitle;

    if(parentEl  && parentEl.querySelector("h3")){
        todoTitle=parentEl.querySelector("h3").innerText
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done")

    }
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove()

        removeTodoLocalStorage(todoTitle)
    }
    if(targetEl.classList.contains("edit-todo")){
        toggleForms()
        
        editInput.value=todoTitle
        OldInputValue=todoTitle
    }
    
})



cancelbutton.addEventListener("click",(e)=>{
    e.preventDefault()

    toggleForms()
})



editForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    const editInputValue= editInput.value
    if(editInputValue){
        updateTodo(editInputValue)
    }
    toggleForms()
})



searchInput.addEventListener("keyup",(e)=>{
    const search=e.target.value

    getSearchTodos(search)
})

eraseBt.addEventListener("click",(e)=>{
    e.preventDefault()
    searchInput.value=""

    searchInput.dispatchEvent(new Event("keyup"))
})

filterBtn.addEventListener("change",(e)=>{

    const filterValue=e.target.value
    filterTodos(filterValue)
})

// local Storage

const getTodosLocalStorage=()=>{
    const todos=JSON.parse(localStorage.getItem("todos")) || []
    return todos
}

const loadTodos=()=>{
    const todos = getTodosLocalStorage()
    todos.forEach((todo)=>{
        saveTodo(todo.text,todo.done,0)
    })
}

const saveTodoLocalStorage=(todo)=>{

    const todos=getTodosLocalStorage()
    todos.push(todo)

    localStorage.setItem("todos", JSON.stringify(todos))

}

const removeTodoLocalStorage=(todoText)=>{
    const todos=getTodosLocalStorage()
    const filteredTodos=todos.filter((todo)=>todo.text !==todoText
    )

    localStorage.setItem('todos',JSON.stringify(filteredTodos))
}


const updateTodoStatusLocalStorage= (todoText)=>{
    const todos=getTodosLocalStorage()
    todos.map((todo)=>
    todo.text === todoText ? (todo.done= !todo.done) : null
    );

    localStorage.setItem('todos',JSON.stringify(todos))
}


loadTodos()