# 🚀 MentorHub Frontend - Production Ready Deploy

## 📌 Статус: ✅ ГОТОВО К РАЗВЕРТЫВАНИЮ

Все работы по подготовке frontend'а для production-ready deploy завершены.

---

## 📝 ЧТО БЫЛО СДЕЛАНО

### 1️⃣ Конфигурация и Environment (✅ 4 файла)
```
✅ .env.example              - Шаблон переменных окружения
✅ .env.production           - Production конфиг (VITE_API_BASE_URL)
✅ .env.development          - Dev конфиг
✅ src/shared/api/http.ts    - Обновлен на использование переменной окружения
```

### 2️⃣ Auth Flow - Унификация на Toast (✅ 5 страниц)
```
✅ src/pages/auth/LoginPage.vue
   → Удалены inline ошибки
   → Toast уведомления о успехе/ошибке
   
✅ src/pages/auth/RegisterPage.vue
   → Удалены inline сообщения
   → Toast на успех регистрации
   → Toast на ошибки валидации
   
✅ src/pages/auth/ForgotPasswordPage.vue
   → Toast на запрос кода
   
✅ src/pages/auth/ResetPasswordPage.vue
   → Toast на сброс пароля
   
✅ src/pages/auth/VerifyEmailPage.vue
   → Toast на верификацию email
   → Toast на повторную отправку кода
```

### 3️⃣ Profile Pages - Toast + Confirm на Delete (✅ 2 страницы)
```
✅ src/pages/student/StudentProfilePage.vue
   → Удалены inline сообщения об аватаре
   → Confirm dialog на удаление аватара
   → Toast на загрузку аватара
   → Toast на сохранение профиля
   
✅ src/pages/mentor/MentorProfilePage.vue
   → Удалены inline сообщения об аватаре
   → Confirm dialog на удаление аватара
   → Toast на загрузку аватара
   → Toast на сохранение профиля
```

### 4️⃣ Booking Flow - Toast + Confirm (✅ 3 страницы)
```
✅ src/pages/student/StudentBookingsPage.vue
   → Удалены inline сообщения о отзывах
   → Confirm на отмену записи
   → Toast на отправку отзыва
   
✅ src/pages/mentor/MentorBookingsPage.vue
   → Toast на изменение статуса
   → Confirm на отмену записи (CANCELLED_BY_MENTOR)
   → Разные сообщения для каждого действия
   
✅ src/pages/public/PublicMentorProfilePage.vue
   → Удалены inline сообщения о бронировании
   → Toast на успешное бронирование
   → Toast + redirect на auth ошибку
```

### 5️⃣ Slots Management - Toast (✅ 1 страница)
```
✅ src/pages/mentor/MentorSlotsPage.vue
   → Удалены inline сообщения
   → Toast на создание слота
   → Toast на обновление слота
   → Toast на деактивацию слота
   → Все ошибки через toast
```

### 6️⃣ Новые утилиты (✅ 1 файл)
```
✅ src/shared/composables/useErrorHandler.ts
   → Опциональный composable для централизованной обработки ошибок
```

---

## 🎯 ИТОГО ИЗМЕНЕНО

| Категория | Файлы | Статус |
|-----------|-------|--------|
| Config & Env | 4 | ✅ |
| Auth Pages | 5 | ✅ |
| Profile Pages | 2 | ✅ |
| Booking Pages | 3 | ✅ |
| Slots Pages | 1 | ✅ |
| Utilities | 1 | ✅ |
| **TOTAL** | **16 файлов** | **✅ READY** |

---

## 🚀 КАК РАЗВЕРНУТЬ

### Вариант 1: Через Deploy Script (РЕКОМЕНДУЕТСЯ)

**На Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh https://api.mentorhub.com
```

**На Windows:**
```bash
deploy.bat https://api.mentorhub.com
```

### Вариант 2: Ручное развертывание

```bash
# 1. Установить зависимости
npm install

# 2. Собрать проект
npm run build

# 3. Развернуть на Cloud Run
gcloud run deploy mentorhub-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars="VITE_API_BASE_URL=https://api.mentorhub.com" \
  --allow-unauthenticated
```

### Вариант 3: Docker для Cloud Run

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
docker build -t mentorhub-frontend .
gcloud run deploy mentorhub-frontend \
  --image mentorhub-frontend \
  --set-env-vars="VITE_API_BASE_URL=https://api.mentorhub.com"
```

---

## ✅ SMOKE TESTS ПЕРЕД DEPLOY

### 🔐 Auth Flow
- [ ] Register (Student) → Toast → Email page
- [ ] Register (Mentor) → Toast → Email page
- [ ] Verify Email → Success Toast → Login
- [ ] Login Valid → Success Toast → Profile
- [ ] Login Invalid → Error Toast (не inline)
- [ ] Forgot Password → Success Toast → Reset page
- [ ] Reset Password → Success Toast → Login

### 👤 Profile Pages
- [ ] Load profile → Все поля заполнены
- [ ] Upload avatar → Toast "Фото обновлено" → Avatar видна
- [ ] Delete avatar → Confirm dialog → Toast "Фото удалено"
- [ ] Save profile → Toast "Профиль обновлён"

