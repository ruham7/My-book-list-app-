//Book class: represents a book ; everytime a book is created it instantiates the book object
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class: handles UI tasks; 
class UI{
    static displayBooks(){
      
        const books = Store.getBooks();

        books.forEach((book)=>UI.addBookToList(book));
    }
   static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class= "btn btn-danger btn-sm delete">X</a></td>
            `;  
            list.appendChild(row);
   }
   static deleteBook(el){
    if(el.classList.contains('delete')){
        el.parentElement.parentElement.remove();
    }
   }
   static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form);
    // set self-destruct timer
    setTimeout(() =>       
    document.querySelector('.alert').remove(), 3000);

   }
   static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';

   }
}




//Store class: handles storage (in this case local storage)
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books =[]
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}




//Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)


//Event: Add books
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
//validate
if(title === ''||  author ===''|| isbn === ''){
    UI.showAlert('Please fill in all fields', 'danger');
} else {
    //instantiate book
    const book = new Book(title, author, isbn);
    // add book to UI
    UI.addBookToList(book);
    // add book to Store(local storage)
    Store.addBook(book);
    // add success message
    UI.showAlert('Book added successfully', 'success')
    // clear fields after a book is added
    UI.clearFields();}  
});



//Event: remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>
{
    // remove book from UI
    UI.deleteBook(e.target);
    UI.showAlert('Book deleted', 'success');
    //remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})