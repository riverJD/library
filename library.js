class Library{

    constructor(){
        this.library = [];
    }

    // Methods
    
    addBookToLibrary = (book) => {
    
        // Update stats
        stats.totalBooks += 1;
        stats.totalPages += book.pages;
        if (book.hasRead){
            stats.pagesRead += book.pages;
            stats.booksRead += 1;
        } 
        stats.addAuthor(book.author);
        stats.refresh();
        
        this.library.push(book);
    }
    
    removeBookFromLibrary = (index) => {
    
        // Update stats
        stats.totalBooks -= 1;
        stats.totalPages -= parseInt(this.library[index].pages);
        if (this.library[index].hasRead){
            stats.pagesRead -= parseInt(this.library[index].pages);
            stats.booksRead -= 1;
        } 
        stats.authors.splice(`'${this.library[index].pages}'`, 1)
        stats.refresh(); 
        
        // Remove book from library array
        this.library.splice(index, 1)
    }

    // Clear library array and DOMs to prepare for screen refresh
    // runs on every book deletion
    clearLibrary = () => {
    
        resetConfirmScreen.style.display = 'none';
        const bookstoDelete = document.querySelectorAll('.book');
        bookstoDelete.forEach(book => book.remove());
        
    }
    
    // Display entire library, after clear or page load
    displayLibrary = () => {
              
        for (let book in this.library){
            this.displayBook(book);
        }
    
    }
    // Display book at last library array index
    displayBook = (libraryIndex) => {
    
    if (libraryIndex == null) return console.warn('library index number required');

    let book = libraryIndex;

    // Create a book container
    const story = document.createElement("li");
    helpers.setAttributes(story, {"class": `book`, "id": `book${book}`, "data-library-index": `${book}`});

    // Attach attributes to display
    story.appendChild(helpers.addAttributeToBook(this.library[book].title, 'h3'));
    
    const author = helpers.addAttributeToBook("Author: ", 'div');
    author.appendChild(helpers.addAttributeToBook(this.library[book].author, 'p'));
    story.appendChild(author);
    
    const pages = helpers.addAttributeToBook("Pages: ", 'div')
    pages.appendChild(helpers.addAttributeToBook(this.library[book].pages, 'p'))
    story.appendChild(pages);

    const type = helpers.addAttributeToBook("Genre: ", 'div');
    type.appendChild(helpers.addAttributeToBook(this.library[book].type, 'p'));
    story.appendChild(type);

    // Create container for 'Read' and 'Delete' buttons
    const bookButtons = helpers.addAttributeToBook('Read?', 'div')
    helpers.setAttributes(bookButtons, {'class': `book-buttons }`})
    
    // Create read book toggle
    const hasRead = document.createElement('input');
    helpers.setAttributes(hasRead, {'type': 'button', 'class': `read-button ${(this.library[book].hasRead) && 'hasread'}`})
    hasRead.addEventListener('click', () => {
        const bookIndex = helpers.getParentWithClass(hasRead, 'book').getAttribute('data-library-index')

        // Flips read status on click
        this.setBookReadStatus(hasRead, !(this.library[bookIndex].hasRead))
    });
    bookButtons.appendChild(hasRead);

    // Create remove book popup
    const removeBtn = document.createElement("input");
    helpers.setAttributes(removeBtn, {"type": "image", "src": "./img/icons/delete.svg", "alt": "Remove book",  "class": `remove-button`, "id": `remove-book${book}`});  
    removeBtn.addEventListener('click', () => {
       
        deleteScreen.currentBook = story;  
        deleteConfirmScreen.style.display = "flex";
 
        const deleteTitleText = document.querySelector('#book-to-delete') 
        const index = story.getAttribute('data-library-index');  
        deleteTitleText.textContent = this.library[index].title;           
    })
    
    bookButtons.appendChild(removeBtn);
    story.appendChild(bookButtons);
    myLibrary.appendChild(story);
}
    // Toggles book read status for book card
    setBookReadStatus = (button, haveRead) => {
    
    const index = helpers.getParentWithClass(button, 'book').getAttribute('data-library-index')
    this.library[index].hasRead = haveRead;
   
    if (haveRead){
        button.classList.add('hasread')
        stats.booksRead += 1;
        stats.pagesRead += this.library[index].pages;
     }
     else{
         button.classList.remove('hasread');
         stats.booksRead -= 1;
         stats.pagesRead -= this.library[index].pages;
    
        }
    stats.refresh();
}

}

