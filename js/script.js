// Обрано React, бо компоненти — це звичайні функції з props, а стан через useState легко відстежувати в DevTools.

// Крок 7: ручний DOM-код з практикуму 7 (renderBooks, handleSubmit, handleAuthorInput,
// showMessage, showLoading, querySelector-константи, видалення placeholders)
// видалено, бо його замінено компонентами BookRow і App та рендером через map().

const { useState, useEffect } = React;
const API_URL = 'https://openlibrary.org/search.json';

// Крок 4: дочірній компонент. Дані тільки через props, без глобальних змінних.
function BookRow({ id, title, author, pages, status, toggleStatus }) {
  const isDone = status === 'done';
  return (
    <article className={isDone ? '' : 'unread'}>
      <h3>{title}</h3>
      <p>Автор: {author}</p>
      <p>Сторінок: {pages}</p>
      {/* Крок 6: клік по позначці лише повідомляє батька через callback-prop */}
      <span
        className={`book-status ${isDone ? 'book-status--done' : 'book-status--reading'}`}
        onClick={() => toggleStatus(id)}
        style={{ cursor: 'pointer' }}
        title="Натисніть, щоб змінити статус"
      >
        {isDone ? 'Прочитано' : 'Читаю'}
      </span>
    </article>
  );
}

function App() {
  // Крок 3: дані в реактивному стані; кожна книга має унікальний id
  const [books, setBooks] = useState([
    { id: 1, title: 'Маленький принц', author: 'Антуан де Сент-Екзюпері', pages: 76, status: 'done' },
    { id: 2, title: 'На західному фронті без змін', author: 'Еріх Марія Ремарк', pages: 240, status: 'done' },
    { id: 3, title: '1984', author: 'Джордж Орвелл', pages: 328, status: 'reading' },
    { id: 4, title: 'Кобзар', author: 'Тарас Шевченко', pages: 210, status: 'done' },
    { id: 5, title: 'Гаррі Поттер і філософський камінь', author: 'Джоан Роулінг', pages: 320, status: 'reading' },
    { id: 6, title: 'Тіні забутих предків', author: 'Михайло Коцюбинський', pages: 96, status: 'reading' },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('Маленький Принц');

  // поля форми
  const [form, setForm] = useState({ title: '', author: '', pages: '', status: 'reading' });

  // Крок 6: батько оновлює стан новим масивом, без мутації
  function toggleStatus(id) {
    setBooks(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === 'done' ? 'reading' : 'done' } : b
    ));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      title: form.title.trim(),
      author: form.author.trim(),
      pages: Number(form.pages),
      status: form.status,
    };
    setBooks(prev => [...prev, newBook]);
    setForm({ title: '', author: '', pages: '', status: 'reading' });
  }

  function handleField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function loadBooks(query) {
    setLastQuery(query);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`Сервер відповів кодом ${response.status}`);
      const data = await response.json();
      if (data.docs.length === 0) {
        setMessage('За запитом нічого не знайдено');
        setBooks([]);
        return;
      }
      setMessage('');
      setBooks(data.docs.slice(0, 10).map(doc => ({
        id: doc.key,                                   // унікальний ключ з API
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(', ') : 'Невідомий автор',
        pages: doc.number_of_pages_median ?? '—',
        status: 'reading',
      })));
    } catch (error) {
      setMessage('Не вдалося завантажити дані. Спробуйте пізніше.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Якщо хочете спочатку бачити свої 6 книг, приберіть цей виклик
  useEffect(() => { loadBooks(lastQuery); }, []);

  // Лічильники обчислюємо зі стану, а не зберігаємо окремо
  const finishedTotal = books.filter(b => b.status === 'done').length;

  return (
    <>
      <main>
        <section>
          <h2>Додати книгу</h2>
          <form id="book-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Назва книги:</label>
            <input type="text" id="title" name="title" required value={form.title} onChange={handleField} />

            <label htmlFor="author">Автор:</label>
            <input type="text" id="author" name="author" required pattern="[^0-9]+"
                   title="Ім'я автора не повинно містити цифр"
                   value={form.author} onChange={handleField} />

            <label htmlFor="pages">Кількість сторінок:</label>
            <input type="number" id="pages" name="pages" required min="1" value={form.pages} onChange={handleField} />

            <label htmlFor="status">Статус:</label>
            <select id="status" name="status" value={form.status} onChange={handleField}>
              <option value="reading">Читаю</option>
              <option value="done">Прочитано</option>
            </select>

            <button type="submit">Додати книгу</button>
          </form>
        </section>

        <section>
          <h2>Мої книги</h2>
          <button type="button" onClick={() => loadBooks(lastQuery)}>Оновити</button>
          <p>{message}</p>
          {loading && <p>Завантаження…</p>}

          <div className="cards">
            {/* Крок 5: map() з key за унікальним id */}
            {books.map(book => (
              <BookRow
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                pages={book.pages}
                status={book.status}
                toggleStatus={toggleStatus}
              />
            ))}
          </div>
        </section>
      </main>

      <aside>
        <h2>Статистика читання</h2>
        <p>Всього книг: {books.length}</p>
        <p>Прочитано: {finishedTotal}</p>
        <p>У процесі: {books.length - finishedTotal}</p>
      </aside>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);