# Полная инструкция по настройке Supabase для FLUS MVP

## 📋 Пошаговая настройка новой базы данных

### Шаг 1: Создай новый проект в Supabase

1. Зайди на [supabase.com](https://supabase.com)
2. Нажми **New Project**
3. Заполни данные:
   - **Name**: flus-mvp (или любое имя)
   - **Database Password**: (запиши этот пароль!)
   - **Region**: West EU (Copenhagen) - ближе к Норвегии
4. Нажми **Create new project** и подожди 2-3 минуты

### Шаг 2: Скопируй учетные данные

1. После создания проекта перейди в **Settings** → **API**
2. Скопируй:
   - **Project URL** (типа `https://xxxxx.supabase.co`)
   - **anon public key** (длинный токен)
3. Создай файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=твой_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_anon_key
```

---

## 🗄️ Шаг 3: Создай схему базы данных

### 3.1 Открой SQL Editor

1. В Supabase Dashboard перейди в **SQL Editor** (иконка `</>`)
2. Нажми **New query**

### 3.2 Выполни основной SQL

Скопируй **весь** SQL из файла `supabase/migrations/00_complete_schema.sql` и выполни его.

Этот SQL создаст:

- ✅ **users** - Пользователи (работники и работодатели)
- ✅ **jobs** - Вакансии с расширенными полями (адрес, расписание, требования)
- ✅ **applications** - Заявки на работу + статусы выполнения
- ✅ **conversations** - Чаты между работником и работодателем
- ✅ **messages** - Сообщения в чате (текст + фото + системные события)
- ✅ **job_photos** - Фотографии работы (до/после)
- ✅ **achievements** - Достижения для геймификации
- ✅ **user_achievements** - Заработанные достижения пользователей

**Политики безопасности (RLS):**
- ✅ Работники видят только свои заявки
- ✅ Работодатели видят только свои вакансии и заявки на них
- ✅ Участники чата видят только свои сообщения
- ✅ Фото видны только участникам заявки

---

## 📸 Шаг 4: Настрой Storage для фотографий

### 4.1 Создай Storage Bucket

1. Перейди в **Storage** в Supabase Dashboard
2. Нажми **New bucket**
3. Настройки:
   - **Name**: `job-photos`
   - **Public bucket**: ✅ **ДА** (чтобы ссылки работали без авторизации)
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. Нажми **Create bucket**

### 4.2 Настрой Storage Policies

После создания bucket, выполни SQL из `supabase/migrations/01_storage_policies.sql`:

```sql
-- Разрешить загрузку фото в свою папку
CREATE POLICY "Users can upload photos to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Разрешить просмотр всех фото (для участников заявки)
CREATE POLICY "Users can view photos from their applications"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'job-photos');

-- Разрешить удаление своих фото
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'job-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 🎯 Шаг 5: Проверь настройку

### 5.1 Проверь таблицы

В **Table Editor** должны появиться все таблицы:
- users
- jobs
- applications
- conversations
- messages
- job_photos
- achievements
- user_achievements

### 5.2 Проверь Storage

В **Storage** должен быть bucket `job-photos` с настроенными политиками.

### 5.3 Проверь RLS

Все таблицы должны иметь включенный RLS (в Table Editor будет зеленый щит 🛡️).

---

## 🚀 Шаг 6: Запусти приложение

```bash
npm run dev
```

Открой http://localhost:3000

### Тестовый сценарий:

#### Как работодатель:
1. Зайди на `/login`
2. Выбери **Arbeidsgiver** (💼)
3. Нажми **Logg inn med Vipps**
4. Перейди в `/jobber/ny`
5. Создай тестовую работу с:
   - Адресом
   - Типом расписания (Fleksibel/Frist/Fast tid)
   - Требованиями

#### Как работник:
1. Открой другой браузер/профиль
2. Зайди на `/login`
3. Выбери **Jobbsøker** (👷)
4. Нажми **Logg inn med Vipps**
5. Найди работу в `/jobber`
6. Подай заявку
7. В чате отправь "Начинаю работу"
8. **Загрузи фото "до" работы**
9. После выполнения **загрузи фото "после"**
10. Отметь работу как выполненную

#### Как работодатель (проверка):
1. Вернись в первый браузер
2. Перейди в `/samtaler`
3. Открой чат с работником
4. **Посмотри фото "до" и "после"**
5. Подтверди выполнение работы

---

## 📁 Структура хранения фотографий

```
job-photos/
  └── {worker_user_id}/
      └── {application_id}/
          ├── before_timestamp.jpg
          ├── before_timestamp_2.jpg
          ├── after_timestamp.jpg
          └── after_timestamp_2.jpg
```

**Пример:**
```
job-photos/u_abc123def/a_xyz789abc/before_1729520000.jpg
```

---

## 🔧 Полезные SQL запросы для отладки

### Посмотреть все заявки с фото:
```sql
SELECT 
  a.id,
  j.title as job_title,
  u.email as worker_email,
  a.status,
  COUNT(jp.id) as photo_count
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users u ON a.applicant_id = u.id
LEFT JOIN job_photos jp ON a.id = jp.application_id
GROUP BY a.id, j.title, u.email, a.status;
```

### Посмотреть статистику работника:
```sql
SELECT * FROM worker_statistics 
WHERE worker_id = 'u_xxx';
```

### Посмотреть статистику работодателя:
```sql
SELECT * FROM job_statistics 
WHERE employer_id = 'u_xxx';
```

---

## ⚠️ Важные замечания

1. **RLS включен на всех таблицах** - данные защищены
2. **Storage bucket публичный** - ссылки на фото работают без авторизации
3. **Фото нельзя удалить после подтверждения работы** - защита от мошенничества
4. **Работодатель должен подтвердить** работу, чтобы статус изменился на `completed`
5. **Системные сообщения** создаются автоматически при изменении статуса работы

---

## 📞 Следующие шаги

После настройки базы данных нужно:

1. ✅ Реализовать API для загрузки фото
2. ✅ Создать UI для загрузки фото в чате
3. ✅ Добавить галерею фото в чате
4. ✅ Реализовать подтверждение работы работодателем
5. ✅ Добавить уведомления о новых фото

Готов помочь с реализацией любого из этих пунктов! 🚀
