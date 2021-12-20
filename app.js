import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-lite.js";

    const firebaseConfig = {
    apiKey: "AIzaSyAHmyYdODsiQpQ9Ne-xS0AkSrPy8Hq2lr0",
    authDomain: "ticktick-eabad.firebaseapp.com",
    databaseURL: "https://ticktick-eabad-default-rtdb.firebaseio.com",
    projectId: "ticktick-eabad",
    storageBucket: "ticktick-eabad.appspot.com",
    messagingSenderId: "1089833053177",
    appId: "1:1089833053177:web:465eb99ad07a0ec354eb28",
    measurementId: "G-QKXSE9BXEX"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    //filter obj
    const filters={
        searchText: '',
        hideCompleted: false
    }
    
    //get the text value entered by user
    $(".search-todos").on("input", ()=>{
        filters.searchText = $(".search-todos").val();
        createList(todos, filters);
    })


    //display list of todos in webpage
    const createList = function(todos, filters)
    {
        let count=0;
        //filtering todos list with the text entered by user
        const filteredTodos = $.grep(todos, element=>{
            return element.name.toLowerCase().includes(filters.searchText.toLowerCase());
        })
        //empty the todos div before displaying filtered todos
        $(".todos").empty();
        //display filtered todos list
        filteredTodos.forEach(element =>{
            let divElemment = $('<div class="form-check card singleTodo">');
            let buttonElement = $('<button class="btn btn-danger float-right">');
            let labelElement = $("<label>");
            let checkboxElemnt = $('<input type="checkbox" class="form-check-input"/>');
            let cardBody = $('<div class="card-body">');
            checkboxElemnt.attr("checked", element.done);
            checkboxElemnt.on("change", ()=>{
                toggleTodo(element);
            })
            labelElement.append(checkboxElemnt);
            buttonElement.text("X");
            buttonElement.on("click", ()=>{ 
                deleteElement(element);
            })
            labelElement.append("<div class='element-name' >"+"<span>"+element.name+"</span>"+"</div>");
            cardBody.append(labelElement);
            cardBody.append(buttonElement);
            divElemment.append(cardBody);
            $(".todos").append(divElemment);
            if(element.done == false){
                count++;
            }
        })
        $(".showCount").text("You have "+count+" tasks left");
    }

    const deleteElement = function(element){
        var docRef = doc(db, "todos", element.id);
        const del = deleteDoc(docRef)
        .then(()=>{
            console.log("Deleted Successfully!...");
            const todoIndex = todos.findIndex(todo=> todo.id===element.id);
            if(todoIndex!=-1)
            {
                todos.splice(todoIndex, 1);
                createList(todos, filters);
            };
        });
    }

    //const renderTodos = function(db){
        let  todos =[];
        const col = collection(db, "todos");
        const allDocs = await getDocs(col);
        allDocs.forEach(doc => {
            const singleTodo = doc.data();
            todos.push(singleTodo);
        });

        createList(todos, filters);
     //};
    

    $(".submit-todo").click((event)=>
    {
        event.preventDefault();
        const id = uuidv4();
        const newTodo ={
            name: $(".new-todo").val(),
            done: false,
            id: id
        };
        
        var ref = doc(db, "todos", id);
        const docRef = setDoc(ref, newTodo)
        .then(()=>{
            console.log("Added successfully!!...");
            $(".new-todo").val('');
        })
        .catch(error=>{
            console.log("error");
        });

        todos.push(newTodo);
        createList(todos, filters);
    });

    $(".hideCompleted").change(()=>{
      if($(".hideCompleted").prop("checked"))
      {
        hideCompleted(todos, filters);
      }  
      else
      {
        createList(todos, filters);
      }
    });

    const hideCompleted = function(todos, filters)
    {
        const filteredTodos = $.grep(todos, (element)=>{
            if(element.done == filters.hideCompleted){
                return element; 
            }          
        });

        createList(filteredTodos, filters);
    };

    const toggleTodo = function(element){
        let newTodo = {
            id : element.id,
            name : element.name,
            done : !element.done
        }
        var ref = doc(db, "todos", element.id);
        updateDoc(ref, newTodo).then(()=>{
            console.log("Updated successfully...");
            element.done = !element.done;
            createList(todos, filters);
        })
        .catch(error=>{
            console.log("Error occured...", error);
        });
    }