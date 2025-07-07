# Tender-User-Interface

A modern, minimal React user interface powered by Vite, designed for rapid development and hot module replacement (HMR) out of the box. This project serves as a starting point for building performant web applications with React and Vite.

## Features

- **React + Vite**: Instant hot reload and lightning-fast dev server.
- **Modern Tooling**: ESLint pre-configured for React, including hooks and Fast Refresh support.
- **Custom Styling**: Minimal CSS provided with dark/light mode support.
- **Easy Debugging**: Visual Studio launch configuration and Vite server port pre-set.
- **Extensible**: Ideal for expansion into a larger production React app.

## Project Structure

```
Tender-User-Interface/
├── LICENSE.txt
├── README.md
└── tender-user-interface-react/
    ├── CHANGELOG.md
    ├── README.md
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        └── index.css
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Bread-Corp/Tender-User-Interface.git
    cd Tender-User-Interface/tender-user-interface-react
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:64005](http://localhost:64005) by default.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Usage

- Edit `src/App.jsx` to start customizing your UI.
- The main entry point is `src/main.jsx`.
- Styles can be changed in `src/App.css` and `src/index.css`.

## Customization

- Change the server port in `vite.config.js` as needed.
- ESLint configuration is in `eslint.config.js` for custom rules.

## License

This project is licensed under the [MIT License](../LICENSE.txt).

## Credits

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Bread-Corp](https://github.com/Bread-Corp)

---
