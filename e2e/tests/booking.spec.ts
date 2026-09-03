import { expect, test, type Page } from '@playwright/test';

// Завтрашний день по поясу сервиса: сетка заведомо полная (ни отсечки
// «прошедших», ни границы вчерашнего дня), «сегодня» в браузере не влияет.
function mskTomorrow(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(Date.now() + 86_400_000));
}

const DAY = mskTomorrow();
const slotRow = (page: Page, index: number) =>
  page.getByRole('button', { name: /^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/ }).nth(index);

async function openGrid(page: Page, typeId: string): Promise<void> {
  await page.goto(`/book/${typeId}?date=${DAY}`);
  await expect(page.getByText('Статус слотов')).toBeVisible();
  await expect(slotRow(page, 0)).toBeEnabled();
}

test.describe.serial('бронирование: полный путь гостя', () => {
  test('лендинг → каталог → тип → слот → форма → успех → админка; слот стал Занято', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Calendar' })).toBeVisible();
    await page.getByRole('main').getByRole('link', { name: 'Записаться' }).click();
    await expect(page.getByRole('heading', { name: 'Выберите тип события' })).toBeVisible();

    // путь через клик по карточке — как гость
    await page.getByText('Встреча 15 минут').first().click();
    await expect(page).toHaveURL(/\/book\/meet-15/);

    await openGrid(page, 'meet-15');
    await slotRow(page, 3).click();
    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page).toHaveURL(/\/confirm\?start=/);
    // инфо-панель: время выбранного слота (idx3 = 09:45–10:00) и посчитанный
    // сервером счётчик свободных — не «…» из незагруженного состояния
    await expect(page.getByText('09:45 - 10:00')).toBeVisible();
    await expect(page.getByText('Свободно', { exact: true }).locator('..')).toContainText(/\d+/);

    await page.getByPlaceholder('Имя').fill('Э2Е Гость');
    await page.getByPlaceholder('Email').fill('e2e@example.com');
    await page.getByPlaceholder('Заметки (необязательно)').fill('проверка');
    await page.getByRole('button', { name: 'Подтвердить запись' }).click();
    await expect(page.getByText('Бронь подтверждена. До встречи!')).toBeVisible();

    await page.goto('/admin');
    await expect(page.getByText('Э2Е Гость')).toBeVisible();
    await expect(page.getByText('e2e@example.com')).toBeVisible();

    // сетка после брони: тот же слот — Занято и недоступен
    await openGrid(page, 'meet-15');
    await expect(slotRow(page, 3)).toContainText('Занято');
    await expect(slotRow(page, 3)).toBeDisabled();
  });
});

test.describe.serial('конфликт при бронировании (E2)', () => {
  test('вторая вкладка, не видевшая бронь, получает 409 и ссылку на рефреш', async ({ browser }) => {
    const pageA = await browser.newPage();
    const pageB = await browser.newPage();
    await openGrid(pageA, 'meet-30');
    await openGrid(pageB, 'meet-30'); // idx5: 11:30–12:00 MSK — не пересекается с бронью первого теста (занятость по всему календарю)

    await slotRow(pageA, 5).click();
    await pageA.getByRole('button', { name: 'Продолжить' }).click();
    await slotRow(pageB, 5).click();
    await pageB.getByRole('button', { name: 'Продолжить' }).click();

    await pageA.getByPlaceholder('Имя').fill('Первый');
    await pageA.getByPlaceholder('Email').fill('first@example.com');
    await pageA.getByRole('button', { name: 'Подтвердить запись' }).click();
    await expect(pageA.getByText('Бронь подтверждена. До встречи!')).toBeVisible();

    await pageB.getByPlaceholder('Имя').fill('Второй');
    await pageB.getByPlaceholder('Email').fill('second@example.com');
    await pageB.getByRole('button', { name: 'Подтвердить запись' }).click();
    await expect(pageB.getByText('Слот уже занят')).toBeVisible();
    await expect(pageB.getByRole('link', { name: 'Обновить слоты' })).toBeVisible();

    // рефреш по ссылке: сетка открывается, слот уже Занято
    await pageB.getByRole('link', { name: 'Обновить слоты' }).click();
    await expect(pageB).toHaveURL(/\/book\/meet-30/);
    await expect(slotRow(pageB, 5)).toContainText('Занято');

    await pageA.close();
    await pageB.close();
  });
});

test.describe.serial('владелец: создание типа', () => {
  test('новый тип появляется в каталоге и даёт свою сетку', async ({ page }) => {
    await page.goto('/admin/new-type');
    await page.getByLabel(/Id/).fill('e2e-20');
    await page.getByLabel('Название').fill('E2E тип');
    await page.getByLabel(/Длительность/).fill('20');
    await page.getByRole('button', { name: 'Создать тип' }).click();

    await expect(page).toHaveURL(/\/book$/);
    await expect(page.getByText('E2E тип')).toBeVisible();

    await openGrid(page, 'e2e-20');
    // шаг 20 мин по рабочему окну 09:00–18:00 (константы backend/src/config.ts)
    const dayMinutes = 18 * 60 - 9 * 60;
    await expect(page.getByRole('button', { name: /^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}/ })).toHaveCount(Math.floor(dayMinutes / 20));
  });

  test('занятый id — 409 с человекочитаемой ошибкой', async ({ page }) => {
    await page.goto('/admin/new-type');
    await page.getByLabel(/Id/).fill('e2e-20');
    await page.getByLabel('Название').fill('Дубль');
    await page.getByLabel(/Длительность/).fill('20');
    await page.getByRole('button', { name: 'Создать тип' }).click();
    await expect(page.getByText(/id уже занят/)).toBeVisible();
  });
});

test.describe.serial('краевые проверки интерфейса', () => {
  test('несуществующий тип — человекочитаемая ошибка, не пустой экран', async ({ page }) => {
    await page.goto('/book/no-such-type');
    await expect(page.getByText('Тип события не найден')).toBeVisible();
  });

  test('повторный клик по «Подтвердить запись» не создаёт вторую бронь (E2, UI-защита)', async ({ page }) => {
    // задержка POST, чтобы поймать переход кнопки в disabled: без него
    // локальный ответ приходит раньше следующей кадpа и защита непроверяема
    await page.route('**/api/bookings', async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.continue();
    });
    await openGrid(page, 'meet-15');
    // idx 12 = 12:00–12:15 MSK — стык с бронью E2-сценария (11:30–12:00), стык не конфликт
    await slotRow(page, 12).click();
    await page.getByRole('button', { name: 'Продолжить' }).click();
    await page.getByPlaceholder('Имя').fill('Двойной');
    await page.getByPlaceholder('Email').fill('dbl@example.com');
    // локатор по типу кнопки: на время отправки текст меняется на «Отправка…»,
    // name-локатор в этот момент себя не находит
    const submit = page.locator('button[type=submit]');
    await submit.click();
    await expect(submit).toBeDisabled();
    await expect(submit).toContainText('Отправка');
    // второй клик по заблокированной кнопке не порождает отправку
    await submit.click({ force: true, noWaitAfter: true });
    await expect(page.getByText('Бронь подтверждена. До встречи!')).toBeVisible();
    await page.goto('/admin');
    await expect(page.getByText('Двойной')).toHaveCount(1);
  });
});