### 📅 Student Bookings
- [ ] Load bookings → Список с статусами
- [ ] Cancel booking → Confirm dialog → Toast
- [ ] Submit review → Toast "Отзыв отправлен"

### 👨‍🏫 Mentor Features
- [ ] Create slot → Toast "Слот создан"
- [ ] Edit slot → Toast "Слот обновлён"
- [ ] Deactivate slot → Toast "Деактивирован"
- [ ] Confirm booking → Toast "Подтверждена"
- [ ] Cancel booking → Confirm → Toast

### 📱 Публичные страницы
- [ ] Mentor profile loads
- [ ] Mentor directory works
- [ ] Book slot (Auth) → Toast "Заявка отправлена"
- [ ] Book slot (No Auth) → Toast + Redirect

### 🔄 Error Handling
- [ ] Network error → Error toast
- [ ] Validation error → Error toast с деталями
- [ ] Auth error → Toast + Redirect
- [ ] Server error → Error toast

### 📱 Mobile (sm: 640px, md: 768px, lg: 1024px)
- [ ] Login/Register responsive
- [ ] Profile pages responsive
- [ ] Bookings responsive
- [ ] Toast видна на мобильном

---

## 📋 КЛЮЧЕВЫЕ ФАЙЛЫ ДЛЯ QA

### Тестирование Auth
- `src/pages/auth/LoginPage.vue` - Toast на ошибку/успех
- `src/pages/auth/RegisterPage.vue` - Toast на регистрацию
- `src/pages/auth/VerifyEmailPage.vue` - Toast на верификацию

### Тестирование Профилей
- `src/pages/student/StudentProfilePage.vue` - Avatar confirm + toast
- `src/pages/mentor/MentorProfilePage.vue` - Avatar confirm + toast

### Тестирование Бронирования
- `src/pages/student/StudentBookingsPage.vue` - Cancel confirm + toast
- `src/pages/mentor/MentorBookingsPage.vue` - Status confirm + toast
- `src/pages/public/PublicMentorProfilePage.vue` - Book slot + toast

### Система Toast
- `src/shared/ui/AppToastContainer.vue` - Отображение уведомлений
- `src/shared/lib/getApiErrorMessage.ts` - Store + error extraction

---

## 🔧 КОНФИГУРАЦИЯ

### Environment Variables
```
VITE_API_BASE_URL=https://api.mentorhub.com    # Backend URL
```

### API Endpoints
- `/api/auth/login` - Login
- `/api/auth/register/{role}` - Register
- `/api/auth/verify-email` - Verify
- `/api/auth/forgot-password` - Request reset
- `/api/auth/reset-password` - Reset password
- `/api/auth/resend-verification` - Resend code

### Локальное тестирование
```bash
# Dev сервер с .env.development
npm run dev

# Production build
npm run build
npx serve -s dist
```

---

## 🔍 ЧТО ПРОВЕРИТЬ ПОСЛЕ DEPLOY

1. **Network Tab в Chrome DevTools**
   - Все API запросы идут на правильный domain
   - VITE_API_BASE_URL применяется корректно

2. **Console для Errors**
   - Нет ошибок TypeScript
   - Нет ошибок при загрузке компонентов

3. **Toast System**
   - Success toast: зеленый, title "Успешно"
   - Error toast: красный, title "Ошибка"
   - Auto-close через 3.5 сек
   - Manual close (✕) работает

4. **Auth Tokens**
   - localStorage содержит accessToken, refreshToken, roles
   - Token передается в Authorization header

5. **Mobile на DevTools**
   - sm (375px) - форма стакуется
   - md (768px) - 2 колонки
   - lg (1024px) - полный layout

---

## 📞 TROUBLESHOOTING

### "Cannot find module" Error
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Fails
```bash
# Clear build cache
rm -rf dist
npm run build
```

### API не работает
```bash
# Проверить .env
cat .env.production

# Проверить VITE_API_BASE_URL
echo $VITE_API_BASE_URL

# Тест в DevTools Console
fetch('https://api.mentorhub.com/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({email: 'test@test.com', password: 'test123456'})
})
```

### Toast не появляется
1. Проверить что `<AppToastContainer />` в `App.vue`
2. Проверить что используется `toastStore.success()` или `toastStore.error()`
3. Проверить DevTools Console для ошибок

---

## 🎉 УСПЕХ!

Приложение полностью подготовлено для production deploy:

✅ Все сообщения об ошибках унифицированы в toast  
✅ Все опасные операции защищены confirm dialogs  
✅ API URL конфигурируется через environment  
✅ Mobile адаптация сохранена  
✅ Русский язык UI везде  
✅ Error handling на месте  
✅ Loading states корректны  

**Готово к развертыванию на Google Cloud Run! 🚀**

---

**Документация:**
- `PRODUCTION_READY.md` - Полный чеклист
- `DEPLOY_SUMMARY.md` - Краткое резюме
- `deploy.sh` / `deploy.bat` - Скрипты развертывания
- `README.md` - Основная документация проекта

