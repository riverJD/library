
// Create a library of books


const addBookDisplay = document.querySelector('#book-modal-container');
const myLibrary = document.querySelector('#booklist');
const deleteConfirmScreen = document.querySelector('#delete-book-modal');
const resetConfirmScreen = document.querySelector('#reset-library-modal');


let library = [];

let stats = {
    totalPages: 0,
    pagesRead: 0,
    totalBooks: 0,
    booksRead: 0,
    authors: [],
    favAuthor: 'none',

    refresh: function(){
        console.log(this.authors);
       
        let statsBooks = document.querySelector('#stats-books');
        let statsBooksRead = document.querySelector('#stats-books-read');
        let statsPages = document.querySelector('#stats-pages');
        let statsPagesRead = document.querySelector('#stats-pages-read');

        statsBooks.textContent = this.totalBooks;
        statsBooksRead.textContent = this.booksRead;
        statsPages.textContent = this.totalPages;
        statsPagesRead.textContent = this.pagesRead;
    },

    favAuthor: function(){
        let tmp = [];
        
        

    }


}

// Create constructor for book

function Book(title, author, pages, type, hasRead) {
    this.title = title;
    this.author = author;
    this.pages = parseInt(pages);
    this.type = type;
    this.hasRead = hasRead;


}

function addBookToLibrary(book){
    
    // Tracking for stats display
    stats.totalBooks += 1;
    stats.totalPages += book.pages;
    if (book.hasRead){
        stats.pagesRead += book.pages;
        stats.booksRead += 1;
    } 
    stats.authors.push(book.author);
    stats.refresh();

    library.push(book);
}


function getBookIndexFromLibrary(book){
    return library.indexOf(book)
}


function removeBookFromLibrary(index){
    
    // Tracking for stats display
    stats.totalBooks -= 1;
    stats.totalPages -= parseInt(library[index].pages);
    if (library[index].hasRead){
        stats.pagesRead -= parseInt(library[index].pages);
        stats.booksRead -= 1;
    } 
    stats.authors.splice(`'${library[index].pages}'`, 1)
    stats.refresh(); 
    
    // Remove book from library array (DOMs already removed)
    library.splice(index, 1)

}

function clearLibrary(){
    
    /* while (myLibrary.firstChild) {
        myLibrary.removeChild(myLibrary.lastChild);
    } */
    resetConfirmScreen.style.display = 'none';
    const bookstoDelete = document.querySelectorAll('.book');
    bookstoDelete.forEach(book => book.remove());
    //library = [];
    
}



//////// Test books /////
const Fellowship = new Book("Fellowship of the Ring", "J.R.R. Tolkien", 423, "Fantasy", false);

const Dune = new Book("Dune", "Frank Herbert", 412, "Sci-fi", false);

const OryxCrake = new Book("Oryx and Crake", "Margaret Atwood", 400, "Sci-fi", true);

addBookToLibrary(Dune);
addBookToLibrary(OryxCrake);
addBookToLibrary(Fellowship);


// Display entire library, useful after clearing library or on page load
function displayLibrary(){

    let myLibrary = document.querySelector('#booklist');
    
    for (let book in library){
    
        displayBook(book);
    }

}

// Display book at newest library array index
function displayBook(libraryIndex)
{
    //libraryIndex == null ? book = (library.length - 1) : book = libraryIndex;
    
    if (libraryIndex == null) return console.warn('library index number required');

    book = libraryIndex;

    console.log("Book at index is " + book + ' ' + library[book].title);

    const story = document.createElement("li");
    setAttributes(story, {"class": `book`, "id": `book${book}`, "data-library-index": `${book}`});
    
    // Attach attributes
    story.appendChild(addAttributeToBook(library[book].title, 'h3'));
    
    const author = addAttributeToBook("Author: ", 'div');
    author.appendChild(addAttributeToBook(library[book].author, 'p'));
    story.appendChild(author);
    
    const pages = addAttributeToBook("Pages: ", 'div')
    pages.appendChild(addAttributeToBook(library[book].pages, 'p'))
    story.appendChild(pages);

    const type = addAttributeToBook("Genre: ", 'div');
    type.appendChild(addAttributeToBook(library[book].type, 'p'));
    story.appendChild(type);

    // Create container for 'Read' and 'Delete' buttons.
    const bookButtons = addAttributeToBook('Read?', 'div')
    setAttributes(bookButtons, {'class': `book-buttons }`})
   

    const hasRead = document.createElement('input');
    
    //adds headread class to book button if
    setAttributes(hasRead, {'type': 'button', 'class': `read-button ${(library[book].hasRead) && 'hasread'}`})
    hasRead.addEventListener('click', () => {
        const bookIndex = getParentWithClass(hasRead, 'book').getAttribute('data-library-index')
        setBookReadStatus(hasRead, !library[bookIndex].hasRead)
    });
    bookButtons.appendChild(hasRead);

    // Add a button to remove book from library
    const removeBtn = document.createElement("input");
    setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});  
    removeBtn.addEventListener('click', () => {
        deleteConfirmScreen.style.display = "flex";

        const deleteTitleText = document.querySelector('#book-to-delete')
        
        const index = story.getAttribute('data-library-index');
        deleteTitleText.textContent = library[index].title;
        
        deleteScreen.currentBook = story;
        
        
        //removeBookFromLibrary(getParentWithClass(removeBtn, 'book').getAttribute("data-library-index"))
    })
    bookButtons.appendChild(removeBtn);

    story.appendChild(bookButtons);

    myLibrary.appendChild(story);
}

