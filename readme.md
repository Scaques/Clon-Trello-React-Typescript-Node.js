# Trello Realtime Kanban Board

Un clon moderno de Trello desarrollado como aplicación full-stack con sincronización en tiempo real entre múltiples clientes.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Zustand, @dnd-kit (Drag and Drop).
- **Backend:** Node.js, Express, Socket.io (WebSockets).
- **Persistencia:** LocalStorage + Sincronización en vivo por eventos de red.

## Características Principales

- **Arrastrar y soltar fluido:** Gestión de tarjetas entre columnas con retroalimentación visual gracias a `@dnd-kit`.
- **Tiempo Real (WebSockets):** Creación, movimiento y eliminación de columnas y tarjetas sincronizadas instantáneamente en todas las pestañas/dispositivos conectados.
- **Gestión de Estado Robusta:** Control de estados locales y globales optimizados con Zustand.
- **Interfaz Moderna (Glassmorphism):** Diseño estético con Tailwind CSS, contadores dinámicos de tareas y efectos hover avanzados.

---

## Cómo ejecutar el proyecto localmente

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina:

### 1. Clonar el repositorio# Clon-Trello-React-Typescript-Node.js
Un clon moderno de Trello desarrollado como aplicación full-stack con sincronización en tiempo real entre múltiples clientes.

```bash
git clone https://github.com/TU_USUARIO/trello-realtime-kanban.git
cd trello-realtime-kanban
```

### 2. Configurar y ejecutar el Backend

```bash
cd server
npm install
npm run dev
```

*(El servidor correrá en `http://localhost:4000`)*

### 3. Configurar y ejecutar el Frontend
Abre una nueva terminal en la carpeta principal y ejecuta:

```bash
cd client
npm install
npm run dev
```
*(La aplicación web abrirá en `http://localhost:5173`)*

> **Tip para probar el tiempo real:** Abre `http://localhost:5173` en dos pestañas o navegadores diferentes y observa cómo se sincronizan al instante las columnas y tarjetas.