// References for repeated use
const addBookDisplay = document.querySelector('#book-modal-container');
const myLibrary = document.querySelector('#booklist');
const deleteConfirmScreen = document.querySelector('#delete-book-modal');
const resetConfirmScreen = document.querySelector('#reset-library-modal');


// Track and update stats for header table on webpage
class stats{

    constructor(){
        this.totalPages = 0;
        this.pagesRead = 0;
        this.totalBooks = 0;
        this.booksRead = 0;
        this.authors = [];
        this.favAuthor = 'none';
       }

       refresh = () => {
        let statsBooks = document.querySelector('#stats-books');
        let statsBooksRead = document.querySelector('#stats-books-read');
        let statsPages = document.querySelector('#stats-pages');
        let statsPagesRead = document.querySelector('#stats-pages-read');

        statsBooks.textContent = this.totalBooks;
        statsBooksRead.textContent = this.booksRead;
        statsPages.textContent = this.totalPages;
        statsPagesRead.textContent = this.pagesRead;
       }

       addAuthor = (author) => {
            this.authors.push(author);
       }

       reset = () => {
            this.totalPages = 0;
            this.pagesRead = 0;
            this.totalBooks = 0;
            this.booksRead = 0;
            this.authors = []

       }

}
// Class constructor for book
class Book{
    
    constructor(title, author, pages, type, hasRead){
        this.title = title;
        this.author = author;
        this.pages = parseInt(pages);
        this.type = type;
        this.hasRead = hasRead
    }
}
// Some helper methods
class Helpers{

    // Add an element to target DOM (in this case a book attribute);
    addAttributeToBook = (attributeType, targetElement, book) => {
        
        const attribute = document.createElement(`${targetElement}`);
        attribute.textContent = attributeType;  
        // Allow nesting if desired
        return attribute;
    }
    
    // Set multible attributes at once
    setAttributes = (element, attributes) => {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value)
        });
    }
    
    // Recursively search through parents for a specific DOM with specified class
    getParentWithClass = (node, nodeClass) => {
    
        // Return if class not found in document
        if (node.tagName == 'HTML'){
            console.warn("No DOM with that class")
            return;
        }
        if (node.parentNode.className == nodeClass) {
            return(node.parentNode);
        }
        return(this.getParentWithClass(node.parentNode, nodeClass));
    }
    
    }
    
const listeners = (() => {
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
    resetButtonConfirm.addEventListener('click',() => {
        stats.reset();
        stats.refresh();
        Library.clearLibrary();
        Library.library = [];
    });
    const resetButtonCancel = document.querySelector('#cancel-reset');
    resetButtonCancel.addEventListener('click', () => resetConfirmScreen.style.display = "none");
    /////
    
    // Create book from user input
    const addBook = document.querySelector('form');
    addBook.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(addBook);
        const title = formData.get('book_title')
        const author = formData.get('author_name')
        const type = formData.get('book_type')
        const pages = formData.get('page_count')
        const read = formData.get('has_read')
        
        Library.addBookToLibrary(new Book(title, author, pages, type, read));
        addBook.reset();
        
        // Need to subtract 1 from library.length for proper indexing
        Library.displayBook(Library.library.length - 1);
    });
})();

Library = new Library();
stats = new stats();

//////// Test books ///////////////////////////////
const Fellowship = new Book("Fellowship of the Ring", "J.R.R. Tolkien", 423, "Fantasy", false);
const OryxCrake = new Book("Oryx and Crake", "Margaret Atwood", 400, "Sci-fi", true);
Library.addBookToLibrary(OryxCrake);
Library.addBookToLibrary(Fellowship);
/////////////////////////////////////////////////////


// Using object to attach book marked for deletion for deletion prompt
// First button will store book in this object, second button will call deleteBook method on it
let deleteScreen = {

    currentBook: 'none',

    deleteBook(){
        this.currentBook.remove();
        Library.removeBookFromLibrary(this.currentBook.getAttribute('data-library-index'));
        Library.clearLibrary();
        Library.displayLibrary();
    }
}

helpers = new Helpers();

Library.displayLibrary();
stats.refresh();