// Toggles book readd status for card and stats
function setBookReadStatus(button, haveRead){
    
    const index = getParentWithClass(button, 'book').getAttribute('data-library-index')
    library[index].hasRead = haveRead;
   
    if (haveRead){
        console.log('have read')
        button.classList.add('hasread')
        stats.booksRead += 1;
        stats.pagesRead += library[index].pages;
     }
     else{
         console.log('havent read')
         button.classList.remove('hasread');
         stats.booksRead -= 1;
         stats.pagesRead -= library[index].pages;
    
        }
    stats.refresh();

}


displayLibrary();
stats.refresh();

/* function openDeleteScreen(book){
    function confirmDelete(book){
        console.log(book);
    }


}
*/


let deleteScreen = {
    
    currentBook: 'none',
    
    deleteBook(){
       

        console.log("deleting.. " + this.currentBook);
        
        this.currentBook.remove();
        removeBookFromLibrary(this.currentBook.getAttribute('data-library-index'));
        clearLibrary();
        displayLibrary();
    }
}

const confirmDeleteBook= document.querySelector('#confirm-delete');
confirmDeleteBook.addEventListener('click', () => {
    deleteConfirmScreen.style.display = 'none';
    deleteScreen.deleteBook();
})


const addBookPopUp = document.querySelector("#add-book");
    addBookPopUp.addEventListener("click", () => {

        addBookDisplay.style.display = "flex";
        myLibrary.style.opacity = ".25";
    });

const closeDeleteModal = document.querySelector('#cancel-delete');
closeDeleteModal.addEventListener('click', () => deleteConfirmScreen.style.display = "none");


const closeAddModal = document.querySelector('#exit-form');
closeAddModal.addEventListener('click', () => {
    addBookDisplay.style.display = 'none';
    myLibrary.style.opacity = "1.0";

})

const resetButtonPrompt = document.querySelector('#reset-library');
resetButtonPrompt.addEventListener('click', () => { resetConfirmScreen.style.display = "flex";

})

const resetButtonConfirm = document.querySelector('#confirm-reset');
resetButtonConfirm.addEventListener('click',() => clearLibrary());

const resetButtonCancel = document.querySelector('#cancel-reset');
resetButtonCancel.addEventListener('click', () => resetConfirmScreen.style.display = "none");


const addBook = document.querySelector('form');



// Create book from user input
addBook.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addBook);
    const title = formData.get('book_title')
    const author = formData.get('author_name')
    const type = formData.get('book_type')
    const pages = formData.get('page_count')
    const read = formData.get('has_read')
    

    addBookToLibrary(new Book(title, author, pages, type, read));
    addBook.reset();
    
    // need to subtract one from length for proper index
    displayBook(library.length - 1);
});
    


// Helper functions

// Add an element to target DOM (in this case a book attribute);
function addAttributeToBook(attributeType, targetElement, book){
    
    const attribute = document.createElement(`${targetElement}`);
    attribute.textContent = attributeType;  
    // Allow nesting if desired
    return attribute;

}

// Set multible attributes at once
function setAttributes(element, attributes)
{
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
    });
}

// Search through parents for a specific element and return the node
// with that class
function getParentWithClass(node, nodeClass){

    // Return if class not found in document
    if (node.tagName == 'HTML'){
        console.warn("No DOM with that class")
        return;
    }
    
    // return 
    if (node.parentNode.className == nodeClass) {
        return(node.parentNode);
    }

    return(getParentWithClass(node.parentNode, nodeClass));

}
