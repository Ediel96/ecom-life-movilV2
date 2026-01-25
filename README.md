# OrganizeLife - Expo App (TypeScript)

Aplicación de finanzas personales construida con **Expo**, **React Native**, **TypeScript**, **Redux Toolkit**, **NativeWind v4**, y **React Native Gifted Charts**.

## 🚀 Características

- ✅ **TypeScript** con tipado estricto
- ✅ **Expo SDK 52** con React Native 0.76.5
- ✅ **NativeWind v4** (Tailwind CSS para React Native)
- ✅ **Redux Toolkit** con persistencia (AsyncStorage)
- ✅ **React Navigation** (Bottom Tabs) con tipos
- ✅ **Axios** para llamadas HTTP
- ✅ **RTK Query** para manejo de API
- ✅ **React Native Gifted Charts** (PieChart, BarChart)
- ✅ **Tema Dark/Light** con color primario #00942A
- ✅ **Gestión de categorías y transacciones**
- ✅ **Hooks tipados** (useAppDispatch, useAppSelector)

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el proyecto:**
   ```bash
   npx expo start
   ```

3. **Ejecutar en dispositivo:**
   - Escanea el código QR con **Expo Go** (iOS/Android)
   - O presiona `i` para iOS Simulator
   - O presiona `a` para Android Emulator

## 📱 Estructura del Proyecto

```
OrganizeLifeExpoTS/
├── src/
│   ├── api/              # Axios y RTK Query
│   ├── components/       # Componentes reutilizables
│   ├── navigation/       # React Navigation
│   ├── screens/          # Pantallas principales
│   ├── store/            # Redux slices + hooks tipados
│   └── types/            # Interfaces y tipos TypeScript
├── App.tsx               # Punto de entrada
├── global.css            # Estilos de Tailwind
├── tsconfig.json         # Configuración de TypeScript
├── nativewind-env.d.ts   # Tipos de NativeWind
└── tailwind.config.js    # Configuración de NativeWind
```

## 🎨 Tema

El color primario es **#00942A** (verde) con variantes automáticas.
Cambia entre modo claro/oscuro desde la pantalla de Ajustes.

## 📊 Gráficos

Usa **react-native-gifted-charts** para visualizar:
- Distribución de gastos (PieChart)
- Gastos por categoría (BarChart)

## 🛠️ Tecnologías

- TypeScript 5.3+
- Expo 52
- React Native 0.76.5
- NativeWind v4
- Redux Toolkit
- React Navigation
- Axios
- React Native Gifted Charts

## 🔍 Type Checking

Para verificar los tipos:
```bash
npm run ts:check
```

---

Desarrollado con ❤️ usando Expo + TypeScript
