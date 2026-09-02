import { Link, Route, Routes } from 'react-router-dom';
import { AdminNewTypePage } from './routes/admin-new-type';
import { AdminPage } from './routes/admin';
import { BookSlotPage } from './routes/book-slot';
import { BookTypePage } from './routes/book';
import { ConfirmPage } from './routes/confirm';
import { HomePage } from './routes/home';
import { SuccessPage } from './routes/success';

export default function App() {
  return (
    <>
      <header className="border-b px-6 py-4">
        <nav className="mx-auto flex max-w-4xl items-center gap-6 text-sm">
          <Link to="/" className="font-semibold">
            Календарь звонков
          </Link>
          <Link to="/book">Записаться</Link>
          <Link to="/admin">Админка</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookTypePage />} />
          <Route path="/book/:typeId" element={<BookSlotPage />} />
          <Route path="/book/:typeId/confirm" element={<ConfirmPage />} />
          <Route path="/book/:typeId/success" element={<SuccessPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/new-type" element={<AdminNewTypePage />} />
        </Routes>
      </main>
    </>
  );
}
