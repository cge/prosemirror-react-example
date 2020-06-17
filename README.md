# prosemirror-react-example &middot; [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) [![node](https://img.shields.io/badge/node-v12.17.0-green)](https://nodejs.org/dist/v12.17.0/) [![npm](https://img.shields.io/badge/npm-6.14.4-orange)](https://www.npmjs.com/package/npm/v/6.14.4) [![yarn](https://img.shields.io/badge/yarn-1.22.4-purple)](https://www.npmjs.com/package/yarn/v/1.22.4)

Project setup is based on https://github.com/react-workspaces/react-workspaces-playground

## Features

- ⚛️ Create React App 3 (React 16.12)
- 📖 Storybook 5
- 🐈 Yarn Workspaces
- 🐉 Lerna 3
- ✨ Host Multiple CRA Apps, Component Libraries & Storybooks in one Monorepo
- 🔥 Hot Reload all Apps, Components & Storybooks
- 👨‍🔬 Test all workspaces with Eslint & Jest using one command

## Usage

### Install all dependencies

In the project root, type `yarn`.

### Start App

```bash
cd packages/apps/app1
yarn start              # launches: http://localhost:3000/
```

### Start Storybook

```bash
cd packages/storybook
yarn storybook          # launches: http://localhost:9009/?path=/story/rte--with-value
```
